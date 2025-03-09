import { Dayjs } from "dayjs";
import { commonCodeRType } from "../base/common";
import { specLaminationType } from "./lamination";
import { AnyStatus, LayerEm, ModelTypeEm, SalesOrderStatus, SpecStatus } from "../enum";
import { partnerRType } from "../base/partner";
import { processRType } from "../base/process";
import { modelsMatchDetail } from "./models";

export type specType = {
  id?: string;
  specNo?: string;
  specLamination?: specLaminationType;
  specLamNo?: string;
  specLamThk?: number;
  board?: commonCodeRType;
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
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  specModels?: specModelType[];
  specPrdGroupPrcs?: specPrdGroupPrcs[];
  index?: number;   // 샘플로 넣은 값
  wkPrdCnt?: number;
}

export type specModelType = {
  id?: string;
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
  };
  partner?: partnerRType;
  modelMatch?: modelsMatchDetail;
  usedYn?: boolean;
  inactiveYn?: boolean;
  prdNm?: string;
  prdRevNo?: string;
  prdMngNo?: string;
  layerEm?: LayerEm;
  modelTypeEm?: ModelTypeEm;
  thk?: number;
  board?: commonCodeRType;
  ordPrdNo?: string;
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
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  matchId?: string;
}

export type specPrdGroupPrcs = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id?: string;
  spec?: specType;
  prdGrpNm?: string;
  process?: processRType;
  ordNo?: number;
  prcWkRemark?: string;
  productLinesGroup?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    name?: string;
  },
  vendor?: partnerRType;
}

export type yieldInputType = {
  extraMargin?: number;
  minPanelLength?: number | string;
  disks?: {
    diskWidth: number;
    diskHeight: number;
  }[];
  diskWidth?: number;
  diskHeight?: number;
  minYield?: number | string;
  kitWidth?: number | string;
  kitHeight?: number | string;
  kitGapX?: number | string;
  kitGapY?: number | string;
  kitArrangeX?: number | string;
  kitArrangeY?: number | string;
  marginLongSide?: number | string;
  marginShortSide?: number | string;
}

export const yieldInputReq = () => {
  return [
    { field : 'minPanelLength', label: '판넬 최저 길이' },
    // { field : 'diskWidth', label: '원판 너비' },
    // { field : 'diskHeight', label: '원판 높이' },
    { field : 'minYield', label: '최저 수율' },
    { field : 'kitWidth', label: 'Kit 너비' },
    { field : 'kitHeight', label: 'Kit 높이' },
    { field : 'kitGapX', label: 'Kit 간격 X' },
    { field : 'kitGapY', label: 'Kit 간격 Y' },
    // { field : 'kitArrangeX', label: 'Kit 배치 X' },
    // { field : 'kitArrangeY', label: 'Kit 배치 Y' },
    { field : 'marginLongSide', label: '긴쪽 여분' },
    { field : 'marginShortSide', label: '짧은쪽 여분' },
  ]
}

export type yieldCalType = {
  disk?: {
    diskWidth?: number;
    diskHeight?: number;
  },
  panel?: {
    width?: number;
    height?: number;
    arrangeX?: number;
    arrangeY?: number;
  },
  layout?: {
    placed?: {
      x?: number;
      y?: number;
      w?: number;
      h?: number;
      rotated?: boolean;
    }[];
    yieldRatio?: number;
  },
  panelCount?: number;
  kitCount?: number;
  requestId?: string;
  images?: {
    layout?: string;
    panel?: string;
  }
}

export type arrayCalType = {
  imageName: "sihun.vLg4DUH.20250227183155-ofmgtvccst.panel_kit1:1x2_kit2:1x2.png",
  stdInfo: {
    x: number;
    y: number;
  },
  configs: {
    kitId: string;
    rows: number;
    cols: number;
  }[];
  finalWidth: number;
  finalHeight: number;
  requiredPanels: number;
  boardsUsed: number;
  panelsPerBoard: number;
  yieldBoard: number;
  board: {
    boardId: string;
    width: number;
    height: number;
  },
  boardImageStorageName: string;
  panelImageStorageName: string;
  kitsInfo: {
    kitId: string;
    rows: number;
    cols: number;
    totalCount: number;
    kitArrayXSize: number;
    kitArrayYSize: number;
  }[];
}
