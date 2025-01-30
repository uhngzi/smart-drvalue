export type commonCodeGroupRType = {
  id: string;
  cdGrpNm: string;
  cdGrpDesc: string;
  dept: {
    id: string;
    deptNm: string;
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  useYn: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type commonCodeGroupCUType = {
  cdGrpNm: string;
  cdGrpDesc: string;
  dept: { id: string; };
  useYn: boolean;
}

export type commonCodeRType = {
  id: string;
  codeGroup: {
    id: string;
    cdGrpNm: string;
    cdGrpDesc: string;
    dept: {
      id: string;
      deptNm: string;
      useYn: boolean;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
    },
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  cdNm: string;
  cdDesc: string;
  useYn: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type commonCodeCUType = {
  codeGroup: { id: string; };
  cdNm: string;
  cdDesc: string;
  useYn: boolean;
}