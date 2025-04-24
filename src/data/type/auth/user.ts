import { Dayjs } from "dayjs";
import { deptRType, teamRType } from "../base/hr";

export type UserType = {
  id?: string;
  name?: string;
  userId?: string;
  status?: string;
  role?: {
    id?: string;
    name?: string;
    description?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
  };
  detail?: {
    id?: string;
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    deletedAt?: Date | Dayjs | null;
    dept?: deptRType;
    team?: teamRType;
    empType?: string;
    empIdnum?: string;
    empTit?: string;
    empRank?: string;
    empStDt?: Date | Dayjs | null;
    empTrnsDt?: Date | Dayjs | null;
    empRemarks?: string;
    empEdDt?: Date | Dayjs | null;
    defMetaDataJobType?: string;
    defMetaDataWorkType?: string;
    empSts?: string;
    empStsDt?: Date | Dayjs | null;
    empPayType?: string;
    empPay?: number;
    empPayAppDt?: Date | Dayjs | null;
    empPayTypeAppDt?: Date | Dayjs | null;
    secomCardno?: string;
    metaData?: any[];
  };
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
};
