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
import Close from "@/assets/svg/icons/s_close.svg";

interface Props {
  children : React.ReactNode;
  title: string;
  writeButtonHref?: string;
}

const items: MenuProps['items'] = [
  {
    label: <span className="text-12">Excel</span>,
    key: '1',
    icon: <Image src={Excel} alt="Excel" width={16} height={16} />,
  },
  {
    label: <span className="text-12">Print</span>,
    key: '2',
    icon: <Image src={Print} alt="Print" width={16} height={16} />,
  },
]

const menuProps = {
  items,
  // onClick: handleMenuClick,
};

const PopRegLayout: React.FC<Props> = ({ children, title }) => {
  const router = useRouter();

  const [ collapsed, setCollapsed ] = useState<boolean>(false);
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
        <div className="w-full overflow-auto px-20 pb-20">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PopRegLayout;