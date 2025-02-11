import dayjs from "dayjs";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { getPrtCsAPI } from "@/api/cache/client";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Back from "@/assets/svg/icons/back.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Edit from "@/assets/svg/icons/memo.svg";
import Plus from "@/assets/svg/icons/s_plus.svg";
import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";

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
  partnerCUType, 
  partnerMngRType, 
  partnerRType 
} from "@/data/type/base/partner";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import InputList from "@/components/List/InputList";
import AntdModal from "@/components/Modal/AntdModal";
import AddOrderContents from "@/contents/sales/user/modal/AddOrderContents";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import { AntdModalStep2 } from "@/components/Modal/AntdModalStep";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import CardList from "@/components/List/CardList";
import { MOCK } from "@/utils/Mock";
import CardInputList from "@/components/List/CardInputList";
import AntdEditModal from "@/components/Modal/AntdEditModal";

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
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

  const [ data, setData ] = useState<Array<salesOrderRType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['salesUserPage'],
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
    // ME = EMP
  const { me } = useUser();

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
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
  const [ resultMsg, setResultMsg ] = useState<string>('');
  
    // 발주 저장 변수
  const [ formData, setFormData ] = useState<salesOrderCUType>(newDataSalesOrderCUType);
    // 모델 저장 변수
  const [ newProducts, setNewProducts ] = useState<salesOrderProcuctCUType[]>([
    // {...newDataSalesOrderProductCUType(), id:'new-1'}
  ]);
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
        hotGrade: data.hotGrade,
        files: data.files.map((file) => { return file.storageId }),
      });
      setNewProducts(data.products.map((prd: salesOrderProductRType) => ({
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
        orderPrdHotGrade: prd.orderPrdHotGrade,
      })));
      setStepCurrent(1);
      setOpen(true);
    }
  }
  useEffect(()=>{
    console.log(edit);
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
  }

    // 신규 등록 시 실행 함수
  const handleSubmitOrder = async () => {
    const jsonData = {
      ...formData,
      orderName: newProducts.length > 0 ? newProducts[0].orderTit+'외 '+newProducts.length+'건' : dayjs().format('YYYY/MM/DD')+'-'+me?.userName,
      orderRepDt: new Date(),
      empId: me?.id,
      products: newProducts.map((product:salesOrderProcuctCUType, index:number) => ({
        customPartnerManagerId: formData.partnerManagerId,
        currPrdInfo: product.currPrdInfo,
        modelId: product.modelId,
        modelStatus: product.modelStatus,
        orderDt: formData.orderDt,
        // orderNo: index.toString(),
        orderTit: product.orderTit,
        prtOrderNo: product.prtOrderNo,
        orderPrdRemark: product.orderPrdRemark,
        orderPrdCnt: product.orderPrdCnt,
        orderPrdUnitPrice: product.orderPrdUnitPrice,
        orderPrdPrice: product.orderPrdPrice,
        orderPrdDueReqDt: product.orderPrdDueReqDt,
        orderPrdDueDt: product.orderPrdDueDt,
        orderPrdHotGrade: formData.hotGrade,
      }))
    } as salesOrderCUType;
    console.log(JSON.stringify(jsonData));

    // 모델 내 필수 값 입력 체크
    const prdVal = validReq(jsonData.products, salesOrderProcuctReq());
    if(!prdVal.isValid) {
      setResultMsg(prdVal.missingLabels+'은(는) 필수 입력입니다.');
      setResultType("error");
      setResultOpen(true);
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
      setResultType("success");
      setResultMsg("고객 발주가 완료되었습니다.");
      setResultOpen(true);
      handleCloseOrder();
    } else {
      console.log(result);
      setOpen(false);
      setResultType("error");
      setResultMsg("고객 발주가 실패하였습니다.");
      setResultOpen(true);
      handleCloseOrder();
    }
  }

  const handleEditOrder = async () => {
    const jsonData = {
      order: {
        id: formData.id,
        partnerId: formData.partnerId,
        partnerManagerId: formData.partnerManagerId,
        orderName: newProducts.length > 0 ? newProducts[0].orderTit+' 외 '+newProducts.length+'건' : dayjs().format('YYYY/MM/DD')+'-'+me?.userName,
        totalOrderPrice: formData.totalOrderPrice,
        orderDt: formData.orderDt,
        orderRepDt: formData.orderRepDt,
        orderTxt: formData.orderTxt,
        empId: me?.id,
        hotGrade: formData.hotGrade,
        files: formData.files,
      },
      products: {
        create: newProducts.filter(f=>f.id?.includes('new')).map((prd:salesOrderProcuctCUType, index:number) => ({
          currPrdInfo: prd.currPrdInfo,
          modelId: prd.modelId,
          modelStatus: prd.modelStatus,
          orderDt: formData.orderDt,
          // orderNo: index.toString(),
          orderTit: prd.orderTit,
          prtOrderNo: prd.prtOrderNo,
          orderPrdRemark: prd.orderPrdRemark,
          orderPrdCnt: prd.orderPrdCnt,
          orderPrdUnitPrice: prd.orderPrdUnitPrice,
          orderPrdPrice: prd.orderPrdPrice,
          orderPrdDueReqDt: prd.orderPrdDueReqDt,
          orderPrdDueDt: prd.orderPrdDueDt,
          orderPrdHotGrade: formData.hotGrade,
        })),
        update: newProducts.filter(f=>!f.id?.includes('new')).map((prd:salesOrderProcuctCUType, index:number) => ({
          id: prd.id,
          currPrdInfo: prd.currPrdInfo,
          modelStatus: prd.modelStatus,
          orderDt: formData.orderDt,
          // orderNo: index.toString(),
          orderTit: prd.orderTit,
          prtOrderNo: prd.prtOrderNo,
          orderPrdRemark: prd.orderPrdRemark,
          orderPrdCnt: prd.orderPrdCnt,
          orderPrdUnitPrice: prd.orderPrdUnitPrice,
          orderPrdPrice: prd.orderPrdPrice,
          orderPrdDueReqDt: prd.orderPrdDueReqDt,
          orderPrdDueDt: prd.orderPrdDueDt,
          orderPrdHotGrade: formData.hotGrade,
        }))
      }
    }
    console.log(JSON.stringify(jsonData));

    // 발주 내 필수 값 입력 체크
    const ordVal = validReq(jsonData.order, salesOrderReq());
    if(!ordVal.isValid) {
      setResultMsg(ordVal.missingLabels+'은(는) 필수 입력입니다.');
      setResultType("error");
      setResultOpen(true);
      return;
    }

    // 모델 내 필수 값 입력 체크
    const prdVal = validReq(jsonData.products.update, salesOrderProcuctReq());
    if(!prdVal.isValid) {
      setResultMsg(prdVal.missingLabels+'은(는) 필수 입력입니다.');
      setResultType("error");
      setResultOpen(true);
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
      console.log('ok');
      refetch();
      setOpen(false);
      setResultType("success");
      setResultMsg("고객 발주 수정이 완료되었습니다.");
      setResultOpen(true);
      handleCloseOrder();
    } else {
      console.log(result);
      setOpen(false);
      setResultType("error");
      setResultMsg("고객 발주 수정이 실패하였습니다.");
      setResultOpen(true);
      handleCloseOrder();
    }
  }
  // --------------- 고객 발주  --------------- 끝

  // ---------------- 거래처  ---------------- 시작
    // 리스트 내 거래처
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ drawerPrtItems, setDrawerPrtItems ] = useState<Array<any>>([]);
  const [ drawerMngItems, setDrawerMngItems ] = useState<Array<any>>([]);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);

    // Drawer 내 수정 클릭 시 거래처 설정
  const [ newPrtOpen, setNewPrtOpen ] = useState<boolean>(false);
  const [ newPartnerData, setNewPartnerData ] = useState<partnerRType | null>(null);
  // Drawer 내 수정 클릭 시 거래처 담당자 설정 모달 OPEN
  const [ newPrtMngOpen, setNewPrtMngOpen ] = useState<boolean>(false);
  const [ newPartnerMngData, setNewPartnerMngData ] = useState<partnerMngRType | null>(null);
  
    // 거래처 설정 값 변경 시 실행 함수
  const handlePrtDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    console.log(type, name, e);
    let value = e;
    if(type === "input" && typeof e !== "string") {
      value = e.target.value;
    }

    if(key) {
      setNewPartnerData(prev => ({
        ...prev,
        [name]: {
          [key]: e.toString(),
        },
      } as partnerRType));
    } else {
      setNewPartnerData(prev => ({
        ...prev,
        [name]: e,
      } as partnerRType));
    }
  }

    // 거래처 설정 저장 시 실행 함수
  const handleSubmitPrtData = async () => {
    try {
      const result = await patchAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        partnerData?.id ?? '0',
        { prtTypeEm: 'cs',
          prtNm: partnerData?.prtNm,
          prtRegCd: partnerData?.prtRegCd,
          prtSnm: partnerData?.prtSnm,
          prtEngNm: partnerData?.prtEngNm,
          prtEngSnm: partnerData?.prtEngSnm,
          prtRegNo: partnerData?.prtRegNo,
          prtCorpRegNo: partnerData?.prtCorpRegNo,
          prtBizType: partnerData?.prtBizType,
          prtBizCate: partnerData?.prtBizCate,
          prtAddr: partnerData?.prtAddr,
          prtAddrDtl: partnerData?.prtAddrDtl,
          prtCeo: partnerData?.prtCeo,
          prtTel: partnerData?.prtTel,
          prtFax: partnerData?.prtFax,
          prtEmail: partnerData?.prtEmail } as partnerCUType
      );
      
      if(result.resultCode === "OK_0000") {
        refetch();
        csRefetch();
      }
    } catch(e) {
      console.log('catch error : ', e);
    }
  }
  // ---------------- 거래처  ---------------- 끝

  function openPrtDrawer(){
    console.log(partnerData)
    // const prtItems = [
    //   { label: '거래처명', value: partnerData?.prtNm ?? '-', widthType: 'full' },
    //   { label: '거래처 식별코드', value: partnerData?.prtRegCd ?? '-', widthType: 'half' },
    //   { label: '거래처 축약명', value: partnerData?.prtSnm ?? '-', widthType: 'half' },
    //   { label: '거래처 영문명', value: partnerData?.prtEngNm ?? '-', widthType: 'half' },
    //   { label: '거래처 영문 축약명', value: partnerData?.prtEngSnm ?? '-', widthType: 'half' },
    //   { label: '사업자등록번호', value: partnerData?.prtRegNo ?? '-', widthType: 'half' },
    //   { label: '법인등록번호', value: partnerData?.prtCorpRegNo ?? '-', widthType: 'half' },
    //   { label: '업태', value: partnerData?.prtBizwidthType ?? '-', widthType: 'half' },
    //   { label: '업종', value: partnerData?.prtBizCate ?? '-', widthType: 'half' },
    //   { label: '주소', value: `${partnerData?.prtAddr ?? '-'} ${partnerData?.prtAddrDtl ?? '-'}`, widthType: 'full' },
    //   { label: '대표자명', value: partnerData?.prtCeo ?? '-', widthType: 'half' },
    //   { label: '전화번호', value: partnerData?.prtTel ?? '-', widthType: 'half' },
    //   { label: '팩스번호', value: partnerData?.prtFax ?? '-', widthType: 'half' },
    //   { label: '이메일', value: partnerData?.prtEmail ?? '-', widthType: 'half' },
      
    // ];
    // const mngItems = [
    //   { label: '담당자명', value: partnerMngData?.prtMngNm ?? '-', widthType: 'full' },
    //   { label: '부서명', value: partnerMngData?.prtMngDeptNm ?? '-', widthType: 'half' },
    //   { label: '팀명', value: partnerMngData?.prtMngTeamNm ?? '-', widthType: 'half' },
    //   { label: '전화번호', value: partnerMngData?.prtMngTel ?? '-', widthType: 'half' },
    //   { label: '휴대번호', value: partnerMngData?.prtMngMobile ?? '-', widthType: 'half' },
    //   { label: '팩스번호', value: partnerMngData?.prtMngFax ?? '-', widthType: 'half' },
    //   { label: '이메일', value: partnerMngData?.prtMngEmail ?? '-', widthType: 'half' },
    // ]
    setDrawerPrtItems(MOCK.prtItems);
    setDrawerMngItems(MOCK.mngItems);
    setDrawerOpen(true);
  }

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
      />

      <List>
        <AntdTableEdit
          columns={salesUserOrderClmn(
            totalData,
            openPrtDrawer,
            setEdit,
            setDetailId,
            setPartnerData,
            setPartnerMngData,
          )}
          data={data}
          styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
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
        <div className="flex gap-10 h-full">
          <div style={{width:stepCurrent>0?500:'100%'}} className="overflow-x-auto">
            <AddOrderContents
              csList={csList}
              csMngList={csMngList}
              fileList={fileList}
              fileIdList={fileIdList}
              setFileList={setFileList}
              setFileIdList={setFileIdList}
              setOpen={setOpen}
              formData={formData}
              setFormData={setFormData}
              stepCurrent={stepCurrent}
              setEdit={setEdit}
              handleNextStep={()=>{
                const orderVal = validReq(formData, salesOrderReq());
                if(!orderVal.isValid) {
                  setResultMsg(orderVal.missingLabels+'은(는) 필수 입력입니다.');
                  setResultType("error");
                  setResultOpen(true);
                } else {
                  setStepCurrent(1);
                }
              }}
              handleEditOrder={handleEditOrder}
            />
          </div>
          {
            // 모델 등록
            stepCurrent > 0 ?
            <div className="h-full flex flex-col">
              <div className="w-full flex-1 bg-white rounded-14 overflow-auto p-10">
                <AntdTableEdit
                  create={true}
                  columns={salesUserOrderModelClmn(newProducts, setNewProducts)}
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
                  <Arrow /> { edit ? '모델수정' : '모델등록'}
                </Button>
              </div>
            </div>
            :<></>
          }
        </div>}
      />

      <AntdDrawer
        open={drawerOpen}
        close={()=>{setDrawerOpen(false)}}
        width={600}
        maskClosable={false}
        mask={false}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div className="flex w-full justify-end cursor-pointer" onClick={() => setDrawerOpen(false)}><Close/></div>
          <CardList title="고객정보" 
            btnLabel={<div className="flex h-center gap-8"><span className="w-16 h-16"><Edit/></span> 고객 정보 수정</div>} 
            items={drawerPrtItems} btnClick={() => setNewPrtOpen(true)}/>
          <CardList title="담당자정보" 
            btnLabel={<div className="flex h-center gap-8"><span className="w-16 h-16"><Plus/></span> 담당자 추가</div>} 
            items={drawerMngItems} btnClick={() => setNewPrtMngOpen(true)}/>
        </div>
        {/* <div onClick={()=>{setNewPrtOpen(true);}}>수정</div>
        <div>
          거래처명 : {partnerData?.prtNm ?? '-'}<br/>
          식별코드 : {partnerData?.prtRegCd ?? '-'}<br/>
          축약명 : {partnerData?.prtSnm ?? '-'}<br/>
          영문명 : {partnerData?.prtEngNm ?? '-'}<br/>
          영문 축약 : {partnerData?.prtEngSnm ?? '-'}<br/>
          사업자 : {partnerData?.prtRegNo ?? '-'}<br/>
          법인 : {partnerData?.prtCorpRegNo ?? '-'}<br/>
          업태 : {partnerData?.prtBizType ?? '-'}<br/>
          업종 : {partnerData?.prtBizCate ?? '-'}<br/>
          주소 : {partnerData?.prtAddr ?? '-'}<br/>
          주소세부 : {partnerData?.prtAddrDtl ?? '-'}<br/>
          대표 : {partnerData?.prtCeo ?? '-'}<br/>
          전화 : {partnerData?.prtTel ?? '-'}<br/>
          팩스 : {partnerData?.prtFax ?? '-'}<br/>
          이메일 : {partnerData?.prtEmail ?? '-'}<br/>
        </div>
        <div onClick={()=>{setNewPrtMngOpen(true);}}>수정</div>
        <div>
          담당자명 : {partnerMngData?.prtMngNm}<br/>
          부서 : {partnerMngData?.prtMngDeptNm}<br/>
          팀 : {partnerMngData?.prtMngTeamNm}<br/>
          전화 : {partnerMngData?.prtMngTel}<br/>
          휴대 : {partnerMngData?.prtMngMobile}<br/>
          이메일 : {partnerMngData?.prtMngEmail}<br/>
          팩스 : {partnerMngData?.prtMngFax}<br/>
        </div> */}
      </AntdDrawer>

      <AntdEditModal
        open={newPrtOpen}
        setOpen={setNewPrtOpen}
        width={760}
        contents={
          <>
          <CardInputList title="고객정보 수정" 
            btnLabel={
              <Button type="primary" size="large" onClick={handleSubmitPrtData} 
                className="w-full flex h-center gap-8 !h-full" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <TrArrow/>
                <span>저장</span>
              </Button>
            }
            items={
              [
                {value:partnerData?.prtNm,name:'prtNm',label:'거래처명', type:'input', widthType:'full'},
                {value:partnerData?.prtRegCd,name:'prtRegCd',label:'식별코드', type:'input', widthType:'half'},
                {value:partnerData?.prtSnm,name:'prtSnm',label:'축약명', type:'input', widthType:'half'},
                {value:partnerData?.prtEngNm,name:'prtEngNm',label:'영문명', type:'input', widthType:'half'},
                {value:partnerData?.prtEngSnm,name:'prtEngSnm',label:'영문축약', type:'input', widthType:'half'},
                {value:partnerData?.prtRegNo,name:'prtRegNo',label:'사업자', type:'input', widthType:'half'},
                {value:partnerData?.prtCorpRegNo,name:'prtCorpRegNo',label:'법인', type:'input', widthType:'half'},
                {value:partnerData?.prtBizType,name:'prtBizType',label:'업태', type:'input', widthType:'half'},
                {value:partnerData?.prtBizCate,name:'prtBizCate',label:'업종', type:'input', widthType:'half'},
                {value:partnerData?.prtAddr,name:'prtAddr',label:'주소', type:'btnInput', widthType:'full'},
                {value:partnerData?.prtAddrDtl,name:'prtAddrDtl',label:'주소세부', type:'input', widthType:'full'},
                {value:partnerData?.prtCeo,name:'prtCeo',label:'대표', type:'input', widthType:'half'},
                {value:partnerData?.prtTel,name:'prtTel',label:'전화', type:'input', widthType:'half'},
                {value:partnerData?.prtFax,name:'prtFax',label:'팩스', type:'input', widthType:'half'},
                {value:partnerData?.prtEmail,name:'prtEmail',label:'메일', type:'input', widthType:'half'},
              ]
            }
            handleDataChange={handlePrtDataChange}
            />
            {/* <InputList
              handleDataChange={handlePrtDataChange}
              labelWidth={100}
              items={[
                {value:partnerData?.prtNm,name:'prtNm',label:'거래처명', type:'input'},
                {value:partnerData?.prtRegCd,name:'prtRegCd',label:'식별코드', type:'input'},
                {value:partnerData?.prtSnm,name:'prtSnm',label:'축약명', type:'input'},
                {value:partnerData?.prtEngNm,name:'prtEngNm',label:'영문명', type:'input'},
                {value:partnerData?.prtEngSnm,name:'prtEngSnm',label:'영문축약', type:'input'},
                {value:partnerData?.prtRegNo,name:'prtRegNo',label:'사업자', type:'input'},
                {value:partnerData?.prtCorpRegNo,name:'prtCorpRegNo',label:'법인', type:'input'},
                {value:partnerData?.prtBizType,name:'prtBizType',label:'업태', type:'input'},
                {value:partnerData?.prtBizCate,name:'prtBizCate',label:'업종', type:'input'},
                {value:partnerData?.prtAddr,name:'prtAddr',label:'주소', type:'input'},
                {value:partnerData?.prtAddrDtl,name:'prtAddrDtl',label:'주소세부', type:'input'},
                {value:partnerData?.prtCeo,name:'prtCeo',label:'대표', type:'input'},
                {value:partnerData?.prtTel,name:'prtTel',label:'전화', type:'input'},
                {value:partnerData?.prtFax,name:'prtFax',label:'팩스', type:'input'},
                {value:partnerData?.prtEmail,name:'prtEmail',label:'메일', type:'input'},
              ]}
            />
            <div
              onClick={handleSubmitPrtData}
            >저장</div> */}
          </>
        }
      />

      <AntdEditModal
        open={newPrtMngOpen}
        setOpen={setNewPrtMngOpen}
        width={760}
        contents={
          <>
          <CardInputList title="담당자 추가" 
            btnLabel={
              <Button type="primary" size="large" onClick={() =>{}} 
                className="w-full flex h-center gap-8 !h-full" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <TrArrow/>
                <span>저장</span>
              </Button>
            }
            items={
              [
                {value:partnerMngData?.prtMngNm, name:'prtNm',label:'담당자명', type:'input', widthType:'full'},
                {value:partnerMngData?.prtMngDeptNm, name:'prtDeptNm',label:'부서명', type:'input', widthType:'half'},
                {value:partnerMngData?.prtMngTeamNm, name:'prtTeamNm',label:'팀명', type:'input', widthType:'half'},
                {value:partnerMngData?.prtMngTel, name:'prtTel',label:'전화번호', type:'input', widthType:'half'},
                {value:partnerMngData?.prtMngMobile, name:'prtMobile',label:'휴대번호', type:'input', widthType:'half'},
                {value:partnerMngData?.prtMngFax, name:'prtFax',label:'팩스번호', type:'input', widthType:'half'},
                {value:partnerMngData?.prtMngEmail, name:'prtEmail',label:'이메일', type:'input', widthType:'half'},
              ]
            }
            handleDataChange={handlePrtDataChange}
            />
          </>
        }
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "고객 발주 성공" : "고객 발주 실패"}
        contents={<div>{resultMsg}</div>}
        type={resultType} 
        onOk={()=>{
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="main"
      />
    </>
  )
};

SalesUserPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/user/order' },
      { text: '견적', link: '/sales/user/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserPage;