import { memo, SetStateAction, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Dropdown, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getAPI } from "@/api/get";

import AntdInput from "@/components/Input/AntdInput";
import { LabelBold } from "@/components/Text/Label";

import { apiAuthResponseType } from "@/data/type/apiResponse";

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Ordering from "@/assets/svg/icons/ordering.svg";
import More from "@/assets/svg/icons/edit.svg";
import Paste from "@/assets/svg/icons/paste.svg";
import Edit from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { postAPI } from "@/api/post";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import useToast from "@/utils/useToast";
import TextArea from "antd/es/input/TextArea";
import AntdPagination from "@/components/Pagination/AntdPagination";
import { deleteAPI } from "@/api/delete";
import { patchAPI } from "@/api/patch";
import SortableMemoItem from "./SortableMemoItem";
import { useUser } from "@/data/context/UserContext";
import { CloseOutlined } from "@ant-design/icons";


export type MyMemoType = {
  createdAt: Date | Dayjs | null;
  updatedAt: Date | Dayjs | null;
  deletedAt: Date | Dayjs | null;
  type: "NORMAL" | "USUALLY";
  id: string;
  memo: string;
  orderNo: number;
}

interface Props {
  login: boolean;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const MyMemo:React.FC<Props> = ({
  login,
  open,
  setOpen,
}) => {
  const { myMemo, refetchMyMemo:refetch } = useUser();
  const { showToast, ToastContainer } = useToast();

  // --------------- 리스트 데이터 ------------ 끝
  const [selectType, setSelectType] = useState<"ALL" | "USUALLY" | "NORMAL">("ALL");
  const [searchs, setSearchs] = useState<string>("");
  useEffect(()=>{
    setFData(
      myMemo
        .filter((item) => selectType === "ALL" ? item : item.type === selectType)
        .filter((item) => item.memo.toLowerCase().includes(searchs.toLowerCase())
    ));
  }, [searchs, myMemo, selectType]);
  const [fdata, setFData] = useState<MyMemoType[]>([]);
  // --------------- 리스트 데이터 ------------ 시작
  
  // -------------- 메모 등록/수정 ------------ 시작
  const [newUsuallyChk, setNewUsuallyChk] = useState<boolean>(true);
  const [editMemo, setEditMemo] = useState<MyMemoType>();
  const [newMemo, setNewMemo] = useState<string>("");
  const handleSubmit = async () => {
    try {
      if(editMemo && editMemo.id !== "") {
        const result = await patchAPI({
          type: 'core-d3',
          utype: 'tenant/',
          jsx: 'jsxcrud',
          url: 'personal-memo',
        }, editMemo.id, {
          memo: editMemo.memo,
          type: editMemo.type,
          orderNo: editMemo.orderNo,
        });
        
        if(result.resultCode === "OK_0000") {
          showToast("수정 완료", "success");
          refetch();
          setOpen(false);
          setNewUsuallyChk(true);
          setNewMemo("");
          setEditMemo(undefined);
        } else {
          const msg = result?.response?.data?.message;
          setErrMsg(msg);
          setAlertType("error");
          setAlertOpen(true);
        }
      } else {
        const result = await postAPI({
          type: 'core-d3',
          utype: 'tenant/',
          jsx: 'jsxcrud',
          url: 'personal-memo',
        }, {
          memo: newMemo,
          type: newUsuallyChk ? "USUALLY" : "NORMAL",
          orderNo: myMemo.length,
        });
        
        if(result.resultCode === "OK_0000") {
          showToast("등록 완료", "success");
          refetch();
          setOpen(false);
          setNewUsuallyChk(true);
          setNewMemo("");
          setEditMemo(undefined);
        } else {
          const msg = result?.response?.data?.message;
          setErrMsg(msg);
          setAlertType("error");
          setAlertOpen(true);
        }
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // -------------- 메모 등록/수정 ------------ 끝
  
  // ---------------- 메모 삭제 -------------- 시작
  const handleDelete = async (id:string) => {
    try {
      const result = await deleteAPI({
        type: 'core-d3',
        utype: 'tenant/',
        jsx: 'jsxcrud',
        url: 'personal-memo',
      }, id);
      
      if(result.resultCode === "OK_0000") {
        showToast("삭제 완료", "success");
        refetch();
        setOpen(false);
        setNewUsuallyChk(true);
        setNewMemo("");
        setEditMemo(undefined);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ---------------- 메모 삭제 -------------- 끝

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  // ------------- 메모 더보기/접기 ------------ 시작
  const [expandedList, setExpandedList] = useState<boolean[]>([]);
  const [clampedList, setClampedList] = useState<boolean[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const newClamped = fdata.map((_, i) => {
      const el = refs.current[i];
      if (!el) return false;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "24");
      const maxHeight = lineHeight * 4;
      return el.scrollHeight > maxHeight + 1;
    });
    setClampedList(newClamped);
    setExpandedList(new Array(myMemo.length).fill(false));
  }, [fdata]);

  const toggleExpanded = (idx: number) => {
    setExpandedList((prev) =>
      prev.map((v, i) => (i === idx ? !v : v))
    );
  };
  // ------------- 메모 더보기/접기 ------------ 끝

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  // -------------- 메모 순서 변경 ------------ 시작
  const handleOrderNoUpdate = async (id:string, orderNo:number) => {
    try {
      const result = await patchAPI({
        type: 'core-d3',
        utype: 'tenant/',
        jsx: 'default',
        url: `personal-memo/default/update-order-no/${id}`,
        etc: true,
      }, id, {orderNo: orderNo});
      
      if(result.resultCode === "OK_0000") {
        showToast("변경 완료", "success");
        refetch();
        setOpen(false);
        setNewUsuallyChk(true);
        setNewMemo("");
        setEditMemo(undefined);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // -------------- 메모 순서 변경 ------------ 끝

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fdata.findIndex((i) => i.id === active.id);
      const newIndex = fdata.findIndex((i) => i.id === over?.id);
      const newData = arrayMove(fdata, oldIndex, newIndex);
      setFData(newData);
      
      console.log(active.id, oldIndex, newIndex);
      handleOrderNoUpdate(active.id.toString(), newIndex)
    }
  };
  
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
  
    // 화면에 보이지 않도록 설정
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showToast("메모가 복사되었습니다. 원하는 곳에 붙여넣어 사용하세요!", "success");
      } else {
        showToast("복사 실패", "error");
      }
    } catch (err) {
      showToast("복사 실패", "error");
    }
  
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast("메모가 복사되었습니다. 원하는 곳에 붙여넣어 사용하세요!", "success"))
        .catch(() => fallbackCopyTextToClipboard(text));
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="v-between-h-center w-full">
        <LabelBold label={"나의 메모 ("+myMemo.length.toLocaleString()+")"} className="text-18"/>
        <div className="h-24 flex v-h-center text-10">
          <div
            className="v-h-center cursor-pointer px-2"
            onClick={()=>{setSelectType('ALL')}}
            style={selectType==='ALL'?
              {border:'1.6px solid #4880FF',color:'#4880FF'}
              :
              {border:'1px solid #D5D5D5',color:'#22222285'}
            }
          >
            모두 보기
          </div>
          <div
            className="v-h-center cursor-pointer px-2"
            onClick={()=>{setSelectType('NORMAL')}}
            style={selectType==='NORMAL'?
              {border:'1.6px solid #4880FF',color:'#4880FF'}
              :
              {border:'1px solid #D5D5D5',color:'#22222285'}
            }
          >
            메모만 보기
          </div>
          <div
            className="v-h-center cursor-pointer px-2"
            onClick={()=>{setSelectType('USUALLY')}}
            style={selectType==='USUALLY'?
              {border:'1.6px solid #4880FF',color:'#4880FF'}
              :
              {border:'1px solid #D5D5D5',color:'#22222285'}
            }
          >
            자주 쓰는 문구만 보기
          </div>
        </div>
      </div>
      <div className="h-center w-full mb-10">
        <AntdInput
          value={searchs}
          onChange={(e)=>setSearchs(e.target.value)}
          placeholder="검색..."
          styles={{ht:"36px", br:"0"}} memoView
        />
        <div
          className="min-w-32 w-32 h-36 border-1 border-line v-h-center border-l-0 cursor-pointer"
        >
          <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
        </div>
      </div>

      <div className="flex flex-col gap-10 overflow-y-auto h-[calc(100vh-350px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fdata.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          { open &&
            <div className="w-full p-10 pb-20 flex flex-col bg-[#b0cdeb25] relative gap-5">
              <TextArea
                value={newMemo}
                onChange={(e) => {
                  const { value } = e.target;
                  setNewMemo(value);
                }}
                className="rounded-2"
                style={{height:100,minHeight:100,background:"none",color:"#222222",border:0,resize:"none"}}
                placeholder="새 메모를 추가하세요."
              />
              <div className="v-between-h-center p-5">
                <div className="h-center gap-5">
                  <Checkbox
                    checked={newUsuallyChk}
                    onChange={(e)=>{
                      setNewUsuallyChk(e.target.checked);
                    }}
                  />
                  자주 쓰는 문구로 사용
                </div>
                <div className="h-center gap-5">
                  <Button
                    className="p-5"
                    onClick={()=>{
                      setOpen(false);
                      setNewUsuallyChk(true);
                      setNewMemo("");
                      setEditMemo(undefined);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    className="text-[#ffffffE0] bg-point1 p-5"
                    onClick={()=>{
                      handleSubmit();
                    }}
                  >
                    저장
                  </Button>
                </div>
              </div>
              {/* 메모 접히는 부분 */}
              <div
                className="w-20 h-20 absolute bottom-0 right-0"
                style={{backgroundImage: 'linear-gradient(to top left, #FFF 50%, #00000020 50%)'}}
              />
            </div>
          }
          {fdata.map((item, idx) => (
            <SortableMemoItem
              key={item.id}
              item={item}
              idx={idx}
              handleEdit={()=>setEditMemo(item)}
              handlePaste={()=>copyToClipboard(item.memo)}
              handleDelete={()=>handleDelete(item.id)}
              refs={refs}
              expandedList={expandedList}
              clampedList={clampedList}
              toggleExpanded={toggleExpanded}
              editMemo={editMemo}
              setEditMemo={setEditMemo}
              handleSubmit={handleSubmit}
              handleCancel={()=>{
                setOpen(false);
                setNewUsuallyChk(true);
                setNewMemo("");
                setEditMemo(undefined);
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      </div>
      
      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={
          alertType === "error" ? "오류 발생" :
          ""
        }
        contents={
          alertType === "error" ? <div>{errMsg}</div> :
          <></>
        }
        onOk={()=>{
          setAlertOpen(false);
          setOpen(false);
          setNewUsuallyChk(true);
          setNewMemo("");
          setEditMemo(undefined);
        }}
        okText={
          alertType === "error" ? "확인" :
          ""
        }
        onCancel={()=>{
          setAlertOpen(false);
          setOpen(false);
          setNewUsuallyChk(true);
          setNewMemo("");
          setEditMemo(undefined);
        }}
        hideCancel={
          alertType === "error"
        }
        type={
          alertType === "error" ? "error" :
          "success"
        }
      />
      <ToastContainer/>
    </div>
  )
}

export default MyMemo;