import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { newDataProcessVendorCUType, newDataProcessVendorPriceCUType, processGroupRType, processRType, processVendorCUType, processVendorPriceCUType, processVendorRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AddContents from "@/contents/base/wk/process/vendor/AddContents";
import { partnerRType } from "@/data/type/base/partner";
import { generateFloorOptions, LayerEm } from "@/data/type/enum";

const WkProcessVendorPriceListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 필요 데이터 시작 ----------
  const [ dataVendor, setDataVendor ] = useState<Array<processVendorRType>>([]);
  const { data:queryDataVendor } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'client', 'vndr'],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-vendor/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataVendor(result.data?.data ?? []);
        console.log('vendor : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });

  const [ dataGroup, setDataGroup ] = useState<Array<processGroupRType>>([]);
  const { data:queryDataGroup } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', 'group'],
    queryFn: async () => {
      setDataGroup([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataGroup(result.data?.data ?? []);
        console.log('group : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      };
      return result;
    },
  });

  const [ dataProcess, setDataProcess ] = useState<Array<processRType>>([]);
  const { data:queryDataProcess } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process'],
    queryFn: async () => {
      setDataProcess([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataProcess(result.data?.data ?? []);
        console.log('process : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ---------- 필요 데이터 끝 -----------

  // --------- 리스트 데이터 시작 ---------
  const [ data, setData ] = useState<Array<processVendorRType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', 'vendor', 'price', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-vendor-price/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
        console.log('data : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      setDataLoading(false);
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
  const [ newData, setNewData ] = useState<processVendorPriceCUType>(newDataProcessVendorPriceCUType);
    //값 변경 함수
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    console.log(name, type, e);
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
  const handleSubmitNewData = async () => {
    try {
      console.log(newData);
      const result = await postAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-vendor-price',
        jsx: 'jsxcrud'
      }, {...newData});

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('success');
        setNewData(newDataProcessVendorPriceCUType);
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

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="v-between-h-center">
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
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '공정그룹명',
              dataIndex: 'processGroup',
              key: 'processGroup',
              align: 'center',
              render: (item:processGroupRType) => item.prcGrpNm,
            },
            {
              title: '공정명',
              dataIndex: 'process',
              key: 'process',
              align: 'center',
              render: (item:processRType) => item.prcNm,
            },
            {
              title: '공급처명',
              dataIndex: 'vendor',
              key: 'vendor',
              align: 'center',
              render: (item:partnerRType) => item.prtNm,
            },
            {
              title: '가격명',
              dataIndex: 'priceNm',
              key: 'priceNm',
              align: 'center',
            },
            {
              title: '가격',
              dataIndex: 'priceUnit',
              key: 'priceUnit',
              align: 'center',
            },
            {
              title: '제품유형',
              dataIndex: 'modelTypeEm',
              key: 'modelTypeEm',
              align: 'center',
              render: (item:string) => item === 'sample' ? '샘플' : '양산',
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
        
      <AntdModal
        title={"공정 등록"}
        open={newOpen}
        setOpen={setNewOpen}
        width={800}
        contents={
          <AddContents
            handleDataChange={handleDataChange}
            newData={newData}
            handleSubmitNewData={handleSubmitNewData}
            setNewOpen={setNewOpen}
            setNewData={setNewData as React.Dispatch<React.SetStateAction<processVendorCUType | processVendorPriceCUType>>}
            item={[
              { 
                name: 'processGroup',
                key: 'id',
                label: '공정그룹',
                type: 'select',
                value: newData.processGroup.id,
                option: dataGroup?.map((item)=>({value:item.id,label:item.prcGrpNm})) ?? []
              },
              { 
                name: 'process',
                key: 'id',
                label: '공정',
                type: 'select',
                value: newData.process.id,
                option: dataProcess?.filter((item:processRType)=>item?.processGroup?.id === newData.processGroup.id).map((item)=>({value:item.id,label:(item?.prcNm ?? "")})) ?? []
              },
              { 
                name: 'vendor',
                key: 'id',
                label: '공급처',
                type: 'select',
                value: newData.vendor.id,
                option: dataVendor?.filter((item:processVendorRType)=>item.process.id === newData.process.id).map((item)=>({value:item.vendor.id,label:(item?.vendor?.prtNm ?? "")})) ?? []
              },
              { 
                name: 'priceNm',
                label: '가격명',
                type: 'input',
                value: newData.priceNm,
              },
              { 
                name: 'priceUnit',
                label: '가격단위',
                type: 'input',
                inputType: 'number',
                value: newData.priceUnit,
              },
              { 
                name: 'layerEm',
                label: '층',
                type: 'select',
                option: generateFloorOptions(),
                value: newData.layerEm,
              },
              { 
                name: 'modelTypeEm',
                label: '제품유형',
                type: 'select',
                option: [{value:'sample',label:"샘플"},{value:'mass',label:"양산"}],
                value: newData.modelTypeEm,
              },
              { 
                name: 'thk',
                label: '두께',
                type: 'input',
                inputType: 'number',
                value: newData.thk,
              },
              { 
                name: 'pnlcntMin',
                label: 'PNL최소수량',
                type: 'input',
                inputType: 'number',
                value: newData.pnlcntMin,
              },
              { 
                name: 'pnlcntMax',
                label: 'PNL최대수량',
                type: 'input',
                inputType: 'number',
                value: newData.pnlcntMax,
              },
              { 
                name: 'holecntMin',
                label: '최소홀수',
                type: 'input',
                inputType: 'number',
                value: newData.holecntMin,
              },
              { 
                name: 'holecntMax',
                label: '최대홀수',
                type: 'input',
                inputType: 'number',
                value: newData.holecntMax,
              },
              { 
                name: 'm2Min',
                label: '최저면적',
                type: 'input',
                inputType: 'number',
                value: newData.m2Min,
              },
              { 
                name: 'm2Max',
                label: '최대면적',
                type: 'input',
                inputType: 'number',
                value: newData.m2Max,
              },
              // { 
              //   name: 'matCd',
              //   label: '재질',
              //   type: 'select',
              //   option: [{value:'sample',label:"샘플"},{value:'mass',label:"양산"}],
              //   value: newData.matCd,
              // { 
              //   name: 'metCd',
              //   label: '금속',
              //   type: 'select',
              //   option: [{value:'sample',label:"샘플"},{value:'mass',label:"양산"}],
              //   value: newData.metCd,
              // },
              { 
                name: 'wgtMin',
                label: '최소무게',
                type: 'input',
                inputType: 'number',
                value: newData.wgtMin,
              },
              { 
                name: 'wgtMax',
                label: '최대무게',
                type: 'input',
                inputType: 'number',
                value: newData.wgtMax,
              },
              { 
                name: 'cntMin',
                label: '최소수량',
                type: 'input',
                inputType: 'number',
                value: newData.cntMin,
              },
              { 
                name: 'cntMax',
                label: '최대수량',
                type: 'input',
                inputType: 'number',
                value: newData.cntMax,
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
          setNewData(newDataProcessVendorPriceCUType);
        }}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "공정 공급처 가격 등록 성공" : "공정 공급처 가격 등록 실패"}
        contents={resultType === "success" ? <div>공정 공급처 가격 등록이 완료되었습니다.</div> : <div>공정 공급처 가격 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

WkProcessVendorPriceListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessVendorPriceListPage;