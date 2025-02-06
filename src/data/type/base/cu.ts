import { PrtTypeEm } from "../enum";

export type cuRType = {
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
  emp: { id?: string; };
  managers: Array<cuMngRType>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type cuCUType = {
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
  emp: { id?: string; };
}

export const newDataCuType = ():cuCUType => {
  return {
    prtTypeEm: PrtTypeEm.CS,
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

export type cuMngRType = {
  id: string;
  partner: cuRType;
  prtMngNm: string;
  prtMngDeptNm: string;
  prtMngTeamNm: string;
  prtMngTel: string;
  prtMngMobile: string;
  prtMngFax: string;
  prtMngEmail: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type cuMngCUType = {
  partner: { id: string; };
  prtMngNm: string;
  prtMngDeptNm: string;
  prtMngTeamNm: string;
  prtMngTel: string;
  prtMngMobile: string;
  prtMngFax: string;
  prtMngEmail: string;
}