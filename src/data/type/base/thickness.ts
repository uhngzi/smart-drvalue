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
  appDt?: Date | Dayjs | null;
  useYn?: boolean;
};

export const setUnitThicknessType = (data: any): unitThicknessType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minThickness: data.minThickness,
    maxThickness: data.maxThickness,
    remark: data.remark,
    weight: data.weight,
    addCost: data.addCost,
    ordNo: data.ordNo,
    appDt: data.appDt,
    useYn: data.useYn,
  };
};

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
  appOriginDt?: Date | Dayjs | null;
  applyAppDt?: Date | Dayjs | null;
  applyPrice?: number;
};

export const setUnitThicknessCUType = (data: any): unitThicknessCUType => {
  return {
    id: data.id,
    layerEm: data.layerEm,
    minThickness: data.minThickness,
    maxThickness: data.maxThickness,
    remark: data.remark,
    weight: data.weight * 100, // 수정 modal 가중치 input 값을 백분율 형태로 보여줌
    addCost: data.addCost,
    ordNo: data.ordNo,
    useYn: data.useYn,
    appDt: data.appDt,
    appOriginDt: data.appDt,
    applyAppDt: data.appDt,
    applyPrice: data.addCost,
  };
};

export const newUnitThicknessCUType = (): unitThicknessCUType => {
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
  };
};

export const unitThicknessReq = () => [
  { field: "layerEm", label: "레이어 유형" },
  { field: "minThickness", label: "최소 두께" },
  { field: "maxThickness", label: "최대 두께" },
  { field: "weight", label: "추가 비율(%)" },
  { field: "addCost", label: "현재 단가" },
  { field: "appDt", label: "초기 적용일" },
  { field: "useYn", label: "사용 여부" },
];

export type unitThicknessApplyType = {
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
