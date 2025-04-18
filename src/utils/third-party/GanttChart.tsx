import { JseoGantt } from 'jseo-plan-gantt';
import React, { useEffect, useRef } from 'react';

type Task = {
  id: string;
  color: string;
  from: string | Date;
  to: string | Date;
  progColor: string;
  progTo?: string | Date;
  workers?: any[];
};
type schdules = {
  process: string;
  task: Task[];
}

type GanttChartProps = {
  schedules: schdules[];
  basicDate: string | Date;
  chartStart?: string | Date;
  chartEnd?: string | Date;
};

const GanttChart: React.FC<GanttChartProps> = ({ schedules, basicDate }) => {
  //startDate는 basicDate보다 두달 전
  const startDate = new Date(basicDate);
  startDate.setMonth(startDate.getMonth() - 2);

  //endDate는 basicDate보다 두달 후
  const endDate = new Date(basicDate);
  endDate.setMonth(endDate.getMonth() + 2);
  return <JseoGantt schedules={schedules} chartStart={startDate} chartEnd={endDate} basicDate={basicDate}/>;
};

export default GanttChart;