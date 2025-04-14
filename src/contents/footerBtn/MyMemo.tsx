import { memo, SetStateAction, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, Space } from "antd";
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
import AntdModal from "@/components/Modal/AntdModal";
import { postAPI } from "@/api/post";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import useToast from "@/utils/useToast";
import TextArea from "antd/es/input/TextArea";
import AntdPagination from "@/components/Pagination/AntdPagination";
import { deleteAPI } from "@/api/delete";
import { patchAPI } from "@/api/patch";


type Memo = {
  createdAt: Date | Dayjs | null;
  updatedAt: Date | Dayjs | null;
  deletedAt: Date | Dayjs | null;
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
  const { showToast, ToastContainer } = useToast();

  // --------------- 리스트 데이터 ------------ 끝
  const [searchs, setSearchs] = useState<string>("");
  useEffect(()=>{
    setFData(data.filter((item) =>
      item.memo.toLowerCase().includes(searchs.toLowerCase())
    ));
  }, [searchs]);
  const [fdata, setFData] = useState<Memo[]>([]);
  const [data, setData] = useState<Memo[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["myMemo", login],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d3",
        utype: "tenant/",
        url: "personal-memo/jsxcrud/me"
      },{
        // s_query: searchs.length > 2 ? [{key: "memo", oper: "startsL", value: searchs}] : undefined,
        sort: "orderNo,ASC",
      });

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setFData(result.data?.data ?? []);
      } else {
        console.log("GET ERROR:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // --------------- 리스트 데이터 ------------ 시작
  
  // -------------- 메모 등록/수정 ------------ 시작
  const [editMemo, setEditMemo] = useState<Memo>();
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
          memo: newMemo,
          orderNo: editMemo.orderNo,
        });
        
        if(result.resultCode === "OK_0000") {
          showToast("수정 완료", "success");
          refetch();
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
          orderNo: data.length,
        });
        
        if(result.resultCode === "OK_0000") {
          showToast("등록 완료", "success");
          refetch();
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
  const [alertType, setAlertType] = useState<"error" | "new" | "edit" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(()=>{
    if(open) {
      setAlertType("new");
      setAlertOpen(true);
    }
  }, [open])

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
    setExpandedList(new Array(data.length).fill(false));
  }, [fdata]);

  const toggleExpanded = (idx: number) => {
    setExpandedList((prev) =>
      prev.map((v, i) => (i === idx ? !v : v))
    );
  };
  // ------------- 메모 더보기/접기 ------------ 끝

  return (
    <div className="flex flex-col gap-10">
      <LabelBold label={"나의 메모 ("+data.length.toLocaleString()+")"} className="text-18"/>
      <div className="h-center w-full mb-10">
        <AntdInput
          value={searchs}
          onChange={(e)=>setSearchs(e.target.value)}
          placeholder="검색..."
          styles={{ht:"36px", br:"0"}}
        />
        <div
          className="min-w-32 w-32 h-36 border-1 border-line v-h-center border-l-0 cursor-pointer"
        >
          <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
        </div>
      </div>

      <div className="flex flex-col gap-10 overflow-y-auto h-[calc(100vh-350px)]">
      {/* 메모 */}
      { fdata.map((item, idx) => (
        <div
          key={idx}
          className="w-full p-10 pb-20 flex flex-col bg-[#b0cdeb25] relative"
        >
          <div className="w-full h-center gap-10 h-24">
            <Ordering />
            <p className="flex-1 text-[#00000045] font-300 leading-[150%]">{dayjs(item.createdAt).format("YYYY-MM-DD")}</p>
            <Dropdown trigger={['click']} menu={{ items:[
              {
                label:
                  <div className="h-center gap-5">
                    <p className="w-16 h-16"><Edit /></p>
                    메모 수정
                  </div>,
                key: 0,
                onClick:()=>{
                  setEditMemo(item);
                  setNewMemo(item.memo);
                  setAlertType("edit");
                  setAlertOpen(true);
                }
              },
              {
                label:
                  <div className="h-center gap-5">
                    <p className="w-16 h-16"><Paste /></p>
                    내용 복사
                  </div>,
                key: 1,
                onClick:()=>{
                  navigator.clipboard.writeText(item.memo)
                    .then(() => {
                      showToast("메모가 복사되었습니다. 원하는 곳에 붙여넣어 사용하세요!", "success");
                    })
                    .catch((err) => {
                      showToast("복사 완료", "error");
                    });
                }
              },
              {
                label:
                  <div className="text-[red] h-center gap-5">
                    <p className="w-16 h-16"><Trash /></p>
                    삭제
                  </div>,
                key: 2,
                onClick:()=>{
                  handleDelete(item.id);
                }
              }
            ]}}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className="w-24 h-24 cursor-pointer v-h-center">
                    <p className="w-16 h-16"><More/></p>
                  </div>
                </Space>
              </a>
            </Dropdown>
          </div>

          {/* 메모 내용 */}
          <div
            ref={(el) => {
              refs.current[idx] = el;
            }}
            className={`px-5 whitespace-pre-line transition-all duration-200 ${
              expandedList[idx] ? "" : "line-clamp-4"
            }`}
          >
            {item.memo}
          </div>
          {clampedList[idx] && (
            <div
              className="w-full cursor-pointer v-h-center h-15"
              onClick={() => toggleExpanded(idx)}
            >
              {expandedList[idx] ? "접기" : "더보기"}
            </div>
          )}

          {/* 메모 접히는 부분 */}
          <div
            className="w-20 h-20 absolute bottom-0 right-0"
            style={{backgroundImage: 'linear-gradient(to top left, #FFF 50%, #00000020 50%)'}}
          />
        </div>
      ))}
      </div>
      {/* <div className="w-full h-100 h-center justify-end">
        <AntdPagination
          current={pagination.current}
          total={totalData}
          size={pagination.size}
          onChange={handlePageChange}
        />
      </div> */}

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={
          alertType === "error" ? "오류 발생" :
          alertType === "new" ? "새 메모 등록" :
          alertType === "edit" ? "메모 수정" :
          ""
        }
        contents={
          alertType === "error" ? <div>{errMsg}</div> :
          alertType === "new" ?
            <div>
              <TextArea
                value={newMemo}
                onChange={(e) => {
                  const { value } = e.target;
                  setNewMemo(value);
                }}
                className="rounded-2"
                style={{height:100,minHeight:100,background:"#FFF",color:"#222222"}}
              />
            </div> :
          alertType === "edit" ?
            <div>
              <TextArea
                value={newMemo}
                onChange={(e) => {
                  const { value } = e.target;
                  setNewMemo(value);
                }}
                className="rounded-2"
                style={{height:100,minHeight:100,background:"#FFF",color:"#222222"}}
              />
            </div> :
          <></>
        }
        onOk={()=>{
          if(alertType === "new") {
            handleSubmit();
          } else if(alertType === "edit") {
            handleSubmit();
          }
          setAlertOpen(false);
          setOpen(false);
        }}
        okText={
          alertType === "error" ? "확인" :
          alertType === "new" ? "등록" :
          alertType === "edit" ? "수정" :
          ""
        }
        onCancle={()=>{
          setAlertOpen(false);
          setOpen(false);
          setNewMemo("");
        }}
        cancelText={
          alertType === "new"
          || alertType === "edit" ? "취소" :
          ""
        }
        hideCancel={
          alertType === "error"
        }
        type={
          alertType === "error" ? "error" :
          alertType === "new"
          || alertType === "edit" ? "info" :
          "success"
        }
      />
      <ToastContainer/>
    </div>
  )
}

export default MyMemo;