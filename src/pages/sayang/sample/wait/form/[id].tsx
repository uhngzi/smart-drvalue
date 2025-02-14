import { useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
import { DoubleRightOutlined } from "@ant-design/icons";

import AntdTable from "@/components/List/AntdTable";
import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import ArrayContents from "@/contents/sayang/add/ArrayContents";
import AntdModal from "@/components/Modal/AntdModal";
import ProcessSelection from "@/contents/sayang/sample/wait/ProcessSelection";
import DefaultFilter from "@/components/Filter/DeafultFilter";

import Models from "@/assets/svg/icons/sales.svg";

import PopRegLayout from "@/layouts/Main/PopRegLayout";

import { filterType } from "@/data/type/filter";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import FullOkButton from "@/components/Button/FullOkButton";
import FullSubButton from "@/components/Button/FullSubButton";
import { modelsMatchDetail, modelsType } from "@/data/type/sayang/models";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { BaseProvider, useBase } from "@/data/context/BaseContext";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import useToast from "@/utils/useToast";


const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showToast, ToastContainer } = useToast();

  // 디폴트 값 가져오기
  const { 
    surfaceSelectList,
    unitSelectList,
    vcutSelectList,
    outSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    spPrintSelectList,
    spTypeSelectList,
  } = useBase();

  const [detailDataLoading, setDetailDataLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<modelsMatchDetail[]>([]);
  const [modelsData, setModelsData] = useState<modelsType[]>([])
  const { refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['models-match/detail/jsxcrud/one'],
    queryFn: async () => {
      setDetailDataLoading(true);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: `models-match/detail/jsxcrud/one/${id}`
      });

      if(result.resultCode === "OK_0000") {
        setModelsData([...modelsData, {...result.data.data?.model, index: detailData.length+1}]);
        console.log(result.data.data);
        setDetailDataLoading(false);
      }
      return result;
    },
  });

  const handleSumbitTemp = async () => {
    try {
      const jsonData = {
      }

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'spec/default/temporary-save',
        jsx: 'default',
        etc: true,
      }, {
        
      });

      if(result.resultCode === 'OK_0000') {
        showToast("임시저장 완료", "success");
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }
  
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
        <div className="v-between-h-center">
          <div className="flex">
            <Button type="text" icon={<DoubleRightOutlined/>} className="!bg-[#F5F6FA] !h-32" style={{border:'1px solid #D9D9D9'}} onClick={() => setApproval(prev =>!prev)}>결재</Button>
            {approval && (<DefaultFilter filter={filter} setFilter={setFilter} />)}
          </div>
          <Button className="!text-point1 !border-point1" icon={<Models className="w-16 h-16"/>} onClick={()=>{}}>모델추가</Button>
        </div>
        <div>
          <AntdTable
            columns={sayangSampleWaitAddClmn(
              surfaceSelectList,
              unitSelectList,
              vcutSelectList,
              outSelectList,
              smPrintSelectList,
              smColorSelectList,
              smTypeSelectList,
              mkPrintSelectList,
              mkColorSelectList,
              mkTypeSelectList,
              spPrintSelectList,
              spTypeSelectList,
            )}
            data={modelsData}
            styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
            tableProps={{split:'none'}}
            loading={detailDataLoading}
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

      <div className="v-h-center py-50 gap-15">
        <FullOkButton label="확정저장" click={()=>{}}/>
        <FullSubButton label="임시저장" click={()=>{}}/>
      </div>

      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"공정 지정"}
        contents={<ProcessSelection />}
        width={1050}
      />
      <ToastContainer />
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout title="사양등록">{page}</PopRegLayout>
);

export default SayangSampleAddPage;