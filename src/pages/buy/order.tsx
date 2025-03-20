import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import OrderDocumentForm from "@/contents/documentForm/OrderDocumentForm";
import { BuyOrderClmn, BuyOrderMtClmn, BuyOrderMtPriceClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { buyOrderDetailType, buyOrderType } from "@/data/type/buy/cost";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import { ListPagination } from "@/layouts/Body/Pagination";
import { Popup } from "@/layouts/Body/Popup";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { Button, List, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import { DividerH } from "@/components/Divider/Divider";
import Description from "@/components/Description/Description";
import DescriptionItems3 from "@/components/Description/DescriptionItems3";
import AntdInput from "@/components/Input/AntdInput";
import DescriptionItems from "@/components/Description/DescriptionItems";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import { getPrtSupAPI } from "@/api/cache/client";
import { newDataPartnerType, partnerCUType, partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { inputTel, isValidTel } from "@/utils/formatPhoneNumber";
import { isValidEmail } from "@/utils/formatEmail";
import { postAPI } from "@/api/post";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { MOCK } from "@/utils/Mock";
import Bag from "@/assets/svg/icons/bag.svg";
import PrtMngAddModal from "@/contents/partner/PrtMngAddModal";
import { inputFax } from "@/utils/formatFax";
import { materialPriceType, materialSupType } from "@/data/type/base/material_back";
import { wkDetailType, wkPlanWaitType, wkProcsType } from "@/data/type/wk/plan";
import { selectType } from "@/data/type/componentStyles";
import AntdSelect from "@/components/Select/AntdSelect";
import DescriptionItems2 from "@/components/Description/DescriptionItems2";
import { LabelMedium } from "@/components/Text/Label";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";

const BuyOrderPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me, meLoading } = useUser();
  const { showToast, ToastContainer } = useToast();

  // 발주 상세 또는 등록 저장 값
  const [ order, setOrder ] = useState<buyOrderType | null>(null);

  // ------------ 구매처 데이터 세팅 ------------ 시작
  const [csList, setCsList] = useState<Array<{value:any,label:string}>>([]);
  const [csMngList, setCsMngList] = useState<partnerMngRType[]>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientSup"],
    queryFn: () => getPrtSupAPI(),
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

  useEffect(()=>{
    // 구매처 변경 시 담당자 세팅 및 초기화
    if(prtId && prtId !== "" && cs?.data?.data && cs?.data?.data?.length) {
      setCsMngList((cs?.data?.data as partnerRType[] ?? []).find(f=>f.id === prtId)?.managers ?? []);
      setPrtMngId("");
    } else {
      setCsMngList([]);
      setPrtMngId("");
    }
  }, [prtId])
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
        
        { ...data, prtTypeEm: 'sup'}
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

  // ------------ 구매처 담당자 등록 ------------ 시작
  const [ newPrtMngOpen, setNewPrtMngOpen ] = useState<boolean>(false);
  const [ newPartnerMngData, setNewPartnerMngData ] = useState<partnerMngRType | null>(null);

  // 구매처 설정 값 변경 시 실행 함수
  const handlePrtDataChange = (
    dataType: 'prt' | 'mng',
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    let value = e;
    if(type === "input" && typeof e !== "string") {
      value = e.target.value;
    }

    // 전화번호 형식인 필드들은 자동 하이픈 처리
    if(name.toLowerCase().includes("tel") || name.toLowerCase().includes("mobile")) {
      value = inputTel(value?.toString());
    } else if (name.toLowerCase().includes("fax")) {
      value = inputFax(value?.toString());
    }

    if(key) {
      setNewPartnerMngData(prev => ({
        ...prev,
        [name]: {
          [key]: value,
        },
      } as partnerMngRType));
    } else {
      setNewPartnerMngData(prev => ({
        ...prev,
        [name]: value,
      } as partnerMngRType));
    }
  }
  // ------------ 구매처 담당자 등록 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------ 시작
  // 단가 목록
  const [ mtPrice, setMtPrice ] = useState<materialPriceType[]>([]);
  const { data:queryMtSupData } = useQuery({
    queryKey: ['material-price/jsxcrud/many', prtId],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material-price/jsxcrud/many'
      }, {
        anykeys: {partnerId: prtId}
      });

      if(result.resultCode === "OK_0000") {
        setMtPrice(result.data.data ?? []);
      }

      return result;
    },
    enabled: prtId !== "",
  });

  // 생산 제품
  const [ wkSelect, setWkSelect ] = useState<selectType[]>([]);
  const { data:queryWkData, isLoading:wkLoading } = useQuery({
    queryKey: ['worksheet/production-status/process-status/jsxcrud/many'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/process-status/jsxcrud/many'
      },{
        s_query: [{key: "progress", oper: "ne", value: 1}]
      });

      if(result.resultCode === "OK_0000") {
        const arr = (result.data?.data as wkPlanWaitType[] ?? []).map((item:wkPlanWaitType) => ({
          value: item.id,
          label: item.specModel?.prdNm ?? "",
        }))
        setWkSelect(arr);
      }
      return result;
    },
  });
  
  // 생산 제품 디테일
  const [procs, setProcs] = useState<selectType[]>([]);
  const {data:queryWkDetailData} = useQuery({
    queryKey: ['worksheet/production-status/process-status/detail/jsxcrud/one', order?.orderRoot?.wkId],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `worksheet/production-status/process-status/detail/jsxcrud/one/${order?.orderRoot?.wkId}`
      });

      if(result.resultCode === "OK_0000") {
        const rdata = (result?.data?.data as wkDetailType).procs?.sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0)) as wkProcsType[];
        const procs = (rdata ?? []).map((item) => ({
          value: item.id,
          label: item.specPrdGrp?.process?.prcNm ?? "",
        }))
        setProcs(procs);
      }

      return result;
    },
    enabled: !!order?.orderRoot?.wkId
  });
  // -------------- 필요 데이터 세팅 ------------ 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ totalData, setTotalData ] = useState<number>(1);
  const [ pagination, setPagination ] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [ data, setData ] = useState<buyOrderType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['request/material/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'request/material/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:buyOrderType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const {data:queryDetailData} = useQuery({
    queryKey: ['request/material/detail/jsxcrud/one', order?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `request/material/detail/jsxcrud/one/${order?.id}`
      });

      if(result.resultCode === "OK_0000") {
        const entity = result.data.data as buyOrderType;
        setOrder({
          ...order,
          ...entity,
          orderRoot: {
            orderId: order?.id,
            prtIdx: entity.detailInfo?.prtInfo?.prt?.id,
            prtMngIdx: entity.detailInfo?.prtInfo?.mng?.id,
            empIdx: entity.detailInfo?.emp?.id,
            orderDueDt: entity.detailInfo?.orderDueDt,
            orderDt: entity.detailInfo?.orderDt,
            remarks: entity.detailInfo?.remarks,
            deliveryDueDt: entity.detailInfo?.deliveryDueDt,
            arrivalDt: entity.detailInfo?.arrivalDt,
            paymentCondition: entity.detailInfo?.paymentCondition,
            totalAmount: entity.detailInfo?.totalAmount,
            orderConfirmDt: entity.detailInfo?.orderConfirmDt,
            approvalDt: entity.detailInfo?.approvalDt,
            worksheetIdxNoForgKeyType: entity.detailInfo?.worksheetIdxNoForgKeyType,
            worksheetIdxNoForgKey: entity.detailInfo?.worksheetIdxNoForgKey,
            wkId: entity.detailInfo?.worksheetIdxNoForgKeyType === "WORKSHEET" ? entity.detailInfo?.worksheetIdxNoForgKey : "",
            wkPrcId: entity.detailInfo?.worksheetIdxNoForgKeyType === "WORKSHEET_PROCESS" ? entity.detailInfo?.worksheetIdxNoForgKey : "",
          },
          orderDetail: entity.detailInfo?.details?.map((item) => ({
            id: item.id,
            materialIdx: item.material?.id,
            order: item.order,
            mtOrderQty: item.mtOrderQty,
            mtOrderSizeW: item.mtOrderSizeW,
            mtOrderSizeH: item.mtOrderSizeH,
            mtOrderWeight: item.mtOrderWeight,
            mtOrderThk: item.mtOrderThk,
            mtOrderPrice: item.mtOrderPrice,
            mtOrderInputPrice: item.mtOrderInputPrice,
            mtOrderAmount: item.mtOrderAmount,
            mtOrderUnit: item.mtOrderUnit,
            mtOrderTxtur: item.mtOrderTxtur,
            mtOrderArrivalQty: item.mtOrderArrivalQty,
            mtOrderArrivalDate: item.mtOrderArrivalDate,
            mtOrderInputDate: item.mtOrderInputDate,
            mtOrderInputQty: item.mtOrderInputQty,
            mtOrderInvenQty: item.mtOrderInvenQty,
            mtOrderBadQty: item.mtOrderBadQty,
            requestMaterialQuality: item.requestMaterialQuality,
            mtNm: item.material?.mtNm,
          }))
        });
        setEdit(true);
        setOpen(true);
      }

      return result;
    },
    enabled: !!order?.id
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝
    
  const handlePageMenuClick = (key:number)=>{
    const clmn = BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen, setOrder)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "print", showToast);
    }
  }

  // 발주 등록 또는 수정 모달
  const [ open, setOpen ] = useState<boolean>(false);
  // 발주 수정 여부
  const [ edit, setEdit ] = useState<boolean>(false);

  // 모달창 초기화
  useEffect(()=>{
    if(!open) {
      setOrder(null);
      setEdit(false);
      setPrtId("");
      setPrtMngId("");
      setSelectMtPrice([]);
      setMtPrice([]);
    }
  }, [open])

  // 모달창 내 접기, 펼치기
  const [collapse, setCollapse] = useState<{
    master:boolean;
    price:boolean;
    mt:boolean;
  }>({master:false, price:false, mt:false});
  
  // 발주 품목
  const [selectMtPrice, setSelectMtPrice] = useState<buyOrderDetailType[]>([]);

  // 발주 품목 내 수량, 단가 변경 시 금액 자동 입력
  useEffect(() => {
    setSelectMtPrice((prev) => {
      const updatedProcs = prev.map((row, index) => {
        return { ...row, mtOrderAmount: (row.mtOrderQty ?? 0) * (row.mtOrderInputPrice ?? 0) };
      });
      return updatedProcs;
    });
  }, [selectMtPrice.map((row) => row.mtOrderInputPrice).join(","),
    selectMtPrice.map((row) => row.mtOrderQty).join(",")
  ]);

  // 발주 품목 내 품목 삭제
  const handleDeleteMt = (index:number) => {
    if(selectMtPrice.length >= index) {
      setSelectMtPrice(prev => {
        const newArr = [...prev]; // 기존 배열 복사
        newArr.splice(index, 1);  // index번째 요소 1개 제거
        return newArr;
      });
    }
  }

  // 발주 등록 및 수정
  const handleSubmit = async () => {
    try {
      const jsonData = {
        orderRoot: {
          ...order?.orderRoot,
          prtIdx: prtId === "" ? undefined : prtId,
          prtMngIdx: prtMngId === "" ? undefined : prtMngId,
          empIdx: me?.id,
          wkId: undefined,
          wkPrcId: undefined,
        },
        orderDetail: selectMtPrice
      }
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'request/material/default/save',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        showToast("발주 저장 완료", "success");
        setEdit(true);
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"success" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");

  // 발주서 모달
  const [ orderDocumentFormOpen, setOrderDocumentFormOpen ] = useState<boolean>(false);

  if(meLoading) {
    return <Spin />
  }

  return (
    <>
      <div className="w-full h-50">
        <ListTitleBtn
          label="신규"
          onClick={()=>{
            setOpen(true);
          }}
          icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
        />
      </div>

      <DividerH />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
      />

      <List>
        <AntdTableEdit
          columns={BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen, setOrder)}
          data={data}
          styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
      />
      
      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"구매 및 발주 등록"}
        contents={
          <div className="flex flex-col gap-20">
            <Popup>
              <div
                className="flex v-between-h-center cursor-pointer"
                onClick={()=>setCollapse({...collapse, master: !collapse.master})}
              >
                <LabelMedium label="발주 내용"/>
                {collapse.master ? <UpOutlined /> : <DownOutlined />}
              </div>
              { !collapse.master &&
                <Description separatorColor="#e7e7ed">
                  <DescriptionItems2
                    height="20"
                    title1="생산제품"
                    childClassName="!p-0"
                    c1ClassName="!w-[calc(66%-150px)]"
                    children1={
                      <AntdSelect
                        options={wkSelect}
                        value={order?.orderRoot?.wkId}
                        onChange={(e)=>{
                          const value = e+"";
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              wkId: value,
                              worksheetIdxNoForgKey: value,
                              worksheetIdxNoForgKeyType: "WORKSHEET",
                            }
                          })
                        }}
                        styles={{bw:"0"}} placeholder="생산제품 선택"
                      />
                    }
                    title2="생산제품 공정"
                    c2ClassName="!w-[calc(33%-150px)]"
                    children2={
                      !order?.orderRoot?.wkId || order?.orderRoot?.wkId === "" ?
                      <div className="pl-10 text-[#00000040]">생산제품을 선택해주세요.</div>
                      :
                      <AntdSelect
                        options={procs}
                        value={order?.orderRoot?.wkPrcId}
                        onChange={(e)=>{
                          const value = e+"";
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              wkPrcId: value,
                              worksheetIdxNoForgKey: value,
                              worksheetIdxNoForgKeyType: "WORKSHEET_PROCESS",
                            }
                          })
                        }}
                        styles={{bw:"0"}} placeholder="생산제품 내 공정 선택"
                      />
                    }
                  />
                  <DescriptionItems3
                    height="20"
                    title1="구매처"
                    childClassName="!p-0"
                    children1={
                      <CustomAutoComplete
                        className="!w-full"
                        inputClassName="!border-0"
                        option={csList}
                        value={prtId}
                        onChange={(value) => setPrtId(value)}
                        placeholder="구매처명 검색 후 선택"
                        addLabel="구매처 추가"
                        handleAddData={()=>setAddPartner(true)}
                      />
                    }
                    title2="구매처 담당자"
                    children2={
                      prtId === "" ? 
                      <div className="pl-10 text-[#00000040]">구매처를 선택해주세요.</div>
                      :
                      <CustomAutoComplete
                        className="!w-full"
                        inputClassName="!border-0"
                        option={csMngList.map((item) => ({ value: item.id, label: item.prtMngNm }))}
                        value={prtMngId}
                        onChange={(value) => setPrtMngId(value)}
                        placeholder="구매처 담당자 검색 후 선택"
                        addLabel="구매처 담당자 추가"
                        handleAddData={()=>setNewPrtMngOpen(true)}
                      />
                    }
                    title3="결제조건"
                    children3={
                      <AntdInput 
                        value={order?.orderRoot?.paymentCondition}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              paymentCondition: e.target.value,
                            }
                          })
                        }}
                        styles={{bw:"0"}} placeholder="결제조건 입력"
                      />
                    }
                  />
                  <DescriptionItems3
                    height="20"
                    title1="발주확정일"
                    childClassName="!p-0"
                    children1={
                      <AntdDatePicker 
                        value={order?.orderRoot?.orderConfirmDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              orderConfirmDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                    title2="발주예정일"
                    children2={
                      <AntdDatePicker 
                        value={order?.orderRoot?.orderDueDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              orderDueDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                    title3="발주일"
                    children3={
                      <AntdDatePicker 
                        value={order?.orderRoot?.orderDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              orderDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                  />
                  <DescriptionItems3
                    height="20"
                    title1="납품요구일"
                    childClassName="!p-0"
                    children1={
                      <AntdDatePicker 
                        value={order?.orderRoot?.deliveryDueDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              deliveryDueDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                    title2="도착일"
                    children2={
                      <AntdDatePicker 
                        value={order?.orderRoot?.arrivalDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              arrivalDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                    title3="승인일"
                    children3={
                      <AntdDatePicker 
                        value={order?.orderRoot?.approvalDt ?? null}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              approvalDt: e,
                            }
                          })
                        }}
                        className="!w-full !border-0"
                        suffixIcon={"cal"}
                      />
                    }
                  />
                  <DescriptionItems
                    height="20"
                    title="비고"
                    childClassName="!p-0"
                    children={
                      <AntdInput 
                        value={order?.orderRoot?.remarks}
                        onChange={(e)=>{
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              remarks: e.target.value,
                            }
                          })
                        }}
                        styles={{bw:"0"}} placeholder="비고 입력"
                      />
                    }
                  />
                </Description>
              }
            </Popup>

            { edit && <>
            <Popup>
              <div
                className="flex v-between-h-center cursor-pointer"
                onClick={()=>setCollapse({...collapse, mt: !collapse.mt})}
              >
                <LabelMedium label="발주 품목 및 품질 검사"/>
                {collapse.mt ? <UpOutlined /> : <DownOutlined />}
              </div>
              { !collapse.mt &&
                <AntdTableEdit
                  columns={BuyOrderMtClmn(handleDeleteMt)}
                  data={selectMtPrice}
                  setData={setSelectMtPrice}
                  styles={{
                    th_bg: "#FAFAFA",
                    td_bg: "#FFFFFF",
                    th_ht: "35px",
                    td_ht: "35px",
                    round: "0",
                    th_fw: "bold",
                    fs: "12px",
                    td_pd: "0",
                    line: "n",
                  }}
                  create={true}
                />
              }
            </Popup>

            <Popup>
              <div
                className="flex v-between-h-center cursor-pointer"
                onClick={()=>setCollapse({...collapse, price: !collapse.price})}
              >
                <LabelMedium label="단가 목록"/>
                {collapse.price ? <UpOutlined /> : <DownOutlined />}
              </div>
              { !collapse.price &&
                <AntdTableEdit
                  columns={BuyOrderMtPriceClmn(selectMtPrice, setSelectMtPrice)}
                  data={mtPrice}
                  styles={{
                    th_bg: "#FAFAFA",
                    td_bg: "#FFFFFF",
                    th_ht: "35px",
                    td_ht: "35px",
                    round: "0",
                    th_fw: "bold",
                    fs: "12px",
                    td_pd: "0",
                    line: "n",
                  }}
                />
              }
            </Popup>
            </>}

            <div className="w-full h-50 v-h-center">
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={handleSubmit}
              >
                <Arrow />저장
              </Button>
            </div>
          </div>
        }
        width={1200}
      />

      <AntdModal
        open={orderDocumentFormOpen}
        setOpen={setOrderDocumentFormOpen}
        contents={
          <Popup>
            <OrderDocumentForm
              mtList={[
                {
                  nm: "mt1",
                  w: 100,
                  h: 100,
                  thk: 100,
                  cnt: 100,
                  unit: "FR-1",
                  wgt: 100,
                  price: 10000,
                  priceUnit: 10000,
                }
              ]}
              orderPrice={2345000}
            />
          </Popup>
        }
        width={1200}
      />

      {/* 구매처 등록 */}
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

      {/* 구매처 담당자 등록 */}
      <PrtMngAddModal
        open={newPrtMngOpen}
        setOpen={setNewPrtMngOpen}
        partnerId={prtId}
        newPartnerMngData={newPartnerMngData}
        handlePrtDataChange={handlePrtDataChange}
        submitEndFn={()=>{
          setNewPrtMngOpen(false);
          setNewPartnerMngData(null);
        }}
        prtMngSuccessFn={(entity)=>{
          setCsMngList([...csMngList, {...entity} ]);
          setPrtMngId(entity.id);
        }}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "error" ? "오류 발생" : 
          ""
        }
        contents={
          resultType === "error" ? <div>{errMsg}</div> :
          <></>
        }
        type={resultType === "success" ? "confirm" : "error"}
        onOk={()=>{
          setResultOpen(false);
        }}
        onCancle={()=>{
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "error" ? "확인" :
          ""
        }
      />
      
      <ToastContainer />
    </>
  )
};

BuyOrderPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="구매 및 발주"
    // menu={[
    //   { text: '외주처 단가 등록', link: '/buy/cost/wait' },
    // ]}
  >{page}</MainPageLayout>
);

export default BuyOrderPage;