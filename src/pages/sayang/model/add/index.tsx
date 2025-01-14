import BorderButton from "@/components/Button/BorderButton";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";
import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";

import { filterType } from "@/data/type/filter";
import { useState } from "react";
import AntdInput from "@/components/Input/AntdInput";
import EditButtonSmall from "@/components/Button/EditButtonSmall";
import FilterTab from "@/components/Filter/FilterTab";
import ModelContents from "@/contents/sayang/model/add/ModelContents";
import { TabSmall } from "@/components/Tab/Tabs";

const SayangModelAddPage: React.FC & {
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

  const [selectTab, setSelectTab] = useState<number>(1);
  
  return (
    <div className="flex gap-20">
      <div className="w-[95%] flex flex-col gap-20">
        <FilterTab
          title="모델 등록"
          filter={filter}
          setFilter={setFilter}
          filterButton={
            <BorderButton
              label={<><p className="w-18 h-18 text-point1 mr-5"><SearchIcon /></p><p className="text-point1">모델추가</p></>}
              click={()=>{}}
              styles={{bc:'#4880FF'}}
            />
          }
        />

        <div className="flex bg-white p-30 rounded-14 gap-10">
          <div className="w-[50%] flex flex-col h-full gap-20">
            <div className="flex flex-col gap-10">
              <div className="w-full h-center justify-between mt-20">
                <p className="text-16 font-semibold">신규 모델 사양 등록</p>
                <FullOkButtonSmall label="저장" click={()=>{}} className="w-[fit!important]"/>
              </div>
              <div className="h-center gap-5 text-point1">
                <p className="w-20 h-20"><Hint /></p>
                <p>기존 사양 모델 등록에 매칭됩니다.</p>
              </div>
            </div>

            <div className="flex w-full overflow-auto min-h-[380px] rounded-14 border-1 border-line">
              <ModelContents/>
            </div>
          </div>
          
          <div className="w-[50%] h-full p-30 rounded-14 border-1 border-line bg-back flex flex-col gap-20">
            <div className="w-full h-center justify-between">
              <p className="text-16 font-semibold">모델 사양 비교</p>
              <EditButtonSmall label="수정" click={()=>{}} />
            </div>

            <TabSmall
              items={[
                {key:1,text:'모델1'},
                {key:2,text:'모델2'},
              ]}
              selectKey={selectTab}
              setSelectKey={setSelectTab}
            />

            <div className="flex w-full min-h-[300px] overflow-auto">
              <ModelContents />
            </div>
          </div>
        </div>
      </div>

      <div className="w-[5%] px-10 py-20 h-center flex-col bg-white rounded-14 gap-20">
        <div className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center">
          <p className="w-20 h-20"><User /></p>
        </div>
        <div className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center">
          <p className="w-20 h-20"><Category /></p>
        </div>
      </div>
    </div>
  )
}

SayangModelAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/add'},
      {text:'모델 등록 현황', link:'/sayang/model/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelAddPage;