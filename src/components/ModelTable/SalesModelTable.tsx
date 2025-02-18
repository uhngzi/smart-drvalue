import { ModelStatus, SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import { useBase } from "@/data/context/BaseContext";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Button, InputRef } from "antd";
import FullChip from "../Chip/FullChip";
import AntdTable from "../List/AntdTable";
import { sayangModelWaitAddClmn } from "@/data/columns/Sayang";
import FullOkButtonSmall from "../Button/FullOkButtonSmall";
import dayjs from "dayjs";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import { salesOrderModelClmn } from "./Column";
import { patchAPI } from "@/api/patch";

interface Props {
  data: salesOrderProcuctCUType[]
  setData: React.Dispatch<SetStateAction<salesOrderProcuctCUType[]>>;
  selectId: string;
  newFlag: boolean;
  setDeleted: React.Dispatch<SetStateAction<boolean>>;
}

const SalesModelTable:React.FC<Props> = ({
  data,
  setData,
  selectId,
  newFlag,
  setDeleted,
}) => {
  const [newProducts, setNewProducts] = useState<salesOrderProcuctCUType[]>([]);
  // 초기값 설정
  useEffect(()=>{ if(data.length > 0)   setNewProducts(data); }, [data]);

  // 첫 모델명 ref
  const inputRef = useRef<InputRef>(null);

  // 디폴트 값 가져오기
  const { 
    boardSelectList,
    metarialSelectList,
    surfaceSelectList,
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

  return (
    <div className="w-full border-1 bg-white  border-line rounded-14 p-20 flex flex-col overflow-auto gap-40">
    { data.length > 0 && data
      // 삭제되지 않은 모델만 가져오기
      .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
      .map((model:salesOrderProcuctCUType, index:number) => (
        <div className="flex flex-col gap-16" key={model.id}>
          <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
            <div className="h-full h-center gap-10 p-10">
              <p className="h-center justify-end">발주 모델명</p>
              <AntdInput
                ref={index === 0 ? inputRef : null}
                value={model.orderTit}
                className="w-[180px!important]" styles={{ht:'32px'}}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderTit', e.target.value)}
                readonly={selectId === model.id ? !newFlag : undefined}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
              <p className="h-center justify-end">고객측 관리번호</p>
              <AntdInput 
                value={model.prtOrderNo}
                className="w-[180px!important]" styles={{ht:'32px'}}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'prtOrderNo', e.target.value)}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
              <AntdSelect
                options={[
                  {value:ModelStatus.NEW,label:'신규'},
                  {value:ModelStatus.REPEAT,label:'반복'},
                  {value:ModelStatus.MODIFY,label:'수정'},
                ]}
                value={model.modelStatus}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'modelStatus', e)}
                className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
            </div>
            <div className="w-1 h-60" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
            <div className="h-full h-center gap-10 p-10">
              <p className="h-center justify-end">원판 </p>
              <AntdSelect
                options={boardSelectList}
                value={model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.board.id', e)}
                className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
              <p className="h-center justify-end">제조사 </p>
              <AntdInput 
                value={model.currPrdInfo?.mnfNm}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.mnfNm', e.target.value)}
                className="w-[120px!important]" styles={{ht:'32px'}}
                readonly={selectId === model.id ? !newFlag : undefined}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
              <p className="h-center justify-end">재질 </p>
              <AntdSelect
                options={metarialSelectList}
                value={model.currPrdInfo.material?.id ?? metarialSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.material.id', e)}
                className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
            </div>
            <div className="w-1 h-60" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
            <div className="h-full h-center gap-10 p-10">
              <p className="h-center justify-end">납기</p>
              <AntdDatePicker
                value={model.orderPrdDueDt}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)}
                suffixIcon={'cal'}
                styles={{bw:'0',bg:'none', pd:"0"}}
                placeholder=""
              />
              <p className="h-center justify-end">수량 </p>
              <AntdInput 
                value={model.orderPrdCnt}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdCnt', e.target.value)}
                className="w-[120px!important]" styles={{ht:'32px'}} type="number"
                readonly={selectId === model.id ? !newFlag : undefined}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
              <p className="h-center justify-end">견적단가 </p>
              <AntdInput 
                value={model.orderPrdPrice}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdPrice', e.target.value)}
                className="w-[120px!important]" styles={{ht:'32px'}} type="number"
                readonly={selectId === model.id ? !newFlag : undefined}
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              />
            </div>
            <div className="flex-1 flex jutify-end">
            </div>
          </div>
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
              styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
              tableProps={{split:'none'}}
            />
          </div>
        </div>
      ))
    }
    </div>
  )
}

export default SalesModelTable;