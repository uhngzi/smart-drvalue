import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { List } from "@/layouts/Body/List";

import { salesOrderRType } from "@/data/type/sales/order";
import { sayangModelWaitClmn } from "@/data/columns/Sayang";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import useToast from "@/utils/useToast";
import { FinalGlbStatus } from "@/data/type/enum";
import { LabelMedium } from "@/components/Text/Label";

const SayangModelWaitPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataWait, setDataWait] = useState<salesOrderRType[]>([]);
  const [dataIng, setDataIng] = useState<salesOrderRType[]>([]);
  const { data:queryData, isLoading } = useQuery({
    queryKey: ['sales-order/jsxcrud/many/by-model-status/registering-or-waiting-only'],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'sales-order/jsxcrud/many/by-model-status/registering-or-waiting-only'
        });
      } catch (e) {
        return;
      }
    }
  });
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const arr = (queryData?.data?.data ?? []).map((item:salesOrderRType) => ({
        ...item,
        modelCnt: item.products?.length,
      }))
      setDataIng(arr.filter((f:salesOrderRType)=>f.finalGlbStatus === FinalGlbStatus.REGISTERING))
      setDataWait(arr.filter((f:salesOrderRType)=>f.finalGlbStatus === FinalGlbStatus.WAITING));
      setDataLoading(false);
    }
  }, [queryData]);
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
  }, [drawerOpen]);
  
  return (
    <div className="flex flex-col gap-20">
      <div>
        <div className="flex w-full h-50 v-between-h-center">
          <LabelMedium label={"모델 등록중"}/>
          <span>총 {dataIng.length}건</span>
        </div>
        <List>
          <AntdTableEdit
            columns={sayangModelWaitClmn(dataIng.length, router, setPartnerData, setPartnerMngData)}
            data={dataIng}
            styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
            loading={dataLoading}
          />
        </List>
      </div>

      <div>
        <div className="flex w-full h-50 v-between-h-center">
          <LabelMedium label={"모델 등록 대기"}/>
          <span>총 {dataWait.length}건</span>
        </div>
        <List>
          <AntdTableEdit
            columns={sayangModelWaitClmn(dataWait.length, router, setPartnerData, setPartnerMngData)}
            data={dataWait}
            styles={{ th_bg: '#F2F2F2', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
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
  );
};

SayangModelWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 확정 및 현황"
    menu={[
      {text:'모델 확정', link:'/sayang/model/confirm'},
      {text:'모델 현황', link:'/sayang/model/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelWaitPage;