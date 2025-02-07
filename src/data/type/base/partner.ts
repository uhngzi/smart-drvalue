// 기초정보 - 거래처, 거래처 담당자

import { PrtTypeEm } from "../enum";

export type partnerRType = {
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
  emp?: { id?: string; };
  managers?: Array<partnerMngRType>;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type partnerCUType = {
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
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
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