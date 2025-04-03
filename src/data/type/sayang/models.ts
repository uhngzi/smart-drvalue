// 메인 - 모델, 모델 매칭

import { Dayjs } from "dayjs";
import { BoardGroupType, boardType } from "../base/board";
import { commonCodeRType } from "../base/common";
import { partnerMngRType, partnerRType } from "../base/partner";
import { AnyStatus, HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus, SpecStatus } from "../enum";

export type orderModelType = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id: string;
  currPrdInfo?: any;
  tempPrdInfo?: any;
  modelStatus?: ModelStatus;
  orderDt?: string;
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
  },
  prtInfo?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    prt?: partnerRType;
    mng?: partnerMngRType;
  },
  orderModel?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    currPrdInfo?: string;
    tempPrdInfo?: string;
    modelStatus?: string;
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
    prtInfo?: {
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
      id?: string;
      prt?: partnerRType | null;
      mng?: partnerMngRType | null;
    }
  }
  order?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    orderNm?: string;
    orderDt?: Date | Dayjs | null;
    orderRepDt?: Date | Dayjs | null;
    orderTxt?: string;
    totalOrderPrice?: number;
    hotGrade?: HotGrade;
    isDiscard?: boolean;
    emp?: {
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
      id?: string;
      name?: string;
      userId?: string;
      status?: string;
      lastLoginAt?: Date | Dayjs | null;
    }
  },
  model?: modelsType | null;
  editModel?: any;  // 프론트 내에서 모델 값 저장을 위해 추가
  completed?: boolean;
  temp?: boolean;
  index?: number;
  prdMngNo?: string;
}

export type modelsType = {
  id: string;
  glbStatus?: {
    id: string;
    salesOrderStatus: SalesOrderStatus;
    salesOrderStatusChangeJson: {
      date: Date | Dayjs | null,
      content: string;
      isApproved: boolean;
    }
  };
  partner: partnerRType;
  usedYn: boolean;
  inactiveYn: boolean;
  prdNm: string;
  prdRevNo: string;
  prdMngNo: string;
  layerEm: LayerEm;
  modelTypeEm: ModelTypeEm;
  thk: number;
  board: boardType;
  mnfNm: string;
  material: commonCodeRType;
  surface: commonCodeRType;
  copOut: number;
  copIn: number;
  smPrint: commonCodeRType;
  smColor: commonCodeRType;
  smType: commonCodeRType;
  mkPrint: commonCodeRType;
  mkColor: commonCodeRType;
  mkType: commonCodeRType;
  spPrint: commonCodeRType;
  spType: commonCodeRType;
  aprType: commonCodeRType;
  vcutYn: false,
  vcutText: string;
  vcutType: commonCodeRType;
  fpNo: string;
  drgNo: string;
  unit: commonCodeRType;
  pcsW: number;
  pcsL: number;
  kitW: number;
  kitL: number;
  pnlW: number;
  pnlL: number;
  ykitW: number;
  ykitL: number;
  ypnlW: number;
  ypnlL: number;
  kitPcs: number;
  pnlKit: number;
  sthPnl: number;
  sthPcs: number;
  pltThk: number;
  pltAlph: number;
  spPltNi: number;
  spPltNiAlph: number;
  spPltAu: number;
  spPltAuAlph: number;
  pinCnt: number;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  ulTxt1?: string;
  ulTxt2?: string;
  ulCd1: { id?: string; };
  ulCd2: { id?: string; };
  specLine?: number;
  specSpace?: number;
  specDr?: number;
  specPad?: number;
  approvalYn?: boolean;
}

export type salesModelsType = {
  id?: string;
  glbStatus?: {
    id: string;
    salesOrderStatus: SalesOrderStatus;
    salesOrderStatusChangeJson: {
      date: Date | Dayjs | null,
      content: string;
      isApproved: boolean;
    }
  };
  partner?: partnerRType;
  usedYn?: boolean;
  inactiveYn?: boolean;
  prdNm?: string;
  prdRevNo?: string;
  prdMngNo?: string;
  layerEm?: LayerEm;
  modelTypeEm?: ModelTypeEm;
  thk?: number;
  board?: boardType;
  mnfNm?: string;
  material?: commonCodeRType;
  surface?: commonCodeRType;
  copOut?: number;
  copIn?: number;
  boardGroup?: BoardGroupType;
  smPrint?: commonCodeRType;
  smColor?: commonCodeRType;
  smType?: commonCodeRType;
  mkPrint?: commonCodeRType;
  mkColor?: commonCodeRType;
  mkType?: commonCodeRType;
  spPrint?: commonCodeRType;
  spType?: commonCodeRType;
  aprType?: commonCodeRType;
  vcutYn?: false,
  vcutType?: commonCodeRType;
  vcutText?: string;
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
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  approvalYn?: boolean;
  orderPrtNo?: string;
  remarks?: string;
}

// 모델 생성, 수정 타입
export type modelsCUType = {
  inactiveYn: boolean;
  partner: { id: string; };
  prdNm: string;
  prdRevNo: string;
  prdMngNo: string;
  layerEm: LayerEm | null;
  modelTypeEm: ModelTypeEm | null;
  thk: number;
  board: { id: string; };
  mnfNm: string;
  material: { id: string; };
  surface: { id: string; };
  copOut: number;
  copIn: number;
  smPrint: { id: string; };
  smColor: { id: string; };
  smType: { id: string; };
  mkPrint: { id: string; };
  mkColor: { id: string; };
  mkType: { id: string; };
  spPrint?: { id: string; };
  spType?: { id: string; };
  aprType: { id: string; };
  vcutYn: boolean;
  vcutType?: { id: string; };
  fpNo?: string;
  unit: { id: string; };
  pcsW: number;
  pcsL: number;
  kitW: number;
  kitL: number;
  pnlW: number;
  pnlL: number;
  ykitW: number;
  ykitL: number;
  ypnlW: number;
  ypnlL: number;
  kitPcs: number;
  pnlKit: number;
  sthPnl: number;
  sthPcs: number;
  pltThk: number;
  pltAlph: number;
  spPltNi?: number;
  spPltNiAlph?: number;
  spPltAu?: number;
  spPltAuAlph?: number;
  pinCnt: number;
  approvalYn?: boolean;
}

// 사양 내 모델 초기값 생성
export const newDataModelsType = ():modelsCUType => {
  return {
    inactiveYn: false,
    partner: { id: '' },
    prdNm: '',
    prdRevNo: '',
    prdMngNo: '',
    layerEm: null,
    modelTypeEm: null,
    thk: 0,
    board: { id: '' },
    mnfNm: '',
    material: { id: '' },
    surface: { id: '' },
    copOut: 1,
    copIn: 1,
    smPrint:  { id: '' },
    smColor:  { id: '' },
    smType:  { id: '' },
    mkPrint:  { id: '' },
    mkColor:  { id: '' },
    mkType:  { id: '' },
    aprType: { id: '' },
    vcutYn: true,
    fpNo: '',
    unit: { id: '' },
    pcsW: 0,
    pcsL: 0,
    kitW: 0,
    kitL: 0,
    pnlW: 0,
    pnlL: 0,
    ykitW: 0,
    ykitL: 0,
    ypnlW: 0,
    ypnlL: 0,
    kitPcs: 0,
    pnlKit: 0,
    sthPnl: 0,
    sthPcs: 0,
    pltThk: 0,
    pltAlph: 0,
    spPltNi: 0,
    spPltNiAlph: 0,
    spPltAu: 0,
    spPltAuAlph: 0,
    pinCnt: 0,
  }
}

