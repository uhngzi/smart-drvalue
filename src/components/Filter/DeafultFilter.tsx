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
            className: 'w-[200px]',
            content: 
            <AntdDatePicker 
              value={filter.writeDt}
              onChange={(value)=>setFilter((prev => ({ ...prev, writeDt:value })))}
              className="w-120"
              suffixIcon={'down'}
              styles={{bw:'0',bg:'none'}}
              placeholder=""
            />
          },
          {
            label:'작성자',
            className:'w-[120px]',
            content:<p className="w-40">홍길동</p>
          },
          {
            label:'승인일',
            className:'w-[200px]',
            content:
            <AntdDatePicker 
              value={filter.approveDt} 
              onChange={(value)=>setFilter((prev => ({ ...prev, approveDt:value })))} 
              className="w-120" 
              suffixIcon={'down'}
              styles={{bw:'0',bg:'none'}} 
              placeholder=""
              />
          },
          {
            label:'승인자',
            className:'w-[120px]',
            content:<p className="w-40">홍길동</p>
          },
          {
            label:'확정일',
            className:'w-[200px]',
            content:
            <AntdDatePicker 
              value={filter.confirmDt} 
              onChange={(value)=>setFilter((prev => ({ ...prev, confirmDt:value })))} 
              className="w-120" 
              suffixIcon={'down'}
              styles={{bw:'0',bg:'none'}} 
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
              className="w-[60px!important]" 
              styles={{bw:'0'}}
            />
          },
        ]}
      />
    </>
  )
}

export default DefaultFilter;