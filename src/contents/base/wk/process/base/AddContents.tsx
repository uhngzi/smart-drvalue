import InputList from "@/components/List/InputList";
import { newDataProcessCUType, processGroupRType } from "@/data/type/base/process";
import { processCUType } from "@/data/type/base/process";

interface Props {
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => void;
  newData: any;
  handleSubmitNewData: () => void;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewData: React.Dispatch<React.SetStateAction<processCUType>>;
  dataGroup: Array<processGroupRType>;
}

const AddContents: React.FC<Props> = ({ 
  handleDataChange, 
  newData,
  handleSubmitNewData,
  setNewOpen,
  setNewData,
  dataGroup
}) => {
  return (
    <>
      <form className="p-30 rounded-14 bg-white">
        <InputList
          handleDataChange={handleDataChange}
          labelWidth={100}
          items={[
            {name:'prcGrpNm',key:'prcGrpNm',label:'공정그룹',type:'select',value:newData.prcGrpNm,option:dataGroup.map((item)=>({value:item.id,label:item.prcGrpNm}))},
            {name:'prcNm',label:'공정명',type:'input',value:newData.prcNm},
            {name:'useYn',label:'사용여부',type:'select',option:[{value:true,label:"사용"},{value:false,label:"미사용"}],value:newData.useYn},
          ]}
        />
      </form>
      <div className="w-full h-100 v-h-center gap-10">
        <div
          className="w-80 h-30 v-h-center rounded-6 border-1 border-line bg-white cursor-pointer"
          onClick={()=>{
            setNewData(newDataProcessCUType);
            setNewOpen(false);
          }}
        >
          취소
        </div>
        <div
          className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
          onClick={handleSubmitNewData}
        >
          등록
        </div>
      </div>
    </>
  )
}

export default AddContents;