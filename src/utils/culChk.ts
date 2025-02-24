import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

//공휴일 체크
export const getCulChkList = async (date:Date | Dayjs | null) => {
  const key = 'FISzSyd7IVvaYJoH17HoNUXg1kk%2Bp9oBEU2o4tKrpvpl3%2BDJa%2BehOiTn9SafzssMS1IUzJsxB7SLVwP6W%2B2qXQ%3D%3D';
  const year = dayjs(date).format('YYYY')
  const mon = dayjs(date).format('MM')
  const data = await axios.get(`https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?ServiceKey=${key}&solYear=${year}&solMonth=${mon}`)
  return data
}