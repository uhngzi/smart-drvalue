import FullChip from "@/components/Chip/FullChip";
import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/Table/AntdTable";
import AddOrderContents from "@/contents/sales/user/modal/\bAddOrderContents";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { TableProps } from "antd";
import { useState } from "react";

const sampleCl = (setOpen: React.Dispatch<React.SetStateAction<boolean>>): TableProps['columns'] => [
  {
    title: '번호',
    width: 50,
    dataIndex: 'idx',
    key: 'idx',
    align: 'center',
  },
  {
    title: '관리 No',
    width: 130,
    dataIndex: 'no',
    align: 'center',
    key: 'no',
  },
  {
    title: '업체명/코드',
    width: 130,
    dataIndex: 'no',
    align: 'center',
    key: 'cuName',
  },
  {
    title: '고객요구(발주)명',
    dataIndex: 'orderName',
    align: 'center',
    key: 'orderName',
  },
  {
    title: '업체담당',
    width: 80,
    dataIndex: 'mngName',
    align: 'center',
    key: 'mngName',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hotYn',
    align: 'center',
    key: 'hotYn',
    render: (value) => (
      <div className="v-h-center">{
        value==="super"?
        <FullChip label="초긴급" state="super"/>:
        value==="hot"?
        <FullChip label="긴급" state="primary"/>:
        <FullChip label="일반" />
      }</div>
    )
  },
  {
    title: '구분',
    width: 80,
    dataIndex: 'state',
    align: 'center',
    key: 'state',
    render: (value) => (
      <div className="v-h-center">{
        value==="re"?
        <FullChip label="반복" state="re"/>:
        value==="edit"?
        <FullChip label="수정" state="warning"/>:
        <FullChip label="신규" />
      }</div>
    )
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'thic',
    align: 'center',
    key: 'thic',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'layer',
    align: 'center',
    key: 'layer',
  },
  {
    title: '영업담당',
    width: 80,
    dataIndex: 'saleMng',
    align: 'center',
    key: 'saleMng',
  },
  {
    title: '발주(요구) 접수일',
    width: 120,
    dataIndex: 'orderDt',
    align: 'center',
    key: 'otderDt',
  },
  {
    title: '발주일',
    width: 120,
    dataIndex: 'submitDt',
    align: 'center',
    key: 'submitDt',
  },
  {
    title: '모델 등록',
    width: 100,
    dataIndex: 'model',
    align: 'center',
    key: 'model',
    render: (value) => (
      <div className="v-h-center">{
        value===3?
        <FullChip label="완료"/>:
        value===2?
        <FullChip label="등록중" state="re" click={()=>setOpen(true)}/>:
        <FullChip label="대기" state="warning" click={()=>setOpen(true)}/>
      }</div>
    )
  },
]
const sampleDt = [
  {
    key:4,
    idx:4,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hotYn:'super',
    state:'re',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:'등록',
  },
  {
    key:3,
    idx:3,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hotYn:'hot',
    state:'edit',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:3,
  },
  {
    key:2,
    idx:2,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hotYn:'N',
    state:'new',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:2,
  },
  {
    key:1,
    idx:1,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hotYn:'N',
    state:'new',
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
        columns={sampleCl(setOpen)}
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