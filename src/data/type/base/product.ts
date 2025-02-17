// 기초정보 - 제품군

import { Dayjs } from "dayjs";
import { processRType } from "./process";

export type productLinesRType = {
  id: string;
  productLinesGroup?: productLinesGroupRType;
  process?: processRType;
  prcWkRemark: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type productLinesCUType = {
  productLinesGroup: { id: string; };
  process: { id: string; };
  prcWkRemark?: string;
}

export const newDataProductLinesType = ():productLinesCUType => {
  return {
    productLinesGroup: { id: '' },
    process: { id: '' },
    prcWkRemark: '',
  }
}

export type productLinesGroupRType = {
  id: string;
  name: string;
  productLines?: productLinesRType[];
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type productLinesGroupCUType = {
  name: string;
}

export const newDataProductLinesGroupType = ():productLinesGroupCUType => {
  return {
    name: '',
  }
}