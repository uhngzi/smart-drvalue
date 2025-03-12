import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Skeleton, Spin, Tooltip } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

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
import Down from "@/assets/svg/icons/s_drop_down.svg";
import Right from "@/assets/svg/icons/s_drop_right.svg";

import useToast from "@/utils/useToast";

import { filterType } from "@/data/type/filter";
import { useBase } from "@/data/context/BaseContext";
import { useUser } from "@/data/context/UserContext";
import { selectType } from "@/data/type/componentStyles";
import { commonCodeRType } from "@/data/type/base/common";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { specModelType, specType } from "@/data/type/sayang/sample";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { Popup } from "@/layouts/Body/Popup";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showToast, ToastContainer } = useToast();
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
          const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
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
          const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
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

  // ------------ 제조/캠 전달사항 ------------ 시작
  const [prcNotice, setPrcNotice] = useState<string>("");
  const [camNotice, setCamNotice] = useState<string>("");

  useEffect(()=>{
    setDetailData({
      ...detailData,
      prcNotice: prcNotice,
      camNotice: camNotice,
    });
  }, [prcNotice, camNotice]);
  // ------------ 제조/캠 전달사항 ------------ 끝

  // ------------ 세부 데이터 세팅 ------------ 시작
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
  // ------------ 세부 데이터 세팅 ------------ 끝
  
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
  const handleSumbitTemp = async (main?:boolean, cf?: boolean) => {
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

        if(cf)  handleSubmitConfirm();
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
      let flag = false;
      detailData.specModels?.map(f=>{
        if((f.prdCnt ?? 0) < 1) {
          flag = true;
          return;
        }
      })
      if(flag) {
        showToast("모델 내 생산 수량을 입력해주세요.", "error");
        return;
      }

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
  const [updatePrc, setUpdatePrc] = useState<boolean>(false);
  // --------------- 공정 지정 --------------- 끝

  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"cf" | "error" | "del" | "">("");
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

  const [deleted, setDeleted] = useState<specModelType | null>(null);

  useEffect(()=>{
    if(deleted) {
      setResultType("del");
      setResultOpen(true);
    }
  }, [deleted])

  const handleDeleteModel = async () => {
    try {
      if(deleted) {
        const result = await deleteAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `spec/model/default/cancel`,
          jsx: 'default',
          etc: true,
        },
          deleted?.id ?? "",
        );

        if(result.resultCode === "OK_0000") {
          setDeleted(null);
          showToast("사양 모델 취소 성공", "success");
          if(detailData.specModels?.length && detailData.specModels?.length < 2) {
            router.push("/sayang/sample/wait");
          } else {
            refetch();
          }
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      } else  console.log("delete 없음 :: ", deleted);
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 모델 영역 접었다 피기
  const [modelTabOpen, setModelTabOpen] = useState<boolean>(true);

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
      { !detailDataLoading && !modelTabOpen &&
        <div
          className="w-full h-46 bg-white py-30 px-16 h-center gap-12 rounded-14 cursor-pointer"
          onClick={()=>setModelTabOpen(!modelTabOpen)}
        >
          <p className="w-16 h-16">
            { !modelTabOpen ? <Right /> : <Down />}
          </p>
          모델 목록 보기
        </div>
      }
      { !detailDataLoading && <>
      { modelTabOpen &&
      <Popup
        className="overflow-auto !py-30"
      >
        <div className="v-between-h-center">
          <div className="flex gap-10">
            <Button onClick={()=>setModelTabOpen(!modelTabOpen)}>
              모델 목록 접기
            </Button>
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
            {
              updatePrc || (detailData?.specPrdGroupPrcs && detailData?.specPrdGroupPrcs?.length > 0) ? 
              <Button
                className="!border-[#444444] !w-[107px]"
                icon={ <CheckOutlined style={{color:"#4880FF"}}/> }
                onClick={()=>{
                  setOpen(true);
                }}
              >공정지정</Button>
              :
              <Tooltip title="공정을 지정하세요">
              <Button
                className="!border-[#444444] !w-[107px]"
                icon={<Prc className="w-16 h-16"/>}
                onClick={()=>{
                  setOpen(true);
                }}
                >공정지정</Button>
              </Tooltip>
            }
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
              setDeleted,
            )}
            data={detailData.specModels}
            styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
            tableProps={{split:'none'}}
            loading={detailDataLoading}
          />
        </div>
      </Popup>}
      <Popup
        className="!gap-40 !flex-row"
      >
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
              handleSumbitTemp={handleSumbitTemp}
              refetch={refetch}
              detailData={detailData}
              setDetailData={setDetailData}
            />
          </div>
          <div className="min-w-[300px] flex-grow-[24]">
            {/* 재단 사이즈 */}
            <CutSizeContents
              specNo={resultOpen && resultType === "cf" && detailData.specNo ? detailData.specNo : ""}
              detailData={detailData}
            />
          </div>
        </div>
      </Popup>

      <div className="v-h-center py-50 gap-15">
        <FullOkButton label="확정저장" click={()=>{
          handleSumbitTemp(false, true);
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
          setUpdatePrc={setUpdatePrc}
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
          resultType === "del"? "해당 모델을 삭제하시겠습니까?" :
          ""
        }
        contents={
          resultType === "cf" ? <div className="h-40">사양 확정에 성공하였습니다.</div> :
          resultType === "error" ? <div className="h-40">{resultMsg}</div> :
          resultType === "del" ? <div className="h-40">해당 모델의 사양 등록을 취소하시겠습니까?</div> :
          <div className="h-40"></div>
        }
        type={
          resultType === "cf" ? "success" :
          resultType === "error" ? "error" :
          resultType === "del" ? "warning" :
          "success"
        }
        onOk={()=>{
          setResultOpen(false);
          if(resultType === "cf") {
            router.push('/sayang/sample/wait');
          } else if(resultType === "del") {
            handleDeleteModel();
          }
        }}
        onCancle={()=>{
          setResultOpen(false);
          setDeleted(null);
        }}
        hideCancel={resultType === "del" ? false : true}
        okText={
          resultType === "cf" ? "목록으로 이동" :
          resultType === "error" ? "확인" :
          resultType === "del" ? "네 사양 등록 대기로 변경하겠습니다" :
          "목록으로 이동"
        }
        cancelText={
          resultType === "del" ? "아니요 계속 등록할게요" :
          ""
        }
      />

      <ToastContainer />
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="사양 등록"
    head={true}
    modal={true}
  >{page}</MainPageLayout>
);

export default SayangSampleAddPage;