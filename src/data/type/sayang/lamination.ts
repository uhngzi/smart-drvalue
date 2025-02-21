import { Dayjs } from "dayjs";
import { LayerEm } from "../enum";

export type specLaminationType = {
  id?: string;
  lamNo?: string;
  layerEm?: LayerEm;
  confirmYn?: boolean | 0 | 1;
  lamThk?: number
  lamRealThk?: number;
  specDetail?: string | {
    data?: {
      index: number;
      specLamIdx: string;
    }[]
  };
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}