import dayjs from "dayjs";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { getPrtCsAPI } from "@/api/cache/client";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Back from "@/assets/svg/icons/back.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import DragHandle from "@/assets/svg/icons/dragHandlevert.svg";

import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";

import { 
  newDataSalesOrderCUType, 
  newDataSalesOrderProductCUType, 
  salesOrderCUType, 
  salesOrderDetailRType, 
  salesOrderProcuctCUType, 
  salesOrderProcuctReq, 
  salesOrderProductRType, 
  salesOrderReq, 
  salesOrderRType 
} from "@/data/type/sales/order";
import { salesUserOrderClmn, salesUserOrderModelClmn } from "@/data/columns/Sales";
import { useUser } from "@/data/context/UserContext";
import { 
  partnerMngRType, 
  partnerRType 
} from "@/data/type/base/partner";
import { HotGrade, SalesOrderStatus } from "@/data/type/enum";

import useToast from "@/utils/useToast";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AddOrderContents from "@/contents/sales/user/modal/AddOrderContents";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { AntdModalStep2 } from "@/components/Modal/AntdModalStep";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import ModelDrawerContent from "@/contents/sayang/model/add/ModelDrawerContent";
import { LabelMedium } from "@/components/Text/Label";
import { changeOrderEdit, changeOrderNew } from "@/data/type/sales/changeData";
import { patchAPI } from "@/api/patch";

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { me } = useUser();

  const { showToast, ToastContainer } = useToast();
  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  useEffect(()=>{console.log(pagination)},[pagination]);

  const [ data, setData ] = useState<Array<salesOrderRType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['salesUserPage', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      setData(queryData?.data.data ?? []);
      setTotalData(queryData?.data.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------- 시작
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
  // ------------- 필요 데이터 세팅 ------------- 끝

  // --------------- 고객 발주  --------------- 시작
    // 현 스탭 및 스탭 타이틀
  const [ stepCurrent, setStepCurrent ] = useState<number>(0);
  const stepItems = [{title:'고객 발주 등록'}, {title:'고객 발주 모델 등록'}];
    // 모달창 닫기 눌렀을 때 실행 함수
  function stepModalClose(){
    setOpen(false);
    handleCloseOrder();
  }
    // 고객 발주 모달창 OPEN
  const [ open, setOpen ] = useState<boolean>(false);
    // 발주 저장 변수
  const [ formData, setFormData ] = useState<salesOrderCUType>(newDataSalesOrderCUType);
    // 모델 저장 변수
  const [ newProducts, setNewProducts ] = useState<salesOrderProcuctCUType[]>([newDataSalesOrderProductCUType()]);
    // 수정 시 필요 변수
  const [ edit, setEdit ] = useState<boolean>(false);
  const [ detailId, setDetailId ] = useState<string>("");
  
    // 수정 시 데이터 세팅
  const fetchDetail = async () => {
    const result = await getAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `sales-order/detail/jsxcrud/one/${detailId}`
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
      setOpen(true);
    }
  }
  useEffect(()=>{
    if(edit && detailId !== "") {
      fetchDetail();
    }
  }, [edit])

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

    // 발주 내 첨부파일
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);
    // 첨부파일 변경 시 FORM에 세팅
  useEffect(()=>{
    setFormData({ ...formData, files:fileIdList });
  }, [fileIdList]);

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

  const handleCloseOrder = () => {
    //값 초기화
    setCsMngList([]);
    setStepCurrent(0);
    setEdit(false);
    setDetailId("");
    setFormData(newDataSalesOrderCUType);
    setNewProducts([newDataSalesOrderProductCUType()]);
    setFileList([]);
    setFileIdList([]);
    setDeleted(false);
    refetch();
  }

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
      refetch();
      setOpen(false);
      handleCloseOrder();

      showToast("고객 발주가 완료되었습니다.", "success");
    } else {
      const msg = result?.response?.data?.message;
      setOpen(false);
      handleCloseOrder();
      showToast(msg, "error");
    }
  }

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
  // --------------- 고객 발주  --------------- 끝

  // ---------------- 거래처  ---------------- 시작
    // 리스트 내 거래처
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);

    // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!drawerOpen) {
      setPartnerData(null);
      setPartnerMngData(null);
    }
  }, [drawerOpen]);
  // ---------------- 거래처  ---------------- 끝

  const [orderId, setOrderId] = useState<string>('');
  const [orderDrawer, setOrderDrawer] = useState<boolean>(false);
  
  // 모델 등록 드래그 앤 드롭으로 크기 조절
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const handleModelMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = startX - moveEvent.clientX; // 왼쪽으로 이동 → diffX 증가
      const newWidth = startWidth + diffX;
      if (newWidth >= 100 && newWidth <= 1100) { // 최소/최대 너비 제한
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
    
          // if(result.resultCode === "OK_0000") {
          //   showToast("삭제 완료", "success");
          // } else {
          //   const msg = result?.response?.data?.message;
          //   showToast(msg, "error");
          // }
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

  return (
    <>
      <ListTitleBtn 
        label="신규"
        onClick={()=>{setOpen(true)}}
        icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
      />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
      />

      <List>
        <AntdTableEdit
          columns={salesUserOrderClmn(
            totalData,
            setEdit,
            setDetailId,
            setPartnerData,
            setPartnerMngData,
            pagination,
            setOrderId,
            setOrderDrawer,
          )}
          data={data}
          styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          loading={dataLoading}
        />
      </List>

      <AntdModalStep2
        open={open}
        setOpen={setOpen}
        items={stepItems}
        current={stepCurrent}
        onClose={stepModalClose}
        width={1300}
        contents={
        <div className="flex h-full overflow-x-hidden">
          <div style={{width:stepCurrent>0 ? `calc(100% - ${width});`:'100%'}} className="overflow-x-auto">
            <AddOrderContents
              csList={csList}
              csMngList={csMngList}
              setCsMngList={setCsMngList}
              fileList={fileList}
              fileIdList={fileIdList}
              setFileList={setFileList}
              setFileIdList={setFileIdList}
              setOpen={setOpen}
              formData={formData}
              setFormData={setFormData}
              stepCurrent={stepCurrent}
              setStepCurrent={setStepCurrent}
              setEdit={setEdit}
              handleEditOrder={handleEditOrder}
            />
          </div>
          {
            // 모델 등록
            stepCurrent > 0 ?
            <div ref={containerRef} className="flex relative pl-10" style={{width:`${width}px`}}>
              <div className="absolute top-0 left-0 h-full w-10 cursor-col-resize hover:bg-gray-200 h-center" onMouseDown={handleModelMouseDown}>
                <DragHandle />
              </div>
              <div className="w-full">
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
                        if(edit && detailId !== "") {
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
        </div>}
      />

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? formData.partnerId ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
        prtSuccessFn={()=>{
          refetch();
          csRefetch();
          showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
        }}
        prtMngSuccessFn={(entity:partnerMngRType)=>{
          csRefetch();
        }}
      />

      <AntdDrawer
        open={orderDrawer}
        close={()=>{setOrderDrawer(false); setOrderId('')}}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div className="v-between-h-center">
            <p className="text-16 font-medium">고객 발주 정보</p>
            <div className="flex justify-end cursor-pointer" onClick={() => setOrderDrawer(false)}><Close/></div>
          </div>
          <ModelDrawerContent orderId={orderId} />
        </div>
      </AntdDrawer>
      
      <ToastContainer />
    </>
  )
};

SalesUserPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/order' },
      { text: '견적', link: '/sales/user/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserPage;