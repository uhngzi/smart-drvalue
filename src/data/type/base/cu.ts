export type cuRType = {
  id: string;
  prtTypeEm: 'cs' | 'vndr' | 'sup' | 'both';
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
  managers: Array<any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type cuCUType = {
  prtTypeEm: 'cs' | 'vndr' | 'sup' | 'both' | '';
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
    prtTypeEm: '',
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