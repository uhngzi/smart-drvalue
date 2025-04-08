import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";
import SettingSider from "../Sider/SettingSider";
import SettingContents from "../Body/SettingContents";
import { loginCheck } from "@/utils/signUtil";

import Close from "@/assets/svg/icons/s_close.svg";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];
  styles?: {
    pd?: string
  }
  menuTitle?: string;

  writeButtonHref?: string;
}

const SettingPageLayout: React.FC<Props> = ({ children, styles, menu, menuTitle }) => {
  const router = useRouter();

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      router.push('/sign/in');
    }
  });

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
            <div className="w-full flex justify-end pr-50 pt-30">
              <p className="w-32 h-32 bg-white text-right rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
                onClick={()=>{
                  if(sessionStorage.getItem('prevUrl')?.includes("[type]")) {
                    router.push("/");
                  } else {
                    router.push(sessionStorage.getItem('prevUrl') || '/')}
                  }
                }
              >
                <Close />
              </p>
            </div>
            {menu && (
              <div className="w-full h-80 h-center px-15">
                <TabLarge
                  items={menu}
                  pathname={router.pathname}
                />
              </div>
            )}
            <SettingContents padding={styles?.pd}>{children}</SettingContents>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPageLayout;