import { Dayjs } from "dayjs";

export type materialType = {
  id?: string;
  mtNm?: string;
  mtEnm?: string;
  unitType?: string;
  useYn?: boolean;
  materialGroup?: materialGroupType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}

export type materialGroupType = {
  id?: string;
  mtGrpNm?: string;
  odNum?: number;
  useYn?: boolean;
  materials?: materialType[];
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}