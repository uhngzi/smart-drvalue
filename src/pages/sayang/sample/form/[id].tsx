import BorderButton from "@/components/Button/BorderButton";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import AntdTable from "@/components/List/AntdTable";

import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import ArrayContents from "@/contents/sayang/add/ArrayContents";

import Plus from "@/assets/svg/icons/l_plus.svg";
import Data from "@/assets/svg/icons/data.svg";
import Print from "@/assets/svg/icons/print.svg";
import Back from "@/assets/svg/icons/back.svg";

import { useState } from "react";

import { filterType } from "@/data/type/filter";
import FullOkButton from "@/components/Button/FullOkButton";
import FullSubButton from "@/components/Button/FullSubButton";
import FilterMain from "@/layouts/Body/Grid/FilterMain";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [filter, setFilter] = useState<filterType>({
    writeDt: null,
    writer: '',
    approveDt: null,
    approver: '',
    confirmDt: null,
    confirmPer: '',
  });

  const [data, setData] = useState([
    {
      index:1,
      no:'900-000',
      cuNm:'GPM',
      cuCode:'900',
      modelNm:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
      rev:'0.0.0',
      layer:1,
      thic:1.6,
      dongbackOut:10,
      dongbackIn:10,
      dogeum:10,
    }
  ])

  return (
    <FilterMain
      filter={filter}
      setFilter={setFilter}
      filterTitle="사양 및 생산의뢰 등록"

      titleEtc={
        <BorderButton 
          label={
            <div className="h-center gap-10 text-14 text-[#666666]">
              <p className="w-15 h-15"><Back /></p>
              <p>이전 단계</p>
            </div>
          }
          click={()=>{}}
          styles={{bc:'#666666'}}
        />
      }

      filterBtn={
        <div className="h-center gap-20 min-w-[200px]">
          <BorderButton 
            label={<><p className="w-18 h-18 text-point1 mr-5"><Plus /></p><p className="text-point1">모델추가</p></>}
            click={()=>{}}
            styles={{bc:'#4880FF'}}
          />
          <BorderButton 
            label={<><p className="w-18 h-18 mr-5"><Data /></p><p>공정지정</p></>}
            click={()=>{}}
          />
          <BorderButton 
            label={<p className="w-20 h-20"><Print /></p>}
            click={()=>{}}
          />
        </div>
      }

      filterContents={
        <div>
          <AntdTable
            columns={sayangSampleWaitAddClmn()}
            data={data}
            styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px'}}
            tableProps={{split:'none'}}
          />
        </div>
      }

      main={
        <div className="flex justify-between gap-10">
          <div className="min-w-[300px]">
            <LaminationContents />
          </div>
          <div className="min-w-[550px]">
            <MessageContents />
          </div>
          <div className="min-w-[400px]">
            <ArrayContents />
          </div>
          <div className="min-w-[300px]">
            <CutSizeContents />
          </div>
        </div>
      }

      btn={
        <div className="v-h-center py-50 gap-15">
          <FullOkButton label="확정저장" click={()=>{}}/>
          <FullSubButton label="임시저장" click={()=>{}}/>
        </div>
      }
    />
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/wait'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/situation'},
    ]}
  >{page}</MainPageLayout>
);

export default SayangSampleAddPage;