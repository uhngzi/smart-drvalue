import BorderButton from "@/components/Button/BorderButton";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";
import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import Back from "@/assets/svg/icons/back.svg";

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
      <div className="w-[1690px] flex flex-col gap-20">
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

        <div className="w-full flex bg-white p-20 rounded-14 gap-20 overflow-auto">
          <div className="min-w-[1022px] border-1 border-line rounded-14 p-20 flex flex-col h-full gap-17">
            <div className="h-95 flex flex-col gap-17">
              <div className="w-full min-h-32 h-center justify-between">
                <p className="text-16 font-semibold">신규 모델 사양 등록</p>
                <div className="w-96 h-32 px-15 h-center justify-between text-14 border-1 border-bdDefault rounded-6 mr-20">
                  <p className="min-w-16 min-h-16 text-[#FE5C73]"><Back stroke={'#FE5C73'} /></p>
                  초기화
                </div>
              </div>
              <div className="min-h-46 h-center gap-5 text-point1 border-b-1 border-line">
                <p className="w-20 h-20"><Hint /></p>
                <p>기존 사양 모델 등록에 매칭됩니다.</p>
              </div>
            </div>

            <div className="flex min-w-[982px]">
              <ModelContents/>
            </div>
          </div>
          
          <div className="min-w-[1022px] border-1 border-line rounded-14 p-20 flex flex-col h-full gap-17 bg-back2">
            <div className="h-95 flex flex-col gap-17">
              <div className="w-full min-h-32 h-center justify-between">
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
            </div>

            <div className="flex min-w-[982px]">
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