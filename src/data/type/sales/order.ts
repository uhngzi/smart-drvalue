// 메인 - 고객발주

import { Dayjs } from "dayjs";
import { partnerMngRType, partnerRType } from "../base/partner";
import { AnyStatus, FinalGlbStatus, HotGrade, LayerEm, ModelStatus, ModelTypeEm, PrtTypeEm, SalesOrderStatus, SpecStatus } from "../enum";
import { commonCodeRType } from "../base/common";
import { boardType } from "../base/board";

// 고객발주 읽기 타입
export type salesOrderRType = {
  id: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  orderNm: string;
  orderDt: Date;
  orderRepDt: Date;
  orderTxt: string;
  isDiscard: boolean;
  totalOrderPrice: number;
  hotGrade: HotGrade;
  finalGlbStatus: FinalGlbStatus;
  emp: {
    id: string;
    name: string;
    userId: string;
    status: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  products: Array<salesOrderProductRType>,
  prtInfo: {
    id: string;
    prt: partnerRType;
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
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
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
  finalGlbStatus: FinalGlbStatus;
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
    // { field: 'partnerManagerId', label: '담당자 정보' },
    { field: 'orderTxt', label: '발주 메일 내용' },
    // { field: 'orderDt', label: '발주일' },
    // { field: 'hotGrade', label: '긴급 상태' },
    { field: 'orderName', label: '발주명' },
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
    salesOrderStatusChangeJson: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    json?: any;
  },
  worksheet: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    wkPrdCnt?: number;
    wkProcCnt?: number;
    wkLatestDtm?: Date | Dayjs | null;
    wkLatestProcIdx?: number;
    wsExpDt?: Date | Dayjs | null;
    wsSchDt?: Date | Dayjs | null;
    wsStDt?: Date | Dayjs | null;
    wkEdDt?: Date | Dayjs | null;
    wkOutDt?: Date | Dayjs | null;
    wkOutCnt?: number;
    wkBadCnt?: number;
    priceUnitChkYn?: 0 | 1,
    invChkDt?: Date | Dayjs | null;
    invChkCnt?: number;
    isWait?: number;
    wsRemark?: string | null;
  };
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
  disabled?: boolean;
  index?: number;
}

// 고객발주 내 모델 생성, 수정 타입
export type salesOrderProcuctCUType = {
  id?: string;
  glbStatus?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    salesOrderStatus?: SalesOrderStatus;
    salesOrderStatusChangeJson?: string;
    specStatus?: SpecStatus;
    anyStatus?: AnyStatus;
    relation?: string;
    json?: {
      date: Date | Dayjs | null;
      content: string;
      isApproved: boolean;
    }[];
  },
  customPartnerManagerId?: string;
  currPrdInfo?: any,
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
  disabled?: boolean;
  index?: number;
  completed?: boolean;
  prdMngNo?: string;
  orderPrtNo?: string;
  remarks?:string;
  approvalYn?: boolean;
}

// 고객발주 내 모델 초기값 생성
export const newDataSalesOrderProductCUType = ():salesOrderProcuctCUType => {
  return {
    modelStatus: ModelStatus.NEW,
    orderDt: null,
    // orderNo: '',
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
    { field : 'orderTit', label: '모델명' },
    // { field : 'prtOrderNo', label: '고객측 관리번호' },
    { field : 'modelStatus', label: '모델 상태' },
    { field : 'orderPrdCnt', label: '모델 수량' },
    { field : 'orderPrdPrice', label: '모델 수주 금액' },
    { field : 'orderPrdDueDt', label: '납기일' },
    // { field : 'orderPrdUnitPrice', label: '모델 기준 단가' },
    // { field : 'orderPrdHotGrade', label: '모델 긴급도' },
  ]
}

