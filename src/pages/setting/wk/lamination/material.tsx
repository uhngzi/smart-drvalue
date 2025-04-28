import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import AntdTable from "@/components/List/AntdTable";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { useEffect, useState } from "react";
import { laminationMaterialType, setLaminationMaterialType, newLaminationMaterialType } from "@/data/type/base/lamination";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { patchAPI } from "@/api/patch";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import { Radio, Spin } from "antd";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { deleteAPI } from "@/api/delete";
import { useBase } from "@/data/context/BaseContext";
import { add } from "lodash";
import test from "node:test";

  const WkLaminationMaterialListPage: React.FC & {
    layout?: (page: React.ReactNode) => React.ReactNode;
  } = () => {
    const { metarialSelectList } = useBase();


  //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<laminationMaterialType>(newLaminationMaterialType);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(MOCK.MaterialListPage.CUDPopItems);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const router = useRouter();
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
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
  
  const [ type, setType ] = useState<'cf' | 'pp' | 'ccl' | ''>('');
  const [ data, setData ] = useState<Array<laminationMaterialType>>([]);
  const { data: queryData, refetch } = useQuery({
    queryKey: ['lamination-material/jsxcrud/many', type],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'lamination-material/jsxcrud/many'   
      },
      { 
        limit: pagination.size,
        page: pagination.current,
        anykeys: type === '' ? {} : {lamDtlTypeEm: type}
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
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    try {
      const payload = {
        ...data,
        matNm: data.matNm,
        epoxy: Number(data.epoxy),
      };
      delete payload.id;
      delete payload.material;
      delete payload.createdAt;
      delete payload.updatedAt;

      console.log(data);
      if(data?.id){
        const id = data.id;
  
        const result = await patchAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'lamination-material/',
          jsx: 'jsxcrud'
        },id, payload);
        console.log(result);

        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '적층 구조 수정 성공', '적층 구조 수정이 완료되었습니다.');
        } else {
          setNewOpen(false);
          
          setResultFunc('error', '적층 구조 수정 실패', '적층 구조 수정을 실패하였습니다.');
        }

      }else{
        const payload = {
          ...data,
          matNm: data.matNm,
          epoxy: Number(data.epoxy),
        };
        delete payload.material;
        delete payload.createdAt;
        delete payload.updatedAt;
        
        console.log("🧾 최종 payload to send:", payload);
        
        const result = await postAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'lamination-material/',
          jsx: 'jsxcrud'
        }, payload);
        console.log(result);
        console.log(result, JSON.stringify(payload), "result 테스트중 post부분");

  
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
        url: 'lamination-material/',
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
    setNewData(newLaminationMaterialType);
  }

  // 의존성 중 하나라도 바뀌면 옵션 리스트 갱신
  useEffect(() => {
    if (!metarialSelectList || metarialSelectList.length < 1) return;

    const arr = MOCK.MaterialListPage.CUDPopItems.map((item) => {
      if (item.name === 'material') {
        return {
          key: 'id',
          ...item,
          option: metarialSelectList
        };
      }

      return {
        ...item,
      };
    });

    setAddModalInfoList(arr)
  }, [metarialSelectList]);
  
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
              <Radio.Button value="" onClick={() => setType('')}>전체</Radio.Button>
              <Radio.Button value="cf" onClick={() => setType('cf')}>C/F</Radio.Button>
              <Radio.Button value="pp" onClick={() => setType('pp')}>P/P</Radio.Button>
              <Radio.Button value="ccl" onClick={() => setType('ccl')}>CCL</Radio.Button>
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
              width: 130,
              dataIndex: 'lamDtlTypeEm',
              key: 'lamDtlTypeEm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full justify-center h-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setLaminationMaterialType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.lamDtlTypeEm}
                </div>
              )
            },
            {
              title: '재질',
              dataIndex: 'matNm',
              key: 'matNm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full justify-center h-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setLaminationMaterialType(record));
                    setNewOpen(true);

                  }}
                >
                  {record.matNm}
                </div>
              )
            },
            
            {
              title: 'Epoxy',
              width: 130,
              dataIndex: 'epoxy',
              key: 'epoxy',
              align: 'center',
            },
            {
              title: '코드',
              width: 130,
              dataIndex: 'code',
              key: 'code',
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
        title={{ name: `적층구조 자재 ${newData?.id ? '수정' : '등록'}`, icon: <Bag /> }}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        items={addModalInfoList} 
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
          setNewData(newLaminationMaterialType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}




WkLaminationMaterialListPage.layout = (page: React.ReactNode) => (
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

export default WkLaminationMaterialListPage;