import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { ListPagination } from "@/layouts/Body/Pagination";
import { List } from "@/layouts/Body/List";

import { salesOrderRType } from "@/data/type/sales/order";
import { sayangModelWaitClmn } from "@/data/columns/Sayang";

import AntdTableEdit from "@/components/List/AntdTableEdit";

const SayangModelWaitPage: React.FC & {
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
  const [data, setData] = useState<salesOrderRType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['SayangModelWaitPage'],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'sales-order/jsxcrud/many/by-model-status/registering-or-waiting-only'
        },{
          limit: pagination.size,
          page: pagination.current,
        });
      } catch (e) {
        return;
      }
    }
  });
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      setData(queryData?.data.data ?? []);
      setTotalData(queryData?.data.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  return (
    <>
      <ListPagination 
        totalData={totalData} 
        pagination={pagination}
      />
      <List>
        {
          dataLoading && <>Loading...</>
        }
        { !dataLoading &&
          <AntdTableEdit
            columns={sayangModelWaitClmn(totalData, router)}
            // 디자인 확인 위한 임시 하드코딩 데이터 추가
            // data={[{id:"test-1", prdNm:"임시 하드코딩 데이터"}]}
            data={data}
            styles={{ th_bg: '#FAFAFA', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
          />
        }
      </List>
      {/* <AddModal
        open={newOpen}
        setOpen={setNewOpen}
        orderId={orderId}
      /> */}
    </>
  );
};

SayangModelWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/wait'},
      {text:'모델 등록 현황', link:'/sayang/model/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelWaitPage;