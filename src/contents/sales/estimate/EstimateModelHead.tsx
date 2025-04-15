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
import { salesEstimateProductType, salesEstimateType } from "@/data/type/sales/order";
import { modelsType } from "@/data/type/sayang/models";
import BlueBox from "@/layouts/Body/BlueBox";
import BoxHead from "@/layouts/Body/BoxHead";
import { useQuery } from "@tanstack/react-query";
import { Checkbox, Dropdown, InputRef, Space } from "antd";
import { RefObject, SetStateAction, useEffect, useState } from "react";

import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import { DividerH } from "@/components/Divider/Divider";
import { baseSpecType } from "@/data/type/base/spec";
import { specialSpecToText } from "@/utils/specText";
import { postAPI } from "@/api/post";

interface Props {
  spec: baseSpecType[];
  model: salesEstimateProductType;
  handleModelDataChange: (
    id: string,
    name: string,
    value: any
  ) => void;
  handleModelChange: (
    model: modelsType,
    productId: string,
    type?: number | null,
  ) => void;
  inputRef?: RefObject<InputRef[]>;
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
  products: salesEstimateProductType[];
  setProducts: React.Dispatch<SetStateAction<salesEstimateProductType[]>>;
}

const EstimateModelHead:React.FC<Props> = ({
  spec,
  model,
  handleModelDataChange,
  inputRef,
  showToast,
  products,
  setProducts,
  handleModelChange,
}) => {
  // 베이스 값 가져오기
  const { 
    metarialSelectList,
    unitSelectList,
  } = useBase();

  // 모델 반복 여부 매칭 플래그
  const [matchFlag, setMatchFlag] = useState<boolean>(false);

  // 모델명 검색 딜레이 플래그
  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  useEffect(()=>{
    if(model.estimateModelNm && model.estimateModelNm .length > 2) {
      setTimeout(()=>setSearchFlag(true), 500);
    } else {
      setSearchFlag(false);
    }
  }, [model.estimateModelNm]);

  // 모델 검색
  const [modelList, setModelList] = useState<modelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", model.estimateModelNm, searchFlag],
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
        setSearchFlag(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: searchFlag && (model.estimateModelNm ?? "").length > 2
  });

  // 특수사양을 선택했을 때 값 변경
  const handleSpecChange = (
    check: boolean,
    spec: baseSpecType,
    productId: string,
  ) => {
    const newData = [...products];
    const index = newData.findIndex(f => f.id === productId);
    if(index > -1) {
      newData[index] = {
        ...newData[index],
        specialSpecifications: check ? [
          ...(newData[index].specialSpecifications?.filter(f=>f.id !== spec.id) ?? []),
          {...spec}
        ] : [
          ...(newData[index].specialSpecifications?.filter(f=>f.id !== spec.id) ?? []),
        ]
      };
      setProducts(newData);
    }
  }

  // 특수사양 체크
  const [ specFlag, setSpecFlag ] = useState<boolean>(false);
  useEffect(()=>{
    // 초기값 세팅을 위해 작성
    if(!specFlag && model.specialSpecifications && model.specialSpecifications?.length > 0)
      // FLAG가 false인데 특수사양의 값이 있다면 true로 변경해줘야 함 (특수사양의 체크가 자동으로 되어야 하므로)
      setSpecFlag(true);
  }, [model.specialSpecifications])

  // 단가 계산
  const handleCalUnitPrice = async () => {
    try {
      const jsonData = {
        customUnitPrice: model.unitPrice,
        layerEm: model.layerEm,
        quantity: model.quantity,
        thickness: model.thickness,
        textureId: model.textureIdx && model.textureIdx !== "" ? model.textureIdx : metarialSelectList?.[0]?.value,
        specialSpecificationsIds: model.specialSpecifications?.map((item) => (item.id))
      }
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url:'sales-estimate/default/calculate-unit-price',
        etc: true,
      }, jsonData);
      
      if(result.resultCode === "OK_0000") {
        const data = result.data;
        /**
         * 반환값 설명
         * basePrice : 기초정보에 등록된 기본 단가
         * addRate : [계산 데이터]
         * addPrice : [계산 데이터]
         * calcCost : basePrice * addRate + addPrice
         * customCalcCost : 입력한 가격 * addRate + addPrice
         * 
         * 저장값 설명
         * unitPrice - 사용자 입력 및 기초 단가 저장 ~ 수량 입력 후 기초 단가는 1회만 저장됨
         * autoCalculatedUnitPrice - 자동 계산 단가 저장
        */

        if(!priceBaseFlag && (!model.unitPrice || model.unitPrice < 1)) {
          handleModelDataChange(model.id ?? "", 'unitPrice', (data?.basePrice ?? 0));
          setPriceBaseFlag(true);
        } else {
          handleModelDataChange(model.id ?? "", 'autoCalculatedUnitPrice', (data?.customCalcCost ?? 0));
        }
        setPriceFlag(false);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  
  // 기본 단가 세팅 여부 (false라면 세팅 전 / true라면 세팅 후) ~ 초기에만 세팅되고 이후 세팅 안되게끔 설정하기 위함
  const [ priceBaseFlag, setPriceBaseFlag ] = useState<boolean>(false);
  // unitPrice 변경 후 계산 여부 (false라면 변경 후 계산된 상태 / true라면 변경 후 계산 전 상태) ~ useEffect로 받아오기 위해 flag 상태값 설정
  const [ priceFlag, setPriceFlag ] = useState<boolean>(false);
  // 값이 변경될 때마다 계산되어야 함
  useEffect(()=>{
    if(model.quantity && model.quantity > 0 && priceFlag) handleCalUnitPrice();
  }, [model.quantity, model.layerEm, model.thickness,
    model.textureIdx, model.specialSpecifications])
  useEffect(()=>{
    if(priceFlag) handleCalUnitPrice();
  }, [model.unitPrice])

  return (
    <BlueBox>
      <BoxHead>
        <Checkbox
          checked={model.selected}
          onChange={(e) => {
            console.log(e.target.checked);
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

        <div className="flex flex-col h-center gap-15 flex-1">
          <div className="w-full h-center gap-15">
            <Items2
              label1="모델명" size1={3}
              children1={
                <CustomAutoCompleteLabel
                  ref={el => {
                    // 자동 스크롤 & 포커싱을 위해 Ref 추가
                    if(el && inputRef && inputRef.current && model.ordNo) {
                      inputRef.current[model.ordNo] = el;
                    }
                  }}
                  option={modelSelectList}
                  label={model.estimateModelNm}
                  onInputChange={(value) => {
                    if((value.toString()).length < 3) {
                      setModelSelectList([]);
                    }
                    handleModelDataChange(model.id ?? '', 'estimateModelNm', value);
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
                  onChange={(e)=>{
                    setPriceFlag(true);
                    handleModelDataChange(model.id ?? "", 'layerEm', e)
                  }}
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
                  value={model.texture?.id ?? metarialSelectList?.[0]?.value}
                  onChange={(e)=>{
                    setPriceFlag(true);
                    handleModelDataChange(model.id ?? '', 'texture.id', e)
                  }}
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
                  onChange={(e)=>{
                    setPriceFlag(true);
                    handleModelDataChange(model.id ?? "", 'thickness', e.target.value)
                  }}
                  styles={{ht:'32px', bg:'#FFF'}} type="number" maxPoint={2}
                />
              }
            />

            <Items2
              label1="수량" size1={1}
              children1={
                <AntdInput
                  value={model.quantity}
                  onChange={(e)=>{
                    setPriceFlag(true);
                    handleModelDataChange(model.id ?? "", 'quantity', e.target.value)
                  }}
                  styles={{ht:'32px', bg:'#FFF'}} type="number"
                />
              }
            />

            <Items2
              label1="수량 단위"
              children1={
                <AntdSelectFill
                  options={unitSelectList}
                  value={model.quantityUnit?.id ?? unitSelectList?.[0]?.value}
                  onChange={(e)=>{handleModelDataChange(model.id ?? '', 'quantityUnit.id', e)}}
                  styles={{ht:'32px', bg: '#FFF', br: '2px'}} dropWidth="180px"
                />
              }
            />

            <Items2
              label1="단가"
              children1={
                <AntdInput
                  value={
                    // 계산된 단가가 있다면 계산된 단가를 먼저 보여줌
                    (model.autoCalculatedUnitPrice && model.autoCalculatedUnitPrice > 0) ? model.autoCalculatedUnitPrice :
                    model.unitPrice
                  }
                  onChange={(e)=>{
                    // 특수사양이 있다면 단가의 값을 변경 못 하게 함 (이미 계산된 상태이므로)
                    if(model.specialSpecifications && model.specialSpecifications.length > 0) {
                      showToast("특수사양이 설정된 상태에서는 단가 변경이 불가능합니다.", "error");
                      return;
                    }
                    setPriceFlag(true);
                    handleModelDataChange(model.id ?? "", 'unitPrice', e.target.value);
                  }}
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

            <div className="flex-1 h-center justify-end">
              <Dropdown trigger={['click']} menu={{ items:[{
                label: 
                  <div className="text-[red] h-center gap-5">
                    <p className="w-16 h-16"><Trash /></p>
                    삭제
                  </div>,
                key: 0,
                onClick:()=>{
                  setProducts(products.filter(f=> f.id !== model.id));
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
            </div>
          </div>
          <DividerH className="border-bdDefault"/>

          <div className="w-full flex flex-col gap-15">
            <div className="h-center gap-5">
              <Checkbox
                checked={specFlag}
                onChange={()=>{
                  if(model.unitPrice && model.unitPrice > 0 && model.quantity && model.quantity > 0) {
                    setSpecFlag(!specFlag);
                  } else {
                    showToast("수량과 단가를 먼저 입력해주세요.", "error");
                  }
                }}
              />
              <span>특수사양</span>
              { model.unitPrice && model.unitPrice > 0 && model.quantity && model.quantity > 0 ? "" :
              <span className="text-[red]">(수량 및 단가 입력 후 선택)</span>
              }
            </div>
            { specFlag &&
            <div className="w-full bg-[#FFFFFF50] px-30 py-15 gap-15 flex">
              { spec.map((spec, index) => (
                <div className="w-1/2  h-center gap-5" key={index}>
                  <Checkbox
                    checked={(model.specialSpecifications ?? [])?.filter(f=>f.id === spec.id).length > 0}
                    onChange={()=>{
                      setPriceFlag(true);
                      handleSpecChange(
                        (model.specialSpecifications ?? []).filter(f=>f.id === spec.id).length < 1,
                        spec,
                        model.id ?? ""
                      )
                    }}
                  />
                  <span>{specialSpecToText(spec)}</span>
                </div>
              ))}
            </div>}
          </div>
        </div>
      </BoxHead>
    </BlueBox>
  )
}

export default EstimateModelHead;