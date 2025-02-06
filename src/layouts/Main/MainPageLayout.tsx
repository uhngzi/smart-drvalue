import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import { Button, Dropdown, MenuProps, Pagination } from "antd";
import Image from "next/image";
import { MoreOutlined } from "@ant-design/icons";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"

interface Props {
  children : React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

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

const MainPageLayout: React.FC<Props> = ({ children, menu, menuTitle }) => {
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

      <div className='flex flex-col gap-40 bg-back' 
        style={{
          width:`calc(100% - ${width}px)`
        }}
      >
        <MainHeader title={menuTitle} />

        <div className="w-full h-[calc(100vh-80px)] overflow-auto px-40">
          <Contents padding="10px 30px 20px 30px">
            {menu && (
              <div className="flex w-full h-center" style={{borderBottom:'1px solid #D9D9D9'}}>
                <TabLarge
                  items={menu}
                  pathname={router.pathname}
                />
                <div 
                  className="w-80 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer flex gap-4"
                  // onClick={()=>{setOpen(true);}}
                >
                  <SplusIcon stroke="#FFF"className="w-16 h-16"/>
                  <span>신규</span>
                </div>
              </div>
            )}
            <div className="flex w-full h-50 gap-20 justify-end items-center">
              <span>총 4건</span>
              <Pagination size="small" defaultCurrent={1} total={50} />
              <Dropdown menu={menuProps} trigger={['click']} placement="bottomCenter" getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}>
                <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
              </Dropdown>
            </div>
            {children}
          </Contents>
        </div>
      </div>
    </div>
  )
}

export default MainPageLayout;