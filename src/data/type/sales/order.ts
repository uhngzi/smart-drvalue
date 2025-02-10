// 메인 - 고객발주

import { Dayjs } from "dayjs";
import { partnerMngRType, partnerRType } from "../base/partner";
import { HotGrade, ModelStatus, PrtTypeEm, SalesOrderStatus } from "../enum";

// 고객발주 읽기 타입
export type salesOrderRType = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  orderNm: string;
  orderDt: Date;
  orderRepDt: Date;
  orderTxt: string;
  isDiscard: boolean;
  totalOrderPrice: number;
  hotGrade: HotGrade,
  emp: {
    id: string;
    name: string;
    userId: string;
    status: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
  products: Array<salesOrderProductRType>,
  prtInfo: {
    id: string;
    prt: {
      id: string;
      prtTypeEm: PrtTypeEm;
      prtNm: string;
      prtRegCd: number;
      prtSnm: string;
      prtEngNm: string;
      prtEngSnm: string;
      prtRegNo: string;
      prtCorpRegNo: string;
      prtBizType: string;
      prtBizCate: string;
      prtAddr: string;
      prtAddrDtl: string;
      prtZip: string;
      prtCeo: string;
      prtTel: string;
      prtFax: string;
      prtEmail: string;
      emp: {
        id: string;
        name: string;
        userId: string;
        status: string;
        lastLoginAt: Date;
        createdAt: Date | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
      };
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
    },
    mng: partnerMngRType;
  }
}

export type salesOrderDetailRType = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id: string;
  orderNm: string;
  orderDt: Date | Dayjs | null;
  orderRepDt: Date | Dayjs | null;
  orderTxt: string;
  totalOrderPrice: number;
  hotGrade: HotGrade;
  isDiscard: boolean;
  emp: {
    createdAt: Date | Dayjs | null;
    updatedAt: Date | Dayjs | null;
    deletedAt: Date | Dayjs | null;
    id: string;
    name: string;
    userId: string;
    status: string;
    lastLoginAt:  Date | Dayjs | null;
    detail: any;
  },
  files: Array<{
    id: string;
    storageId: string;
    ordNo: number;
  }>,
  products: salesOrderProductRType[];
  prtInfo: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id: string;
    prt: partnerRType;
    mng: partnerMngRType;
  }
}

// 고객발주 생성, 수정 타입
export type salesOrderCUType = {
  id?: string;
  partnerId?: string;
  partnerManagerId?: string;
  orderName?: string;
  orderDt?: Date | Dayjs | null;
  orderRepDt?: Date | Dayjs | null;
  orderTxt?: string;
  totalOrderPrice?: number;
  empId?: string;
  hotGrade?: HotGrade | null;
  files?: string[];
  products?: salesOrderProcuctCUType[];
}

// 고객발주 초기값 생성
export const newDataSalesOrderCUType = ():salesOrderCUType => {
  return {
    partnerId: '',
    partnerManagerId: '',
    orderName: '',
    orderDt: null,
    orderRepDt: null,
    orderTxt: '',
    totalOrderPrice: 0,
    empId: '',
    hotGrade: null,
    files: [],
    products: [],
  }
}

// 고객발주 필수값 필드
export const salesOrderReq = () => {
  return [
    { field: 'partnerId', label: '고객' },
    { field: 'partnerManagerId', label: '담당자 정보' },
    { field: 'orderDt', label: '발주일' },
    { field: 'orderTxt', label: '발주 메일 내용' },
    { field: 'hotGrade', label: '긴급 상태' },
    // { field: 'orderName', label: '발주명' },
    // { field: 'totalOrderPrice', label: '총 수주 금액' },
    // { field: 'orderRepDt', label: '납기요청일' },
    // { field: 'empId', label: '영업 담당' },
  ]
}

// 고객발주 내 모델 읽기 타입
export type salesOrderProductRType = {
  id: string;
  currPrdInfo: string;
  glbStatus: {  // 현재 모델 상태
    id: string;
    salesOrderStatus: SalesOrderStatus;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
  modelStatus: ModelStatus;
  orderDt: Date | Dayjs;
  orderNo: string;
  orderTit: string;
  prtOrderNo: string;
  orderPrdRemark: string;
  orderPrdCnt: number;
  orderPrdUnitPrice: number;
  orderPrdPrice: number;
  orderPrdDueReqDt: Date | Dayjs;
  orderPrdDueDt: Date | Dayjs;
  orderPrdHotGrade: HotGrade;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  model?: any;
}

// 고객발주 내 모델 생성, 수정 타입
export type salesOrderProcuctCUType = {
  id?: string;
  customPartnerManagerId?: string;
  currPrdInfo?: {},
  modelId?: string;
  modelStatus?: ModelStatus | null;
  orderDt?: Date | Dayjs | null;
  orderNo?: string;
  orderTit?: string;
  prtOrderNo?: string;
  orderPrdRemark?: string;
  orderPrdCnt: number;
  orderPrdUnitPrice: number;
  orderPrdPrice: number;
  orderPrdDueReqDt?: Date | Dayjs | null;
  orderPrdDueDt?: Date | Dayjs | null;
  orderPrdHotGrade: HotGrade | null;
}

// 고객발주 내 모델 초기값 생성
export const newDataSalesOrderProductCUType = ():salesOrderProcuctCUType => {
  return {
    modelStatus: null,
    orderDt: null,
    orderNo: '',
    orderTit: '',
    prtOrderNo: '',
    orderPrdRemark: '',
    orderPrdCnt: 0,
    orderPrdUnitPrice: 0,
    orderPrdPrice: 0,
    orderPrdDueReqDt: null,
    orderPrdDueDt: null,
    orderPrdHotGrade: null,
  }
}

// 고객발주 내 모델 필수값 필드
export const salesOrderProcuctReq = () => {
  return [
    { field : 'modelStatus', label: '모델 구분' },
    { field : 'orderTit', label: '발주 모델명' },
    { field : 'orderPrdCnt', label: '모델 수량' },
    { field : 'orderPrdPrice', label: '모델 수주 금액' },
    // { field : 'orderDt', label: '수주일' },
    // { field : 'orderNo', label: '수주 번호' },
    // { field : 'orderPrdUnitPrice', label: '모델 기준 단가' },
    // { field : 'orderPrdHotGrade', label: '모델 긴급도' },
  ]
}