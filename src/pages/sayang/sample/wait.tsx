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
import { specType } from "@/data/type/sayang/sample";
import { useModels } from "@/data/context/ModelContext";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { modelsMatchRType } from "@/data/type/sayang/models";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { sayangSampleWaitClmn, specIngClmn } from "@/data/columns/Sayang";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { LabelIcon, LabelMedium } from "@/components/Text/Label";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";

import useToast from "@/utils/useToast";

const SayangSampleListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id, text } = router.query;
  const { showToast, ToastContainer } = useToast();
  const { models, modelsLoading } = useModels();

  // ------------ 대기중 리스트 데이터 세팅 ------------ 시작
  const [paginationWait, setPaginationWait] = useState({
    current: 1,
    size: 10,
  });
  const handlePageWaitChange = (page: number, size: number) => {
    setPaginationWait({ current: page, size: size });
  };
  const [waitDataLoading, setWaitDataLoading] = useState<boolean>(true);
  const [waitTotalData, setWaitTotalData] = useState<number>(0);
  const [waitData, setWaitData] = useState<modelsMatchRType[]>([]);
  const { data:queryData, isLoading:waitLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['models-match/jsxcrud/many/by-glb-status/spec-status/spec_reg_waiting', paginationWait],
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
    if(!waitLoading && !modelsLoading && queryData?.resultCode === 'OK_0000') {
      const arr = (queryData?.data.data ?? []).map((d:modelsMatchRType) => ({
        ...d,
        model: models.find(f=>f.id === d.model?.id),
      }));
      setWaitData(arr);
      // setWaitTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData, models]);
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
    if(!ingLoading && !modelsLoading && queryIngData?.resultCode === 'OK_0000') {
      const arr = (queryIngData.data.data ?? []).map((data:specType, idx:number) => ({ 
        ...data,
        // index: (Number(queryIngData?.data.total) ?? (queryIngData.data.data ?? 0).length) - idx,
      }))
      setIngData(arr);
    }
  }, [queryIngData, models]);
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

    // 조합일 경우
    if(id) {
      const sd = ingData.find(f=>f.id === id);
      // 모델의 층이 다르면 선택할 수 없게 변경
      if(sd?.specModels?.[0]?.layerEm !== record.model?.layerEm) {
        setSelectedValue({matchId:matchId, modelId:modelId, statusId:statusId, specId: "", text: ""});
      } else {
        setSelectedValue({matchId:matchId, modelId:modelId, statusId:statusId, specId: id+"", text: text+"과(와) 조합하여 등록"});
      }
      setSayangRegOpen(true);
      return;
    }
    
    if(ingData.filter(f=>f.specModels?.[0]?.layerEm === record?.model?.layerEm).length > 0) {
      setSelectedValue({...selectedValue, matchId:matchId, modelId:modelId, statusId:statusId});
      setSayangRegOpen(true);
    } else {
      setSelectedValue({...selectedValue, matchId: matchId});
      handleSumbitTemp();
    }
  }

    // 조합하지 않고 신규 등록일 때는 무조건 임시저장 (사양 아이디가 필요하기 때문)
  const handleSumbitTemp = async () => {
    try {
      const matchData = waitData.find(d=> d.id === selectedValue?.matchId);
      if(matchData) {
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
          router.push(`/sayang/sample/wait/${specId?.specId}`);
        } else {
          const msg = result?.response?.data?.message;
          showToast(msg, "error");
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
          router.push(`/sayang/sample/wait/${specId?.specId}`);
        } else {
          const msg = result?.response?.data?.message;
          showToast(msg, "error");
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

  useEffect(()=>{
    console.log(checkeds);
  }, [checkeds]);

  const handleCheckedAllClick = () => {
    if(checkeds.length === waitData.length) {
      setCheckeds([]);
    } else {
      setCheckeds(waitData.map((record) => ({
        matchId: record.id,
        modelId: record?.model?.id ?? "",
        statusId: record.glbStatus?.id ?? "",
        layerEm: record.model?.layerEm,
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
  const [resultType, setResultType] = useState<"chkLayerErr" | "cf" | "">("");
  const [msg, setMsg] = useState<string>("");

  if (modelsLoading || ingDataLoading || waitDataLoading) {
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
            columns={specIngClmn(ingData.length, setPartnerData, setPartnerMngData, router)}
            data={ingData}
            styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={ingDataLoading}
          />
        </List>
      </div>
      <div className="w-full h-1 border-b-1 border-line"></div>
      <div>
        {/* <ListPagination
          pagination={paginationWait}
          totalData={waitTotalData}
          onChange={handlePageWaitChange}
          handleMenuClick={handlePageMenuClick}
          title="사양 등록 대기"
        /> */}
        <div className="v-between-h-center h-50 w-full">
          <div><LabelMedium label="사양 등록 대기" /></div>
          <div className="h-center gap-10">
            <p className="h-center">총 {waitData.length}건</p>
            <Tooltip title="체크한 사양들을 조합하여 등록할 수 있어요">
              <Button
                style={{border:"1px solid #4880FF", color:"#4880FF"}}
                onClick={handleCheckedClick}
              >
                사양 등록
              </Button>
            </Tooltip>
          </div>
        </div>
        <List>
          <AntdTableEdit
            columns={sayangSampleWaitClmn(waitData.length, setPartnerData, setPartnerMngData, checkeds, setCheckeds, handleCheckedAllClick, paginationWait, sayangPopOpen)}
            data={waitData}
            styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={waitDataLoading}
          />
        </List>
        {/* <ListPagination
          pagination={paginationWait}
          totalData={waitTotalData}
          onChange={handlePageWaitChange}
          handleMenuClick={handlePageMenuClick}
        /> */}
      </div>
      
      <AntdModal width={584} open={sayangRegOpen} setOpen={setSayangRegOpen} title={'사양등록'}
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
                      if(data.specModels?.[0]?.layerEm !== record?.model?.layerEm) {
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
                    disabled={data.specModels?.[0]?.layerEm !== record?.model?.layerEm}
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
                "현재 선택 모델 : "+record?.model?.layerEm.replace("L","")+"층"
              }
              icon={<Info/>} className="!text-[red]"
              />
            }
            <div className="flex gap-10 h-center">
              <Button icon={<Close/>} onClick={()=>{setSayangRegOpen(false)}}>취소</Button>
              <FullOkButtonSmall label={selectedValue?.text ? selectedValue.text+"과(와) 조합하여 사양 등록" : "신규 등록"}
                click={()=>{
                  if(selectedValue?.specId){
                    router.push({
                      pathname: `/sayang/sample/wait/${selectedValue.specId}`,
                      query: { 
                        match: selectedValue.matchId,
                        model: selectedValue.modelId,
                        status: selectedValue.statusId,
                      }
                    })
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
          resultType === "cf" ? "아래의 조합으로 등록하시겠습니까?" :
          ""
        }
        contents={
          resultType === "chkLayerErr" ? <div>같은 층의 모델만 조합 가능합니다.<br/>선택한 층을 확인해주세요.</div> :
          resultType === "cf" ? <div>{msg}</div> :
          <></>
        }
        hideCancel={
          resultType === "chkLayerErr" ? true :
          false
        }
        type={
          resultType === "chkLayerErr" ? "warning" :
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
          ""
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
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/wait'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangSampleListPage;