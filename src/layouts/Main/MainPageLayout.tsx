import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

  writeButtonHref?: string;
}

const MainPageLayout: React.FC<Props> = ({ children, menu, menuTitle }) => {
  const router = useRouter();

  const [ collapsed, setCollapsed ] = useState<boolean>(true);
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

      <div className='flex flex-col' 
        style={{
          width:`calc(100% - ${width}px)`
        }}
      >
        <MainHeader title={menuTitle} />

        <div className="w-full h-[calc(100vh-80px)] bg-back overflow-auto">
          {menu && (
            <div className="w-full h-80 h-center px-15">
              <TabLarge
                items={menu}
                pathname={router.pathname}
              />
            </div>
          )}
          <Contents>{children}</Contents>
        </div>
      </div>
    </div>
  )
}

export default MainPageLayout;