// 구매/매입 - 제품 단가 - 모델 단가

import { Dayjs } from "dayjs";
import { LayerEm } from "../enum";

export type unitModelType = {
  id?: string;
  layerEm?: LayerEm | null;
  minAmount?: number;
  maxAmount?: number;
  price?: number;
  deliveryDays?: number;
  ordNo?: number;
  useYn?: boolean;
  remark?: string;
  appDt?: Date | Dayjs | null;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
}

export const setUnitModelType = (data: any):unitModelType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    price: data.price,
    deliveryDays: data.deliveryDays,
    ordNo: data.ordNo,
    useYn: data.useYn,
    remark: data.remark,
    appDt: data.appDt,
    createdAt: data.createAt,
    updatedAt: data.updatedAt,
  }
}

export type unitModelCUType = {
  id?: string;
  layerEm?: LayerEm | null;
  minAmount?: number;
  maxAmount?: number;
  price?: number;
  deliveryDays?: number;
  ordNo?: number;
  useYn?: boolean;
  remark?: string;
  appDt?: Date | Dayjs | null;
}

export const setUnitModelCUType = (data: any):unitModelCUType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    price: data.price,
    deliveryDays: data.deliveryDays,
    ordNo: data.ordNo,
    useYn: data.useYn,
    remark: data.remark,
    appDt: data.appDt,
  }
}

export const newUnitModelCUType = ():unitModelCUType => {
  return {
    layerEm: null,
    minAmount: 0,
    maxAmount: 0,
    price: 0,
    deliveryDays: 0,
    ordNo: 0,
    useYn: true,
    remark: '',
    appDt: null,
  }
}