// 사양 내 모델 매칭 읽기 타입
export type modelsMatchRType = {
  index?: number;
  id: string;
  model?: modelsType;
  glbStatus?: {
    id: string;
    salesOrderStatus: SalesOrderStatus;
    salesOrderStatusChangeJson: {
      date: Date | Dayjs | null,
      content: string;
      isApproved: boolean;
    }[];
    specStatus: SpecStatus;
    relation: string[];
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  orderModel?: {
    id: string;
    currPrdInfo: any,
    tempPrdInfo?: any,
    prtInfo: {
      id: string;
      prt: partnerRType;
      mng: partnerMngRType;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    },
    order: {
      id: string;
      isDiscard: boolean;
      orderNm: string;
      orderDt: Date | Dayjs | null;
      orderRepDt: Date | Dayjs | null;
      orderTxt: string;
      totalOrderPrice: number;
      hotGrade: HotGrade;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    },
    model: modelsType;
    modelStatus: ModelStatus;
    orderNo: string;
    orderTit: string;
    prtOrderNo: string;
    orderPrdRemark: string;
    orderPrdCnt: number;
    orderPrdUnitPrice: number;
    orderPrdPrice: number;
    orderPrdDueReqDt: Date | Dayjs | null;
    orderPrdDueDt: Date | Dayjs | null;
    orderPrdHotGrade: HotGrade;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  tempModel?: any;
}

export type modelsMatchDetail = {
  id: string;
  index?: number; //프론트에서 사용하는 인덱스 번호
  model?: modelsType;
  glbStatus?: {
    id: string;
    salesOrderStatus: SalesOrderStatus;
    salesOrderStatusChangeJson: { 
      date: Date | Dayjs | null;
      content: string;
      isApproved: boolean;
    }[];
    specStatus: SpecStatus;
    anyStatus: AnyStatus;
    relation: string[];
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  orderModel: orderModelType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

// 모델 매칭 내 모델 필수값 필드
export const modelReq = () => {
  return [
    { field : 'prdNm', label: '모델명' },
    { field : 'prdRevNo', label: 'REV' },
    { field : 'layerEm', label: '층' },
    { field : 'modelTypeEm', label: '모델 구분' },
    { field : 'thk', label: '두께' },
    { field : 'board', label: '원판' },
    { field : 'mnfNm', label: '제조사' },
    { field : 'material', label: '재질' },
    { field : 'surface', label: '표면' },
    { field : 'copOut', label: '동박외층' },
    { field : 'copIn', label: '동박내층' },
    { field : 'smPrint', label: 'S/M인쇄' },
    { field : 'smColor', label: 'S/M색상' },
    { field : 'smType', label: 'S/M종류' },
    { field : 'mkPrint', label: 'M/K인쇄' },
    { field : 'mkColor', label: 'M/K색상' },
    { field : 'mkType', label: 'M/K종류' },
    { field : 'aprType', label: '외형가공형태' },
    { field : 'vcutYn', label: 'VCUT 유무' },
    { field : 'unit', label: '단위' },
    { field : 'pcsW', label: 'PCS X' },
    { field : 'pcsL', label: 'PCS Y' },
    { field : 'kitW', label: 'KIT X' },
    { field : 'kitL', label: 'KIT Y' },
    { field : 'pnlW', label: 'PNL X' },
    { field : 'pnlL', label: 'PNL Y' },
    { field : 'ykitW', label: '연조KIT X' },
    { field : 'ykitL', label: '연조KIT Y' },
    { field : 'ypnlW', label: '연조PNL X' },
    { field : 'ypnlL', label: '연조PNL Y' },
    { field : 'kitPcs', label: 'KITPcs' },
    { field : 'pnlKit', label: 'pnlKIT' },
    { field : 'sthPnl', label: 'sthPnl' },
    { field : 'sthPcs', label: 'sthPcs' },
    { field : 'pltThk', label: '도금 두께' },
    { field : 'pltAlph', label: '도금 두께 여유' },
    { field : 'pinCnt', label: '핀 수' },
  ]
}

export type sayangType = {
  specId?: string;
  specDetail: {
    specNo?: string;
    specLamination?: { id: string; };
    specLamNo?: string;
    specLamThk?: string;
    board?: { id: string; };
    brdArrYldRate?: string;
    wksizeW?: string;
    wksizeH?: string;
    stdW?: string;
    stdH?: string;
    brdArrStorageKey?: string;
    cutCnt?: string;
    jYn?: string;
    prcNotice?: string;
    camNotice?: string;
  },
  models: {
    id: string;
    glbStatusId: string;
    modelMatchId: string;
    prdNm: string;
    prdRevNo: string;
    layerEm: LayerEm;
    modelTypeEm: ModelTypeEm;
    thk: number;
    board: commonCodeRType;
    mnfNm: string;
    material: commonCodeRType;
    surface: commonCodeRType;
    copOut: number;
    copIn: number;
    smPrint: commonCodeRType;
    smColor: commonCodeRType;
    smType: commonCodeRType;
    mkPrint: commonCodeRType;
    mkColor: commonCodeRType;
    mkType: commonCodeRType;
    spPrint?: commonCodeRType;
    spType?: commonCodeRType;
    aprType: commonCodeRType;
    vcutYn: boolean;
    vcutType: commonCodeRType;
    fpNo?: string;
    drgNo?: string;
    unit: commonCodeRType;
    pcsW: number;
    pcsL: number;
    kitW: number;
    kitL: number;
    pnlW: number;
    pnlL: number;
    ykitW: number;
    ykitL: number;
    ypnlW: number;
    ypnlL: number;
    kitPcs: number;
    pnlKit: number;
    sthPnl: number;
    sthPcs: number;
    pltThk: number;
    pltAlph: number;
    spPltNi?: number;
    spPltNiAlph?: number;
    spPltAu?: number;
    spPltAuAlph?: number;
    pinCnt: number;
    ulTxt1?: string;
    ulTxt2?: string;
    ulCd1: { id?: string; };
    ulCd2: { id?: string; };
    specLine?: number;
    specSpace?: number;
    specDr?: number;
    specPad?: number;
  }[];
  prdGroup?: {
    prdGrpNm: string;
    data: {
      prcIdx: string;
      order: number;
      prcWkRemark: string;
    }
  }
}