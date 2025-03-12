import { JseoGantt } from 'jseo-plan-gantt';
import React, { useEffect, useRef } from 'react';

type Task = {
  id: string;
  color: string;
  from: string | Date;
  to: string | Date;
  progColor: string;
  progTo?: string | Date;
};
type schdules = {
  process: string;
  task: Task[];
}

type GanttChartProps = {
  schedules: schdules[];
  chartStart?: string | Date;
  chartEnd?: string | Date;
};

const GanttChart: React.FC<GanttChartProps> = ({ schedules }) => {
  
  return <JseoGantt schedules={schedules} chartStart={new Date("2025-03-01")} chartEnd={new Date("2025-05-31")}/>;
};

export default GanttChart;