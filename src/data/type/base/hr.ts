export type deptRType = {
  id: string;
  deptNm: string;
  useYn: boolean;
  teams: Array<{
    id: string;
    teamNm: string;
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type deptCUType = {
  deptNm: string;
  useYn: boolean;
}

export type teamRType = {
  id: string;
  dept: {
    id: string;
    deptNm: string;
    useYn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  teamNm: string;
  useYn: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type teamCUType = {
  dept: { id: string; };
  teamNm: string;
  useYn: boolean;
}