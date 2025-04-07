import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";

import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";

import { SalesOrderStatus } from "@/data/type/enum";
import { 
  salesOrderRType 
} from "@/data/type/sales/order";
import { salesUserOrderClmn } from "@/data/columns/Sales";
import { 
  partnerMngRType, 
  partnerRType 
} from "@/data/type/base/partner";

import useToast from "@/utils/useToast";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import ModelDrawerContent from "@/contents/sayang/model/add/ModelDrawerContent";
import { postAPI } from "@/api/post";
import { downloadFileByObjectName } from "@/components/Upload/upLoadUtils";
import dayjs from "dayjs";

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
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
  const [ data, setData ] = useState<Array<salesOrderRType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['salesUserPage', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:salesOrderRType) => ({
        ...item,
        modelCnt: item.products?.filter(f=>f.glbStatus.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED).length,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

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

  const [orderId, setOrderId] = useState<string>('');
  const [orderDrawer, setOrderDrawer] = useState<boolean>(false);

  const handlePageMenuClick = async (key:number)=>{
    const clmn = salesUserOrderClmn(
      totalData,
      setPartnerData,
      setPartnerMngData,
      pagination,
      setOrderId,
      setOrderDrawer,
      router).map((item, index) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
    }))

    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "고객발주", "excel", showToast, "sales-orders", "core-d1");
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "고객발주", "print", showToast);
    }
  }

  return (
    <>
      <ListTitleBtn 
        label="신규"
        onClick={()=>{
          router.push('/sales/order/new');
        }}
        icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
      />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
      />

      <List>
        <AntdTableEdit
          columns={salesUserOrderClmn(
            totalData,
            setPartnerData,
            setPartnerMngData,
            pagination,
            setOrderId,
            setOrderDrawer,
            router,
          )}
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
      />

      <AntdDrawer
        open={orderDrawer}
        close={()=>{setOrderDrawer(false); setOrderId('')}}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div className="v-between-h-center">
            <p className="text-16 font-medium">고객 발주 정보</p>
            <div className="flex justify-end cursor-pointer" onClick={() => setOrderDrawer(false)}><Close/></div>
          </div>
          <ModelDrawerContent orderId={orderId} />
        </div>
      </AntdDrawer>
      
      <ToastContainer />
    </>
  )
};

SalesUserPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/offer/order' },
      { text: '견적', link: '/sales/offer/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserPage;