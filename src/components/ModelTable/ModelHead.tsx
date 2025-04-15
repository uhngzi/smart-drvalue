import dayjs from "dayjs";
import { Button, InputRef, Tooltip } from "antd";
import { RefObject, useEffect, useState } from "react";

import { selectType } from "@/data/type/componentStyles";
import { modelsType, orderModelType } from "@/data/type/sayang/models";
import { generateFloorOptions, ModelStatus, ModelTypeEm, SalesOrderStatus, SpecStatus } from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import FullChip from "../Chip/FullChip";
import AntdInput from "../Input/AntdInput";
import AntdSelect from "../Select/AntdSelect";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdSelectFill from "../Select/AntdSelectFill";
import CustomAutoCompleteLabel from "../AutoComplete/CustomAutoCompleteLabel";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { DividerV } from "../Divider/Divider";
import Items2 from "../Item/Items2";
import BlueBox from "@/layouts/Body/BlueBox";

// const Label:React.FC<{label:string,className?:string}> = ({ label,className }) => {
//   return <p className={`h-center ${className}`}>{label}</p>
// }

// const Item:React.FC<{
//   children1: React.ReactNode;
//   children2?: React.ReactNode;
//   label1?: string;
//   label2?: string;
//   size1?: number;
//   size2?: number;
// }> = ({
//   label1,
//   label2,
//   children1,
//   children2,
//   size1 = 2,
//   size2 = 2,
// }) => {
//   return (
//     <div className="flex flex-col gap-15 justify-center">
//       <div
//         className="flex flex-col justify-center !h-54"
//         style={{width: 70*size1, minWidth: 70*size1}}
//       >
//         {label1 && <Label label={label1} />}
//         {children1}
//       </div>
//       { children2 &&
//         <div
//           className="flex flex-col justify-center !h-54"
//           style={{width: 70*size2, minWidth: 70*size2}}
//         >
//           {label2 && <Label label={label2} />}
//           {children2}
//         </div>
//       }
//     </div>
//   )
// }