export type salesOrderWorkSheetType = {
  id?: string;
  currPrdInfo?: string;
  tempPrdInfo?: string;
  glbStatus?: {
    id?: string;
    salesOrderStatus?: SalesOrderStatus;
    salesOrderStatusChangeJson?: {
      date?: Date | Dayjs | null;
      content?: string;
      isApproved?: boolean;
    }[];
    specStatus?: SpecStatus;
    anyStatus?: AnyStatus;
    relation?: string[],
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  worksheet?: {
    id?: string;
    progress?: number;
    wkLatestMemo?: string;
    specModel?: {
      id?: string;
      modelMatch?: {
        id?: string;
        modelStatus?: ModelStatus;
      };
      usedYn?: boolean;
      inactiveYn?: boolean;
      prdNm?: string;
      prdRevNo?: string;
      prdMngNo?: string;
      layerEm?: LayerEm;
      modelTypeEm?: ModelTypeEm;
      thk?: number;
      board?: boardType;
      ordPrdNo?: string;
      mnfNm?: string;
      material?: commonCodeRType;
      surface?: commonCodeRType;
      copOut?: number;
      copIn?: number;
      smPrint?: commonCodeRType;
      smColor?: commonCodeRType;
      smType?: commonCodeRType
      mkPrint?: commonCodeRType;
      mkColor?: commonCodeRType;
      mkType?: commonCodeRType;
      spPrint?: commonCodeRType;
      spType?: commonCodeRType;
      aprType?: commonCodeRType;
      vcutYn?: boolean;
      vcutType?: commonCodeRType;
      fpNo?: string;
      drgNo?: string;
      unit?: commonCodeRType;
      pcsW?: number;
      pcsL?: number;
      kitW?: number;
      kitL?: number;
      pnlW?: number;
      pnlL?: number;
      ykitW?: number;
      ykitL?: number;
      ypnlW?: number;
      ypnlL?: number;
      kitPcs?: number;
      pnlKit?: number;
      sthPnl?: number;
      sthPcs?: number;
      pltThk?: number;
      pltAlph?: number;
      spPltNi?: number;
      spPltNiAlph?: number;
      spPltAu?: number;
      spPltAuAlph?: number;
      pinCnt?: number;
      ulTxt1?: string;
      ulTxt2?: string;
      ulCd1?: commonCodeRType;
      ulCd2?: commonCodeRType;
      specLine?: number;
      specSpace?: number;
      specDr?: number;
      specPad?: number;
      prdCnt?: number;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
      spec?: {
        createdAt?: Date | Dayjs | null;
        updatedAt?: Date | Dayjs | null;
        deletedAt?: Date | Dayjs | null;
        id?: string;
        specNo?: string;
        specNoCount?: number;
        specLamNo?: string;
        specLamThk?: number;
        brdArrYldRate?: number;
        wksizeW?: number;
        wksizeH?: number;
        stdW?: number;
        stdH?: number;
        cutCnt?: number;
        jYn?: boolean;
        brdArrStorageKey?: string;
        prcNotice?: string;
        camNotice?: string;
      }
    },
    wkPrdCnt?: number;
    wkProcCnt?: number;
    wkLatestDtm?: Date | Dayjs | null;
    wsExpDt?: Date | Dayjs | null;
    wsSchDt?: Date | Dayjs | null;
    wsStDt?: Date | Dayjs | null;
    wkEdDt?: Date | Dayjs | null;
    wkOutDt?: Date | Dayjs | null;
    wkOutCnt?: number;
    wkBadCnt?: number;
    priceUnitChkYn?: boolean;
    invChkDt?: Date | Dayjs | null;
    invChkCnt?: number;
    wsRemark?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    isWait?: boolean;
  },
  prtInfo?: {
    id?: string;
    prt?: partnerRType;
    mng?: partnerMngRType;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  order?: {
    id?: string;
    orderNm?: string;
    orderDt?: Date | Dayjs | null;
    orderRepDt?: Date | Dayjs | null;
    orderTxt?: string;
    isDiscard?: boolean;
    hotGrade?: HotGrade;
    totalOrderPrice?: number;
    emp?: {
      id?: string;
      name?: string;
      userId?: string;
      status?: string;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    }
  },
  modelStatus?: ModelStatus;
  orderDt?: Date | Dayjs | null;
  orderNo?: string;
  orderTit?: string;
  prtOrderNo?: string;
  orderPrdRemark?: string;
  orderPrdCnt?: number;
  orderPrdUnitPrice?: number;
  orderPrdPrice?: number;
  orderPrdDueReqDt?: Date | Dayjs | null;
  orderPrdDueDt?: Date | Dayjs | null;
  orderPrdHotGrade?: HotGrade;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type salesEstimateType = {
  id?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  isDiscard?: boolean;
  estimateNm?: string;
  estimateDt?: Date | Dayjs | null;
  estimateNo?: string;
  estimateTxt?: string;
  totalEstimatePrice?: number;
  hotGrade?: HotGrade;
  emp?: {
    id?: string;
    name?: string;
    userId?: string;
    status?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  products?: [
    {
      id?: string;
      currPrdInfo?: string;
      tempPrdInfo?: string;
      selected?: boolean;
      model?: { id: string; }
      modelStatus?: ModelStatus;
      modelTypeEm?: ModelTypeEm;
      layerEm?: LayerEm;
      estimateModelNm?: string;
      array?: string;
      texture?: commonCodeRType;
      sizeH?: number;
      sizeW?: number;
      thickness?: number;
      quantity?: number;
      unitPrice?: number;
      calculatedUnitPrice?: number;
      surfaceTreatment?: string;
      cost?: number;
      calculatedCost?: number;
      autoCalculatedUnitPrice?: number;
      autoCalculatedCost?: number;
      remark?: string;
      specialSpecifications?: {
        processIdx?: string;
        remark?: string;
        weight?: number;
        addCost?: number;
        minRange?: number;
        maxRange?: number;
        unitIdx?: string;
      }[];
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    }
  ],
  prtInfo?: {
    id?: string;
    prt?: partnerRType;
    mng?: partnerMngRType;
  },
  files?: {
    id?: string;
    storageId?: string;
    ordNo?: number;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  }[];
}