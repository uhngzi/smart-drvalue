import { RefObject, SetStateAction, useRef, useState } from "react";
import { Button, InputRef, Switch } from "antd";
import dayjs, { Dayjs } from "dayjs";

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
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
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
  } = useBase();

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

  // 수정 영역 표시 여부를 모델 id별로 관리하는 상태
  const [visibleEdit, setVisibleEdit] = useState<{ [modelId: string]: boolean }>({});
  // 수정 영역 내 콘텐츠 부분 포커스를 위한 변수
  const editInputRefs = useRef<{ [modelId: string]: InputRef | null }>({});

  const [editLogs, setEditLogs] = useState<{
    [modelId: string]: { date: Date | Dayjs | null; content: string; isApproved: boolean };
  }>({});
  const updateEditLog = (
    modelId: string,
    updatedLog: Partial<{ date: Date | Dayjs | null; content: string; isApproved: boolean }>
  ) => {
    setEditLogs((prev) => ({
      ...prev,
      [modelId]: {
        // 기존 값이 있다면 유지, 없으면 기본값 할당
        date: prev[modelId]?.date ?? dayjs(),
        content: prev[modelId]?.content ?? "",
        isApproved: prev[modelId]?.isApproved ?? false,
        ...updatedLog,
      },
    }));
  };

  const handleEdit = (model:salesOrderProcuctCUType) => {
    setVisibleEdit(prev => {
      const newVisible = !prev[model.id ?? ""];
      if(newVisible) {
        // visible로 전환되면 조금 딜레이 후 포커스
        setTimeout(() => {
          const ref = editInputRefs.current[model.id ?? ""];
          if(ref && ref.focus) {
            ref.focus();
          }
        }, 100);
      }
      return {
        ...prev,
        [model.id ?? ""]: newVisible,
      };
    });
  }

  const handleSubmit = async (
    model:salesOrderProcuctCUType,
    modelEditLog: {
      date: Date | Dayjs | null;
      content: string;
      isApproved: boolean;
  }) => {
    try {
      if(model?.id) {
        const result = await patchAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `sales-order/product/default/edit-change-log-at-glb-status/by-order-product-id/${model.id}`,
          jsx: 'default',
          etc: true,
        }, model.id, {
          logs: [{
            date: modelEditLog.date ?? dayjs().format("YYYY-MM-DD"),
            content: modelEditLog.content ?? "",
            isApproved: modelEditLog.isApproved ?? false,
          }]
        });

        if(result.resultCode === "OK_0000") {
          showToast("수정사항 저장 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          console.log(msg);
        }
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e)
    }
  }

  return (
    <div className="gap-40 flex flex-col overflow-auto">
    { data.length > 0 && data
      // 삭제되지 않은 모델만 가져오기
      .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
      .map((model:salesOrderProcuctCUType, index:number) => {
        // 모델 id를 이용해 개별 편집 로그를 가져옵니다.
        const modelEditLog = editLogs[model.id ?? ""] || { date: null, content: "", isApproved: false };

      return (
        <div
          key={model.id}
          className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 px-15 min-w-[1700px]"
        >
          <SalesModelHead
            model={model}
            handleModelDataChange={handleModelDataChange}
            boardSelectList={boardSelectList}
            metarialSelectList={metarialSelectList}
            selectId={selectId}
            newFlag={newFlag}
            inputRef={inputRef}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
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
            <div className="w-full h-50 bg-white mb-10 flex h-center gap-10 px-10">
              <AntdDatePicker
                value={modelEditLog.date ?? dayjs()}
                onChange={(e) =>
                  updateEditLog(model.id ?? "", { date: dayjs(e) })
                }
                styles={{ bw: "0", bg: "none", pd: "0" }}
                className="!w-[110px]"
              />
              <AntdInput
                ref={el => {
                  editInputRefs.current[model.id ?? ""] = el;
                }}
                value={modelEditLog.content}
                onChange={(e) =>
                  updateEditLog(model.id ?? "", { content: e.target.value })
                }
              />
              <div className="w-[130px] h-center gap-5">
                <LabelThin label="미승인" />
                <Switch
                  checked={modelEditLog.isApproved}
                  onChange={(checked) =>
                    updateEditLog(model.id ?? "", { isApproved: checked })
                  }
                  size="small"
                />
                <LabelThin label="승인" />
              </div>
              <Button
                className="h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={() => handleSubmit(model, modelEditLog)}
              ><PlusOutlined /> 수정사항 저장</Button>
            </div>
          }
        </div>
      )})
    }
    </div>
  )
}

export default SalesModelTable;