export function getDaysBetween(start: string|Date, end: string|Date): number {
  const s = new Date(start);
  const e = new Date(end);

  // 시간을 00:00:00으로 설정
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);

  // 날짜 차이 계산 (밀리초 -> 일 단위) + 당일 포함
  return (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;
}
