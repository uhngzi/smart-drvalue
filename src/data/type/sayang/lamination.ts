import { Dayjs } from "dayjs";
import { LayerEm } from "../enum";

export type specLaminationType = {
  id?: string;
  lamNo?: string;
  layerEm?: LayerEm;
  confirmYn?: boolean;
  lamThk?: number
  lamRealThk?: number;
  specDetail?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
}