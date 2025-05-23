import MainPageLayout from "@/layouts/Main/MainPageLayout";
import GanttChart from "@/utils/third-party/GanttChart";
import { Button, Checkbox, DatePicker, Dropdown } from "antd";
import dayjs from "dayjs";
//@ts-ignore
import styled from "styled-components";

import { getDaysBetween } from "@/utils/formatDate";
import { Fragment, useState } from "react";
import AntdDrawer from "@/components/Drawer/AntdDrawer";

import Edit from "@/assets/svg/icons/edit.svg";
import Load from "@/assets/svg/icons/time-load.svg";
import Reg from "@/assets/svg/icons/memo.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import CardInputList from "@/components/List/CardInputList";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import RightArrow from "@/assets/svg/icons/r-arrow.svg";
import WorkerFill from "@/assets/svg/icons/workerFill.svg";
import WorkerFill2 from "@/assets/svg/icons/userFill2.svg";
import WorkerOutline from "@/assets/svg/icons/workerOutline.svg";
import Calendar from "@/assets/svg/icons/newcalendar.svg";
import SmallCalendar from "@/assets/svg/icons/s_newcalendar.svg";
import Trash from "@/assets/svg/icons/red-trash.svg";
import TopArrow from "@/assets/svg/icons/projectTopArrow.svg";


import ProjectDrawer from "@/contents/project/ProjectDrawer";
import useToast from "@/utils/useToast";
import { projectSchedules, Task } from "@/data/type/base/project";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import { deleteAPI } from "@/api/delete";




// 함수형 컴포넌트로 작성된 projcet 페이지
const ProjcetPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {

  const { showToast, ToastContainer } = useToast();
    
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const [processOpen, setProcessOpen] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string | null>(null);

  // 인력계획 관련
  const [workerPlanOpen, setWorkerPlanOpen] = useState<boolean>(false);
  const [workerPlan, setWorkerPlan] = useState<{id: string, date: string} | null>(null);
  const [projectWorkers, setProjectWorkers] = useState<any[]>([]);

  const { isLoading: usersLoading } = useQuery<apiGetResponseType, Error>({
    queryKey: ['auth', 'tenant', 'user'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'auth',
        utype: 'tenant/',
        url: `user/jsxcrud/many`,
      },{
        s_query: {"detail.team.teamNm": { "$eq": "생산팀" }}
      });

      if (result.resultCode === 'OK_0000') {
        const arr = result.data?.data?.map((item: any) => ({
          empId: item.id,
          name: item.name,
          special: item.detail.empTit
        }));
        setProjectWorkers([{empId: "1", special: "용접", name: "test" , age:"30", career: "20", tel: "010-1234-1234", remark: "특이사항"}, ...arr])
      } else {
        console.log('error:', result.response);
      }

      return result;
    },
  });

  const [schedules, setSchedules] = useState<projectSchedules>([]);
  const [workerPlanList, setWorkerPlanList] = useState<any[]>([]);
  const { data:queryData, refetch:pmsRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ['pms', 'proc', 'worksheet'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d3',
        utype: 'tenant/',
        url: 'pms/proc/default/many/788d1447-92da-4931-950f-cfa45fcdf588'
      });

      if (result.resultCode === 'OK_0000') {
        let arr = await Promise.all(
          result.data?.data?.map(async (item: any) => {
            const tasks = await Promise.all(
              item.process.map(async (task: any) => {
                const workerRes = await getAPI({
                  type: 'core-d3',
                  utype: 'tenant/',
                  url: `pms/proc/employee/default/many/${task.id}`,
                });
        
                const workerPlan = workerRes.data?.data?.map((worker: any) => ({
                  id: worker.id,
                  empId: worker.emp.id,
                  name: worker.emp.name,
                  workPlanStart: worker.wkEmpProcScheInDt,
                  workPlanEnd: worker.wkEmpProcScheOutDt,
                }));
        
                return {
                  id: task.id,
                  name: task.processName,
                  color: 'lightgray',
                  from: task.wkProcStDtm,
                  to: task.wkProcEdDtm,
                  progColor: 'gray',
                  progTo: task.wkProcLastWorkDt,
                  progress: (task.wkProcPer*100).toFixed(0),
                  workers: workerPlan,
                };
              })
            );
        
            return {
              process: item.processGroupName,
              task: tasks, // 여기서 Promise가 풀림
            };
          })
        );
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", arr)
        setSchedules(arr);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
  });
 
