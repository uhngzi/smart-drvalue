import { List, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";

import AntdTableEdit from "@/components/List/AntdTableEdit";

import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import PrtDrawer from "@/contents/partner/PrtDrawer";

import { useUser } from "@/data/context/UserContext";
import { salesOrderStatusClmn } from "@/data/columns/Sales";
import { salesOrderWorkSheetType } from "@/data/type/sales/order";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";

import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";

const SalesOrderStatusPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  const { me } = useUser();

  const { showToast, ToastContainer } = useToast();
  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [ data, setData ] = useState<Array<salesOrderWorkSheetType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['sales-order/product/worksheet/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/product/worksheet/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:salesOrderWorkSheetType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<partnerMngRType>>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  
    // 거래처 변경 시 해당 거래처 담당자 리스트 세팅
  useEffect(()=>{
    if(cs?.data?.data?.length) {
      setCsList(cs?.data?.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data?.data]);
  // ------------- 필요 데이터 세팅 ------------- 끝
  
  // ---------------- 거래처  ---------------- 시작
    // 리스트 내 거래처
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
  // ---------------- 거래처  ---------------- 끝

  const handlePageMenuClick = (key:number)=>{
    const clmn = salesOrderStatusClmn(totalData, setPartnerData, setPartnerMngData, pagination)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "고객발주", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "고객발주", "print", showToast);
    }
  }
  
  return (
    <>
      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
      />

      <List>
        <AntdTableEdit
          columns={salesOrderStatusClmn(totalData, setPartnerData, setPartnerMngData, pagination)}
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

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
        prtSuccessFn={()=>{
          refetch();
          showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
        }}
        prtMngSuccessFn={(entity:partnerMngRType)=>{
          csRefetch();
        }}
      />

      {/* <AntdDrawer
        open={orderDrawer}
        close={()=>{setOrderDrawer(false); setOrderId('')}}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
        </div>
      </AntdDrawer> */}
      
      <ToastContainer />
    </>
  )
};

SalesOrderStatusPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="수주 현황"
  >{page}</MainPageLayout>
);

export default SalesOrderStatusPage;