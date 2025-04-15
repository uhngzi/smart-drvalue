import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const seoulDayjs = (date?: string | Date | Dayjs | null) => {
  return dayjs(date).tz("Asia/Seoul");
};
