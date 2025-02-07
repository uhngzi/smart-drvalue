// 기초정보 - 적층구조

import { LamDtlTypeEm } from "../enum";

export type laminationRType = {
  id: string;
  lamDtlTypeEm: LamDtlTypeEm;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type laminationCUType = {
  lamDtlTypeEm: LamDtlTypeEm | null;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
}

export const newLaminationCUType  = ():laminationCUType => {
  return {
    lamDtlTypeEm: null,
    matCd: '',
    matThk: 0,
    copOut: '',
    copIn: '',
    lamDtlThk: 0,
    lamDtlRealThk: 0,
    useYn: true,
  }
}