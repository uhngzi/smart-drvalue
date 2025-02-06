import InputList from "@/components/List/InputList";
import { newDataProcessGroupCUType } from "@/data/type/base/process";
import { processGroupCUType } from "@/data/type/base/process";

interface Props {
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
  ) => void;
  newData: any;
  handleSubmitNewData: () => void;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewData: React.Dispatch<React.SetStateAction<processGroupCUType>>;
}

const AddContents: React.FC<Props> = ({ 
  handleDataChange, 
  newData,
  handleSubmitNewData,
  setNewOpen,
  setNewData
}) => {
  return (
    <>
      <form className="p-30 rounded-14 bg-white">
        <InputList
          handleDataChange={handleDataChange}
          labelWidth={100}
          items={[
            {name:'prcGrpNm',label:'공정그룹명',type:'input',value:newData.prcGrpNm},
            {name:'useYn',label:'사용여부',type:'select',option:[{value:true,label:"사용"},{value:false,label:"미사용"}],value:newData.useYn},
          ]}
        />
      </form>
      <div className="w-full h-100 v-h-center gap-10">
        <div
          className="w-80 h-30 v-h-center rounded-6 border-1 border-line bg-white cursor-pointer"
          onClick={()=>{
            setNewData(newDataProcessGroupCUType);
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