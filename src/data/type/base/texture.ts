// 구매/매입 - 제품 단가 - 재질

import { Dayjs } from "dayjs";
import { commonCodeRType } from "./common"; // 공통코드

export type unitTextureType = {
  id?: string;
  texture?: commonCodeRType;
  remark?: string,
  weight?: number,
  addCost?: number,
  appDt?: Date | Dayjs | null;
  ordNo?: number,
  useYn?: boolean,
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
}

export const setUnitTextureType = (data: any):unitTextureType => {
  return {
    id: data.id,
    texture: data.texture,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createAt,
    updatedAt: data.updatedAt,
  }
}

export const newUnitTextureType = ():unitTextureType => {
  return {
    //texture: { id: '', cdNm: '', cdDesc: '', useYn: true } as commonCodeRType,
    // texture: { id: '' } as commonCodeRType,
    texture: { id: '' },
    remark: "",
    weight: 0,
    addCost: 0,
    appDt: null,
    ordNo: 0,
    useYn: true,
    createdAt: null,
    updatedAt: null,
  }
}

/* 참고용: (나중에 지우기)
export type laminationCUType = {
  id?: string;
  lamDtlTypeEm: LamDtlTypeEm | null;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
}
  export const setLaminationCUType = (data: any):laminationCUType => {
  return {
    id: data.id,
    lamDtlTypeEm: data.lamDtlTypeEm,
    matCd: data.matCd,
    matThk: data.matThk,
    copOut: data.copOut,
    copIn: data.copIn,
    lamDtlThk: data.lamDtlThk,
    lamDtlRealThk: data.lamDtlRealThk,
    useYn: data.useYn,
  }
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
}*/