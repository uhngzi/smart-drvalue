import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { sayangModelWaitClmn } from "@/data/columns/Sayang";

import AntdTable from "@/components/List/AntdTable";
import AddModal from "@/contents/sayang/model/add/AddModal";
import { ListPagination } from "@/layouts/Body/Pagination";
import { List } from "@/layouts/Body/List";
import { modelsRType } from "@/data/type/sayang/models";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";

const SayangModelWaitPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  // const [data, setData] = useState([
  //   {
  //     id:3,
  //     index:3,
  //     cuNm:'GPN',
  //     cuCode:'900',
  //     orderNm:'SWEDF 모델 재생산 100PCS',
  //     mngNm:'홍길동',
  //     hot:1,
  //     state:3,
  //     thic:1.6,
  //     layer:4,
  //     salesNm:'김영업',
  //     orderDt:'2025-01-06',
  //     submitDt:'2025-01-06',
  //   },
  //   {
  //     id:2,
  //     index:2,
  //     cuNm:'GPN',
  //     cuCode:'900',
  //     orderNm:'SWEDF 모델 재생산 100PCS',
  //     mngNm:'홍길동',
  //     hot:2,
  //     state:2,
  //     thic:1.6,
  //     layer:4,
  //     salesNm:'김영업',
  //     orderDt:'2025-01-06',
  //     submitDt:'2025-01-06',
  //   },
  //   {
  //     id:1,
  //     index:1,
  //     cuNm:'GPN',
  //     cuCode:'900',
  //     orderNm:'SWEDF 모델 재생산 100PCS',
  //     mngNm:'홍길동',
  //     hot:3,
  //     state:1,
  //     thic:1.6,
  //     layer:4,
  //     salesNm:'김영업',
  //     orderDt:'2025-01-06',
  //     submitDt:'2025-01-06',
  //   },
  // ])
  
  const [newOpen, setNewOpen] = useState<boolean>(false);

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const [data, setData] = useState<modelsRType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['SayangModelWaitPage'],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models-match/jsxcrud/many'
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
        { !dataLoading &&
          <AntdTableEdit
            columns={sayangModelWaitClmn(totalData, setNewOpen)}
            data={data}
            styles={{ th_bg: '#FAFAFA', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
          />
        }
      </List>
      <AddModal
        open={newOpen}
        setOpen={setNewOpen}
      />
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