import { useEffect, useState } from "react";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";

import Close from "@/assets/svg/icons/s_close.svg";
import { loginCheck } from "@/utils/signUtil";
import { BaseProvider } from "@/data/context/BaseContext";

interface Props {
  children : React.ReactNode;
  title: string;
  writeButtonHref?: string;
}

const PopRegLayout: React.FC<Props> = ({ children, title }) => {
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
      <BaseProvider>
      <div>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className='flex flex-col bg-back' 
        style={{
          width:`calc(100% - ${width}px)`
        }}
      >
        {/* <MainHeader title={menuTitle} /> */}
        <div className="p-30 flex v-between-h-center">
          <p className="text-20 fw-500 font-semibold">{title}</p>
          <p 
            className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
            onClick={(()=>router.back())}
          >
            <Close />
          </p>
        </div>
        <div className="w-full overflow-auto pl-20 pb-20">
          {children}
        </div>
      </div>
      </BaseProvider>
    </div>
  )
}

export default PopRegLayout;