import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/Table/AntdTable";
import AddOrderContents from "@/contents/sales/user/modal/\bAddOrderContents";
import { salesUserOrderClmn } from "@/data/columns/Sales";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { useState } from "react";

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

  return (
    <div className="flex flex-col bg-white p-30 rounded-14 gap-20">
      <div className="">총 4건</div>
      <AntdTable
        columns={salesUserOrderClmn(setOpen)}
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