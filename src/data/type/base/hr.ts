// 기초정보 - 부서, 팀

import { Dayjs } from "dayjs";

export type deptRType = {
  id: string;
  deptNm: string;
  useYn: boolean;
  teams?: teamRType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type deptCUType = {
  deptNm: string;
  useYn: boolean;
}

export const newDataDeptType = ():deptCUType => {
  return {
    deptNm: '',
    useYn: true,
  }
}

export type teamRType = {
  id: string;
  dept?: deptRType;
  teamNm: string;
  useYn: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type teamCUType = {
  dept: { id: string; };
  teamNm: string;
  useYn: boolean;
}

export const newDataTeamType = ():teamCUType => {
  return {
    dept: { id: '' },
    teamNm: '',
    useYn: true,
  }
}