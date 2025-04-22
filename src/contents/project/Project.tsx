import MainPageLayout from "@/layouts/Main/MainPageLayout";
import GanttChart from "@/utils/third-party/GanttChart";
import { Button, Checkbox, DatePicker, DatePickerProps, Dropdown, Input, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
//@ts-ignore
import styled from "styled-components";

import { getDaysBetween } from "@/utils/formatDate";
import { Fragment, memo, useEffect, useRef, useState } from "react";
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
import { useRouter } from "next/router";
import { wkPlanWaitType } from "@/data/type/wk/plan";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { Popup } from "@/layouts/Body/Popup";
import { DividerH } from "@/components/Divider/Divider";

interface Props {
  id: string,
}

type MemoizedDatePickerProps = {
  value: Dayjs | null;
  onChange: (date: Dayjs | Date | null) => void;
  disabled: boolean;
};

const MemoizedDatePicker = memo(({ value, onChange, disabled }: MemoizedDatePickerProps) => {

  const handleChange: DatePickerProps["onChange"] = (date) => {
    onChange(date);
  };

  return (
    <CustomDatePicker
      size="small"
      suffixIcon={null}
      allowClear={false}
      value={value}
      onChange={(date, dateString) => handleChange(date as Dayjs, dateString)}
      style={{ marginBottom: 8, display: "block" }}
      disabled={disabled}
    />
  );
});

// 함수형 컴포넌트로 작성된 projcet 페이지
const Project: React.FC<Props> = ({
  id,
}) => {
  const router = useRouter();
  // const { id } = router.query;
  const { showToast, ToastContainer } = useToast();
    
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const [processOpen, setProcessOpen] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string | null>(null);

  // ------------ 세부 데이터 세팅 ------------ 시작
  const [basicDate, setBasicDate] = useState<Date>(new Date());
  const [detailDataLoading, setDetailDataLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<wkPlanWaitType>({});

  const [progDateHint, setProgDateHint] = useState<{[key: string]: boolean}>({});
  const progDateRefObj = useRef<{[key: string]: any}>({});

  const { data:queryDetailData, isLoading, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['worksheet/wait-for-production-plan/jsxcrud/one/'],
    queryFn: async () => {
      setDetailDataLoading(true);
      
      const result = await getAPI({
        type: 'core-d2', 
        utype: 'tenant/',
        url: `worksheet/wait-for-production-plan/jsxcrud/one/${id}`
      });
      return result;
    },
    enabled: !!id,
  });

  useEffect(()=>{
    if(!isLoading && queryDetailData?.resultCode === "OK_0000") {
      setDetailData(queryDetailData.data.data as wkPlanWaitType);
      setDetailDataLoading(false);
    }
  }, [queryDetailData]);
  // ------------ 세부 데이터 세팅 ------------ 끝

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
      });

      if (result.resultCode === 'OK_0000') {
        const arr = result.data?.data?.map((item: any) => ({
          empId: item.id,
          name: item.name,
          jobType: item?.detail?.defMetaDataJobType,
          workType: item?.detail?.defMetaDataWorkType,
          empTit: item?.detail?.empTit,
          empRemarks: item?.detail?.empRemarks,
        }));
        setProjectWorkers(arr)
      } else {
        console.log('error:', result.response);
      }

      return result;
    },
  });

  const [schedules, setSchedules] = useState<projectSchedules>([]);
  const [procDateObj, setProcDateObj] = useState<{[key: string]: {from: string, to: string}}>({});
  const [workerPlanList, setWorkerPlanList] = useState<any[]>([]);
  const { data:queryData, refetch:pmsRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ['pms', 'proc', 'worksheet', id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d3',
        utype: 'tenant/',
        url: `pms/proc/default/many/${id}`
      });

      if (result.resultCode === 'OK_0000') {
        let wsExpDts:(string | null)[] = [];
        let dateObj: {[key: string]: {from: string, to: string}} = {};
        let arr = await Promise.all(
          result.data?.data?.map(async (item: any) => {
            const tasks = await Promise.all(
              item.process.map(async (task: any) => {
                wsExpDts.push(task.wkProcStDtm);

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
                  workDetail: worker.emp?.workDetail
                }));
                dateObj[task.id] = {from: task.wkProcStDtm, to: task.wkProcEdDtm}
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
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", arr);
        // updateWsExpDt(wsExpDts);
        setSchedules(arr);
        setProcDateObj(dateObj);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
  });

  // 생산 예정일 자동 입력
  async function updateWsExpDt(dts:(string | null)[]) {
    const validDates = dts
      .filter((dt): dt is string => !!dt && dt.trim() !== "")
      .map((dt) => new Date(dt));
  
    if (validDates.length === 0) {
      console.log("유효한 날짜 없음");
      return;
    }
  
    const earliest = new Date(
      Math.min(...validDates.map((date) => date.getTime()))
    );
  
    console.log("가장 빠른 날짜:", earliest.toISOString().split("T")[0]);

    if(earliest.toISOString().split("T")[0]) {
      await postAPI({
        type: 'core-d2', 
        utype: 'tenant/',
        jsx: 'default',
        url: `worksheet/wait-for-production-plan/default/update-production-plan-start-date`,
        etc: true,
      }, {
        worksheetId: id,
        wsExpDt: earliest.toISOString().split("T")[0],
      });
      console.log(id, earliest.toISOString().split("T")[0]);
    }
  }
  
  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"cf" | "error" | "">("");
  const [resultMsg, setResultMsg] = useState<string>("");

  async function submitConfirm() {
    const result = await postAPI({
      type: 'core-d2', 
      utype: 'tenant/',
      jsx: 'default',
      url: `worksheet/wait-for-production-plan/default/update-production-plans`,
      etc: true,
    }, {
      worksheetId: id,
      isPlanDtFixed: true,
      isWorkPlanFixed: true
    });

    if(result.resultCode === 'OK_0000') {
      setResultType('cf');
      setResultOpen(true);
    } else {
      const msg = result?.response?.data?.message;
      setResultType("error");
      setResultMsg(msg);
      setResultOpen(true);
    }
  }
 
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
  console.log(data)
  if(workerPlanList.find((item) => item.empId === data.empId)) {
    setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId !== data.empId ? item : {...item, delYn: true}))
  } else {
    setWorkerPlanList((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
  }
}

  async function changeProgDate(taskId: string, from:string,  e: React.FocusEvent<HTMLInputElement>) {
    if(e.target.value == ""){
      progDateRefObj.current[taskId].input.value = "1"
      return;
    }
    console.log(e.target.value)
    console.log(schedules.flatMap(process => process.task));

    if(!from){
      showToast("시작일을 먼저 입력해야 합니다.", "error");
      return;
    }
    const keys = Object.keys(progDateRefObj.current);
    const currentIndex = keys.indexOf(taskId);
    const nextIndex = currentIndex + 1;
    const nextId = keys[nextIndex];
    const nextTask = procDateObj[nextId];
          

    const dayCnt = e.target.value;
    const day = Number(dayCnt);
    const startDate = from;
    const id = taskId;

    const endDate = dayjs(startDate).add(day-1, 'day').format('YYYY-MM-DD');
    console.log(day, startDate, endDate);

    const data = {startDate, endDate}
    const result = await patchAPI({
      type: 'core-d3', 
      utype: 'tenant/',
      jsx: 'default',
      url: `pms/proc/default/update-date/${id}`,
      etc: true,
    },id, data);
    console.log(result);

    if(result.resultCode === 'OK_0000') {
      pmsRefetch().then(() => {
        showToast("저장완료", "success");
        if(!!nextId && !nextTask?.from){
          const nextStartDate = dayjs(data?.endDate).add(1, 'day').format('YYYY-MM-DD');
          setProcDateObj(prev => ({...prev, [nextId]: {...prev[nextId], from: nextStartDate}})) 
        }
        progDateRefObj.current[nextId]?.input.focus();
      });
    } else {
      const msg = result?.response?.data?.message;
      setResultType("error");
      setResultMsg(msg);
      setResultOpen(true);
    }

  }
  async function changeDate(date: any, id: string, type: string, otherDate: any) {
    const newDate = dayjs(date).format('YYYY-MM-DD')
    console.log(otherDate)
    if(otherDate){
      let data:{startDate:string, endDate:string} = { startDate: "", endDate: "" }
      if(type === "from") {
        data = {startDate: newDate, endDate: otherDate}
        // const to = schedules.flatMap(process => process.task).find(task => task.id === id)?.to;
        if (otherDate && dayjs(newDate).startOf('day').isAfter(dayjs(otherDate).startOf('day'))) {
          showToast("시작일은 종료일보다 이전이어야 합니다.", "error");
          return;
        }
      } else {
        data = {startDate: otherDate, endDate: newDate}
        console.log(data);
        // const from = schedules.flatMap(process => process.task).find(task => task.id === id)?.from;
        if (otherDate && dayjs(newDate).startOf('day').isBefore(dayjs(otherDate).startOf('day'))) {
          showToast("종료일은 시작일보다 이후이어야 합니다.", "error");
          return;
        }
      }
  
      const result = await patchAPI({
        type: 'core-d3', 
        utype: 'tenant/',
        jsx: 'default',
        url: `pms/proc/default/update-date/${id}`,
        etc: true,
      },id, data);
      console.log(result);
  
      if(result.resultCode === 'OK_0000') {
        pmsRefetch().then(() => {
          showToast("저장완료", "success");

          const keys = Object.keys(progDateRefObj.current);
          const currentIndex = keys.indexOf(id);
          const nextIndex = currentIndex + 1;
          const nextId = keys[nextIndex];
          const nextTask = procDateObj[nextId];
          if(!!nextId && !nextTask?.from){
            const nextStartDate = dayjs(data?.endDate).add(1, 'day').format('YYYY-MM-DD');
            setProcDateObj(prev => ({...prev, [nextId]: {...prev[nextId], from: nextStartDate}})) 
          }
        });

        
      } else {
        const msg = result?.response?.data?.message;
        setResultType("error");
        setResultMsg(msg);
        setResultOpen(true);
      }
    }
    setProcDateObj(prev => ({...prev, [id]: {...prev[id], [type]: newDate}}));

  }

  async function addWorkerPlan(workerPlanList: any[], procId: string | undefined) {
    console.log(workerPlanList)
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
    if(withoutId.filter((v:any) => !v?.delYn).length > 0){
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
  return(
    <div className="w-full overflow-auto h-[calc(100vh-140px)] pr-20">
      <section className="flex flex-col w-full h-full">
        <div className="flex gap-20 h-center pb-10 ">
          <p className="font-medium text-16 h-40 h-center gap-5">
            <span>{detailData.specModel?.partner?.prtNm}</span>
            <span>-</span>
            <span>{detailData.specModel?.prdNm}</span>
            <span>{"("}시작일 :
              { detailData?.orderProduct?.currPrdInfo ?
                JSON.parse(detailData?.orderProduct?.currPrdInfo).orderDt ?
                  dayjs(JSON.parse(detailData?.orderProduct?.currPrdInfo ?? "").orderDt).format("YYYY-MM-DD")
                  : "-"
                : "-"
              }
            </span>
            <span>납기일 : {detailData?.orderProduct?.orderPrdDueDt ? dayjs(detailData.orderProduct?.orderPrdDueDt).format("YYYY-MM-DD"): "-"}{")"}</span>
          </p>
          <div className="flex gap-10 h-center">
            <Button className="w-48 text-12" onClick={() => setBasicDate(new Date(basicDate.setMonth(basicDate.getMonth() - 1)))}>{"<< 달"}</Button>
            <Button className="w-48 text-12" onClick={() => setBasicDate(new Date(basicDate.setDate(basicDate.getDate() - 7)))}>{"< 주"}</Button>
            <span>{dayjs(basicDate).format("YYYY년 MM월 DD일")}</span>
            <Button className="w-48 text-12" onClick={() => setBasicDate(new Date(basicDate.setDate(basicDate.getDate() + 7)))}>{"주 >"}</Button>
            <Button className="w-48 text-12" onClick={() => setBasicDate(new Date(basicDate.setMonth(basicDate.getMonth() + 1)))}>{"달 >>"}</Button>
          </div>
        </div>

        <div className="flex rounded-14" style={{border:'1px solid #D9D9D9'}}>
          <div>
            <ProjectTable>
              <colgroup>
                <col width="57.2%" />
                <col width="6.8%" />
                <col width="18%" />
                <col width="18%" />
              </colgroup>
              <thead>
                <tr className="!h-55">
                  <th>공정</th>
                  <th>
                    <Tooltip title="진행일수를 입력하면 시작, 종료일이 자동 저장됩니다.">
                      <span>진행일수</span>
                    </Tooltip>
                  </th>
                  <th colSpan={2}>
                    <div className="flex items-center justify-center gap-30">
                      <span>시작일</span>
                      <RightArrow/>
                      <span>종료일</span>
                    </div>
                  </th>
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
                          <td className="flex flex-row justify-between items-center h-40 px-10 cursor-pointer hover:bg-[#0000000a]" onClick={() => task.from ? setBasicDate(new Date(task.from)) : false}>
                            <div className="flex items-center gap-20 " >
                              <div className="w-18 h-18 rounded-4" style={{backgroundColor: "#E9EDF5"}}>{index+1}</div>
                              <span className="text-left">{task.name}</span>
                            </div>
                            <div className="flex items-center gap-5">
                              <div className="w-36 h-20 rounded-4 text-center text-12" style={{border:'1px solid #D9D9D9', color:'#00000073'}}>{task?.progress ? task.progress : 0}%</div>
                              <div className="flex items-center w-36 h-20 rounded-4 px-5 text-12" style={{border:'1px solid #D9D9D9', color:'#00000073'}}><WorkerFill/>{task?.workers?.length || 0}</div>
                              <Dropdown trigger={["click"]} menu={{ items:[
                                ( detailData?.isWorkPlanFixed && detailData?.isPlanDtFixed) ? {
                                  label: <div className="h-center gap-5">
                                            <p className="w-16 h-16"><Load /></p>
                                            진행관리
                                          </div>,
                                  key: 0,
                                  onClick:()=>{setSelectId(task.id), setProcessOpen(true)}
                                } : null,
                                {
                                  label: <div className="h-center gap-5">
                                            <p className="w-16 h-16"><Reg /></p>
                                            발주등록
                                          </div>,
                                  key: 1,
                                  onClick:()=>{setSelectId(task.id), setOrderOpen(true)}
                                },
                                (!detailData?.isWorkPlanFixed && !detailData?.isPlanDtFixed) ? {
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
                                } : null,
                              ].filter((item): item is Exclude<typeof item, null> => item !== null)}}>
                                <Button type="text" className="!w-24 !h-24 cursor-pointer v-h-center !p-0">
                                  <p className="w-16 h-16"><Edit/></p>
                                </Button>
                              </Dropdown>
                            </div>
                          </td>
                          <td>
                            {/* <Tooltip title="진행일수를 입력하면 시작, 종료일이 자동 저장됩니다." open={progDateHint[task.id]} placement="top"> */}
                              <Input key={getDaysBetween(task.from, task.to)} defaultValue={task.from && task.to ? getDaysBetween(task.from, task.to) : ""} className="!border-0 !text-center"
                                ref={(el) => { progDateRefObj.current[task.id] = el; }}
                                onFocus={() => setProgDateHint(prev => ({...prev, [task.id] : true}))} 
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                onBlur={(e) => {setProgDateHint(prev => ({...prev, [task.id] : false})); changeProgDate(task.id, procDateObj[task.id]?.from, e);}}/>
                            {/* </Tooltip> */}
                          </td>
                          <td colSpan={2}>
                            <div className="flex items-center gap-5">
                              <MemoizedDatePicker
                                value={procDateObj[task.id]?.from ? dayjs(procDateObj[task.id]?.from) : null} 
                                onChange={(date) => changeDate(date, task.id, "from", procDateObj[task.id]?.to)} 
                                disabled={(detailData?.isWorkPlanFixed && detailData?.isPlanDtFixed) ? true : false}/>
                              <p className="w-32 flex justify-center"><RightArrow/></p>
                              <MemoizedDatePicker //<Calendar/>
                                value={procDateObj[task.id]?.to ? dayjs(procDateObj[task.id]?.to) : null} 
                                onChange={(date) => changeDate(date, task.id, "to", procDateObj[task.id]?.from)} 
                                disabled={(detailData?.isWorkPlanFixed && detailData?.isPlanDtFixed) ? true : false}/>
                            </div>
                          </td>
                          
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
                            <td>{worker.workPlanStart && worker.workPlanEnd ? getDaysBetween(worker.workPlanStart, worker.workPlanEnd) : ""}</td>
                            <td colSpan={2}>
                              <div className="flex items-center gap-5">
                                <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                                  value={dayjs(worker.workPlanStart).isValid() ? dayjs(worker.workPlanStart) : null} 
                                  open={false} disabled={(detailData?.isWorkPlanFixed && detailData?.isPlanDtFixed) ? true : false}/>
                                <p className="w-32 flex justify-center"><RightArrow/></p>
                                <CustomDatePicker size="small" suffixIcon={null} allowClear={false} 
                                  value={dayjs(worker.workPlanEnd).isValid() ? dayjs(worker.workPlanEnd) : null} 
                                open={false} disabled={(detailData?.isWorkPlanFixed && detailData?.isPlanDtFixed) ? true : false}/>
                              </div>
                            </td>
                            
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </ProjectTable>
          </div>
          <GanttChart schedules={schedules} basicDate={basicDate}/>
        </div>
        {(!detailData?.isWorkPlanFixed && !detailData?.isPlanDtFixed) && (
          <div className="w-full flex justify-end p-20">
            <Button
              className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={()=>{
                submitConfirm();
              }}
            >
              <Arrow /> 확정 저장
            </Button>
          </div>
        )}
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
                  if(workerPlanList.some((item) => {
                    if(item?.delYn) return false;
                    else if(!item?.workPlanStart || !item?.workPlanEnd) return true;
                    else return false;
                  })) {
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
                      <div className="w-40 h-25 bg-[#D8BFD8] flex justify-center items-center text-12" style={{color:'#800080'}}>{workerData?.jobType}</div>
                      <span className="w-54 text-center">{workerData?.workType}</span>
                      <span className="w-40 text-center">{workerData?.name}</span>
                      <span className="w-54 text-center">{workerData?.empTit}</span>
                      <span className="w-[128px] text-center">{workerData?.empRemarks}</span>
                      <div className="flex items-center gap-3 w-[230px] py-5 px-2 border border-[#D9D9D9]">
                        <CustomDatePicker style={{fontSize:'12px'}} size="small" suffixIcon={null} allowClear={false} 
                          value={worker.workPlanStart ? dayjs(worker.workPlanStart) : null} 
                          onChange={(date: any) => setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId === worker.empId ? {...item, workPlanStart: dayjs(date).format("YYYY-MM-DD")} : item))} />
                        <p className="w-32 flex justify-center"><RightArrow/></p>
                        <CustomDatePicker style={{fontSize:'12px'}} size="small" suffixIcon={null} allowClear={false} 
                          value={worker.workPlanEnd ? dayjs(worker.workPlanEnd) : null} 
                          onChange={(date: any) => setWorkerPlanList((prev:any[]) => prev.map((item) => item?.empId === worker.empId ? {...item, workPlanEnd: dayjs(date).format("YYYY-MM-DD")} : item))} />
                      </div>
                      <Dropdown trigger={["click"]} menu={{ items:[
                        // {
                        //   label: <div className="h-center gap-5">
                        //             <p className="w-16 h-16"><SmallCalendar /></p>투입일 추가
                        //           </div>,
                        //   key: 0,
                        //   onClick:()=>{}
                        // },
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
                    render:(value, record) => (<Checkbox checked={workerPlanList.find((item) => (item.empId === record.empId && !item?.delYn )) ? true : false} onChange={()=>addPopWorkers(record)} />)
                  },
                  { title: '업무구분', width:80, dataIndex: 'jobType', key: 'jobType', align: 'center' },
                  { title: '근무형태', width:80, dataIndex: 'workType', key: 'workType', align: 'center'},
                  { title: '이름', width:75, dataIndex: 'name', key: 'name', align: 'center'},
                  { title: '직함', width:75, dataIndex: 'empTit', key: 'empTit', align: 'center'},
                  { title: '특이사항', width:250, dataIndex: 'empRemarks', key: 'empRemarks'},
                ]}
                data={projectWorkers}
                styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px'}}
              />
          </section>
        </AntdDrawer>
        <ToastContainer />

        <AntdAlertModal
          open={resultOpen}
          setOpen={setResultOpen}
          title={
            resultType === "cf"? "확정 완료" :
            resultType === "error"? "요청 실패" :
            ""
          }
          contents={
            resultType === "cf" ? <div className="h-40">확정에 성공하였습니다.</div> :
            resultType === "error" ? <div className="h-40">{resultMsg}</div> :
            <div className="h-40"></div>
          }
          type={
            resultType === "cf" ? "success" :
            resultType === "error" ? "error" :
            "success"
          }
          onOk={()=>{
            setResultOpen(false);
            if(resultType === "cf") {
              router.push('/wk/plan/wait');
            }
          }}
          onCancel={()=>{
            setResultOpen(false);
          }}
          hideCancel={true}
          okText={
            resultType === "cf" ? "목록으로 이동" :
            resultType === "error" ? "확인" :
            "목록으로 이동"
          }
          cancelText={""}
        />
      </section>
    </div>
  )
}


export default Project;

const ProjectTable = styled.table`
  min-width: 500px;
  width: 540px;
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
  margin: 0 !important;
  .ant-picker-input {
    & > input{
      text-align: center;
      font-size: 14px;
    }
  }
`