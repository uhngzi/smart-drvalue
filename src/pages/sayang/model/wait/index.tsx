import { useState } from "react";
import { useRouter } from "next/router";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { sayangModelWaitClmn } from "@/data/columns/Sayang";

import AntdTable from "@/components/List/AntdTable";
import AddModal from "@/contents/sayang/model/add/AddModal";

const SayangModelWaitPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();


  const [data, setData] = useState([
    {
      id:3,
      index:3,
      cuNm:'GPN',
      cuCode:'900',
      orderNm:'SWEDF 모델 재생산 100PCS',
      mngNm:'홍길동',
      hot:1,
      state:3,
      thic:1.6,
      layer:4,
      salesNm:'김영업',
      orderDt:'2025-01-06',
      submitDt:'2025-01-06',
    },
    {
      id:2,
      index:2,
      cuNm:'GPN',
      cuCode:'900',
      orderNm:'SWEDF 모델 재생산 100PCS',
      mngNm:'홍길동',
      hot:2,
      state:2,
      thic:1.6,
      layer:4,
      salesNm:'김영업',
      orderDt:'2025-01-06',
      submitDt:'2025-01-06',
    },
    {
      id:1,
      index:1,
      cuNm:'GPN',
      cuCode:'900',
      orderNm:'SWEDF 모델 재생산 100PCS',
      mngNm:'홍길동',
      hot:3,
      state:1,
      thic:1.6,
      layer:4,
      salesNm:'김영업',
      orderDt:'2025-01-06',
      submitDt:'2025-01-06',
    },
  ])
  
  const [newOpen, setNewOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-20">
      <AntdTable
        columns={sayangModelWaitClmn(router, setNewOpen)}
        data={data}
        styles={{ th_bg: '#FAFAFA', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
      />
      <AddModal
        open={newOpen}
        setOpen={setNewOpen}
      />
    </div>
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