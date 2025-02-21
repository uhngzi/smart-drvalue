import { Dayjs } from "dayjs";

export type filterType = {
  writeDt: Date | Dayjs | null;
  writer: string;
  approveDt: Date | Dayjs | null;
  approver: string;
  confirmDt: Date | Dayjs | null;
  confirmPer: string;
}