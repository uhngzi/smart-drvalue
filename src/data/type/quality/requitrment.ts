import { Dayjs } from "dayjs";
import { partnerMngRType, partnerRType } from "../base/partner";

export type requirementType = {
  id?: string;
  qualityGrade?: "BEST" | "GOOD" | "NORMAL";
  lastUpdatedAt?: Date | Dayjs | null;
  prt?: partnerRType;
  emp?: {
    id?: string;
    name?: string;
    userId?: string;
    status?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  };
  qualityRequirementsDetails?: {
    id?: string;
    isCanceled?: boolean;
    content?: string;
    appliedAt?: Date | Dayjs | null;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
  }[];
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;

  appliedAt?: Date | Dayjs | null;
  content?: string;
};

export type requirementContentsType = {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  id?: string;
  isCanceled?: boolean;
  content?: string;
  appliedAt?: Date | Dayjs | null;
};
