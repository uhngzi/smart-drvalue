import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AddContents from "@/contents/base/wk/lamination/AddContents";
import { apiGetResponseType } from "@/data/type/apiResponse";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import { CUtreeType, selectType, treeType } from "@/data/type/componentStyles";
import { materialCUType, materialGroupType, materialType, newMaterialCUType, setMaterialCUType } from "@/data/type/base/mt";
import { onTreeAdd, onTreeDelete, onTreeEdit, updateTreeDatas } from "@/utils/treeCUDfunc";
import useToast from "@/utils/useToast";
import { useBase } from "@/data/context/BaseContext";
const BuyMtListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;
  const { unitSelectList } = useBase();
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
  const [ data, setData ] = useState<Array<materialType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'buy', 'material', type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 등록 팝업 데이터 시작 -----------
  const [ mtGroupSelectData, setMtGroupSelectData ] = useState<selectType[]>([]);
  const [ addModalInfoList, setAddModalInfoList ] = useState<any[]>(MOCK.mtItems.CUDPopItems);
  useEffect(() => {
    setAddModalInfoList((prev) => prev.map(v => v.name === 'unitType' ? {...v, option: unitSelectList.map(unit => ({value: unit.label, label: unit.label}))} : v))
  },[unitSelectList])
  console.log(addModalInfoList)
  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
  const [ resultTitle, setResultTitle ] = useState<string>('');
  const [ resultText, setResultText ] = useState<string>('');
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<materialCUType>(newMaterialCUType);
    //값 변경 함수
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    if(type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setNewData({...newData, [name]: value});
    } else if(type === "select") {
      if(key) {
        setNewData({...newData, [name]: { 
          ...((newData as any)[name] || {}), // 기존 객체 값 유지
          [key]: e?.toString(), // 새로운 key 값 업데이트
        }});
      } else {
        setNewData({...newData, [name]: e});
      }
    }
  }
    //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    console.log(data);
    if(Object.keys(data).map(key => {
      console.log(key)
      if(key.includes(".")){
        console.log("들어옴?")
        const keys = key.split(".");
        data[keys[0]][keys[1]] = data[key];
        delete data[key];
      }
    }))
    console.log(data)
    try {
      if(data?.id){
        const id = data.id;
        delete data.id;

        const result = await patchAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'material',
          jsx: 'jsxcrud'
        },id, data);
        console.log(result);

        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '원자재 수정 성공', '원자재 수정이 완료되었습니다.');
        } else {
          setNewOpen(false);
          setResultFunc('error', '원자재 수정 실패', '원자재 수정을 실패하였습니다.');
        }

      }else{
        const result = await postAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'material',
          jsx: 'jsxcrud'
        }, data);
        console.log(result);
  
        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '원자재 등록 성공', '원자재 등록이 완료되었습니다.');
        } else {
          setNewOpen(false);
          setResultFunc('error', '원자재 등록 실패', '원자재 등록을 실패하였습니다.');
        }
      }
    } catch(e) {
      setNewOpen(false);
      setResultFunc('error', '원자재 등록 실패', '원자재 등록을 실패하였습니다.');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'material',
        jsx: 'jsxcrud'},
        id,
      );
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultFunc('success', '삭제 성공', '원자재 삭제가 완료되었습니다.');
      } else {
        setNewOpen(false);
        setResultFunc('error', '삭제 실패', '원자재 삭제를 실패하였습니다.');
      }
    }
    catch(e) {
      setNewOpen(false);
      setResultFunc('error', '삭제 실패', '원자재 삭제를 실패하였습니다.');
    }
  }

  function modalClose(){
    setNewOpen(false);
    setNewData(newMaterialCUType);
  }

  // ---------- 트리 관련 시작 ----------
  const [ mtGroupOpen, setMtGroupOpen ] = useState<boolean>(false);
  const [ mtGroupTreeData, setMtGroupTreeData ] = useState<any>([]);
  const { showToast, ToastContainer } = useToast();

  // 트리를 사용하는 메뉴인 경우, 추가, 수정, 삭제를 하기위한 리스트, 한번에 submit을 하기때문에 각각의 리스트를 만들어서 한번에 처리
  const [addList, setAddList] = useState<CUtreeType[]>([]);
  const [editList, setEditList] = useState<CUtreeType[]>([]);
  const [deleteList, setDeleteList] = useState<{type: string, id: string}[]>([])

  const { refetch: groupRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ['material-group/jsxcrud/many'],
    queryFn: async () => {

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((d:materialGroupType)=>({
          id: d.id,
          label: d.mtGrpNm,
          odNum: d.ordNo,
          useYn: d.useYn,
          open: true
        }))
        setMtGroupTreeData(arr);

        const addList = (result.data?.data ?? []).map((d:materialGroupType) => ({
          value: d.id,
          label: d.mtGrpNm,
        }))
        console.log(addList)
        setAddModalInfoList((prev:any) => prev.map((d:any) => d.name === 'materialGroup.id' ? {...d, option: addList} : d));
        setMtGroupSelectData(addList)
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });

  async function onMtGroupPopSubmit(list: treeType[]){
    const { updatedAddList, finalEditList, updatedDeleteList } = updateTreeDatas(addList, editList, deleteList);
    console.log("add:",updatedAddList, "edit:", finalEditList, "delete: ",updatedDeleteList);
    let result = false
    const url = "material-group";
    
    for(const item of updatedAddList){
      const jsonData = {mtGrpNm: item.label, odNum: 1, useYn:true};

      result = await onTreeAdd(url, jsonData);

      if(!result) {
        showToast('데이터 추가중 오류가 발생했습니다.', 'error');
      }
      console.log("add", result)
    }

    for(const item of finalEditList){
      const jsonData = {mtGrpNm: item.label};
        
      result = await onTreeEdit(item, url, jsonData);
      if(!result){
        showToast('데이터 수정중 오류가 발생했습니다.', 'error');
      }
    }
    
    for(const item of updatedDeleteList){
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
      groupRefetch();
    }
  }
  // ---------- 트리 관련 끝 ----------

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="v-between-h-center pb-10">
          <p>총 {totalData}건</p>
          <div className="flex gap-10">
            <div className="w-[130px] h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer" onClick={()=>{setMtGroupOpen(true)}}>원자재 그룹 관리</div>
            <div className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer" onClick={()=>{setNewOpen(true)}}>등록</div>
          </div>
        </div>
        
        <AntdTable
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'no',
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '원자재 그룹',
              dataIndex: 'materialGroup.mtGrpNm',
              key: 'materialGroup.mtGrpNm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full justify-center h-center cursor-pointer"
                  onClick={()=>{
                    setNewData({...setMaterialCUType(record)});
                    setNewOpen(true);
                  }}
                >
                  {record.materialGroup.mtGrpNm}
                </div>
              )
            },
            {
              title: '원자재명',
              width: 130,
              dataIndex: 'mtNm',
              key: 'mtNm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full h-center justify-center cursor-pointer"
                  onClick={()=>{
                    setNewData({...setMaterialCUType(record)});
                    setNewOpen(true);
                  }}
                >
                  {record.mtNm}
                </div>
              )
            },
            {
              title: '원자재영문명',
              width: 130,
              dataIndex: 'mtEnm',
              key: 'mtEnm',
              align: 'center',
            },
            {
              title: '단위',
              width: 130,
              dataIndex: 'unitType',
              key: 'unitType',
              align: 'center',
            },
            {
              title: '사용여부',
              width: 130,
              dataIndex: 'useYn',
              key: 'useYn',
              align: 'center',
              render: (_, record) => (
                <div>{record.useYn ? '사용' : '미사용'}</div>
              )
            },
          ]}
          data={data}
        />

        <div className="w-full h-100 v-h-center">
          <AntdPagination
            current={pagination.current}
            total={totalData}
            size={pagination.size}
            onChange={handlePageChange}
          />
        </div>
      </>}

      <BaseInfoCUDModal
        title={{name: `원자재 ${newData?.id ? '수정' : '등록'}`, icon: <Bag/>}}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        items={addModalInfoList} 
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}/>

      <BaseTreeCUDModal
        title={{name: `원자재 그룹 관리`}}
        open={mtGroupOpen} 
        setOpen={setMtGroupOpen} 
        data={mtGroupTreeData}
        isChild={false}
        onClose={() => setMtGroupOpen(false)}
        onSubmit={onMtGroupPopSubmit}
        onUpdateDataFunc={{
          addList: addList,
          editList: editList,
          deleteList: deleteList,
          setAddList: setAddList,
          setEditList: setEditList,
          setDeleteList: setDeleteList,
        }}
      />
        
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newMaterialCUType);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer/>
    </>
  )
}

BuyMtListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'80px'}}>{page}</SettingPageLayout>
)

export default BuyMtListPage;