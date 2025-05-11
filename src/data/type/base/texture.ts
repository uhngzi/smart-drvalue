// 구매/매입 - 제품 단가 - 재질

import dayjs, { Dayjs } from "dayjs";
import { commonCodeRType } from "./common"; // 공통코드

export type unitTextureType = {
  id?: string;
  texture?: commonCodeRType | null;
  remark?: string;
  weight?: number;
  addCost?: number;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const setUnitTextureType = (data: any): unitTextureType => {
  return {
    id: data.id,
    texture: data.texture,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export type unitTextureCUType = {
  id?: string;
  texture?: commonCodeRType | null;
  remark?: string;
  weight?: number;
  addCost?: number;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
  appOriginDt?: Date | Dayjs | null;
  applyAppDt?: Date | Dayjs | null;
  applyPrice?: number;
};

export const setUnitTextureCUType = (data: any): unitTextureCUType => {
  return {
    id: data.id,
    texture: data.texture?.id,
    remark: data.remark,
    weight: data.weight * 100, // 수정 modal 가중치 input 값을 백분율 형태로 보여줌
    addCost: data.addCost,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    appOriginDt: data.appDt,
    applyAppDt: data.appDt,
    applyPrice: data.addCost,
  };
};

export const newUnitTextureCUType = (): unitTextureCUType => {
  return {
    remark: "",
    ordNo: 0,
    useYn: true,
    weight: 0,
    addCost: 0,
    appDt: dayjs(),
  };
};

export const unitTextureReq = () => [
  { field: "texture", label: "재질" },
  { field: "appDt", label: "초기 적용일" },
  { field: "useYn", label: "사용 여부" },
];

export type unitTextureApplyType = {
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
    addCost?: number;
  };
};
