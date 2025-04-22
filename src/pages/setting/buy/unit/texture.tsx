import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { apiGetResponseType } from "@/data/type/apiResponse";``
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// 기초 타입 import
import { unitTextureType, setUnitTextureType, newUnitTextureType } from "@/data/type/base/texture";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Radio, Spin } from "antd";
import { useBase } from "@/data/context/BaseContext";

const BuyunitTextureListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;
  const { metarialSelectList } = useBase();

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
  const [ data, setData ] = useState<Array<unitTextureType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    //queryKey: ['setting', 'buy', 'unit', type, pagination.current],
    queryKey: ['bp-texture/jsxcrud/many'],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);

      // 재질 리스트 조회
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'bp-texture/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        anykeys: {id: type} // 수정한거(보류)
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      console.log(result, "result 테스트중 get부분");
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
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<unitTextureType>(newUnitTextureType);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(MOCK.unitTextureItems.CUDPopItems);
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

        // 재질 수정
        const result = await patchAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'bp-texture',
          jsx: 'jsxcrud'
        }, id, data);
        console.log(result);

        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '모델 단가 수정 성공', '모델 단가 수정이 완료되었습니다.');
        } else {
          setNewOpen(false);
          
          setResultFunc('error', '모델 단가 수정 실패', '모델 단가 수정을 실패하였습니다.');
        }

      }else{

        // 재질 등록
        const result = await postAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'bp-texture',
          jsx: 'jsxcrud'
        }, {
          ...newData,
          texture: {
            id: newData.texture,
          }
        });
        console.log(result, JSON.stringify(newData), "result 테스트중 post부분");
  
        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultFunc('success', '모델 단가 등록 성공', '모델 단가 등록이 완료되었습니다.');
        } else {
          setNewOpen(false);
          setResultFunc('error', '모델 단가 등록 실패', '모델 단가 등록을 실패하였습니다.');
        }
      }
    } catch(e) {
      setNewOpen(false);
      setResultFunc('error', '모델 단가 등록 실패', '모델 단가 등록을 실패하였습니다.');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {

      // 재질 삭제
      const result = await deleteAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'bp-texture',
        jsx: 'jsxcrud'},
        id,
      );
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultFunc('success', '삭제 성공', '모델 단가 삭제가 완료되었습니다.');
      } else {
        setNewOpen(false);
        setResultFunc('error', '삭제 실패', '모델 단가 삭제를 실패하였습니다.');
      }
    }
    catch(e) {
      setNewOpen(false);
      setResultFunc('error', '삭제 실패', '모델 단가 삭제를 실패하였습니다.');
    }
  }

  function modalClose(){
    setNewOpen(false);
    setNewData(newUnitTextureType);
  }
  
  // 의존성 중 하나라도 바뀌면 옵션 리스트 갱신
  useEffect(() => {
    if (!metarialSelectList || metarialSelectList.length < 1) return;
    
    const arr = MOCK.unitTextureItems.CUDPopItems.map((item) => {
      if (item.name === 'texture') {
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
            {/* <Radio.Group value={type ? type : ""} size="small" className="custom-radio-group">
              <Radio.Button value="" onClick={() => router.push("/setting/wk/lamination")}>전체</Radio.Button>
              <Radio.Button value="cf" onClick={() => router.push("/setting/wk/lamination?type=cf")}>C/F</Radio.Button>
              <Radio.Button value="pp" onClick={() => router.push("/setting/wk/lamination?type=pp")}>P/P</Radio.Button>
              <Radio.Button value="ccl" onClick={() => router.push("/setting/wk/lamination?type=ccl")}>CCL</Radio.Button>
            </Radio.Group> */}
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
              dataIndex: 'id',
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            /*{
              title: '유형',
              dataIndex: 'lamDtlTypeEm',
              key: 'lamDtlTypeEm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full justify-center h-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setunitTextureType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.lamDtlTypeEm}
                </div>
              )
            },*/
            {
              title: '재질',
              width: 130,
              dataIndex: 'texture',
              key: 'texture',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full h-center justify-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setUnitTextureType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.texture}
                </div>
              )
            },
            {
              title: '가중치(%)',
              width: 130,
              dataIndex: 'weight',
              key: 'weight',
              align: 'center',
            },
            {
              title: '추가 비용',
              width: 130,
              dataIndex: 'addCost',
              key: 'addCost',
              align: 'center',
            },
            {
              title: '적용일',
              width: 130,
              dataIndex: 'appDt',
              key: 'appDt',
              align: 'center',
            },
            {
              title: '비고',
              width: 130,
              dataIndex: 'remark',
              key: 'remark',
              align: 'center',
            },
            {
              title: '변경이력',
              width: 130,
              dataIndex: 'updateAt',
              key: 'updateAt',
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
        title={{name: `재질 ${newData?.id ? '수정' : '등록'}`, icon: <Bag/>}}
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
          setNewData(newUnitTextureType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

BuyunitTextureListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '모델 단가', link: '/setting/buy/unit/model' },
      { text: '추가비용(두께)', link: '/setting/buy/unit/thickness' },
      { text: '재질', link: '/setting/buy/unit/texture' },
      { text: '특별사양', link: '/setting/buy/unit/special' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default BuyunitTextureListPage;