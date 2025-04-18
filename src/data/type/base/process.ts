// 기초정보 - 공정그룹, 공정, 공정 외주처, 공정 외주처 가격

import { Dayjs } from "dayjs";
import { LayerEm, ModelTypeEm, PrtTypeEm } from "../enum";
import { partnerRType } from "./partner";

export type processRType = {
  id: string;
  isInternal?: boolean;
  processGroup?: {
    id: string;
    prcGrpNm: string;
    useYn: boolean;
    processes?: Array<any>;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
  processVendors?:{
    id: string;
    useYn: 0 | 1;
    vendor: partnerRType;
  }[];
  prcNm?: string;
  useYn?: boolean;
  ordNo?: number;
  wipPrcNm?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  remark?: string;
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
  ordNo: number;
  processes: Array<processRType>;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
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
  process: processRType;
  vendor: partnerRType;
  processGroup: processGroupRType,
  useYn: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type processVendorCUType = {
  process: { id: string|null; };
  processGroup: { id: string; };
  vendor: { id: string; };
  useYn: boolean;
  ordNo?: number|string;
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
  process: processRType;
  processGroup: processGroupRType;
  vendor: partnerRType;
  priceNm: string;
  priceUnit: number;
  modelTypeEm: ModelTypeEm | null;
  layerEm: LayerEm | null;
  thk?: number;
  matCd?: string;
  metCd?: string;
  wgtMin?: number;
  wgtMax?: number;
  cntMin?: number;
  cntMax?: number;
  pnlcntMin?: number;
  pnlcntMax?: number;
  holecntMin?: number;
  holecntMax?: number;
  m2Min?: number;
  m2Max?: number;
  useYn: boolean;
  appDt: Date;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type processVendorPriceCUType = {
  process: { id: string; };
  processGroup: { id: string; };
  vendor: { id: string; };
  priceNm: string;
  priceUnit: number;
  modelTypeEm: ModelTypeEm | null;
  layerEm: LayerEm | null;
  thk?: number;
  pnlcntMin?: number;
  pnlcntMax?: number;
  holecntMin?: number;
  holecntMax?: number;
  m2Min?: number;
  m2Max?: number;
  matCd?: string;
  metCd?: string;
  wgtMin?: number;
  wgtMax?: number;
  cntMin?: number;
  cntMax?: number;
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
    modelTypeEm: null,
    layerEm: null,
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
  processVendorPrice?: processVendorRType;
  priceBeUnit: number;
  priceUnit: number;
  useYn: boolean;
  appDt: Date;
  appBeDt: Date;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}