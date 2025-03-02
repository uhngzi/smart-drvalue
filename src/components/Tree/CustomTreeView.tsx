import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus_gray.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"
import Trash from "@/assets/svg/icons/red-trash.svg"
import AllOpen from "@/assets/svg/icons/allOpen.svg"
import AllClose from "@/assets/svg/icons/allClose.svg"
import CloseEye from "@/assets/svg/icons/close_eye.svg"
import BlueCheck from "@/assets/svg/icons/blue_check.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CUtreeType, treeType } from "@/data/type/componentStyles"
import { Button, Dropdown, MenuProps, Switch, Tooltip } from "antd"
import AntdInput from "../Input/AntdInput"
import dayjs from "dayjs"
import AntdDatePicker from "../DatePicker/AntdDatePicker"

interface Props {
  open?: boolean;
  data: treeType[];
  setSelect? : Dispatch<SetStateAction<string | null>>;
}



const CustomTreeView:React.FC<Props> = ({
  open, // 모달에서 트리를 사용하는 경우에만 사용됨, 모달이 열려있는지 여부
  data,
  setSelect
  
}) => {
  const [ treeName, setTreeName ] = useState<string>('');

  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<treeType[]>([]);
  const newInputRef = useRef<HTMLInputElement>(null);

  const [selectId, setSelectId] = useState<string | null>(null);

  useEffect(() => {
    setSelectId(null);
    setList(data);
  }, [open])

  useEffect(()=>{
    // if(data.length > 0) {
      setList(data);
    // }
  }, [data])

  useEffect(() => {
    const hasNewItem = list.some(item => 
      item.id.includes('new') || 
      (item.children?.some(child => child.id.includes('new')))
    );
    if (hasNewItem && newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [list]);
  

 

  const handleSelect = (item: string) => {
    setSelectId((prev: string | null) => prev === item ? null : item)
    setSelect && setSelect((prev: string | null) => prev === item ? null : item)
  };
  
  const handleShowList = (id: string) => {
    setList(list.map((item) => 
      item.id === id ? { ...item, open: !item.open } : item
    ));
  };

  const handleCollapseAll = () => {
    setCollapsedAll(!collapsedAll);
    setList(list.map((item) => ({ ...item, open: !item.open })));
  };

  return (
    <section className="flex flex-col h-full justify-between">
    <div className="w-full flex flex-col gap-20 h-full overflow-y-auto">
      {/* <div className="flex flex-col">
        <p className="pb-8">적용일</p>
        <AntdDatePicker
          value={null}
          onChange={(e:Date)=>{}}
          placeholder="적용일"
          className="w-full !rounded-0 h-32"
          styles={{bc: '#e5e7eb', wd: '100%'}}
          suffixIcon="cal"
        />
      </div> */}
      <div className="v-between-h-center ">
        <p>전체 ({list.length})</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16 cursor-pointer" style={{color:'#00000073'}}>
            <Search />
          </p>
          <p className="cursor-pointer flex h-center gap-3" onClick={handleCollapseAll} >
            { collapsedAll ? <Button size="small" type="text" style={{color:'#00000073'}}><AllOpen /> 모두 펼치기</Button> : 
              <Button size="small" type="text" style={{color:'#00000073'}}><AllClose /> 모두 접기</Button> }
          </p>
        </div>
      </div>
      <div>
        {
          list.map((item) => {
            return(
              <div key={item.id}>
                <Button type="text" className={`w-full h-40 h-center pl-5 gap-10 ${selectId === item.id ? '!bg-[#f3faff]' : ''}`} key={item.id} 
                  onClick={() => handleSelect(item.id)}>
                  { item.open ? (
                    <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                      <CaretDownFilled />
                    </Button>
                    ) : (
                      <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                        <CaretUpFilled />
                      </Button>
                    )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {selectId === item.id && (<BlueCheck/>)}
                </Button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                  }`}
                  key={item.id+'child'}
                >
                  {item.children?.map((child) => {
                    return(
                      <Button type="text" className={`w-full h-40 h-center !pl-30 !gap-10 ${selectId === item.id ? '!bg-[#f3faff]' : ''}`} key={child.id} 
                        style={{
                          transition: 'none',
                          animation: 'none',
                          WebkitTransition: 'none',
                          MozTransition: 'none',
                          OTransition: 'none',
                        }}
                        onClick={() => handleSelect(child.id)}>
                        <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                        <span className="flex-1 text-left">{child.label}</span>
                        {selectId === item.id && (<BlueCheck/>)}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
        })
        }
      </div>
    </div>
    </section>
  )
}

export default CustomTreeView;