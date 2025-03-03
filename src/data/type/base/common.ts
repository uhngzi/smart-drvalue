// 기초정보 - 공통코드 그룹, 공통코드

import { Dayjs } from "dayjs";

export type commonCodeGroupType = {
  id?: string;
  cdGrpNm: string;
  cdGrpDesc: string;
  useYn: boolean;
  dept?: {
    id: string;
    deptNm?: string;
    useYn?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
  },
  codes?: Array<any>;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export const newDataCommonCodeGroupType = ():commonCodeGroupType => {
  return {
    cdGrpNm: '',
    cdGrpDesc: '',
    dept: { id: '' },
    useYn: true,
  }
}

export const commonCodeGrpReq = () => {
  return [
    { field: 'cdGrpNm', label: '그룹명' },
    { field: 'dept.id', label: '관리부서' },
    { field: 'useYn', label: '사용여부' },
  ]
}

export type commonCodeRType = {
  id: string;
  cdNm: string;
  cdDesc?: string;
  useYn: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  codeGroup?: {
    id: string;
    cdGrpNm: string;
    cdGrpDesc: string;
    useYn: boolean;
    dept?: {
      id: string;
      deptNm: string;
      useYn: boolean;
      createdAt?: Date | Dayjs | null;
      updatedAt?: Date | Dayjs | null;
      deletedAt?: Date | Dayjs | null;
    },
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  },
}

export type commonCodeCUType = {
  id?: string;
  codeGroup: { id: string; };
  cdNm: string;
  cdDesc?: string;
  useYn: boolean;
}

export const newDataCommonCode = ():commonCodeCUType => {
  return {
    codeGroup: {
      id: '',
    },
    cdNm: '',
    cdDesc: '',
    useYn: true,
  }
}

export const commonCodeReq = () => {
  return [
    { field: 'codeGroup.id', label: '그룹' },
    { field: 'cdNm', label: '코드명' },
    { field: 'useYn', label: '사용여부' },
  ]
}