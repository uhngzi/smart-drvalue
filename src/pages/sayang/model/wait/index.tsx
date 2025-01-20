import AntdTable from "@/components/List/AntdTable";
import { sayangModelWaitClmn } from "@/data/columns/Sayang";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { useRouter } from "next/router";
import { useState } from "react";

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

  return (
    <div className="flex flex-col bg-white p-30 rounded-14 gap-20">
      <div className="h-center justify-between">
        <p>총 {data.length}건</p>
      </div>
      <AntdTable
        columns={sayangModelWaitClmn(router)}
        data={data}
        styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
      />
    </div>
  )
}

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