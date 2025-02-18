import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { Button, Empty, Radio, Steps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { getPrtCsAPI } from "@/api/cache/client";

import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { DividerH, DividerV } from "@/components/Divider/Divider";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import { LabelIcon, LabelMedium, LabelThin } from "@/components/Text/Label";
import AntdDragger from "@/components/Upload/AntdDragger";
import AntdTableEdit from "@/components/List/AntdTableEdit";

import PrtMngAddModal from "@/contents/partner/PrtMngAddModal";

import {
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
import { changeOrderEdit, changeOrderNew } from "@/data/type/sales/changeData";
import { useUser } from "@/data/context/UserContext";
import { salesUserOrderModelClmn } from "@/data/columns/Sales";

import Edit from "@/assets/svg/icons/memo.svg"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Back from "@/assets/svg/icons/back.svg";
import Category from "@/assets/svg/icons/category.svg";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { inputTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";
import { useModels } from "@/data/context/ModelContext";
import SalesOrderContent from "./SalesOrderContent";
import CsMngContent from "./CsMngContent";
import ModelTable from "@/components/ModelTable/ModelTable";

const OrderAddLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const { me } = useUser();

  const { showToast, ToastContainer } = useToast();

  const { models } = useModels();

  // 스탭 저장 변수
  const [ stepCurrent, setStepCurrent ] = useState<number>(0);
  // 발주 저장 변수
  const [ formData, setFormData ] = useState<salesOrderCUType>(newDataSalesOrderCUType);
  // 모델 저장 변수
  const [ newProducts, setNewProducts ] = useState<salesOrderProcuctCUType[]>([newDataSalesOrderProductCUType()]);
  // 수정 시 필요 변수
  const [ edit, setEdit ] = useState<boolean>(false);
  // 발주 내 첨부파일
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);

  // ----------- 거래처 데이터 세팅 ----------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<partnerMngRType>>([]);
  const { data:cs } = useQuery({
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
      if (mng && mng.length > 0) {
        // 담당자가 있을 경우 첫번째 담당자 자동 세팅
        setFormData({...formData, partnerManagerId:mng[0].id});
      }else{
        setFormData({...formData, partnerManagerId:''});
      }
    }
  }, [formData.partnerId])
  
  const [ open, setOpen ] = useState<boolean>(false);
  // ----------- 거래처 데이터 세팅 ----------- 끝
  
  // -------------- 수정 세팅 -------------- 시작
    // id가 NEW일 경우 수정 모드
  useEffect(()=>{
    if(id?.includes("new")) setEdit(false);
    else {
      setEdit(true);
      fetchDetail();
    }
  }, [id]);

    // 데이터 세팅
  const fetchDetail = async () => {
    const result = await getAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `sales-order/detail/jsxcrud/one/${id}`
    });

    if(result.resultCode === "OK_0000") {
      const data = result.data.data as salesOrderDetailRType;
      setFormData({
        id: data.id,
        partnerId: data.prtInfo.prt.id,
        partnerManagerId: data.prtInfo.mng.id,
        orderName: data.orderNm,
        orderDt: dayjs(data.orderDt, 'YYYY-MM-DD'),
        orderRepDt: data.orderRepDt,
        orderTxt: data.orderTxt,
        totalOrderPrice: data.totalOrderPrice,
        empId: data.emp.id,
        hotGrade: data.hotGrade ?? HotGrade.NORMAL,
        files: data.files.map((file) => { return file.storageId }),
      });
      setNewProducts(data.products
        .filter((prd:salesOrderProductRType) => prd.glbStatus.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
        .map((prd: salesOrderProductRType) => ({
          id: prd.id,
          currPrdInfo: JSON.parse(prd.currPrdInfo),
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
      setStepCurrent(1);
    }
  }

  const [deleted, setDeleted] = useState<boolean>(false);
  const handleDelete = async () => {
    const deletedData = newProducts.filter(f => f.disabled)
    console.log(deletedData);

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
        }
      })
    }
  }
  
  useEffect(()=>{
    if(deleted) {
      showToast("모델 저장을 하여야 모델 삭제가 저장됩니다.", "info");
      // handleDelete();
    }
  }, [deleted])
  const handleEditOrder = async () => {
    // 삭제 시 실행
    if(deleted) {
      handleDelete();
    }

    const jsonData = changeOrderEdit(formData, newProducts, me);
    console.log(JSON.stringify(jsonData));

    // 발주 내 필수 값 입력 체크
    const ordVal = validReq(jsonData.order, salesOrderReq());
    if(!ordVal.isValid) {
      showToast(ordVal.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    // 모델 내 수정 필수 값 입력 체크
    const prdValUp = validReq(jsonData.products.update, salesOrderProcuctReq());
    if(!prdValUp.isValid) {
      showToast(prdValUp.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    // 모델 내 생성 필수 값 입력 체크
    const prdValCr = validReq(jsonData.products.create, salesOrderProcuctReq());
    if(!prdValCr.isValid) {
      showToast(prdValCr.missingLabels+'은(는) 필수 입력입니다.', "error");
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
      // refetch();
      // setOpen(false);
      // handleCloseOrder();
      showToast("고객 발주 수정이 완료되었습니다.", "success");
    } else {
      console.log(result);
      const msg = result?.response?.data?.message;
      // setOpen(false);
      // handleCloseOrder();
      showToast(msg, "error");
    }
  }
  // -------------- 수정 세팅 -------------- 끝

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

    // 신규 등록 시 실행 함수
  const handleSubmitOrder = async () => {
    const jsonData = changeOrderNew(formData, newProducts, me);
    console.log(JSON.stringify(jsonData));

    // 모델 내 필수 값 입력 체크
    const prdVal = validReq(jsonData.products, salesOrderProcuctReq());
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
      console.log('ok');
      setOpen(false);
      showToast("고객 발주가 완료되었습니다.", "success");
    } else {
      const msg = result?.response?.data?.message;
      setOpen(false);
      showToast(msg, "error");
    }
  }

  return (
  <div className="h-center gap-20">
    <div className="w-[calc(100vw-100px)]">
      {/* 스탭 */}
      <div className="w-full h-80 p-30 v-between-h-center">
        <Steps current={stepCurrent} items={[{title:'고객 발주 등록'}, {title:'고객 발주 모델 등록'}]} />
      </div>
      
      {/* 왼쪽 컨텐츠 */}
      <div className="w-full !h-[calc(100vh-272px)] overflow-y-auto">
        {/* 고객 발주 컨텐츠 */}
        <SalesOrderContent
          csList={csList}
          formData={formData}
          setFormData={setFormData}
          fileList={fileList}
          setFileList={setFileList}
          fileIdList={fileIdList}
          setFileIdList={setFileIdList}
        />

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
          <Button 
            className="w-80 h-32 rounded-6"
            style={{color:"#444444E0"}}
            onClick={() => {
              setOpen(false);
              setFormData(newDataSalesOrderCUType)
              setEdit(false);
            }}
          >
            <Close/> 취소
          </Button>
          {stepCurrent < 1 ?
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
            </Button> :
            <Button 
              className="w-109 h-32 bg-point1 text-white rounded-6"
              style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={handleEditOrder}
            >
              <Arrow /> 수정
            </Button>
            }
        </div>

      {
        // 모델 등록
        stepCurrent > 0 ?
        <div className="flex w-full relative pl-10">
          <div className="w-full">

            <ModelTable
              type="order"
              data={newProducts}
              setData={setNewProducts}
              selectId=""
              newFlag={false}
            />
            
            <div className="w-full flex flex-col bg-white rounded-14 overflow-auto px-20 py-30 gap-20">
              <div className=""><LabelMedium label="모델 등록"/></div>
              <div className="w-full h-1 border-t-1"/>
                <AntdTableEdit
                  create={true}
                  columns={salesUserOrderModelClmn(newProducts, setNewProducts, setDeleted)}
                  data={newProducts}
                  setData={setNewProducts}
                  styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
                />
                <div className="pt-5 pb-5 gap-4 justify-center h-center cursor-pointer" style={{border:"1px dashed #4880FF"}} 
                  onClick={() => {
                    setNewProducts((prev: salesOrderProcuctCUType[]) =>[
                      ...prev,
                      {...newDataSalesOrderProductCUType(), id:'new-'+prev.length+1}
                    ]);
                  }}
                >
                <SplusIcon/>
                <span>모델 추가하기</span>
              </div>
              <div className="flex w-full h-50 v-between-h-center">
                <Button
                  className="w-109 h-32 rounded-6"
                  onClick={()=>{
                    setStepCurrent(0);
                  }}
                >
                  <p className="w-16 h-16 text-[#222222]"><Back /></p> 이전단계
                </Button>
                <Button
                  className="w-109 h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                  onClick={()=>{
                    if(edit) {
                      handleEditOrder();
                    } else {
                      handleSubmitOrder();
                    }
                  }}
                >
                  <Arrow /> { edit ? '모델수정' : '모델저장'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        :<></>
      }
      </div>
    </div>

    <div className="min-w-[80px] w-[3%] h-[calc(100vh-192px)] px-10 py-20 h-center flex-col bg-white rounded-l-14 gap-20" key="contents-tab">
      <div 
        className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
        onClick={()=>{
          // setSelectTabDrawer(2);
          // setDrawerOpen(true);
        }}
      >
        <p className="w-20 h-20"><Category /></p>
      </div>
    </div>

    <ToastContainer />
  </div>
  )
}

export default OrderAddLayout;