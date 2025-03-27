import { RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Button, InputRef, Switch } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { patchAPI } from "@/api/patch";

import { SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import { useBase } from "@/data/context/BaseContext";

import AntdTable from "../List/AntdTable";
import SalesModelHead from "./SalesModelHead";
import { salesOrderModelClmn } from "./Column";
import FullChip from "../Chip/FullChip";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdInput from "../Input/AntdInput";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import { PlusOutlined } from "@ant-design/icons";
import { LabelThin } from "../Text/Label";
import { modelsType } from "@/data/type/sayang/models";
import { selectType } from "@/data/type/componentStyles";
import { BoardGroupType, boardType } from "@/data/type/base/board";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";

interface LogEntry {
  date: Date | Dayjs | null;
  content: string;
  isApproved: boolean;
}

interface Props {
  data: salesOrderProcuctCUType[];
  setData: React.Dispatch<SetStateAction<salesOrderProcuctCUType[]>>;
  selectId: string | null;
  newFlag: boolean;
  setDeleted: React.Dispatch<SetStateAction<boolean>>;
  inputRef: RefObject<InputRef[]>;
  handleSubmitOrderModel: (model:salesOrderProcuctCUType) => void;
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
}

const SalesModelTable:React.FC<Props> = ({
  data,
  setData,
  selectId,
  newFlag,
  setDeleted,
  inputRef,
  handleSubmitOrderModel,
  showToast,
}) => {
  // 베이스 값 가져오기
  const { 
    boardSelectList,
    metarialSelectList,
    unitSelectList,
    vcutSelectList,
    outSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    spPrintSelectList,
    spTypeSelectList,
    surfaceSelectList,
  } = useBase();

  // ------------ 원판그룹(제조사) ------------ 시작
  const [boardGroupSelectList, setBoardGroupSelectList] = useState<selectType[]>([]);
  const [boardGroup, setBoardGroup] = useState<BoardGroupType[]>([]);
  const { refetch:refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board-group/jsxcrud/many'
      });

      if (result.resultCode === "OK_0000") {
        const bg = (result.data?.data ?? []) as BoardGroupType[];
        const arr = bg.map((d:BoardGroupType) => ({
          value: d.id,
          label: d.brdGrpName,
        }))
        setBoardGroup(bg);
        setBoardGroupSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 원판그룹(제조사) ------------ 끝

  // 테이블에서 값 변경했을 때 실행되는 함수 (모델의 값 변경 시 실행 함수)
  const handleModelDataChange = (
    id: string,
    name: string,
    value: any
  ) => {
    // 데이터를 복사
    const updatedData = data.map((item) => {
      console.log(value);
      if (item.id === id) {
        const keys = name.split(".");
        const updatedItem = { ...item };
  
        // 마지막 키를 제외한 객체 탐색
        const lastKey = keys.pop()!;
        let targetObject: any = updatedItem;
  
        keys.forEach((key) => {
          // 중간 키가 없거나 null인 경우 초기화
          if (!targetObject[key] || typeof targetObject[key] !== "object") {
            targetObject[key] = {};
          }
          targetObject = targetObject[key];
        });
  
        // 최종 키에 새 값 할당
        targetObject[lastKey] = value;
  
        return updatedItem;
      }
      return item; // 다른 데이터는 그대로 유지
    });

    setData(updatedData); // 상태 업데이트
  }; 

  // 테이블에서 모델 검색을 통해 모델을 선택했을 경우 실행되는 함수
  const handleModelChange = (
    model: modelsType,
    productId: string,
  ) => {
    const newData = [...data];
    const index = newData.findIndex(f => f.id === productId);
    if(index > -1) {
      newData[index] = {
        ...newData[index],
        currPrdInfo: { ...model },
        orderTit: model.prdNm,
        modelId: model.id,
        prdMngNo: model.prdMngNo,
      };
      setData(newData);
      console.log(newData);
    }
  }

  const handleDelete = (model:salesOrderProcuctCUType) => {
    if(model?.id?.includes("new")) {
      setData(data.filter(f => f.id !== model.id));
    } else {
      const updateData = data;
      const index = data.findIndex(f=> f.id === model.id);
      if(index > -1) {
        updateData[index] = { ...updateData[index], disabled: true };

        const newArray = [
          ...updateData.slice(0, index),
          updateData[index],
          ...updateData.slice(index + 1)
        ];
        setData(newArray);
        setDeleted(true);
      }
    }
  }

  // 수정 영역 표시 여부 (모델 단위)
  const [visibleEdit, setVisibleEdit] = useState<{ [modelId: string]: boolean }>({});
  // 신규 로그들을 배열로 관리 (모델별)
  const [editLogs, setEditLogs] = useState<{ [modelId: string]: LogEntry[] }>({});

  // 신규 로그 배열의 특정 인덱스를 업데이트하는 함수
  const updateEditLogEntry = (
    modelId: string,
    index: number,
    updatedLog: Partial<LogEntry>
  ) => {
    setEditLogs((prev) => {
      const logs = prev[modelId] ? [...prev[modelId]] : [];
      const newLog = { ...logs[index], ...updatedLog };
      logs[index] = newLog;
      return { ...prev, [modelId]: logs };
    });
  };

  // "추가" 버튼을 누르면 해당 모델의 신규 로그 배열에 빈 로그 추가
  const addNewLogEntry = (modelId: string) => {
    setEditLogs((prev) => {
      const logs = prev[modelId] ? [...prev[modelId]] : [];
      logs.push({ date: dayjs(), content: "", isApproved: false });
      return { ...prev, [modelId]: logs };
    });
  };

  // handleEdit: 수정 영역 토글 및 포커스 처리 (첫번째 로그의 입력 필드에 포커스)
  const editInputRefs = useRef<{ [modelId: string]: InputRef | null }>({});
  const handleEdit = (model: salesOrderProcuctCUType) => {
    setVisibleEdit((prev) => {
      const newVisible = !prev[model.id ?? ""];
      if (newVisible) {
        // 수정 영역이 표시되면 100ms 후 첫번째 로그 입력 필드에 포커스
        setTimeout(() => {
          const ref = editInputRefs.current[model.id ?? ""];
          if (ref && ref.focus) {
            ref.focus();
          }
        }, 100);
      }
      return { ...prev, [model.id ?? ""]: newVisible };
    });
    // 만약 해당 모델의 로그 배열이 없다면 초기화
    if (!editLogs[model.id ?? ""]) {
      setEditLogs((prev) => ({ ...prev, [model.id ?? ""]: [{ date: dayjs(), content: "", isApproved: false }] }));
    }
  };

  const handleSubmit = async (model: salesOrderProcuctCUType, logs: LogEntry[]) => {
    try {
      if (model?.id) {
        const newLogs = logs.map((log) => ({
          date: log.date ? dayjs(log.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
          content: log.content,
          isApproved: log.isApproved,
        }))
        const result = await patchAPI(
          {
            type: "core-d1",
            utype: "tenant/",
            url: `sales-order/product/default/edit-change-log-at-glb-status/by-order-product-id/${model.id}`,
            jsx: "default",
            etc: true,
          },
          model.id,
          {
            logs: [
              ...(model.glbStatus?.json ?? []),
              ...newLogs
            ]
          }
        );

        if (result.resultCode === "OK_0000") {
          showToast("수정사항 저장 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          console.log(msg);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };

  useEffect(()=>{
    console.log(data)
  }, [data])

  return (
    <div className="gap-40 flex flex-col overflow-auto">
    { data.length > 0 && data
      // 삭제되지 않은 모델만 가져오기
      .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
      .map((model:salesOrderProcuctCUType, index:number) => {
        const modelId = model.id ?? "";
        // 신규 로그 배열 아무것도 만약 없으면 기본 한 건을 보여줌
        const logsForModel: LogEntry[] = editLogs[modelId]
          || model.glbStatus?.json && model.glbStatus?.json?.length < 1 ? [] :
          [{ date: dayjs(), content: "", isApproved: false }];

      return (
        <div
          key={model.id}
          className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 px-15 min-w-[1820px]"
        >
          <SalesModelHead
            model={model}
            handleModelDataChange={handleModelDataChange}
            boardGroup={boardGroup}
            boardGroupSelectList={boardGroupSelectList}
            boardSelectList={boardSelectList}
            metarialSelectList={metarialSelectList}
            selectId={selectId}
            newFlag={newFlag}
            inputRef={inputRef}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleModelChange={handleModelChange}
          />
          <div className="flex flex-col ">
            <AntdTable
              columns={salesOrderModelClmn(
                data,
                setData,
                setDeleted,
                unitSelectList,
                vcutSelectList,
                outSelectList,
                smPrintSelectList,
                smColorSelectList,
                smTypeSelectList,
                mkPrintSelectList,
                mkColorSelectList,
                mkTypeSelectList,
                spPrintSelectList,
                spTypeSelectList,
                surfaceSelectList,
                handleModelDataChange,
                newFlag,
                selectId,
              )}
              data={[model]}
              styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px', td_bg:'#FFF', round:'0'}}
              tableProps={{split:'none'}}
            />
          </div>
          <div className="w-full h-center justify-end py-15">
          { model.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_COMPLETED &&
            <Button
              className="w-[109px] h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={()=>handleSubmitOrderModel(model)}
            >
              <Arrow /> 모델 저장
            </Button>
          }
          { model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED &&
            <FullChip label="확정" className="!w-[109px] !h-32" state="purple" />
          }
          </div>
          { model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED &&
            visibleEdit[model.id ?? ""] &&
            <div className="w-full bg-white mb-10 flex flex-col gap-5 px-10 pb-10">
              { model.glbStatus.json && model.glbStatus.json?.length > 0 && 
                model.glbStatus.json.map((item, idx) => (
                <div className="w-full h-40 h-center gap-10" key={idx}>
                  <div className="w-[110px]">{dayjs(item.date).format("YYYY-MM-DD")}</div>
                  <div className="flex-1">{item.content}</div>
                  <div className="w-[110px] h-center gap-5">
                    <LabelThin label="미승인" />
                    <Switch
                      checked={item.isApproved}
                      onChange={(checked) => {
                        // 모델의 json 배열에서 idx번째 항목의 isApproved 값을 업데이트
                        if(model.glbStatus?.json) {
                          const updatedJson = model.glbStatus.json.map((log, i) =>
                            i === idx ? { ...log, isApproved: checked } : log
                          );

                          // 변경된 updatedJson 배열을 해당 모델의 glbStatus.json에 저장
                          handleModelDataChange(model.id ?? "", "glbStatus.json", updatedJson);
                        }
                      }}
                      size="small"
                    />
                    <LabelThin label="승인" />
                  </div>
                </div>
              ))
              }
              {/* 신규 로그 입력 블록들 */}
              {logsForModel.map((log, idx) => (
                <div key={idx} className="w-full h-40 h-center gap-4">
                  <AntdDatePicker
                    value={log.date ?? dayjs()}
                    onChange={(e) =>
                      updateEditLogEntry(modelId, idx, { date: dayjs(e) })
                    }
                    suffixIcon="cal"
                    styles={{ bw: "0", bg: "none", pd: "0" }}
                    className="w-[110px]"
                    allowClear={false}
                  />
                  <div className="flex-1">
                    <AntdInput
                      ref={(el) => {
                        // 첫 번째 입력 필드에 포커스 처리용 참조 저장
                        if (idx === 0) {
                          editInputRefs.current[modelId] = el;
                        }
                      }}
                      value={log.content}
                      onChange={(e) =>
                        updateEditLogEntry(modelId, idx, { content: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-[110px] h-center gap-5">
                    <LabelThin label="미승인" />
                    <Switch
                      checked={log.isApproved}
                      onChange={(checked) =>
                        updateEditLogEntry(modelId, idx, { isApproved: checked })
                      }
                      size="small"
                    />
                    <LabelThin label="승인" />
                  </div>
                </div>
              ))}
              <div className="w-full v-between-h-center">
                <Button
                  onClick={() => addNewLogEntry(modelId)}
                  className="flex items-center"
                >
                  <PlusOutlined /> 추가
                </Button>
                <Button
                  className="h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                  onClick={() => handleSubmit(model, logsForModel)}
                ><Arrow /> 저장</Button>
              </div>
            </div>
          }
        </div>
      )})
    }
    </div>
  )
}

export default SalesModelTable;