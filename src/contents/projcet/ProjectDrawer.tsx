import { Button, Card, Checkbox, DatePicker, Divider, Drawer, Input } from "antd"
import styled, { css } from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import Plus from "@/assets/svg/icons/s_plus_gray.svg"
import Calendar from "@/assets/svg/icons/newcalendar.svg";

import { TabSmall } from "@/components/Tab/Tabs";
import { SetStateAction, useRef, useState } from "react";
import CardInputList from "@/components/List/CardInputList";
import AntdInput from "@/components/Input/AntdInput";
import AntdDragger from "@/components/Upload/AntdDragger";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdInputFill from "@/components/Input/AntdInputFill";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import useToast from "@/utils/useToast";
import { projectSchedules } from "@/data/type/base/project";
import dayjs from "dayjs";
import { postAPI } from "@/api/post";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";

const tabList = [
  { key: 1, text: '진행 관리' },
  { key: 2, text: '품질 관리' },
  { key: 3, text: '인력 투입 관리' },
]

interface Props {
  open: boolean;
  close: ()=>void;
  schedules: projectSchedules;
  setSchedules: React.Dispatch<SetStateAction<projectSchedules>>;
  refetch?: ()=>void;
  selectId?: string | null;
}

const ProjectDrawer: React.FC<Props> = ({
  open,
  close,
  schedules,
  setSchedules,
  refetch = () => {},
  selectId
}) => {
  const { showToast, ToastContainer } = useToast();

  const [selectKey, setSelectKey] = useState<number>(1);
  console.log(!!selectId, selectId)
  const [procDailyData, setProcDailyData] = useState<any[]>([]);
  const { isLoading: procDailyLoading, refetch: procDailyRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ['pms', 'proc', 'daily', selectId],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d3',
        utype: 'tenant/',
        url: `pms/daily/default/many/${selectId}`
      });

      if (result.resultCode === 'OK_0000') {
        setProcDailyData([{}, ...result?.data?.data]);
        result?.data?.data.map((daily:any) => {
          processData.current = {...processData.current, [daily.id]:{wkProcDailyDt: daily.wkProcDailyDt, wkProcDailyPer: daily.wkProcDailyPer}};
        })
      } else {
        console.log('error:', result.response);
      }

      return result.data;
    },
    enabled: !!selectId
  });

  // -------------------진행관리 변수, 함수들--------------------
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileIdList, setFileIdList] = useState<string[]>([]);
  const [memoText, setMemoText] = useState<string>('');
  const [memoList, setMemoList] = useState<{id: string|Number, status: string, text: string}[]>([]);
  const processData = useRef<any>({});

  const task = schedules.map(process => process.task).flat().find(task => task.id === selectId);
  
  function addMemo() {
    setMemoText('');
    setMemoList((prev:any) => [...prev, {id: prev.length, status:true, text:memoText}]);
  }
  function deleteMemo(id: string|Number) {
    setMemoList((prev:any) => prev.map((memo:any) => memo.id === id ? {...memo, status: 'delete'} : memo));
  }

  function onProcessDataChange(name:string, data: any, dailyId: string|undefined) {
    const id = dailyId ? dailyId : 'new';
    console.log(id)
    processData.current = {...processData.current, [id] : {...processData.current[id], [name]: data}};
  }
  // -----------------------------------------------------

  // -------------------품질관리 변수, 함수들--------------------
  const qualityData = useRef<any>({});
  // -----------------------------------------------------

  // -------------------인력투입 변수, 함수들--------------------
  const workerData = useRef<any>({});
  // -----------------------------------------------------

  async function processSubmit(dailyId: string|undefined) {
    const id = dailyId ? dailyId : 'new';
    console.log(processData.current[id]);
    if(selectKey === 1) {
      if(!processData.current[id].wkProcDailyDt || !processData.current[id].wkProcDailyPer) {
        showToast('진행률과 진행일을 입력해주세요.', 'error');
        return;
      }
      if(task && dayjs(processData.current[id].wkProcDailyDt).isBefore(dayjs(task.from))) {
        showToast('진행일은 시작일 이후로 입력해주세요.', 'error');
        return;
      }
      // const newSchedules = schedules.map(process => {
      //   return {
      //     ...process,
      //     task: process.task.map(task => {
      //       console.log(task.id, selectId)
      //       if (task.id === selectId) {
      //         return { ...task, progTo: dayjs(processData.current.wkProcDailyDt).format("YYYY-MM-DD"), wkProcDailyPer: processData.current.wkProcDailyPer };
      //       }
      //       return task;
      //     }),
      //   };
      // });
      // showToast("저장되었습니다.", "success");
      // setSchedules(newSchedules);
      const data = {
        wkProcDailyPer: Number(processData.current[id].wkProcDailyPer/100),
        files: []
      };
      console.log(data)
      
      if(id === 'new') {
        const result = await postAPI({
          type: 'core-d3', 
          utype: 'tenant/',
          jsx: 'default',
          url: `pms/daily/default/create/${selectId}/${dayjs(processData.current[id].wkProcDailyDt).format("YYYY-MM-DD")}`,
          etc: true,
        }, data);
        console.log(result);
        if(result.resultCode === 'OK_0000') {
          showToast("저장되었습니다.", "success");
        } else {
          showToast("진행관리 등록중 문제가 발생했습니다..", "error");
          return;
        }
      }else{
        const result = await patchAPI({
          type: 'core-d3', 
          utype: 'tenant/',
          jsx: 'default',
          url: `pms/daily/default/update/${selectId}/${dayjs(processData.current[id].wkProcDailyDt).format("YYYY-MM-DD")}`,
          etc: true,
        },'', data);
        console.log(result);
        if(result.resultCode === 'OK_0000') {
          showToast("저장되었습니다.", "success");
        } else {
          showToast("진행관리 등록중 문제가 발생했습니다..", "error");
          return;
        }
      }

    } else if(selectKey === 2) {
      console.log('품질관리 저장');
    } else if(selectKey === 3) {
      console.log('인력투입 저장');
    }
  }
  
  function drawerClose(){
    setSelectKey(1);
    setFileList([]);
    setFileIdList([]);
    setMemoText('');
    setMemoList([]);
    procDailyRefetch();
    close();
  }
  return (
    <AntdDrawerStyled
      closeIcon={null}
      open={open}
      onClose={drawerClose}
      width={selectKey === 1 ? 600 : selectKey === 2 ? 800 : 400}
    >
      <section key={selectId} className="p-20 flex flex-col gap-20">
        <div className="flex justify-between items-center">
          <span className="text-16 font-medium" style={{color:'#000000D9'}}>도면설계 계획(진행) 관리</span>
          <div className="flex cursor-pointer" onClick={drawerClose}><Close/></div>
        </div>
        
          <div className="w-full flex gap-32 mb-[-20px]">
            {tabList.map((i, idx) => (
              <div key={idx} className="min-w-67 min-h-46 px-10 py-12 mr-10 text-14 text-center cursor-pointer"
                style={i.key ===selectKey ? {color:'#4880FF',borderBottom:'3px solid #4880FF'}:{}}
                onClick={()=>setSelectKey(i.key)}>{i.text}</div>
            ))}
          </div>
          {selectKey === 1 && procDailyData.map((daily, idx) => (
            <div className="flex flex-col gap-20" key={`procDaily${idx}`}>
              <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
                <section className="flex flex-col gap-20">
                  <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                    <div className="col-span-3">
                      <p className="pb-8">진행관리일</p>
                      <DatePicker 
                        defaultValue={daily?.wkProcDailyDt ? dayjs(daily.wkProcDailyDt) : ""} 
                        className="!w-full !rounded-0" 
                        suffixIcon={<Calendar/>} 
                        onChange={(date)=> onProcessDataChange("wkProcDailyDt", date, daily?.id)}
                        disabled={daily?.wkProcDailyDt ? true : false}
                      />
                    </div>
                    <div className="col-span-3">
                      <p className="pb-8">진행률</p>
                      <Input 
                        type="number" min={0} max={100} className="!rounded-0 py-5" 
                        defaultValue={String(daily?.wkProcDailyPer) ? (daily?.wkProcDailyPer*100).toFixed(0) : ""} onChange={({target})=> onProcessDataChange("wkProcDailyPer", target.value, daily?.id)}/>
                    </div>
                  </div>
                  <div className="flex flex-col gap-10">
                    <p className="text-14">첨부파일</p>
                    <div className="w-full h-[172px]">
                      <AntdDragger
                        fileList={fileList}
                        setFileList={setFileList}
                        fileIdList={fileIdList}
                        setFileIdList={setFileIdList}
                      />
                    </div>
                    <div style={{height:`${32*fileList.length}px`}}></div>
                  </div>
                  <div>
                    <div className="flex gap-10 v-between-h-center">
                      <AntdInput value={memoText} placeholder="메모를 작성해주세요" onChange={(e) => setMemoText(e.target.value)}/>
                      <Button type="text" className="!w-24 !h-24 !p-0" onClick={addMemo}><Plus/></Button>
                    </div>
                    {memoList.map((memo, idx) => (
                      <p key={idx} className="flex h-36 p-3 v-between-h-center">
                        <span className={`text-14 font-normal ${memo.status === "delete" ? "line-through text-[#00000073]" : ""}`}>{memo.text}</span>
                        <span className="cursor-pointer" onClick={() => deleteMemo(memo.id)}><Close/></span>
                      </p>
                    ))}
                  </div>
                </section>
              </CardInputList>
              <div className="flex justify-end"><Button type="primary" onClick={() => processSubmit(daily?.id)}>저장</Button></div>
              <Divider style={{margin:0}}/>
            </div>
          ))}
          {selectKey === 2 && (
            <div className="flex flex-col gap-20">
              <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
                <section className="flex flex-col gap-20">
                  <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                    <div className="col-span-2">
                      <p className="pb-8">품질관리일</p>
                      <DatePicker className="!w-full !rounded-0" suffixIcon={<Calendar/>}/>
                    </div>
                  </div>
                  <AntdTableEdit
                    columns={[
                      {
                        title: '불량여부',
                        width:84,
                        dataIndex: 'errorYn',
                        key: 'errorYn',
                        align: 'center',
                        render:() => (
                          <Checkbox/>
                        )
                      },
                      {
                        title: '불량 항목',
                        width:87,
                        dataIndex: 'errorCode',
                        key: 'prdRevNo',
                        align: 'center',
                      },
                      {
                        title: '불량 내용',
                        width:200,
                        dataIndex: 'errorText',
                        key: 'errorText',
                        align: 'center',
                      },
                      {
                        title: '수량',
                        width:82,
                        dataIndex: 'amount',
                        key: 'amount',
                        align: 'center',
                        render: (value) => (
                          <div className="w-full h-full v-h-center">
                            <AntdInputFill value={value} onChange={(e) => {}} placeholder="수량"/>
                          </div>
                        )
                      },
                      {
                        title: '불량 상태',
                        width:248,
                        dataIndex: 'errorsts',
                        key: 'errorsts',
                        align: 'center',
                        render: (value, record) => (
                          <div className="w-full h-full v-h-center">
                            <AntdInputFill value={value} onChange={(e) => {}} placeholder="example"/>
                          </div>
                        )
                      },
                    ]}
                    data={[]}
                    styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
                  />
                </section>
              </CardInputList>
              <div className="flex justify-end"><Button type="primary" onClick={() => processSubmit(undefined)}>저장</Button></div>
            </div>
          )}
          {selectKey === 3 && (
            <div className="flex flex-col gap-20">
              <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
                <section className="flex flex-col gap-20">
                  <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                    <div className="col-span-3">
                      <p className="pb-8">인력 투입일</p>
                      <DatePicker className="!w-full !rounded-0" suffixIcon={<Calendar/>}/>
                    </div>
                  </div>
                  <AntdTableEdit
                    columns={[
                      {
                        title: '근로자',
                        width:84,
                        dataIndex: 'worker',
                        key: 'worker',
                        align: 'center',
                        
                      },
                      {
                        title: '오전',
                        width:58,
                        dataIndex: 'am',
                        key: 'am',
                        align: 'center',
                        render:() => (
                          <Checkbox/>
                        )
                      },
                      {
                        title: '오후',
                        width:58,
                        dataIndex: 'pm',
                        key: 'pm',
                        align: 'center',
                        render:() => (
                          <Checkbox/>
                        )
                      },
                      {
                        title: '야간',
                        width:58,
                        dataIndex: 'night',
                        key: 'night',
                        align: 'center',
                        render:() => (
                          <Checkbox/>
                        )
                      },
                      {
                        title: '철야',
                        width:58,
                        dataIndex: 'allnight',
                        key: 'allnight',
                        align: 'center',
                        render:() => (
                          <Checkbox/>
                        )
                      },
                    ]}
                    data={[{worker: "홍길동"}, {worker: "김아무개"}]}
                    styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
                  />
                </section>
              </CardInputList>
              <div className="flex justify-end"><Button type="primary" onClick={() => processSubmit(undefined)}>저장</Button></div>
            </div>
          )}
        
      </section>
      <ToastContainer/>
    </AntdDrawerStyled>
  )
}

const AntdDrawerStyled = styled(Drawer)`
  box-shadow: ${({ style }) =>
    style?.boxShadow ||
    `-6px 0 16px 0 rgba(0, 0, 0, 0.08),
     -3px 0 6px -4px rgba(0, 0, 0, 0.12), 
     -9px 0 28px 8px rgba(0, 0, 0, 0.05)`};

  .ant-drawer-body {
    padding:0;
    ${({ style }) =>
      style &&
      css`
        background-color: ${style.backgroundColor};
      `}
  }
`

export default ProjectDrawer;