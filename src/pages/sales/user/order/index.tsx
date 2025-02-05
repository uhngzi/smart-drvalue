import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/List/AntdTable";
import AddOrderContents from "@/contents/sales/user/modal/\bAddOrderContents";
import { salesUserOrderClmn } from "@/data/columns/Sales";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";
import { salesOrderRType } from "@/data/type/sales/order";
import AntdDrawer from "@/components/Drawer/AntdDrawer";

const sampleDt = [
  {
    key:4,
    index:4,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hot:1,
    state:2,
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:'등록',
  },
  {
    key:3,
    index:3,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hot:2,
    state:3,
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:3,
  },
  {
    key:2,
    index:2,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hot:3,
    state:1,
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:2,
  },
  {
    key:1,
    index:1,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hot:2,
    state:2,
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:1,
  },
]

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);

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

  return (
    <div className="flex flex-col bg-white p-30 rounded-14 gap-20">
      <div className="v-between-h-center">
        <p>총 4건</p>
        <div 
          className="w-60 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer"
          onClick={()=>{setOpen(true);}}
        >
          신규
        </div>
      </div>

      <AntdTable
        columns={salesUserOrderClmn(setOpen)}
        data={data}
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