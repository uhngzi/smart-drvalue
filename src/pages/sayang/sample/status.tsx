import { Spin } from "antd";
import { getAPI } from "@/api/get";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { useQuery } from "@tanstack/react-query";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { specStatusClmn } from "@/data/columns/Sayang";
import { specType } from "@/data/type/sayang/sample";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";

import useToast from "@/utils/useToast";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";

const SayangSampleStatPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // --------------- 리스트 데이터 세팅 -------------- 시작
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [data, setData] = useState<specType[]>([]);
  const { data:queryData, isLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/many', pagination],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'spec/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
      setDataLoading(false);
      return result;
    },
  });
  useEffect(()=>{
    if(!isLoading && queryData?.resultCode === 'OK_0000') {
      const arr = (queryData?.data?.data ?? []).map((data:specType, idx:number) => ({ 
        ...data,
      }))
      setData(arr);
      setTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData]);
  // --------------- 리스트 데이터 세팅 -------------- 끝

  // ------------ 거래처 드로워 데이터 세팅 ------------ 시작
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);
  // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!drawerOpen) {
      setPartnerData(null);
      setPartnerMngData(null);
    }
  }, [drawerOpen]);
  // ------------ 거래처 드로워 데이터 세팅 ------------ 끝
  
  const handlePageMenuClick = (key:number)=>{
    const clmn = specStatusClmn(totalData, setPartnerData, setPartnerMngData, pagination, router)
      .map((item) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
      }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "사양현황", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "사양현황", "print", showToast);
    }
  }

  if (dataLoading) {
    return <div className="w-full h-[90vh] v-h-center">
      <Spin tip="Loading..."/>
    </div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div>
        <ListPagination 
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          handleMenuClick={handlePageMenuClick}
        />
        <List>
          <AntdTableEdit
            columns={specStatusClmn(totalData, setPartnerData, setPartnerMngData, pagination, router)}
            data={data}
            styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={dataLoading}
          />
        </List>
        <ListPagination
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          handleMenuClick={handlePageMenuClick}
        />
      </div>

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
      />
      <ToastContainer />
    </div>
  )
}

SayangSampleStatPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="사양 등록 및 현황"
    menu={[
      {text:'사양 등록', link:'/sayang/sample/wait'},
      {text:'사양 등록 현황', link:'/sayang/sample/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangSampleStatPage;