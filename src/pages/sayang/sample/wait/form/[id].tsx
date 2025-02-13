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

import AntdModal from "@/components/Modal/AntdModal";
import ProcessSelection from "@/contents/sayang/sample/wait/ProcessSelection";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import PopRegLayout from "@/layouts/Main/PopRegLayout";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  
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
  ]);
  

  const [open, setOpen] = useState<boolean>(false);
  const [approval, setApproval] = useState<boolean>(false);

  return (
    <div className="w-full pr-20 flex flex-col gap-40">
      <div className="bg-white rounded-14 p-30 flex flex-col overflow-auto gap-20">
        <div className="flex">
          <Button type="text" icon={<DoubleRightOutlined/>} className="!bg-[#F5F6FA] !h-32" style={{border:'1px solid #D9D9D9'}} onClick={() => setApproval(prev =>!prev)}>결재</Button>
          {approval && (<DefaultFilter filter={filter} setFilter={setFilter} />)}
        </div>
        <div>
          <AntdTable
            columns={sayangSampleWaitAddClmn()}
            data={data}
            styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
            tableProps={{split:'none'}}
          />
        </div>
      </div>
      <div className="flex bg-white rounded-14 p-30 gap-40">
        <div className="min-w-[300px]">
          <LaminationContents />
        </div>
        <div className="w-full flex gap-40">
          <div className="min-w-[550px] flex-grow-[44]">
            <MessageContents />
          </div>
          <div className="min-w-[400px] flex-grow-[32]">
            <ArrayContents />
          </div>
          <div className="min-w-[300px] flex-grow-[24]">
            <CutSizeContents />
          </div>
        </div>
      </div>
        {/* <FilterMain
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
                click={()=>{setOpen(true)}}
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
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
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
        /> */}
        <AntdModal
          open={open}
          setOpen={setOpen}
          title={"공정 지정"}
          contents={<ProcessSelection />}
          width={1050}
        />
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout 
    title="사양등록"
  >{page}</PopRegLayout>
);

export default SayangSampleAddPage;