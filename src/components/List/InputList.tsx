import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";

interface Props {
  items: Array<{
    label:string;
    type: 'input' | 'select' | 'date' | 'other';
    value?: any;
    change?: () => void;
    other?: any;
    className?: string;
    styles?: any;
    option?: Array<{value:any,label:string}>;
  }>;
  labelWidth?: number;
  width?: string;
  height?: string;
  gap?: number;
}

const InputList: React.FC<Props> = ({
  items,
  labelWidth = 95,
  width,
  height = 36,
  gap,
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
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height}}
                />
                :
                item.type === 'select' ?
                <AntdSelect 
                  options={item.option||[]}
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height}}
                />
                :
                item.type === 'date' ?
                <AntdDatePicker 
                  value={item.value}
                  onChange={(e)=>item.change}
                  className={item.className+" "+(width??"w-full")}
                  styles={{...item.styles, ht:height, bc:'#D9D9D9', bw:'1px', br: '0px'}}
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