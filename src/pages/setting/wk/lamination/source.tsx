import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import AddContents from "@/contents/base/wk/lamination/AddContents";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { laminationCUType, laminationRType, newLaminationCUType, setLaminationCUType } from "@/data/type/base/lamination";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Radio, Spin } from "antd";

const WkLaminationSourceListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;

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
  const [ data, setData ] = useState<Array<laminationRType>>([]);
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
        url: 'lamination-source/jsxcrud/many'
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
    //등록 모달창 데이터``
  const [ newData, setNewData ] = useState<laminationCUType>(newLaminationCUType);
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
    try {
      console.log(data);
      if(data?.id){
        const id = data.id;
        delete data.id;

        const result = await patchAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'lamination-source',
          jsx: 'jsxcrud'
        },id, data);
        console.log(result);

        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '적층 구조 수정 성공', '적층 구조 수정이 완료되었습니다.');
        } else {
          setNewOpen(false);
          
          setResultFunc('error', '적층 구조 수정 실패', '적층 구조 수정을 실패하였습니다.');
        }

      }else{
        const result = await postAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'lamination-source',
          jsx: 'jsxcrud'
        }, newData);
        console.log(result);
  
        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '적층 구조 등록 성공', '적층 구조 등록이 완료되었습니다.');
        } else {
          setNewOpen(false);
          setResultFunc('error', '적층 구조 등록 실패', '적층 구조 등록을 실패하였습니다.');
        }
      }
    } catch(e) {
      setNewOpen(false);
      setResultFunc('error', '적층 구조 등록 실패', '적층 구조 등록을 실패하였습니다.');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'lamination-source',
        jsx: 'jsxcrud'},
        id,
      );
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultFunc('success', '삭제 성공', '적층 구조 삭제가 완료되었습니다.');
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
    setNewData(newLaminationCUType);
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
            <Radio.Group value={type ? type : ""} size="small" className="custom-radio-group">
              <Radio.Button value="" onClick={() => router.push("/setting/wk/lamination")}>전체</Radio.Button>
              <Radio.Button value="cf" onClick={() => router.push("/setting/wk/lamination?type=cf")}>C/F</Radio.Button>
              <Radio.Button value="pp" onClick={() => router.push("/setting/wk/lamination?type=pp")}>P/P</Radio.Button>
              <Radio.Button value="ccl" onClick={() => router.push("/setting/wk/lamination?type=ccl")}>CCL</Radio.Button>
            </Radio.Group>
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
              title: '유형',
              dataIndex: 'lamDtlTypeEm',
              key: 'lamDtlTypeEm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full justify-center h-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setLaminationCUType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.lamDtlTypeEm}
                </div>
              )
            },
            {
              title: '재질',
              width: 130,
              dataIndex: 'matCd',
              key: 'matCd',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full h-center justify-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setLaminationCUType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.matCd}
                </div>
              )
            },
            {
              title: '재질두께',
              width: 130,
              dataIndex: 'matThk',
              key: 'matThk',
              align: 'center',
            },
            {
              title: '동박외층',
              width: 130,
              dataIndex: 'copOut',
              key: 'copOut',
              align: 'center',
            },
            {
              title: '동박내층',
              width: 130,
              dataIndex: 'copIn',
              key: 'copIn',
              align: 'center',
            },
            {
              title: '두께',
              width: 130,
              dataIndex: 'lamDtlThk',
              key: 'lamDtlThk',
              align: 'center',
            },
            {
              title: '실두께',
              width: 130,
              dataIndex: 'lamDtlRealThk',
              key: 'lamDtlRealThk',
              align: 'center',
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
        title={{name: `적층구조 ${newData?.id ? '수정' : '등록'}`, icon: <Bag/>}}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        items={MOCK.laminationItems.CUDPopItems} 
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}/>
        
      {/* <AntdModal
        title={"거래처 등록"}
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
            item={[
              { 
                name: 'lamDtlTypeEm',
                label: '유형',
                type: 'select',
                value: newData.lamDtlTypeEm,
                option: [{value:'cf',label:'CF'},{value:'pp',label:'PP'},{value:'ccl',label:'CCL'}]
              },
              { 
                name: 'matCd',
                label: '재질',
                type: 'select',
                value: newData.matCd,
                option: [{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}]
              },
              { 
                name: 'matThk',
                label: '재질두께',
                type: 'input',
                value: newData.matThk,
                inputType: 'number',
              },
              { 
                name: 'copOut',
                label: '동박외층',
                type: 'input',
                value: newData.copOut,
              },
              { 
                name: 'copIn',
                label: '동박내층',
                type: 'input',
                value: newData.copIn,
              },
              { 
                name: 'lamDtlThk',
                label: '두께',
                type: 'input',
                value: newData.lamDtlThk,
                inputType: 'number',
              },
              { 
                name: 'lamDtlRealThk',
                label: '실두께',
                type: 'input',
                value: newData.lamDtlRealThk,
                inputType: 'number',
              },
              { 
                name: 'useYn',
                label: '사용여부',
                type: 'select',
                option: [{value:true,label:"사용"},{value:false,label:"미사용"}],
                value: newData.useYn,
              },
            ]}
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newLaminationCUType);
        }}
      /> */}

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newLaminationCUType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

WkLaminationSourceListPage.layout = (page: React.ReactNode) => (
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

export default WkLaminationSourceListPage;