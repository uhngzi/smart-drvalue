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
}