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
import { Button, List, Spin, Table } from "antd";
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
import { materialGroupBadType, materialPriceType, materialSupType } from "@/data/type/base/material_back";
import { wkDetailType, wkPlanWaitType, wkProcsType } from "@/data/type/wk/plan";
import { selectType } from "@/data/type/componentStyles";
import AntdSelect from "@/components/Select/AntdSelect";
import DescriptionItems2 from "@/components/Description/DescriptionItems2";
import { LabelMedium } from "@/components/Text/Label";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import dayjs from "dayjs";

const SDivider = <span className="absolute right-0 top-[8px] bottom-[8px] w-[1px] bg-gray-200" />

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
    queryKey: ['worksheet/production-status/process-status/detail/jsxcrud/one', order?.orderRoot?.worksheetIdxNoForgKey],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `worksheet/production-status/process-status/detail/jsxcrud/one/${order?.orderRoot?.worksheetIdxNoForgKey}`
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
    enabled: !!order?.orderRoot?.worksheetIdxNoForgKey
  });

  // 원자재 불량 종류
  const [mtBad, setMtBad] = useState<materialGroupBadType[]>([]);
  const {data:queryMtBadData} = useQuery({
    queryKey: ['material-group-bad/jsxcrud/many'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material-group-bad/jsxcrud/many'
      });

      if(result.resultCode === "OK_0000") {
        setMtBad(result.data.data ?? []);
      }

      return result;
    },
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
        const detailEntity = entity.detailInfo?.details?.map((item) => ({
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
          requestMaterialQuality: item.requestMaterialQuality ?? [],
          mtNm: item.material?.mtNm,
          materialGrpIdx: item?.material?.materialGroup?.id,
        })) as buyOrderDetailType[];
        
        setOrder({
          ...order,
          ...entity,
          status: entity?.type,
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
            worksheetProcessIdxNoForgKey: entity.detailInfo?.worksheetProcessIdxNoForgKey,
          },
          orderDetail: detailEntity,
        });
        setSelectMtPrice(detailEntity);
        setPrtId(entity.detailInfo?.prtInfo?.prt?.id ?? "");
        setDetailFlag(true);
        setPrtMngId(entity.detailInfo?.prtInfo?.mng?.id ?? "");
        setEdit(true);
        setCollapse({master: false, mt: false, price: false});
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
      setOrder({...order, id:"" });
      const jsonData = {
        orderRoot: {
          ...order?.orderRoot,
          prtIdx: prtId,
          prtMngIdx: prtMngId,
          empIdx: me?.id,
          orderDueDt: order?.orderRoot?.orderDueDt ? dayjs(order?.orderRoot?.orderDueDt).format("YYYY-MM-DD") : null,
          orderDt: order?.orderRoot?.orderDt ? dayjs(order?.orderRoot?.orderDt).format("YYYY-MM-DD") : null,
          deliveryDueDt: order?.orderRoot?.deliveryDueDt ? dayjs(order?.orderRoot?.deliveryDueDt).format("YYYY-MM-DD") : null,
          arrivalDt: order?.orderRoot?.arrivalDt ? dayjs(order?.orderRoot?.arrivalDt).format("YYYY-MM-DD") : null,
          orderConfirmDt: order?.orderRoot?.orderConfirmDt ? dayjs(order?.orderRoot?.orderConfirmDt).format("YYYY-MM-DD") : null,
          approvalDt: order?.orderRoot?.approvalDt ? dayjs(order?.orderRoot?.approvalDt).format("YYYY-MM-DD") : null,
        },
        orderDetail: selectMtPrice.map((item, index) => ({
          id: item?.id,
          materialIdx: item?.materialIdx,
          order: index,
          mtOrderQty: item?.mtOrderQty ?? 0,
          mtOrderSizeW: item?.mtOrderSizeW ?? 0,
          mtOrderSizeH: item?.mtOrderSizeH ?? 0,
          mtOrderWeight: item?.mtOrderWeight ?? 0,
          mtOrderThk: item?.mtOrderThk ?? 0,
          mtOrderPrice: item?.mtOrderPrice ?? 0,
          mtOrderInputPrice: item?.mtOrderInputPrice ?? 0,
          mtOrderAmount: item?.mtOrderAmount ?? 0,
          mtOrderUnit: item?.mtOrderUnit ?? "",
          mtOrderTxtur: item?.mtOrderTxtur ?? "",
          mtOrderArrivalQty: item?.mtOrderArrivalQty ?? 0,
          mtOrderArrivalDate: item?.mtOrderArrivalDate ?? null,
          mtOrderInputDate: item?.mtOrderInputDate ?? null,
          mtOrderInputQty: item?.mtOrderInputQty ?? 0,
          mtOrderInvenQty: item?.mtOrderInvenQty ?? 0,
          mtOrderBadQty: item?.mtOrderBadQty ?? 0,
          requestMaterialQuality: badCnt.length > 0 ? badCnt.filter(f=>f.mtId === item.id).map(f=>({
            badNm: f.badNm,
            badCnt: f.cnt,
            materialBadIdx: f.badId,
          })) : [],
        }))
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
        refetch();
        showToast("발주 저장 완료", "success");

        setOrder(null);
        const entity = result.data;
        setOrder({...order, id: entity?.id});
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

  // 불량 수량 저장
  const [badCnt, setBadCnt] = useState<{badNm:string; badId:string; mtId:string; cnt:number}[]>([]);
  const [totalByMtId, setTotalByMtId] = useState<Record<string, number>>({});

  // 원자재 아이디 별 불량 총합 계산
  useEffect(()=>{
    const totals = badCnt.reduce((acc, { mtId, cnt }) => {
      if (!acc[mtId])
        acc[mtId] = 0;
      acc[mtId] += cnt;
      return acc;
    }, {} as Record<string, number>);
    setTotalByMtId(totals);
  }, [badCnt])

  // 저장된 총합에 따라 selectMtPrice 내에 값 자동 변경 (불량 수, 입고 수량)
  useEffect(()=>{
    setSelectMtPrice((prev) =>
      prev.map((item) => ({
        ...item,
        mtOrderBadQty: item.id ? totalByMtId[item.id] : 0,
        mtOrderInputQty: item.id ? (item.mtOrderArrivalQty ?? 0) - (totalByMtId[item.id] ?? 0) : 0,
      }))
    );
  }, [totalByMtId])

  // 도착, 입고 수량 변경
  const handleDataQtyChange = (id:string, value:number, name:string) => {
    const updateData = selectMtPrice;
    const index = updateData.findIndex(f=> f.id === id);
    if(index > -1) {
      if(name === "mtOrderArrivalQty")
        updateData[index] = { ...updateData[index], [name]: value, mtOrderInputQty: value - (updateData[index].mtOrderBadQty ?? 0)};
      else
        updateData[index] = { ...updateData[index], [name]: value };

      const newArray = [
        ...updateData.slice(0, index),
        updateData[index],
        ...updateData.slice(index + 1)
      ];
      setSelectMtPrice(newArray);
    }
  }

  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"success" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");

  // 발주서 모달
  const [ orderDocumentFormOpen, setOrderDocumentFormOpen ] = useState<boolean>(false);

  // 모달창 초기화
  useEffect(()=>{
    if(!open) {
      setOrder(null);
      setEdit(false);
      setPrtId("");
      setPrtMngId("");
      setSelectMtPrice([]);
      setMtPrice([]);
      setBadCnt([]);
      setTotalByMtId({});
    }
  }, [open])

  if(meLoading) return <Spin />
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
              <div className="flex v-between-h-center">
                <LabelMedium label="발주 내용"/>
                <p
                  className="cursor-pointer"
                  onClick={()=>setCollapse({...collapse, master: !collapse.master})}
                >
                  {collapse.master ? <UpOutlined /> : <DownOutlined />}
                </p>
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
                        value={order?.orderRoot?.worksheetIdxNoForgKey}
                        onChange={(e)=>{
                          const value = e+"";
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
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
                      !order?.orderRoot?.worksheetIdxNoForgKey || order?.orderRoot?.worksheetIdxNoForgKey === "" ?
                      <div className="pl-10 text-[#00000040]">생산제품을 선택해주세요.</div>
                      :
                      <AntdSelect
                        options={procs}
                        value={order?.orderRoot?.worksheetProcessIdxNoForgKey}
                        onChange={(e)=>{
                          const value = e+"";
                          setOrder({
                            ...order,
                            orderRoot: {
                              ...order?.orderRoot,
                              worksheetProcessIdxNoForgKey: value,
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
                        disabled={order?.status !== "REQUEST_WAITING"}
                        className="!w-full !border-0" suffixIcon={"cal"}
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
                        disabled={order?.status !== "REQUEST_WAITING"}
                        className="!w-full !border-0" suffixIcon={"cal"}
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
                        className="!w-full !border-0" suffixIcon={"cal"}
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
                        className="!w-full !border-0" suffixIcon={"cal"}
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
                        className="!w-full !border-0" suffixIcon={"cal"}
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
                        afterDate={dayjs()}
                        className="!w-full !border-0" suffixIcon={"cal"}
                      />
                    }
                  />
                  <DescriptionItems
                    height="20"
                    title="비고"
                    childClassName="!p-0"
                  >
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
                  </DescriptionItems>
                </Description>
              }
            </Popup>

            {/* 발주 루트가 등록되었을 때 발주 품목을 보여줌 */}
            { edit && selectMtPrice.length > 0 &&
              (!order?.status || order.status === "REQUEST_WAITING" || order.status === "INPUT") &&
            <Popup className={
              !order?.status || order?.status === "REQUEST_WAITING" ? 
                collapse.master ? "!max-h-[400px] overflow-y-auto" : "!max-h-[250px] overflow-y-auto"
                :
                collapse.master ? "!max-h-[780px] overflow-y-auto" : "!max-h-[520px] overflow-y-auto"
              }>
              <div className="flex v-between-h-center">
                <LabelMedium label="발주 품목"/>
                <p
                  className="cursor-pointer"
                  onClick={()=>setCollapse({...collapse, mt: !collapse.mt})}
                >
                  {collapse.mt ? <UpOutlined /> : <DownOutlined />}
                </p>
              </div>
              { !collapse.mt &&
                <AntdTableEdit
                  columns={
                    order?.status === "REQUEST_WAITING" ?
                    BuyOrderMtClmn(handleDeleteMt) :
                    BuyOrderMtClmn(handleDeleteMt).filter(f=>f.dataIndex!=="materialIdx")
                  }
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
                  create={order?.status === "REQUEST_WAITING"}
                />
              }
            </Popup>
            }

            {/* 도착 대기일 경우 발주 품목 및 불량 종류를 보여줌 */}
            { edit && order?.status && order.status === "ARRIVAL_WAITING" &&
            <Popup className={collapse.master ? "!max-h-[780px] overflow-y-auto" :"!max-h-[520px] overflow-y-auto"}>
              <div className="flex v-between-h-center">
                <LabelMedium label="발주 품목 및 품질 검사"/>
                <p
                  className="cursor-pointer"
                  onClick={()=>setCollapse({...collapse, mt: !collapse.mt})}
                >
                  {collapse.mt ? <UpOutlined /> : <DownOutlined />}
                </p>
              </div>
              { !collapse.mt &&
                <>
                  <table>
                    <thead className="text-12 bg-[#FAFAFA] h-35 py-10 text-[#444444]">
                      <th className="relative !w-50">순서{SDivider}</th>
                      <th className="relative !min-w-80">원자재명{SDivider}</th>
                      <th className="relative !w-80">단위{SDivider}</th>
                      <th className="relative !w-80">재질{SDivider}</th>
                      <th className="relative !w-80">W{SDivider}</th>
                      <th className="relative !w-80">H{SDivider}</th>
                      <th className="relative !w-80">두께{SDivider}</th>
                      <th className="relative !w-80">무게{SDivider}</th>
                      <th className="relative !w-80">수량{SDivider}</th>
                      <th className="relative !w-80">단가{SDivider}</th>
                      <th className="relative !w-80">금액</th>
                    </thead>
                    <tbody className="text-12">
                      { selectMtPrice.map((item:buyOrderDetailType, index:number) => (<>
                        <tr className="h-35 border-b-1 border-[#0000000F]">
                          <td className="px-10 text-center">{index+1}</td>
                          <td className="px-10 text-left">{item.mtNm}</td>
                          <td className="px-10 text-center">{item.mtOrderUnit}</td>
                          <td className="px-10 text-center">{item.mtOrderTxtur}</td>
                          <td className="px-10 text-right">{item.mtOrderSizeW}</td>
                          <td className="px-10 text-right">{(item.mtOrderSizeH ?? 0).toLocaleString()}</td>
                          <td className="px-10 text-right">{(item.mtOrderThk ?? 0).toLocaleString()}</td>
                          <td className="px-10 text-right">{(item.mtOrderWeight ?? 0).toLocaleString()}</td>
                          <td className="px-10 text-right">{(item.mtOrderQty ?? 0).toLocaleString()}</td>
                          <td className="px-10 text-right">{(item.mtOrderInputPrice ?? 0).toLocaleString()}</td>
                          <td className="px-10 text-right">{(item.mtOrderAmount ?? 0).toLocaleString()}</td>
                        </tr>
                        <tr className="h-100">
                          <td className="bg-back text-center font-[500]">
                            불량종류
                          </td>
                          <td colSpan={8}>
                            <div className="flex flex-wrap">
                            { mtBad.map((badItem:materialGroupBadType, index:number) => (
                              <div key={index} className="w-1/3 h-center mb-4">
                                <div className="h-center px-10">{badItem.badNm}</div>
                                <div className="h-center gap-5">
                                  <AntdInput
                                    value={badCnt.find(f=>f.badId === badItem.id && f.mtId === item.id)?.cnt}
                                    onChange={(e) => {
                                      setBadCnt([
                                        ...badCnt.filter(f=>!(f.badId === badItem.id && f.mtId === item.id)),
                                        {
                                          badNm: badItem.badNm ?? "",
                                          badId: badItem.id ?? "",
                                          mtId: item.id ?? "",
                                          cnt: Number(e.target.value)
                                        }
                                      ]);
                                    }}
                                    type="number" className="!w-100" styles={{ht:"25px"}}
                                  />개
                                </div>
                              </div>
                            ))}
                            </div>
                          </td>
                          <td colSpan={2}>
                            <div className="flex flex-col gap-5">
                              <div className="v-between-h-center">
                                <span className="text-12 font-[500]">도착 수량</span>
                                <div className="h-center gap-5">
                                  <AntdInput
                                    value={item.mtOrderArrivalQty}
                                    onFocus={() => {
                                      if(!item.mtOrderArrivalQty || item.mtOrderArrivalQty < 1)
                                        handleDataQtyChange(item.id ?? "", item.mtOrderQty ?? 0, 'mtOrderArrivalQty');
                                    }}
                                    onChange={(e) => {
                                      handleDataQtyChange(item.id ?? "", Number(e.target.value ?? 0), 'mtOrderArrivalQty');
                                    }}
                                    type="number" className="!w-80" styles={{ht:"25px"}}
                                  />개
                                </div>
                              </div>
                              <div className="v-between-h-center">
                                <span className="text-12 font-[500]">입고 수량</span>
                                <div className="h-center gap-5">
                                  <AntdInput
                                    value={item.mtOrderInputQty}
                                    onChange={(e) => {
                                      handleDataQtyChange(item.id ?? "", Number(e.target.value ?? 0), 'mtOrderInputQty');
                                    }}
                                    type="number" className="!w-80" styles={{ht:"25px"}}
                                  />개
                                </div>
                              </div>
                              <div className="v-between-h-center">
                                <span className="text-12 font-[500]">재고 수량</span>
                                <div className="h-center gap-5">
                                  <AntdInput
                                    value={item.mtOrderInvenQty}
                                    disabled
                                    type="number" className="!w-80" styles={{ht:"25px"}}
                                  />개
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>))}
                    </tbody>
                  </table>
                </>
              }
            </Popup>
            }

            {/* 발주 루트가 등록되었고 발주일이 지나지않았다면 단가 목록을 보여줌 */}
            { edit && order?.status === "REQUEST_WAITING" &&
            <Popup className={collapse.master ? "!max-h-[350px] overflow-y-auto" :"!max-h-[250px] overflow-y-auto"}>
              <div className="flex v-between-h-center">
                <LabelMedium label="단가 목록"/>
                <p
                  className="cursor-pointer"
                  onClick={()=>setCollapse({...collapse, price: !collapse.price})}
                >
                  {collapse.price ? <UpOutlined /> : <DownOutlined />}
                </p>
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
            }

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
  >{page}</MainPageLayout>
);

export default BuyOrderPage;