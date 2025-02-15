import { Dayjs } from "dayjs";
import { LayerEm } from "../enum";

export type specLaminationType = {
  id?: string;
  lamNo?: string | number;
  layerEm?: LayerEm;
  confirmYn?: boolean;
  lamThk?: number
  lamRealThk?: number;
  specDetail?: {
    data?: {
      index: number;
      specLamIdx: string;
    }[]
  };
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}