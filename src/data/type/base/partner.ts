// 기초정보 - 거래처, 거래처 담당자

import { Dayjs } from "dayjs";
import { PrtTypeEm } from "../enum";

export type partnerRType = {
  id?: string;
  prtTypeEm?: PrtTypeEm;
  prtNm?: string;
  prtRegCd?: number | null;
  prtSnm?: string;
  prtEngNm?: string;
  prtEngSnm?: string;
  prtRegNo?: string;
  prtCorpRegNo?: string;
  prtBizType?: string;
  prtBizCate?: string;
  prtAddr?: string;
  prtAddrDtl?: string;
  prtZip?: string;
  prtCeo?: string;
  prtTel?: string;
  prtFax?: string;
  prtEmail?: string;
  emp?: { id?: string; };
  managers?: Array<partnerMngRType>;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type partnerCUType = {
  id?: string
  prtTypeEm: PrtTypeEm | null;
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
  emp?: { id?: string; };
  managers?: Array<partnerMngRType>;
}

export const setDataPartnerType = (data:any):partnerCUType => {
  return {
    id: data.id,
    prtTypeEm: (data.prtTypeEm as PrtTypeEm) || null,
    prtNm: data.prtNm || "",
    prtRegCd: data.prtRegCd ?? null,
    prtSnm: data.prtSnm || "",
    prtEngNm: data.prtEngNm || "",
    prtEngSnm: data.prtEngSnm || "",
    prtRegNo: data.prtRegNo || "",
    prtCorpRegNo: data.prtCorpRegNo || "",
    prtBizType: data.prtBizType || "",
    prtBizCate: data.prtBizCate || "",
    prtAddr: data.prtAddr || "",
    prtAddrDtl: data.prtAddrDtl || "",
    prtZip: data.prtZip || "",
    prtCeo: data.prtCeo || "",
    prtTel: data.prtTel || "",
    prtFax: data.prtFax || "",
    prtEmail: data.prtEmail || "",
    emp: data.emp ? { id: data.emp.id } : undefined, // emp가 null이면 undefined
    managers: data.managers || [],
  };
}
export const newDataPartnerType = ():partnerCUType => {
  return {
    prtTypeEm: null,
    prtNm: '',
    prtRegCd: null,
    prtSnm: '',
    prtEngNm: '',
    prtEngSnm: '',
    prtRegNo: '',
    prtCorpRegNo: '',
    prtBizType: '',
    prtBizCate: '',
    prtAddr: '',
    prtAddrDtl: '',
    prtZip: '',
    prtCeo: '',
    prtTel: '',
    prtFax: '',
    prtEmail: '',
    emp: {},
    managers: [],
  }
}

export type partnerMngRType = {
  id: string;
  partner?: partnerRType;
  prtMngNm: string;
  prtMngDeptNm: string;
  prtMngTeamNm: string;
  prtMngTel: string;
  prtMngMobile: string;
  prtMngFax: string;
  prtMngEmail: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type partnerMngCUType = {
  partner: { id: string; };
  prtMngNm: string;
  prtMngDeptNm?: string;
  prtMngTeamNm?: string;
  prtMngTel?: string;
  prtMngMobile?: string;
  prtMngFax?: string;
  prtMngEmail?: string;
}

export const newDataPartnerMngType = ():partnerMngCUType => {
  return {
    partner: { id: '' },
    prtMngNm: '',
    prtMngDeptNm: '',
    prtMngTeamNm: '',
    prtMngTel: '',
    prtMngMobile: '',
    prtMngFax: '',
    prtMngEmail: '',
  }
}