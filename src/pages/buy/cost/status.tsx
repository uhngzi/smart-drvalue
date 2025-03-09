import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { BuyCostOutClmn, BuyCostOutStatusClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { buyCostOutType } from "@/data/type/buy/cost";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BuyCostStatusPage: React.FC & {
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
  const [ data, setData ] = useState<Array<buyCostOutType>>([]);
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
        anykey: "applyAutoFilterType",
        anyvalue: "NONE",
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:buyCostOutType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝
  
    const handlePageMenuClick = (key:number)=>{
      const clmn = BuyCostOutStatusClmn(totalData, pagination)
      .map((item) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
      }))
      if(key === 1) { // 엑셀 다운로드
        exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가등록대기", "excel", showToast);
      } else {        // 프린트
        exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가등록대기", "print", showToast);
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
          columns={BuyCostOutStatusClmn(totalData, pagination)}
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
    </>
  )
};

BuyCostStatusPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="외주처단가등록현황"
    menu={[
      { text: '외주처단가등록대기', link: '/buy/cost/wait' },
      { text: '외주처단가등록현황', link: '/buy/cost/status' },
    ]}
  >{page}</MainPageLayout>
);

export default BuyCostStatusPage;