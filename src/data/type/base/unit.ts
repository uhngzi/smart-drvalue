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
  remark?: string;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
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
    remark: data.remark,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createdAt,
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
  appOriginDt?: Date | Dayjs | null;
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
    appOriginDt: data.appDt,
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
    remark: "",
    appDt: null,
  }
}

export const unitModelReq = () => [
  { field: 'layerEm', label: '레이어 유형' },
  { field: 'minAmount', label: '최소 수량' },
  { field: 'maxAmount', label: '최대 수량' },
  { field: 'price', label: '가격' },
  { field: 'deliveryDays', label: '배송일' },
  { field: 'appDt', label: '적용일' },
];
