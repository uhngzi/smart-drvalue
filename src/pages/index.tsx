import { TabLarge } from "@/components/Tab/Tabs";
import HomeBoard from "@/contents/home/HomeBoard";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import { Empty } from "antd";

const HomePage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"mytodo" | "alarm" | "board" | "">("board");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full h-full">
      <div className="w-full flex h-50 z-10 relative">
        {/* <div 
          className="flex items-center w-fit px-20 py-10 mr-10 text-14 font-medium cursor-pointer"
          style={tab==="mytodo"?{color:'#4880FF',borderBottom:'3px solid #4880FF'}:{color:"#718EBF"}}
          onClick={()=>setTab("mytodo")}
        >
          <span>나의할일</span>
        </div>
        <div 
          className="flex items-center w-fit px-20 py-10 mr-10 text-14 font-medium cursor-pointer"
          style={tab==="alarm"?{color:'#4880FF',borderBottom:'3px solid #4880FF'}:{color:"#718EBF"}}
          onClick={()=>setTab("alarm")}
        >
          <span>알림</span>
        </div> */}
        <div 
          className="flex items-center w-fit px-20 py-10 mr-10 text-14 font-medium cursor-pointer"
          style={tab==="board"?{color:'#4880FF',borderBottom:'3px solid #4880FF'}:{color:"#718EBF"}}
          onClick={()=>setTab("board")}
        >
          <span>공지사항</span>
        </div>

        <div className="flex-1 h-center justify-end">
          <div
            className="w-80 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer gap-4"
            onClick={()=>{
              if(tab==="board") {
                setOpen(true);
              }
            }}
          >
            <SplusIcon stroke="#FFF"className="w-16 h-16"/>
            <span>신규</span>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        {
          tab === "mytodo" ? 
          <Empty />
          :
          tab === "alarm" ? 
          <Empty />
          :
          tab === "board" ?
          <HomeBoard open={open} setOpen={setOpen}/>
          :
          <Empty />
        }
      </div>
    </div>
  )
}

HomePage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="홈 피드"
  >
    {page}
  </MainPageLayout>
);

export default HomePage;