// 메인 - 고객발주

import { partnerMngRType } from "../base/partner";
import { HotGrade, ModelStatus, PrtTypeEm, SalesOrderStatus } from "../enum";

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
  products: Array<{
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
    orderDt: Date;
    orderNo: string;
    orderTit: string;
    prtOrderNo: string;
    orderPrdRemark: string;
    orderPrdCnt: number;
    orderPrdUnitPrice: number;
    orderPrdPrice: number;
    orderPrdDueReqDt: Date;
    orderPrdDueDt: Date;
    orderPrdHotGrade: HotGrade;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  }>,
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

export type salesOrderCUType = {
  partnerId: string;
  partnerManagerId?: string;
  orderName: string;
  orderDt: Date | null;
  orderRepDt?: Date | null;
  orderTxt: string;
  empId: string;
  hotGrade: HotGrade | null;
  files?: string[];
  products?: salesOrderProcuctCUType[];
}

export const newDataSalesOrderCUType = ():salesOrderCUType => {
  return {
    partnerId: '',
    partnerManagerId: '',
    orderName: '',
    orderDt: null,
    orderRepDt: null,
    orderTxt: '',
    empId: '',
    hotGrade: null,
    files: [],
    products: [],
  }
}

export type salesOrderProcuctCUType = {
  customPartnerManagerId?: string;
  currPrdInfo?: {
    id: string;
    name: string;
  },
  modelId?: string;
  modelStatus: ModelStatus | null;
  orderDt: Date | null;
  orderNo: string;
  orderTit: string;
  prtOrderNo?: string;
  orderPrdRemark?: string;
  orderPrdCnt: number;
  orderPrdUnitPrice: number;
  orderPrdPrice: number;
  orderPrdDueReqDt?: Date | null;
  orderPrdDueDt?: Date | null;
  orderPrdHotGrade: HotGrade | null;
}

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