export type Task = {
  id: string;
  name: string;
  color: string;
  from: string | Date;  // 날짜는 문자열로 표현
  to: string | Date;
  progColor: string;
  progFrom?: string;
  progTo?: string;
  progress?: number;
};

export type Process = {
  process: string;
  task: Task[];
};

export type projectSchedules = Process[];