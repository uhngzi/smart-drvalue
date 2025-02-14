import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";

import { TabLarge } from "@/components/Tab/Tabs";

import { loginCheck } from "@/utils/signUtil";
import { ModelProvider } from "@/data/context/ModelContext";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

  writeButtonHref?: string;
}

const ModelPageLayout: React.FC<Props> = ({ children, menu, menuTitle }) => {
  const router = useRouter();

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      router.push('/sign/in');
    }
  });

  const [ collapsed, setCollapsed ] = useState<boolean>(false);
  const [ width, setWidth ] = useState<number>(240);
  useEffect(()=>{
    if(collapsed) setWidth(80);
    else          setWidth(240);
  }, [collapsed])
  

  return (
    <div className="flex" key="mainPageLayout">
      <ModelProvider>
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
          <Contents padding="10px 30px 20px 30px">
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
      </ModelProvider>
    </div>
  )
}

export default ModelPageLayout;