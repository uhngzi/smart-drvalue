// 메인 - 모델, 모델 매칭

import { boardRType } from "../base/board";
import { commonCodeRType } from "../base/common";
import { partnerMngRType, partnerRType } from "../base/partner";
import { HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus } from "../enum";

export type modelsRType = {
  id: string;
  partner: partnerRType;
  usedYn: boolean;
  inactiveYn: boolean;
  prdNm: string;
  prdRevNo: string;
  prdMngNo: string;
  layerEm: LayerEm;
  modelTypeEm: ModelTypeEm;
  thk: number;
  board: boardRType;
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
  vcutType: commonCodeRType;
  fpNo: string;
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
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

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

export type modelsMatchRType = 
{
  id: string;
  model: { id: string; };
  glbStatus?: {
    id: string;
    salesOrderStatus: SalesOrderStatus;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
  orderModel?: {
    id: string;
    currPrdInfo: {},
    prtInfo: {
      id: string;
      prt: partnerRType;
      mng: partnerMngRType;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
    },
    order: {
      id: string;
      isDiscard: boolean;
      orderNm: string;
      orderDt: Date | null;
      orderRepDt: Date | null;
      orderTxt: string;
      hotGrade: HotGrade;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
    },
    model: { id: string; };
    modelStatus: ModelStatus;
    orderNo: string;
    orderTit: string;
    prtOrderNo: string;
    orderPrdRemark: string;
    orderPrdCnt: number;
    orderPrdUnitPrice: number;
    orderPrdPrice: number;
    orderPrdDueReqDt: Date | null;
    orderPrdDueDt: Date | null;
    orderPrdHotGrade: HotGrade;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}