import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { getCulChkList } from "@/utils/culChk";
import { useQuery } from "@tanstack/react-query";
import { Tree } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

const getDeptNteam = async () => {
  return await axios.get(`http://1.234.23.160:3301/pcb/dept/list/with/sub`);
}

const getSecomData = async (date:Dayjs, dept?:number) => {
  let dt = dayjs(date).format('YYYY-MM').toString();
  console.log(dt, dept);
  if(!dept) return await axios.get(`http://1.234.23.160:3301/pcb/secom/list/${dt}`);
  return await axios.get(`http://1.234.23.160:3301/pcb/secom/list/${dt}${dept}`)
}

const AtdSecomPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [ selDate, setSelDate ] = useState<Dayjs>(dayjs)
  const [ selDept, setSelDept ] = useState<number>()
  const [ last, setLast ] = useState<number>();
  useEffect(()=>{
    const year = Number(selDate.format('YYYY'));
    const mon = Number(selDate.format('MM'));
    setLast(new Date(year, mon, 0).getDate());
  }, [selDate])

  //공휴일 체크
  const {isLoading:culLoading, data:culData} = useQuery({
    queryKey: ['culChk', selDate],
    queryFn: async () => getCulChkList(selDate)
  });
  const [culList, setCulList] = useState<string[]>([]);
  useEffect(()=>{
    if(!culLoading){
      const data = culData?.data?.response?.body?.items;
      let arr = [];
      //값이 1개일 때는 배열이 아닌 객체 형태로 반환하므로 객체인지 아닌지 length로 파악
      if(data === '')               arr = [];
      else if(data?.item?.length)   arr = [...data?.item];
      else                          arr.push(data?.item);
      let days:string[] = [];
      arr.map(d=>{days.push(String(d?.locdate).slice(-2))});
      setCulList(days);
    }
  },[culData])

  const {isLoading, data} = useQuery({
    queryKey: ['secom', selDate, selDept],
    queryFn: async () => getSecomData(selDate, selDept)
  });

  const [team, setTeam] = useState<any[]>([]);
  const {isLoading:hrLoading, data:hrData} = useQuery({
    queryKey: ['deptNteam'],
    queryFn: async () => getDeptNteam()
  });
  useEffect(()=>{
    if(!hrLoading) {
      let teamArr:any[] = [];
      hrData?.data?.resultData?.map((d:any) => {
        d?.teams?.map((t:any) => {
          teamArr.push({id:t.id, deptId:d.id, teamNm:t.teamNm, label:t.teamNm, mainId:d.id});
        })
      });
      setTeam(teamArr);
    }
  }, [hrData])

  const [ secoms, setSecoms ] = useState([])
  const [ dataLoading, setDataLoading ] = useState(false)
  useEffect(()=>{
    setDataLoading(true)
    if(!isLoading) {
      const arr = data?.data?.resultData?.map((d:any)=>({...d,name:d.name===''?'0':d.name}))
      setSecoms(arr.filter((f:any)=>f.name!=='0'))
      setDataLoading(false)
    }
  }, [data])

  useEffect(()=>{console.log(secoms, data, team);},[secoms, data, team]);

  return (
    <>
      <div className="w-1/3 ">
        <Tree>

        </Tree>
      </div>
      <div className="w-2/3 ">

      </div>
    </>
  )
};

AtdSecomPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="근태"
  >{page}</MainPageLayout>
);

export default AtdSecomPage;

