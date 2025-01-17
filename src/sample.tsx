import FullOkButton from "@/components/Button/FullOkButton";
import FullSubButton from "@/components/Button/FullSubButton";
import PopupCancleButton from "@/components/Button/PopupCancleButton";
import PopupOkButton from "@/components/Button/PopupOkButton";
import FullChip from "@/components/Chip/FullChip";
import LineChip from "@/components/Chip/LineChip";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import AntdInput from "@/components/Input/AntdInput";
import AntdModal from "@/components/Modal/AntdModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdTable from "@/components/Table/AntdTable";
import { sayangColumn } from "@/data/columns/sayang";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { Select } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

const SayangSamplePage_: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [value2, setValue2] = useState<Date | null>(null);

  return (
    <>
      <AntdTable 
        columns={sayangColumn}
        data={[{
            key:1,
            list_index:1,
            no:<Select options={[{value:<></>,label:'1'}]} className="w-full"/>
          },{key:2,list_index:2,no:'900-0894'}]}
        styles={{
          // th_bg:'#F1F4F9',
          // td_bg:'#FFF',
        }}
      />
      <AntdPagination
        current={1}
        onChange={()=>{}}
        size={10}
        total={100}
      />
      <AntdSelect options={[{value:'zzzzz',label:'zzzzzzzz'}]} />
      <PopupOkButton className="" label="저장" click={()=>{}} />
      <PopupCancleButton label="취소" click={()=>{setOpen(!open)}} />
      <FullOkButton label="확정저장" click={()=>{}} />
      <FullSubButton label="임시저장" click={()=>{}} />
      <FullChip label="칩 내용" state="primary"/>
      <LineChip label="내용" color="#979797"/>
      <AntdInput value={value} onChange={e=>setValue(e.target.value)} />
      <AntdDatePicker value={value2} onChange={value=>setValue2(value)} />
      <AntdModal open={open} setOpen={setOpen} title={"gd"} />
    </>
  )
}

SayangSamplePage_.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="샘플">{page}</MainPageLayout>
);

export default SayangSamplePage_;