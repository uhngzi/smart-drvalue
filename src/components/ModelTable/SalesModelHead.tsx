import { Checkbox, Dropdown, InputRef, Space, Tooltip } from "antd";
import { RefObject, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";

import { selectType } from "@/data/type/componentStyles";
import { ModelStatus, ModelTypeEm, SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";

import Edit from "@/assets/svg/icons/edit.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import CustomAutoComplete from "../AutoComplete/CustomAutoComplete";
import { useQuery } from "@tanstack/react-query";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { modelsType } from "@/data/type/sayang/models";
import { getAPI } from "@/api/get";
import CustomAutoCompleteLabel from "../AutoComplete/CustomAutoCompleteLabel";
import { BoardGroupType, boardType } from "@/data/type/base/board";

const Label:React.FC<{label:string}> = ({ label }) => {
  return <p className="h-center">{label}</p>
}

const Item:React.FC<{
  children1: React.ReactNode;
  children2?: React.ReactNode;
  label1?: string;
  label2?: string;
  size1?: number;
  size2?: number;
}> = ({
  label1,
  label2,
  children1,
  children2,
  size1 = 2,
  size2 = 2,
}) => {
  return (
    <div className="flex flex-col gap-15 justify-center">
      <div
        className="flex flex-col justify-center !h-54"
        style={{width: size1 < 2 ? (55*size1) : (55*size1 + 20*size1), minWidth: size1 < 2 ? (55*size1) : (55*size1 + 20*size1)}}
      >
        {label1 && <Label label={label1} />}
        {children1}
      </div>
      { children2 &&
        <div
          className="flex flex-col justify-center !h-54"
          style={{width: size2 < 2 ? (55*size2) : (55*size2 + 20*size2), minWidth: size2 < 2 ? (55*size2) : (55*size2 + 20*size2)}}
        >
          {label2 && <Label label={label2} />}
          {children2}
        </div>
      }
    </div>
  )
}

interface Props {
  read?: boolean;
  model: salesOrderProcuctCUType;
  handleModelDataChange: (id: string, name: string, value: any) => void;
  selectId: string | null;
  newFlag: boolean;
  boardGroup: BoardGroupType[];
  boardGroupSelectList: selectType[];
  boardSelectList: selectType[];
  metarialSelectList: selectType[];
  inputRef?: RefObject<InputRef[]>;
  index?: number;
  handleDelete?: (model:salesOrderProcuctCUType) => void;
  handleEdit?: (model:salesOrderProcuctCUType) => void;
  handleModelChange?: (model:modelsType, id:string) => void;
}

const SalesModelHead:React.FC<Props> = ({
  read,
  model,
  handleModelDataChange,
  selectId,
  newFlag,
  boardGroup,
  boardGroupSelectList,
  boardSelectList,
  metarialSelectList,
  inputRef,
  handleDelete,
  handleEdit,
  handleModelChange,
  index,
}) => {

  const [matchFlag, setMatchFlag] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);
  const [modelNm, setModelNm] = useState<string>(model?.orderTit ?? "");
  const [modelNo, setModelNo] = useState<string>(model?.currPrdInfo?.prdMngNo ?? "");

  const [modelList, setModelList] = useState<modelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const [modelNoSelectList, setModelNoSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", modelNm, modelNo],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        page: 0,
        limit: 100,
        s_query: { "$or": [
          modelNm.length > 0 ? {"prdNm": {"$startsL": modelNm}} : {},
          modelNo.length > 0 ? {"prdMngNo": {"$startsL": modelNo}} : {},
        ]}
      });

      if (result.resultCode === "OK_0000") {
        const arr = result.data?.data as modelsType[] ?? [];
        setModelList(arr);
        setModelSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdNm,
        })));
        setModelNoSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdMngNo,
        })));
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: (flag && (modelNm.length > 2 || modelNo.length > 2))
  });

  return (
    <div className="w-full min-h-60 h-center gap-15">
      { !read &&
        <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{model?.index}</p>
      }
      
      <Tooltip title={matchFlag&&!read?"기존 모델을 선택한 경우 수정 또는 반복이어야 합니다" : undefined}>
      <div>
        <AntdSelect
          options={[
            {value:ModelStatus.NEW,label:'신규'},
            {value:ModelStatus.REPEAT,label:'반복'},
            {value:ModelStatus.MODIFY,label:'수정'},
          ]}
          value={model.modelStatus}
          onChange={(e)=>{
            if(matchFlag && e+"" !== ModelStatus.NEW) {
              setMatchFlag(false);
            }
            handleModelDataChange(model.id ?? '', 'modelStatus', e);
          }}
          styles={(selectId === model.id && !newFlag && model.modelStatus !== ModelStatus.REPEAT) || matchFlag ?
            {ht:'32px', bw:'1px', bc:'#FAAD14', pd:'0'} :
            {ht:'32px', bw:'0', pd:'0'}
          } className="!min-w-55"
          disabled={model.completed}
          readonly={read}
        />
      </div>
      </Tooltip>
      
      <div className="!flex-1 !max-w-[calc(100%-90px)] h-center gap-20 p-10">
        <Item
          label1="모델명" size1={3}
          children1={
            read ? 
            <AntdInput
              value={model.orderTit} disabled
            />
            :
            <CustomAutoCompleteLabel
              ref={el => {
                // 자동 스크롤 & 포커싱을 위해 Ref 추가
                if(el &&inputRef && inputRef.current && model.index) {
                  inputRef.current[model.index] = el;
                }
              }}
              option={modelSelectList}
              label={modelNm}
              onInputChange={(value) => {
                setModelNm(value);
                if(value.length < 3) {
                  setModelSelectList([]);
                  setModelNoSelectList([]);
                }
                handleModelDataChange(model.id ?? '', 'orderTit', value);
                setFlag(true);
              }}
              value={model.modelId}
              onChange={(value) => {
                const m = modelList.find(f=>f.id === value);
                if(m && model.id) {
                  setModelNo(m.prdMngNo);
                  handleModelChange?.(m, model.id);
                }
                if(!matchFlag && model.modelStatus === ModelStatus.NEW) {
                  setMatchFlag(true);
                }
                setFlag(false);
              }}
              clear={false} inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
              placeholder="모델명 검색 또는 입력 (3글자 이상)"
            />
          }
          label2="관리번호" size2={3}
          children2={
            read ? 
            <AntdInput
              value={model.currPrdInfo?.prdMngNo} disabled
            />
            :
            <CustomAutoCompleteLabel
              option={modelNoSelectList}
              label={modelNo}
              onInputChange={(value) => {
                setModelNo(value);
                if(value.length < 3) {
                  setModelSelectList([]);
                  setModelNoSelectList([]);
                }
                setFlag(true);
              }}
              value={model.prdMngNo}
              onChange={(value) => {
                const m = modelList.find(f=>f.id === value);
                if(m && model.id) {
                  setModelNm(m?.prdNm ?? "");
                  handleModelChange?.(m, model.id);
                }
                if(!matchFlag && model.modelStatus === ModelStatus.NEW) {
                  setMatchFlag(true);
                }
                setFlag(false);
              }}
              clear={false} inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
              placeholder="관리번호 검색 (3글자 이상)"
            />
          }
        />
        
        <Item
          label1="고객측 관리번호"
          children1={
            <AntdInput
              value={model.prtOrderNo}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'prtOrderNo', e.target.value);
              }}
              readonly={read}
              styles={{ht:'32px', bg:'#FFF'}}
              disabled={model.completed}
            />
          }
          label2="수주번호"
          children2={
            <AntdInput
              value={model.currPrdInfo?.orderMngNo}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.orderMngNo', e.target.value);
              }}
              readonly={read}
              styles={{ht:'32px', bg:'#FFF'}}
              disabled={model.completed}
            />
          }
        />
        
        <Item
          label1="필름번호"
          children1={
            <AntdInput
              value={model.currPrdInfo?.fpNo}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.fpNo', e.target.value);
              }}
              readonly styles={{ht:'32px', bg:'#FFF'}}
            />
          }
          label2="매수"
          children2={
            <AntdInput
              value={
                Math.floor(
                  ((model?.currPrdInfo?.pnlL ?? 0) * (model?.currPrdInfo?.pnlW ?? 0))
                  / 1000000 * (model?.orderPrdCnt ?? 0) * 100)
                / 100
              }
              readonly styles={{ht:'32px', bg:'#FFF'}}
            />
          }
        />
        
        <Item
          label1="제조사"
          children1={
            <AntdSelect
              options={boardGroupSelectList}
              value={model.currPrdInfo?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.boardGroup.id', e)
              }}
              styles={{ht:'32px', bw:'0px', pd:'0'}}
              disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
            />
          }
          label2="원판"
          children2={
            <AntdSelect
              options={boardSelectList}
              value={model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.board.id', e)
              }}
              styles={{ht:'32px', bw:'0px', pd:'0'}}
              disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
            />
          }
        />
        
        <Item
          label1="재질"
          children1={
            <AntdSelect
              options={metarialSelectList}
              value={model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value}
              onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.material.id', e)}}
              styles={{ht:'32px', bw:'0px', pd:'0'}} dropWidth="180px"
              disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
            />
          }
          label2="적용환율"
          children2={
            <AntdInput
              value={model.currPrdInfo?.exchange}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.exchange', e.target.value);
              }}
              readonly={read} type="number"
              styles={{ht:'32px', bg:'#FFF'}}
              disabled={model.completed}
            />
          }
        />

        <Item
          size1={1}
          children1={
            <AntdSelect
              options={[
                {value:ModelTypeEm.SAMPLE,label:'샘플'},
                {value:ModelTypeEm.PRODUCTION,label:'양산'},
              ]}
              value={model.currPrdInfo?.modelTypeEm ?? ModelTypeEm.SAMPLE}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.modelTypeEm', e);
              }}
              styles={{ht:'32px', bw:'0', pd:'0'}}
              disabled={read ?? model.completed}
            />
          }
          size2={1}
          children2={
            <AntdSelect
              options={[
                {value:'pay',label:'유상'},
                {value:'free',label:'무상'},
              ]}
              value={model.currPrdInfo?.paid ?? 'pay'}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.paid', e);
              }}
              styles={{ht:'32px', bw:'0', pd:'0'}}
              disabled={read ?? model.completed}
            />
          }
        />

        <Item
          size1={1}
          children1={
            <AntdSelect
              options={[
                {value:'in',label:'내수'},
                {value:'local',label:'로컬'},
                {value:'out',label:'수출'},
              ]}
              value={model.currPrdInfo?.export ?? 'in'}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.export', e);
              }}
              styles={{ht:'32px', bw:'0', pd:'0'}}
              disabled={read ?? model.completed}
            />
          }
          size2={1}
          children2={
            <AntdSelect
              options={[
                {value:'won',label:'원화'},
                {value:'dollar',label:'달러'},
                {value:'yen',label:'엔화'},
                {value:'euro',label:'유로'},
              ]}
              value={model.currPrdInfo?.currency ?? 'won'}
              onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'currPrdInfo.currency', e);
              }}
              styles={{ht:'32px', bw:'0', pd:'0'}}
              disabled={read ?? model.completed}
            />
          }
        />

        <Item
          label1="납기"
          children1={
            read && model.orderPrdDueDt ? <div className="h-32 h-center">{dayjs(model.orderPrdDueDt).format('YYYY-MM-DD')}</div> :
            !read ?
            <AntdDatePicker
              value={model.orderPrdDueDt}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)}
              suffixIcon={'cal'} afterDate={new Date()}
              styles={{bw:'0',bg:'none', pd:"0"}} className="!w-full"
              disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
              allowClear={false}
            /> : null
          }
          label2="발주"
          children2={
            read && model.orderDt ? <div className="h-32 h-center">{dayjs(model.orderDt).format('YYYY-MM-DD')}</div> :
            <AntdDatePicker
              value={model.currPrdInfo?.orderDt}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.orderDt', e)}
              suffixIcon={'cal'} afterDate={new Date()}
              styles={{bw:'0',bg:'none', pd:"0"}} className="!w-full"
              disabled={read ?? model.completed}
              allowClear={false}
            />
          }
        />

        <Item
          label1="수주수량"
          children1={
            <AntdInput 
              value={model.orderPrdCnt}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdCnt', e.target.value)}
              styles={{ht:'32px'}} type="number"
              disabled={model.completed} readonly={read}
            />
          }
          label2="수주금액"
          children2={
            <AntdInput 
              value={model.orderPrdPrice}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdPrice', e.target.value)}
              styles={{ht:'32px'}} type="number"
              disabled={model.completed} readonly={read}
            />
          }
        />

        <Item
          label1="수주단위"
          children1={
            <AntdSelect
              options={[
                {value:'pcs',label:'PCS'},
                {value:'kit',label:'KIT'},
              ]}
              value={model.currPrdInfo?.orderUnit ?? 'pcs'}
              onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.orderUnit', e)}}
              styles={{ht:'32px', bw:'0px', pd:'0'}}
              disabled={model.completed} readonly={read}
            />
          }
          label2="비고" size2={3}
          children2={
            <AntdInput 
              value={model.currPrdInfo?.memo}
              onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.memo', e.target.value)}
              styles={{ht:'32px'}}
              disabled={model.completed} readonly={read}
            />
          }
        />
      </div>
      

      {
        !read &&
        <Dropdown trigger={['click']} menu={{ items:[{
          label: model.completed ? 
          <div className="h-center gap-5">
            <p className="w-16 h-16"><Memo /></p>
            수정사항
          </div>
          :
          <div className="text-[red] h-center gap-5">
            <p className="w-16 h-16"><Trash /></p>
            삭제
          </div>,
          key: 0,
          onClick:()=>{
            if(model.completed) handleEdit?.(model);
            else                handleDelete?.(model)
          }}
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