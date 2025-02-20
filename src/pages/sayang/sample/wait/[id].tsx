import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import { useRouter } from "next/router";
import { DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import AntdTable from "@/components/List/AntdTable";
import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import ArrayContents from "@/contents/sayang/add/ArrayContents";
import AntdModal from "@/components/Modal/AntdModal";
import ProcessSelection from "@/contents/sayang/sample/wait/ProcessSelection";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import FullOkButton from "@/components/Button/FullOkButton";
import FullSubButton from "@/components/Button/FullSubButton";

import Models from "@/assets/svg/icons/sales.svg";
import Prc from "@/assets/svg/icons/data.svg";

import PopRegLayout from "@/layouts/Main/PopRegLayout";

import { filterType } from "@/data/type/filter";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import { modelsType } from "@/data/type/sayang/models";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { useBase } from "@/data/context/BaseContext";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { specModelType, specType } from "@/data/type/sayang/sample";
import { selectType } from "@/data/type/componentStyles";
import { commonCodeRType } from "@/data/type/base/common";
import { useModels } from "@/data/context/ModelContext";

import useToast from "@/utils/useToast";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { patchAPI } from "@/api/patch";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id, match, model, status } = router.query;

  const { showToast, ToastContainer } = useToast();

  const { models, modelsLoading } = useModels();

  // 디폴트 값 가져오기
  const { 
    board,
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

  // ------------ 필요 데이터 세팅 ------------ 시작
    const [ul1SelectList, setUl1TypeSelectList] = useState<selectType[]>([]);
    const { data:ul1Data } = useQuery<apiGetResponseType, Error>({
      queryKey: ["ul1"],
      queryFn: async () => {
        const result = await getAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'common-code/jsxcrud/many/by-cd-grp-nm/UL1'
        });
  
        if (result.resultCode === "OK_0000") {
          const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
            value: d.id,
            label: d.cdNm,
          }))
          setUl1TypeSelectList(arr);
        } else {
          console.log("error:", result.response);
        }
        return result;
      },
    });
    const [ul2SelectList, setUl2SelectList] = useState<selectType[]>([]);
    const { data:ul2Data } = useQuery<apiGetResponseType, Error>({
      queryKey: ["ul2"],
      queryFn: async () => {
        const result = await getAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'common-code/jsxcrud/many/by-cd-grp-nm/UL2'
        });
  
        if (result.resultCode === "OK_0000") {
          const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
            value: d.id,
            label: d.cdNm,
          }))
          setUl2SelectList(arr);
        } else {
          console.log("error:", result.response);
        }
        return result;
      },
    });
  // ------------ 필요 데이터 세팅 ------------ 끝

  // ------------ 세부 데이터 세팅 ------------ 시작
  const [prcNotice, setPrcNotice] = useState<string>("");
  const [camNotice, setCamNotice] = useState<string>("");

  const [detailDataLoading, setDetailDataLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<specType>({});
  const { data:queryData, isLoading, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/one'],
    queryFn: async () => {
      setDetailDataLoading(true);
      
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: `spec/jsxcrud/one/${id}`
      });
      return result;
    },
    enabled: !!id,
  });
  useEffect(()=>{
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const rdata = queryData?.data?.data as specType;
      setDetailData(rdata);
      setAddModelFlag(false);
      setPrcNotice(rdata.prcNotice ?? "");
      setCamNotice(rdata.camNotice ?? "");
      setTimeout(() => {
        setDetailDataLoading(false);
      }, 200);
    }
  }, [queryData]);

    // 모델 조합 시 실행
  useEffect(()=>{
    if(!detailDataLoading && !modelsLoading && !!model && !!status) {
      const matchModel = models.find(d => d.id === model) as modelsType;
      const specModels = detailData.specModels ?? [];
      setDetailData({
        ...detailData,
        specModels: [
          {
            ...matchModel,
            id: undefined,
            unit: { id: matchModel.unit?.id },
            board: { id: matchModel.board.id },
            matchId: match,
            glbStatus: { id: status },
          } as specModelType,
          ...specModels,
        ]
      });
      setTemp(false);
    }
  }, [detailDataLoading, model, models])

    // 모델 조합 후 자동 임시 저장
  useEffect(()=>{
    if(!temp) handleSumbitTemp();
  }, [detailData])
  // ------------ 세부 데이터 세팅 ------------ 끝

  useEffect(()=>{
    setDetailData({
      ...detailData,
      prcNotice: prcNotice,
      camNotice: camNotice,
    });
  }, [prcNotice, camNotice]);

  // 모델의 값 변경 시 실행 함수
  const handleModelDataChange = (
    id?: string,
    name?: string,
    value?: any
  ) => {
    if(id && name) {
      // 데이터를 복사
      const updatedData = (detailData.specModels ?? []).map((item) => {
        if (item.id === id) {
          const keys = name.split("."); // ['model', 'a']
          const updatedItem = { ...item };
    
          // 마지막 키를 제외한 객체 탐색
          const lastKey = keys.pop()!;
          let targetObject: any = updatedItem;
    
          keys.forEach((key) => {
            // 중간 키가 없거나 null인 경우 초기화
            if (!targetObject[key] || typeof targetObject[key] !== "object") {
              targetObject[key] = {};
            }
            targetObject = targetObject[key];
          });
    
          // 최종 키에 새 값 할당
          targetObject[lastKey] = value;
    
          return updatedItem;
        }
        return item; // 다른 데이터는 그대로 유지
      });
    
      setDetailData({...detailData, specModels:updatedData}); // 상태 업데이트
    }
  };

  const [temp, setTemp] = useState<boolean>(true);
  const [addModelFlag, setAddModelFlag] = useState<boolean>(false);

  // 임시저장 시 실행
  const handleSumbitTemp = async () => {
    try {
      const jsonData = changeSayangTemp("re", detailData);

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'spec/default/temporary-save',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        if(temp) {
          showToast("임시저장 완료", "success");
          refetch();
        }

        if(addModelFlag) {
          router.push(`/sayang/sample/wait/${id}`);
          refetch();
          setAddModelFlag(false);
        }
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }

  const handleSubmitConfirm = async () => {
    try {
      const result = await patchAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url: `spec/default/confirm/${id}`,
        etc: true,
      }, id+"", {});
      
      if(result.resultCode === "OK_0000") {
        setResultOpen(true);
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
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

  // 공정 지정 팝업
  const [open, setOpen] = useState<boolean>(false);
  const [resultOpen, setResultOpen] = useState<boolean>(false);

  // 필터 펼치기
  const [approval, setApproval] = useState<boolean>(false);

  return (
    <div className="w-full pr-20 flex flex-col gap-40">
      { detailDataLoading && <Spin tip="loading..." /> }
      { !detailDataLoading && <>
      <div className="bg-white rounded-14 p-30 flex flex-col overflow-auto gap-20">
        <div className="v-between-h-center">
          <div className="flex">
            <Button type="text" icon={<DoubleRightOutlined/>} className="!bg-[#F5F6FA] !h-32" style={{border:'1px solid #D9D9D9'}} onClick={() => setApproval(prev =>!prev)}>결재</Button>
            {approval && (<DefaultFilter filter={filter} setFilter={setFilter} />)}
          </div>
          <div className="h-center gap-20">
            <Button
              className="!text-point1 !border-point1" icon={<Models className="w-16 h-16"/>}
              onClick={()=>{
                setAddModelFlag(true);
                setAddModelFlag(false);
                handleSumbitTemp();
              }}
            >모델추가</Button>
            <Button
              className="!border-[#444444]"
              icon={<Prc className="w-16 h-16"/>}
              onClick={()=>{
                setOpen(true);
              }}
            >공정지정</Button>
          </div>
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
              ul1SelectList,
              ul2SelectList,
              handleModelDataChange,
            )}
            data={detailData.specModels}
            styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
            tableProps={{split:'none'}}
            loading={detailDataLoading}
          />
        </div>
      </div>
      <div className="flex bg-white rounded-14 p-30 gap-40">
        <div className="min-w-[300px]">
          {/* 적층 구조 */}
          <LaminationContents
            defaultLayerEm={detailData.specModels?.[0]?.layerEm}
            detailData={detailData}
            setDetailData={setDetailData}
            handleSumbitTemp={()=>{
              setTemp(true);
              handleSumbitTemp();
            }}
          />
        </div>
        <div className="w-full flex gap-40">
          <div className="min-w-[550px] flex-grow-[44]">
            {/* 전달 사항 */}
            <MessageContents
              prcNotice={prcNotice}
              setPrcNotice={setPrcNotice}
              camNotice={camNotice}
              setCamNotice={setCamNotice}
            />
          </div>
          <div className="min-w-[400px] flex-grow-[32]">
            {/* 배열 도면 */}
            <ArrayContents
              board={board}
            />
          </div>
          <div className="min-w-[300px] flex-grow-[24]">
            {/* 재단 사이즈 */}
            <CutSizeContents />
          </div>
        </div>
      </div>

      <div className="v-h-center py-50 gap-15">
        <FullOkButton label="확정저장" click={()=>{
          handleSubmitConfirm();
        }}/>
        <FullSubButton label="임시저장" click={()=>{
          handleSumbitTemp();
        }}/>
      </div>
      </>}

      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"공정 지정"}
        contents={
        <ProcessSelection
          detailData={detailData}
        />}
        width={1050}
        onClose={()=>{
          refetch();
          setOpen(false);
        }}
      />
      
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={"사양 확정 완료"}
        contents={<div>사양 확정에 성공하였습니다.</div>}
        type="success"
        onOk={()=>{
          setResultOpen(false);
          router.push('/sayang/sample/wait');
        }}
        hideCancel={true}
        okText="목록으로 이동"
      />

      <ToastContainer />
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout title="사양등록">{page}</PopRegLayout>
);

export default SayangSampleAddPage;