import React, { Dispatch, JSX, SetStateAction, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Select } from "antd";

import Calendar from "@/assets/svg/icons/newcalendar.svg";
import Search from "@/assets/svg/icons/s_search.svg";


import dayjs from "dayjs";
import styled from "styled-components";
import AntdEditModal from "./AntdEditModal";
import AntdAlertModal, { AlertType } from "./AntdAlertModal";
import CustomTree from "../Tree/CustomTree";
import { CUtreeType, treeType } from "@/data/type/componentStyles";

interface CardInputListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  popWidth?: number;
  title: {name: string, icon?: React.ReactNode};
  data: treeType[] | [];
  isChild?: boolean;
  onSubmit: (newData: any) => void;
  onUpdateDataFunc: {
    addList: CUtreeType[];
    editList: CUtreeType[];
    deleteList: {type: string, id: string}[];
    setAddList: Dispatch<SetStateAction<CUtreeType[]>>;
    setEditList: Dispatch<SetStateAction<CUtreeType[]>>;
    setDeleteList: Dispatch<SetStateAction<{type: string, id: string}[]>>;
  };
  styles?: {
    gap?: string;
    bg?: string;
    pd?: string;
  };
  addEdits?: { 
    info?: any[], 
    childInfo?: any[],
    setInfo?: Dispatch<SetStateAction<any[]>>, 
    setChildInfo?: Dispatch<SetStateAction<any[]>>,
    addParentEditList?: {type: string, key: string, name: string, selectData?:any[]}[] 
    addChildEditList?: {type: string, key: string, name: string, selectData?:any[]}[]
  };
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
 * @param {function} props.onUpdateDataFunc - 모달 안에 데이터를 추가, 수정, 삭제할때 사용하는 함수
 * @param {Object} props.styles - 모달의 커스텀 스타일.
 * @param {Object} props.addEdits - 모달 안에 데이터를 추가, 수정할때 사용하는 함수와 tree 상태에서 추가적으로 입력받을 항목을 담은
 * 
 * @returns {JSX.Element} 렌더링된 BaseInfoCUDModal 컴포넌트.
 */

const BaseTreeCUDModal: React.FC<CardInputListProps> = (
  {open, setOpen, onClose, popWidth, title, data, isChild,
    onSubmit, onUpdateDataFunc, styles,
    addEdits = { 
      info: [], 
      setInfo: ()=>{},
      childInfo: [],
      setChildInfo: ()=>{},
      addParentEditList: [],
      addChildEditList: [],
    },
  } : CardInputListProps
): JSX.Element => {
  
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<treeType[]>([]);
  const [treeModalOpen, setTreeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if(!treeModalOpen)
      onClose();
  },[treeModalOpen]);

  useEffect(() => {
    if(open)
      setTreeModalOpen(open);
  },[open]);

  useEffect(() => {
    setTreeData(data);
  },[data]);

  // 성공 실패 유무 팝업 관련
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>('success');
  const [resultTitle, setResultTitle] = useState<string>('성공');
  const [resultText, setResultText] = useState<string>('');

  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }

  function treeSubmit(list: any){
    onSubmit('')
  }

  function closeModal(){
    // setTreeData([]);
    const { addList, editList, deleteList } = onUpdateDataFunc;
    const allList = [...addList, ...editList, ...deleteList];
    if(allList.length > 0){
      setResultFunc('warning', '경고', '변경사항을 저장하지 않고 닫으시겠습니까?');
      return;
    }else{
      onUpdateDataFunc.setAddList([]);
      onUpdateDataFunc.setEditList([]);
      onUpdateDataFunc.setDeleteList([]);
      setTreeModalOpen(false);
    }
  }
  return (
      <AntdEditModal
        open={open}
        width={popWidth || 600}
        setOpen={setOpen}
        onClose={closeModal}
        contents={
          <div className="px-5 pt-25 min-h-[650px] max-h-[900px] h-full flex flex-col gap-30">
            <div className="w-full flex justify-between items-center h-[24px]">
              <div className="flex items-center gap-10">
                  {title.icon}
                <p className="text-20 font-medium">{title.name}</p>
              </div>
            </div>
            <section className="rounded-lg bg-white border border-[#D9D9D9] p-20">
              <CustomTree
                open={treeModalOpen}
                data={treeData}
                isChild={isChild}
                onSubmit={treeSubmit}
                setAddList={onUpdateDataFunc.setAddList}
                setEditList={onUpdateDataFunc.setEditList}
                setDelList={onUpdateDataFunc.setDeleteList}
                addEdits={addEdits}
              />
            </section>
            <AntdAlertModal
              open={resultOpen}
              setOpen={setResultOpen}
              title={resultTitle}
              contents={resultText}
              type={resultType} 
              onOk={()=>{
                // refetch();
                onUpdateDataFunc.setAddList([]);
                onUpdateDataFunc.setEditList([]);
                onUpdateDataFunc.setDeleteList([]);
                setResultOpen(false);
                setTreeModalOpen(false);
              }}
              cancelText="취소"
              theme="base"
              
            />
          </div>
        }
        />
  );
};


export default BaseTreeCUDModal;
