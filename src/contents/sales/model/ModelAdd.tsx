import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useUser } from "@/data/context/UserContext";

import useToast from "@/utils/useToast";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Category from "@/assets/svg/icons/category.svg";
import Edit from '@/assets/svg/icons/memo.svg';
import Bag from "@/assets/svg/icons/bag.svg";

import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { Popup } from "@/layouts/Body/Popup";
import SalesModelTable from "@/components/ModelTable/SalesModelTable";
import { modelReq, orderModelType, salesModelsType } from "@/data/type/sayang/models";
import { validReq } from "@/utils/valid";
import { postAPI } from "@/api/post";
import { changeModelAddNewModel, changeSalesModelAddNewModel } from "@/data/type/sayang/changeData";
import { useBase } from "@/data/context/BaseContext";
import AntdInput from "@/components/Input/AntdInput";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import { getPrtCsAPI } from "@/api/cache/client";
import { newDataPartnerType, partnerCUType, partnerRType } from "@/data/type/base/partner";
import AntdSelect from "@/components/Select/AntdSelect";
import { selectType } from "@/data/type/componentStyles";
import { BoardGroupType } from "@/data/type/base/board";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { isValidTel } from "@/utils/formatPhoneNumber";
import { isValidEmail } from "@/utils/formatEmail";
import { ModelTypeEm } from "@/data/type/enum";
import AntdTable from "@/components/List/AntdTable";
import { salesOrderModelAddClmn, salesOrderModelClmn } from "@/components/ModelTable/Column";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import { Button } from "antd";

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
  } = useBase();

  const [model, setModel] = useState<salesModelsType>();

  useEffect(()=>{
    if(id && !id.includes("new"))  setModel({id:id.toString()});
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

  const [searchCs, setSearchCs] = useState<string>("");
  useEffect(()=>{
    if(model?.partner?.id)
      setSearchCs(model?.partner?.id);
  }, [model?.partner?.id])
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
        
        { ...data, prtTypeEm: 'cs'}
      );

      if(result.resultCode === 'OK_0000') {
        csRefetch();
        setAddPartner(false);
        showToast("거래처 등록 완료", "success");
        setNewPartner(newDataPartnerType);
      } else {
        console.log(result);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 거래처 데이터 등록 ------------ 끝

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
      }

      return result;
    },
    enabled: !!model?.id
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
      if(!val.isValid) {
        setErrMsg(val.missingLabels+'은(는) 필수 입력입니다.');
        setAlertType("error");
        setAlertOpen(true);
        return;
      }

      const resultPost = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'models',
        jsx: 'jsxcrud'
      }, jsonData);

      if(resultPost.resultCode === 'OK_0000') {
        showToast("등록 완료", "success");
      } else {
        const msg = resultPost?.response?.data?.message;
        setErrMsg(msg);
        setAlertType("error");
        setAlertOpen(true);
        console.log(msg);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  return (<>
    <div className="p-30 flex v-between-h-center w-full">
      <p className="text-20 fw-500 font-semibold">{ id?.includes("new") ? "모델 신규 등록" : "모델 상세 보기"}</p>
      <p 
        className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
        onClick={(()=>{
          router.push("/sales/model");
        })}
      >
        <Close />
      </p>
    </div>
    <div className="w-full overflow-auto pl-30 pb-20 h-[calc(100vh-95px)]">
      <div className="w-full v-between-h-center gap-20 h-full">
        <div className="w-[calc(100%-100px)] h-full">
          <Popup className="!min-w-[1820px]">
            <div
              className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 p-15 gap-10"
            >
              <div className="w-full min-h-60 h-center gap-15">
                <div className="!flex-1 !max-w-[calc(100%-90px)] h-center gap-20">
                  <Item
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
                        readonly={!id?.includes("new")}
                      />
                    }
                  />

                  <Item
                    label1="모델명" size1={3}
                    children1={
                      <AntdInput 
                        value={model?.prdNm}
                        onChange={(e)=> {
                          setModel({
                            ...model,
                            prdNm: e.target.value
                          });
                        }}
                        readonly={!id?.includes("new")}
                      />
                    }
                  />

                  <Item
                    label1="관리번호"
                    children1={
                      <AntdInput
                        value={model?.prdMngNo} disabled
                      />
                    }
                  />
                  
                  <Item
                    label1="필름번호"
                    children1={
                      <AntdInput
                        value={model?.fpNo} disabled styles={{ht:'32px', bg:'#FFF'}}
                      />
                    }
                  />
                  
                  <Item
                    label1="제조사"
                    children1={
                      <AntdSelect
                        options={boardGroupSelectList}
                        value={model?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value}
                        onChange={(e)=>{
                          setModel({
                            ...model,
                            boardGroup: {id: e+""}
                          });
                        }}
                        styles={{ht:'32px', bw:'0px', pd:'0'}}
                        readonly={!id?.includes("new")}
                      />
                    }
                  />
                  
                  <Item
                    label1="원판"
                    children1={
                      <AntdSelect
                        options={boardSelectList}
                        value={model?.board?.id ?? boardSelectList?.[0]?.value}
                        onChange={(e)=>{
                          setModel({
                            ...model,
                            board: {id: e+""}
                          });
                        }}
                        styles={{ht:'32px', bw:'0px', pd:'0'}}
                        readonly={!id?.includes("new")}
                      />
                    }
                  />
                  
                  <Item
                    label1="재질"
                    children1={
                      <AntdSelect
                        options={metarialSelectList}
                        value={model?.material?.id ?? metarialSelectList?.[0]?.value}
                        onChange={(e)=>{
                          setModel({
                            ...model,
                            material: {id: e+""}
                          });
                        }}
                        styles={{ht:'32px', bw:'0px', pd:'0'}} dropWidth="180px"
                        readonly={!id?.includes("new")}
                      />
                    }
                  />
          
                  <Item
                    label1="구분"
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
                        readonly={!id?.includes("new")}
                      />
                    }
                  />
                </div>
              </div>
              <AntdTable
                columns={salesOrderModelAddClmn(
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
                  handleModelDataChange,
                  id?.includes("new") ? false : true,
                )}
                data={[model]}
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px', td_bg:'#FFF', round:'0'}}
                tableProps={{split:'none'}}
              />
            </div>
            { id?.includes("new") &&
            <div className="h-center justify-end">
              <Button
                className="w-[109px] h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>handleSubmit()}
              >
                <Arrow /> 모델 저장
              </Button>
            </div>}
          </Popup>
        </div>
      </div>
    </div>

    {/* 삭제 시 확인 모달창 */}
    <AntdAlertModal
      open={alertOpen}
      setOpen={setAlertOpen}
      type={
        alertType === "error" ? "error" :
        "warning"}
      title={
        alertType === "error" ? "오류 발생" :
        ""
      }
      contents={
        alertType === "error" ? <>{errMsg}</> :
        <></>
      }
      onOk={()=>{
        setAlertOpen(false);
      }}
      onCancle={()=>{
        setAlertOpen(false);
      }}
      hideCancel={alertType === "error" ? true : false}
      okText={
        alertType === "error" ? "확인" :
        ""
      }
      cancelText={""}
    />
    
    <ToastContainer />
  </>)
}

export default ModelAddLayout;