import { Dayjs } from "dayjs";
import { commonCodeRType } from "./common";
import { processRType } from "./process"

export type baseSpecType = {
  id?: string;
  process?: processRType;
  remark?: string;
  weight?: number;
  addCost?: number;
  minRange?: number;
  maxRange?: number;
  unit?: commonCodeRType;
  appDt?: Date | Dayjs | null;
  ordNo?: number;
  useYn?: boolean;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
}