import InputList from "@/components/List/InputList";
import { laminationCUType, newLaminationCUType } from "@/data/type/base/lamination";

interface Props {
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => void;
  newData: laminationCUType;
  handleSubmitNewData: () => void;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewData: React.Dispatch<React.SetStateAction<laminationCUType>>;
  item: Array<{
    name: string;
    label: string;
    type: 'input' | 'select' | 'date' | 'other';
    key?: string;
    value?: any;
    other?: any;
    className?: string;
    styles?: any;
    option?: Array<{value:any,label:string}>;
    inputType?: string;
  }>;
}

const AddContents: React.FC<Props> = ({ 
  handleDataChange, 
  newData,
  handleSubmitNewData,
  setNewOpen,
  setNewData,
  item,
}) => {
  return (
    <>
      <form className="p-30 rounded-14 bg-white">
        <InputList
          handleDataChange={handleDataChange}
          labelWidth={100}
          items={item}
        />
      </form>
      <div className="w-full h-100 v-h-center gap-10">
        <div
          className="w-80 h-30 v-h-center rounded-6 border-1 border-line bg-white cursor-pointer"
          onClick={()=>{
            setNewData(newLaminationCUType());
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