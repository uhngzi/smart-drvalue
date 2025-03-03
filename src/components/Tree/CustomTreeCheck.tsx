import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"
import AllOpen from "@/assets/svg/icons/allOpen.svg"
import AllClose from "@/assets/svg/icons/allClose.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { treeType } from "@/data/type/componentStyles"
import { Button, Checkbox, CheckboxChangeEvent } from "antd"

interface Props {
  data: treeType[];
  mainCheck?: boolean;
  childCheck?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

const CustomTreeCheck:React.FC<Props> = ({
  data,
  mainCheck = false,
  childCheck = false,
  onChange,
}) => {
  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<treeType[]>([]);

  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(()=>{
    if(data.length > 0) {
      setList(data);
    }
  }, [data])

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
    <div className="w-full flex flex-col gap-20 h-full overflow-y-auto">
      
      <div className="v-between-h-center ">
        <p>전체 ({list.length})</p>
        <div className="h-center gap-8">
          <p className="w-16 h-16 cursor-pointer" style={{color:'#00000073'}}>
            <Search />
          </p>
          <p className="cursor-pointer flex h-center gap-3" onClick={handleCollapseAll}>
            { collapsedAll ? <Button size="small" type="text" style={{color:'#00000073'}}><AllOpen /> 모두 펼치기</Button> : 
            <Button size="small" type="text" style={{color:'#00000073'}}><AllClose /> 모두 접기</Button> }
          </p>
        </div>
      </div>
      <div>
        {
          list.map((item) => (
            <div key={item.id}>
              <div className={`w-full h-30 h-center pl-5 gap-10`} key={item.id} 
                  onMouseEnter={() => setHoverId(item.id)} onMouseLeave={() => setHoverId(null)}>
                { item.open ? (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretDownFilled />
                  </Button>
                ) : (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretUpFilled />
                  </Button>
                )}
                { mainCheck ? <Checkbox onChange={onChange} value={item.id}/> : <></> }
                <span className="flex-1 text-left">{item.label}</span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                }`}
                key={item.id+'child'}
              >
                {item.children?.map((child) => (
                  <div key={child.id} className="w-full h-40 h-center gap-10 pl-20">
                    <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                    { childCheck ? <Checkbox onChange={onChange} value={child.id}/> : <></> }
                    <div className="relative flex-1">
                      {child.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default CustomTreeCheck;