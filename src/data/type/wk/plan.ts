import { Dayjs } from "dayjs";
import {
  AnyStatus,
  HotGrade,
  LayerEm,
  ModelStatus,
  ModelTypeEm,
  SalesOrderStatus,
  SpecStatus,
} from "../enum";
import { processRType } from "../base/process";
import { partnerRType } from "../base/partner";
import { boardType } from "../base/board";
import { commonCodeRType } from "../base/common";

export type wkPlanWaitType = {
  id?: string;
  progress?: number;
  m2?: number;
  wkLatestMemo?: string; // 공정 마지막 비고
  wkPrdCnt?: 0; // 수주량
  wkProcCnt?: 0; // 외주처 공정 수
  wkLatestDtm?: Date | Dayjs | null; // 현경과
  wsExpDt?: Date | Dayjs | null; // 생산예정일
  wsSchDt?: Date | Dayjs | null; // 시작계획일(계획확정일)
  wsStDt?: Date | Dayjs | null; // 생산시작일
  wkEdDt?: Date | Dayjs | null; // 생산종료일
  wkOutDt?: Date | Dayjs | null; // 생산 출고일
  wkOutCnt?: number; // 출고량
  wkBadCnt?: number; // 불량
  priceUnitChkYn?: boolean; // 단가등록여부
  invChkDt?: Date | Dayjs | null; // ??
  invChkCnt?: number; // 재고량?
  isWait?: boolean; // 생산대기여부
  wsRemark?: string; // 생산특이사항
  wkLatestProc?: {
    // 마지막 공정
    id?: string;
    wkProcMemo?: string;
    specPrdGrp?: {
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
      id?: string;
      productLinesGroup?: {
        id?: string;
        name?: string;
        createdAt?: Date | Dayjs | null;
        updatedAt?: Date | Dayjs | null;
        deletedAt?: Date | Dayjs | null;
      };
      prdGrpNm?: string;
      process?: {
        id?: string;
        processGroup?: {
          id?: string;
          prcGrpNm?: string;
          useYn?: boolean;
          processes?: processRType[];
          createdAt?: Date | Dayjs | null;
          updatedAt?: Date | Dayjs | null;
          deletedAt?: Date | Dayjs | null;
        };
        prcNm?: string;
        useYn?: boolean;
        createdAt?: Date | Dayjs | null;
        updatedAt?: Date | Dayjs | null;
        deletedAt?: Date | Dayjs | null;
      };
      ordNo?: number;
      prcWkRemark?: string;
    };
    tempPrdInfo?: string;
    vendor?: partnerRType;
    vendorPrice?: number;
    ordNo?: number;
    wkProcStCnt?: number;
    wkProcStDtm?: Date | Dayjs | null;
    wkProcEdCnt?: number;
    wkProcEdDtm?: Date | Dayjs | null;
    wkProcBadCnt?: number;
    wkProcRemark?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  };
  specModel?: {
    id?: string;
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
      relation?: string[];
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    };
    modelMatch?: {
      id?: string;
      modelStatus?: ModelStatus;
    };
    spec?: {
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
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
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
    prdCnt?: number;
    vcutText?: string;
    impedanceLineCnt?: number;
    couponYn?: boolean;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  };
  orderProduct?: {
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
      relation?: string[];
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    };
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
      };
    };
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
  };
  isPlanDtFixed?: boolean;
  isWorkPlanFixed?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
};

export type wkDetailType = {
  id?: string;
  wkLatestMemo?: string;
  wkPrdCnt?: number;
  progress?: number;
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
  isWait?: boolean;
  wsRemark?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  vendorPriceTotal?: number;
  procs?: wkProcsType[];
  requestMaterialsTotalPrice?: number;
};

export type wkProcsType = {
  id?: string;
  wkProcMemo?: string;
  specPrdGrp?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    id?: string;
    productLinesGroup?: {
      id?: string;
      name?: string;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    };
    spec?: {
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
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    };
    prdGrpNm?: string;
    process?: {
      id?: string;
      processGroup?: {
        id?: string;
        prcGrpNm?: string;
        useYn?: boolean;
        processes?: processRType[];
        createdAt?: Date | Dayjs | null;
        updatedAt?: Date | Dayjs | null;
        deletedAt?: Date | Dayjs | null;
      };
      prcNm?: string;
      useYn?: boolean;
      wipPrcNm?: string;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    };
    ordNo?: number;
    prcWkRemark?: string;
  };
  tempPrdInfo?: string;
  vendor?: partnerRType;
  vendorPrice?: number;
  ordNo?: number;
  wkProcStCnt?: number;
  wkProcStDtm?: Date | Dayjs | null;
  wkProcEdCnt?: number;
  wkProcEdDtm?: Date | Dayjs | null;
  wkProcBadCnt?: number;
  wkProcRemark?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  prdCnt?: number;
  prevWkProcEdCnt?: number;
};
