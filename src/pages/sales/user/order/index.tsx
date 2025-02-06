import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuProps } from "antd/lib";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Pagination } from "antd";
import { getAPI } from "@/api/get";

import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/List/AntdTable";
import AddOrderContents from "@/contents/sales/user/modal/AddOrderContents";
import AntdDrawer from "@/components/Drawer/AntdDrawer";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";


import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { salesOrderRType } from "@/data/type/sales/order";
import { salesUserOrderClmn } from "@/data/columns/Sales";

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

const sampleDt = [
  {
    key:4,
    id:4,
    index:4,
    prtNm:'아무개 거래처',
    prtCode:'C0001',
    orderNm:'SWEDF 모델 재생산 100PCS',
    modelCnt: 10,
    prtMngName:'아무개',
    hotGrade:1,
    prtMngNm:'홍길동',
    orderRepDt:'2024-12-01',
    orderDt:'2024-12-01',
    model:'등록',
  },
  {
    key:5,
    id:5,
    index:3,
    prtNm:'홍길동 거래처',
    prtCode:'C0002',
    orderNm:'XYZ 모델 재생산 50PCS',
    modelCnt: 5,
    prtMngName:'홍길동',
    hotGrade:2,
    prtMngNm:'이순신',
    orderRepDt:'2024-12-02',
    orderDt:'2024-12-02',
    model:'등록',
  },
  {
    key:6,
    id:6,
    index:2,
    prtNm:'이순신 거래처',
    prtCode:'C0003',
    orderNm:'ABC 모델 재생산 200PCS',
    modelCnt: 20,
    prtMngName:'이순신',
    hotGrade:3,
    prtMngNm:'강감찬',
    orderRepDt:'2024-12-03',
    orderDt:'2024-12-03',
    model:'등록',
  },
  {
    key:7,
    id:7,
    index:1,
    prtNm:'강감찬 거래처',
    prtCode:'C0004',
    orderNm:'DEF 모델 재생산 150PCS',
    modelCnt: 15,
    prtMngName:'강감찬',
    hotGrade:4,
    prtMngNm:'유관순',
    orderRepDt:'2024-12-04',
    orderDt:'2024-12-04',
    model:'등록',
  }
]

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ newOpen, setNewOpen ] = useState<boolean>(false);

  const [ data, setData ] = useState<Array<salesOrderRType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['salesUserPage'],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/jsxcrud/many'
      });
    }
  });

  useEffect(()=>{
    if(isLoading) {
      setData(queryData ?? []);
    }
  }, [queryData]);

  const menuProps = {
    items,
    // onClick: handleMenuClick,
  };

  return (
    <>
      <div className="w-full h-50 flex h-center justify-end px-60 pt-10 absolute top-0">
        <div className="w-80 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer flex gap-4 z-20">
          <SplusIcon stroke="#FFF"className="w-16 h-16"/>
          <span>신규</span>
        </div>
      </div>
      <div className="flex w-full h-50 gap-20 justify-end items-center">
        <span>총 4건</span>
        <Pagination size="small" defaultCurrent={1} total={50} />
        <Dropdown menu={menuProps} trigger={['click']} placement="bottomCenter" getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}>
          <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-20" style={{borderTop:' 1px solid rgba(0,0,0,6%)'}}>
        <AntdTable
          columns={salesUserOrderClmn(setOpen, setNewOpen)}
          data={sampleDt}
          styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
        />
        
        <AntdModal
          open={open}
          setOpen={setOpen}
          width={1288}
          title={"고객발주 등록"}
          contents={<AddOrderContents setOpen={setOpen} />}
        />

        <AntdDrawer
          open={drawerOpen}
          close={()=>{setDrawerOpen(false)}}
          maskClosable={false}
          mask={false}
        >
          <div>

          </div>
        </AntdDrawer>
      </div>
    </>
  )
};

SalesUserPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/user/order' },
      { text: '견적', link: '/sales/user/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserPage;