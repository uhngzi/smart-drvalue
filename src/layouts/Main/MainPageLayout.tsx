import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";
import { Button, Dropdown, MenuProps, Pagination } from "antd";
import Image from "next/image";
import { MoreOutlined } from "@ant-design/icons";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"
import { loginCheck } from "@/utils/signUtil";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

  writeButtonHref?: string;
  bg?: string;
}

const MainPageLayout: React.FC<Props> = ({ children, menu, menuTitle, bg }) => {
  const router = useRouter();

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      router.push('/sign/in');
    }
  });
  
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('siderCollapsed');
      return stored === 'true';
    }
    return false;
  });
  
  // collapsed 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('siderCollapsed', collapsed.toString());
  }, [collapsed]);

  const [ width, setWidth ] = useState<number>(240);
  useEffect(()=>{
    if(collapsed) setWidth(80);
    else          setWidth(240);
  }, [collapsed])
  
  return (
    <div className="flex" key="mainPageLayout">
      <div>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className='flex flex-col gap-40 bg-back' 
        style={{
          width:`calc(100% - ${width}px)`
        }}
      >
        <MainHeader title={menuTitle} />

        <div className="w-full h-[calc(100vh-80px)] overflow-auto px-40">
          <Contents padding="10px 30px 20px 30px" bg={bg} >
            {menu && (
              <TabLarge
                items={menu}
                pathname={router.pathname}
              />
            )}
            {children}
          </Contents>
        </div>
      </div>
    </div>
  )
}

export default MainPageLayout;