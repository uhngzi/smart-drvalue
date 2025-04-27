// 구매/매입 - 제품 단가 - 특별사양

import { Dayjs } from "dayjs";
import { commonCodeRType } from "./common"; // 공통코드
import { processRType } from "./process"; // 공정

export type unitSpecialType = {
  id?: string;
  process?: processRType | null;
  remark?: string,
  weight?: number,
  addCost?: number,
  minRange?: number,
  maxRange?: number,
  unit?: commonCodeRType | null;
  appDt?: Date | Dayjs | null;
  ordNo?: number,
  useYn?: boolean,
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
}

export const setUnitSpecialType = (data: any):unitSpecialType => {
  return {
    id: data.id,
    process: data.process,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    minRange: data.minRange,
    maxRange: data.maxRange,
    unit: data.unit,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createAt,
    updatedAt: data.updatedAt,
  }
}

export type unitSpecialCUType = {
  id?: string;
  process?: processRType | null;
  remark?: string,
  weight?: number,
  addCost?: number,
  minRange?: number,
  maxRange?: number,
  unit?: commonCodeRType | null;
  appDt?: Date | Dayjs | null;
  ordNo?: number,
  useYn?: boolean,
}

export const setUnitSpecialCUType = (data: any):unitSpecialCUType => {
  return {
    id: data.id,
    process: data.process?.id,
    remark: data.remark,
    weight: data.weight * 100,  // 수정 modal 가중치 input 값을 백분율 형태로 보여줌
    addCost: data.addCost,
    minRange: data.minRange,
    maxRange: data.maxRange,
    unit: data.unit?.id,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
  }
}

export const newUnitSpecialCUType = ():unitSpecialCUType => {
  return {
    process: { id: '' },
    remark: "",
    weight: 0,
    addCost: 0,
    minRange: 0,
    maxRange: 0,
    unit: { id: '' },
    appDt: null,
    ordNo: 0,
    useYn: true,
  }
}