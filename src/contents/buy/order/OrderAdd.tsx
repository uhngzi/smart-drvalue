import dayjs from "dayjs";
import cookie from "cookiejs";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { 
  useEffect,
  useRef,
  useState
} from "react";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { getPrtSupAPI } from "@/api/cache/client";
import TextArea from "antd/es/input/TextArea";
import { 
  Button,
  Dropdown,
  Space,
  Steps,
} from "antd";
import {
  CloseOutlined,
  PlusOutlined, 
} from "@ant-design/icons";

import { LabelThin } from "@/components/Text/Label";
import { DividerV } from "@/components/Divider/Divider";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdInput from "@/components/Input/AntdInput";
import LabelItem from "@/components/Text/LabelItem";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdTable from "@/components/List/AntdTable";
import Items2 from "@/components/Item/Items2";
import AntdSelectFill from "@/components/Select/AntdSelectFill";

import {
  newDataPartnerType,
  partnerCUType,
  partnerMngRType,
  partnerRType
} from "@/data/type/base/partner";
import { 
  buyOrderDetailType,
  buyOrderType
} from "@/data/type/buy/cost";
import { 
  materialGroupBadType,
  materialGroupType,
  materialPriceType,
} from "@/data/type/base/material_back";
import { 
  wkDetailType,
  wkPlanWaitType,
  wkProcsType
} from "@/data/type/wk/plan";
import { 
  BuyOrderMtClmn,
  BuyOrderMtPriceClmn,
  BuyOrderMtViewClmn
} from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { selectType } from "@/data/type/componentStyles";

import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";

import useToast from "@/utils/useToast";
import { MOCK } from "@/utils/Mock";
import { isValidEmail } from "@/utils/formatEmail";
import { isValidTel } from "@/utils/formatPhoneNumber";

import { Popup } from "@/layouts/Body/Popup";
import BlueBox from "@/layouts/Body/BlueBox";
import BoxHead from "@/layouts/Body/BoxHead";

import CsMngContent from "@/contents/sales/order/add/CsMngContent";

const OrderAddLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { me } = useUser();
  const { showToast, ToastContainer } = useToast();

  // 발주
  const [ order, setOrder ] = useState<buyOrderType | null>(null);
  // 발주 품목
  const [orderDetails, setOrderDetails] = useState<buyOrderDetailType[]>([]);

  // 수정일 경우 id 값 넣어줌 => order의 id 값이 변경될 경우 하단에 있는 detail query 실행되어 order가 세팅됨
  useEffect(()=>{
    if(id && typeof id === "string" && !id.includes("new"))
      setOrder({id:id});
  }, [id])

  // 스탭 저장 변수
  const [ stepCurrent, setStepCurrent ] = useState<number>(0);

  // ----------- 자동 포커스 및 스크롤 ----------- 시작
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

  // ------------- 필요 데이터 세팅 ------------ 시작
  // 생산 제품
  const [ wkSelect, setWkSelect ] = useState<selectType[]>([]);
  const { data:queryWkData } = useQuery({
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
  
  // 원자재 그룹 목록
  const [ mtGrp, setMtGrp ] = useState<materialGroupType[]>([]);
  const { data:queryMtData } = useQuery({
    queryKey: ['material-group/jsxcrud/many', prtId],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material-group/jsxcrud/many'
      });

      if(result.resultCode === "OK_0000") {
        setMtGrp(result.data.data ?? []);
      }

      return result;
    },
    enabled: prtId !== "",
  });

  // 원자재 단가 목록
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

  // ------------ 디테일 데이터 세팅 ------------ 시작
    // order의 id 값이 변경될 경우마다 실행됨
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
          mtOrderArrivalQty: !item.mtOrderArrivalQty || item.mtOrderArrivalQty < 1 ? item.mtOrderQty : item.mtOrderArrivalQty,
          mtOrderArrivalDate: item.mtOrderArrivalDate,
          mtOrderInputDate: item.mtOrderInputDate,
          mtOrderInputQty: item.mtOrderInputQty,
          mtOrderInvenQty: item.mtOrderInvenQty,
          mtOrderBadQty: item.mtOrderBadQty,
          requestMaterialQuality: item.requestMaterialQuality ?? [],
          mtNm: item.mtNm,
          materialGrpIdx: item.material ? item?.material?.materialGroup?.id : "직접입력",
          mtPriceIdx: item?.materialPrice?.id,
        })) as buyOrderDetailType[];
        const orderEntity = {
          ...order,
          ...entity,
          status: entity?.type,
          orderRoot: {
            orderId: order?.id,
            prtIdx: entity.detailInfo?.prtInfo?.prt?.id,
            prtMngIdx: entity.detailInfo?.prtInfo?.mng?.id,
            empIdx: entity.detailInfo?.emp?.id,
            orderName: entity?.detailInfo?.orderName,
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
        }
        
        setOrder(orderEntity);
        setOrderDetails(detailEntity);

        // 거래처가 변경되면 useEffect로 인해 mng id가 초기화 되므로 detail flag를 통해 초기화 제한
        // ** 아래 순서 반드시 지킬 것
        setPrtId(entity.detailInfo?.prtInfo?.prt?.id ?? "");
        setDetailFlag(true);
        setPrtMngId(entity.detailInfo?.prtInfo?.mng?.id ?? "");
        
        // 단계 설정
        setStepCurrent(
          // 발주 대기일 경우 1로 세팅
          orderEntity.type === "REQUEST_WAITING" ? 1 :
          // 도착 대기일 경우 2로 세팅
          orderEntity.type === "ARRIVAL_WAITING" ? 2 :
          // 입고일 경우 3으로 세팅
          orderEntity.type === "INPUT" ? 3 :
          0
        );
      }

      return result;
    },
    enabled: !!order?.id
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝
  
  // ------------ 발주 등록 및 수정 ------------ 시작
  const handleSubmit = async () => {
    try {
      if(!prtId || prtId === "" || !order?.orderRoot?.orderName || order.orderRoot?.orderName === "") {
        showToast("구매처, 발주명은 필수 입력입니다.", "error");
        return;
      }

      setOrder({...order, id:"" });
      const jsonData = {
        orderRoot: {
          ...order?.orderRoot,
          totalAmount: tot,
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
        orderDetail: orderDetails.map((item, index) => ({
          id: item?.id,
          mtNm: item.mtNm,
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
          mtPriceIdx: item?.mtPriceIdx,
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
        showToast("발주 저장 완료", "success");
        setStepCurrent(1);

        setOrder(null);
        const entity = result.data;
        setOrder({...order, id: entity?.id});
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 발주 등록 및 수정 ------------ 끝

  // -------------- step 2단계 -------------- 시작
  // 2단계 : 품목 추가, 단가 선택, 발주 저장
    // 발주 품목 내 원자재 선택 값
  const [selectMtIdx, setSelectMtIdx] = useState<{mtIdx:string, orderId:string, orderNo: number} | null>(null);
    // 발주 품목 내 원자재 선택 후 해당 원자재의 단가 목록
  const [selectMtPriceList, setSelectMtPriceList] = useState<materialPriceType[]>([]);
    // 원자재 단가 목록 내에서 선택 값
  const [selectMtPrice, setSelectMtPrice] = useState<materialPriceType[]>([]);
  
    // 발주 품목 내 원자재 선택 시 해당 원자재의 단가 목록 세팅
  useEffect(()=>{
    if(selectMtIdx) {
      const mp = mtPrice.filter(f=>f.material?.id === selectMtIdx.mtIdx);
      if(mp)  setSelectMtPriceList(mp);
    }
  }, [selectMtIdx])
  
    // 발주 품목 내 총액 계산
  const [tot, setTot] = useState<number>(0);
  useEffect(()=>{
    let tot = 0;
    orderDetails.map((row)=> {
      tot += ((row.mtOrderQty ?? 0) * (row.mtOrderInputPrice ?? 0));
    });
    setTot(tot);
  }, [orderDetails.map((row) => row.mtOrderAmount).join(",")])

    // 발주 품목 내 수량, 단가 변경 시 금액 자동 입력
  useEffect(() => {
    setOrderDetails((prev) => {
      const updatedProcs = prev.map((row) => {
        return { ...row, mtOrderAmount: (row.mtOrderQty ?? 0) * (row.mtOrderInputPrice ?? 0) };
      });
      return updatedProcs;
    });
  }, [orderDetails.map((row) => row.mtOrderInputPrice).join(","),
    orderDetails.map((row) => row.mtOrderQty).join(",")]);

    // 발주 품목 내 품목 삭제
  const handleDeleteMt = (index:number) => {
    if(orderDetails.length >= index) {
      setOrderDetails(prev => {
        const newArr = [...prev]; // 기존 배열 복사
        newArr.splice(index, 1);  // index번째 요소 1개 제거
        return newArr;
      });
    }
  }
  // ------------- step 2단계 --------------- 끝

  // ------------- step 3단계 --------------- 시작
  // 3단계 : 불량 검사, 도착/입고/자재 수량 계산, 도착일/승인일 입력
    // 불량 수량 저장
  const [badCnt, setBadCnt] = useState<{badNm:string; badId:string; mtId:string; cnt:number}[]>([]);
    // 불량 수
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

    // 계산된 불량 총합에 따라 발주 품목마다 불량, 입고 값 자동 변경
  useEffect(()=>{
    setOrderDetails((prev) =>
      prev.map((item) => ({
        ...item,
        mtOrderBadQty: item.id ? totalByMtId[item.id] : 0,
        mtOrderInputQty: item.id ? (item.mtOrderArrivalQty ?? 0) - (totalByMtId[item.id] ?? 0) : 0,
      }))
    );
  }, [totalByMtId])

    // 발주 품목 내 데이터 변경 (2, 3단계 공통 사용)
  const handleDataChange = (id:string, name:string, value:any) => {
    const updateData = orderDetails;
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
      setOrderDetails(newArray);
    }
  }
  // -------------- step 3단계 -------------- 끝

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"del" | "cancle" | "discard" | "close" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  return (<>
    <div className="p-30 flex v-between-h-center w-full">
      <p className="text-20 fw-500 font-semibold">{ id?.includes("new") ? "발주 등록" : "발주 수정"}</p>
      <p 
        className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
        onClick={(()=>{
          router.push("/buy/order");
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
            items={[{title:'발주 등록'}, {title:'단가 및 품목 선택'}, {title:'품질 검사'}, {title:'발주 품목 및 승인'}]}
          />
        </div>
        
        <div className="w-full !h-[calc(100%-80px)] overflow-y-auto flex flex-col gap-20">
          {/* 발주 컨텐츠 */}
          <Popup
            title="발주 등록"
            className="!min-h-[420px] !min-w-[800px]"
          >
            <div
              className="w-full h-full flex gap-30 overflow-auto"
              // 스크롤 자동을 위해 ref 추가
              ref={el => {if(el)  stepRef.current[0] = el;}}
            >
              <div className="w-[222px] flex flex-col gap-20">
                { !cookie.get('company').toString().includes("gpn") && <>
                  <LabelItem label="생산제품">
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
                      placeholder="생산제품 선택"
                    />
                  </LabelItem>
                  <LabelItem label="생산제품 공정">
                    { !order?.orderRoot?.worksheetIdxNoForgKey || order?.orderRoot?.worksheetIdxNoForgKey === "" ?
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
                        placeholder="생산제품 내 공정 선택"
                      />
                    }
                  </LabelItem>
                  </>}
                <LabelItem label="구매처">
                  <CustomAutoComplete
                    className="!w-full !h-32"
                    inputClassName="!h-32 !rounded-2"
                    option={csList}
                    value={prtId}
                    onChange={(value) => setPrtId(value)}
                    placeholder="구매처명 검색 후 선택"
                    addLabel="구매처 추가"
                    handleAddData={()=>setAddPartner(true)}
                  />
                </LabelItem>
                <LabelItem label="발주일">
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
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                </LabelItem>
                <LabelItem label="납품요구일">
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
                    afterDate={dayjs()} className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                </LabelItem>
                <LabelItem label="결제조건">
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
                    placeholder="결제조건 입력"
                  />
                </LabelItem>
              </div>

              <DividerV />

              <div className="!flex-1 flex flex-col gap-20">
                <LabelItem label="발주명">
                  <AntdInput 
                    value={order?.orderRoot?.orderName}
                    onChange={(e)=>{
                      setOrder({
                        ...order,
                        orderRoot: {
                          ...order?.orderRoot,
                          orderName: e.target.value,
                        }
                      })
                    }}
                    placeholder="발주명 입력"
                  />
                </LabelItem>
                <LabelItem label="발주 내용">
                  <TextArea
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
                    className="rounded-2"
                    style={{height:196,minHeight:196,maxHeight:400}}
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
                setStepCurrent(1);
                setOrderDetails([{
                  id: 'new-'+orderDetails.length+1,
                  mtOrderQty: 0,
                  mtOrderSizeW: 0,
                  mtOrderSizeH: 0,
                  mtOrderWeight: 0,
                  mtOrderThk: 0,
                  mtOrderPrice: 0,
                  mtOrderInputPrice: 0,
                  mtOrderAmount: 0,
                }]);
              }}
            >
              <Arrow /> 다음 단계
            </Button>}
          </div>

          {/* 단가 및 품목 선택 */}
          { stepCurrent === 1 &&
          <div
            className="flex flex-col gap-20"
            // 스크롤 자동을 위해 ref 추가
            ref={el => {if(el)  stepRef.current[1] = el;}}
          >
            <Popup title="발주 품목"
              titleEtc={ order?.status === "INPUT" ?
                <div className="h-center flex-1 justify-end gap-8">
                  <LabelThin label="도착일" />
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
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                  <LabelThin label="승인일" className="!ml-10"/>
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
                    afterDate={dayjs()} placeholder="승인일 선택"
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                </div>
                :
                <div className="flex-1 h-center justify-end gap-5">
                  총 발주 금액
                  <AntdInput
                    value={tot}
                    onChange={(e)=>setTot(Number(e.target.value))}
                    type="number"
                    className="!w-100"
                  />
                  원
                </div>
              }
            >
              { orderDetails.length > 0 && orderDetails.map((item, index) => (
                <BlueBox key={index}>
                  <BoxHead>
                    <div className="w-24 h-24 bg-back rounded-4 v-h-center">
                      {index+1}
                    </div>
                    <Items2
                      label1="원자재 그룹 선택" size1={3}
                      children1={
                        <AntdSelectFill
                          options={[
                            {value:"직접입력", label:"직접입력"},
                            ...(mtGrp.map((item)=>({
                              value:item.id,
                              label:item.mtGrpNm ?? "",
                            })))
                          ]}
                          value={item.materialGrpIdx}
                          onChange={(e)=>{
                            if(e+"" === "직접입력") setSelectMtIdx(null);
                            handleDataChange(item.id ?? '', "materialGrpIdx", e);
                            handleDataChange(item.id ?? '', "materialIdx", null);
                            handleDataChange(item.id ?? '', "mtNm", null);
                          }}
                          placeholder="원자재 그룹" styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                        />
                      }
                    />

                    <Items2
                      label1="원자재 선택" size1={3}
                      children1={
                        item.materialGrpIdx === "직접입력" ?
                        <AntdInput
                          value={item.mtNm}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtNm", e.target.value)}
                          placeholder="원자재명 입력"
                        />
                        :
                        <AntdSelect
                          options={(mtGrp
                            .find(f=>f.id === item.materialGrpIdx)?.materials ?? [])
                            .map((item) => ({
                              value:item.id,
                              label:item.mtNm ?? ""
                            })
                          )}
                          value={item.materialIdx}
                          onChange={(e)=>{
                            if(typeof e === "string")
                              setSelectMtIdx({mtIdx:e, orderId:item.id ?? "", orderNo: index+1});
                            handleDataChange(item.id ?? '', "materialIdx", e);
                          }}
                          placeholder="원자재 선택" styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                        />
                      }
                    />

                    <Items2
                      label1="단위"
                      children1={
                        <AntdInput
                          value={item.mtOrderUnit}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderUnit", e.target.value)}
                          placeholder="단위 입력"
                        />
                      }
                    />

                    <Items2
                      label1="재질"
                      children1={
                        <AntdInput
                          value={item.mtOrderTxtur}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderTxtur", e.target.value)}
                          placeholder="재질 입력"
                        />
                      }
                    />

                    <Items2
                      label1="W" size1={1}
                      children1={
                        <AntdInput
                          value={item.mtOrderSizeW}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderSizeW", e.target.value)}
                          type="number" placeholder="W 입력"
                        />
                      }
                    />

                    <Items2
                      label1="H" size1={1}
                      children1={
                        <AntdInput
                          value={item.mtOrderSizeH}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderSizeH", e.target.value)}
                          type="number" placeholder="H 입력"
                        />
                      }
                    />

                    <Items2
                      label1="두께" size1={1}
                      children1={
                        <AntdInput
                          value={item.mtOrderThk}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderThk", e.target.value)}
                          type="number" placeholder="두께 입력"
                        />
                      }
                    />

                    <Items2
                      label1="무게" size1={1}
                      children1={
                        <AntdInput
                          value={item.mtOrderWeight}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderWeight", e.target.value)}
                          type="number" placeholder="무게 입력"
                        />
                      }
                    />

                    <Items2
                      label1="수량" size1={1}
                      children1={
                        <AntdInput
                          value={item.mtOrderQty}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderQty", e.target.value)}
                          type="number" placeholder="수량 입력"
                        />
                      }
                    />

                    <Items2
                      label1="단가"
                      children1={
                        <AntdInput
                          value={item.mtOrderInputPrice}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderInputPrice", e.target.value)}
                          type="number" placeholder="단가 입력"
                        />
                      }
                    />

                    <Items2
                      label1="금액"
                      children1={
                        <AntdInput
                          value={item.mtOrderAmount}
                          onChange={(e)=>handleDataChange(item.id ?? '', "mtOrderAmount", e.target.value)}
                          type="number" placeholder="금액 입력"
                        />
                      }
                    />

                    <div className="flex-1 h-center justify-end">
                      <Dropdown trigger={['click']} menu={{ items:[{
                        label: 
                          <div className="text-[red] h-center gap-5">
                            <p className="w-16 h-16"><Trash /></p>
                            삭제
                          </div>,
                        key: 0,
                        onClick:()=>{
                          handleDeleteMt(index);
                        }}
                      ]}}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space>
                            <div className="w-24 h-24 cursor-pointer v-h-center">
                              <p className="w-16 h-16"><Edit/></p>
                            </div>
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                  </BoxHead>
                  <div>
                    { !item.materialIdx && item.materialGrpIdx !== "직접입력" &&
                      <div className="w-full h-50 v-h-center bg-white">
                      원자재 선택 시 구매처에 설정된 단가 목록을 확인할 수 있습니다.
                      </div>
                    }
                    { item.materialIdx &&
                    <AntdTableEdit
                      columns={BuyOrderMtPriceClmn(
                        item,
                        orderDetails,
                        setOrderDetails,
                      )}
                      data={mtPrice.filter(f=>f.material?.id === item.materialIdx)}
                      styles={{
                        th_bg: "#FAFAFA",
                        td_bg: "#FFFFFF",
                        td_ht: '40px',
                        th_ht: '40px',
                        round: "0",
                        th_fw: "bold",
                        td_pd: "0",
                      }}
                    />}
                  </div>
                </BlueBox>
              ))}
              <div className="h-40 gap-4 v-h-center cursor-pointer bg-[#EEEEEE45] text-[#00000085] rounded-8"
                onClick={() => {
                  setOrderDetails((prev: buyOrderDetailType[]) =>[
                    ...prev,
                    {
                      id:'new-'+prev.length+1,
                      mtOrderQty: 0,
                      mtOrderSizeW: 0,
                      mtOrderSizeH: 0,
                      mtOrderWeight: 0,
                      mtOrderThk: 0,
                      mtOrderPrice: 0,
                      mtOrderInputPrice: 0,
                      mtOrderAmount: 0,
                    },
                  ]);
                }}
              >
                <PlusOutlined />
                <span>품목 추가하기</span>
              </div>
            </Popup>

            {/* 발주 하단 버튼 */}
            <div className="w-full h-center px-30 justify-end">
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>handleSubmit()}
              >
                <Arrow /> 발주 저장
              </Button>
            </div>
          </div>
          }

          {/* 품질 검사 */}
          { stepCurrent === 2 &&
          <div
            className="flex flex-col gap-20"
            // 스크롤 자동을 위해 ref 추가
            ref={el => {if(el)  stepRef.current[2] = el;}}
          >
            <Popup
              title="품질 검사"
              titleEtc={
                <div className="h-center flex-1 justify-end gap-8">
                  <LabelThin label="도착일" />
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
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                  <LabelThin label="승인일" className="!ml-10"/>
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
                    afterDate={dayjs()} placeholder="승인일 선택"
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                </div>
              }
            >
              { orderDetails.length < 1 &&
              <div className="w-full h-full min-h-100 v-h-center">
                입력한 발주 품목이 없습니다.
              </div>}
              { orderDetails.map((item:buyOrderDetailType, index:number) => (
              <div key={index}
                className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 px-15 pb-15"
              >
                <div className="w-full">
                  <div className="flex h-center p-10 min-h-86 gap-10">
                    <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{(item.order ?? 0)+1}</p>
                    <div className="w-80 font-[500]">
                      불량종류
                    </div>
                  { mtBad.filter(f=>f.materialGroup?.id === item.materialGrpIdx).length > 0 ?
                    <div className="flex flex-1 flex-wrap gap-10">
                      {mtBad.filter(f=>f.materialGroup?.id === item.materialGrpIdx).map((badItem:materialGroupBadType, index:number) => (
                        <div key={index} className="h-center mb-4">
                        <LabelItem label={badItem.badNm ?? ""} className="!gap-0">
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
                            type="number" className="!w-[150px]" styles={{ht:"32px"}} placeholder="해당 검사의 불량 개수"
                          />
                        </LabelItem>
                      </div>))}
                    </div>
                    :
                    <div className="w-full h-full v-h-center">
                      설정된 불량 검사가 없습니다
                    </div>}

                    <DividerV className="!h-full !min-h-86 !w-1 border-line" />

                    <div className="flex gap-10">
                      <LabelItem label="도착 수량" className="!gap-0">
                        <AntdInput
                          value={item.mtOrderArrivalQty}
                          onFocus={() => {
                            if(!item.mtOrderArrivalQty || item.mtOrderArrivalQty < 1)
                              handleDataChange(item.id ?? "", 'mtOrderArrivalQty', item.mtOrderQty ?? 0);
                          }}
                          onChange={(e) => {
                            handleDataChange(item.id ?? "", 'mtOrderArrivalQty', Number(e.target.value ?? 0));
                          }}
                          type="number" className="!w-80" styles={{ht:"32px"}}
                        />
                      </LabelItem>
                      <LabelItem label="입고 수량" className="!gap-0">
                        <AntdInput
                          value={item.mtOrderInputQty}
                          onChange={(e) => {
                            handleDataChange(item.id ?? "", 'mtOrderInputQty', Number(e.target.value ?? 0));
                          }}
                          type="number" className="!w-80" styles={{ht:"32px"}}
                        />
                      </LabelItem>
                      <LabelItem label="재고 수량" className="!gap-0">
                        <AntdInput
                          value={item.mtOrderInvenQty}
                          disabled
                          type="number" className="!w-80" styles={{ht:"32px"}}
                        />
                      </LabelItem>
                    </div>
                  </div>
                </div>
                <AntdTableEdit
                  columns={BuyOrderMtViewClmn().filter(f=>f.dataIndex !== 'order')}
                  data={[item]}
                  styles={{
                    th_bg:'#F9F9FB',
                    th_fw:'bold',
                    td_ht: '40px',
                    th_ht: '40px',
                    td_bg:'#FFF',
                    round:'0'
                  }}
                />
              </div>
              ))}
            </Popup>

            {/* 발주 하단 버튼 */}
            <div className="w-full h-center px-30 justify-end">
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>handleSubmit()}
              >
                <Arrow /> 발주 저장
              </Button>
            </div>
          </div>
          }

          {/* 품목 확인 및 승인일 */}
          { stepCurrent === 3 &&
          <div
            className="flex flex-col gap-20"
            // 스크롤 자동을 위해 ref 추가
            ref={el => {if(el)  stepRef.current[3] = el;}}
          >
            <Popup
              title="발주 품목"
              titleEtc={ order?.status === "INPUT" &&
                <div className="h-center flex-1 justify-end gap-8">
                  <LabelThin label="도착일" />
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
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                  <LabelThin label="승인일" className="!ml-10"/>
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
                    afterDate={dayjs()} placeholder="승인일 선택"
                    className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]" suffixIcon={"cal"}
                  />
                </div>
              }
            >
              <AntdTableEdit
                columns={BuyOrderMtViewClmn()}
                data={orderDetails}
                setData={setOrderDetails}
                styles={{
                  th_bg: "#FAFAFA",
                  td_bg: "#FFFFFF",
                  td_ht: '40px',
                  th_ht: '40px',
                  round: "0",
                  th_fw: "bold",
                  td_pd: "0",
                }}
              />
            </Popup>

            {/* 발주 하단 버튼 */}
            <div className="w-full h-center px-30 justify-end">
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>handleSubmit()}
              >
                <Arrow /> 발주 저장
              </Button>
            </div>
          </div>
          }
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
    </div>
  </>)
}

export default OrderAddLayout;