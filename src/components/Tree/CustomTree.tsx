import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface Props {
  items: Array<{
    id: string;
    label: string;
    children: Array<any>;
  }>;
  initFn: () => any;
}

const CustomTree:React.FC<Props> = ({
  items,
  initFn,
}) => {
  const [ list, setList ] = useState<Array<{
    id: string;
    label: string;
    children: Array<any>;
  }>>([]);

  useEffect(()=>{
    if(items.length > 0) {
      setList(items);
    }
  }, [items])

  const handleAddList = () => {
    setList([
      {id:'new'+(list.length+1), label:'', children:[]},
      ...list,
    ])
  }

  const handleDeleteList = (id: string) => {
    setList(list.filter((l) => l.id !== id));
  }
  
  const handleChangeList = (id: string, value: string) => {
    setList(list.map((item) => 
      item.id === id ? { ...item, label: value } : item
    ));
  };  

  return (
    <div className="w-full">
      <div className="v-between-h-center ">
        <p>총 4건</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16">
            <Search />
          </p>
          <p className="w-16 h-16" onClick={handleAddList}>
            <Plus />
          </p>
          <p>
            <MinusSquareOutlined /> 모두 접기
          </p>
        </div>
      </div>
      {
        list.map((item) => (
          <div className="w-full h-40 h-center gap-5">
            <CaretDownFilled/>
            <CaretUpFilled />
            <input
              className="flex-1 h-35"
              value={item.label}
              onChange={(e) => handleChangeList(item.id, e.target.value)}
            />
            <p className="w-16 h-16 cursor-pointer">
              <Plus/>
            </p>
            <p className="w-16 h-16 cursor-pointer" onClick={()=>handleDeleteList(item.id)}>
              <Minus/>
            </p>
            <p className="w-16 h-16 cursor-pointer">
              <Edit />
            </p>
          </div>
        ))
      }
    </div>
  )
}

export default CustomTree;