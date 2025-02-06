import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface Props {
  data: Array<{
    id: string;
    label: string;
    children?: Array<{
      id: string;
      label: string;
    }>;
    open: boolean;
  }>;
  handleDataChange: (
    type:'main' | 'child',
    id:string,
    value:string,
    parentsId?: string,
  ) => void;
}

const CustomTree:React.FC<Props> = ({
  data,
  handleDataChange,
}) => {
  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<Array<{
    id: string;
    label: string;
    children?: Array<{
      id: string;
      label: string;
    }>;
    open: boolean;
  }>>([]);

  useEffect(()=>{
    if(data.length > 0) {
      setList(data);
    }
  }, [data])

  const [focusId, setFocusId] = useState<string | null>(null);

  const handleFocus = (id: string) => {
    setFocusId(id);
  };
  
  const handleBlur = () => {
    setFocusId(null);
  };
  

  const handleAddList = () => {
    setList([
      {id:'new'+(list.length+1), label:'', children:[], open: true},
      ...list,
    ])
  }

  const handleAddChild = (id: string) => {
    setList(list.map((item) => 
      item.id === id ? { 
        ...item,
        children:
          item.children?.length ? [
            {id:'newchild'+item.children?.length+1, label:''},
            ...item.children,
          ] : [{id:'newchild'+item.children?.length+1, label:''}]
      } : item
    ));
  }

  const handleDeleteList = (id: string) => {
    setList(list.filter((l) => l.id !== id));
  }
  
  const handleChangeList = (id: string, value: string) => {
    setList(list.map((item) => 
      item.id === id ? { ...item, label: value } : item
    ));
  };

  const handleChangeChild = (parentId: string, childId: string, value: string) => {
    setList(list.map((item) => 
      item.id === parentId
        ? {
            ...item,
            children: item.children?.map((child) =>
              child.id === childId ? { ...child, label: value } : child
            ),
          }
        : item
    ));
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
    <div className="w-full">
      <div className="v-between-h-center ">
        <p>총 {list.length}건</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16 cursor-pointer">
            <Search />
          </p>
          <p className="w-16 h-16 cursor-pointer" onClick={handleAddList}>
            <Plus />
          </p>
          <p className="cursor-pointer" onClick={handleCollapseAll}>
            { collapsedAll ? <><PlusSquareOutlined /> 모두 펼치기</> : <><MinusSquareOutlined /> 모두 접기</> }
          </p>
        </div>
      </div>
      {
        list.map((item) => (
          <>
            <div className="w-full h-40 h-center gap-10">
              { item.open ? <CaretDownFilled onClick={()=>handleShowList(item.id)} /> : <CaretUpFilled onClick={()=>handleShowList(item.id)} />}
              <div className="relative flex-1">
                <input
                  className="w-full h-35 pr-24"
                  value={item.label}
                  onChange={(e) => handleChangeList(item.id, e.target.value)}
                  onFocus={() => handleFocus(item.id)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") {
                      handleDataChange('main', item.id, item.label);
                      // e.currentTarget.blur();
                    }
                  }}
                />
                {focusId === item.id && (
                  <span className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    엔터 시 저장
                  </span>
                )}
              </div>

              <p className="w-16 h-16 cursor-pointer" onClick={()=>handleAddChild(item.id)}>
                <Plus/>
              </p>
              <p className="w-16 h-16 cursor-pointer" onClick={()=>handleDeleteList(item.id)}>
                <Close/>
              </p>
              <p className="w-16 h-16 cursor-pointer" onClick={()=>{
                
              }}>
                <Edit />
              </p>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {item.children?.map((child) => (
                <div key={child.id} className="w-full h-40 h-center gap-10 pl-20">
                  <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                  <div className="relative flex-1">
                    <input
                      className="w-full h-35 pl-5"
                      value={child.label}
                      onChange={(e) => handleChangeChild(item.id, child.id, e.target.value)}
                      onFocus={() => handleFocus(child.id)}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleDataChange("child", child.id, child.label, item.id);
                        }
                      }}
                    />
                    {focusId === child.id && (
                      <span className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        엔터 시 저장
                      </span>
                    )}
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

export default CustomTree;