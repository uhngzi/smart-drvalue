import { Dayjs } from "dayjs";

export type certificationType = {
  id?: string;
  name?: string;
  certificationAuthority?: string;
  remark?: string;
  issuedAt?: Date | Dayjs | null;
  expiredAt?: Date | Dayjs | null;
  qualityCertificationHistories?: {
    id?: string;
    content?: string;
    appliedAt?: Date | Dayjs | null;
    file?: string;
    version?: number;
    issuedAt?: Date | Dayjs | null;
    expiredAt?: Date | Dayjs | null;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
  }[];
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;

  appliedAt?: Date | Dayjs | null;
  content?: string;
  file?: string;
};

export type certificationDetailType = {
  id?: string;
  content?: string;
  appliedAt?: Date | Dayjs | null;
  file?: string;
  version?: number;
  issuedAt?: Date | Dayjs | null;
  expiredAt?: Date | Dayjs | null;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
};

export const certificationReq = () => {
  return [
    { field: "name", label: "인증서명" },
    { field: "certificationAuthority", label: "발급처" },
    { field: "issuedAt", label: "발급일" },
    { field: "expiredAt", label: "만료일" },
    // { field: "appliedAt", label: "변경 적용일" },
    { field: "file", label: "첨부파일" },
  ];
};