// const tempSchedules = [
//   {
//     process: "설계",
//     task: [
//       { id: "1", name:"도면 설계", color: "#FFD699", from: "2025-03-02", to: "2025-03-04", progColor: "#FFA500"},
//     ],
//   },
//   {
//     process: "성형",
//     task: [
//       { id: "3", name:"Shell Forming", color: "#AEEEEE", from: "2025-03-09", to: "2025-03-12", progColor: "#008B8B"},
//       { id: "4", name:"Roll Bending", color: "#AEEEEE", from: "2025-03-09", to: "2025-03-12", progColor: "#008B8B"},
//       { id: "5", name:"Head Forming", color: "#AEEEEE", from: "2025-03-12", to: "2025-03-16", progColor: "#008B8B"},
//       { id: "6", name:"Shell Forming", color: "#AEEEEE", from: "2025-03-16", to: "2025-03-20", progColor: "#008B8B"},
//     ],
//   },
//   {
//     process: "용접",
//     task: [
//       { id: "7", name:"Shell Block Fit-up", color: "#D8BFD8", from: "2025-03-23", to: "2025-03-26", progColor: "#800080"},
//       { id: "8", name:"Internal 용접", color: "#D8BFD8", from: "2025-03-26", to: "2025-03-30", progColor: "#800080"},
//       { id: "9", name:"용접검사", color: "#D8BFD8", from: "2025-03-30", to: "2025-04-03", progColor: "#800080"},
//     ],
//   },
//   {
//     process: "열처리",
//     task: [
//       { id: "10", name:"비파괴검사", color: "#FFB6B6", from: "2025-03-23", to: "2025-03-26", progColor: "#E73E95"},
//       { id: "11", name:"수압검사", color: "#FFB6B6", from: "2025-03-26", to: "2025-03-30", progColor: "#E73E95"},
//     ],
//   },
//   {
//     process: "도장",
//     task: [
//       { id: "12", name:"Blasting", color: "#ADD8E6", from: "2025-03-23", to: "2025-03-26", progColor: "#0055A4"},
//       { id: "13", name:"Final Paint", color: "#ADD8E6", from: "2025-03-26", to: "2025-03-30", progColor: "#0055A4"},
//     ],
//   },
//   {
//     process: "포장",
//     task: [
//       { id: "14", name:"포장", color: "#D3D3D3", from: "2025-03-23", to: "2025-03-26", progColor: "#696969"},
//     ],
//   },
// ];


