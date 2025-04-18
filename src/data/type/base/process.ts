// 기초정보 - 공정그룹, 공정, 공정 외주처, 공정 외주처 가격

import dayjs, { Dayjs } from "dayjs";
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
  id?: string;
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
  appDt: Date | Dayjs | null;
  useYn: boolean;
  processIdx?: string;
  processGroupIdx?: string;
  vendorIdx?: string;
  appOriginDt?: Date | Dayjs | null;
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
    appDt: dayjs(),
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


export const processVendorPriceReq = () => {
  return [
    { field: 'processGroupIdx', label: '공정그룹' },
    { field: 'processIdx', label: '공정' },
    { field: 'vendorIdx', label: '공급처' },
    { field: 'priceNm', label: '가격명' },
    { field: 'priceUnit', label: '가격' },
    { field: 'modelTypeEm', label: '제품유형' },
    { field: 'layerEm', label: '층' },
    { field: 'thk', label: '두께' },
    { field: 'pnlcntMin', label: 'PNL최소수량' },
    { field: 'pnlcntMax', label: 'PNL최대수량' },
    { field: 'holecntMin', label: '최소홀수' },
    { field: 'holecntMax', label: '최대홀수' },
    { field: 'm2Min', label: '최저면적' },
    { field: 'm2Max', label: '최대면적' },
    { field: 'wgtMin', label: '최소무게' },
    { field: 'wgtMax', label: '최대무게' },
    { field: 'cntMin', label: '최소수량' },
    { field: 'cntMax', label: '최대수량' },
    { field: 'useYn', label: '사용여부' },
    { field: 'appDt', label: '적용일' },
  ]
}