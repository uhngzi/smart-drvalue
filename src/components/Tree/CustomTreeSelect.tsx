import Search from "@/assets/svg/icons/s_search.svg"
import Plus from "@/assets/svg/icons/s_plus.svg"
import Minus from "@/assets/svg/icons/s_minus.svg"
import Close from "@/assets/svg/icons/s_close.svg"
import Edit from "@/assets/svg/icons/s_ellipsis.svg"
import AllOpen from "@/assets/svg/icons/allOpen.svg"
import AllClose from "@/assets/svg/icons/allClose.svg"
import SettingFill from "@/assets/svg/icons/settingFill.svg"
import BlueCheck from "@/assets/svg/icons/blue_check.svg"

import { CaretDownFilled, CaretUpFilled, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { treeType } from "@/data/type/componentStyles"
import { Button, Checkbox, CheckboxChangeEvent } from "antd"

interface Props {
  data: treeType[];
  mainCheck?: boolean;
  childCheck?: boolean;
  childCheckId?: string | null;
  setChildCheckId?: (id: string) => void;
  onChange?: (e: CheckboxChangeEvent) => void;
  notCollapsed?: boolean;
}

const CustomTreeSelect:React.FC<Props> = ({
  data,
  mainCheck = false,
  childCheck = false,
  childCheckId,
  setChildCheckId,
  onChange,
  notCollapsed,
}) => {
  const [ collapsedAll, setCollapsedAll ] = useState<boolean>(false);
  const [ list, setList ] = useState<treeType[]>([]);

  const [hoverId, setHoverId] = useState<string | null>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(()=>{
    if(data.length > 0) {
      setList(data);
    }
  }, [data])

  const treeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if(value === '') {
      setList(data);
    } else {
      // list와 list 안에 child를 flat하게 만들어서 검색
      const flatTree = data.flatMap(node => [
          { id: node.id, label: node.label, open: node.open }, // 현재 노드 포함
          ...(node.children?.map(child => ({
            id: child.id,
            label: child.label,
            open: node.open, // 부모의 `open` 상태를 유지할지 결정
          })) ?? []) // children을 추가
        ]);
  
      setList(flatTree.filter(item => item.label.includes(value)));
    }
  }

  const handleShowList = (id: string) => {
    setList(list.map((item) => 
      item.id === id ? { ...item, open: !item.open } : item
    ));
  };

  const handleCollapseAll = () => {
    setCollapsedAll(!collapsedAll);
    setList(list.map((item) => ({ ...item, open: !item.open })));
  };

  const handleSelect = (item: any) => {
    const selectId = item.id;
    if (setChildCheckId) {
      setChildCheckId(childCheckId === selectId ? null : selectId);
    }
    // const selectId = [{id: item.id, type:'main'}, ...item.children?.map((child: any) => ({id: child.id, type:'child'})) || []];
    // setSelectId(prev =>
    //   prev.some(selectedId => selectId.some(v => v.id.includes(selectedId.id)))
    //     ? prev.filter(selectedId => !selectId.some(v => v.id.includes(selectedId.id)))
    //     : [...prev, ...selectId]
    // );
  };

  return (
    <div className="w-full flex flex-col gap-20 h-full overflow-y-auto">
      
      <div className="v-between-h-center ">
        <p>전체 ({list.length})</p>
        <div className="h-center gap-8">
          {!isSearch ? (
            <p className="w-16 h-16 cursor-pointer" style={{color:'#00000073'}} onClick={() => setIsSearch(true)}>
              <Search />
            </p>
          ) : (
            <div className="w-full h-35 flex gap-10 px-5 items-center" style={{border:'1px solid #09BB1B'}}>
              <p className="w-24 h-24"><Search /></p>
              <input
                className="h-full focus:outline-none"
                style={{border:'0'}}
                value={searchText}
                onChange={(e) => treeSearch(e)}
                onBlur={() => {setSearchText(''); setIsSearch(false); setList(data);}}
                placeholder="검색"
              />
            </div>
          )}
          
          { !notCollapsed &&
          <p className="cursor-pointer flex h-center gap-3" onClick={handleCollapseAll} >
            { collapsedAll ? <Button size="small" type="text" style={{color:'#00000073'}}><AllOpen /> 모두 펼치기</Button> : 
              <Button size="small" type="text" style={{color:'#00000073'}}><AllClose /> 모두 접기</Button> }
          </p> }
        </div>
      </div>
      <div>
        {
          list.map((item) => (
            <div key={item.id}>
              <div className={`w-full h-30 h-center pl-5 gap-10 cursor-pointer h-45`} key={item.id} 
                  onMouseEnter={() => setHoverId(item.id)} onMouseLeave={() => setHoverId(null)} onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                {/* { item.open ? (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretDownFilled />
                  </Button>
                ) : (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretUpFilled />
                  </Button>
                )} */}
                <SettingFill/>
                <span className="flex text-left">{item.label}</span>
                <div className="h-1 flex-1 bg-[#D9D9D9]"/>
                <span className="flex font-medium text-[#444444A6]">{item.children?.length}</span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                }`}
                key={item.id+'child'}
              >
                {item.children?.map((child) => (
                  <div key={child.id} className={`w-full h-40 h-center gap-10 pl-20 cursor-pointer ${childCheckId === child.id ? '!bg-[#f3faff]' : ''}`} onClick={() => handleSelect(child)}>
                    <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                    <div className="relative flex-1 flex v-between-h-center">
                      <span>{child.label}</span>
                      {childCheckId === child.id && <BlueCheck/>}
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

export default CustomTreeSelect;