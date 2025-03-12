import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { newDataProcessGroupCUType, processGroupCUType, processGroupRType, processRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AddContents from "@/contents/base/wk/process/group/AddContents";
import CustomTree from "@/components/Tree/CustomTree";
import { patchAPI } from "@/api/patch";
import useToast from "@/utils/useToast";
import { CUtreeType, treeType } from "@/data/type/componentStyles";
import { onTreeAdd, onTreeDelete, onTreeEdit, updateTreeDatas } from "@/utils/treeCUDfunc";

const WkProcessGroupListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 리스트 데이터 시작 ---------
  const [ data, setData ] = useState<Array<processGroupRType>>([]);
  const [ treeData, setTreeData ] = useState<treeType[]>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data.total ?? 0);

        const arr = (result.data?.data ?? []).map((group:processGroupRType) => ({
          id: group.id,
          label: group.prcGrpNm,
          children: group.processes.map((process:processRType) => ({
            id: process.id,
            label: process.prcNm,
          })),
          open: true,
        }));
        setTreeData(arr);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');

  // ---------- 신규 tree 데이터 시작 ----------
  const [ addList, setAddList ] = useState<CUtreeType[]>([]);
  const [ editList, setEditList ] = useState<CUtreeType[]>([]);
  const [ deleteList, setDeleteList ] = useState<{type: string, id: string}[]>([]);

  // 트리데이터 submit 함수
  async function onTreeSubmit(){
      console.log(addList, editList, deleteList);
      const { updatedAddList, finalEditList, updatedDeleteList } = updateTreeDatas(addList, editList, deleteList);
      console.log("add:",updatedAddList, "edit:", finalEditList, "delete: ",updatedDeleteList);
      let result = false
  
      for(const item of updatedAddList){
        let url: string = "process-group";
        let parent: string = '';
        const jsonData: { [key: string]: any, useYn: boolean } = {useYn: true}
  
        if(item.parentId) {
          url = "process";
          parent = "process-group";
          jsonData.processGroup = {id: item.parentId};
          jsonData.prcNm = item.label;
        }else{
          jsonData.prcGrpNm = item.label;
        }
        result = await onTreeAdd(url, jsonData);
        if(!result) {
          showToast('데이터 추가중 오류가 발생했습니다.', 'error');
        }
        console.log("add", result)
      }
  
      for(const item of finalEditList){
        let url: string = "process-group";
        const jsonData: { [key: string]: any, useYn: boolean } = {useYn: true}
  
        if(item.parentId) {
          url = "process";
          jsonData.processGroup = {id: item.parentId};
          jsonData.prcNm = item.label;
        }else{
          jsonData.prcGrpNm = item.label;
        }
        result = await onTreeEdit(item, url, jsonData);
        if(!result){
          showToast('데이터 수정중 오류가 발생했습니다.', 'error');
        }
      }
  
      for(const item of updatedDeleteList){
        let url: string = "process-group";
        if(item.type === 'child'){
          url = "process";
        }
        result = await onTreeDelete(item, url);
        if(!result){
          showToast('데이터 삭제중 오류가 발생했습니다.', 'error');
        }
      }
      console.log(result);
      if(result) {
        setAddList([]);
        setEditList([]);
        setDeleteList([]);
        showToast('저장이 완료되었습니다.', 'success');
        refetch();
      }
    }
   

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="p-20 h-[900px] h-full">
          <CustomTree
            data={treeData}
            // handleDataChange={handleTreeDataChange}
            onSubmit={onTreeSubmit}
            setAddList={setAddList}
            setEditList={setEditList}
            setDelList={setDeleteList}
          />
        </div>

        {/* <div className="v-between-h-center p-20">
          <p>총 {totalData}건</p>
          <div
            className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
            onClick={()=>{setNewOpen(true)}}
          >
            등록
          </div>
        </div>
        
        <AntdTable
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'no',
              render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '공정그룹명',
              dataIndex: 'prcGrpNm',
              key: 'prcGrpNm',
              align: 'center',
            },
            {
              title: '사용여부',
              width: 130,
              dataIndex: 'useYn',
              key: 'useYn',
              align: 'center',
            },
          ]}
          data={data}
        /> */}

        {/* <div className="w-full h-100 v-h-center">
          <AntdPagination
            current={pagination.current}
            total={totalData}
            size={pagination.size}
            onChange={handlePageChange}
          />
        </div> */}
      </>}
        
      <ToastContainer />
    </>
  )
}

WkProcessGroupListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessGroupListPage;