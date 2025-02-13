// 기초정보 - 휴일

import { OffdayTypeEm } from "../enum";

export type offdayRType = {
  id: string;
  offdayDt: Date;
  offdayWk: "월요일" | "화요일" | "수요일" | "목요일" | "금요일" | "토요일" | "일요일";
  offdayWkEng: "Monday" | "Tuesday" | "Wednesday" | "Tursday" | "Friday" | "Saturday" | "Sunday";
  offdayTypeEm: OffdayTypeEm;
  offdayRepeatYn: boolean;
  offdayRemarks: string;
  useYn: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type offdayCUType = {
  offdayDt: Date;
  offdayWk?: "월요일" | "화요일" | "수요일" | "목요일" | "금요일" | "토요일" | "일요일" | "";
  offdayWkEng?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "";
  offdayTypeEm: OffdayTypeEm | null;
  offdayRepeatYn: boolean;
  offdayRemarks?: string;
  useYn: boolean;
}

export const newDataOffdayType = ():offdayCUType => {
  return {
    offdayDt: new Date(),
    offdayWk: "",
    offdayWkEng: "",
    offdayTypeEm: null,
    offdayRepeatYn: true,
    offdayRemarks: '',
    useYn: true,
  }
}