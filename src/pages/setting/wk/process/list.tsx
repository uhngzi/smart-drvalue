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
import { treeType } from "@/data/type/componentStyles";

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
        setData(result.data.data ?? []);
        setTotalData(result.data.total ?? 0);

        const arr = (result.data.data ?? []).map((group:processGroupRType) => ({
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
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<processGroupCUType>(newDataProcessGroupCUType);
    //값 변경 함수
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
  ) => {
    if(type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setNewData({...newData, [name]: value});
    } else if(type === "select") {
      setNewData({...newData, [name]: e});
    }
  }
    //등록 버튼 함수
  const handleSubmitNewData = async () => {
    try {
      console.log(newData);
      const result = await postAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-group',
        jsx: 'jsxcrud'
      }, newData);
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('success');
      } else {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('error');
      }
    } catch(e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType('error');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleTreeDataChange = async (
    type:'main'|'child',
    id:string,
    value:string,
    parentsId?: string,
  ) => {
    console.log(type, id, value);
    const url = type === 'main' ? 'process-group' : 'process';
    const jsonData = 
      type === 'main' ? 
      {
        prcGrpNm: value,
        useYn: true
      } : {
        processGroup: {
          id: parentsId
        },
        prcNm: value,
        useYn: true,
      }
    console.log(JSON.stringify(jsonData));
    if(id.includes('new')) {
      const result = await postAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: url,
        jsx: 'jsxcrud'
      }, jsonData);

      if(result.resultCode === "OK_0000") {
        showToast("등록 완료", "success");
        refetch();
      } else {
        showToast("등록 실패", "error");
      }
    } else {
      const result = await patchAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: url,
        jsx: 'jsxcrud',
      }, id, jsonData);

      if(result.resultCode === "OK_0000") {
        showToast("수정 완료", "success");
        console.log('ok');
      } else {
        showToast("실패 완료", "error");
      }
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
            onSubmit={()=>{}}
            setAddList={() => {}}
            setEditList={() => {}}
            setDelList={() => {}}
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
        
      <AntdModal
        title={"공정그룹 등록"}
        open={newOpen}
        setOpen={setNewOpen}
        width={800}
        contents={
          <AddContents
            handleDataChange={handleDataChange}
            newData={newData}
            handleSubmitNewData={handleSubmitNewData}
            setNewOpen={setNewOpen}
            setNewData={setNewData}
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newDataProcessGroupCUType);
        }}
      />

      <ToastContainer />
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "공정 그룹 등록 성공" : "공정 그룹 등록 실패"}
        contents={resultType === "success" ? <div>공정 그룹 등록이 완료되었습니다.</div> : <div>공정 그룹 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newDataProcessGroupCUType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

WkProcessGroupListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessGroupListPage;