import dayjs from "dayjs";
import { Button, InputRef } from "antd";
import { RefObject } from "react";

import { selectType } from "@/data/type/componentStyles";
import { orderModelType } from "@/data/type/sayang/models";
import { ModelStatus, SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import FullChip from "../Chip/FullChip";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";

const Label:React.FC<{label:string}> = ({ label }) => {
  return <p className="h-center justify-end">{label}</p>
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
        <Label label={"발주명"}/>
        <AntdInput
          value={model.orderTit}
          readonly={true}
          className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}}
          disabled={model.completed}
        />

        <Label label={"관리번호"}/>
        <AntdInput
          value={model.prtOrderNo}
          readonly={true}
          className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}}
          disabled={model.completed}
        />

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
          className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ?? selectId === model.id ? !newFlag : undefined}
        />
      </div>

      <Divider />
      
      <div className="h-full h-center gap-10 p-10">
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

        <Label label="원판" />
        <AntdSelect
          options={boardSelectList}
          value={model?.tempPrdInfo?.board?.id ?? model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
          onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'model.board.id', e)
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.board.id', e)
          }}
          className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
        />

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

        <Label label="재질" />
        <AntdSelect
          options={metarialSelectList}
          value={(model as orderModelType)?.tempPrdInfo?.material?.id ?? model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value
          }
          onChange={(e)=>{
            handleModelDataChange(model.id ?? '', 'model.material.id', e)
            handleModelDataChange(model.id ?? '', 'tempPrdInfo.material.id', e)
          }}
          className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
        />
      </div>

      <Divider />

      <div className="h-full h-center gap-10 p-10">
        <Label label="납기" />
        <p className="h-center justify-end">{
          model.orderPrdDueDt ?
          dayjs(model.orderPrdDueDt).format('YYYY-MM-DD') : null
        }</p>
      </div>

      <div className="flex-1 flex jutify-end">
      { model.completed && 
        <FullChip label="확정" state="mint" className="!mr-20 !w-80 !h-30"/>
      }
      { !model.completed && (model as orderModelType).temp && 
        <FullChip label="임시저장" state="yellow" className="!mr-20 !w-80 !h-30"/>
      }
      </div>
    </div>
  )
}

export default ModelHead;