function addPopWorkers(data: any) {
  if(workerPlanList.find((item) => item.id === data.id)) {
    setWorkerPlanList((prev) => prev.filter((item) => item.id !== data.id));
  } else {
    setWorkerPlanList((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
  }
}


  async function changeDate(date: any, id: string, type: string, otherDate: any) {
    const newDate = dayjs(date).format('YYYY-MM-DD')
    otherDate = otherDate ? dayjs(otherDate).format('YYYY-MM-DD') : newDate;
    let data = {}
    if(type === "from") {
      data = {startDate: newDate, endDate: otherDate}
      const to = schedules.flatMap(process => process.task).find(task => task.id === id)?.to;
      if (to && dayjs(newDate).isAfter(dayjs(to))) {
        showToast("시작일은 종료일보다 이전이어야 합니다.", "error");
        return;
      }
    } else {
      data = {startDate: otherDate, endDate: newDate}
      const from = schedules.flatMap(process => process.task).find(task => task.id === id)?.from;
      if (from && dayjs(newDate).isBefore(dayjs(from))) {
        showToast("종료일은 시작일보다 이후이어야 합니다.", "error");
        return;
      }
    }

    // const newSchedules = schedules.map(process => {
    //   return {
    //     ...process,
    //     task: process.task.map(task => {
    //       if (task.id === id) {
    //         return { ...task, [type]: newDate }; 
    //       }
    //       return task;
    //     }),
    //   };
    // });
    
    // setSchedules(newSchedules);
    const result = await patchAPI({
      type: 'core-d3', 
      utype: 'tenant/',
      jsx: 'default',
      url: `pms/proc/default/update-date/${id}`,
      etc: true,
    },id, data);
    console.log(result);

    if(result.resultCode === 'OK_0000') {
      pmsRefetch();
    } else {
    }

  }

  async function addWorkerPlan(workerPlanList: any[], procId: string | undefined) {
    const { withId, withoutId } = workerPlanList.reduce(
      (acc, item) => {
        if (item.id !== undefined) {
          acc.withId.push(item);
        } else {
          acc.withoutId.push(item);
        }
        return acc;
      },
      { withId: [], withoutId: [] }
    );
    console.log(withId, withoutId)

    let flag = false
    for(const item of withId.filter((f:any) => !f?.delYn)) {
      const data = {
        wkEmpProcScheInDt: item.workPlanStart,
        wkEmpProcScheOutDt: item.workPlanEnd,
      };
      const result = await patchAPI({
        type: 'core-d3', 
        utype: 'tenant/',
        jsx: 'default',
        url: `pms/proc/employee/schedule/default/update/${procId}/${item.id}`,
        etc: true,
      },'', data);
      console.log(result);
      if(result.resultCode === 'OK_0000') {
        flag = true
      } else {
        showToast("인력계획 수정중 문제가 발생했습니다..", "error");
        flag = false;
        return;
      }
    }
    if(withoutId.length > 0){
      const data = withoutId.map((item: any) => ({
        empIdx: item.empId,
        wkEmpProcScheInDt: item.workPlanStart,
        wkEmpProcScheOutDt: item.workPlanEnd,
      }));
      const result = await postAPI({
        type: 'core-d3', 
        utype: 'tenant/',
        jsx: 'default',
        url: `pms/proc/employee/schedule/default/create/${procId}`,
        etc: true,
      }, {scheduleList: data});
      console.log(result);
      if(result.resultCode === 'OK_0000') {
        flag = true
      } else {
        showToast("인력계획 등록중 문제가 발생했습니다..", "error");
        flag = false
        return;
      }
    }
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", withId)
    for(const item of withId.filter((f:any) => f?.delYn)) {
      const result = await deleteAPI({
        type: 'core-d3', 
        utype: 'tenant/',
        jsx: 'default',
        url: `pms/proc/employee/schedule/default/delete/${procId}/${item.id}`,
        etc: true,
      },'');
      console.log(result);
      if(result.resultCode === 'OK_0000') {
        flag = true
      } else {
        showToast("인력계획 삭제중 문제가 발생했습니다..", "error");
        flag = false;
        return;
      }
    }


    if(flag) {
      showToast("인력계획이 저장되었습니다.", "success");
      setWorkerPlanOpen(false)
      pmsRefetch();
    }
      
  }
  console.log(workerPlanList);
  return(
    <section className="flex flex-col w-full h-full">
      <p className="font-medium px-20 h-40">{"다이나모터 지지구조물2  >  Guide vane actuator console 1 welded"}</p>
      <div className="flex rounded-14" style={{border:'1px solid #D9D9D9'}}>
        <div>
          <ProjectTable>
            <colgroup>
              <col width="50%" />
              <col width="20%" />
              <col width="20%" />
              <col width="10%" />
            </colgroup>
            <thead>
              <tr className="!h-55">
                <th>공정</th>
                <th colSpan={2}>
                  <div className="flex items-center justify-center gap-30">
                    <span>시작일</span>
                    <RightArrow/>
                    <span>종료일</span>
                  </div>
                </th>
                <th>진행일수</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <Fragment key={index}>
                  <tr className="process" key={`process-${index}`}>
                    <td colSpan={4}>{schedule.process}</td>
                  </tr>
                  {schedule.task.map((task: Task, index) => (
                    <Fragment key={task.id}>
                      <tr>
                        <td className="flex flex-row justify-between items-center h-40 px-10">
                          <div className="flex items-center gap-20">
                            <div className="w-18 h-18 rounded-4" style={{backgroundColor: "#E9EDF5"}}>{index+1}</div>
                            <span>{task.name}</span>
                          </div>
                          <div className="flex items-center gap-5">
                            <div className="w-36 h-20 rounded-4 px-5 text-12" style={{border:'1px solid #D9D9D9', color:'#00000073'}}>{task?.progress ? task.progress : 0}%</div>
                            <div className="flex items-center w-36 h-20 rounded-4 px-5 text-12" style={{border:'1px solid #D9D9D9', color:'#00000073'}}><WorkerFill/>{task?.workers?.length || 0}</div>
                            <Dropdown trigger={["click"]} menu={{ items:[
                              {
                                label: <div className="h-center gap-5">
                                          <p className="w-16 h-16"><Load /></p>
                                          진행관리
                                        </div>,
                                key: 0,
                                onClick:()=>{setSelectId(task.id), setProcessOpen(true)}
                              },
                              {
                                label: <div className="h-center gap-5">
                                          <p className="w-16 h-16"><Reg /></p>
                                          발주등록
                                        </div>,
                                key: 1,
                                onClick:()=>{setSelectId(task.id), setOrderOpen(true)}
                              },
                              {
                                label: <div className="h-center gap-5">
                                          <p className="w-16 h-16"><WorkerOutline /></p>
                                          인력계획
                                        </div>,
                                key: 2,
                                onClick:()=>{
                                  setWorkerPlanList(task?.workers || []);
                                  setWorkerPlan({id: task.id, date: `${schedule.process} > ${task.name}(${dayjs(task.from).format("YYYY-MM-DD")} ~ ${dayjs(task.to).format("YYYY-MM-DD")})`});
                                  setWorkerPlanOpen(true);
                                  }
                              },
                            ]}}>
                              <Button type="text" className="!w-24 !h-24 cursor-pointer v-h-center !p-0">
                                <p className="w-16 h-16"><Edit/></p>
                              </Button>
                            </Dropdown>
                          </div>
                        </td>
                        <td colSpan={2}>
                          <div className="flex items-center gap-5">
                            <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                              value={dayjs(task.from).isValid() ? dayjs(task.from) : null} 
                              onChange={(date) => changeDate(date, task.id, "from", task.to)} />
                            <p className="w-32 flex justify-center"><RightArrow/></p>
                            <CustomDatePicker size="small" suffixIcon={<Calendar/>} allowClear={false} 
                              value={dayjs(task.to).isValid() ? dayjs(task.to) : null} 
                              onChange={(date) => changeDate(date, task.id, "to", task.from)} />
                          </div>
                        </td>
                        
                        <td>{getDaysBetween(task.from, task.to)}</td>
                      </tr>
                      {task.workers && task.workers.length > 0 && task.workers.map((worker, index) => (
                        <tr key={`${task.id}-worker-${index}`}>
                          <td className="flex items-center gap-5 px-10">
                            <div className="flex items-center ">
                              <div className="w-24 h-24 justify-center items-center flex"><TopArrow/></div>
                              <div className="w-24 h-24 justify-center items-center flex"><WorkerFill2/></div>
                              <span>{worker.name}</span>
                            </div>
                          </td>
                          <td colSpan={2}>
                            <div className="flex items-center gap-5">
                              <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                                value={dayjs(worker.workPlanStart).isValid() ? dayjs(worker.workPlanStart) : null} 
                                open={false} readOnly={true}/>
                              <p className="w-32 flex justify-center"><RightArrow/></p>
                              <CustomDatePicker size="small" suffixIcon={<Calendar/>} allowClear={false} 
                                value={dayjs(worker.workPlanEnd).isValid() ? dayjs(worker.workPlanEnd) : null} 
                               open={false} readOnly={true}/>
                            </div>
                          </td>
                          
                          <td>{getDaysBetween(worker.workPlanStart, worker.workPlanEnd)}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </ProjectTable>
        </div>
        {/* <GanttChart schedules={schedules}/> */}
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
      <ProjectDrawer 
        open={processOpen} 
        selectId={selectId}
        schedules={schedules} 
        setSchedules={setSchedules} 
        refetch={pmsRefetch}
        close={()=>{setSelectId(null), setProcessOpen(false), pmsRefetch()}} 
      />
      <AntdDrawer open={workerPlanOpen} close={()=>{setWorkerPlanList([]); setWorkerPlanOpen(false)}} width={720}>
        <section className="p-20 flex flex-col gap-20">
          <div className="flex justify-between items-center">
            <span className="text-16 font-medium" style={{color:'#000000D9'}}>{workerPlan?.date} 인력투입계획</span>
            <div className="flex cursor-pointer" onClick={() => {setWorkerPlanList([]); setWorkerPlanOpen(false)}}><Close/></div>
          </div>
          <CardInputList items={[]} handleDataChange={()=>{}} innerBtnContents={
            <Button 
              className="w-109 h-32 bg-point1 text-white rounded-6"
              style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={()=> {
                if(workerPlanList.some((item) => !item.workPlanStart || !item.workPlanEnd)) {
                  showToast("투입일과 종료일을 선택해주세요.", "error");
                  return;
                }
                addWorkerPlan(workerPlanList, workerPlan?.id);
                // setSchedules(schedules.map(process => ({
                //   ...process,
                //   task: process.task.map(task => {
                //     if (task.id === workerPlan?.id) {
                //       return { ...task, workers: workerPlanList };
                //     }
                //     return task;
                //   }),
                // })));
                // showToast("인력투입 계획이 생성되었습니다.", "success");
                // setWorkerPlanOpen(false);
              }}>
              <Arrow />등록
            </Button>
            }
            >
              {workerPlanList.length > 0 && workerPlanList.filter(filter => !filter.delYn).map((worker, index) => {
                const workerData = projectWorkers.find((item) => item.empId === worker.empId);
                return (
                  <div className="flex gap-10 items-center" id={workerData?.empId} key={index}>
                    <div className="w-33 h-25 bg-[#D8BFD8] flex justify-center items-center text-12" style={{color:'#800080'}}>{workerData?.special}</div>
                    <span className="w-40 text-center">{workerData?.name}</span>
                    <span className="w-54 text-center">{workerData?.age}세</span>
                    <span className="w-54 text-center">{workerData?.career}년</span>
                    <span className="w-[128px] text-center">{workerData?.tel}</span>
                    <div className="flex items-center gap-3 w-[240px] py-5 px-2 border border-[#D9D9D9]">
                      <CustomDatePicker style={{fontSize:'12px'}} size="small" suffixIcon={null} allowClear={false} 
                        value={worker.workPlanStart ? dayjs(worker.workPlanStart) : null} 
                        onChange={(date: any) => setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId === worker.empId ? {...item, workPlanStart: dayjs(date).format("YYYY-MM-DD")} : item))} />
                      <p className="w-32 flex justify-center"><RightArrow/></p>
                      <CustomDatePicker style={{fontSize:'12px'}} size="small" suffixIcon={<Calendar/>} allowClear={false} 
                        value={worker.workPlanEnd ? dayjs(worker.workPlanEnd) : null} 
                        onChange={(date: any) => setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId === worker.empId ? {...item, workPlanEnd: dayjs(date).format("YYYY-MM-DD")} : item))} />
                    </div>
                    <Dropdown trigger={["click"]} menu={{ items:[
                      {
                        label: <div className="h-center gap-5">
                                  <p className="w-16 h-16"><SmallCalendar /></p>투입일 추가
                                </div>,
                        key: 0,
                        onClick:()=>{}
                      },
                      {
                        label: <div className="h-center gap-5">
                                  <p className="w-16 h-16"><Trash /></p>삭제
                                </div>,
                        key: 1,
                        onClick:()=> setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId !== worker.empId ? item : {...item, delYn: true}))
                      },
                    ]}}>
                      <Button type="text" className="!w-24 !h-24 cursor-pointer v-h-center !p-0">
                        <p className="w-16 h-16"><Edit/></p>
                      </Button>
                    </Dropdown>
                  </div>
                )
              })}
            </CardInputList>
            <AntdTableEdit
              columns={[
                { title: '', width:50, dataIndex: 'empId', key: 'empId', align: 'center', 
                  render:(value, record) => (<Checkbox checked={workerPlanList.find((item) => item.empId === record.empId) ? true : false} onChange={()=>addPopWorkers(record)} />)
                },
                { title: '전문분야', width:84, dataIndex: 'special', key: 'special', align: 'center' },
                { title: '이름', width:75, dataIndex: 'name', key: 'name', align: 'center'},
                { title: '경력', width:58, dataIndex: 'career', key: 'career', align: 'center'},
                { title: '전화번호', width:120, dataIndex: 'tel', key: 'tel', align: 'center'},
                { title: '특이사항', width:250, dataIndex: 'remark', key: 'remark'},
              ]}
              data={projectWorkers}
              styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px'}}
            />
        </section>
      </AntdDrawer>
      <ToastContainer />
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
  width: 640px;
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
      height: 30px !important;
    }
  }
  tr {
    height: 40px;
    box-sizing: border-box;
  }
  th {
    height: 50px;
    font-weight: 400;
    font-size: 14px;
    color: #000000D9;
    border-bottom: 1px solid #D9D9D9;
    border-right: 1px solid #D9D9D9;
    box-sizing: border-box;
  }
  td {
    text-align: center;
    font-size: 12px;
    box-shadow: inset 0 -1px 0 #D9D9D9;
    border-right: 1px solid #D9D9D9;
    box-sizing: border-box;
    height: 40px;
  }
  tr:last-child td{
    border-bottom: none;
  }
`
const CustomDatePicker = styled(DatePicker)`
  padding: 0;
  border: 0;
  border-radius: 0;
  .ant-picker-input {
    & > input{
      text-align: center;
      font-size: 14px;
    }
  }
`