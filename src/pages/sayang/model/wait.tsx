import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { ListPagination } from "@/layouts/Body/Pagination";
import { List } from "@/layouts/Body/List";

import { salesOrderRType } from "@/data/type/sales/order";
import { sayangModelWaitClmn } from "@/data/columns/Sayang";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { DividerH } from "@/components/Divider/Divider";
import { FinalGlbStatus } from "@/data/type/enum";

const SayangModelWaitPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [paginationWait, setPaginationWait] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChangeWait = (page: number, size: number) => {
    setPaginationWait({ current: page, size: size });
  };
  const [paginationIng, setPaginationIng] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChangeIng = (page: number, size: number) => {
    setPaginationIng({ current: page, size: size });
  };
  const [dataWait, setDataWait] = useState<salesOrderRType[]>([]);
  const [dataIng, setDataIng] = useState<salesOrderRType[]>([]);
  const { data:queryData, isLoading } = useQuery({
    queryKey: ['sales-order/jsxcrud/many/by-model-status/registering-or-waiting-only'],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'sales-order/jsxcrud/many/by-model-status/registering-or-waiting-only'
        });
      } catch (e) {
        return;
      }
    }
  });
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const arr = (queryData?.data.data ?? []).map((item:salesOrderRType) => ({
        ...item,
        modelCnt: item.products?.length,
      }))
      setDataIng(arr.filter((f:salesOrderRType)=>f.finalGlbStatus === FinalGlbStatus.REGISTERING))
      setDataWait(arr.filter((f:salesOrderRType)=>f.finalGlbStatus === FinalGlbStatus.WAITING));
      setDataLoading(false);
    }
  }, [queryData]);

  const dataWaitSlice = useMemo(() => {
    const startIdx = (paginationWait.current - 1) * paginationWait.size;
    const endIdx = startIdx + paginationWait.size;
    return dataWait.slice(startIdx, endIdx);
  }, [dataWait, paginationWait]);

  const dataIngSlice = useMemo(() => {
    const startIdx = (paginationIng.current - 1) * paginationIng.size;
    const endIdx = startIdx + paginationIng.size;
    return dataIng.slice(startIdx, endIdx);
  }, [dataIng, paginationIng]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

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
    
  const handlePageMenuWaitClick = (key:number)=>{
    const clmn = sayangModelWaitClmn(dataWait.length, router, paginationWait, setPartnerData, setPartnerMngData)
      .map((item) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
      }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, dataWaitSlice, dataWaitSlice.length, paginationWait, "모델등록대기", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, dataWaitSlice, dataWaitSlice.length, paginationWait, "모델등록대기", "print", showToast);
    }
  }
    
  const handlePageMenuIngClick = (key:number)=>{
    const clmn = sayangModelWaitClmn(dataIngSlice.length, router, paginationIng, setPartnerData, setPartnerMngData)
      .map((item) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
      }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, dataIngSlice, dataIngSlice.length, paginationIng, "모델등록중", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, dataIngSlice, dataIngSlice.length, paginationIng, "모델등록중", "print", showToast);
    }
  }
  
  return (
    <div className="flex flex-col gap-20">
      <div>
        <ListPagination 
          title="모델 등록중"
          totalData={dataIng.length} 
          pagination={paginationIng}
          onChange={handlePageChangeIng}
          handleMenuClick={handlePageMenuIngClick}
        />
        <List>
          <AntdTableEdit
            columns={sayangModelWaitClmn(dataIng.length, router, paginationIng, setPartnerData, setPartnerMngData)}
            data={dataIngSlice}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={dataLoading}
          />
        </List>
        <ListPagination 
          totalData={dataIng.length} 
          pagination={paginationIng}
          onChange={handlePageChangeIng}
          handleMenuClick={handlePageMenuIngClick}
        />
      </div>

      <DividerH />

      <div>
        <ListPagination
          title="모델 등록 대기" 
          totalData={dataWait.length} 
          pagination={paginationWait}
          onChange={handlePageChangeWait}
          handleMenuClick={handlePageMenuWaitClick}
        />
        <List>
          <AntdTableEdit
            columns={sayangModelWaitClmn(dataWait.length, router, paginationWait, setPartnerData, setPartnerMngData)}
            data={dataWaitSlice}
            styles={{ th_bg: '#FAFAFA', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
            loading={dataLoading}
          />
        </List>
        <ListPagination
          totalData={dataWait.length}
          pagination={paginationWait}
          onChange={handlePageChangeWait}
          handleMenuClick={handlePageMenuWaitClick}
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
  );
};

SayangModelWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/wait'},
      {text:'모델 등록 현황', link:'/sayang/model/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelWaitPage;