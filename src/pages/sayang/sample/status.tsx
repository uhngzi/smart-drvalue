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
import { sayangSampleWaitClmn, specIngClmn, specStatusClmn } from "@/data/columns/Sayang";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { LabelIcon } from "@/components/Text/Label";
import { specType } from "@/data/type/sayang/sample";
import useToast from "@/utils/useToast";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { postAPI } from "@/api/post";

const SayangSampleStatPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const { models, modelsLoading } = useModels();

  // --------------- 리스트 데이터 세팅 -------------- 시작
  const [pagination, setPagination] = useState({
    current: 1,
    size: 100,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [data, setData] = useState<specType[]>([]);
  const { data:queryData, isLoading } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/many', pagination],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'spec/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
      setDataLoading(false);
      return result;
    },
  });
  useEffect(()=>{
    if(!isLoading && !modelsLoading && queryData?.resultCode === 'OK_0000') {
      const arr = (queryData.data.data ?? []).map((data:specType, idx:number) => ({ 
        ...data,
      }))
      setData(arr);
      setTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData, models]);
  // --------------- 리스트 데이터 세팅 -------------- 끝

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

  if (modelsLoading || dataLoading) {
    return <div className="w-full h-[90vh] v-h-center">
      <Spin tip="Loading..."/>
    </div>;
  }

  return (
    <div className="flex flex-col gap-20">
      <div>
        <ListPagination 
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
        />
        <List>
          <AntdTableEdit
            columns={specStatusClmn(totalData, setPartnerData, setPartnerMngData, pagination, router)}
            data={data}
            styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={dataLoading}
          />
        </List>
      </div>

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

SayangSampleStatPage.layout = (page: React.ReactNode) => (
  <ModelPageLayout
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/wait'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/status'},
    ]}
  >{page}</ModelPageLayout>
)

export default SayangSampleStatPage;