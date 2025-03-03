import dayjs from "dayjs";
import { Button, InputRef, Steps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { getPrtCsAPI } from "@/api/cache/client";

import { LabelMedium, LabelThin } from "@/components/Text/Label";
import { DividerH } from "@/components/Divider/Divider";
import SalesModelTable from "@/components/ModelTable/SalesModelTable";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import ModelList from "@/contents/base/model/ModelList";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";

import {
  newDataPartnerType,
  partnerCUType,
  partnerMngRType,
  partnerRType
} from "@/data/type/base/partner";
import { 
  HotGrade,
  SalesOrderStatus
} from "@/data/type/enum";
import { 
  newDataSalesOrderCUType,
  newDataSalesOrderProductCUType,
  salesOrderCUType,
  salesOrderDetailRType,
  salesOrderProcuctCUType,
  salesOrderProcuctReq,
  salesOrderProductRType,
  salesOrderReq
} from "@/data/type/sales/order";
import { changeOrderEdit, changeOrderMainNew, changeOrderNew } from "@/data/type/sales/changeData";
import { useUser } from "@/data/context/UserContext";
import { useModels } from "@/data/context/ModelContext";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Back from "@/assets/svg/icons/back.svg";
import Category from "@/assets/svg/icons/category.svg";
import Edit from '@/assets/svg/icons/memo.svg';
import Bag from "@/assets/svg/icons/bag.svg";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { MOCK } from "@/utils/Mock";

import SalesOrderContent from "./SalesOrderContent";
import CsMngContent from "./CsMngContent";
import AntdInput from "@/components/Input/AntdInput";

const OrderAddLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { me } = useUser();
  const { models, setModels } = useModels();
  const { showToast, ToastContainer } = useToast();

  // 스탭 저장 변수
  const [ stepCurrent, setStepCurrent ] = useState<number>(0);
  // 발주 저장 변수
  const [ formData, setFormData ] = useState<salesOrderCUType>(newDataSalesOrderCUType);
  // 발주 내 첨부파일
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);
  // 모델 저장 변수
  const [ newProducts, setNewProducts ] = useState<salesOrderProcuctCUType[]>([{ ...newDataSalesOrderProductCUType(), id: "new-1", index: 1 }]);
  // 수정 시 필요 변수
  const [ edit, setEdit ] = useState<boolean>(false);

  // id가 NEW일 경우 생성, 아닐 경우 수정
  const [orderId, setOrderId] = useState<string>("");
  useEffect(()=>{
    if(id?.includes("new")) {
      setEdit(false);
      setOrderId("new");
    } else {
      setEdit(true);
      setOrderId(id+"");
    }
  }, [id]);
  
  useEffect(()=>{
    // 수정일 경우에만 실행
    if(orderId && !(id+"").includes("new")) {
      fetchDetail();
    }
  }, [orderId])

  // ----------- 거래처 데이터 세팅 ----------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<partnerMngRType>>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  
    // 거래처 변경 시 해당 거래처 담당자 리스트 세팅
  useEffect(()=>{
    if(cs?.data.data?.length) {
      setCsList(cs.data.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data.data]);

    // 발주 내 거래처 변경 시 해당 담당자 리스트 세팅
  useEffect(()=>{
    if(formData.partnerId !== '' && cs?.data.data?.length) {
      const data = cs?.data.data as partnerRType[];
      const mng = data.find((cu:partnerRType) => cu.id === formData.partnerId)?.managers;
      setCsMngList(mng ?? []);
      if(mng && mng.length > 0) {
        // 수정 시 값이 설정되어 있을 경우 return
        if(mng.find(f => f.id === formData.partnerManagerId)) return;
        // 거래처가 변경되었거나 신규일 경우 첫번째 담당자 자동 세팅
        setFormData({...formData, partnerManagerId:mng[0].id});
      } else {
        setFormData({...formData, partnerManagerId:''});
      }
    }
  }, [formData.partnerId])
  // ----------- 거래처 데이터 세팅 ----------- 끝
  
  // ----------- 거래처 데이터 등록 ----------- 시작
  const [addPartner, setAddPartner] = useState<boolean>(false);
  const [newPartner, setNewPartner] = useState<partnerCUType>(newDataPartnerType);
  const handleSubmitNewData = async (data: partnerCUType) => {
    try {
      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        
        { ...data, prtTypeEm: 'cs'}
      );

      if(result.resultCode === 'OK_0000') {
        csRefetch();
        setAddPartner(false);
        showToast("거래처 등록 완료", "success");
        const entity = (result.data?.entity) as partnerRType;
        setFormData({ ...formData, partnerId: entity.id });
      } else {
        console.log(result);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ----------- 거래처 데이터 등록 ----------- 끝

  // -------- 수정 시 디테일 데이터 세팅 -------- 시작
  const [detailChk, setDetailChk] = useState<boolean>(false);

  const fetchDetail = async (modelId?: string) => {
    const result = await getAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `sales-order/detail/jsxcrud/one/${orderId}`
    });

    if(result.resultCode === "OK_0000") {
      const data = result.data.data as salesOrderDetailRType;
      setFormData({
        id: data?.id,
        partnerId: data.prtInfo?.prt?.id,
        partnerManagerId: data.prtInfo?.mng?.id,
        orderName: data?.orderNm,
        orderDt: dayjs(data?.orderDt, 'YYYY-MM-DD'),
        orderRepDt: data?.orderRepDt,
        orderTxt: data?.orderTxt,
        totalOrderPrice: data?.totalOrderPrice,
        empId: data?.emp?.id,
        hotGrade: data?.hotGrade ?? HotGrade.NORMAL,
        files: data?.files.map((file) => { return file.storageId }),
      });
      if(data?.files?.length > 0) {
        setDetailChk(true);
        console.log(formData.files);
      }

      const prdArr = data.products
                      .filter(f => f.glbStatus.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
                      .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateA - dateB;
                      });

      setNewProducts(prdArr.map((prd: salesOrderProductRType, index:number) => ({
        id: prd.id,
        index: index+1,
        currPrdInfo: prd.currPrdInfo && typeof prd.currPrdInfo === "string" ? JSON.parse(prd.currPrdInfo) : {},
        modelStatus: prd.modelStatus,
        orderDt: dayjs(prd.orderDt, 'YYYY-MM-DD'),
        // orderNo: prd.orderNo,
        orderTit: prd.orderTit,
        prtOrderNo: prd.prtOrderNo,
        orderPrdRemark: prd.orderPrdRemark,
        orderPrdCnt: prd.orderPrdCnt,
        orderPrdUnitPrice: prd.orderPrdUnitPrice,
        orderPrdPrice: prd.orderPrdPrice,
        orderPrdDueReqDt: prd.orderPrdDueReqDt ? dayjs(prd.orderPrdDueReqDt, 'YYYY-MM-DD') : null,
        orderPrdDueDt: prd.orderPrdDueDt ? dayjs(prd.orderPrdDueDt, 'YYYY-MM-DD') : null,
        orderPrdHotGrade: prd.orderPrdHotGrade ?? HotGrade.NORMAL,
        disabled: prd.glbStatus.salesOrderStatus === SalesOrderStatus.MODEL_REG_WAITING ? false : true,
      })));
      // 자동으로 스탭2
      setStepCurrent(1);
    }
  }

  // 데이터 세팅 시 파일 목록이 있을 경우 파일 정보 가져와서 세팅
  useEffect(()=>{
    if(detailChk) {
      console.log(formData.files);
      fetchFileInfo();
    }
  }, [detailChk])

  const fetchFileInfo = async () => {
    if(formData.files && formData.files.length > 0) {
      let fileArr:any[] = [];
      for (const file of formData?.files) {
        const result = await getAPI({
          type: 'file-mng',
          url: `every/file-manager/default/info/${file}`,
          header: true,
        });
        
        if(result.resultCode === "OK_0000") {
          const entity = result?.data?.fileEntity;
          fileArr.push({
            ...entity,
            name: entity?.originalName,
            originFileObj: {
              name: entity?.originalName,
              size: entity?.size,
              type: entity?.type,
            }
          });
        }
      }
      setFileList(fileArr);
      setFileIdList(formData.files);
      setDetailChk(false);
    }
  }

  useEffect(()=>{console.log(fileList)}, [fileList]);
  // -------- 수정 시 디테일 데이터 세팅 -------- 끝
  
  // ---------- 발주 신규 등록 함수 ----------- 시작
  const handleSubmitOrder = async (model: salesOrderProcuctCUType) => {
    const jsonData = changeOrderNew(formData, [model], me);
    console.log('NEW !! ', JSON.stringify(jsonData));

    // 발주 내 필수 값 입력 체크
    const ordVal = validReq(jsonData, salesOrderReq());
    if(!ordVal.isValid) {
      showToast(ordVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    // 모델 내 필수 값 입력 체크
    const prdVal = validReq(model, salesOrderProcuctReq());
    if(!prdVal.isValid) {
      showToast(prdVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    const result = await postAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: 'sales-order',
      jsx: 'default'},
      jsonData
    );

    if(result.resultCode === 'OK_0000') {
      const entity = result.data.entity as salesOrderDetailRType;
      if(entity) {
        setFormData({
          id: entity.id,
          partnerId: entity.prtInfo.prt.id,
          partnerManagerId: entity.prtInfo.mng.id,
          orderName: entity.orderNm,
          orderDt: dayjs(entity.orderDt, 'YYYY-MM-DD'),
          orderRepDt: entity.orderRepDt,
          orderTxt: entity.orderTxt,
          totalOrderPrice: entity.totalOrderPrice,
          empId: entity.emp.id,
          hotGrade: entity.hotGrade ?? HotGrade.NORMAL,
          files: entity.files?.map((file) => { return file.storageId }),
        });
      }
      
      // 신규 발주 등록 후 등록중이던 기존 모델들은 냅둔 채 저장을 누른 모델에만 아이디 값이 저장 될 수 있게 변경해줌
      // 이후는 수정 모드로 전환되어 발주 신규 등록이 아닌 모델 저장 함수로 들어가게 됨
      const products = result.data.products as salesOrderProductRType[];
      if(products.length > 0) {
        const updateData = [ ...newProducts ];
        const index = updateData.findIndex(f => f.id === model.id);
        if(index > -1) {
          updateData[index] = { 
            ...products[0],
            currPrdInfo: products[0]?.currPrdInfo.length ? JSON.parse(products[0].currPrdInfo ?? "") : {}
          };

          setNewProducts([
            ...updateData.slice(0, index),
            updateData[index],
            ...updateData.slice(index + 1),
          ]);
        }
      }

      // 이후 수정을 위해 새 아이디로 변경
      setOrderId(entity?.id ?? "");
      // 수정 모드로 전환
      setEdit(true);

      showToast("고객 발주가 완료되었습니다.", "success");
    } else {
      const msg = result?.response?.data?.message;
      showToast(msg, "error");
    }
  }
  // ---------- 발주 신규 등록 함수 ----------- 끝

  // ------------ 모델 저장 함수 ------------- 시작
  const handleEditOrder = async (model: salesOrderProcuctCUType) => {
    const jsonData = changeOrderEdit({ ...formData, id: orderId}, [model], me);
    console.log('EDIT !! ', JSON.stringify(jsonData), model);

    // 발주 내 필수 값 입력 체크
    const ordVal = validReq(jsonData.order, salesOrderReq());
    if(!ordVal.isValid) {
      showToast(ordVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    // 모델 내 필수 값 입력 체크
    const prdVal = validReq(model, salesOrderProcuctReq());
    if(!prdVal.isValid) {
      showToast(prdVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    const result = await postAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: 'sales-order/default/multiple-save',
      jsx: 'default',
      etc: true },
      jsonData
    );

    if(result.resultCode === 'OK_0000') {
      showToast("저장 완료", "success");
      console.log(result);
      fetchDetail();
    } else {
      console.log(result);
      const msg = result?.response?.data?.message;
      showToast(msg, "error");
    }
  }
  // ------------ 모델 저장 함수 ------------- 끝

  // ------------ 모델 삭제 함수 ------------- 시작
  const [deleted, setDeleted] = useState<boolean>(false);
  const handleDelete = async () => {
    const deletedData = newProducts.filter(f => f.disabled)
    
    if(deletedData.length > 0 && deletedData[0].id) {
      deletedData.map(async (item) => {
        if(item.id) {
          const result = await patchAPI({
            type: 'core-d1',
            utype: 'tenant/',
            url: `sales-order/product/default/discard/${item.id}`,
            jsx: 'default',
            etc: true,
          }, item.id);

          if(result.resultCode === "OK_0000") {
            showToast("삭제 완료", "success");
            setNewProducts(newProducts.filter(f=>f.id !== item.id));
          } else {
            showToast("삭제 실패", "error");
          }
        }
      })
    }
  }
  useEffect(()=>{
    if(deleted) { 
      setAlertType("del");
      setAlertOpen(true);
    }
  }, [deleted])
  // ------------ 모델 삭제 함수 ------------- 끝

  // ------------ 발주 폐기 함수 ------------- 시작
  const handleDeleteOrder = async () => {
    const result = await patchAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `sales-order/default/discard/${orderId}`,
      jsx: 'default',
      etc: true,
    }, orderId);

    if(result.resultCode === "OK_0000") {
      setAlertType("discard");
      setAlertOpen(true);
    } else {
      showToast("폐기 실패", "error");
    }
  }
  // ------------ 발주 폐기 함수 ------------- 끝

  // ------------ 발주 등록 함수 ------------- 시작
  const handleAddOrderMain = async () => {
    const jsonData = changeOrderMainNew({ ...formData, id: orderId}, me);
    console.log(JSON.stringify(jsonData));

    // 발주 내 필수 값 입력 체크
    const ordVal = validReq(jsonData, salesOrderReq());
    if(!ordVal.isValid) {
      showToast(ordVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }
    
    const result = await postAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: 'sales-order',
      jsx: 'default',
    }, { ...jsonData, id: undefined });

    if(result.resultCode === "OK_0000") {
      showToast("발주 등록 완료", "success");
    } else {
      const msg = result.response?.data?.message;
      showToast(msg, "error");
    }
  }
  // ------------ 발주 등록 함수 ------------- 끝

  // ------------ 발주 수정 함수 ------------- 시작
  const handleEditOrderMain = async () => {
    console.log(orderId, JSON.stringify(formData));
    
    const result = await patchAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `sales-order/default/update/${orderId}`,
      jsx: 'default',
      etc: true,
    }, orderId, { ...formData, id: undefined });

    if(result.resultCode === "OK_0000") {
      showToast("발주 수정 완료", "success");
    } else {
      const msg = result.response?.data?.message;
      showToast(msg, "error");
    }
  }
  // ------------ 발주 수정 함수 ------------- 끝

  // --------- 자동 포커스 및 스크롤 ----------- 시작
    // 모델 추가 시 새 모델로 부드럽게 자동 이동 후 자동 포커스
  const inputRef = useRef<InputRef[]>([]);
  const [priceFlag, setPriceFlag] = useState<boolean>(false);
  const [viewKey, setViewKey] = useState<number | null>(null);
  useEffect(()=>{
    if(viewKey && inputRef.current.length > 0) {
      const targetInput = inputRef.current[viewKey];
      if (targetInput.input) {
        targetInput?.input.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // 수주 금액을 클릭했을 땐 포커스 안함
        if(!priceFlag) {
          // 스크롤 후 포커스 되기 위함
          setTimeout(() => {
            targetInput?.input?.focus();
          }, 300);
        }
      }
    }
    // 이동 후에는 초기화
    setViewKey(null);
    setPriceFlag(false);
  }, [viewKey]);

    // 스탭 변경 시 해당 스탭으로 부드럽게 자동 이동
  const stepRef = useRef<HTMLDivElement[]>([]);
  useEffect(()=>{
    if(stepRef.current) {
      stepRef.current[stepCurrent].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      
      // 모델 등록일 경우 맨 위에 있는 모델로 자동 포커싱
      if(stepCurrent === 1) {
        // 스크롤 후 포커싱 되기 위함
        setTimeout(() => {
          const targetInput = inputRef.current[newProducts.length];
          targetInput?.input?.focus();
        }, 400);
      }
    }
  }, [stepCurrent])
  // --------- 자동 포커스 및 스크롤 ----------- 끝

  // 총 수주 금액 자동 입력 세팅
  useEffect(()=>{
    const totalPrice = newProducts.reduce((acc, product) => {
      const productPrice = Number(product.orderPrdPrice);
      const productCount = Number(product.orderPrdCnt);
      return acc + productPrice * productCount;
    }, 0);
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalOrderPrice: totalPrice,
    }));
  }, [newProducts]);

  // 모델 드로워
  const [modelDrawerOpen, setModelDrawerOpen] = useState<boolean>(false);
  // 모델 드로워에서 선택 시 해당 발주 모델 아이디 저장
  const [selectId, setSelectId] = useState<string | null>(null);
  // 그대로 등록일 경우 false, 복사하여 등록일 경우 true
  const [newFlag, setNewFlag] = useState<boolean>(true);
  useEffect(()=>{console.log('new :: ',newFlag)}, [newFlag]);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"del" | "cancle" | "discard" | "close" | "">("");

  return (<>
    <div className="p-30 flex v-between-h-center w-full">
      <p className="text-20 fw-500 font-semibold">{ id?.includes("new") ? "고객 발주 등록" : "고객 발주 수정"}</p>
      <p 
        className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
        onClick={(()=>{
          let flag = false;
          //고객 발주를 저장하지 않았을 경우
          if(id?.includes("new") && formData.id?.includes("new")) {
            flag = true;
          } else {
            newProducts.map((prd) => {
              if(prd.id?.includes("new")) {
                flag = true;
                return;
              }
            });
          }

          if(flag) {
            setAlertOpen(true);
            setAlertType("close");
          } else {
            router.push("/sales/order");
          }
        })}
      >
        <Close />
      </p>
    </div>
    <div className="w-full overflow-auto pl-20 pb-20">
      <div className="h-center gap-20">
        <div className="w-[calc(100vw-100px)]">
          {/* 스탭 */}
          <div className="w-full h-80 p-30 v-between-h-center">
            <Steps current={stepCurrent} items={[{title:'고객 발주'}, {title:'고객 발주 모델 등록'}]} />
          </div>
          
          {/* 왼쪽 컨텐츠 */}
          <div className="w-full !h-[calc(100vh-272px)] overflow-y-auto">
            {/* 고객 발주 컨텐츠 */}
            <div
              className="flex"
              // 스크롤 자동을 위해 ref 추가
              ref={el => {if(el)  stepRef.current[0] = el;}}
            >
              <SalesOrderContent
                csList={csList}
                formData={formData}
                setFormData={setFormData}
                fileList={fileList}
                setFileList={setFileList}
                fileIdList={fileIdList}
                setFileIdList={setFileIdList}
                setViewKey={setViewKey}
                setPriceFlag={setPriceFlag}
                newProducts={newProducts}
                setAddPartner={setAddPartner}
                detailChk={detailChk}
                setDetailChk={setDetailChk}
              />
            </div>

            {/* 담당자 컨텐츠 */}
            <CsMngContent
              csMngList={csMngList}
              setCsMngList={setCsMngList}
              formData={formData}
              setFormData={setFormData}
              showToast={showToast}
            />

            {/* 발주 하단 버튼 */}
            <div className="w-full h-50 v-between-h-center">
              {stepCurrent < 1 ?
              <>
                <Button 
                  className="w-109 h-32 rounded-6"
                  style={{color:"#444444E0"}}
                  onClick={() => {
                    setFormData(newDataSalesOrderCUType());
                    stepRef.current[0].scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                    setTimeout(()=>{
                      setStepCurrent(0);
                    }, 400)
                  }}
                >
                  <Close/> 취소
                </Button>
                <Button 
                  className="w-109 h-32 bg-point1 text-white rounded-6"
                  style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                  onClick={()=>{
                    const orderVal = validReq(formData, salesOrderReq());
                    if(!orderVal.isValid) {
                      showToast(orderVal.missingLabels+'은(는) 필수 입력입니다.', "error");
                    } else {
                      setStepCurrent(1);
                    }
                  }}
                >
                  <Arrow />다음 단계
                </Button>
              </> : <>
                  <div className="flex" />
                  <Button
                    className="w-109 h-32 rounded-6 border-point1 text-point1"
                    onClick={()=>{
                      if(!edit)
                        handleAddOrderMain();
                      else
                        handleEditOrderMain();
                    }}
                  >
                    <p className="w-16 h-16"><Edit /></p> {edit ? "수정" : "발주 등록"}
                  </Button>
                </>
                }
            </div>

            {/* 모델 컨텐츠 */}
          { stepCurrent > 0 &&
            <div
              className="flex w-full relative pl-10 min-w-[1500px]"
              ref={el => {
                if (el) {
                  stepRef.current[1] = el;
                }
              }}
            >
              <div className="w-full">
                <div className="w-full flex flex-col bg-white rounded-14 overflow-auto px-20 py-30 gap-20">
                  <div className="v-between-h-center">
                    <LabelMedium label="모델 등록"/>
                    <div className="h-center gap-8">
                      총 수주 금액
                      <AntdInput
                        value={formData.totalOrderPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({...formData, totalOrderPrice: Number(value)});
                        }}
                        styles={{ht:'36px'}}
                        type="number"
                        className="!w-[150px]"
                      />
                      원
                    </div>
                    {/* <Button
                      className="w-109 h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                      onClick={()=>{
                        if(edit) {
                          handleEditOrder(newProducts);
                        } else {
                          handleSubmitOrder(newProducts);
                        }
                      }}
                    >
                      <Arrow /> 전체 저장
                    </Button> */}
                  </div>
                  <DividerH />
                  <SalesModelTable
                    data={newProducts}
                    setData={setNewProducts}
                    selectId={selectId}
                    newFlag={newFlag}
                    setDeleted={setDeleted}
                    inputRef={inputRef}
                    handleSubmitOrderModel={(model:salesOrderProcuctCUType)=>{
                      if(edit) {
                        handleEditOrder(model);
                      } else {
                        handleSubmitOrder(model);
                      }
                    }}
                  />
                  <div className="w-full h-1 border-t-1"/>
                    <div className="pt-5 pb-5 gap-4 justify-center h-center cursor-pointer" style={{border:"1px dashed #4880FF"}} 
                      onClick={() => {
                        setNewProducts((prev: salesOrderProcuctCUType[]) =>[
                          ...prev,
                          {
                            ...newDataSalesOrderProductCUType(),
                            id:'new-'+prev.length+1,
                            index: newProducts.length+1
                          },
                        ]);
                        setViewKey(newProducts.length+1);
                      }}
                    >
                    <SplusIcon/>
                    <span>모델 추가하기</span>
                  </div>
                </div>
              </div>
            </div> }
          </div>
        </div>

        {/* 우측 탭 */}
        <div className="min-w-[80px] w-[3%] h-[calc(100vh-192px)] px-10 py-20 h-center flex-col bg-white rounded-l-14 gap-20" key="contents-tab">
          <div 
            className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
            onClick={()=>{
              setModelDrawerOpen(true);
            }}
          >
            <p className="w-20 h-20"><Category /></p>
          </div>
        </div>

        {/* 모델 목록 드로워 */}
        <AntdDrawer
          open={modelDrawerOpen}
          close={()=>{setModelDrawerOpen(false);}}
        >
          <div className="w-full px-20 py-30 flex flex-col gap-20">
            <div className="v-between-h-center">
              <LabelMedium label="모델 목록" />
              <div className="cursor-pointer" onClick={() => setModelDrawerOpen(false)}>
                <Close/>
              </div>
            </div>
            <ModelList
              type="order"
              models={models}
              setModels={setModels}
              products={newProducts}
              setProductsOrder={setNewProducts}
              selectId={selectId}
              setSelectId={setSelectId}
              setNewFlag={setNewFlag}
              setDrawerOpen={setModelDrawerOpen}
              partnerId={formData.partnerId}
            />
          </div>
        </AntdDrawer>

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
          type={alertType === "discard" ? "success" : "warning"}
          title={
            alertType === "del" ? "해당 모델을 정말 삭제하시겠습니까?" :
            // alertType === "cancle" ? "해당 발주를 폐기하시겠습니까?" :
            alertType === "cancle" ? "해당 발주를 취소하시겠습니까?" :
            alertType === "close" ? "저장되지 않은 모델 정보 또는 미등록된 고객 발주 정보가 있습니다." :
            alertType === "discard" ? "고객 발주 폐기 성공" : ""
          }
          contents={
            alertType === "del" ? <div>이미 등록된 모델을 삭제하실 경우 모델 등록 대기에서도 사라집니다.<br/>정말 삭제하시겠습니까?</div> :
            alertType === "cancle" ? <>해당 발주를 취소할 경우 하위에 등록된 모델도 폐기됩니다.<br/>정말 폐기하시겠습니까?</> :
            alertType === "close" ? <>저장하지 않고 나가시면 해당 정보는 삭제됩니다.<br/>정말 나가시겠습니까?</> :
            alertType === "discard" ? <>고객 발주 폐기가 완료되었습니다.</> : <></>
          }
          onOk={()=>{
            if(alertType === "del") {
              handleDelete();
              setDeleted(false);
            } else if(alertType === "cancle") {
              handleDeleteOrder();
            } else if(alertType === "discard" || alertType === "close") {
              router.push('/sales/order');
            }

            setAlertOpen(false);
          }}
          onCancle={()=>{
            setAlertOpen(false);
            setDeleted(false);
          }}
          hideCancel={alertType === "discard" ? true : false}
          okText={
            alertType === "del" ? "네 삭제할래요" :
            alertType === "cancle" ? "네 폐기할래요" :
            alertType === "close" ? "그래도 나갈게요" :
            alertType === "discard" ? "목록으로 이동" : ""
          }
          cancelText={
            alertType === "del" ? "아니요 삭제 안할래요" :
            alertType === "close" ? "아니요 이어서 작성할게요" :
            alertType === "cancle" ? "아니요 폐기 안할래요" : ""}
        />

        <ToastContainer />
      </div>
    </div>
  </>)
}

export default OrderAddLayout;