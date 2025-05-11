// 구매/매입 - 제품 단가 - 특별사양

import dayjs, { Dayjs } from "dayjs";
import { commonCodeRType } from "./common"; // 공통코드
import { processRType } from "./process"; // 공정

export type unitSpecialType = {
  id?: string;
  process?: processRType | null;
  remark?: string;
  weight?: number;
  addCost?: number;
  minRange?: number;
  maxRange?: number;
  unit?: commonCodeRType | null;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const setUnitSpecialType = (data: any): unitSpecialType => {
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
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export type unitSpecialCUType = {
  id?: string;
  process?: processRType | null;
  remark?: string;
  weight?: number;
  addCost?: number;
  minRange?: number;
  maxRange?: number;
  unit?: commonCodeRType | null;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
  appOriginDt?: Date | Dayjs | null;
  applyAppDt?: Date | Dayjs | null;
  applyPrice?: number;
};

export const setUnitSpecialCUType = (data: any): unitSpecialCUType => {
  return {
    id: data.id,
    process: data.process?.id,
    remark: data.remark,
    weight: data.weight * 100, // 수정 modal 가중치 input 값을 백분율 형태로 보여줌
    addCost: data.addCost,
    minRange: data.minRange,
    maxRange: data.maxRange,
    unit: data.unit?.id,
    appDt: data.appDt,
    ordNo: data.ordNo,
    useYn: data.useYn,
    appOriginDt: data.appDt,
    applyAppDt: data.appDt,
    applyPrice: data.addCost,
  };
};

export const newUnitSpecialCUType = (): unitSpecialCUType => {
  return {
    process: { id: "" },
    remark: "",
    weight: 0,
    addCost: 0,
    minRange: 0,
    maxRange: 0,
    unit: { id: "" },
    appDt: dayjs(),
    ordNo: 0,
    useYn: true,
  };
};

export const unitSpecialReq = () => [
  { field: "process", label: "공정" },
  { field: "minRange", label: "최소 범위" },
  { field: "maxRange", label: "최대 범위" },
  { field: "weight", label: "추가 비율(%)" },
  { field: "addCost", label: "현재 단가" },
  { field: "unit", label: "단위" },
  { field: "useYn", label: "사용 여부" },
  { field: "appDt", label: "초기 적용일" },
];

export type unitSpecialApplyType = {
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
