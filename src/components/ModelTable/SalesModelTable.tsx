import { RefObject, SetStateAction } from "react";
import { Button, InputRef } from "antd";

import { SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import { useBase } from "@/data/context/BaseContext";

import AntdTable from "../List/AntdTable";
import SalesModelHead from "./SalesModelHead";
import { salesOrderModelClmn } from "./Column";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
interface Props {
  data: salesOrderProcuctCUType[];
  setData: React.Dispatch<SetStateAction<salesOrderProcuctCUType[]>>;
  selectId: string | null;
  newFlag: boolean;
  setDeleted: React.Dispatch<SetStateAction<boolean>>;
  inputRef: RefObject<InputRef[]>;
  handleSubmitOrderModel: (model:salesOrderProcuctCUType) => void;
}

const SalesModelTable:React.FC<Props> = ({
  data,
  setData,
  selectId,
  newFlag,
  setDeleted,
  inputRef,
  handleSubmitOrderModel,
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

  return (
    <div className="gap-40 flex flex-col overflow-auto">
    { data.length > 0 && data
      // 삭제되지 않은 모델만 가져오기
      .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
      .map((model:salesOrderProcuctCUType, index:number) => (
        <div
          key={model.id}
          className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 px-15"
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
            <Button
              className="w-109 h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={()=>handleSubmitOrderModel(model)}
            >
              <Arrow /> 모델 저장
            </Button>
          </div>
        </div>
      ))
    }
    </div>
  )
}

export default SalesModelTable;