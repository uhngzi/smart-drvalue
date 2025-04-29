// 기초정보 - 적층구조

import { Dayjs } from "dayjs";
import { LamDtlTypeEm } from "../enum";

//--------------------copper.tsx------------------------------------------------//
export type laminationCopperList = {
  id?: string;
  name?: string;
  copThk?: string;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const setlaminationCopperList = (data: any): laminationCopperList => {
  return {
    id: data.id,
    name: data.name,
    copThk: data.copThk,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const newlaminationCopperList = (): laminationCopperList => {
  return {
    name: "",
    copThk: "",
    ordNo: 0,
    useYn: true,
    createdAt: null,
    updatedAt: null,
  };
};
//--------------------copper.tsx------------------------------------------------// 끝

//--------------------material.tsx----------------------------------------------//
export type laminationMaterialType = {
  id?: string;
  matNm?: string;
  epoxy?: number;
  code?: string;
  lamDtlTypeEm?: LamDtlTypeEm | null;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const setLaminationMaterialType = (
  data: any
): laminationMaterialType => {
  return {
    id: data.id,
    matNm: data.matNm,
    epoxy: data.epoxy,
    code: data.code,
    lamDtlTypeEm: data.lamDtlTypeEm,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const newLaminationMaterialType = (): laminationMaterialType => {
  return {
    lamDtlTypeEm: null,
    matNm: "",
    epoxy: 0,
    code: "",
    ordNo: 0,
    useYn: true,
    createdAt: null,
    updatedAt: null,
  };
};
//--------------------material.tsx----------------------------------------------//끝

//--------------------source.tsx------------------------------------------------//
export type laminationSourceList = {
  id?: string;
  name?: string;
  copNm?: string;
  lamDtlRealThk?: number;
  matNm?: string;
  copperFoil: { copNm?: string };
  material: { matNm?: string };
  copThk?: string;
  epoxy?: number;
  code?: string;
  lamDtlTypeEm?: LamDtlTypeEm | null;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const setLaminationSourceList = (data: any): laminationSourceList => {
  return {
    id: data.id,
    name: data.name,
    copperFoil: { copNm: data.copperFoil?.copNm || "" },
    material: { matNm: data.material?.matNm || "" },
    copThk: data.copperFoil?.copThk || "",
    epoxy: data.epoxy,
    code: data.code,
    lamDtlTypeEm: data.lamDtlTypeEm,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: null,
    updatedAt: null,
  };
};
//
export const newLaminationSourceList= (): laminationSourceList => {
  return { 
    name: " ",
    copperFoil: { copNm: "" },
    material: { matNm: "" },
    copThk: "",
    epoxy: 0,
    code: "0",
    lamDtlTypeEm: null,
    ordNo: 0,
    useYn: true,
    createdAt: null,
    updatedAt: null,
  };
};

//--------------------source.tsx------------------------------------------------//끝

export type laminationCUType = {
  id?: string;
  lamDtlTypeEm: LamDtlTypeEm | null;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
};

export const setLaminationCUType = (data: any): laminationCUType => {
  return {
    id: data.id,
    lamDtlTypeEm: data.lamDtlTypeEm,
    matCd: data.matCd,
    matThk: data.matThk,
    copOut: data.copOut,
    copIn: data.copIn,
    lamDtlThk: data.lamDtlThk,
    lamDtlRealThk: data.lamDtlRealThk,
    useYn: data.useYn,
  };
};

export const newLaminationCUType = (): laminationCUType => {
  return {
    lamDtlTypeEm: null,
    matCd: "",
    matThk: 0,
    copOut: "",
    copIn: "",
    lamDtlThk: 0,
    lamDtlRealThk: 0,
    useYn: true,
  };
};
