import axios from "axios"

export function formatDateDay(date: number) {
  // YYYYMMDD → YYYY-MM-DD 변환
  const formattedString = `${String(date).slice(0, 4)}-${String(date).slice(4, 6)}-${String(date).slice(6, 8)}`;
  
  const formatdate = new Date(formattedString);
  
  // 요일 변환을 위한 Intl 객체
  const formatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' });
  const dayOfWeek = formatter.format(formatdate);
  
  return `${formatdate.getMonth() + 1}월 ${formatdate.getDate()}일(${dayOfWeek})`;
}
export async function getHoliday(year: number) {

  
  const url = process.env.NEXT_PUBLIC_API_HOLIDAY_URL
  const serviceKey = process.env.NEXT_PUBLIC_API_HOLIDAY_KEY
  const solYear = year || new Date().getFullYear()

  const workersDay = {dateName: '근로자의날', locdate: Number(`${year}0501`), seq: 1, dateKind: '공휴일', isHoliday: 'N'}

  const holiday = (await axios.get(`${url}?ServiceKey=${serviceKey}&solYear=${solYear}&_type=json&numOfRows=100`)).data.response.body.items.item

  holiday.push(workersDay)

  //holiday 변수 안에 locdate의 크기가 작은 순서대로 정렬되어 새 배열을 만듬
  const sortedData = holiday.sort((a:any, b:any) => a.locdate - b.locdate)

  const result = sortedData.map((item:any) => {
    let imgType = 'korea'
    if(item.dateName === '기독탄신일'){
      item.dateName = '크리스마스'
      imgType = 'tree'
    }
    if(item.dateName === '근로자의날'){
      imgType = 'worker'
    }
    if(item.dateName.includes('임시') || item.dateName.includes('대체')){
      item.dateKind = '02'
    }

    return {
      id: null,
      imgType,
      dateName: item.dateName,
      locdate: item.locdate,
      dateKind: item.dateKind
    }
  })
  return result;
}