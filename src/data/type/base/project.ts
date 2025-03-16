export type Worker = {
  id: string;
  name: string;
  special: string;
  age?: string | number;
  carrer?: string | number;
  tel?: string;
  remark?: string;
  workPlanStart: string | Date;
  workPlanEnd: string | Date;
  workRealStart?: string | Date;
  workRealEnd?: string | Date;
}

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
  workers?: Worker[];
};

export type Process = {
  process: string;
  task: Task[];
};

export type projectSchedules = Process[];