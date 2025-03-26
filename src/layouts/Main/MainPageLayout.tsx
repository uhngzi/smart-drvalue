import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import { useRouter } from "next/router";
import { TabLarge } from "@/components/Tab/Tabs";
import { loginCheck } from "@/utils/signUtil";
import dynamic from "next/dynamic";
import Close from "@/assets/svg/icons/s_close.svg";

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

  writeButtonHref?: string;
  bg?: string;
  pd?: string;

  modal?: boolean;
  head?: boolean;
}

const Sider = dynamic(() => import('../Sider/Sider'), { ssr: false });

const MainPageLayout: React.FC<Props> = ({ children, menu, menuTitle, bg, pd="10px 30px 20px 30px", modal, head }) => {
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
  
  // 1초 후 collapse 처리 (마운트 시 자동)
  // useEffect(() => {
  //   setCollapsed(false);
  //   const timer = setTimeout(() => {
  //     setCollapsed(true);
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);
  
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
        { !modal && <>
          <MainHeader title={menuTitle} />
          
          <div className="w-full h-[calc(100vh-80px)] overflow-auto px-40">
            <Contents padding={pd} bg={bg} >
              {menu && (
                <TabLarge
                  items={menu}
                  pathname={router.pathname}
                />
              )}
              {children}
            </Contents>
          </div>
        </>}

        { head && modal && <div>
          <div className="p-30 flex v-between-h-center">
            <p className="text-20 fw-500 font-semibold">{menuTitle}</p>
            <p 
              className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
              onClick={(()=>router.back())}
            >
              <Close />
            </p>
          </div>
          <div className="w-full overflow-auto pl-30 pb-20">
            {children}
          </div>
        </div>}

        { !head && modal && <>
          <div className="w-full">
            {children}
          </div>
        </>}
      </div>
    </div>
  )
}

export default MainPageLayout;