import { useBase } from "@/data/context/BaseContext";
import { useUser } from "@/data/context/UserContext";
import useToast from "@/utils/useToast";
import { Button, Checkbox, InputRef, Steps } from "antd";
import { useRouter } from "next/router";

import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import { useEffect, useRef, useState } from "react";
import { newSalesEstimateProductType, salesEstimateProductType, salesEstimateType } from "@/data/type/sales/order";
import { newDataPartnerType, partnerCUType, partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { isValidTel } from "@/utils/formatPhoneNumber";
import { isValidEmail } from "@/utils/formatEmail";
import { postAPI } from "@/api/post";
import { getPrtCsAPI } from "@/api/cache/client";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { Popup } from "@/layouts/Body/Popup";
import LabelItem from "@/components/Text/LabelItem";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import dayjs from "dayjs";
import AntdInput from "@/components/Input/AntdInput";
import AntdDraggerSmall from "@/components/Upload/AntdDraggerSmall";
import { DividerV } from "@/components/Divider/Divider";
import TextArea from "antd/es/input/TextArea";
import AntdSelect from "@/components/Select/AntdSelect";
import { HotGrade, LayerEm, ModelStatus, ModelTypeEm } from "@/data/type/enum";
import CsMngContent from "../order/add/CsMngContent";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { MOCK } from "@/utils/Mock";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { LabelMedium } from "@/components/Text/Label";
import BlueBox from "@/layouts/Body/BlueBox";
import BoxHead from "@/layouts/Body/BoxHead";
import Items2 from "@/components/Item/Items2";
import CustomAutoCompleteLabel from "@/components/AutoComplete/CustomAutoCompleteLabel";
import { modelsType } from "@/data/type/sayang/models";
import { selectType } from "@/data/type/componentStyles";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import EstimateModelHead from "./EstimateModelHead";

const EstimateAddLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { me } = useUser();
  const { showToast, ToastContainer } = useToast();

  // 견적 메인
  const [ formData, setFormData ] = useState<salesEstimateType | null>(null);
  // 견적 모델
  const [ products, setProducts] = useState<salesEstimateProductType[]>([]);
  // 견적 내 첨부파일
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);

  // 견적 콘텐츠 내 전체 div의 크기를 가져오기 위한 변수
  const ref = useRef<HTMLDivElement>(null);
  // 높이 변경을 감지하기 위한 변수
  const [changeHeight, setChangeHeight] = useState<{width: number; height: number;} | null>(null);

  // 수정일 경우 id 값 넣어줌 => id 값이 변경될 경우 하단에 있는 detail query 실행되어 세팅됨
  useEffect(()=>{
    if(id && typeof id === "string" && !id.includes("new"))
      setFormData({id:id});
  }, [id])

  // 스탭 저장 변수
  const [ stepCurrent, setStepCurrent ] = useState<number>(0);

  // ----------- 자동 포커스 및 스크롤 ----------- 시작
  const inputRef = useRef<InputRef[]>([]);
  const stepRef = useRef<HTMLDivElement[]>([]);
  useEffect(()=>{
    if(stepRef.current) {
      stepRef.current[stepCurrent]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [stepCurrent])
  // ----------- 자동 포커스 및 스크롤 ----------- 끝

  // ------------ 구매처 데이터 세팅 ------------ 시작
  const [csList, setCsList] = useState<Array<{value:any,label:string}>>([]);
  const [csMngList, setCsMngList] = useState<partnerMngRType[]>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  useEffect(()=>{
    if(cs?.data?.data?.length) {
      setCsList(cs.data?.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data?.data]);

  const [prtId, setPrtId] = useState<string>("");
  const [prtMngId, setPrtMngId] = useState<string>("");
  const [detailFlag, setDetailFlag] = useState<boolean>(false);

  useEffect(()=>{
    // 구매처 변경 시 담당자 세팅 및 초기화
    if(prtId && prtId !== "" && cs?.data?.data && cs?.data?.data?.length) {
      setCsMngList((cs?.data?.data as partnerRType[] ?? []).find(f=>f.id === prtId)?.managers ?? []);
      if(!detailFlag) setPrtMngId(""); 
      else            setDetailFlag(false);
    } else {
      setCsMngList([]);
      setPrtMngId("");
    }
  }, [prtId, cs?.data?.data])
  // ------------ 구매처 데이터 세팅 ------------ 끝
    
  // ------------ 구매처 데이터 등록 ------------ 시작
  const [addPartner, setAddPartner] = useState<boolean>(false);
  const [newPartner, setNewPartner] = useState<partnerCUType>(newDataPartnerType);
  const handleSubmitNewData = async (data: partnerCUType) => {
    try {
      if((data?.prtTel && !isValidTel(data?.prtTel)) ||
        (data?.prtEmail && !isValidEmail(data.prtEmail))
      ) {
        showToast("올바른 형식을 입력해주세요.", "error");
        return;
      }
      
      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        { ...data, prtTypeEm: 'cs', managers: undefined }
      );

      if(result.resultCode === 'OK_0000') {
        csRefetch();
        setAddPartner(false);
        showToast("구매처 등록 완료", "success");
        setNewPartner(newDataPartnerType);
      } else {
        console.log(result);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 구매처 데이터 등록 ------------ 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
    // id 값이 변경될 경우마다 실행됨
  const {data:queryDetailData} = useQuery({
    queryKey: ['sales-estimate/jsxcrud/one', formData?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `sales-estimate/jsxcrud/one/${formData?.id}`
      });

      if(result.resultCode === "OK_0000") {
        const entity = result.data.data as salesEstimateType;
        const product = (entity.products ?? []).map((model, index) => ({
          ...model,
          index: index,
        }))
        setFormData(entity);
        setProducts(product);

        // 거래처가 변경되면 useEffect로 인해 mng id가 초기화 되므로 detail flag를 통해 초기화 제한
        // ** 아래 순서 반드시 지킬 것
        setPrtId(entity?.prtInfo?.prt?.id ?? "");
        setDetailFlag(true);
        setPrtMngId(entity?.prtInfo?.mng?.id ?? "");
        
        // 단계 설정
        setStepCurrent(1);
      }

      return result;
    },
    enabled: !!formData?.id
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝
  
  // 테이블에서 값 변경했을 때 실행되는 함수 (모델의 값 변경 시 실행 함수)
  const handleModelDataChange = (
    id: string,
    name: string,
    value: any
  ) => {
    // 데이터를 복사
    const updatedData = products.map((item) => {
      if (item.id === id) {
        const keys = name.split(".");
        let updatedItem = { ...item };
  
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

        // if(name.includes("orderPrdCnt")){
        //   const tot = (item.currPrdInfo?.orderUnitPrice ?? 0) * Number(value ?? 0);
        //   targetObject["orderPrdPrice"] = tot;
        // } else if(name.includes("orderUnitPrice")) {
        //   const tot = (item?.orderPrdCnt ?? 0) * Number(value ?? 0);
        //   updatedItem["orderPrdPrice"] = tot;
        //   console.log(targetObject, updatedItem);
        // }
  
        return updatedItem;
      }
      return item; // 다른 데이터는 그대로 유지
    });
    setProducts(updatedData); // 상태 업데이트
  };

  // 테이블에서 모델 검색을 통해 모델을 선택했을 경우 실행되는 함수
  const handleModelChange = (
    model: modelsType,
    productId: string,
  ) => {
    const newData = [...products];
    const index = newData.findIndex(f => f.id === productId);
    if(index > -1) {
      newData[index] = {
        ...newData[index],
        currPrdInfo: { ...JSON.parse(newData[index].currPrdInfo ?? "{}"), ...model }.toString(),
        estimateModelNm: model.prdNm,
        model: { id : model.id },
      };
      setProducts(newData);
    }
  }

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"del" | "cancle" | "discard" | "close" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  return (
    <>
      <div className="p-30 flex v-between-h-center w-full">
        <p className="text-20 fw-500 font-semibold">{ id?.includes("new") ? "견적 등록" : "견적 수정"}</p>
        <p 
          className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
          onClick={(()=>{
            router.push("/sales/offer/estimate");
          })}
        >
          <Close />
        </p>
      </div>
      <div className="w-full overflow-auto px-30 pb-20 h-[calc(100vh-95px)]">
        <div className="w-full h-full">
          {/* 스탭 */}
          <div className="w-full h-80 p-30 v-between-h-center">
            <Steps
              current={stepCurrent}
              items={[{title:'견적 등록'}, {title:'견적 모델 등록'}]}
            />
          </div>

          <div className="w-full !h-[calc(100%-80px)] overflow-y-auto flex flex-col gap-20">
            {/* 견적 컨텐츠 */}
            <Popup title="견적 등록">
              <div
                className="w-full h-full flex gap-30 overflow-auto"
                // 스크롤 자동을 위해 ref 추가
                ref={el => {
                  if(el) {
                    stepRef.current[0] = el;
                    ref.current = el;
                  }
                }}
              >
                <div className="w-[222px] flex flex-col gap-20">
                  <LabelItem label="고객">
                    <CustomAutoComplete
                      className="!w-full !h-36"
                      inputClassName="!h-36 !rounded-2"
                      option={csList}
                      value={prtId}
                      onChange={(value) => setPrtId(value)}
                      placeholder="고객 검색 후 선택"
                      addLabel="고객 추가"
                      handleAddData={()=>setAddPartner(true)}
                    />
                  </LabelItem>

                  <LabelItem label="총 견적 금액">
                    <AntdInput
                      value={formData?.totalEstimatePrice}
                      onChange={(e)=>{
                        setFormData({
                          ...formData,
                          totalEstimatePrice: Number(e.target.value ?? 0),
                        });
                      }}
                      styles={{ht:'36px'}}
                    />
                  </LabelItem>

                  <LabelItem label="견적일">
                    <AntdDatePicker
                      value={formData?.estimateDt ?? dayjs()}
                      onChange={(e)=>{
                        setFormData({
                          ...formData,
                          estimateDt: e,
                        })
                      }}
                      className="!w-full !rounded-2 !h-36 !border-[#D9D9D9]" suffixIcon={"cal"}
                    />
                  </LabelItem>

                  <LabelItem label="긴급상태">
                    <AntdSelect
                      options={[
                        {value:HotGrade.SUPER_URGENT,label:'초긴급'},
                        {value:HotGrade.URGENT,label:'긴급'},
                        {value:HotGrade.NORMAL,label:'일반'},
                      ]}
                      value={formData?.hotGrade ?? HotGrade.NORMAL}
                      onChange={(e)=>{
                        const value = e+'' as HotGrade;
                        setFormData({...formData, hotGrade:value});
                      }}
                      styles={{ht:'36px'}}
                    />
                  </LabelItem>

                  <AntdDraggerSmall
                    fileList={fileList}
                    setFileList={setFileList}
                    fileIdList={fileIdList}
                    setFileIdList={setFileIdList}
                    mult={true}
                    divRef={ref}
                    changeHeight={changeHeight}
                    defaultHeight={428}
                  />
                </div>

                <DividerV />

                <div className="flex-1 h-full flex flex-col gap-24">
                  <LabelItem label="견적명">
                  <AntdInput
                    value={formData?.estimateNm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, estimateNm:value});
                    }}
                    styles={{ht:'36px'}}
                  />
                  </LabelItem>
                  <LabelItem label="견적내용">
                    <TextArea
                      value={formData?.estimateTxt}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, estimateTxt:value});
                      }}
                      className="rounded-2"
                      style={{height:400,minHeight:400}}
                      onResize={(e)=>{setChangeHeight(e)}}
                    />
                  </LabelItem>
                </div>
              </div>
            </Popup>

            {/* 담당자 컨텐츠 */}
            <CsMngContent
              csMngList={csMngList}
              setCsMngList={setCsMngList}
              formPrtId={prtId}
              formPrtMngId={prtMngId}
              handleFormChange={(id)=>{
                setPrtMngId(id);
                csRefetch();
              }}
              showToast={showToast}
            />

            {/* 발주 하단 버튼 */}
            <div className="w-full v-between-h-center px-30">
              <Button 
                className="w-80 h-32 rounded-6"
                style={{color:"#444444E0"}}
                onClick={() => {
                }}
              >
                <CloseOutlined /> {!id?.includes("new") ? "삭제" : "취소"}
              </Button>
            { stepCurrent < 1 &&
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>{
                  if(!formData?.estimateNm || formData?.estimateNm === "" || prtId === "") {
                    showToast("고객, 견적명은 필수 입력입니다.", "error");
                    return;
                  }
                  setStepCurrent(1);
                  if(id?.includes("new")) {
                    setProducts([newSalesEstimateProductType(1)]);
                  }
                }}
              >
                <Arrow /> 다음 단계
              </Button>}
            </div>

            {/* 모델 컨텐츠 */}
            { stepCurrent > 0 &&
              <div
                className="flex w-full relative pl-10"
                ref={el => {
                  if (el) {
                    stepRef.current[1] = el;
                  }
                }}
              >
                <div className="w-full">
                  <Popup
                    className="overflow-auto !gap-20"
                  >
                    <LabelMedium label="견적 모델 등록"/>
                    
                    <div className="v-between-h-center">
                      <span>등록된 모델 중 선택 체크된 모델만 견적서에 포함됩니다.</span>
                      <div className="flex-1 h-center justify-end gap-20 h-46">
                        <span>선택된 모델의 합계 금액(총 견적 금액) : {(formData?.totalEstimatePrice ?? 0).toLocaleString()}원</span>
                        <span>모델 총 합계 금액 : 0원</span>
                      </div>
                    </div>

                    { products && products.map((model, index) => (
                    <EstimateModelHead
                      key={index}
                      model={model}
                      inputRef={inputRef}
                      handleModelChange={handleModelChange}
                      handleModelDataChange={handleModelDataChange}
                    />
                    ))}

                    <div className="h-40 gap-4 v-h-center cursor-pointer bg-[#EEEEEE45] text-[#00000085] rounded-8"
                      onClick={() => {
                        setProducts([
                          ...products,
                          {
                            id: "new-"+products.length+1,
                            selected: true,
                            modelStatus: ModelStatus.NEW,
                            modelTypeEm: ModelTypeEm.SAMPLE,
                            layerEm: LayerEm.L1,
                            estimateModelNm: "",
                            array: "",
                            textureIdx: "",
                            sizeH: 0,
                            sizeW: 0,
                            thickness: 0,
                            quantity: 0,
                            unitPrice: 0,
                            calculatedUnitPrice: 0,
                            surfaceTreatment: "",
                            cost: 0,
                            calculatedCost: 0,
                            autoCalculatedUnitPrice: 0,
                            autoCalculatedCost: 0,
                            remark: "",
                          }
                        ])
                      }}
                    >
                      <PlusOutlined />
                      <span>품목 추가하기</span>
                    </div>
                  </Popup>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
        
      {/* 거래처 등록 */}
      <BaseInfoCUDModal
        title={{name: "거래처 등록", icon: <Bag/>}}
        open={addPartner} 
        setOpen={setAddPartner} 
        onClose={() => {
          setAddPartner(false);
          setNewPartner(newDataPartnerType);
        }}
        items={MOCK.clientItems.CUDPopItems} 
        data={newPartner}
        onSubmit={handleSubmitNewData}
        onDelete={()=>{}}
      />

      {/* 삭제 시 확인 모달창 */}
      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        type={
          alertType === "discard" ? "success" :
          alertType === "error" ? "error" :
          "warning"}
        title={
          alertType === "error" ? "오류 발생" :
          "오류"
        }
        contents={
          alertType === "error" ? <>{errMsg}</> :
          <>오류</>
        }
        onOk={()=>{
          setAlertOpen(false);
        }}
        onCancle={()=>{
          setAlertOpen(false);
        }}
        hideCancel={alertType === "error" ? true : false}
        okText={
          "확인"
        }
        cancelText={
          "취소"
        }
      />

      <ToastContainer />
    </>
  )
}

export default EstimateAddLayout;