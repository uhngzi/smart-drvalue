import type { InputRef } from 'antd';
import { useEffect, useRef, useState } from "react";
import { Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getAPI } from "@/api/get";
import { postAPI } from '@/api/post';
import { patchAPI } from '@/api/patch';
import dayjs from 'dayjs';

import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import AntdInput from "@/components/Input/AntdInput";
import AntdTable from "@/components/List/AntdTable";
import AntdSelect from "@/components/Select/AntdSelect";
import AddDrawer from '@/contents/sayang/model/add/AddDrawer';

import PopRegLayout from "@/layouts/Main/PopRegLayout";

import { ModelStatus } from "@/data/type/enum";
import { sayangModelWaitAddClmn } from "@/data/columns/Sayang";
import { modelsType, orderModelType } from "@/data/type/sayang/models";
import { useBase } from '@/data/context/BaseContext';
import useToast from '@/utils/useToast';

import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import Loading from '@/components/Loading/Loading';

const SayangModelAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();
  const router = useRouter();
  const { id:orderId } = router.query;
  
  // 디폴트 값 가져오기
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
  
  const [modelDataLoading, setModelDataLoading] = useState<boolean>(true);
  const [modelData, setModelData] = useState<modelsType[]>([]);
  const { data:modelQueryData, isLoading:modelQueryLoading, refetch:modelQueryRefetch } = useQuery({
    queryKey: ['models/jsxcrud/many'],
    queryFn: async () =>{
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models/jsxcrud/many',
        });
      } catch (e) {
        console.log('models/jsxcrud/many Error : ', e);
        return;
      }
    }
  });
  useEffect(()=>{
    setModelDataLoading(true);
    if(!modelQueryLoading && modelQueryData?.resultCode === "OK_0000") {
      setModelData(modelQueryData?.data.data ?? []);
      setModelDataLoading(false);
    }
  }, [modelQueryData]);

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [data, setData] = useState<orderModelType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['sales-order/product/jsxcrud/many/by-order-idx', orderId],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `sales-order/product/jsxcrud/many/by-order-idx/${orderId}`
        });
      } catch (e) {
        return;
      }
    },
    enabled: !!orderId,
  });

  // 첫 접속 시 자동 포커스를 위한 Flag
  const [focusInitialized, setFocusInitialized] = useState(false);
  // 첫 모델명 ref
  const inputRef = useRef<InputRef>(null);
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const arr = (queryData?.data.data ?? []).map((d:orderModelType, index:number) => ({
        ...d,
        // model: 
        tempPrdInfo: d.tempPrdInfo ? JSON.parse(d.tempPrdInfo) : "",  // 임시 저장된 값 파싱해서 가져오기
        index: (queryData?.data?.data?.length ?? 0) - index,
      }));
      console.log('arr', arr);
      setData(arr);
      setDataLoading(false);

      if (!focusInitialized && inputRef.current) {
        inputRef.current.focus(); // 포커스 설정
        setFocusInitialized(true); // 이후 실행 방지
      }
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // 우측 탭
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectTabDrawer, setSelectTabDrawer] = useState<number>(1);

  // 임시 함수
  function deleteModel(idx: number) {
    setData(data.filter((f:any) => f.id !== idx));
  }

  // 테이블에서 값 변경했을 때 실행되는 함수 (모델의 값 변경 시 실행 함수)
  const handleModelDataChange = (
    id: string,
    name: string,
    value: any
  ) => {
    // 데이터를 복사
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const keys = name.split("."); // ['model', 'a']
        const updatedItem = { ...item };
  
        // 마지막 키를 제외한 객체 탐색
        const lastKey = keys.pop()!;
        let targetObject: any = updatedItem;
  
        keys.forEach((key) => {
          // 중간 키가 없거나 null인 경우 초기화
          if (!targetObject[key] || typeof targetObject[key] !== "object") {
            targetObject[key] = {};
          }
          targetObject = targetObject[key];
        });
  
        // 최종 키에 새 값 할당
        targetObject[lastKey] = value;
  
        return updatedItem;
      }
      return item; // 다른 데이터는 그대로 유지
    });
  
    setData(updatedData); // 상태 업데이트
  }; 

  // 임시저장 시 실행되는 함수
  const handleSumbitTemp = async (id:string) => {
    try {
      const tempData = data.find((d:orderModelType) => d.id === id);
      const jsonData = {
        currPrdInfo: tempData?.currPrdInfo,
        tempPrdInfo: {
          ...tempData?.tempPrdInfo,
          ...tempData?.editModel,
          partner: tempData?.prtInfo?.prt?.id,
          prdNm: tempData?.model?.prdNm,
          mnfNm: tempData?.model?.mnfNm,
        },
        partnerId: tempData?.prtInfo?.prt?.id,
        partnerManagerId: tempData?.prtInfo?.mng?.id,
        order: { id: tempData?.order?.id },
        model: { ...tempData?.model },
        modelStatus: tempData?.modelStatus,
        orderDt: tempData?.orderDt,
        orderTit: tempData?.orderTit,
        prtOrderNo: tempData?.prtOrderNo,
        orderPrdRemark: tempData?.orderPrdRemark,
        orderPrdCnt: tempData?.orderPrdCnt,
        orderPrdUnitPrice: tempData?.orderPrdUnitPrice,
        orderPrdPrice: tempData?.orderPrdPrice,
        orderPrdDueReqDt: tempData?.orderPrdDueReqDt,
        orderPrdDueDt: tempData?.orderPrdDueDt,
        orderPrdHotGrade: tempData?.orderPrdHotGrade
      }
      console.log(JSON.stringify(jsonData));

      const result = await patchAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/product',
        jsx: 'jsxcrud'
      }, id, jsonData);
  
      if(result.resultCode === 'OK_0000') {
        showToast("임시저장 완료", "success");
    
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }

  // 확정저장 시 실행되는 함수
  const handleSubmit = async (id:string) => {
    // 기존에 있는 모델을 선택한 것이 아닐 경우 새로 생성해야 함
    const tempData = data.find((d:orderModelType) => d.id === id);
    const jsonData = {
      inactiveYn: false,
      partner: { id: tempData?.prtInfo?.prt?.id },
      prdNm: tempData?.model?.prdNm,
      board: { id: tempData?.model?.board?.id ?? boardSelectList?.[0]?.value },
      mnfNm: tempData?.model?.mnfNm,
      fpNo: tempData?.editModel?.fpNo ?? tempData?.tempPrdInfo?.fpNo,
      drgNo: tempData?.editModel?.drgNo ?? tempData?.tempPrdInfo?.drgNo,
      thk: tempData?.editModel?.thk ?? tempData?.tempPrdInfo?.thk,
      prdRevNo: tempData?.editModel?.prdRevNo ?? tempData?.tempPrdInfo?.prdRevNo,
      layerEm: tempData?.editModel?.layerEm ?? tempData?.tempPrdInfo?.layerEm ?? "L1",
      modelTypeEm: tempData?.editModel?.modelTypeEm ?? tempData?.tempPrdInfo?.modelTypeEm ?? "sample",
      copOut: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copOut,
      copIn: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copIn,
      material: { id: tempData?.editModel?.material?.id  ?? tempData?.tempPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value },
      surface: { id: tempData?.editModel?.surface?.id  ?? tempData?.tempPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value },
      smPrint: { id: tempData?.editModel?.smPrint?.id  ?? tempData?.tempPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value },
      smColor: { id: tempData?.editModel?.smColor?.id  ?? tempData?.tempPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value },
      smType: { id: tempData?.editModel?.smType?.id  ?? tempData?.tempPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value },
      mkPrint: { id: tempData?.editModel?.mkPrint?.id  ?? tempData?.tempPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value },
      mkColor: { id: tempData?.editModel?.mkColor?.id  ?? tempData?.tempPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value },
      mkType: { id: tempData?.editModel?.mkType?.id  ?? tempData?.tempPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value },
      spPrint: { id: tempData?.editModel?.spPrint?.id  ?? tempData?.tempPrdInfo?.spPrint?.id },
      spType: { id: tempData?.editModel?.spType?.id  ?? tempData?.tempPrdInfo?.spType?.id },
      aprType: { id: tempData?.editModel?.aprType?.id  ?? tempData?.tempPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value },
      vcutYn: tempData?.editModel?.vcutYn ?? tempData?.tempPrdInfo?.vcutYn ?? false,
      vcutType: { id: tempData?.editModel?.vcutType?.id ?? tempData?.tempPrdInfo?.vcutType?.id },
      unit: { id: tempData?.editModel?.unit?.id ?? tempData?.tempPrdInfo?.unit?.id },
      pcsW: tempData?.editModel?.pcsW ?? tempData?.tempPrdInfo?.pcsW,
      pcsL: tempData?.editModel?.pcsL ?? tempData?.tempPrdInfo?.pcsL,
      kitW: tempData?.editModel?.kitW ?? tempData?.tempPrdInfo?.kitW,
      kitL: tempData?.editModel?.kitL ?? tempData?.tempPrdInfo?.kitL,
      pnlW: tempData?.editModel?.pnlW ?? tempData?.tempPrdInfo?.pnlW,
      pnlL: tempData?.editModel?.pnlL ?? tempData?.tempPrdInfo?.pnlL,
      ykitW: tempData?.editModel?.ykitW ?? tempData?.tempPrdInfo?.ykitW,
      ykitL: tempData?.editModel?.ykitL ?? tempData?.tempPrdInfo?.ykitL,
      ypnlW: tempData?.editModel?.ypnlW ?? tempData?.tempPrdInfo?.ypnlW,
      ypnlL: tempData?.editModel?.ypnlL ?? tempData?.tempPrdInfo?.ypnlL,
      kitPcs: tempData?.editModel?.kitPcs ?? tempData?.tempPrdInfo?.kitPcs,
      pnlKit: tempData?.editModel?.pnlKit ?? tempData?.tempPrdInfo?.pnlKit,
      sthPnl: tempData?.editModel?.sthPnl ?? tempData?.tempPrdInfo?.sthPnl,
      sthPcs: tempData?.editModel?.sthPcs ?? tempData?.tempPrdInfo?.sthPcs,
      pltThk: tempData?.editModel?.pltThk ?? tempData?.tempPrdInfo?.pltThk,
      pltAlph: tempData?.editModel?.pltAlph ?? tempData?.tempPrdInfo?.pltAlph,
      spPltNi: tempData?.editModel?.spPltNi ?? tempData?.tempPrdInfo?.spPltNi,
      spPltNiAlph: tempData?.editModel?.spPltNiAlph ?? tempData?.tempPrdInfo?.spPltNiAlph,
      spPltAu: tempData?.editModel?.spPltAu ?? tempData?.tempPrdInfo?.spPltAu,
      spPltAuAlph: tempData?.editModel?.spPltAuAlph ?? tempData?.tempPrdInfo?.spPltAuAlph,
      pinCnt: tempData?.editModel?.pinCnt ?? tempData?.tempPrdInfo?.pinCnt,
    }
    console.log(JSON.stringify(jsonData));

    const resultPost = await postAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: 'models',
      jsx: 'jsxcrud'
    }, jsonData);

    if(resultPost.resultCode === 'OK_0000') {
      const modelId = resultPost.data?.entity?.id;
      console.log('MODEL ID : ', modelId);
      handleConfirm(id, modelId);
    } else {
      const msg = resultPost?.response?.data?.message;
      showToast(msg, "error");
      console.log(msg);
    }
  }

  // 확정저장 시 실행되는 함수 ("그대로 등록"은 위 submit 거치지 않고 바로 들어옴)
  const handleConfirm = async (id: string, modelId: string) => {
    const resultPatch = await patchAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: `models-match/default/confirm/input-model/${id}`,
      jsx: 'default',
      etc: true,
    },
    id,
    {modelId: modelId });

    if(resultPatch.resultCode === 'OK_0000') {
      showToast("확정저장 완료", "success");
  
      refetch();
    } else {
      const msg = resultPatch?.response?.data?.message;
      showToast(msg, "error");
      console.log(msg);
    }
  }

  const [newFlag, setNewFlag] = useState<boolean>(true);
  const [selectId, setSelectId] = useState<string | null>(null);

  return (
    <>
      <div 
        className="gap-20 flex"
        style={{minWidth:1600}}
      >
        <div className="border-1 bg-white  border-line rounded-14 p-20 flex flex-col overflow-auto gap-40" style={{width:'calc(100% - 100px)', height:'calc(100vh - 192px)'}}>
        { dataLoading && <Loading loading={dataLoading} />}
        { !dataLoading &&
        data.map((model:orderModelType, index:number) => (
          <div className="flex flex-col gap-16" key={model.id}>
            <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">발주명</p>
                <AntdInput 
                  value={model.orderTit}
                  className="w-[180px!important]" readonly={true} styles={{ht:'32px', bg:'#F5F5F5'}}
                />
                <p className="h-center justify-end">관리번호 </p>
                <AntdInput 
                  value={model.prtOrderNo}
                  className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}} readonly={true}
                />
                <AntdSelect
                  options={[
                    {value:ModelStatus.NEW,label:'신규'},
                    {value:ModelStatus.REPEAT,label:'반복'},
                    {value:ModelStatus.MODIFY,label:'수정'},
                  ]}
                  value={model.modelStatus}
                  className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                />
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">모델명 </p>
                <AntdInput
                  ref={index === 0 ? inputRef : null}
                  className="w-[180px!important]" styles={{ht:'32px'}}
                  value={model.model?.prdNm}
                  onChange={(e)=>handleModelDataChange(model.id, 'model.prdNm', e.target.value)}
                  readonly={selectId === model.id ? !newFlag : undefined}
                />
                <p className="h-center justify-end">원판 </p>
                <AntdSelect
                  options={boardSelectList}
                  value={model.model?.board?.id ?? boardSelectList?.[0]?.value}
                  onChange={(e)=>handleModelDataChange(model.id, 'model.board.id', e)}
                  className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                  disabled={selectId === model.id ? !newFlag : undefined}
                />
                <p className="h-center justify-end">제조사 </p>
                <AntdInput 
                  value={model.model?.mnfNm}
                  onChange={(e)=>handleModelDataChange(model.id, 'model.mnfNm', e.target.value)}
                  className="w-[120px!important]" styles={{ht:'32px'}}
                  readonly={selectId === model.id ? !newFlag : undefined}
                />
                <p className="h-center justify-end">재질 </p>
                <AntdSelect
                  options={metarialSelectList}
                  value={model.model?.material?.id ?? metarialSelectList?.[0]?.value}
                  onChange={(e)=>handleModelDataChange(model.id, 'model.material.id', e)}
                  className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                  disabled={selectId === model.id ? !newFlag : undefined}
                />
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">납기 </p>
                <p className="h-center justify-end">{
                  model.orderPrdDueDt ?
                  dayjs(model.orderPrdDueDt).format('YYYY-MM-DD') : null
                }</p>
              </div>
            </div>
            <div className="flex flex-col ">
              <AntdTable
                columns={sayangModelWaitAddClmn(
                  deleteModel,
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
                  handleModelDataChange,
                  newFlag,
                  selectId,
                )}
                data={[model]}
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
                tableProps={{split:'none'}}
                />
            </div>
            <div className="w-full h-32 flex justify-end gap-5">
              <FullOkButtonSmall
                click={()=>{
                  //그대로 등록일 경우에는 바로 확정만 진행
                  if(!newFlag && selectId === model.id) {
                    handleConfirm(model.id, model?.editModel?.id);
                    return;
                  }
                  handleSubmit(model.id);
                }}
                label="확정저장"
              />
              <Button variant="outlined" color="primary"
                onClick={()=>{
                  handleSumbitTemp(model.id);
                }}
              >임시저장</Button>
            </div>
          </div>
        ))}
        </div>
        <div className=" min-w-[80px] w-[3%] px-10 py-20 h-center flex-col bg-white rounded-l-14 gap-20" style={{height:'calc(100vh - 192px)'}} key="contents-tab">
          <div 
            className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
            onClick={()=>{
              setSelectTabDrawer(1);
              setDrawerOpen(true)
            }}
          >
            <p className="w-20 h-20"><User /></p>
          </div>
          <div 
            className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
            onClick={()=>{
              setSelectTabDrawer(2);
              setDrawerOpen(true);
            }}
          >
            <p className="w-20 h-20"><Category /></p>
          </div>
        </div>
      </div>

      <AddDrawer
        orderId={orderId}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectTabDrawer={selectTabDrawer}
        setSelectTabDrawer={setSelectTabDrawer}
        products={data}
        setProducts={setData}
        setNewFlag={setNewFlag}
        selectId={selectId}
        setSelectId={setSelectId}
        modelData={modelData}
        setModelData={setModelData}
        modelDataLoading={modelDataLoading}
      />
      <ToastContainer />
    </>
  )
}

SayangModelAddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout 
    title="모델 등록"
    // menuTitle="모델 등록 및 현황"
    // subTitle="모델등록"
    // menu={[]}
  >{page}</PopRegLayout>
)

export default SayangModelAddPage;