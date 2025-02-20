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

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";

const Label:React.FC<{label:string}> = ({ label }) => {
  return <p className="h-center justify-end">{label}</p>
}

const Divider:React.FC = () => {
  return <div className="w-1 h-60" style={{borderLeft:"0.3px solid #B9B9B9"}}/>;
}

interface Props {
  type: 'order' | 'match';
  model: orderModelType | salesOrderProcuctCUType;
  handleModelDataChange: (id: string, name: string, value: any) => void;
  selectId: string | null;
  newFlag: boolean;
  boardSelectList: selectType[];
  metarialSelectList: selectType[];
  inputRef?: RefObject<InputRef[]>;
  index?: number;
  handleSubmitOrderModel?: () => void;
}

const ModelHead:React.FC<Props> = ({
  type,
  model,
  handleModelDataChange,
  selectId,
  newFlag,
  boardSelectList,
  metarialSelectList,
  inputRef,
  index,
  handleSubmitOrderModel,
}) => {
  return (
    <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
      <div className="h-full h-center gap-10 p-10">
        <Label label={type === 'order' ? "발주 모델명" :"발주명"}/>
        <AntdInput
          ref={el => {
            // 자동 스크롤 & 포커싱을 위해 Ref 추가
            const m = model as salesOrderProcuctCUType;
            if(type === 'order' && el &&inputRef && inputRef.current && m.index) {
              inputRef.current[m.index] = el;
            }
          }}
          value={model.orderTit}
          onChange={(e)=>{
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'orderTit', e.target.value);
          }}
          readonly={type === 'order' ? selectId === model.id ? !newFlag : undefined : true}
          className="w-[180px!important]" styles={{ht:'32px', bg:type==='order'?'#FFF':'#F5F5F5'}}
          disabled={model.completed}
        />

        <Label label={type === 'order'? "고객측 관리번호" : "관리번호"}/>
        <AntdInput
          value={model.prtOrderNo}
          onChange={(e)=>{
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'prtOrderNo', e.target.value);
          }}
          readonly={type === "order" ? false : true}
          className="w-[180px!important]" styles={{ht:'32px', bg:type==='order'?'#FFF':'#F5F5F5'}}
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
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'modelStatus', e);
            else
              handleModelDataChange(model.id ?? '', 'model.modelStatus', e)
          }}
          className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ?? selectId === model.id ? !newFlag : undefined}
        />
      </div>

      <Divider />
      
      <div className="h-full h-center gap-10 p-10">
        { type === 'match' &&
          <>
            <Label label="모델명" />
            <AntdInput
              ref={el => {
                // 자동 스크롤 & 포커싱을 위해 Ref 추가
                if(el && inputRef && inputRef.current && index !== undefined) {
                  inputRef.current[index] = el;
                }
              }}
              value={(model as orderModelType).model?.prdNm}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'model.prdNm', e.target.value)}
              className="w-[180px!important]" styles={{ht:'32px'}}
              readonly={selectId === model.id ? !newFlag : undefined}
              disabled={model.completed}
            />
          </>
        }

        <Label label="원판" />
        <AntdSelect
          options={boardSelectList}
          value={(type === 'match' ?
              ((model as orderModelType).model?.board?.id ?? model.currPrdInfo?.board?.id) :
              model.currPrdInfo?.board?.id
            ) ??
            boardSelectList?.[0]?.value
          }
          onChange={(e)=>{
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'currPrdInfo.board.id', e);
            else
              handleModelDataChange(model.id ?? '', 'model.board.id', e)
          }}
          className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
        />

        <Label label="제조사" />
        <AntdInput 
          value={type === 'match' ?
            ((model as orderModelType).model?.mnfNm ?? model.currPrdInfo?.mnfNm) :
            model.currPrdInfo?.mnfNm
          }
          onChange={(e)=>{
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'currPrdInfo.mnfNm', e.target.value);
            else
              handleModelDataChange(model.id ?? '', 'model.mnfNm', e.target.value)
          }}
          className="w-[120px!important]" styles={{ht:'32px'}}
          readonly={selectId === model.id ? !newFlag : undefined}
          disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
        />

        <Label label="재질" />
        <AntdSelect
          options={metarialSelectList}
          value={(type === 'match' ?
              ((model as orderModelType).model?.material?.id ?? model.currPrdInfo?.material?.id) :
              model.currPrdInfo?.material?.id
            ) ??
            metarialSelectList?.[0]?.value
          }
          onChange={(e)=>{
            if(type === 'order')
              handleModelDataChange(model.id ?? '', 'currPrdInfo.material.id', e);
            else
              handleModelDataChange(model.id ?? '', 'model.material.id', e)
          }}
          className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
          disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
        />
      </div>

      <Divider />

      <div className="h-full h-center gap-10 p-10">
        <Label label="납기" />
        { type === 'match' &&
          <p className="h-center justify-end">{
            model.orderPrdDueDt ?
            dayjs(model.orderPrdDueDt).format('YYYY-MM-DD') : null
          }</p>
        }
        
        { type === 'order' && <>
          <AntdDatePicker
            value={model.orderPrdDueDt}
            onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)}
            suffixIcon={'cal'}
            styles={{bw:'0',bg:'none', pd:"0"}}
            placeholder=""
          />

          <Label label="수주 수량" />
          <AntdInput 
            value={model.orderPrdCnt}
            onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdCnt', e.target.value)}
            className="w-[120px!important]" styles={{ht:'32px'}} type="number"
            // readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
          />

          <Label label="수주 금액" />
          <AntdInput 
            value={model.orderPrdPrice}
            onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdPrice', e.target.value)}
            className="w-[120px!important]" styles={{ht:'32px'}} type="number"
            // readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
          />

          <Button
            className="w-109 h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={handleSubmitOrderModel}
          >
            <Arrow /> 모델 저장
          </Button>
        </>}
      </div>

      <div className="flex-1 flex jutify-end">
      { type === 'match' && model.completed && 
        <FullChip label="확정" state="mint" className="!mr-20 !w-80 !h-30"/>
      }
      { type === 'match' && (model as orderModelType).temp && 
        <FullChip label="임시저장" state="yellow" className="!mr-20 !w-80 !h-30"/>
      }
      </div>
    </div>
  )
}

export default ModelHead;