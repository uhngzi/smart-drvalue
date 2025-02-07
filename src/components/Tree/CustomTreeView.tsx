import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { treeType } from "@/data/type/componentStyles"
import { Checkbox, CheckboxChangeEvent } from "antd"

interface Props {
  data: treeType[];
  mainCheck?: boolean;
  childCheck?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

const CustomTreeView:React.FC<Props> = ({
  data,
  mainCheck = false,
  childCheck = false,
  onChange,
}) => {
  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<treeType[]>([]);

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
    <div className="w-full">
      <div className="v-between-h-center ">
        <p>총 {list.length}건</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16 cursor-pointer">
            <Search />
          </p>
          <p className="cursor-pointer" onClick={handleCollapseAll}>
            { collapsedAll ? <><PlusSquareOutlined /> 모두 펼치기</> : <><MinusSquareOutlined /> 모두 접기</> }
          </p>
        </div>
      </div>
      {
        list.map((item) => (
          <>
            <div className="w-full h-40 h-center gap-10" key={item.id}>
              { item.open ? <CaretDownFilled onClick={()=>handleShowList(item.id)} /> : <CaretUpFilled onClick={()=>handleShowList(item.id)} />}
              { mainCheck ? <Checkbox onChange={onChange} /> : <></> }
              <div className="relative flex-1">
                {item.label}
              </div>
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
                  { childCheck ? <Checkbox onChange={onChange} /> : <></> }
                  <div className="relative flex-1">
                    {child.label}
                  </div>
                </div>
              ))}
            </div>
          </>
        ))
      }
    </div>
  )
}

export default CustomTreeView;