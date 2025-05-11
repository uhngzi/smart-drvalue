import dayjs, { Dayjs } from "dayjs";
import { LayerEm, ModelTypeEm, PrtTypeEm } from "../enum";
import { partnerRType } from "./partner";

export type materialType = {
  id: string | undefined;
  mtNm: string;
  mtEnm: string;
  unitType: string;
  materialGroup: {
    id: string;
    mtGrpNm?: string;
    odNum?: number;
    useYn?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
  materialSuppliers?: { id: string } | string[];
  materialSupplierList?: {
    id?: string;
    ordNo?: number;
    useYn?: boolean;
    supplier?: partnerRType;
  }[];
  useYn: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type materialCUType = {
  id?: string;
  materialGroupIdx?: string;
  materialGroup: {
    id: string | null;
  };
  materialSuppliers?: { id: string } | string[];
  mtNm: string;
  mtEnm: string;
  unitType: string;
  useYn: boolean;
};

export const setMaterialCUType = (data: any): materialCUType => {
  return {
    id: data.id,
    materialGroupIdx: "",
    materialGroup: {
      id: data.materialGroup.id,
    },
    materialSuppliers: data.materialSuppliers,
    mtNm: data.mtNm,
    mtEnm: data.mtEnm,
    unitType: data.unitType,
    useYn: data.useYn,
  };
};

export const newMaterialCUType = (): materialCUType => {
  return {
    materialGroup: {
      id: "",
    },
    mtNm: "",
    mtEnm: "",
    unitType: "",
    useYn: true,
  };
};

export type materialGroupType = {
  id: string;
  mtGrpNm: string;
  ordNo: number;
  useYn: boolean;
  material: materialType[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type materialGroupCUType = {
  mtGrpNm: string;
  odNum: number;
  useYn: boolean;
};

export const setMtGroupCUType = (data: any): materialGroupCUType => {
  return {
    mtGrpNm: data.mtGrpNm,
    odNum: data.odNum,
    useYn: data.useYn,
  };
};

export const newMtGroupCUType = (): materialGroupCUType => {
  return {
    mtGrpNm: "",
    odNum: 0,
    useYn: true,
  };
};

export type materialPriceType = {
  id: string;
  material: materialType;
  priceNm: string;
  priceUnit: number;
  materialType: string;
  txturType: string;
  thicMin: number;
  thicMax: number;
  sizeW: number;
  sizeH: number;
  cntMin: number;
  cntMax: number;
  wgtMin: number;
  wgtMax: number;
  unitType: string;
  remarks: string;
  safeInv: number;
  appDt: Date | Dayjs | null;
  useYn: boolean;
  partner: {
    id: string;
    prtNm: string;
    prtSnm?: string;
    prtEngNm?: string;
    prtEngSnm?: string;
  };
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  applyPrice?: number;
};

export type materialPriceCUType = {
  id?: string;
  material?: { id: string };
  priceNm?: string;
  priceUnit?: number;
  materialType?: string;
  txturType?: string;
  thicMin?: number;
  thicMax?: number;
  sizeW?: number;
  sizeH?: number;
  cntMin?: number;
  cntMax?: number;
  wgtMin?: number;
  wgtMax?: number;
  unitType?: string;
  remarks?: string;
  safeInv?: number;
  appDt?: Date | Dayjs | null;
  useYn?: boolean;

  // UI 입력용 보조 필드 (선택)
  materialIdx?: string;
  partnerIdx?: string;
  appOriginDt?: Date | Dayjs | null;
  applyPrice?: number; // 적용 단가
  applyPricedt?: Date | Dayjs | null; // 단가 적용일
  partner?: { id: string };
};

export const newMaterialPriceCUType = (): materialPriceCUType => ({
  material: { id: "" },
  priceNm: "",
  priceUnit: 0,
  materialType: "",
  txturType: "",
  thicMin: 0,
  thicMax: 0,
  sizeW: 0,
  sizeH: 0,
  cntMin: 0,
  cntMax: 0,
  wgtMin: 0,
  wgtMax: 0,
  unitType: "",
  remarks: "",
  safeInv: 0,
  appDt: dayjs(),
  useYn: true,
  applyPrice: 0,
  applyPricedt: dayjs(),
});

export const materialPriceReq = () => [
  { field: "materialIdx", label: "원자재" },
  { field: "priceNm", label: "가격명" },
  { field: "partnerIdx", label: "외주처" },
  { field: "priceUnit", label: "가격" },
  { field: "useYn", label: "사용여부" },
];

export type materialSupplierType = {
  id?: string;
  ordNo?: number;
  useYn?: boolean;

  materialGroup?: {
    id?: string;
    mtGrpNm?: string;
    ordNo?: number;
    useYn?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };

  material?: {
    id?: string;
    mtNm?: string;
    mtEnm?: string;
    unitType?: string;
    ordNo?: number;
    useYn?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };

  supplier?: {
    id?: string;
    prtTypeEm?: PrtTypeEm;
    prtNm?: string;
    prtRegCd?: number;
    prtSnm?: string;
    prtEngNm?: string;
    prtEngSnm?: string;
    prtRegNo?: string;
    prtCorpRegNo?: string;
    prtBizType?: string;
    prtBizCate?: string;
    prtAddr?: string;
    prtAddrDtl?: string;
    prtZip?: string;
    prtCeo?: string;
    prtTel?: string;
    prtFax?: string;
    prtEmail?: string;
    emp?: any;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
};

// 불량 그룹
export type materialBadGroupType = {
  id?: string;
  badGrpNm?: string;
  ordNo?: number;
  useYn?: boolean;
  materialGroupBads?: materialBadType[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

// 불량 항목
export type materialBadType = {
  id?: string;
  badNm?: string;
  badDesc?: string;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type materialApplyType = {
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
    priceUnit?: number;
  };
};
