import React, { JSX, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Select } from "antd";

import Calendar from "@/assets/svg/icons/newcalendar.svg";
import Search from "@/assets/svg/icons/s_search.svg";


import dayjs from "dayjs";
import styled from "styled-components";
import AntdEditModal from "./AntdEditModal";
import AntdAlertModal from "./AntdAlertModal";
import CustomTree from "../Tree/CustomTree";
import { treeType } from "@/data/type/componentStyles";

interface CardInputListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  popWidth?: number;
  title: {name: string, icon?: React.ReactNode};
  data: treeType[] | [];
  onSubmit: (newData: any) => void;
  onDelete: (id: string) => void;
  styles?: {
    gap?: string;
    bg?: string;
    pd?: string;
  }
}

/**
 * BaseInfoCUDModal 컴포넌트는 전체 페이지에서 팝업으로 진행되는 생성(Create), 업데이트(Update), 삭제(Delete) 작업을 처리합니다.
 * 
 * @param {CardInputListProps} props - 컴포넌트의 props.
 * @param {boolean} props.open - 모달이 열려 있는지 여부.
 * @param {function} props.setOpen - open 상태를 설정하는 함수.
 * @param {function} props.onClose - 모달을 닫는 함수.
 * @param {number} props.popWidth - 모달의 너비.
 * @param {string} props.title - 모달의 제목.
 * @param {function} props.onSubmit - 모달의 폼 또는 데이터를 제출하는 함수.
 * @param {function} props.onDelete - 모달 안에 데이터를 삭제할때 사용하는 함수
 * @param {Object} props.styles - 모달의 커스텀 스타일.
 * 
 * @returns {JSX.Element} 렌더링된 BaseInfoCUDModal 컴포넌트.
 */

const BaseTreeCUDModal: React.FC<CardInputListProps> = (
  {open, setOpen, onClose, popWidth, title, data, onSubmit, onDelete, styles}: CardInputListProps
): JSX.Element => {
  
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<treeType[]>([]);

  useEffect(() => {
    setTreeData(data);
  },[data]);

  function treeSubmit(list: any){
    console.log(list)
    onSubmit('')
  }

  const handleTreeDataChange = async (
    type:'main'|'child',
    id:string,
    value:string,
    parentsId?: string,
  ) => {
    console.log(type, id, value, parentsId)
    setTreeData((prev) => {
      if(type === 'main'){
        console.log([...prev, { id: `temp${treeData.length}`, label:value, children:[], open:true }])
        return [...prev, { id: `temp${treeData.length}`, label:value, children:[], open:true }];
      } else {
        const newList = prev.map((item) => {
          if(item.id === parentsId){
            return {
              ...item,
              children: [...item.children ?? [], { id: `temp${item.children?.length}`, label:value }],
            };
          }
          return item;
        });
        return newList;
      }
    });
    
  }

  function closeModal(){
    // setTreeData([]);
    onClose();
  }

  return (
    <AntdEditModal
      open={open}
      width={popWidth || 600}
      setOpen={setOpen}
      onClose={closeModal}
      contents={
        <div className="px-5 pt-25 h-[900px] h-full flex flex-col gap-30">
          <div className="w-full flex justify-between items-center h-[24px]">
            <div className="flex items-center gap-10">
                {title.icon}
              <p className="text-20 font-medium">{title.name}</p>
            </div>
          </div>
          <section className="rounded-lg bg-white border border-[#D9D9D9] p-20">
            <CustomTree
              data={treeData}
              // handleDataChange={handleTreeDataChange}
              onSubmit={treeSubmit}
            />
          </section>
        </div>
      }
      />
  );
};


export default BaseTreeCUDModal;
