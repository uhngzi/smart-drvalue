import PopupCancleButton from "@/components/Button/PopupCancleButton";
import PopupOkButton from "@/components/Button/PopupOkButton";
import FullChip from "@/components/Chip/FullChip";
import Description from "@/components/Description/Description";
import DescriptionItems from "@/components/Description/DescriptionItems";
import AntdInput from "@/components/Input/AntdInput";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdTable from "@/components/List/AntdTable";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import Edit from "@/assets/svg/icons/edit.svg"

import dynamic from "next/dynamic";
import { Button, Checkbox, TableProps } from "antd";
import { useState } from "react";
import AntdDragger from "@/components/Upload/AntdDragger";
import YieldCalculate from "@/contents/base/yield/YieldCalculate";

const QuillTextArea = dynamic(
  () => import('@/components/TextArea/QuillTextArea'),
  {
    ssr: false,
  },
);


const sampleCl = (setOpen: React.Dispatch<React.SetStateAction<boolean>>): TableProps['columns'] => [
  {
    title: <><Checkbox /></>,
    width: 50,
    dataIndex: 'checkbox',
    key: 'checkbox',
    align: 'center',
  },
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
        <FullChip label="초긴급" state="purple"/>:
        value==="hot"?
        <FullChip label="긴급" state="pink"/>:
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
        <FullChip label="반복" state="mint"/>:
        value==="edit"?
        <FullChip label="수정" state="yellow"/>:
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
        <FullChip label="등록중" state="mint" click={()=>setOpen(true)}/>:
        <FullChip label="대기" state="yellow"/>
      }</div>
    )
  },
]
const sampleDt = [
  {
    checkbox:<Checkbox />,
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
    checkbox:<Checkbox />,
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
    checkbox:<Checkbox />,
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
    checkbox:<Checkbox />,
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

const SalesUserEstimatePage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ value, setValue ] = useState<string>('');
  const [ textarea, setTextarea ] = useState<string>('');
  const [ length, setLength ] = useState<number>(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileIdList, setFileIdList] = useState<string[]>([]);

  const [yieldPopOpen, setYieldPopOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-20">
      <Button className="w-16" onClick={() => setYieldPopOpen(true)}>임시</Button>
      {/* <div className="">총 4건</div> */}
      <AntdTable
        columns={sampleCl(setOpen)}
        data={sampleDt}
        styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
      />
      <AntdModal 
        open={open}
        setOpen={setOpen}
        width={1250}
        title={"고객발주 등록"}
        contents={
          <div className="w-full">
            <div className="w-full flex">
              <div className="w-[65%] h-[550px] flex flex-col">
                <div className="border-1 border-line h-[450px] px-20 py-10">
                  <Description separatorColor="#e7e7ed">
                    <DescriptionItems title="고객">
                      <AntdSelect options={[{value:1, label:'고객1'}]} />
                    </DescriptionItems>
                    <DescriptionItems title="발주 제목">
                      <AntdInput value={value} onChange={(e)=>{setValue(e.target.value)}} className="w-full" />
                    </DescriptionItems>
                  </Description>
                  <div className="mt-30">
                    <QuillTextArea
                      value={textarea}
                      setValue={(v)=>{setTextarea(v)}}
                      length={length}
                      setLength={setLength}
                      height="200px"
                    />
                  </div>
                </div>
                <div className="px-10 py-20 flex flex-col gap-10">
                  <p className="font-semibold text-16">담당자 정보</p>
                  <div className="v-between-h-center">
                    <AntdSelect options={[{value:1, label:'담당자1'}]} className="w-[150px]" defaultValue={1}/>
                    <p className="font-semibold">010-0000-0000</p>
                    <p className="font-semibold">dravinon@naver.com</p>
                    <p className="font-semibold">010-0000-0000</p>
                    <div className="h-center gap-2">
                      사업관리
                      <div className="w-20 h-24 bg-[#E9EDF5] rounded-4 v-h-center cursor-pointer">
                        <Edit />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[45%] pl-20 flex flex-col gap-10">
                <p className="text-16">발주 첨부파일</p>
                <div className="w-full h-[300px]">
                  <AntdDragger
                    fileList={fileList}
                    setFileList={setFileList}
                    fileIdList={fileIdList}
                    setFileIdList={setFileIdList}
                  />
                </div>
              </div>
            </div>
            <div className="w-full v-h-center gap-10">
              <PopupOkButton label="등록" click={()=>setOpen(false)} />
              <PopupCancleButton label="취소" click={()=>setOpen(false)} />
            </div>
          </div>
        }
      />
      <AntdModal
        open={yieldPopOpen}
        setOpen={setYieldPopOpen}
        width={1540}
        title="원판수율계산"
        contents={<YieldCalculate
          board={[]}
        />}
      />
    </div>
  )
};

SalesUserEstimatePage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/order' },
      { text: '견적', link: '/sales/user/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserEstimatePage;