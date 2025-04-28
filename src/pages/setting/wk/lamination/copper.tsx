import AntdTable from "@/components/List/AntdTable";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import { laminationCopperList, newlaminationCopperList, setlaminationCopperList } from "@/data/type/base/lamination";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { Radio, Spin } from "antd";
import { useState, useEffect } from "react";
import Bag from "@/assets/svg/icons/bag.svg";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import { deleteAPI } from "@/api/delete";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { MOCK } from "@/utils/Mock";

const WkLaminationCopperListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {

const [dataLoading, setDataLoading] = useState<boolean>(true);
const [totalData, setTotalData] = useState<number>(1);
const [pagination, setPagination] = useState({
  current: 1,
  size: 10,
});
const handlePageChange = (page: number) => {
  setPagination({ ...pagination, current: page });
};

const [ type, setType ] = useState<'use'  | ''>('');

//등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
//등록 모달창 데이터
  const [ newData, setNewData ] = useState<laminationCopperList>(newlaminationCopperList);

// --------- 리스트 데이터 시작 ---------
const [ data, setData ] = useState<Array<laminationCopperList>>([]);
const { data:queryData, refetch } = useQuery<
  apiGetResponseType, Error
>({
    queryKey: ['setting', 'wk', 'lamination', type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'lamination-copper-foil/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        anykeys: {lamDtlTypeEm: type}
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

    

  //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    try {
      const { createdAt, updatedAt, material, id, epoxy, ...rest } = data;
  
      const payload = {
        ...rest,
        matNm: data.matNm,
      };
  
      if (data?.id) {
        const result = await patchAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'lamination-copper-foil/',
          jsx: 'jsxcrud'
        }, id, payload);
  
        if (result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '적층 구조 수정 성공', '적층 구조 수정이 완료되었습니다.');
        } else {
          setNewOpen(false);
          setResultFunc('error', '적층 구조 수정 실패', '적층 구조 수정을 실패하였습니다.');
        }
  
      } else {
        const result = await postAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'lamination-copper-foil/',
          jsx: 'jsxcrud'
        }, payload);
  
        if (result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '적층 구조 등록 성공', '적층 구조 등록이 완료되었습니다.');
          refetch();
        } else {
          setNewOpen(false);
          setResultFunc('error', '적층 구조 등록 실패', '적층 구조 등록을 실패하였습니다.');
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc('error', '적층 구조 등록 실패', '적층 구조 등록을 실패하였습니다.');
    }
  };
  
  // ----------- 신규 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'lamination-copper-foil/',
        jsx: 'jsxcrud'},
        id,
      );
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultFunc('success', '삭제 성공', '적층 구조 삭제가 완료되었습니다.');
        refetch();
      } else {
        setNewOpen(false);
        setResultFunc('error', '삭제 실패', '적층 구조 삭제를 실패하였습니다.');
      }
    }
    catch(e) {
      setNewOpen(false);
      setResultFunc('error', '삭제 실패', '적층 구조 삭제를 실패하였습니다.');
    }
  }

  function modalClose(){
    setNewOpen(false);
    setNewData(newlaminationCopperList);
  }

  return (
    <>
    {dataLoading && 
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..."/>
        </div>
      }
      {!dataLoading &&
      <>
        <div className="v-between-h-center pb-20">
          <div className="flex gap-10">
            <p>총 {totalData}건</p>         
          </div>
          <div
            className="w-56 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
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
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '이름',
              dataIndex: 'name',
              key: 'name',
              align: 'center',
              render: (_, record) => (
                <div
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  className="w-full h-full cursor-pointer reference-detail"
                  onClick={() => {
                    setNewData(setlaminationCopperList(record));
                    setNewOpen(true);
                  }}
                >
                  {record.name}
                </div>
              )
            },
            {
              title: '코딩 두께',
              width: 130,
              dataIndex: 'copThk',
              key: 'copThk',
              align: 'center',
              render: (_, record) => (
                <div
                className="w-full h-full justify-center h-center cursor-pointer reference-detail"
                onClick={()=>{
                  setNewData(setlaminationCopperList(record));
                  setNewOpen(true);
                }}
                >
                  {record.copThk}
                </div>
              )
              
            },
            {
              title: '사용여부',
              width: 130,
              dataIndex: 'useYn',
              key: 'useYn',
              align: 'center',
              render: (value: boolean) => (
                <div
                  className={"w-full h-full h-center justify-center cursor-pointer reference-detail"}
                >
                  {value ? "사용" : "미사용"}
                </div>
              ),
              
            },
          ]}
          data={data}
        />

        <div className="w-full h-100 h-center justify-end">
          <AntdSettingPagination
            current={pagination.current}
            total={totalData}
            size={pagination.size}
            onChange={handlePageChange}
          />
        </div>
      </>}

      <BaseInfoCUDModal
        title={{ name: `적층구조 동박 ${newData?.id ? '수정' : '등록'}`, icon: <Bag /> }}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        items={MOCK.CopperListPage.CUDPopItems} 
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}/>

        <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newlaminationCopperList);
        }}
        hideCancel={true}
        theme="base"
      />



    </>
  )
}

WkLaminationCopperListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '적층구조 자재', link: '/setting/wk/lamination/material' },
      { text: '적층구조 동박', link: '/setting/wk/lamination/copper' },
      { text: '적층구조 요소', link: '/setting/wk/lamination/source' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default WkLaminationCopperListPage;