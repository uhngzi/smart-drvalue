import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";

interface Props {
  items: Array<{
    label: string;
    name: string;
    type: 'input' | 'select' | 'date' | 'other';
    value?: any;
    other?: any;
    className?: string;
    styles?: any;
    option?: Array<{value:any,label:string}>;
    key?: string;
    inputType?: string;
  }>;
  labelWidth?: number;
  width?: string;
  height?: string;
  gap?: number;
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => void;
}

const InputList: React.FC<Props> = ({
  items,
  labelWidth = 95,
  width,
  height = 36,
  gap,
  handleDataChange,
}) => {
  return (
    <>
      <div
        className="flex flex-col w-full"
        style={{gap:gap}}
      >
        {
          items.map((item, index)=>(
            <div className="w-full h-36 h-center gap-5" key={index}>
              <p 
                className="ml-10 h-center justify-end text-14"
                style={{width:labelWidth}}
              >{item.label} :</p>
              <div
                style={{width:`calc(100% - ${labelWidth}px)`}}
              >
              {
                item.type === 'input' ?
                <AntdInput 
                  value={item.value ?? ''}
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height}}
                  onChange={(e)=>handleDataChange(e, item.name, 'input')}
                  type={item.inputType}
                />
                :
                item.type === 'select' ?
                <AntdSelect 
                  options={item.option||[]}
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height}}
                  onChange={(e)=>handleDataChange(e, item.name, 'select', item.key)}
                />
                :
                item.type === 'date' ?
                <AntdDatePicker 
                  value={item.value}
                  onChange={(e:Date|null)=>handleDataChange(JSON.stringify(e), item.name, 'date')}
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height, bc:'#D9D9D9', bw:'1px', br: '0px'}}
                  suffixIcon="cal"
                />
                :
                <>{item.other}</>
              }
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default InputList;