import { Dropdown, InputRef, Space } from "antd";
import { RefObject } from "react";
import dayjs from "dayjs";

import { selectType } from "@/data/type/componentStyles";
import { ModelStatus, SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";

import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";

const Label:React.FC<{label:string}> = ({ label }) => {
  return <p className="h-center">{label}</p>
}

const Divider:React.FC = () => {
  return <div className="w-1 h-60" style={{borderLeft:"0.3px solid #B9B9B9"}}/>;
}

interface Props {
  read?: boolean;
  model: salesOrderProcuctCUType;
  handleModelDataChange: (id: string, name: string, value: any) => void;
  selectId: string | null;
  newFlag: boolean;
  boardSelectList: selectType[];
  metarialSelectList: selectType[];
  inputRef?: RefObject<InputRef[]>;
  index?: number;
  handleDelete?: (model:salesOrderProcuctCUType) => void;
}

const SalesModelHead:React.FC<Props> = ({
  read,
  model,
  handleModelDataChange,
  selectId,
  newFlag,
  boardSelectList,
  metarialSelectList,
  inputRef,
  handleDelete,
}) => {
  return (
    <div className="w-full min-h-60 h-center">
      <div className="h-full h-center gap-20 p-10">
        { !read &&
          <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{model?.index}</p>
        }
        <div className="flex flex-col">
          <Label label="수주 모델명" />
          <AntdInput
            ref={el => {
              // 자동 스크롤 & 포커싱을 위해 Ref 추가
              if(el &&inputRef && inputRef.current && model.index) {
                inputRef.current[model.index] = el;
              }
            }}
            value={model.orderTit}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'orderTit', e.target.value);
            }}
            readonly={read ? true : selectId === model.id ? !newFlag : undefined}
            className="w-[180px!important]" styles={{ht:'32px', bg:'#FFF'}}
            disabled={model.completed}
          />
        </div>

        <div className="flex flex-col">
          <Label label="고객측 관리번호" />
          <AntdInput
            value={model.prtOrderNo}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'prtOrderNo', e.target.value);
            }}
            readonly={read}
            className="w-[180px!important]" styles={{ht:'32px', bg:'#FFF'}}
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
          className="w-[54px!important]"
          styles={selectId === model.id && !newFlag && model.modelStatus !== ModelStatus.REPEAT ?
            {ht:'32px', bw:'1px', bc:'#FAAD14', pd:'0'} :
            {ht:'32px', bw:'0', pd:'0'}
          }
          disabled={model.completed}
          // disabled={model.completed ?? selectId === model.id ? !newFlag : undefined}
          readonly={read}
        />
      </div>

      <Divider />
      
      <div className="h-full h-center gap-20 p-10">
        <div className="flex flex-col">
          <Label label="원판" />
          <AntdSelect
            options={boardSelectList}
            value={model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
            onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.board.id', e)}}
            className="w-[125px!important]" styles={{ht:'32px', bw:'0px', pd:'0'}}
            readonly={read}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        </div>
        <div className="flex flex-col">
          <Label label="제조사" />
          <AntdInput 
            value={model.currPrdInfo?.mnfNm}
            onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.mnfNm', e.target.value);}}
            className="w-[120px!important]" styles={{ht:'32px'}}
            readonly={read ? read : selectId === model.id ? !newFlag : undefined}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        </div>

        <div className="flex flex-col">
          <Label label="재질" />
          <AntdSelect
            options={metarialSelectList}
            value={model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value}
            onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.material.id', e)}}
            className="w-[155px!important]" styles={{ht:'32px', bw:'0px', pd:'0'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
            readonly={read}
          />
        </div>
      </div>

      <Divider />

      <div className="h-full h-center gap-20 p-10">
        { read && model.orderPrdDueDt ?<div className="flex flex-col">
          <Label label="납기" />
          <div className="h-32">{dayjs(model.orderPrdDueDt).format('YYYY-MM-DD')}</div>
        </div>: null}
        { !read && <>
          <div className="flex flex-col">
            <Label label="납기" />
            <AntdDatePicker
              value={model.orderPrdDueDt}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)}
              suffixIcon={'cal'}
              styles={{bw:'0',bg:'none', pd:"0"}}
              className="!w-[106px]"
              placeholder=""
              afterDate={new Date()}
            />
          </div>

          <div className="flex flex-col">
            <Label label="수주 수량" />
            <AntdInput 
              value={model.orderPrdCnt}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdCnt', e.target.value)}
              className="w-[120px!important]" styles={{ht:'32px'}} type="number"
              // readonly={selectId === model.id ? !newFlag : undefined}
              disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
            />
          </div>

          <div className="flex flex-col">
            <Label label="수주 금액" />
            <AntdInput 
              value={model.orderPrdPrice}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdPrice', e.target.value)}
              className="w-[120px!important]" styles={{ht:'32px'}} type="number"
              // readonly={selectId === model.id ? !newFlag : undefined}
              disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
            />
          </div>
        </>}
      </div>
      {
        !read &&
        <Dropdown trigger={['click']} menu={{ items:[{
          label: <div className="text-[red] h-center gap-5">
            <p className="w-16 h-16"><Trash /></p>
            삭제
          </div>,
          key: 0,
          onClick:()=>{handleDelete?.(model)}}
        ]}}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div className="w-24 h-24 cursor-pointer v-h-center">
                <p className="w-16 h-16"><Edit/></p>
              </div>
            </Space>
          </a>
        </Dropdown>
      }
    </div>
  )
}

export default SalesModelHead;