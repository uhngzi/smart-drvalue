// 구매/매입 - 제품 단가 - 추가비용(두께)

import { Dayjs } from "dayjs";
import { LayerEm } from "../enum";

export type unitThicknessType = {
  id?: string;
  layerEm?: LayerEm | null;
  minThickness?: number;
  maxThickness?: number;
  remark?: string;
  weight?: number;
  addCost?: number;
  ordNo?: number;
  useYn?: boolean;
  appDt?: Date | Dayjs | null;
}

export const setUnitThicknessType = (data: any):unitThicknessType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minThickness: data.minThickness,
    maxThickness: data.maxThickness,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,    
    ordNo: data.ordNo,
    useYn: data.useYn,
    appDt: data.appDt,
  }
}

export type unitThicknessCUType = {
  id?: string;
  layerEm?: LayerEm | null;
  minThickness?: number;
  maxThickness?: number;
  remark?: string;
  weight?: number;
  addCost?: number;
  ordNo?: number;
  useYn?: boolean;
  appDt?: Date | Dayjs | null;
}

export const setUnitThicknessCUType = (data: any):unitThicknessCUType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minThickness: data.minThickness,
    maxThickness: data.maxThickness,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    ordNo: data.ordNo,
    useYn: data.useYn,
    appDt: data.appDt,
  }
}

export const newUnitThicknessCUType = ():unitThicknessCUType => {
  return {
    layerEm: null,
    minThickness: 0,
    maxThickness: 0,
    remark: "",
    weight: 0,
    addCost: 0,
    ordNo: 0,
    useYn: true,
    appDt: null,
  }
}