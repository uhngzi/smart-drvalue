import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";
import SettingSider from "../Sider/SettingSider";
import SettingContents from "../Body/SettingContents";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle?: string;

  writeButtonHref?: string;
}

const SettingPageLayout: React.FC<Props> = ({ children, menu, menuTitle }) => {
  const router = useRouter();

  const [ collapsed, setCollapsed ] = useState<boolean>(true);
  const [ width, setWidth ] = useState<number>(240);
  useEffect(()=>{
    if(collapsed) setWidth(80);
    else          setWidth(240);
  }, [collapsed])

  return (
    <div className="w-full bg-[#EEEEEE] v-h-center">
      <div className="flex w-[1355px]">
        <div>
          <SettingSider />
        </div>

        <div className='flex flex-col bg-white' 
          style={{
            width:`calc(100% - ${width}px)`
          }}
        >
          <div className="w-full h-[100vh] overflow-auto">
            {menu && (
              <div className="w-full h-80 h-center px-15">
                <TabLarge
                  items={menu}
                  pathname={router.pathname}
                />
              </div>
            )}
            <SettingContents>{children}</SettingContents>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPageLayout;