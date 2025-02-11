// 메인 - 모델, 모델 매칭

import { Dayjs } from "dayjs";
import { boardType } from "../base/board";
import { commonCodeRType } from "../base/common";
import { partnerMngRType, partnerRType } from "../base/partner";
import { AnyStatus, HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus, SpecStatus } from "../enum";

export type orderModelType = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id?: string;
  currPrdInfo?: string;
  tempPrdInfo?: string;
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
}

// 모델 읽기 타입
export type modelsType = {
  id?: string;
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
  fpNo?: string;
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
  model?: { id: string; };
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
    currPrdInfo: {},
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
    model: {
      id: string;
      prdMngNo: string;
    },
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
  // id: string;
  // model: { id: string; };
  // glbStatus?: {
  //   id: string;
  //   salesOrderStatus: SalesOrderStatus;
  //   createdAt: Date | null;
  //   updatedAt: Date | null;
  //   deletedAt: Date | null;
  // },
  // orderModel?: {
  //   id: string;
  //   currPrdInfo: {},
  //   prtInfo: {
  //     id: string;
  //     prt: partnerRType;
  //     mng: partnerMngRType;
  //     createdAt: Date | null;
  //     updatedAt: Date | null;
  //     deletedAt: Date | null;
  //   },
  //   order: {
  //     id: string;
  //     isDiscard: boolean;
  //     orderNm: string;
  //     orderDt: Date | null;
  //     orderRepDt: Date | null;
  //     orderTxt: string;
  //     hotGrade: HotGrade;
  //     createdAt: Date | null;
  //     updatedAt: Date | null;
  //     deletedAt: Date | null;
  //   },
  //   model: { id: string; };
  //   modelStatus: ModelStatus;
  //   orderNo: string;
  //   orderTit: string;
  //   prtOrderNo: string;
  //   orderPrdRemark: string;
  //   orderPrdCnt: number;
  //   orderPrdUnitPrice: number;
  //   orderPrdPrice: number;
  //   orderPrdDueReqDt: Date | null;
  //   orderPrdDueDt: Date | null;
  //   orderPrdHotGrade: HotGrade;
  //   createdAt: Date | null;
  //   updatedAt: Date | null;
  //   deletedAt: Date | null;
  // },
  // createdAt: Date | null;
  // updatedAt: Date | null;
  // deletedAt: Date | null;
}