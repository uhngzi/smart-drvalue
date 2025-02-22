import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Skeleton, Spin } from "antd";
import { useRouter } from "next/router";
import { DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";

import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButton from "@/components/Button/FullOkButton";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import FullSubButton from "@/components/Button/FullSubButton";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import ArrayContents from "@/contents/sayang/add/array/ArrayContents";
import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import ProcessSelection from "@/contents/sayang/sample/wait/ProcessSelection";

import Models from "@/assets/svg/icons/sales.svg";
import Prc from "@/assets/svg/icons/data.svg";

import PopRegLayout from "@/layouts/Main/PopRegLayout";

import useToast from "@/utils/useToast";

import { filterType } from "@/data/type/filter";
import { useBase } from "@/data/context/BaseContext";
import { useUser } from "@/data/context/UserContext";
import { modelsType } from "@/data/type/sayang/models";
import { useModels } from "@/data/context/ModelContext";
import { processRType } from "@/data/type/base/process";
import { selectType } from "@/data/type/componentStyles";
import { commonCodeRType } from "@/data/type/base/common";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { productLinesGroupRType } from "@/data/type/base/product";
import { specModelType, specType } from "@/data/type/sayang/sample";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id, match, model, status } = router.query;
  const { showToast, ToastContainer } = useToast();
  const { models, modelsLoading } = useModels();
  const { me } = useUser();

  // 베이스 값 가져오기
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

  // 결재
  const [filter, setFilter] = useState<filterType>({
    writeDt: null,
    writer: '',
    approveDt: null,
    approver: '',
    confirmDt: null,
    confirmPer: '',
  });
  // 결재 펼치기
  const [approval, setApproval] = useState<boolean>(false);

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
      setPrcNotice(rdata.prcNotice ?? "");
      setCamNotice(rdata.camNotice ?? "");
      setTimeout(() => {
        setDetailDataLoading(false);
      }, 200);
      // 작성일 : 생성 시기
      setFilter({ ...filter, writeDt: dayjs(rdata.createdAt), writer: me?.userName ?? "", })
    }
  }, [queryData]);

  // 모델 조합일 경우 임시저장 실행
  const [matchId, setMatchId] = useState<string>("");
  useEffect(()=>{
    if(!detailDataLoading && !modelsLoading && !!model && models.length > 0 && matchId === "") {
      // 재실행 방지를 위해 matchId를 넣어줌
      setMatchId(match+"");
      const matchModel = models.find(d => d.id === model) as modelsType;
      const specModels = detailData.specModels ?? [];
      setDetailData({
        ...detailData,
        specModels: [
          {
            ...matchModel,
            id: undefined,
            unit: { id: matchModel?.unit?.id },
            board: { id: matchModel?.board.id },
            matchId: match,
            glbStatus: { id: status },
          } as specModelType,
          ...specModels,
        ]
      });
      // 임시저장 toast가 뜨지 않기 위해 false를 넣어줌 (이외에는 전부 true)
      setTemp(false);
    }
  }, [detailDataLoading, model, models])

  useEffect(()=>{ 
    if(!temp) handleSumbitTemp();
  }, [matchId])
  // ------------ 세부 데이터 세팅 ------------ 끝

  // ------------ 제조/캠 전달사항 ------------ 시작
  useEffect(()=>{
    setDetailData({
      ...detailData,
      prcNotice: prcNotice,
      camNotice: camNotice,
    });
  }, [prcNotice, camNotice]);
  // ------------ 제조/캠 전달사항 ------------ 끝
  
  // ----------- 모델 값 변경 함수 ------------ 시작
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
  // ------------ 모델 값 변경 함수 ----------- 끝
  
  // --------------- 임시 저장  ------------- 시작
    // 조합일 경우 알림이 뜨지 않게 하기 위한 flag
  const [temp, setTemp] = useState<boolean>(true);
  const handleSumbitTemp = async (main?:boolean) => {
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
        }
        // temp 값 초기화
        setTemp(true);

        // 모델 추가 시 임시 저장 후 메인으로 이동
        if(main) {
          router.push({
            pathname:'/sayang/sample/wait',
            query: {id: id, text: detailData.specNo}
          });
        }
      } else {
        const msg = result?.response?.data?.message;
        setResultMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }
  // --------------- 임시 저장 --------------- 끝
  
  // --------------- 확정 저장 --------------- 시작
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
        setResultType("cf");
      } else {
        const msg = result?.response?.data?.message;
        setResultMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // --------------- 확정 저장 --------------- 끝
  
  // --------------- 공정 지정 --------------- 시작
    // 공정 지정 팝업
  const [open, setOpen] = useState<boolean>(false);
  // --------------- 공정 지정 --------------- 끝

  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"cf" | "error" | "">("");
  const [resultMsg, setResultMsg] = useState<string>("");

  // 로딩 후 결재창 보여주기
  const [animate, setAnimate] = useState<boolean>(false);
  useEffect(() => {
    if(!detailDataLoading) {
      setApproval(true);
      setAnimate(true);

      const timer = setTimeout(() => {
        setAnimate(false);
        setTimeout(() => setApproval(false), 300); // 0.3초 후에 완전히 닫힘
      }, 1000); // 1초 후 닫힘
  
      return () => clearTimeout(timer); // 클린업 함수
    }
  }, [detailDataLoading]);

  const toggleApproval = () => {
    if (approval) {
      setAnimate(false); // 먼저 애니메이션을 종료
      setTimeout(() => setApproval(false), 300); // 애니메이션이 끝난 후 제거
    } else {
      setApproval(true);
      setTimeout(() => setAnimate(true), 10); // 애니메이션 활성화
    }
  };

  return (
    <div className="w-full pr-20 flex flex-col gap-40">
      { detailDataLoading && <>
        <div className="bg-white rounded-14 p-30 pt-70 flex flex-col overflow-auto gap-20 w-full h-[400px]">
          <Skeleton.Node active className="!w-full !h-full" />
        </div>
        <div className="flex bg-white rounded-14 p-30 gap-40 w-full h-[430px]">
          <div className="min-w-[300px]">
            <Skeleton.Node active className="!w-full !h-full" />
          </div>
          <div className="w-full flex gap-40">
            <div className="min-w-[300px] flex-grow-[44]">
              <Skeleton.Node active className="!w-full !h-full" />
            </div>
            <div className="min-w-[400px] flex-grow-[32]">
              <Skeleton.Node active className="!w-full !h-full" />
            </div>
            <div className="min-w-[300px] flex-grow-[24]">
              <Skeleton.Node active className="!w-full !h-full" />
            </div>
          </div>
        </div>
      </>}
      { !detailDataLoading && <>
      <div className="bg-white rounded-14 p-30 flex flex-col overflow-auto gap-20 w-full">
        <div className="v-between-h-center">
          <div className="flex">
            <Button 
              type="text"
              icon={<DoubleRightOutlined/>}
              className="!bg-[#F5F6FA] !h-32"
              style={{border:'1px solid #D9D9D9'}}
              onClick={toggleApproval}
            >
                결재
            </Button>
            <div className={`filter-container ${animate ? "open" : "close"}`}>
              {approval && <DefaultFilter filter={filter} setFilter={setFilter} />}
            </div>
          </div>
          <div className="h-center gap-20">
            <Button
              className="!text-point1 !border-point1" icon={<Models className="w-16 h-16"/>}
              onClick={()=>{
                setTemp(false);
                handleSumbitTemp(true);
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
      <div className="flex bg-white rounded-14 p-30 gap-40 w-full">
        <div className="min-w-[300px]">
          {/* 적층 구조 */}
          <LaminationContents
            defaultLayerEm={detailData.specModels?.[0]?.layerEm}
            detailData={detailData}
            setDetailData={setDetailData}
            handleSumbitTemp={()=>{
              handleSumbitTemp();
            }}
          />
        </div>
        <div className="w-full flex gap-40">
          <div className="min-w-[300px] flex-grow-[44]">
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
            <CutSizeContents
              specNo={detailData.specNo ?? ""}
            />
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
          open={open}
          detailData={detailData}
        />}
        width={1050}
        onClose={()=>{
          setOpen(false);
        }}
      />
      
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "cf"? "사양 확정 완료" :
          resultType === "error"? "요청 실패" :
          ""
        }
        contents={
          resultType === "cf" ? <div className="h-40">사양 확정에 성공하였습니다.</div> :
          resultType === "error" ? <div className="h-40">{resultMsg}</div> :
          <div className="h-40"></div>
        }
        type={
          resultType === "cf" ? "success" :
          resultType === "error" ? "error" :
          "success"
        }
        onOk={()=>{
          setResultOpen(false);
          if(resultType === "cf") {
            router.push('/sayang/sample/wait');
          }
        }}
        hideCancel={true}
        okText={
          resultType === "cf" ? "목록으로 이동" :
          resultType === "error" ? "확인" :
          "목록으로 이동"
        }
      />

      <ToastContainer />
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout title="사양 등록">{page}</PopRegLayout>
);

export default SayangSampleAddPage;