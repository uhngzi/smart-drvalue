import { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Checkbox, Empty, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";

import useToast from "@/utils/useToast";

import Close from "@/assets/svg/icons/l_close.svg";
import Back from "@/assets/svg/icons/back.svg";
import Memo from "@/assets/svg/icons/memo.svg";

import { TabSmall } from "@/components/Tab/Tabs";
import AntdSelect from "@/components/Select/AntdSelect";

import { selectType } from "@/data/type/componentStyles";
import PopupPortal from "./PopupPortal";

type Memo = {
  createdAt?: Date | Dayjs | null;
  id?: string;
  memo?: string;
  extraKey?: string;
  metaData?: {
    teamIdx?: string;
    shared?: boolean;
    cancel?: boolean;
    canceldAt?: Date | Dayjs | null;
    empIdx?: string;
    empName?: string;
    canceldEmpName?: string;
  };
};

enum Entity {
  RnTenantCbizSalesOrderProductEntity = "고객발주 모델",
  RnTenantCbizSalesOrderEntity = "고객발주",
  RnTenantCbizModelEntity = "모델",
  // RnTenantCbizBizPartnerMngMatchEntity = "업체 담당자",
  RnTenantCbizBizPartnerEntity = "업체",
  RnTenantCbizWorksheetEntity = "생산",
  RnTenantCbizBizPartnerManagerEntity = "업체 담당자",
}

interface Props {
  id: string;
  entityName?: string;
  entityRelation?: any;
  relationIdx?: string;

  modelId?: string;
  partnerId?: string;
  partnerMngId?: string;
}

const GlobalMemo: React.FC<Props> = ({
  id,
  entityName,
  entityRelation,
  relationIdx,

  modelId,
  partnerId,
  partnerMngId,
}) => {
  const { showToast, ToastContainer } = useToast();

  const [selectKey, setSelectKey] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // 메모 리스트 가져오기
    if (id && open) handleList();
  }, [open]);

  const [relationOptions, setRelationOptions] = useState<selectType[]>([]);
  useEffect(() => {
    // 관계에 모델이 포함되어 있을 경우
    if (
      JSON.stringify(relationOptions).includes("RnTenantCbizModelEntity") &&
      modelId
    )
      handleListRelation("RnTenantCbizModelEntity", modelId);

    // 관계에 업체가 포함되어 있을 경우
    if (
      JSON.stringify(relationOptions).includes(
        "RnTenantCbizBizPartnerEntity"
      ) &&
      partnerId
    )
      handleListRelation("RnTenantCbizBizPartnerEntity", partnerId);

    // 관계에 업체 담당자가 포함되어 있을 경우
    if (
      JSON.stringify(relationOptions).includes(
        "RnTenantCbizBizPartnerManagerEntity"
      ) &&
      partnerMngId
    )
      handleListRelation("RnTenantCbizBizPartnerManagerEntity", partnerMngId);
  }, [relationOptions, modelId, partnerId, partnerMngId]);

  // --------------- 리스트 데이터 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<Memo[]>([]);
  const [selectedRelationKey, setSelectedRelationKey] = useState<string | null>(
    null
  );
  const [relationsData, setRelationsData] = useState<any[]>([]);
  const handleList = async () => {
    try {
      setDataLoading(true);

      const result = await postAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          jsx: "default",
          url: "global-memo/default/find-relation-memo",
          etc: true,
        },
        {
          startIdx: id,
          startEntityName: entityName,
          entityRelation: entityRelation,
          relationIdx: relationIdx,
        }
      );

      if (result.resultCode === "OK_0000") {
        const memos = result.data?.data?.memos ?? [];
        const relations = (result.data?.data?.relations as any[]) ?? [];
        setRelationsData(relations);

        let keys: string[] = [];
        relations.map((item) => {
          keys.push(Object.keys(item).toString());
        });
        keys = keys.filter(
          (f) => !f.includes("RnTenantCbizBizPartnerMngMatchEntity")
        );

        const relationOptions = keys.map((key) => ({
          value: key,
          label: Entity[key as keyof typeof Entity] ?? key, // 없으면 key 그대로 표시
        }));
        setRelationOptions(relationOptions);
        if (keys.length > 0) setSelectedRelationKey(keys[0]);

        setData(memos);
        setRelationsData(relations);
        setDataLoading(false);

        if (newInputRef && newInputRef.current) {
          newInputRef.current.focus();
        }
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
        setDataLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // --------------- 리스트 데이터 ------------ 끝

  // ------------- 관계 리스트 데이터 ---------- 시작
  const [dataModel, setDataModel] = useState<Memo[]>([]);
  const [dataPrt, setDataPrt] = useState<Memo[]>([]);
  const [dataPrtMng, setDataPrtMng] = useState<Memo[]>([]);
  const handleListRelation = async (entity: string, id: string) => {
    try {
      const result = await postAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          jsx: "default",
          url: "global-memo/default/find-relation-memo",
          etc: true,
        },
        {
          startIdx: id,
          startEntityName: entity,
        }
      );

      if (result.resultCode === "OK_0000") {
        const memos = result.data?.data?.memos ?? [];
        if (entity === "RnTenantCbizModelEntity") setDataModel(memos);
        else if (entity === "RnTenantCbizBizPartnerEntity") setDataPrt(memos);
        else if (entity === "RnTenantCbizBizPartnerManagerEntity")
          setDataPrtMng(memos);
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ------------- 관계 리스트 데이터 ---------- 끝

  // ---------------- 메모 등록 -------------- 시작
  const handleSubmit = async (id: string) => {
    try {
      const result = await postAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          jsx: "default",
          url: "global-memo",
        },
        {
          memo: value,
          extraKey: id,
          shared: shared,
        }
      );

      if (result.resultCode === "OK_0000") {
        setValue("");
        setShared(true);
        handleList();
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
        setDataLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ---------------- 메모 등록 -------------- 끝

  // ---------------- 메모 삭제 -------------- 시작
  const handleDelete = async (id: string, cancel: boolean) => {
    try {
      const result = await patchAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          jsx: "default",
          url: `global-memo/default/update-cancel/${id}/${cancel}`,
          etc: true,
        },
        id
      );

      if (result.resultCode === "OK_0000") {
        if (cancel) showToast("취소 완료", "success");
        else showToast("복구 완료", "success");
        handleList();
      } else {
        const msg = result?.response?.data?.message;
        console.log(msg);
        setDataLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ---------------- 메모 삭제 -------------- 끝

  const [shared, setShared] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const newInputRef = useRef<HTMLInputElement>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window !== "undefined" && open) {
      const initialX = window.innerWidth - 420; // 모달 너비(400px) + 여유 20px
      setPos({ x: initialX, y: 20 }); // 상단에서 20px
    }
  }, [open]);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    setDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging || !modalRef.current) return;

      const el = modalRef.current;
      const modalW = el.offsetWidth;
      const modalH = el.offsetHeight;

      let nextX = e.clientX - offset.current.x;
      let nextY = e.clientY - offset.current.y;

      // 화면 바깥으로 안 나가게 clamp
      nextX = Math.max(0, Math.min(nextX, window.innerWidth - modalW));
      nextY = Math.max(0, Math.min(nextY, window.innerHeight - modalH));

      setPos({
        x: nextX,
        y: nextY,
      });
    };

    const onMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setOpen(true)}
        icon={
          <p className="w-16 h-16">
            <Memo />
          </p>
        }
        className="border-0 shadow-none w-32 h-32"
      />

      <AnimatePresence>
        {open && (
          <PopupPortal>
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed z-[999] p-4 bg-white shadow-lg border rounded-md flex flex-col gap-10 !p-10"
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: 400,
                maxHeight: 500,
                overflow: "auto",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 6,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: "12px",
              }}
            >
              <div
                className="v-between-h-center cursor-move"
                onMouseDown={onMouseDown}
              >
                <TabSmall
                  items={[
                    {
                      key: 0,
                      text: "메모 목록 및 등록",
                    },
                    {
                      key: 1,
                      text: "관련 메모",
                    },
                  ]}
                  selectKey={selectKey}
                  setSelectKey={setSelectKey}
                />
                <CloseOutlined
                  className="w-16 h-16 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              {dataLoading && <Skeleton active />}
              {selectKey === 0 && !dataLoading && (
                <>
                  <div className="h-center">
                    <div className="relative flex-1 pr-10">
                      <input
                        ref={newInputRef}
                        className="w-full h-36 px-5 rounded-2 border-1 border-line focus:outline-none focus:ring-2 focus:ring-[#0593ff20]"
                        value={value}
                        onChange={(e) => {
                          setValue(e.target.value);
                        }}
                        onFocus={() => {
                          setFocus(true);
                        }}
                        onBlur={() => setFocus(false)}
                        onKeyDown={(e) => {
                          if (e.nativeEvent.isComposing) return;
                          if (e.key === "Enter") {
                            handleSubmit(id);
                          }
                        }}
                      />
                      {focus && value.length < 1 && (
                        <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                          엔터 시 저장
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col v-h-center">
                      <span className="text-12">공개</span>
                      <Checkbox
                        checked={shared}
                        onChange={(e) => setShared(e.target.checked)}
                      />
                    </div>
                  </div>
                  {data.length < 1 && <Empty description="메모가 없습니다." />}
                  {data.length > 0 &&
                    data.map((item, index) => (
                      <div
                        key={index}
                        className={`h-center text-left px-5 py-1 border-b-1 border-line gap-8 ${
                          item.metaData?.cancel
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {item.memo}
                        {!item.metaData?.cancel ? (
                          <p
                            className="w-12 h-12 text-[#00000040] cursor-pointer"
                            onClick={() => {
                              handleDelete(item.id ?? "", true);
                            }}
                          >
                            <Close />
                          </p>
                        ) : (
                          <p
                            className="w-12 h-12 text-[#FF000098] cursor-pointer"
                            onClick={() => {
                              handleDelete(item.id ?? "", false);
                            }}
                          >
                            <Back />
                          </p>
                        )}
                      </div>
                    ))}
                </>
              )}
              {selectKey === 1 &&
                (() => {
                  if (!selectedRelationKey)
                    return <Empty description="관련 메모가 없습니다." />;

                  // entity에 따른 데이터 선택
                  let selectedMemos: Memo[] = [];
                  if (
                    (entityName || relationIdx) &&
                    modelId &&
                    selectedRelationKey === "RnTenantCbizModelEntity"
                  ) {
                    selectedMemos = dataModel;
                  } else if (
                    (entityName || relationIdx) &&
                    modelId &&
                    selectedRelationKey === "RnTenantCbizBizPartnerEntity"
                  ) {
                    selectedMemos = dataPrt;
                  } else if (
                    (entityName || relationIdx) &&
                    partnerMngId &&
                    selectedRelationKey ===
                      "RnTenantCbizBizPartnerManagerEntity"
                  ) {
                    selectedMemos = dataPrtMng;
                  } else {
                    // fallback (relationsData 기반)
                    selectedMemos =
                      relationsData.find(
                        (item) => selectedRelationKey in item
                      )?.[selectedRelationKey] ?? [];
                  }
                  // const selectedMemos = relationsData.find(item => selectedRelationKey in item)?.[selectedRelationKey] ?? [];

                  return (
                    <>
                      <AntdSelect
                        options={relationOptions}
                        value={selectedRelationKey}
                        onChange={(value) => setSelectedRelationKey(value + "")}
                      />
                      {selectedRelationKey && (
                        <div className="flex flex-col gap-6 mt-10">
                          {selectedMemos.length === 0 ? (
                            <Empty description="메모가 없습니다." />
                          ) : (
                            selectedMemos.map(
                              (memoItem: Memo, index: number) => (
                                <div
                                  key={memoItem.id + ":" + index}
                                  className="w-full flex flex-col"
                                >
                                  <div
                                    key={index + ":" + memoItem.id}
                                    className={`h-center text-left px-5 py-1 border-b-1 border-line gap-8 ${
                                      memoItem.metaData?.cancel
                                        ? "line-through text-gray-400"
                                        : ""
                                    }`}
                                  >
                                    {memoItem.memo}
                                    {!memoItem.metaData?.cancel ? (
                                      <p
                                        className="w-12 h-12 text-[#00000040] cursor-pointer"
                                        onClick={() =>
                                          handleDelete(memoItem.id ?? "", true)
                                        }
                                      >
                                        <Close />
                                      </p>
                                    ) : (
                                      <p
                                        className="w-12 h-12 text-[#FF000098] cursor-pointer"
                                        onClick={() =>
                                          handleDelete(memoItem.id ?? "", false)
                                        }
                                      >
                                        <Back />
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            )
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
            </motion.div>
          </PopupPortal>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

export default GlobalMemo;
