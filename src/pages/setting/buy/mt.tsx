import { getAPI } from "@/api/get";
import { materialType } from "@/data/type/base/material";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BuyMtListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  
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
  const [ data, setData ] = useState<materialType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['material/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:materialType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  return (
    <></>
  )
}

BuyMtListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default BuyMtListPage;