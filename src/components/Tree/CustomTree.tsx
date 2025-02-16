import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"
import Trash from "@/assets/svg/icons/red-trash.svg"
import CloseEye from "@/assets/svg/icons/close_eye.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { treeType } from "@/data/type/componentStyles"
import { Button, Dropdown, MenuProps, Switch } from "antd"
import AntdInput from "../Input/AntdInput"
import dayjs from "dayjs"
import AntdDatePicker from "../DatePicker/AntdDatePicker"

interface Props {
  data: treeType[];
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

  const customEditItems = () => (
    <div className="flex flex-col gap-12 px-16 py-9 bg-white rounded-8" style={{boxShadow:'0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.0'}}>
      <AntdInput className="w-[120px] mb-10"/>
      <div className="flex h-center justify-between">
        <span className="flex text-12  gap-5"><CloseEye/>숨기기</span>
        <Switch size="small"/>
      </div>
      <Button type="text" className="justify-start p-0 h-center gap-5 text-12" onClick={()=>handleDeleteList('')}>
        <Trash/>삭제
      </Button>
    </div>
  )

  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<treeType[]>([]);
  console.log(data)
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
    <div className="w-full flex flex-col gap-20">
      <div className="flex flex-col">
        <p className="pb-8">적용일</p>
        <AntdDatePicker
          value={null}
          onChange={(e:Date)=>{}}
          placeholder="적용일"
          className="w-full !rounded-0 h-32"
          styles={{bc: '#e5e7eb', wd: '100%'}}
          suffixIcon="cal"
        />
      </div>
      <div className="v-between-h-center ">
        <p>전체 ({list.length})</p>

        <div className="h-center gap-8">
          <p className="w-16 h-16 cursor-pointer">
            <Search />
          </p>
          <p className="w-16 h-16 cursor-pointer" onClick={handleAddList}>
            <Plus />
          </p>
          <p className="cursor-pointer" onClick={handleCollapseAll} style={{color:'#00000073'}}>
            { collapsedAll ? <><PlusSquareOutlined /> 모두 펼치기</> : <><MinusSquareOutlined /> 모두 접기</> }
          </p>
        </div>
      </div>
      <div>
        {
          list.map((item) => (
            <>
              <div className="w-full h-40 h-center gap-10" key={item.id}>
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
                {/* <p className="w-16 h-16 cursor-pointer" onClick={()=>handleDeleteList(item.id)}>
                  <Close/>
                </p> */}
                <p className="w-16 h-16 cursor-pointer" onClick={()=>{
                  
                }}>
                <Dropdown trigger={['click']} dropdownRender={customEditItems}>
                  <a onClick={(e) => e.preventDefault()}>
                      <div 
                        className="w-full h-full v-h-center cursor-pointer"
                        onClick={()=>{}}
                      >
                        <p className="w-12 h-12 v-h-center"><Edit /></p>
                      </div>
                  </a>
                </Dropdown>
                </p>
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
    </div>
  )
}

export default CustomTree;