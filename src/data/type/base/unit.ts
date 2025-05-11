// 구매/매입 - 제품 단가 - 모델 단가

import dayjs, { Dayjs } from "dayjs";
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
};

export const setUnitModelType = (data: any): unitModelType => {
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
  };
};

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
  applyAppDt?: Date | Dayjs | null;
  applyPrice?: number;
};

export const setUnitModelCUType = (data: any): unitModelCUType => {
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
    applyAppDt: data.appDt,
    applyPrice: data.price,
  };
};

export const newUnitModelCUType = (): unitModelCUType => {
  return {
    layerEm: null,
    minAmount: 0,
    maxAmount: 0,
    price: 0,
    deliveryDays: 0,
    ordNo: 0,
    useYn: true,
    remark: "",
    appDt: dayjs(),
  };
};

export const unitModelReq = () => [
  { field: "layerEm", label: "층수" },
  { field: "minAmount", label: "최소 수량" },
  { field: "maxAmount", label: "최대 수량" },
  { field: "price", label: "현재 단가" },
  { field: "deliveryDays", label: "배송일" },
  { field: "useYn", label: "사용 여부" },
  { field: "appDt", label: "초기 적용일" },
];

export type unitModelApplyType = {
  id?: string;
  targetIndex?: string;
  typeName?: string;

  fData1?: number;
  fData2?: number;
  iData1?: number;
  iData2?: number;
  sData1?: string | null;
  sData2?: string | null;

  applyDate?: Date | Dayjs | null;
  applyYn?: boolean;

  createdAt?: string;
  updatedAt?: string;

  mapping?: {
    price?: number;
  };
};
