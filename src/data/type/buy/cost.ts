import { Dayjs } from "dayjs";
import { processRType } from "../base/process";
import { partnerMngRType, partnerRType } from "../base/partner";
import { AnyStatus, HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus, SpecStatus } from "../enum";
import { boardType } from "../base/board";
import { commonCodeRType } from "../base/common";
import { materialPriceType, materialType } from "../base/material_back";

export type buyCostOutType = {
  id?: string;
  progress?: number;
  wkLatestMemo?: string;
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
  isWait?: boolean;
  wsRemark?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  wkLatestProc?: {
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
      },
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
        },
        prcNm?: string;
        useYn?: boolean;
        createdAt?: Date | Dayjs | null;
        updatedAt?: Date | Dayjs | null;
        deletedAt?: Date | Dayjs | null;
      },
      ordNo?: number;
      prcWkRemark?: string;
    },
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
    },
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
    smColor?: commonCodeRType
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
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
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
  },
}

export type buyCostOutDetailType = {
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
  procs?: [
    {
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
        },
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
        },
        prdGrpNm?: string;
        process?: {
          id?: string;
          processGroup?: {
            id?: string;
            prcGrpNm?: string;
            useYn?: boolean;
            processes?: processRType[],
            createdAt?: Date | Dayjs | null;
            updatedAt?: Date | Dayjs | null;
            deletedAt?: Date | Dayjs | null;
          },
          prcNm?: string;
          useYn?: boolean;
          createdAt?: Date | Dayjs | null;
          updatedAt?: Date | Dayjs | null;
          deletedAt?: Date | Dayjs | null;
        },
        ordNo?: number;
        prcWkRemark?: string;
      },
      vendorPriceIdxNoForgKey?: string | null;
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
    }
  ],
}

export type buyOrderType = {
  id?: string;
  orderNo?: string;
  orderName?: string;
  productName?: string;
  vendorName?: string;
  totalAmount?: number;
  status?: string;
  orderConfirmDate?: Date | Dayjs | null;
  orderExpectedDate?: Date | Dayjs | null;
  orderDate?: Date | Dayjs | null;
  deliveryDate?: Date | Dayjs | null;
  arrivalDate?: Date | Dayjs | null;
  inventoryCheckDate?: Date | Dayjs | null;
  paymentCondition?: string;
  responsible?: string;
  salesResponsible?: string;
  note?: string;
  isCanceled?: boolean;

  // 디테일
  type?: string;
  detailInfo?: {
    orderName?: string;
    id?: string;
    prtInfo?: {
      id?: string;
      prt?: partnerRType;
      mng?: partnerMngRType;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    },
    emp?: {
      id?: string;
      name?: string;
      userId?: string;
      passwordEncrypted?: string;
      passwordSalt?: string;
      status?: string;
      lastLoginAt?: Date | Dayjs | null;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    },
    docNo?: string;
    orderDueDt?: Date | Dayjs | null;
    orderDt?: Date | Dayjs | null;
    remarks?: string
    deliveryDueDt?: Date | Dayjs | null;
    arrivalDt?: Date | Dayjs | null;
    paymentCondition?: string;
    totalAmount?: number;
    orderConfirmDt?: Date | Dayjs | null;
    approvalDt?: Date | Dayjs | null;
    worksheetIdxNoForgKeyType?: "WORKSHEET" | "WORKSHEET_PROCESS" | "NO_FOREIGN_KEY";
    worksheetIdxNoForgKey?: string;
    worksheetProcessIdxNoForgKey?: string;
    inventoryCheckDt?: Date | Dayjs | null;
    isCancel?: boolean;
    details?: {
      id?: string;
      material?: materialType;
      order?: number;
      mtOrderQty?: number;
      mtOrderSizeW?: number;
      mtOrderSizeH?: number;
      mtOrderWeight?: number;
      mtOrderThk?: number;
      mtOrderPrice?: number;
      mtOrderInputPrice?: number;
      mtOrderAmount?: number;
      mtOrderUnit?: string;
      mtOrderTxtur?: string;
      mtOrderArrivalQty?: number;
      mtOrderArrivalDate?: Date | Dayjs | null;
      mtOrderInputDate?: Date | Dayjs | null;
      mtOrderInputQty?: number;
      mtOrderInvenQty?: number;
      mtOrderBadQty?: number;
      requestMaterialQuality?: {
        badNm?: string;
        badCnt?: number;
        materialBadIdx?: string;
      }[];
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
      mtNm?: string;
      materialGrpIdx?: string;
      materialPrice?: materialPriceType;
      mtPriceIdx?: string;
    }[];
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  }

  // 등록 또는 수정
  orderRoot?: {
    orderId?: string;
    prtIdx?: string;
    prtMngIdx?: string;
    empIdx?: string;
    orderName?: string;
    orderDueDt?: Date | Dayjs | null;
    orderDt?: Date | Dayjs | null;
    remarks?: string;
    deliveryDueDt?: Date | Dayjs | null;
    arrivalDt?: Date | Dayjs | null;
    paymentCondition?: string;
    totalAmount?: number;
    orderConfirmDt?: Date | Dayjs | null;
    approvalDt?: Date | Dayjs | null;
    worksheetIdxNoForgKeyType?: "WORKSHEET" | "WORKSHEET_PROCESS" | "NO_FOREIGN_KEY";
    worksheetIdxNoForgKey?: string;
    worksheetProcessIdxNoForgKey?: string;
  };

  orderDetail?: buyOrderDetailType[];
}

export type buyOrderDetailType = {
  id?: string;
  materialIdx?: string;
  order?: number;
  mtOrderQty?: number;
  mtOrderSizeW?: number;
  mtOrderSizeH?: number;
  mtOrderWeight?: number;
  mtOrderThk?: number;
  mtOrderPrice?: number;
  mtOrderInputPrice?: number;
  mtOrderAmount?: number;
  mtOrderUnit?: string;
  mtOrderTxtur?: string;
  mtOrderArrivalQty?: number;
  mtOrderArrivalDate?: Date | Dayjs | null;
  mtOrderInputDate?: Date | Dayjs | null;
  mtOrderInputQty?: number;
  mtOrderInvenQty?: number;
  mtOrderBadQty?: number;
  requestMaterialQuality?: {
    badNm?: string;
    badCnt?: number;
    materialBadIdx?: string;
  }[]
  mtNm?: string;
  materialGrpIdx?: string;
  mtId?: string;
  mtPriceIdx?: string;
}