import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "antd";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import { getAPI } from "@/api/get";
import { getPrtCsAPI } from "@/api/cache/client";

import { 
  newDataPartnerType, 
  partnerCUType, 
  partnerRType
} from "@/data/type/base/partner";
import { generateFloorOptions, ModelTypeEm } from "@/data/type/enum";
import { useBase } from "@/data/context/BaseContext";
import { useUser } from "@/data/context/UserContext";
import { BoardGroupType } from "@/data/type/base/board";
import { selectType } from "@/data/type/componentStyles";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { modelReq, salesModelsType } from "@/data/type/sayang/models";
import { changeSalesModelAddNewModel } from "@/data/type/sayang/changeData";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { isValidEmail } from "@/utils/formatEmail";
import { isValidTel } from "@/utils/formatPhoneNumber";
import { MOCK } from "@/utils/Mock";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Category from "@/assets/svg/icons/category.svg";
import Edit from '@/assets/svg/icons/memo.svg';
import Bag from "@/assets/svg/icons/bag.svg";

import { Popup } from "@/layouts/Body/Popup";
import { RightTab } from "@/layouts/Body/RightTab";

import AntdTable from "@/components/List/AntdTable";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { salesOrderModelAddClmn } from "@/components/ModelTable/Column";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSelectFill from "@/components/Select/AntdSelectFill";
import CustomAutoCompleteLabel from "@/components/AutoComplete/CustomAutoCompleteLabel";
import { IconButton } from "@/components/Button/IconButton";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import { LabelMedium } from "@/components/Text/Label";
import Items2, { Label } from "@/components/Item/Items2";
import BlueBox from "@/layouts/Body/BlueBox";

import ModelList from "@/contents/base/model/ModelList";
import BoxHead from "@/layouts/Body/BoxHead";
import LabelItem from "@/components/Text/LabelItem";
import cookie from "cookiejs";

const ModelAddLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { me } = useUser();
  const { showToast, ToastContainer } = useToast();

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

  const [model, setModel] = useState<salesModelsType | null>(null);

  const [updateChk, setUpdateChk] = useState<boolean>(false);
  useEffect(()=>{
    setUpdateChk(true);
  }, [model])

  useEffect(()=>{
    if(id && !id.includes("new"))  setModel({id:id.toString()});
    else                           setModel({id:'new'});
  }, [id])

  // ------------ 원판그룹(제조사) ------------ 시작
  const [boardGroupSelectList, setBoardGroupSelectList] = useState<selectType[]>([]);
  const [boardGroup, setBoardGroup] = useState<BoardGroupType[]>([]);
  const { refetch:refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board-group/jsxcrud/many'
      });

      if (result.resultCode === "OK_0000") {
        const bg = (result.data?.data ?? []) as BoardGroupType[];
        const arr = bg.map((d:BoardGroupType) => ({
          value: d.id,
          label: d.brdGrpName ?? "",
        }))
        setBoardGroup(bg);
        setBoardGroupSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 원판그룹(제조사) ------------ 끝

  // ------------ 거래처 데이터 세팅 ----------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  useEffect(()=>{
    if(cs?.data?.data?.length) {
      setCsList(cs.data?.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data?.data]);
  // ------------ 거래처 데이터 세팅 ------------ 끝

  // ------------ 거래처 데이터 등록 ------------ 시작
  const [addPartner, setAddPartner] = useState<boolean>(false);
  const [newPartner, setNewPartner] = useState<partnerCUType>(newDataPartnerType);
  const handleSubmitNewData = async (data: partnerCUType) => {
    try {
      if((data?.prtTel && !isValidTel(data?.prtTel)) ||
        (data?.prtEmail && !isValidEmail(data.prtEmail))
      ) {
        showToast("올바른 형식을 입력해주세요.", "error");
        return;
      }
      
      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        
        { ...data, prtTypeEm: 'cs', managers: undefined }
      );

      if(result.resultCode === 'OK_0000') {
        csRefetch();
        setAddPartner(false);
        showToast("거래처 등록 완료", "success");
        setNewPartner(newDataPartnerType);
        const entity = (result.data?.entity) as partnerRType;
        setModel({ ...model, partner: { id: entity.id } });
      } else {
        console.log(result);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 거래처 데이터 등록 ------------ 끝

  // ------------- 모델 데이터 세팅 ------------ 시작
  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  useEffect(()=>{
    if((model?.prdNm && model.prdNm.length > 2)
      || (model?.prdMngNo && model.prdMngNo.length > 2)) {
      setTimeout(()=>setSearchFlag(true), 500);
    } else {
      setSearchFlag(false);
    }
  }, [model?.prdNm, model?.prdMngNo]);

  const [modelList, setModelList] = useState<salesModelsType[]>([]);
  const [modelSelectList, setModelSelectList] = useState<selectType[]>([]);
  const [modelNoSelectList, setModelNoSelectList] = useState<selectType[]>([]);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", model?.prdNm, model?.prdMngNo, searchFlag],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        page: 0,
        limit: 100,
        s_query: { "$or": [
          (model?.prdNm ?? "").length > 0 ? {"prdNm": {"$startsL": model?.prdNm}} : {},
          (model?.prdMngNo ?? "").length > 0 ? {"prdMngNo": {"$startsL": model?.prdMngNo}} : {},
        ]}
      });

      if (result.resultCode === "OK_0000") {
        const arr = result.data?.data as salesModelsType[] ?? [];
        setModelList(arr);
        setModelSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdNm ?? "",
        })));
        setModelNoSelectList(arr.map((item) => ({
          value: item.id,
          label: item.prdMngNo ?? "",
        })));
        setSearchFlag(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: searchFlag && ((model?.prdNm ?? "").length > 2 || (model?.prdMngNo ?? "").length > 2)
  });
  // ------------- 모델 데이터 세팅 ------------ 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const {data:queryDetailData} = useQuery({
    queryKey: ['request/material/detail/jsxcrud/one', model?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: `models/jsxcrud/one/${model?.id}`
      });

      if(result.resultCode === "OK_0000") {
        setModel(result.data.data);
        // 디테일 세팅한 뒤에는 UPDATE가 false로 세팅되어야 함
        setTimeout(()=>setUpdateChk(false), 30);
      }

      return result;
    },
    enabled: !!model?.id && !model.id.includes("new")
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // 테이블에서 값 변경했을 때 실행되는 함수 (모델의 값 변경 시 실행 함수)
  const handleModelDataChange = (
    name: string,
    value: any
  ) => {
    setModel({...model, [name]: value});
  }; 

  const handleSubmit = async () => {
    try {
      if(!model) {
        return;
      }

      const jsonData = changeSalesModelAddNewModel(
        model,
        boardSelectList,
        boardGroupSelectList,
        metarialSelectList,
        surfaceSelectList,
        outSelectList,
        smPrintSelectList,
        smColorSelectList,
        smTypeSelectList,
        mkPrintSelectList,
        mkColorSelectList,
        mkTypeSelectList,
        unitSelectList,
      );
      console.log(JSON.stringify(jsonData));
      
      const val = validReq(jsonData, modelReq());
      if(!val.isValid && cookie.get('company') !== 'sy') {
        setErrMsg(val.missingLabels+'은(는) 필수 입력입니다.');
        setAlertType("error");
        setAlertOpen(true);
        return;
      }

      if(model.id?.includes("new")) {
        // 등록
        const resultPost = await postAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models',
          jsx: 'jsxcrud'
        }, jsonData);
  
        if(resultPost.resultCode === 'OK_0000') {
          showToast("등록 완료", "success");
          const entity = resultPost.data.entity as salesModelsType;
          setModel(entity);
          setTimeout(()=>setUpdateChk(false), 30);
        } else {
          const msg = resultPost?.response?.data?.message;
          setErrMsg(msg);
          setAlertType("error");
          setAlertOpen(true);
          console.log(msg);
        }
      } else {
        // 수정
        const resultPost = await patchAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models',
          jsx: 'jsxcrud'
        }, model.id ?? "", jsonData);
  
        if(resultPost.resultCode === 'OK_0000') {
          showToast("수정 완료", "success");
          setTimeout(()=>setUpdateChk(false), 30);
        } else {
          const msg = resultPost?.response?.data?.message;
          setErrMsg(msg);
          setAlertType("error");
          setAlertOpen(true);
          console.log(msg);
        }
      }

    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 모델 드로워
  const [modelDrawerOpen, setModelDrawerOpen] = useState<boolean>(false);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "close" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  return (<>
    <div className="p-30 flex v-between-h-center w-full">
      <p className="text-20 fw-500 font-semibold">{ model?.id?.includes("new") ? "모델 등록" : "모델 수정 및 상세"}</p>
      <p 
        className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
        onClick={(()=>{
          //모델을 저장하지 않았을 경우
          if(updateChk) {
            setAlertOpen(true);
            setAlertType("close");
          } else {
            router.push("/sales/model");
          }
        })}
      >
        <Close />
      </p>
    </div>
    <div className="w-full overflow-auto pl-30 pb-20 h-[calc(100vh-95px)]">
      <div className="w-full v-between-h-center gap-20 h-full">
        <div className="w-[calc(100%-100px)] h-full !min-w-[1200px]">
          <Popup className="w-full">
            <BlueBox>
              <BoxHead>
                <div className="!flex-1 !max-w-[calc(100%-90px)] flex flex-col gap-15">
                  <div className="h-center gap-15">
                    <div className="h-center gap-5">
                      <Label label="고객측 관리번호" className="!w-[140px]"/>
                      <AntdInput
                        value={model?.orderPrtNo}
                        onChange={(e)=>handleModelDataChange('orderPrtNo', e.target.value)}
                        styles={{ht:'32px', bg:'#FFF'}}
                        readonly={model?.usedYn}
                      />
                    </div>
                    <div className="h-center gap-5 flex-1">
                      <Label label="비고" className="!w-35"/>
                      <AntdInput
                        value={model?.remarks}
                        onChange={(e)=>handleModelDataChange('orderPrtNo', e.target.value)}
                        styles={{ht:'32px', bg:'#FFF'}}
                        readonly={model?.usedYn}
                      />
                    </div>
                  </div>
                  { cookie.get('company') === 'sy' &&
                  <div className="h-center gap-15">
                    <Items2
                      label1="고객"
                      children1={
                        <CustomAutoComplete
                          option={csList}
                          value={model?.partner?.id}
                          onChange={(value) => {
                            setModel({
                              ...model,
                              partner: {id: value ?? ""}
                            });
                          }}
                          handleAddData={()=>setAddPartner(true)}
                          addLabel="고객 추가하기"
                          className="!h-32 !rounded-2" inputClassName="!h-32 !rounded-2"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                    />

                    <Items2
                      label1="모델명" size1={3}
                      children1={
                        <CustomAutoCompleteLabel
                          option={modelSelectList}
                          label={model?.prdNm}
                          onInputChange={(value) => {
                            if(value.length < 3) {
                              setModelSelectList([]);
                              setModelNoSelectList([]);
                            }
                            setModel({...model, prdNm: value});
                          }}
                          value={model?.id}
                          onChange={(value) => {
                            const m = modelList.find(f=>f.id === value);
                            if(m && model?.id) {
                              console.log(m);
                              setModel({
                                ...m,
                                id: model.id,
                                usedYn: false,
                              });
                            }
                          }}
                          inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
                          placeholder="모델명 검색 또는 입력 (3글자 이상)"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                    />

                    <Items2
                      label1="관리번호"
                      children1={
                        <CustomAutoCompleteLabel
                          option={modelNoSelectList}
                          label={model?.prdMngNo}
                          onInputChange={(value) => {
                            if(value.length < 3) {
                              setModelSelectList([]);
                              setModelNoSelectList([]);
                            }
                            setModel({...model, prdNm: "", prdMngNo: value});
                          }}
                          value={model?.id}
                          onChange={(value) => {
                            const m = modelList.find(f=>f.id === value);
                            if(m && model?.id) {
                              console.log(m);
                              setModel({
                                ...m,
                                id: model.id,
                                usedYn: false,
                              });
                            }
                          }}
                          inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
                          placeholder="관리번호 검색"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                    />

                    <Items2
                      label1="Rev"
                      children1={
                        <AntdInput
                          value={model?.prdRevNo}
                          onChange={(e)=>handleModelDataChange('prdRevNo', e.target.value)}
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                    />

                    <Items2
                      label1="도면번호"
                      children1={
                        <AntdInput
                          value={model?.drgNo}
                          onChange={(e)=>handleModelDataChange('drgNo', e.target.value)}
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                    />
                    
                    <Items2
                      label1="재질"
                      children1={
                        <AntdSelectFill
                          options={metarialSelectList}
                          value={model?.material?.id ?? metarialSelectList?.[0]?.value}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              material: {id: e+""}
                            });
                          }}
                          styles={{ht:'32px', bg:'#FFF', br: '2px'}} dropWidth="180px"
                          readonly={model?.usedYn}
                        />
                      }
                    />

                    <Items2
                      label1="제조사"
                      children1={
                        <AntdSelectFill
                          options={boardGroupSelectList}
                          value={model?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              boardGroup: {id: e+""}
                            });
                          }}
                          styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                          readonly={model?.usedYn}
                        />
                      }
                    />

                    <Items2
                      label1="두께" size1={1}
                      children1={
                        <AntdInput
                          value={model?.thk}
                          onChange={(e)=>handleModelDataChange('thk', e.target.value)}
                          type="number"
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                        />
                      }
                    />
                  </div>}
                  { cookie.get('company') !== 'sy' &&
                  <div className="h-center gap-15">
                    <Items2
                      size1={1}
                      children1={
                        <AntdSelect
                          options={[
                            {value:ModelTypeEm.SAMPLE,label:'샘플'},
                            {value:ModelTypeEm.PRODUCTION,label:'양산'},
                          ]}
                          value={model?.modelTypeEm ?? ModelTypeEm.SAMPLE}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              modelTypeEm: ModelTypeEm.SAMPLE === e+"" ? ModelTypeEm.SAMPLE : ModelTypeEm.PRODUCTION
                            });
                          }}
                          styles={{ht:'32px', bw:'0', pd:'0'}} 
                          readonly={model?.usedYn}
                        />
                      }
                      label2="고객"
                      children2={
                        <CustomAutoComplete
                          option={csList}
                          value={model?.partner?.id}
                          onChange={(value) => {
                            setModel({
                              ...model,
                              partner: {id: value ?? ""}
                            });
                          }}
                          handleAddData={()=>setAddPartner(true)}
                          addLabel="고객 추가하기"
                          className="!h-32 !rounded-2" inputClassName="!h-32 !rounded-2"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                    />
                    
                    <Items2
                      label1="모델명" size1={3}
                      children1={
                        <CustomAutoCompleteLabel
                          option={modelSelectList}
                          label={model?.prdNm}
                          onInputChange={(value) => {
                            if(value.length < 3) {
                              setModelSelectList([]);
                              setModelNoSelectList([]);
                            }
                            setModel({...model, prdNm: value});
                          }}
                          value={model?.id}
                          onChange={(value) => {
                            const m = modelList.find(f=>f.id === value);
                            if(m && model?.id) {
                              console.log(m);
                              setModel({
                                ...m,
                                id: model.id,
                                usedYn: false,
                              });
                            }
                          }}
                          inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
                          placeholder="모델명 검색 또는 입력 (3글자 이상)"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                      label2="Rev" size2={3}
                      children2={
                        <AntdInput
                          value={model?.prdRevNo}
                          onChange={(e)=>handleModelDataChange('prdRevNo', e.target.value)}
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                    />

                    <Items2
                      label1="관리번호"
                      children1={
                        <CustomAutoCompleteLabel
                          option={modelNoSelectList}
                          label={model?.prdMngNo}
                          onInputChange={(value) => {
                            if(value.length < 3) {
                              setModelSelectList([]);
                              setModelNoSelectList([]);
                            }
                            setModel({...model, prdNm: "", prdMngNo: value});
                          }}
                          value={model?.id}
                          onChange={(value) => {
                            const m = modelList.find(f=>f.id === value);
                            if(m && model?.id) {
                              console.log(m);
                              setModel({
                                ...m,
                                id: model.id,
                                usedYn: false,
                              });
                            }
                          }}
                          inputClassName="!h-32 !rounded-2" className="!h-32 !rounded-2"
                          placeholder="관리번호 검색"
                          readonly={model?.usedYn} clear={false}
                        />
                      }
                      label2="필름번호"
                      children2={
                        <AntdInput
                          value={model?.fpNo} disabled styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                    />
                    
                    <Items2
                      label1="도면번호"
                      children1={
                        <AntdInput
                          value={model?.drgNo}
                          onChange={(e)=>handleModelDataChange('drgNo', e.target.value)}
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                      label2="재질"
                      children2={
                        <AntdSelectFill
                          options={metarialSelectList}
                          value={model?.material?.id ?? metarialSelectList?.[0]?.value}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              material: {id: e+""}
                            });
                          }}
                          styles={{ht:'32px', bg:'#FFF', br: '2px'}} dropWidth="180px"
                          readonly={model?.usedYn}
                        />
                      }
                    />
                    
                    <Items2
                      label1="원판"
                      children1={
                        <AntdSelectFill
                          options={boardSelectList}
                          value={model?.board?.id ?? boardSelectList?.[0]?.value}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              board: {id: e+""}
                            });
                          }}
                          styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                          readonly={model?.usedYn}
                        />
                      }
                      label2="제조사"
                      children2={
                        <AntdSelectFill
                          options={boardGroupSelectList}
                          value={model?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value}
                          onChange={(e)=>{
                            setModel({
                              ...model,
                              boardGroup: {id: e+""}
                            });
                          }}
                          styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                          readonly={model?.usedYn}
                        />
                      }
                    />
                    
                    <Items2
                      label1="층" size1={1}
                      children1={
                        <AntdSelectFill
                          options={generateFloorOptions()}
                          value={model?.layerEm ?? "L1"}
                          onChange={(e)=>handleModelDataChange('layerEm', e)}
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF'}}
                        />
                      }
                      label2="두께" size2={1}
                      children2={
                        <AntdInput
                          value={model?.thk}
                          onChange={(e)=>handleModelDataChange('thk', e.target.value)}
                          type="number"
                          readonly={model?.usedYn} styles={{ht:'32px', bg:'#FFF', br: '2px'}}
                        />
                      }
                    />
                  </div>}
                </div>
                <div className="w-85">
                  <Items2
                    label1="모델 등록일"
                    children1={
                      <div className="h-32 h-center">
                        {dayjs(model?.createdAt).format("YYYY-MM-DD")}
                      </div>
                    }
                  />
                </div>
              </BoxHead>
              <AntdTable
                columns={
                cookie.get('company') === 'sy' ?
                salesOrderModelAddClmn(
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
                  surfaceSelectList,
                  ozUnitSelectList,
                  handleModelDataChange,
                  model?.usedYn ?? false,
                  stampColorSelectList,
                  stampTypeSelectList,
                )?.filter(f=>f.key !== 'dongback' && f.key !== 'sm' && f.key !== 'mk' && f.key !== 'arkit'
                  && f.key !== 'kit' && f.key !== 'pnl' && f.key !== 'kitpcs')
                :
                salesOrderModelAddClmn(
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
                  surfaceSelectList,
                  ozUnitSelectList,
                  handleModelDataChange,
                  model?.usedYn ?? false,
                )}
                data={[model]}
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px', td_bg:'#FFF', round:'0'}}
                tableProps={{split:'none'}}
              />
            </BlueBox>
            <div className="h-center justify-end">
              <Tooltip
                title={model?.usedYn ? "사용한 모델은 수정할 수 없습니다." : undefined}
              >
              <Button
                className="w-[109px] h-32 bg-point1 text-white rounded-6"
                style={model?.usedYn ? {} : {color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>handleSubmit()}
                disabled={model?.usedYn}
              >
                <Arrow /> 모델 저장
              </Button>
              </Tooltip>
            </div>
          </Popup>
        </div>
        
        {/* 우측 탭 */}
        <RightTab>
          <IconButton
            icon={<Category />}
            size="lg"
            onClick={()=>{
              setModelDrawerOpen(true);
            }}
          />
        </RightTab>
      </div>

    </div>

      {/* 모델 목록 드로워 */}
      <AntdDrawer
        open={modelDrawerOpen}
        close={()=>{setModelDrawerOpen(false);}}
        width={700}
      >
        <div className="w-full px-20 py-30 flex flex-col gap-20">
          <div className="v-between-h-center">
            <LabelMedium label="모델 목록" />
            <div className="cursor-pointer" onClick={() => setModelDrawerOpen(false)}>
              <Close/>
            </div>
          </div>
          <ModelList
            type="model"
            setDrawerOpen={setModelDrawerOpen}
            partnerId={model?.partner?.id}
            model={model}
            setModel={setModel}
          />
        </div>
      </AntdDrawer>

    {/* 거래처 등록 */}
    <BaseInfoCUDModal
      title={{name: "거래처 등록", icon: <Bag/>}}
      open={addPartner} 
      setOpen={setAddPartner} 
      onClose={() => {
        setAddPartner(false);
        setNewPartner(newDataPartnerType);
      }}
      items={MOCK.clientItems.CUDPopItems} 
      data={newPartner}
      onSubmit={handleSubmitNewData}
      onDelete={()=>{}}
    />

    {/* 삭제 시 확인 모달창 */}
    <AntdAlertModal
      open={alertOpen}
      setOpen={setAlertOpen}
      type={
        alertType === "error" ? "error" :
        "warning"}
      title={
        alertType === "error" ? "오류 발생" :
        alertType === "close" ? "저장되지 않았습니다." :
        ""
      }
      contents={
        alertType === "error" ? <>{errMsg}</> :
        alertType === "close" ? <>저장하지 않고 나가시면 해당 정보는 삭제됩니다.<br/>정말 나가시겠습니까?</> :
        <></>
      }
      onOk={()=>{
        setAlertOpen(false);
        if(alertType === "close") {
          router.push("/sales/model");
        }
      }}
      onCancel={()=>{
        setAlertOpen(false);
      }}
      hideCancel={alertType === "error" ? true : false}
      okText={
        alertType === "error" ? "확인" :
        alertType === "close" ? "그래도 나갈게요" :
        ""
      }
      cancelText={
        alertType === "close" ? "아니요 이어서 작성할게요" :
        ""
      }
    />
    
    <ToastContainer />
  </>)
}

export default ModelAddLayout;