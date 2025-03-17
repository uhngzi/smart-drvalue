import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import OrderDocumentForm from "@/contents/documentForm/OrderDocumentForm";
import { BuyOrderClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { buyOrderType } from "@/data/type/buy/cost";
import { ListPagination } from "@/layouts/Body/Pagination";
import { Popup } from "@/layouts/Body/Popup";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BuyOrderPage: React.FC & {
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
  const [ data, setData ] = useState<buyOrderType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['worksheet/vender-price/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/vender-price/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        anykeys: {applyAutoFilterType : "MATCH"},
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:buyOrderType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝
    
  const handlePageMenuClick = (key:number)=>{
    const clmn = BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "print", showToast);
    }
  }

  const [orderDocumentFormOpen, setOrderDocumentFormOpen] = useState<boolean>(false);

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
          columns={BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen)}
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
      
      <AntdModal
        open={orderDocumentFormOpen}
        setOpen={setOrderDocumentFormOpen}
        contents={
          <Popup>
            <OrderDocumentForm
              mtList={[
                {
                  nm: "mt1",
                  w: 100,
                  h: 100,
                  thk: 100,
                  cnt: 100,
                  unit: "FR-1",
                  wgt: 100,
                  price: 10000,
                  priceUnit: 10000,
                }
              ]}
              orderPrice={2345000}
            />
          </Popup>
        }
        width={1200}
      />
    </>
  )
};

BuyOrderPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="구매 및 발주"
    // menu={[
    //   { text: '외주처 단가 등록', link: '/buy/cost/wait' },
    // ]}
  >{page}</MainPageLayout>
);

export default BuyOrderPage;