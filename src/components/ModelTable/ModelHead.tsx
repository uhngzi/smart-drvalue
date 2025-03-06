import dayjs from "dayjs";
import { Button, InputRef } from "antd";
import { RefObject } from "react";

import { selectType } from "@/data/type/componentStyles";
import { orderModelType } from "@/data/type/sayang/models";
import { ModelStatus, SalesOrderStatus, SpecStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import FullChip from "../Chip/FullChip";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";

const Label:React.FC<{label:string}> = ({ label }) => {
  return <p className="h-center">{label}</p>
}

const Divider:React.FC = () => {
  return <div className="w-1 h-60" style={{borderLeft:"0.3px solid #B9B9B9"}}/>;
}

interface Props {
  model: orderModelType;
  handleModelDataChange: (id: string, name: string, value: any) => void;
  selectId: string | null;
  newFlag: boolean;
  boardSelectList: selectType[];
  metarialSelectList: selectType[];
  inputRef?: RefObject<InputRef[]>;
  index?: number;
}

const ModelHead:React.FC<Props> = ({
  model,
  handleModelDataChange,
  selectId,
  newFlag,
  boardSelectList,
  metarialSelectList,
  inputRef,
  index,
}) => {
  return (
    <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
      <div className="h-full h-center gap-10 p-10">
        <div className="flex flex-col">
          <Label label={"발주명"}/>
          <AntdInput
            value={model.orderTit}
            readonly={true}
            className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}}
            disabled={model.completed}
          />
        </div>

        <div className="flex flex-col">
          <Label label={"관리번호"}/>
          <AntdInput
            value={model.prtOrderNo}
            readonly={true}
            className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}}
            disabled={model.completed}
          />
        </div>

        <AntdSelect
          options={[
            {value:ModelStatus.NEW,label:'신규'},
            {value:ModelStatus.REPEAT,label:'반복'},
            {value:ModelStatus.MODIFY,label:'수정'},
          ]}
          value={model.modelStatus}
          onChange={(e)=>{
            handleModelDataChange(model.id ?? '', 'modelStatus', e);
          }}
          className="w-[54px!important]" styles={{ht:'32px', bw:'0px', pd:'0'}}
          disabled={model.completed ?? selectId === model.id ? !newFlag : undefined}
        />
      </div>

      <Divider />
      
      <div className="h-full h-center gap-10 p-10">
        <div className="flex flex-col">
          <Label label="모델명" />
          <AntdInput
            ref={el => {
              // 자동 스크롤 & 포커싱을 위해 Ref 추가
              if(el && inputRef && inputRef.current && index !== undefined) {
                inputRef.current[index] = el;
              }
            }}
            value={(model as orderModelType)?.tempPrdInfo?.prdNm ?? model.orderTit}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.prdNm', e.target.value);
              handleModelDataChange(model.id ?? '', 'editModel.prdNm', e.target.value);
              handleModelDataChange(model.id ?? '', 'model.prdNm', e.target.value);
            }}
            className="w-[180px!important]" styles={{ht:'32px'}}
            readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.completed}
          />
        </div>

        <div className="flex flex-col">
          <Label label="원판" />
          <AntdSelect
            options={boardSelectList}
            value={model?.tempPrdInfo?.board?.id ?? model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
            onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'model.board.id', e)
                handleModelDataChange(model.id ?? '', 'tempPrdInfo.board.id', e)
            }}
            className="w-[125px!important]" styles={{ht:'32px', bw:'0px', pd:'0'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        </div>

        <div className="flex flex-col">
          <Label label="제조사" />
          <AntdInput 
            value={(model as orderModelType)?.tempPrdInfo?.mnfNm ?? model.currPrdInfo?.mnfNm}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'model.mnfNm', e.target.value)
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.mnfNm', e.target.value)
            }}
            className="w-[120px!important]" styles={{ht:'32px'}}
            readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        </div>

        <div className="flex flex-col">
          <Label label="재질" />
          <AntdSelect
            options={metarialSelectList}
            value={(model as orderModelType)?.tempPrdInfo?.material?.id ?? model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value
            }
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'model.material.id', e)
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.material.id', e)
            }}
            className="w-[155px!important]" styles={{ht:'32px', bw:'0px', pd:'0'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        </div>
      </div>

      <Divider />

      <div className="h-full h-center gap-10 p-10">
        <div className="flex flex-col">
          <Label label="납기" />
          <AntdDatePicker
            value={model?.tempPrdInfo.orderPrdDueDt ?? model.orderPrdDueDt}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.orderPrdDueDt', e)
              // handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)
            }}
            suffixIcon={'cal'}
            styles={{bw:'0',bg:'none', pd:"0"}}
            className="!w-[106px] !h-32"
            placeholder=""
            afterDate={new Date()}
          />
        </div>
      </div>

      <div className="flex-1 flex jutify-end">
      { (model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_WAITING) &&
        !model.completed && !(model as orderModelType).temp &&
        <FullChip label="대기중" state="yellow" className="!mr-20 !w-80 !h-30"/>
      }
      { (model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_REGISTERING) ||
        (!model.completed && (model as orderModelType).temp) ?
        <FullChip label="등록중" state="mint" className="!mr-20 !w-80 !h-30"/> : <></>
      }
      { model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED &&<>
        <FullChip label="확정" state="purple" className="!mr-20 !w-80 !h-30"/>
        <p className="h-center">저장일 : {dayjs(model.updatedAt).format("YYYY-MM-DD")}</p>
      </>}
      { model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_DISCARDED &&
        <FullChip label="폐기" className="!mr-20 !w-80 !h-30"/>
      }
      { !model.completed && (model as orderModelType).temp && <>
        {/* <FullChip label="임시저장 완료" className="!mr-20 !w-[120px] !h-30"/> */}
        <p className="h-center text-11">{dayjs(model.updatedAt).format("YYYY-MM-DD HH:mm")} 임시저장 완료</p>
      </>}
      </div>
    </div>
  )
}

export default ModelHead;