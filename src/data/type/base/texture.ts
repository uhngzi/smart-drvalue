// 구매/매입 - 제품 단가 - 재질

import { Dayjs } from "dayjs";
import { commonCodeRType } from "./common"; // 공통코드

export type unitTextureType = {
  id?: string;
  texture?: commonCodeRType | null;
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

export type unitTextureCUType = {
  id?: string;
  texture?: commonCodeRType | null;
  remark?: string,
  weight?: number,
  addCost?: number,
  appDt?: Date | Dayjs | null;
  ordNo?: number,
  useYn?: boolean,
}

export const setUnitTextureCUType = (data: any):unitTextureCUType => {
  return {
    id: data.id,
    texture: data.texture?.id,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
  }
}

export const newUnitTextureCUType = ():unitTextureCUType => {
  return {
    texture: { id: '' },
    remark: "",
    ordNo: 0,
    useYn: true,
    weight: 0,
    addCost: 0,
    appDt: null,
  }
}