interface Props {
  model: orderModelType;
  handleModelDataChange: (id: string, name: string, value: any) => void;
  selectId: string | null;
  newFlag: boolean;
  boardSelectList: selectType[];
  metarialSelectList: selectType[];
  inputRef?: RefObject<InputRef[]>;
  index?: number;
  handleModelChange?: (model:modelsType, id:string) => void;
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
  handleModelChange,
}) => {
  const [matchFlag, setMatchFlag] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);

  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  useEffect(()=>{
    if((model.tempPrdInfo.prdNm && model.tempPrdInfo.prdNm.length > 2)
      || (model.currPrdInfo?.prdMngNo && model.currPrdInfo?.prdMngNo.length > 2)) {
      setTimeout(()=>setSearchFlag(true), 500);
    } else {
      setSearchFlag(false);
    }
  }, [model.tempPrdInfo?.prdNm, model.currPrdInfo?.prdMngNo]);

  const [modelList, setModelList] = useState<modelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const [modelNoSelectList, setModelNoSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", (model.tempPrdInfo?.prdNm ?? model.orderTit), model.currPrdInfo?.prdMngNo, searchFlag],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        page: 0,
        limit: 100,
        s_query: { "$or": [
          (model.tempPrdInfo?.prdNm ?? model.orderTit).length > 0 ? {"prdNm": {"$startsL": (model.tempPrdInfo?.prdNm ?? model.orderTit)}} : {},
          (model.currPrdInfo?.prdMngNo ?? "").length > 0 ? {"prdMngNo": {"$startsL": model.currPrdInfo?.prdMngNo}} : {},
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
        setSearchFlag(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: searchFlag && (model.tempPrdInfo?.prdNm ?? model.orderTit).length > 2 || (model.currPrdInfo?.prdMngNo ?? "").length > 2
  });

  return (
    <BlueBox className="!flex-row !items-center !gap-15">
      <Items2
        size1={1}
        children1={
          <Tooltip title={matchFlag?"기존 모델을 선택한 경우 수정 또는 반복이어야 합니다" : undefined}>
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
              }
              disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
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
            value={model.editModel?.modelTypeEm ?? model.tempPrdInfo?.modelTypeEm ?? model.currPrdInfo?.modelTypeEm ?? "sample"}
            onChange={(e)=>handleModelDataChange(model.id, 'editModel.modelTypeEm', e)}
            styles={{ht:'32px', bw:'0', pd:'0'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        }
      />

      <Items2
        label1="모델명" size1={3}
        children1={
          <CustomAutoCompleteLabel
            ref={el => {
              // 자동 스크롤 & 포커싱을 위해 Ref 추가
              if(el && inputRef && inputRef.current && index !== undefined) {
                inputRef.current[index] = el;
              }
            }}
            option={modelSelectList}
            label={model.tempPrdInfo?.prdNm ?? model.orderTit}
            onInputChange={(value) => {
              if((value.toString()).length < 3) {
                setModelSelectList([]);
                setModelNoSelectList([]);
              }
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.prdNm', value);
              handleModelDataChange(model.id ?? '', 'editModel.prdNm', value);
            }}
            value={model.currPrdInfo?.modelId}
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
            clear={false} inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2" readonly={model.completed}
            placeholder="모델명 검색 또는 입력 (3글자 이상)" dropdownStyle={{width:350, minWidth:'max-content'}}
          />
        }
        label2="Rev" size2={3}
        children2={
          <AntdInput
            value={model.editModel?.prdRevNo ?? model.tempPrdInfo?.prdRevNo ?? model.currPrdInfo?.prdRevNo}
            onChange={(e)=>handleModelDataChange(model.id, 'editModel.prdRevNo', e.target.value)}
            readonly={selectId === model.id ? !newFlag : undefined} styles={{ht:'32px'}}
            disabled={model.completed}
          />
        }
      />
      
      <Items2
        label1="관리번호"
        children1={
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
            placeholder="관리번호 검색 (3글자 이상)" readonly={model.completed}
          />
        }
        label2="Tool No"
        children2={
          <AntdInput
            value={model.currPrdInfo?.fpNo}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'currPrdInfo.fpNo', e.target.value);
            }}
            readonly styles={{ht:'32px', bg:'#FFF'}} disabled={model.completed}
          />
        }
      />
      
      <Items2
        label1="도면번호"
        children1={
          <AntdInput
            value={model.editModel?.drgNo ?? model.tempPrdInfo?.drgNo ?? model.currPrdInfo?.drgNo}
            onChange={(e)=>handleModelDataChange(model.id, 'editModel.drgNo', e.target.value)}
            readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.completed}
          />
        }
        label2="재질"
        children2={
          <AntdSelectFill
            options={metarialSelectList}
            value={(model as orderModelType)?.tempPrdInfo?.material?.id ?? model.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value
            }
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'model.material.id', e)
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.material.id', e)
            }}
            styles={{ht:'32px', bg: '#FFF', br: '2px'}} dropWidth="180px"
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        }
      />
      
      <Items2
        label1="원판"
        children1={
          <AntdSelectFill
            options={boardSelectList}
            value={model?.tempPrdInfo?.board?.id ?? model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
            onChange={(e)=>{
                handleModelDataChange(model.id ?? '', 'model.board.id', e)
                handleModelDataChange(model.id ?? '', 'tempPrdInfo.board.id', e)
            }}
            styles={{ht:'32px', bg: '#FFF', br: '2px'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        }
        label2="제조사"
        children2={
          <AntdInput 
            value={model.editModel?.mnfNm ?? model?.tempPrdInfo?.mnfNm ?? model.currPrdInfo?.mnfNm}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'model.mnfNm', e.target.value)
              handleModelDataChange(model.id ?? '', 'editModel.mnfNm', e.target.value)
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.mnfNm', e.target.value)
            }}
            styles={{ht:'32px'}}
            readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
        }
      />
      
      <Items2
        label1="층" size1={1}
        children1={
          <AntdSelect
            options={generateFloorOptions()}
            value={model.editModel?.layerEm ?? model.tempPrdInfo?.layerEm ?? model.currPrdInfo?.layerEm ?? "L1"}
            onChange={(e)=>handleModelDataChange(model.id, 'editModel.layerEm', e)}
            styles={{ht:'32px', bg: '#FFF', br: '2px'}}
            disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          />
          // <AntdSelectFill
          //   options={boardSelectList}
          //   value={model?.tempPrdInfo?.board?.id ?? model.currPrdInfo?.board?.id ?? boardSelectList?.[0]?.value}
          //   onChange={(e)=>{
          //       handleModelDataChange(model.id ?? '', 'model.board.id', e)
          //       handleModelDataChange(model.id ?? '', 'tempPrdInfo.board.id', e)
          //   }}
          //   className="w-[160px!important]" styles={{ht:'32px', bg: '#FFF', br: '2px'}}
          //   disabled={model.completed ? true : selectId === model.id ? !newFlag : undefined}
          // />
        }
        label2="두께" size2={1}
        children2={
          <AntdInput
            value={model.editModel?.thk ?? model.tempPrdInfo?.thk ?? model.currPrdInfo?.thk}
            onChange={(e)=>handleModelDataChange(model.id, 'editModel.thk', e.target.value)}
            type="number" maxPoint={2}
            readonly={selectId === model.id ? !newFlag : undefined}
            disabled={model.completed}
          />
        }
      />

      <DividerV className="!h-[123px] border-[#00000025]"/>

      <Items2
        label1="발주"
        children1={
          <AntdDatePicker
            value={model.currPrdInfo?.orderDt}
            onChange={(e)=>handleModelDataChange(model.id ?? '', 'currPrdInfo.orderDt', e)}
            suffixIcon={'cal'} afterDate={new Date()}
            styles={{bc:'#D9D9D9'}} className="!w-full !h-32 !rounded-2"
            allowClear={false} disabled={model.completed}
          />
        }
        label2="납기"
        children2={
          <AntdDatePicker
            value={model?.tempPrdInfo.orderPrdDueDt ?? model.orderPrdDueDt}
            onChange={(e)=>{
              handleModelDataChange(model.id ?? '', 'tempPrdInfo.orderPrdDueDt', e)
            }}
            suffixIcon={'cal'} afterDate={new Date()} allowClear={false} disabled={model.completed}
            styles={{bc:'#D9D9D9'}} className="!w-full !h-32 !rounded-2"
          />
        }
      />

      <div className="flex-1 flex justify-end">
      {/* { !model.completed && (model as orderModelType).temp && <>
        <p className="h-center text-11 pr-20">
          마지막 임시저장일 : {dayjs(model.updatedAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </>} */}
      { (model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_WAITING) &&
        !model.completed && !(model as orderModelType).temp &&
        <FullChip label="대기중" state="yellow" className="!mr-20 !w-80 !h-30"/>
      }
      { ((model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_REGISTERING) ||
        (!model.completed && (model as orderModelType).temp)) && !model.completed ?
        <>
          <p className="h-center text-11 pr-20">
            마지막 임시저장일 : {dayjs(model.updatedAt).format("YYYY-MM-DD")}
          </p>
          <FullChip label="등록중" state="mint" className="!mr-20 !w-80 !h-30"/>
        </>
        : <></>
      }
      { (model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED || model.completed) &&<>
        <p className="h-center text-11">확정일 : {dayjs(model.updatedAt).format("YYYY-MM-DD")}</p>
        <FullChip label="확정" state="purple" className="!mx-20 !w-80 !h-30"/>
      </>}
      { model.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_DISCARDED &&
        <FullChip label="폐기" className="!mr-20 !w-80 !h-30"/>
      }
      </div>
    {/* </div> */}
    </BlueBox>
  )
}

export default ModelHead;