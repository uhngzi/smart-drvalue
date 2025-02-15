import styled from "styled-components";
import { Button, Radio, Spin } from "antd";
import { getAPI } from "@/api/get";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";
import ModelPageLayout from "@/layouts/Main/ModelPageLayout";

import Info from "@/assets/svg/icons/s_grayInfo.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import { useQuery } from "@tanstack/react-query";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { useModels } from "@/data/context/ModelContext";
import { modelsMatchRType } from "@/data/type/sayang/models";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { sayangSampleWaitClmn, specIngClmn } from "@/data/columns/Sayang";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { LabelIcon } from "@/components/Text/Label";
import { specType } from "@/data/type/sayang/sample";
import useToast from "@/utils/useToast";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { postAPI } from "@/api/post";

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
  const handlePageWaitChange = (page: number) => {
    setPaginationWait({ ...paginationWait, current: page });
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
      },{
        limit:paginationWait.size,
        page:paginationWait.current,
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
      setWaitTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData, models]);
  // ------------ 대기중 리스트 데이터 세팅 ------------ 끝

  // ------------ 등록중 리스트 데이터 세팅 ------------ 시작
  const [paginationIng, setPaginationIng] = useState({
    current: 1,
    size: 3,
  });
  const handlePageIngChange = (page: number) => {
    setPaginationIng({ ...paginationIng, current: page });
  };
  const [ingDataLoading, setIngDataLoading] = useState<boolean>(true);
  const [ingTotalData, setIngTotalData] = useState<number>(0);
  const [ingData, setIngData] = useState<specType[]>([]);
  const { data:queryIngData, isLoading:ingLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/many/by-model-status/spec-registering-only', paginationIng],
    queryFn: async () => {
      setIngDataLoading(true);
      setIngData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'spec/jsxcrud/many/by-model-status/spec-registering-only'
      },{
        limit:paginationIng.size,
        page:paginationIng.current,
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
        index: (Number(queryIngData?.data.total) ?? (queryIngData.data.data ?? 0).length) - idx,
      }))
      setIngData(arr);
      setIngTotalData(queryIngData?.data.total ?? 0);
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
    if(id)
      setSelectedValue({...selectedValue, specId: id+"", text: text+"과(와) 조합하여 등록"});
  }, [id]);

    // 리스트 내 사양 등록 클릭 시 팝업 발생
  function sayangPopOpen(matchId:string, modelId:string, statusId:string) {
    if(ingData.length > 0) {
      setSelectedValue({...selectedValue, matchId:matchId, modelId:modelId, statusId:statusId});
      setSayangRegOpen(true);
    } else {
      router.push(`/sayang/sample/wait/form/${matchId}`);
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
          console.log(result.data.data.specId);
          router.push(`/sayang/sample/wait/form/${result.data.data.specId}`);
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

  if (modelsLoading || ingDataLoading || waitDataLoading) {
    return <div className="w-full h-[90vh] v-h-center">
      <Spin tip="Loading..."/>
    </div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div>
        <ListPagination 
          pagination={paginationIng}
          totalData={ingTotalData}
          onChange={handlePageIngChange}
        />
        <List>
          <AntdTableEdit
            columns={specIngClmn(ingTotalData, setPartnerData, setPartnerMngData, paginationIng, router)}
            data={ingData}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={ingDataLoading}
          />
        </List>
      </div>
      <div className="w-full h-1 border-b-1 border-line"></div>
      <div>
        <ListPagination
          pagination={paginationWait}
          totalData={waitTotalData}
          onChange={handlePageWaitChange}
        />
        <List>
          <AntdTableEdit
            columns={sayangSampleWaitClmn(waitTotalData, setPartnerData, setPartnerMngData, paginationWait, sayangPopOpen)}
            data={waitData}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={waitDataLoading}
          />
        </List>
      </div>
      
      <AntdModal width={584} open={sayangRegOpen} setOpen={setSayangRegOpen} title={'사양등록'}
        contents={
          <div className="p-30 gap-20 rounded-14 bg-white border-1 border-line flex flex-col h-center">
            <CustomRadioGroup size="large" className="flex gap-20"
              value={selectedValue?.specId} onChange={(e)=>{console.log(e)}}>
              {
                ingData.map((data:specType, index:number)=> (
                  <Radio.Button className="!rounded-20 [border-inline-start-width:1px]"
                    key={data.id}
                    value={data.id}
                    onClick={()=>{
                      if(selectedValue?.specId !== data.id)
                        setSelectedValue({
                          ...selectedValue,
                          specId: data.id,
                          text: data.specNo ?? data.index?.toString()
                        });
                      // 재선택 시 취소
                      else  setSelectedValue({matchId:selectedValue?.matchId})
                    }}
                  >
                    {data.specNo ?? data?.index}
                  </Radio.Button>
                ))
              }
            </CustomRadioGroup>
            <LabelIcon label="등록 중인 사양의 관리No를 선택하여 조합으로 등록할 수 있습니다." icon={<Info/>}/>
            <div className="flex gap-10 h-center">
              <Button icon={<Close/>} onClick={()=>{setSayangRegOpen(false)}}>취소</Button>
              <FullOkButtonSmall label={selectedValue?.text ? selectedValue.text+"과(와) 조합하여 사양 등록" : "신규 등록"}
                click={()=>{
                  if(selectedValue?.specId){
                    router.push({
                      pathname: `/sayang/sample/wait/form/${selectedValue.specId}`,
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
      <ToastContainer />
    </div>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

SayangSampleListPage.layout = (page: React.ReactNode) => (
  <ModelPageLayout
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/wait'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/situation'},
    ]}
  >{page}</ModelPageLayout>
)

export default SayangSampleListPage;