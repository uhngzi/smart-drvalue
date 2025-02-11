import { SetStateAction } from "react";
import { filterType } from "@/data/type/filter";

import AntdDatePicker from "../DatePicker/AntdDatePicker"
import AntdInput from "../Input/AntdInput"
import FilterRound from "./FilterRound"

interface Props {
  filter: filterType;
  setFilter: React.Dispatch<SetStateAction<filterType>>;
}

const DefaultFilter: React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  return (
    <>
    {/* <AntdInput value={filter.writer} onChange={(e)=> setFilter((prev => ({ ...prev, writer: e.target.value})))} className="w-[40px!important]"/> */}
      <FilterRound
        items={[
          {
            label: '작성일',
            className: 'w-[195px]',
            content: 
            <AntdDatePicker 
              value={filter.writeDt}
              onChange={(value)=>setFilter((prev => ({ ...prev, writeDt:value })))}
              className="w-110"
              suffixIcon={'cal'}
              styles={{bw:'0',bg:'none', pd:"0"}}
              placeholder=""
            />
          },
          {
            label:'작성자',
            className:'w-[120px]',
            content:<p className="w-40 font-medium">홍길동</p>
          },
          {
            label:'승인일',
            className:'w-[195px]',
            content:
            <AntdDatePicker 
              value={filter.approveDt} 
              onChange={(value)=>setFilter((prev => ({ ...prev, approveDt:value })))} 
              className="w-110" 
              suffixIcon={'cal'}
              styles={{bw:'0',bg:'none', pd:"0"}} 
              placeholder=""
              />
          },
          {
            label:'승인자',
            className:'w-[120px]',
            content:<p className="w-40 font-medium">홍길동</p>
          },
          {
            label:'확정일',
            className:'w-[195px]',
            content:
            <AntdDatePicker 
              value={filter.confirmDt} 
              onChange={(value)=>setFilter((prev => ({ ...prev, confirmDt:value })))} 
              className="w-110" 
              suffixIcon={'cal'}
              styles={{bw:'0',bg:'none', pd:"0"}} 
              placeholder=""
            />
          },
          {
            label:'확정자(예정)',
            className:'w-[175px]',
            content:
            <AntdInput 
              // value={filter.confirmPer} 
              value={"홍길동"}
              onChange={(e)=> setFilter((prev => ({ ...prev, confirmPer: e.target.value})))} 
              className="w-[60px!important] font-medium" 
              styles={{bw:'0', bg:'none'}}
            />
          },
        ]}
      />
    </>
  )
}

export default DefaultFilter;