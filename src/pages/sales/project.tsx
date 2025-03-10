import MainPageLayout from "@/layouts/Main/MainPageLayout";
import GanttChart from "@/utils/third-party/GanttChart";
import { Button, DatePicker, Dropdown } from "antd";
import dayjs from "dayjs";
//@ts-ignore
import styled from "styled-components";

import { getDaysBetween } from "@/utils/formatDate";
import { useState } from "react";
import AntdDrawer from "@/components/Drawer/AntdDrawer";

import Edit from "@/assets/svg/icons/edit.svg";
import Load from "@/assets/svg/icons/time-load.svg";
import Reg from "@/assets/svg/icons/memo.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import CardInputList from "@/components/List/CardInputList";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import ProjectDrawer from "@/contents/projcet/ProjectDrawer";

type Task = {
  id: string;
  name: string;
  color: string;
  from: string | Date;  // 날짜는 문자열로 표현
  to: string | Date;
  progColor: string;
  progFrom: string;
  progTo: string;
};

type Process = {
  process: string;
  task: Task[];
};

type Schedules = Process[];


// 함수형 컴포넌트로 작성된 projcet 페이지
const ProjcetPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  
const [orderOpen, setOrderOpen] = useState<boolean>(false);
const [processOpen, setProcessOpen] = useState<boolean>(false);
const tempSchedules = [
  {
    process: "설계",
    task: [
      { id: "1", name:"도면 설계", color: "#FFD699", from: "2025-03-02", to: "2025-03-04", progColor: "#FFA500", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
  {
    process: "성형",
    task: [
      { id: "3", name:"Shell Forming", color: "#AEEEEE", from: "2025-03-09", to: "2025-03-12", progColor: "#008B8B", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "4", name:"Roll Bending", color: "#AEEEEE", from: "2025-03-09", to: "2025-03-12", progColor: "#008B8B", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "5", name:"Head Forming", color: "#AEEEEE", from: "2025-03-12", to: "2025-03-16", progColor: "#008B8B", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "6", name:"Shell Forming", color: "#AEEEEE", from: "2025-03-16", to: "2025-03-20", progColor: "#008B8B", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
  {
    process: "용접",
    task: [
      { id: "7", name:"Shell Block Fit-up", color: "#D8BFD8", from: "2025-03-23", to: "2025-03-26", progColor: "#800080", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "8", name:"Internal 용접", color: "#D8BFD8", from: "2025-03-26", to: "2025-03-30", progColor: "#800080", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "9", name:"용접검사", color: "#D8BFD8", from: "2025-03-30", to: "2025-04-03", progColor: "#800080", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
  {
    process: "열처리",
    task: [
      { id: "10", name:"비파괴검사", color: "#FFB6B6", from: "2025-03-23", to: "2025-03-26", progColor: "#E73E95", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "11", name:"수압검사", color: "#FFB6B6", from: "2025-03-26", to: "2025-03-30", progColor: "#E73E95", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
  {
    process: "도장",
    task: [
      { id: "12", name:"Blasting", color: "#ADD8E6", from: "2025-03-23", to: "2025-03-26", progColor: "#0055A4", progFrom: "2025-03-03", progTo: "2025-03-04" },
      { id: "13", name:"Final Paint", color: "#ADD8E6", from: "2025-03-26", to: "2025-03-30", progColor: "#0055A4", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
  {
    process: "포장",
    task: [
      { id: "14", name:"포장", color: "#D3D3D3", from: "2025-03-23", to: "2025-03-26", progColor: "#696969", progFrom: "2025-03-03", progTo: "2025-03-04" },
    ],
  },
];

const [schedules, setSchedules] = useState<Schedules>(tempSchedules);

function changeDate(date: any, id: string, type: string) {
  const newDate = dayjs(date).format('YYYY-MM-DD')

  const newSchedules = schedules.map(process => {
    return {
      ...process,
      task: process.task.map(task => {
        if (task.id === id) {
          return { ...task, [type]: newDate }; // 이름 변경
        }
        return task;
      }),
    };
  });

  setSchedules(newSchedules);

}

  return(
    <section className="flex flex-col w-full h-full">
      <p className="font-medium px-20 h-40">{"다이나모터 지지구조물2  >  Guide vane actuator console 1 welded"}</p>
      <div className="flex rounded-14" style={{border:'1px solid #D9D9D9'}}>
        <div>

          <ProjectTable>
            <colgroup>
              <col width="58.5%" />
              <col width="15%" />
              <col width="15%" />
              <col width="11.5%" />
            </colgroup>
            <thead>
              <tr className="!h-55">
                <th>공정</th>
                <th>시작일</th>
                <th>완료일</th>
                <th>진행일수</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <>
                  <tr className="process" key={`process-${index}`}>
                    <td colSpan={4}>{schedule.process}</td>
                  </tr>
                  {schedule.task.map((task, index) => (
                    <tr key={task.id}>
                      <td className="flex flex-row justify-between items-center h-40 px-10">
                        <div className="flex items-center gap-20">
                          <div className="w-18 h-18 rounded-4" style={{backgroundColor: "#E9EDF5"}}>{index+1}</div>
                          <span>{task.name}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="w-36 h-20 rounded-4 px-5 text-12" style={{border:'1px solid #D9D9D9', color:'#00000073'}}>50%</div>
                          <Dropdown trigger={["click"]} menu={{ items:[
                            {
                              label: <div className="h-center gap-5">
                                        <p className="w-16 h-16"><Load /></p>
                                        진행관리
                                      </div>,
                              key: 0,
                              onClick:()=>setProcessOpen(true)
                            },
                            {
                              label: <div className="h-center gap-5">
                                        <p className="w-16 h-16"><Reg /></p>
                                        발주등록
                                      </div>,
                              key: 1,
                              onClick:()=>setOrderOpen(true)
                            },
                          ]}}>
                            <Button type="text" className="!w-24 !h-24 cursor-pointer v-h-center !p-0">
                              <p className="w-16 h-16"><Edit/></p>
                            </Button>
                          </Dropdown>
                        </div>
                      </td>
                      <td>
                        <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                          value={dayjs(task.from).isValid() ? dayjs(task.from) : null} 
                          onChange={(date) => changeDate(date, task.id, "from")} />
                      </td>
                      <td>
                        <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                          value={dayjs(task.to).isValid() ? dayjs(task.to) : null} 
                          onChange={(date) => changeDate(date, task.id, "to")} />
                      </td>
                      <td>{getDaysBetween(task.from, task.to)}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </ProjectTable>
        </div>
        <GanttChart schedules={schedules}/>
      </div>
      <AntdDrawer open={orderOpen} close={()=>setOrderOpen(false)} width={760}>
        <section className="p-20 flex flex-col gap-20">
          <div className="flex justify-between items-center">
            <span className="text-16 font-medium" style={{color:'#000000D9'}}>발주 등록</span>
            <div className="flex cursor-pointer" onClick={() => setOrderOpen(false)}><Close/></div>
          </div>
          <CardInputList
            items={[
              {value:'', label: '생산제품', name: 'orderNo', type: 'input', widthType: 'half' },
              {value:'', label: '결제조건', name: 'orderDate', type: 'input', widthType: 'half' },
              {value:'', label: '구매처', name: 'orderCompany', type: 'input', widthType: 'third' },
              {value:'', label: '담당자', name: 'orderPrice', type: 'input', widthType: 'third' },
              {value:'', label: '구매담당', name: 'orderContent', type: 'input', widthType: 'third' },
              {value:'', label: '발주확정일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '발주예정일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '발주일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '납품요구일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '도착일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '승인일', name: 'orderContent', type: 'date', widthType: 'third' },
              {value:'', label: '비고', name: 'orderContent', type: 'input', widthType: 'full' },
            ]}
            handleDataChange={(e, name, type) => {}}
            innerBtnContents={
              <Button 
                className="w-109 h-32 bg-point1 text-white rounded-6"
                style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>{}}>
                <Arrow />등록
              </Button>
            }
            />
        </section>
      </AntdDrawer>
      <ProjectDrawer open={processOpen} close={()=>setProcessOpen(false)} />
    </section>
  )
}
ProjcetPage.layout = (page: React.ReactNode) => (
    <MainPageLayout
      menuTitle="일정/인력관리"
      bg="#f5f6fa"
      pd="0"
    >{page}</MainPageLayout>
  );

export default ProjcetPage;

const ProjectTable = styled.table`
  min-width: 530px;
  width: 530px;
  border-right: 1px solid #D9D9D9;
  box-sizing: content-box;
  background-color: #fff;
  border-radius: 14px 0 0 14px;
  border-collapse: collapse;
  tr.process {
    background-color: #EEEEEE;
    height: 30px;
    & > td {
      text-align: left !important;
      padding-left: 10px;
      font-size: 14px;
    }
  }
  tr {
    height: 40px;
  }
  th {
    height: 50px;
    font-weight: 400;
    font-size: 14px;
    color: #000000D9;
    border-bottom: 1px solid #D9D9D9;
    border-right: 1px solid #D9D9D9;
    box-sizing: content-box;
  }
  td {
    text-align: center;
    font-size: 12px;
    border-bottom: 1px solid #D9D9D9;
    border-right: 1px solid #D9D9D9;
    box-sizing: content-box;
  }
  tr:last-child td{
    border-bottom: none;
  }
`
const CustomDatePicker = styled(DatePicker)`
  padding: 0;
  border: 0;
  .ant-picker-input {
    & > input{
      text-align: center;
      font-size: 12px;
    }
  }
`