import { Dayjs } from "dayjs";
import { partnerRType } from "./partner";

export type materialType = {
  id?: string;
  mtNm?: string;
  mtEnm?: string;
  unitType?: string;
  useYn?: boolean;
  ordNo?: number;
  materialGroup?: materialGroupType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
};

export type materialGroupType = {
  id?: string;
  mtGrpNm?: string;
  odNum?: number;
  ordNo?: number;
  useYn?: boolean;
  materials?: materialType[];
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
};

export type materialSupType = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id?: string;
  useYn?: boolean;
  materialGroup?: materialGroupType;
  material?: materialType;
  supplier?: partnerRType;
};

export type materialPriceType = {
  id?: string;
  material?: materialType;
  priceNm?: string;
  odNum?: number;
  ordNo?: number;
  partner?: partnerRType;
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
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  index?: number;
  orderId?: string;
};

export type materialGroupBadType = {
  id?: string;
  badNm?: string;
  badDesc?: string;
  ordNo?: number;
  useYn?: boolean;
  materialGroup?: materialGroupType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
};
