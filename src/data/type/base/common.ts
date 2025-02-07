// 기초정보 - 공통코드 그룹, 공통코드

export type commonCodeGroupRType = {
  id: string;
  cdGrpNm: string;
  cdGrpDesc: string;
  useYn: boolean;
  dept?: {
    id: string;
    deptNm: string;
    useYn: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type commonCodeGroupCUType = {
  cdGrpNm: string;
  cdGrpDesc?: string;
  dept: { id: string; };
  useYn: boolean;
}

export const newDataCommonCodeGroupType = ():commonCodeGroupCUType => {
  return {
    cdGrpNm: '',
    cdGrpDesc: '',
    dept: { id: '' },
    useYn: true,
  }
}

export type commonCodeRType = {
  id: string;
  cdNm: string;
  cdDesc?: string;
  useYn: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  codeGroup?: {
    id: string;
    cdGrpNm: string;
    cdGrpDesc: string;
    useYn: boolean;
    dept?: {
      id: string;
      deptNm: string;
      useYn: boolean;
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
    },
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  },
}

export type commonCodeCUType = {
  productLinesGroup: {
    id: string;
  },
  process: {
    id: string;
  },
  prcWkRemark?: string;
}

export const newDataCommonCode = ():commonCodeCUType => {
  return {
    productLinesGroup: {
      id: '',
    },
    process: {
      id: '',
    },
    prcWkRemark: '',
  }
}