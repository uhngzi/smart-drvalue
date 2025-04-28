import { Dayjs } from "dayjs";
import { partnerRType } from "../base/partner";

export type reportsType = {
  id?: string;
  name?: string;
  latestVersion?: number;
  lastestAppliedAt?: Date | Dayjs | null;
  prt?: partnerRType;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;

  file?: string;
  content?: string;
  appliedAt?: Date | Dayjs | null;
};

export type reportsDetailType = {
  id?: string;
  content?: string;
  file?: string;
  version?: number;
  appliedAt?: Date | Dayjs | null;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const reportsReq = () => {
  return [
    { field: "name", label: "성적서명" },
    { field: "file", label: "첨부파일" },
  ];
};
