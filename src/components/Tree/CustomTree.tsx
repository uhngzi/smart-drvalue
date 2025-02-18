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
import { useEffect, useRef, useState } from "react";
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
      <div className="relative h-center mb-10"><AntdInput className="w-[120px]" /> <span className="absolute right-5 text-12" style={{color:'#00000073'}}>Enter</span></div>
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
  const newInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(data.length > 0) {
      setFocusId(null);
      setList(data);
    }
  }, [data])
  useEffect(() => {
    const hasNewItem = list.some(item => 
      item.id.includes('new') || 
      (item.children?.some(child => child.id.includes('new')))
    );
    console.log(hasNewItem)
    if (hasNewItem && newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [list]);

  const [focusId, setFocusId] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<String[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectId(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const handleFocus = (id: string) => {
    console.log(id, focusId)
    if(id === focusId){
      setFocusId(null);
    } else{
      setFocusId(id);
    }
  };
  
  const handleBlur = () => {
    setFocusId(null);
    setList(prev => 
      prev
        .filter(item => !item.id.includes('new')) // 상위 리스트 필터링
        .map(item => ({
          ...item,
          children: item.children
            ? item.children.filter(child => !child.id.includes('new')) // children 필터링
            : []
        }))
    );
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
    <section className="flex flex-col h-full justify-between">
    <div className="w-full flex flex-col gap-20 h-full overflow-y-auto">
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
          <p className="w-16 h-16 cursor-pointer" style={{color:'#00000073'}}>
            <Search />
          </p>
          <p className="w-16 h-16 cursor-pointer" onClick={handleAddList}>
            <Plus />
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
            if(item.id.includes('new')){
              return(
                <div className="w-full h-40 h-center pl-10 gap-10" key={item.id}>
                  <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                  <div className="relative flex-1 pr-10">
                    <input
                      ref={newInputRef}
                      className="w-full h-35 pr-24 focus:outline-none focus:ring-2 focus:ring-[#09BB1B]"
                      value={item.label}
                      onChange={(e) => handleChangeList(item.id, e.target.value)}
                      onFocus={() => handleFocus(item.id)}
                      onBlur={handleBlur}
                      placeholder="새 항목 입력"
                      onKeyDown={(e) => {
                        if(e.key === "Enter") {
                          handleDataChange('main', item.id, item.label);
                          // e.currentTarget.blur();
                        }
                      }}
                    />
                    {focusId === item.id && (
                      <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                        엔터 시 저장
                      </span>
                    )}
                  </div>
                </div>
              )
          }else{
            return(
              <div key={item.id}>
                <Button type="text" className={`w-full h-40 h-center pl-5 gap-10 ${selectId.includes(item.id) ? 'bg-[#f3faff]' : ''}`} key={item.id} 
                  style={{
                    transition: 'none',
                    animation: 'none',
                    WebkitTransition: 'none',
                    MozTransition: 'none',
                    OTransition: 'none',
                  }}
                  onClick={() => handleSelect(item.id)}
                  onMouseEnter={() => setHoverId(item.id)} onMouseLeave={() => setHoverId(null)}>
                  { item.open ? <CaretDownFilled onClick={()=>handleShowList(item.id)} /> : <CaretUpFilled onClick={()=>handleShowList(item.id)} />}
                  <span className="flex-1 text-left">{item.label}</span>
                  {!selectId.includes(item.id) ? (
                    <div className={`${item.id === hoverId ? 'visible' : 'invisible'}`}>
                      <Button size="small" type="text" onClick={(e)=>{e.stopPropagation(); handleAddChild(item.id)}}>
                        <Plus/>
                      </Button>
                      <Button size="small" type="text" onClick={(e)=>{e.stopPropagation()}}>
                        <Dropdown trigger={['click']} dropdownRender={customEditItems}>
                          <a onClick={(e) => e.preventDefault()}>
                              <div 
                                className="w-full h-full v-h-center cursor-pointer"
                                onClick={()=>{}}
                              >
                                <p className="w-16 h-16 v-h-center"><Edit /></p>
                              </div>
                          </a>
                        </Dropdown>
                      </Button>
                    </div>
                  ) : (
                    <BlueCheck/>
                  )}
                </Button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                  }`}
                  key={item.id+'child'}
                >
                  {item.children?.map((child) => {
                    if(child.id.includes('new')){
                      return(
                        <div key={child.id} className="w-full h-40 h-center gap-10 pl-25">
                          <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                          <div className="relative flex-1 pr-10">
                            <input
                              ref={newInputRef}
                              className="w-full h-35 pl-5 focus:outline-none focus:ring-2 focus:ring-[#09BB1B]"
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
                              <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                                엔터 시 저장
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }else{
                      return(
                        <Button type="text" className={`w-full h-40 h-center pl-25 gap-10 ${selectId.includes(item.id) ? 'bg-[#f3faff]' : ''}`} key={child.id} 
                          style={{
                            transition: 'none',
                            animation: 'none',
                            WebkitTransition: 'none',
                            MozTransition: 'none',
                            OTransition: 'none',
                          }}
                          onClick={() => handleSelect(child.id)}
                          onMouseEnter={() => setHoverId(child.id)} onMouseLeave={() => setHoverId(null)}>
                          <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                          <span className="flex-1 text-left">{child.label}</span>
                          {!selectId.includes(child.id) ? (
                            <div className={`${child.id === hoverId ? 'visible' : 'invisible'}`}>
                              <Button size="small" type="text" onClick={(e)=>{e.stopPropagation()}}>
                                <Dropdown trigger={['click']} dropdownRender={customEditItems}>
                                  <a onClick={(e) => e.preventDefault()}>
                                      <div 
                                        className="w-full h-full v-h-center cursor-pointer"
                                        onClick={()=>{}}
                                      >
                                        <p className="w-16 h-16 v-h-center"><Edit /></p>
                                      </div>
                                  </a>
                                </Dropdown>
                              </Button>
                            </div>
                          ) : (
                            <BlueCheck/>
                          )}
                        </Button>
                        
                      )
                    }
                  })}
                </div>
              </div>
            )
          }
        })
        }
      </div>
    </div>
    <div className="py-10">
      <Button type="primary" size="large" onClick={()=>{}} 
        className="w-full flex h-center gap-8 !h-[50px] " 
        style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
        <span>저장하기</span>
      </Button>
    </div>
    </section>
  )
}

export default CustomTree;