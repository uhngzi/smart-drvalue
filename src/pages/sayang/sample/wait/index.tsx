import styled from "styled-components";
import { Button, Radio } from "antd";
import { getAPI } from "@/api/get";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";

import Info from "@/assets/svg/icons/s_grayInfo.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import { useQuery } from "@tanstack/react-query";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { useModels } from "@/data/context/ModelContext";
import { modelsMatchRType } from "@/data/type/sayang/models";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { sayangSampleWaitClmn, sayangSampleWaitClmn1 } from "@/data/columns/Sayang";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { LabelIcon } from "@/components/Text/Label";
import MainPageLayout from "@/layouts/Main/MainPageLayout";


const SayangSampleListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { models, modelsLoading } = useModels();
  
  const [data, setData] = useState([
    {
      id:4,
      index:4,
      no:'900-1234',
      cuNm:'GPN/900',
      modelNm: 'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
      rev:'0.0.0',
      hot:1,
      state:1,
      thic:1.6,
      layer:4,
      pcs:'58x29.36',
      napgi:'2024-11-07',
      order:'2024-11-07',
    },
    {
      id:3,
      index:3,
      no:'900-1234',
      cuNm:'GPN',
      cuCode:'900',
      modelNm: 'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
      rev:'0.0.0',
      hot:3,
      state:2,
      thic:1.6,
      layer:4,
      pcs:'58x29.36',
      napgi:'2024-11-07',
      order:'2024-11-07',
    },
    {
      id:2,
      index:2,
      no:'900-1234',
      cuNm:'GPN',
      cuCode:'900',
      modelNm: 'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
      rev:'0.0.0',
      hot:3,
      state:3,
      thic:1.6,
      layer:4,
      pcs:'58x29.36',
      napgi:'2024-11-07',
      order:'2024-11-07',
    },
    {
      id:1,
      index:1,
      no:'900-1234',
      cuNm:'GPN',
      cuCode:'900',
      modelNm: 'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
      rev:'0.0.0',
      hot:2,
      state:2,
      thic:1.6,
      layer:4,
      pcs:'58x29.36',
      napgi:'2024-11-07',
      order:'2024-11-07',
    },
  ]);
  const [sayangRegOpen, setSayangRegOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<String>("");

  function sayangPopOpen(value:String) {
    setSelectedValue(value)
    setSayangRegOpen(true);
  }

  // ------------ 리스트 데이터 세팅 ------------ 시작
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
        }))
        console.log(models, arr);
        setWaitData(arr);
        setWaitTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData, models]);

  const [paginationIng, setPaginationIng] = useState({
    current: 1,
    size: 3,
  });
  const handlePageIngChange = (page: number) => {
    setPaginationIng({ ...paginationIng, current: page });
  };
  const [ingDataLoading, setIngDataLoading] = useState<boolean>(true);
  const [ingTotalData, setIngTotalData] = useState<number>(0);
  const [ingData, setIngData] = useState<modelsMatchRType[]>([]);
  const { data:queryIngData, isLoading:ingLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['models-match/jsxcrud/many/by-glb-status/spec-status/spec_reg_completed', paginationIng],
    queryFn: async () => {
      setIngDataLoading(true);
      setIngData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'models-match/jsxcrud/many/by-glb-status/spec-status/spec_reg_completed'
      },{
        limit:paginationIng.size,
        page:paginationIng.current,
      });
      setIngDataLoading(false);
      return result;
    },
  });
  useEffect(()=>{
    if(!ingLoading && !modelsLoading && queryIngData?.resultCode === 'OK_0000') {
        const arr = (queryIngData?.data.data ?? []).map((d:modelsMatchRType) => ({
          ...d,
          model: models.find(f=>f.id === d.model?.id),
        }))
        setIngData(arr);
        setIngTotalData(queryIngData?.data.total ?? 0);
    }
  }, [queryIngData, models]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // 리스트 내 거래처
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);
  // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!drawerOpen) {
      setPartnerData(null);
      setPartnerMngData(null);
    }
    console.log(drawerOpen);
  }, [drawerOpen]);
  useEffect(()=>{console.log(partnerData, partnerMngData)}, [partnerData, partnerMngData])

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
            columns={sayangSampleWaitClmn(ingTotalData, sayangPopOpen, setPartnerData, setPartnerMngData, paginationIng)}
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
            columns={sayangSampleWaitClmn(waitTotalData, sayangPopOpen, setPartnerData, setPartnerMngData, paginationWait)}
            data={waitData}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={waitDataLoading}
          />
        </List>
      </div>
      {/* <div className="flex flex-col gap-40">
        <div className="flex flex-col gap-20">
          <TitleSmall title={`사양등록 중 ${data.length}건`} />
          <AntdTable
            columns={sayangSampleWaitClmn(router)}
            data={data}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          />
        </div>
        <div className="w-full h-1 border-b-1 border-line"></div>
        <div className="flex flex-col gap-20">
          <TitleSmall title={`사양등록 대기 ${data.length}건`} />
          <AntdTable
            columns={sayangSampleWaitClmn(router)}
            data={data}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          />
        </div>
      </div> */}
      <AntdModal width={584} open={sayangRegOpen} setOpen={setSayangRegOpen} title={'사양등록'}
        contents={
          <div className="p-30 gap-20 rounded-14 bg-white border-1 border-line flex flex-col h-center">
            <CustomRadioGroup size="large" className="flex gap-20">
              <Radio.Button value="a" className="!rounded-20 [border-inline-start-width:1px]">900-0894</Radio.Button>
              <Radio.Button value="b" className="!rounded-20 [border-inline-start-width:1px]">900-0893</Radio.Button>
              <Radio.Button value="c" className="!rounded-20 [border-inline-start-width:1px]">900-0892</Radio.Button>
              <Radio.Button value="d" className="!rounded-20 [border-inline-start-width:1px]">900-0891</Radio.Button>
            </CustomRadioGroup>
            <LabelIcon label="등록 중인 사양의 관리No를 선택하여 조합으로 등록할 수 있습니다." icon={<Info/>}/>
            <div className="flex gap-10 h-center">
              <Button icon={<Close/>} onClick={()=>{setSayangRegOpen(false)}}>취소</Button>
              <FullOkButtonSmall label="사양 등록" click={()=>{router.push(`/sayang/sample/wait/form/${selectedValue}`)}}/>
            </div>
          </div>}
        />
        {/* ()=>{router.push(`/sayang/sample/wait/form/${value}`)} */}

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
      />
    </div>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

SayangSampleListPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/wait'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangSampleListPage;