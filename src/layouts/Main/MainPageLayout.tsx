import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";

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

  const [ collapsed, setCollapsed ] = useState<boolean>(false);
  const [ width, setWidth ] = useState<number>(240);
  useEffect(()=>{
    if(collapsed) setWidth(80);
    else          setWidth(240);
  }, [collapsed])

  return (
    <div className="flex">
      <div>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className='flex flex-col' 
        style={{
          width:`calc(100vw - ${width}px)`
        }}
      >
        <MainHeader title={menuTitle} />

        <div className="w-full h-[calc(100vh-80px)] bg-back overflow-auto">
          {menu && (
            <div className="w-full h-80 h-center px-15">
              {
                menu.map(m=>(
                  router.pathname===m.link?
                    <div className="w-fit px-30 py-10 border-b-3 border-b-point2 mr-10 text-16 text-point2">{m.text}</div> :
                    <div className="w-fit px-30 py-10 mr-10 text-16">
                      <Link href={m.link} className="text-[#718EBF]">{m.text}</Link>
                    </div>
                ))
              }
            </div>
          )}
          <Contents>{children}</Contents>
        </div>
      </div>
    </div>
  )
}

export default MainPageLayout;