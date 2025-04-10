import { getAPI } from "@/api/get";
import CustomAutoCompleteLabel from "@/components/AutoComplete/CustomAutoCompleteLabel";
import AntdInput from "@/components/Input/AntdInput";
import Items2 from "@/components/Item/Items2";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdSelectFill from "@/components/Select/AntdSelectFill";
import { useBase } from "@/data/context/BaseContext";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { selectType } from "@/data/type/componentStyles";
import { generateFloorOptions, ModelStatus } from "@/data/type/enum";
import { salesEstimateProductType } from "@/data/type/sales/order";
import { modelsType } from "@/data/type/sayang/models";
import BlueBox from "@/layouts/Body/BlueBox";
import BoxHead from "@/layouts/Body/BoxHead";
import { useQuery } from "@tanstack/react-query";
import { Checkbox, InputRef } from "antd";
import { RefObject, useState } from "react";

interface Props {
  model: salesEstimateProductType;
  handleModelDataChange: (
    id: string,
    name: string,
    value: any
  ) => void;
  inputRef?: RefObject<InputRef[]>;
  handleModelChange: (
    model: modelsType,
    productId: string,
  ) => void;
}

const EstimateModelHead:React.FC<Props> = ({
  model,
  handleModelDataChange,
  inputRef,
  handleModelChange,
}) => {
  // 베이스 값 가져오기
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
    ozUnitSelectList,
    stampColorSelectList,
    stampTypeSelectList,
  } = useBase();

  const [matchFlag, setMatchFlag] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);

  const [modelList, setModelList] = useState<modelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const [modelNoSelectList, setModelNoSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", model.estimateModelNm],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        page: 0,
        limit: 100,
        s_query: { "$or": [
          (model.estimateModelNm ?? "").length > 0 ? {"prdNm": {"$startsL": model.estimateModelNm}} : {},
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
    enabled: (model.estimateModelNm ?? "").length > 2
  });

  return (
    <BlueBox>
      <BoxHead>
        <Checkbox
          checked={model.selected}
          onChange={(e) => {
            handleModelDataChange(model.id ?? '', 'selected', e.target.checked);
          }}
        />

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
          styles={matchFlag ? {ht:'32px', bw:'1px', bc:'#FAAD14', pd:'0'} : {ht:'32px', bw:'0', pd:'0'}}
          className="!min-w-55 !w-70"
        />

        <Items2
          label1="모델명" size1={3}
          children1={
            <CustomAutoCompleteLabel
              ref={el => {
                // 자동 스크롤 & 포커싱을 위해 Ref 추가
                if(el && inputRef && inputRef.current && model.index) {
                  inputRef.current[model.index] = el;
                }
              }}
              option={modelSelectList}
              label={model.estimateModelNm}
              onInputChange={(value) => {
                if((value.toString()).length < 3) {
                  setModelSelectList([]);
                  setModelNoSelectList([]);
                }
                handleModelDataChange(model.id ?? '', 'estimateModelNm', value);
                setFlag(true);
              }}
              value={model.model?.id}
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
        />

        <Items2
          label1="층" size1={1}
          children1={
            <AntdSelectFill
              options={generateFloorOptions()}
              value={model.layerEm ?? "L1"}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'layerEm', e)}
              styles={{ht:'32px', bg: '#FFF', br: '2px'}}
            />
          }
        />

        <Items2
          label1="Array"
          children1={
            <AntdInput
              value={model.array}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'array', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}}
            />
          }
        />

        <Items2
          label1="재질"
          children1={
            <AntdSelectFill
              options={metarialSelectList}
              value={model.textureIdx ?? metarialSelectList?.[0]?.value}
              onChange={(e)=>{handleModelDataChange(model.id ?? '', 'textureIdx', e)}}
              styles={{ht:'32px', bg: '#FFF', br: '2px'}} dropWidth="180px"
            />
          }
        />

        <Items2
          label1="사이즈"
          children1={
           <div className="h-center gap-3">
              <AntdInput
                value={model.sizeW}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'sizeW', e.target.value)}
                styles={{ht:'32px', bg:'#FFF'}} className="!w-65"
                placeholder="가로(W)" type="number"
              />
              <span className="text-[#00000045]">x</span>
              <AntdInput
                value={model.sizeH}
                onChange={(e)=>handleModelDataChange(model.id ?? "", 'sizeH', e.target.value)}
                styles={{ht:'32px', bg:'#FFF'}} className="!w-65"
                placeholder="가로(H)" type="number"
              />
            </div>
          }
        />

        <Items2
          label1="두께" size1={1}
          children1={
            <AntdInput
              value={model.thickness}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'thickness', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}} type="number"
            />
          }
        />

        <Items2
          label1="수량" size1={1}
          children1={
            <AntdInput
              value={model.quantity}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'quantity', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}} type="number"
            />
          }
        />

        <Items2
          label1="수량 단위" size1={1}
          children1={
            <AntdSelectFill
              options={unitSelectList}
              value={model.quantityUnitIdx ?? unitSelectList?.[0]?.value}
              onChange={(e)=>{handleModelDataChange(model.id ?? '', 'quantityUnitIdx', e)}}
              styles={{ht:'32px', bg: '#FFF', br: '2px'}} dropWidth="180px"
            />
          }
        />

        <Items2
          label1="단가"
          children1={
            <AntdInput
              value={model.unitPrice}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'unitPrice', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}} type="number"
            />
          }
        />

        <Items2
          label1="금액"
          children1={
            <AntdInput
              value={model.cost}
              onChange={(e)=>handleModelDataChange(model.id ?? "", 'cost', e.target.value)}
              styles={{ht:'32px', bg:'#FFF'}} type="number"
            />
          }
        />
      </BoxHead>
    </BlueBox>
  )
}

export default EstimateModelHead;