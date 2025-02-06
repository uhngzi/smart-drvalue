import { LayerEm, ModelTypeEm, PrtTypeEm } from "../enum";

export type processRType = {
  id: string;
  processGroup: {
    id: string;
    prcGrpNm: string;
    useYn: boolean;
    processes?: Array<any>;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
  },
  prcNm: string;
  useYn: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type processCUType = {
  processGroup: { id: string; },
  prcNm: string;
  useYn: boolean;
}

export const newDataProcessCUType = ():processCUType => {
  return {
    processGroup: { id: '' },
    prcNm: '',
    useYn: true,
  }
}

export type processGroupRType = {
  id: string;
  prcGrpNm: string;
  useYn: boolean;
  processes: Array<processRType>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type processGroupCUType = {
  prcGrpNm: string;
  useYn: boolean;
}

export const newDataProcessGroupCUType = ():processGroupCUType => {
  return {
    prcGrpNm: '',
    useYn: true,
  }
}

export type processVendorRType = {
  id: string;
  process: {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    id: string;
    prcNm: string;
    useYn: boolean;
  },
  vendor: {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    id: string;
    prtTypeEm: PrtTypeEm;
    prtNm: string;
    prtRegCd: number | null;
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
  },
  processGroup: processGroupRType,
  useYn: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type processVendorCUType = {
  process: { id: string; };
  processGroup: { id: string; };
  vendor: { id: string; };
  useYn: boolean;
}

export const newDataProcessVendorCUType = ():processVendorCUType => {
  return {
    process: { id: '' },
    processGroup: { id: '' },
    vendor: { id: '' },
    useYn: true,
  }
}

export type processVendorPriceRType = {
  id: string;
  process: {
    id: string;
    prcNm: string;
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  processGroup: processGroupRType;
  vendor: processVendorRType;
  priceNm: string;
  priceUnit: number;
  modelTypeEm: ModelTypeEm | '';
  layerEm: LayerEm | '';
  thk: number;
  matCd: string;
  metCd: string;
  wgtMin: number;
  wgtMax: number;
  cntMin: number;
  cntMax: number;
  pnlcntMin: number;
  pnlcntMax: number;
  holecntMin: number;
  holecntMax: number;
  m2Min: number;
  m2Max: number;
  useYn: boolean;
  appDt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type processVendorPriceCUType = {
  process: { id: string; };
  processGroup: { id: string; };
  vendor: { id: string; };
  priceNm: string;
  priceUnit: number;
  modelTypeEm: ModelTypeEm | '';
  layerEm: LayerEm | '';
  thk: number;
  pnlcntMin: number;
  pnlcntMax: number;
  holecntMin: number;
  holecntMax: number;
  m2Min: number;
  m2Max: number;
  matCd: string;
  metCd: string;
  wgtMin: number;
  wgtMax: number;
  cntMin: number;
  cntMax: number;
  appDt: Date;
  useYn: boolean;
}

export const newDataProcessVendorPriceCUType = ():processVendorPriceCUType => {
  return {
    process: { id: '' },
    processGroup: { id: '' },
    vendor: { id: '' },
    priceNm: '',
    priceUnit: 0,
    modelTypeEm: '',
    layerEm: '',
    thk: 0,
    pnlcntMin: 0,
    pnlcntMax: 0,
    holecntMin: 0,
    holecntMax: 0,
    m2Min: 0,
    m2Max: 0,
    matCd: '',
    metCd: '',
    wgtMin: 0,
    wgtMax: 0,
    cntMin: 0,
    cntMax: 0,
    appDt: new Date(),
    useYn: true,
  }
}

export type processVendorPriceHistoryRType = {
  id: string;
  processVendorPrice: {
    id: string;
    priceNm: string;
    priceUnit: number;
    modelTypeEm: ModelTypeEm | '';
    layerEm: LayerEm | '';
    thk: number;
    matCd: string;
    metCd: string;
    wgtMin: number;
    wgtMax: number;
    cntMin: number;
    cntMax: number;
    pnlcntMin: number;
    pnlcntMax: number;
    holecntMin: number;
    holecntMax: number;
    m2Min: number;
    m2Max: number;
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    appDt: Date;
  },
  priceBeUnit: number;
  priceUnit: number;
  useYn: boolean;
  appDt: Date;
  appBeDt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}