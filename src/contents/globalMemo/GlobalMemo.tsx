import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdInput from "@/components/Input/AntdInput";
import { LabelMedium } from "@/components/Text/Label";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import useToast from "@/utils/useToast";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Memo = {
  createdAt?: Date | Dayjs | null;
  id?: string;
  memo?: string;
  extraKey?: string;
  metaData?: {
    teamIdx?: string;
    shared?: boolean;
    cancle?: boolean;
    cancledAt?: Date | Dayjs | null;
    empIdx?: string;
    empName?: string;
    cancledEmpName?: string;
  }
}

interface Props {
  id: string;
  entityName: string;
  entityRelation: any;
  relationIdx: string;
}

const GlobalMemo:React.FC<Props> = ({
  id,
  entityName,
  entityRelation,
  relationIdx,
}) => {
  const { showToast, ToastContainer } = useToast();

  const [open, setOpen] = useState<boolean>(false);

  // --------------- 리스트 데이터 ------------ 끝
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<Memo[]>([]);
  const [relationsData, setRelationsData] = useState<any[]>([]);
  const handleList = async () => {
    try {
      setDataLoading(true);

      const result = await postAPI({
        type: 'core-d3',
        utype: 'tenant/',
        jsx: 'default',
        url: 'global-memo/default/find-relation-memo',
        etc: true,
      }, {
        startIdx: id,
        startEntityName: entityName,
        entityRelation: entityRelation,
        relationIdx: relationIdx,
      });
        
      if(result.resultCode === "OK_0000") {
        const memos = (result.data?.data?.memos ?? []);
        const relations = (result.data?.data?.relations ?? []);

        setData(memos);
        setRelationsData(relations);
        setDataLoading(false);

        console.log(newInputRef);
        if(newInputRef && newInputRef.current) {
          newInputRef.current.focus();
        }
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
        setDataLoading(false);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  useEffect(()=>{
    if(id && entityName && open)
      handleList();
  }, [open])
  // --------------- 리스트 데이터 ------------ 시작

  // ---------------- 메모 등록 -------------- 시작
  const handleSubmit = async () => {
    try {
      const result = await postAPI({
        type: 'core-d3',
        utype: 'tenant/',
        jsx: 'default',
        url: 'global-memo',
      }, {
        memo: value,
        extraKey: id,
        shared: true,
      });
        
      if(result.resultCode === "OK_0000") {
        setValue("");
        handleList();
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
        setDataLoading(false);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ---------------- 메모 등록 -------------- 끝

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleClick = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popupWidth = 400;
      const padding = 10;
      const viewportWidth = window.innerWidth;
  
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.left + window.scrollX;
      let alignRight = false;
  
      // 우측 넘침 시 오른쪽 정렬
      if (rect.left + popupWidth + padding > viewportWidth) {
        alignRight = true;
        left = rect.right - popupWidth + window.scrollX;
        if (left < padding) left = padding; // 왼쪽도 넘침 방지
      }
  
      setPos({ top, left });
      setOpen((prev) => !prev);
    }
  };

  const [value, setValue] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const newInputRef = useRef<HTMLInputElement>(null);

///api/serv/core-d3/v1/tenant/global-memo/default/create

  return (
    <div className="relative inline-block">
      <Button
        ref={anchorRef}
        onClick={handleClick}
        icon={<PlusOutlined />}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 p-4 bg-white shadow-lg border rounded-md flex flex-col gap-10 !p-10"
            style={{
              top: pos.top,
              left: pos.left,
              width: "400px",
            }}
          >
            <div className="v-between-h-center">
              <LabelMedium label="메모 목록 및 등록"/>
              <CloseOutlined
                className="w-16 h-16 cursor-pointer"
                onClick={handleClick}
              />
            </div>
            {dataLoading && <Spin />}
            {!dataLoading && <>
            <div className="h-center">
              <div className="relative flex-1 pr-10">
                <input
                  ref={newInputRef}
                  className="w-full h-32 px-5 rounded-2 border-1 border-line focus:outline-none focus:ring-2 focus:ring-[#0593ff20]"
                  value={value}
                  onChange={(e)=>{
                    setValue(e.target.value);
                  }}
                  onFocus={()=>{
                    setFocus(true);
                  }}
                  onBlur={()=>setFocus(false)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if(e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                {focus && value.length < 1 && (
                  <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                    엔터 시 저장
                  </span>
                )}
              </div>
            </div>
            { data.map((item, index) => (
            <div key={index}>
              {item.memo}
            </div>
            ))}</>}
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  )
}

export default GlobalMemo;