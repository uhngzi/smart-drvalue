import { Dropdown, InputRef, Space, Tooltip } from "antd";
import { RefObject, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAPI } from "@/api/get";

import { selectType } from "@/data/type/componentStyles";
import { generateFloorOptions, ModelStatus, ModelTypeEm, SalesOrderStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { modelsType } from "@/data/type/sayang/models";
import { BoardGroupType } from "@/data/type/base/board";

import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdSelectFill from "../Select/AntdSelectFill";
import { DividerV } from "../Divider/Divider";
import CustomAutoCompleteLabel from "../AutoComplete/CustomAutoCompleteLabel";
import Items2, { Label } from "../Item/Items2";

import Edit from "@/assets/svg/icons/edit.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";

import BoxHead from "@/layouts/Body/BoxHead";
import GlobalMemo from "@/contents/globalMemo/GlobalMemo";

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
  
  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  useEffect(()=>{
    if((model.orderTit && model.orderTit.length > 2)
      || (model.currPrdInfo?.prdMngNo && model.currPrdInfo?.prdMngNo.length > 2)) {
      setTimeout(()=>setSearchFlag(true), 500);
    } else {
      setSearchFlag(false);
    }
  }, [model.orderTit, model.currPrdInfo?.prdMngNo]);

  const [modelList, setModelList] = useState<modelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const [modelNoSelectList, setModelNoSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", model.orderTit, model.currPrdInfo?.prdMngNo, searchFlag],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        page: 0,
        limit: 100,
        s_query: { "$or": [
          (model.orderTit ?? "").length > 0 ? {"prdNm": {"$startsL": model.orderTit}} : {},
          (model.currPrdInfo?.prdMngNo ?? "").length > 0 ? {"prdMngNo": {"$startsL": model.currPrdInfo?.prdMngNo}} : {},
        ]}
      });

      if (result.resultCode === "OK_0000") {
        const arr = result.data?.data as modelsType[] ?? [];
        setModelList(arr);
        console.log(arr);
        setModelSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdNm,
        })));
        setModelNoSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdMngNo,
        })));
        setSearchFlag(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: (searchFlag && flag && ((model.orderTit ?? "").length > 2 || (model.currPrdInfo?.prdMngNo ?? "").length > 2))
  });

  return (
    <BoxHead>
      { !read &&
        <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{model?.index}</p>
      }
      
      <div className="!flex-1 !max-w-[calc(100%-90px)] flex flex-col gap-15">
        <div className="h-center gap-15">
          <div className="h-center gap-5">
            <Label label="고객측 관리번호" className="!w-[140px]"/>
            <AntdInput
              value={model.orderPrtNo}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'orderPrtNo', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}}
              disabled={model.completed ?? read}
            />
          </div>
          <div className="h-center gap-5 flex-1">
            <Label label="비고" className="!w-35"/>
            <AntdInput
              value={model.remarks}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'remarks', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}}
              disabled={model.completed ?? read}
            />
          </div>
          { !model.id?.includes("new") &&
          <div>
            <GlobalMemo
              key={model.id}
              id={model.id ?? ""}
              entityName="RnTenantCbizSalesOrderProductEntity"
              entityRelation={{
                RnTenantCbizSalesOrderEntity: true,
                RnTenantCbizModelEntity: true,
                RnTenantCbizBizPartnerMngMatchEntity: {
                    RnTenantCbizBizPartnerEntity: true
                },
                RnTenantCbizWorksheetEntity: true
              }}
              relationIdx={""}
            />
          </div>}
        </div>
        <div className="h-center gap-15">
          <Items2
            size1={1}
            children1={
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
            }
            size2={1}
            children2={
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
          />

          <Items2
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
                label={model.orderTit}
                onInputChange={(value) => {
                  if((value.toString()).length < 3) {
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
                    handleModelChange?.(m, model.id);
                  }
                  if(!matchFlag && model.modelStatus === ModelStatus.NEW) {
                    setMatchFlag(true);
                  }
                  setFlag(false);
                }}
                clear={false} inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
                placeholder="모델명 검색 또는 입력 (3글자 이상)" dropdownStyle={{width:350, minWidth:'max-content'}}
              />
            }
            label2="Rev" size2={3}
            children2={
              <AntdInput
                value={model.currPrdInfo?.prdRevNo}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'currPrdInfo.prdRevNo', e.target.value)}
                readonly={selectId === model.id ? !newFlag : undefined}
                styles={{ht:'32px', bg:'#FFF'}}
                disabled={model.completed ?? read}
              />
            }
          />
          
          <Items2
            label1="관리번호"
            children1={
              read ? 
              <AntdInput
                value={model.currPrdInfo?.prdMngNo} disabled
              />
              :
              <CustomAutoCompleteLabel
                option={modelNoSelectList}
                label={model.currPrdInfo?.prdMngNo}
                onInputChange={(value) => {
                  if(value.length < 3) {
                    setModelSelectList([]);
                    setModelNoSelectList([]);
                  }
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.prdMngNo', value);
                  setFlag(true);
                }}
                value={model.prdMngNo}
                onChange={(value) => {
                  const m = modelList.find(f=>f.id === value);
                  if(m && model.id) {
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
            label2="필름번호"
            children2={
              <AntdInput
                value={model.currPrdInfo?.fpNo}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.fpNo', e.target.value);
                }}
                readonly styles={{ht:'32px', bg:'#FFF'}} disabled={read}
              />
            }
          />
          
          <Items2
            label1="도면번호"
            children1={
              <AntdInput
                value={model.currPrdInfo?.drgNo}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'currPrdInfo.drgNo', e.target.value)}
                styles={{ht:'32px', bg:'#FFF'}}
                disabled={model.completed ?? read}
              />
            }
            label2="재질"
            children2={
              <AntdSelectFill
                options={metarialSelectList}
                value={model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value}
                onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.material.id', e)}}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}} dropWidth="180px"
                disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
              />
            }
          />
          
          <Items2
            label1="원판"
            children1={
              <AntdSelectFill
                options={boardSelectList}
                value={model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.board.id', e)
                }}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
              />
            }
            label2="제조사"
            children2={
              <AntdSelectFill
                options={boardGroupSelectList}
                value={model.currPrdInfo?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.boardGroup.id', e)
                }}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
              />
            }
          />
          
          <Items2
            label1="층" size1={1}
            children1={
              <AntdSelectFill
                options={generateFloorOptions()}
                value={model.currPrdInfo?.layerEm ?? "L1"}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'currPrdInfo.layerEm', e)}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed ? true : selectId === model.id ? !newFlag : model.modelStatus === ModelStatus.REPEAT}
              />
            }
            label2="두께" size2={1}
            children2={
              <AntdInput
                value={model.currPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'currPrdInfo.thk', e.target.value)}
                type="number" maxPoint={2}
                styles={{ht:'32px', bg:'#FFF'}}
                disabled={model.completed ?? read}
              />
            }
          />

          <DividerV className="min-h-[123px] border-[#00000025]"/>

          <Items2
            label1="요금 여부" size1={1}
            children1={
              <AntdSelectFill
                options={[
                  {value:'pay',label:'유상'},
                  {value:'free',label:'무상'},
                ]}
                value={model.currPrdInfo?.paid ?? 'pay'}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.paid', e);
                }}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed}
              />
            }
            label2="시장" size2={1}
            children2={
              <AntdSelectFill
                options={[
                  {value:'in',label:'내수'},
                  {value:'local',label:'로컬'},
                  {value:'out',label:'수출'},
                ]}
                value={model.currPrdInfo?.export ?? 'in'}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.export', e);
                }}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed}
              />
            }
          />

          <Items2
            label1="통화" size1={1}
            children1={
              <AntdSelectFill
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
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={read ?? model.completed}
              />
            }
            label2="적용환율" size2={1}
            children2={
              <AntdInput
                value={model.currPrdInfo?.exchange}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.exchange', e.target.value);
                }}
                type="number"
                styles={{ht:'32px', bg:'#FFF'}}
                disabled={model.completed ?? read}
              />
            }
          />

          <Items2
            label1="발주"
            children1={
              read && model.orderDt ? <div className="h-32 h-center">{dayjs(model.orderDt).format('YYYY-MM-DD')}</div> :
              <AntdDatePicker
                value={model.currPrdInfo?.orderDt}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.orderDt', e)}
                suffixIcon={'cal'} afterDate={new Date()}
                styles={{bc:'#D9D9D9'}} className="!w-full !h-32 !rounded-2"
                disabled={read ?? model.completed}
                allowClear={false}
              />
            }
            label2="납기"
            children2={
              read && model.orderPrdDueDt ? <div className="h-32 h-center">{dayjs(model.orderPrdDueDt).format('YYYY-MM-DD')}</div> :
              !read ?
              <AntdDatePicker
                value={model.orderPrdDueDt}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdDueDt', e)}
                suffixIcon={'cal'} afterDate={new Date()}
                styles={{bc:'#D9D9D9'}} className="!w-full !h-32 !rounded-2"
                disabled={model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED}
                allowClear={false}
              /> : null
            }
          />

          <Items2
            label1="수주단위" size1={1}
            children1={
              <AntdSelectFill
                options={[
                  {value:'pcs',label:'PCS'},
                  {value:'kit',label:'KIT'},
                ]}
                value={model.currPrdInfo?.orderUnit ?? 'pcs'}
                onChange={(e)=>{handleModelDataChange(model.id ?? '', 'currPrdInfo.orderUnit', e)}}
                styles={{ht:'32px', bg: '#FFF', br: '2px'}}
                disabled={model.completed ?? read}
              />
            }
            label2="수주수량" size2={1}
            children2={
              <AntdInput 
                value={model.orderPrdCnt}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'orderPrdCnt', e.target.value);
                }}
                styles={{ht:'32px'}} type="number"
                disabled={model.completed ?? read}
              />
            }
          />

          <Items2
            label1="수주단가"
            children1={
              <AntdInput 
                value={model.currPrdInfo?.orderUnitPrice ?? 0}
                onChange={(e)=>{
                  handleModelDataChange(model.id ?? '', 'currPrdInfo.orderUnitPrice', e.target.value);

                  // const tot = (model.orderPrdCnt ?? 0) * Number(e.target.value ?? 0);
                  // handleModelDataChange(model.id ?? '', 'orderPrdPrice', tot);
                }}
                styles={{ht:'32px'}} type="number"
                disabled={model.completed ?? read}
              />
            }
            label2="수주금액"
            children2={
              <AntdInput 
                value={model.orderPrdPrice}
                onChange={(e)=>handleModelDataChange(model.id ?? '', 'orderPrdPrice', e.target.value)}
                styles={{ht:'32px'}} type="number"
                disabled={model.completed ?? read}
              />
            }
          />
        </div>
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
    </BoxHead>
  )
}

export default SalesModelHead;