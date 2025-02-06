import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Edit from "@/assets/svg/icons/edit.svg"
import { CaretDownFilled, MinusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface Props {
  items: Array<any>;
  initFn: () => any;
}

const CustomTree:React.FC<Props> = ({
  items,
  initFn,
}) => {
  const [ list, setList ] = useState<Array<any>>([]);
  useEffect(()=>{
    if(items.length > 0) {
      setList(items);
    }
  }, [items])

  return (
    <div className="w-full">
      <div className="v-between-h-center ">
        <p>총 4건</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16">
            <Search />
          </p>
          <p className="w-16 h-16">
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
            <input
              className="flex-1 h-35"
            />
            <p className="w-16 h-16 cursor-pointer">
              <Plus/>
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