import styled from "styled-components";
import { Button, Radio, Spin, Tooltip } from "antd";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { List } from "@/layouts/Body/List";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import Info from "@/assets/svg/icons/s_grayInfo.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import { useQuery } from "@tanstack/react-query";

import { LayerEm } from "@/data/type/enum";
import { specModelType, specType } from "@/data/type/sayang/sample";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { modelsMatchRType, modelsType } from "@/data/type/sayang/models";
import { changeSayangTemp, changeTempModel } from "@/data/type/sayang/changeData";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { sayangSampleWaitClmn, specIngClmn } from "@/data/columns/Sayang";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { LabelIcon, LabelMedium } from "@/components/Text/Label";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";

import useToast from "@/utils/useToast";
import cookie from "cookiejs";
import { port } from "@/pages/_app";

const SayangSampleListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id, text } = router.query;
  const { showToast, ToastContainer } = useToast();

  // ------------ 대기중 리스트 데이터 세팅 ------------ 시작
  const [waitDataLoading, setWaitDataLoading] = useState<boolean>(true);
  const [waitData, setWaitData] = useState<modelsMatchRType[]>([]);
  const { data:queryData, isLoading:waitLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['models-match/jsxcrud/many/by-glb-status/spec-status/spec_reg_waiting'],
    queryFn: async () => {
      setWaitDataLoading(true);
      setWaitData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'models-match/jsxcrud/many/by-glb-status/spec-status/spec_reg_waiting'
      });

      setWaitDataLoading(false);
      return result;
    },
  });
  useEffect(()=>{
    if(!waitLoading && queryData?.resultCode === 'OK_0000') {
      let arr:modelsMatchRType[] = [];
      (queryData?.data?.data ?? []).map((d:modelsMatchRType) => {
        const tempModel = JSON.parse(d.orderModel?.tempPrdInfo);
        arr.push({
          ...d,
          tempModel : changeTempModel(d, tempModel),
        })
      });
      setWaitData(arr);
    }
  }, [queryData]);
  // ------------ 대기중 리스트 데이터 세팅 ------------ 끝

  // ------------ 등록중 리스트 데이터 세팅 ------------ 시작
  const [ingDataLoading, setIngDataLoading] = useState<boolean>(true);
  const [ingData, setIngData] = useState<specType[]>([]);
  const { data:queryIngData, isLoading:ingLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/many/by-model-status/spec-registering-only'],
    queryFn: async () => {
      setIngDataLoading(true);
      setIngData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'spec/jsxcrud/many/by-model-status/spec-registering-only'
      },{
        sort: "createdAt,ASC"
      });
      setIngDataLoading(false);
      return result;
    },
  });
  useEffect(()=>{
    if(!ingLoading && queryIngData?.resultCode === 'OK_0000') {
      const arr = (queryIngData?.data?.data ?? []).map((data:specType, idx:number) => ({ 
        ...data,
      }))
      setIngData(arr);
    }
  }, [queryIngData]);
  // ------------ 등록중 리스트 데이터 세팅 ------------ 끝

  // ------------ 거래처 드로워 데이터 세팅 ------------ 시작
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);
  // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!drawerOpen) {
      setPartnerData(null);
      setPartnerMngData(null);
    }
  }, [drawerOpen]);
  // ------------ 거래처 드로워 데이터 세팅 ------------ 끝
  
  // ---------- 등록 클릭 시 팝업 데이터 세팅 ----------- 시작
  const [sayangRegOpen, setSayangRegOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<{
    matchId?:string,
    modelId?:string,
    statusId?: string,
    specId?:string,
    text?:string
  }>();

  useEffect(()=>{
    if(id) {
      setSelectedValue({...selectedValue, specId: id+"", text: text+"과(와) 조합하여 등록"});
    }
  }, [id]);

  const [record, setRecord] = useState<modelsMatchRType>();
    // 리스트 내 사양 등록 클릭 시 팝업 발생
  function sayangPopOpen(matchId:string, modelId:string, statusId:string, record:modelsMatchRType) {
    setRecord(record);

    if(port === '90' || cookie.get('companySY') === 'sy') {
      setSelectedValue({...selectedValue, matchId:matchId, modelId:modelId, statusId:statusId});
      handleSumbitTemp();
      return;
    }

    // 조합일 경우
    if(id) {
      const sd = ingData.find(f=>f.id === id);
      // 모델의 층이 다르면 선택할 수 없게 변경
      if(sd?.specModels?.[0]?.layerEm !== record.tempModel?.layerEm) {
        setSelectedValue({matchId:matchId, modelId:modelId, statusId:statusId, specId: "", text: ""});
      } else {
        setSelectedValue({matchId:matchId, modelId:modelId, statusId:statusId, specId: id+"", text: text+"과(와) 조합하여 등록"});
      }
      setSayangRegOpen(true);
      return;
    }
    
    if(ingData.filter(f=>f.specModels?.[0]?.layerEm === record?.tempModel?.layerEm).length > 0) {
      setSelectedValue({...selectedValue, matchId:matchId, modelId:modelId, statusId:statusId});
      setSayangRegOpen(true);
    } else {
      setSelectedValue({...selectedValue, matchId: matchId});
      setSayangRegOpen(true);
    }
  }

    // 조합하지 않고 신규 등록일 때는 무조건 임시저장 (사양 아이디가 필요하기 때문)
  const handleSumbitTemp = async () => {
    try {
      const matchData = waitData.find(d=> d.id === selectedValue?.matchId);
      if(matchData && matchData?.model) {
        const jsonData = changeSayangTemp("new", matchData);
  
        const result = await postAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'spec/default/temporary-save',
          jsx: 'default',
          etc: true,
        }, jsonData);
  
        if(result.resultCode === 'OK_0000') {
          const specId:any = result.data;
          router.push(`/sayang/sample/detail/${specId?.specId}`);
        } else {
          const msg = result?.response?.data?.message;
          setMsg(msg);
          setResultType("error");
          setOpen(true);
        }
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }

  // 조합 임시저장
  const handleSumbitTempRe = async () => {
    try {
      const specData = ingData.find(d=> d.id === selectedValue?.specId);
      const matchModel = waitData.find(d => d.id === selectedValue?.matchId)?.tempModel as modelsType;
      if(specData) {
        const jsonData = changeSayangTemp("re", {
          ...specData,
          specModels: [
            {
              ...matchModel,
              id: undefined,
              unit: { id: matchModel?.unit?.id },
              board: { id: matchModel?.board?.id },
              matchId: selectedValue?.matchId,
              glbStatus: { id: selectedValue?.statusId },
            } as specModelType,
            ...specData?.specModels ?? [],
          ]
        });

        const result = await postAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'spec/default/temporary-save',
          jsx: 'default',
          etc: true,
        }, jsonData);

        if(result.resultCode === 'OK_0000') {
          const specId:any = result.data;
          router.push(`/sayang/sample/detail/${specId?.specId}`);
        } else {
          const msg = result?.response?.data?.message;
          setMsg(msg);
          setResultType("error");
          setOpen(true);
        }
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }

    // 여러 개 모델로 새로 임시저장하는 함수
  const handleSumbitTempArr = async () => {
    try {
      if(checkeds.length > 0) {
        const records = checkeds.map(item => item.record);
        const jsonData = changeSayangTemp("new", checkeds[0].record, true, records);
  
        const result = await postAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'spec/default/temporary-save',
          jsx: 'default',
          etc: true,
        }, jsonData);
  
        if(result.resultCode === 'OK_0000') {
          const specId:any = result.data;
          router.push(`/sayang/sample/detail/${specId?.specId}`);
        } else {
          const msg = result?.response?.data?.message;
          setMsg(msg);
          setResultType("error");
          setOpen(true);
        }
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }
  // ---------- 등록 클릭 시 팝업 데이터 세팅 ----------- 끝

  const [checkeds, setCheckeds] = useState<{
    matchId: string,
    modelId: string,
    statusId: string,
    layerEm?: LayerEm,
    record: modelsMatchRType,
  }[]>([]);

  const handleCheckedAllClick = () => {
    if(checkeds.length === waitData.length) {
      setCheckeds([]);
    } else {
      setCheckeds(waitData.map((record) => ({
        matchId: record.id,
        modelId: record?.model?.id ?? "",
        statusId: record.glbStatus?.id ?? "",
        layerEm: record.tempModel?.layerEm,
        record: record
      })))
    }
  }

  const handleCheckedClick = () => {
    // 1. 체크된 것이 있는지 확인
    if(checkeds.length < 1) {
      showToast("선택된 사양이 없습니다.", "error");
      return;
    }

    // 2. 층이 같은지 확인
    let flag = false;
    let no = "";
    checkeds.map((chk) => {
      if(chk.layerEm !== checkeds[0].layerEm) {
        flag = true;
        return;
      } else {
        no += chk.record.model?.prdMngNo+", ";
      }
    });

    // 2-1. 층이 다르다면 에러 메시지
    if(flag) {
      setResultType("chkLayerErr");
      setOpen(true);
      return;
    }

    // 3. 선택한 조합들 확인
    setMsg(no.slice(0, -2));
    setResultType("cf");
    setOpen(true);
  }

  const [open, setOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"chkLayerErr" | "error" | "cf" | "">("");
  const [msg, setMsg] = useState<string>("");

  if (ingDataLoading || waitDataLoading) {
    return <div className="w-full h-[90vh] v-h-center">
      <Spin tip="Loading..."/>
    </div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div>
        <div className="v-between-h-center h-50 w-full">
          <div><LabelMedium label="사양 등록중" /></div>
          <p className="h-center">총 {ingData.length}건</p>
        </div>
        <List>
          <AntdTableEdit
            columns={
            port === '90' || cookie.get('companySY') === 'sy' ?
            specIngClmn(
              ingData.length,
              setPartnerData,
              setPartnerMngData,
              router
            ).filter(f=>f.key !== 'check' && !f.key?.toString().includes("layerEm"))
            :
            specIngClmn(
              ingData.length,
              setPartnerData,
              setPartnerMngData,
              router
            )}
            data={ingData}
            styles={{th_bg:'#E9EDF5',td_bg:'#FFFFFF',round:'14px',line:'n'}}
            loading={ingDataLoading}
          />
        </List>
      </div>
      
      <div>
        <div className="v-between-h-center h-50 w-full">
          <div><LabelMedium label="사양 등록 대기" /></div>
          <div className="h-center gap-10">
            <p className="h-center">총 {waitData.length}건</p>
          </div>
        </div>
        <List>
          <AntdTableEdit
            columns={
            port === '90' || cookie.get('companySY') === 'sy' ?
            sayangSampleWaitClmn(
              waitData.length,
              setPartnerData,
              setPartnerMngData,
              checkeds,
              setCheckeds,
              handleCheckedAllClick,
              handleCheckedClick,
              sayangPopOpen,
            ).filter(f=>f.key !== 'check' && !f.key?.toString().includes("layerEm"))
            :
            sayangSampleWaitClmn(
              waitData.length,
              setPartnerData,
              setPartnerMngData,
              checkeds,
              setCheckeds,
              handleCheckedAllClick,
              handleCheckedClick,
              sayangPopOpen,
            )}
            data={waitData}
            styles={{th_bg:'#E9EDF5',td_bg:'#FFFFFF',round:'14px',line:'n'}}
            loading={waitDataLoading}
          />
        </List>
      </div>
      
      <AntdModal width={584} open={sayangRegOpen} setOpen={setSayangRegOpen} title={'사양등록'}
        draggable={true}
        contents={
          <div className="p-30 gap-20 rounded-14 bg-white border-1 border-line flex flex-col h-center">
            <CustomRadioGroup
              size="large" className="flex gap-20"
              value={selectedValue?.specId}
            >
              {
                ingData
                .map((data:specType, index:number)=> (
                  <Radio.Button className="!rounded-20 [border-inline-start-width:1px] !w-fit"
                    key={data.id}
                    value={data.id}
                    onClick={()=>{
                      if(data.specModels?.[0]?.layerEm !== record?.tempModel?.layerEm) {
                        showToast("같은 층의 모델만 조합하실 수 있습니다.", "error");
                      } else {
                        if(selectedValue?.specId !== data.id)
                          setSelectedValue({
                            ...selectedValue,
                            specId: data.id,
                            text: data.specNo ?? (ingData.length - index)?.toString(),
                          });
                        // 재선택 시 취소
                        else  setSelectedValue({matchId:selectedValue?.matchId})
                      }
                    }}
                    disabled={data.specModels?.[0]?.layerEm !== record?.tempModel?.layerEm}
                  >
                    {data.specNo ?? (ingData.length - index)?.toString()}
                  </Radio.Button>
                ))
              }
            </CustomRadioGroup>
            <LabelIcon label="등록 중인 사양의 관리No를 선택하여 조합으로 등록할 수 있습니다." icon={<Info/>}/>
            {
              id && selectedValue?.text === "" &&
              <LabelIcon label={
                "조합하려는 모델과 층이 다른 모델은 조합할 수 없습니다.\n"+
                ingData.find(f=>f.id === id)?.specNo+" : "+ingData.find(f=>f.id === id)?.specModels?.[0]?.layerEm?.replace("L","")+"층 / "+
                "현재 선택 모델 : "+record?.tempModel?.layerEm.replace("L","")+"층"
              }
              icon={<Info/>} className="!text-[red]"
              />
            }
            <div className="flex gap-10 h-center">
              <Button icon={<Close/>} onClick={()=>{setSayangRegOpen(false)}}>취소</Button>
              <FullOkButtonSmall label={selectedValue?.text ? selectedValue.text+"과(와) 조합하여 사양 등록" : "신규 등록"}
                click={()=>{
                  if(selectedValue?.specId){
                    handleSumbitTempRe();
                  } else {
                    handleSumbitTemp()
                  }
                }}
              />
            </div>
          </div>
        }
      />

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
      />

      <AntdAlertModal
        open={open}
        setOpen={setOpen}
        title={
          resultType === "chkLayerErr" ? "층이 다른 모델이 존재합니다." :
          resultType === "error" ? "오류 발생" :
          resultType === "cf" ? "아래의 조합으로 등록하시겠습니까?" :
          ""
        }
        contents={
          resultType === "chkLayerErr" ? <div>같은 층의 모델만 조합 가능합니다.<br/>선택한 층을 확인해주세요.</div> :
          resultType === "error" ? <div>{msg}</div> :
          resultType === "cf" ? <div className="h-center gap-10">
            {(msg.split(",") ?? [])?.map((item, index) => (
              <div key={index} className="rounded-20 border-1 border-line w-fit p-10">{item}</div>
            ))}
            </div> :
          <></>
        }
        hideCancel={resultType === "cf"}
        type={
          resultType === "chkLayerErr" ? "warning" :
          resultType === "error" ? "error" :
          "success"
        }
        onOk={()=>{
          setOpen(false);
          if(resultType === "cf") {
            handleSumbitTempArr();
          }
        }}
        okText={
          resultType === "chkLayerErr" ? "확인" :
          resultType === "cf" ? "네 이대로 조합할게요" :
          "확인"
        }
        cancelText={
          resultType === "cf" ? "아니요 변경할래요" :
          ""
        }
      />
      
      <ToastContainer />
    </div>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap; /* 자동 줄 바꿈 */
  gap: 10px; /* 간격 유지 */
  justify-content: center; /* 중앙 정렬 */

  .ant-radio-button-wrapper {
    flex: 1 1 auto; /* 크기 자동 조절 */
    min-width: 100px; /* 최소 너비 설정 */
    text-align: center;
  }

  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

SayangSampleListPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="사양 등록 및 현황"
    menu={[
      {text:'사양 등록', link:'/sayang/sample/regist'},
      {text:'사양 등록 현황', link:'/sayang/sample/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangSampleListPage;