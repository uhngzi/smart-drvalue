import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { ListPagination } from "@/layouts/Body/Pagination";
import { List } from "@/layouts/Body/List";

import Close from "@/assets/svg/icons/s_close.svg";

import { sayangModelStatusClmn } from "@/data/columns/Sayang";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { modelsMatchRType } from "@/data/type/sayang/models";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import CardList from "@/components/List/CardList";
import ModelDrawerContent from "@/contents/sayang/model/add/ModelDrawerContent";
import { TabSmall } from "@/components/Tab/Tabs";
import { ModelTypeEm } from "@/data/type/enum";
import { InboxOutlined } from "@ant-design/icons";

const SayangModelStatPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  const [data, setData] = useState<modelsMatchRType[]>([]);
  const { data:queryData, isLoading } = useQuery({
    queryKey: ['sales-order/jsxcrud/many', pagination],
    queryFn: async () => {
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models-match/jsxcrud/many'
        },{
          limit: pagination.size,
          page: pagination.current,
        });
      } catch (e) {
        return;
      }
    }
  });
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      setData(queryData?.data.data ?? []);
      setTotalData(queryData?.data.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);

  useEffect(()=>{console.log(data)},[data]);
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
  
  const [ modelDetail, setModelDetail ] = useState<modelsMatchRType | null>(null);
  const [ selectTabDrawer, setSelectTabDrawer ] = useState<1 | 2>(1);
  const [ modelItem, setModelItem ] = useState<any[]>([]);
  const [ modelOpen, setModelOpen ] = useState<boolean>(false);
  useEffect(()=>{
    if(modelDetail) {
      setModelOpen(true);
      const model = JSON.parse(modelDetail.orderModel?.tempPrdInfo);
       
      if(Object.keys(model).length > 0) {
        setModelItem([
          { label: '모델명', value: model?.prdNm ?? '-', widthType: 'half' },
          { label: '관리No', value: model?.prdMngNo ?? '-', widthType: 'half' },
          { label: '제조사', value: model?.mnfNm ?? '-', widthType: 'half' },
          { label: 'REV', value: model?.prdRevNo ?? '-', widthType: 'half' },
          { label: '구분', value: model?.modelTypeEm === ModelTypeEm.SAMPLE ? "샘플" : model?.modelTypeEm === ModelTypeEm.PRODUCTION ? "양산" : '-', widthType: 'half' },
          // { label: '원판', value: model?.board?.cdNm ?? '-', widthType: 'half' },
          { label: '층', value: model?.layerEm?.replace("L","") ?? '-', widthType: 'half' },
          { label: '두께', value: model?.thk ?? '-', widthType: 'half' },
          { label: '단위', value: model?.unit?.cdNm ?? '-', widthType: 'half' },
          { label: '재질', value: model?.material?.cdNm ?? '-', widthType: 'half' },
          { label: '외형가공형태', value: model?.aprType?.cdNm ?? '-', widthType: 'half' },
          { label: '동박내층', value: model?.copIn ?? '-', widthType: 'half' },
          { label: '동박외층', value: model?.copOut ?? '-', widthType: 'half' },
          { label: 'S/M 인쇄', value: model?.smPrint?.cdNm ?? '-', widthType: 'half' },
          { label: 'M/K 인쇄', value: model?.mkPrint?.cdNm ?? '-', widthType: 'half' },
          { label: 'S/M 색상', value: model?.smColor?.cdNm ?? '-', widthType: 'half' },
          { label: 'M/K 색상', value: model?.mkColor?.cdNm ?? '-', widthType: 'half' },
          { label: 'S/M 종류', value: model?.smType?.cdNm ?? '-', widthType: 'half' },
          { label: 'M/K 종류', value: model?.mkType?.cdNm ?? '-', widthType: 'half' },
          { label: '특수인쇄', value: model?.spPrint?.cdNm ?? '-', widthType: 'half' },
          { label: '특수인쇄종류', value: model?.spType?.cdNm ?? '-', widthType: 'half' },
          { label: '도금 두께', value: model?.pltThk ?? '-', widthType: 'half' },
          { label: '도금 두께 여유', value: model?.pltAlph ?? '-', widthType: 'half' },
          { label: '특별도금(Au)', value: model?.spPltAu ?? '-', widthType: 'half' },
          { label: '특별도금여유(Au)', value: model?.spPltAuAlph ?? '-', widthType: 'half' },
          { label: '특별도금(Ni)', value: model?.spPltNi ?? '-', widthType: 'half' },
          { label: '특별도금여유(Ni)', value: model?.spPltNiAlph ?? '-', widthType: 'half' },
          // { label: '도면번호', value: model?.drgNo ?? '-', widthType: 'half' },
          { label: '핀 수', value: model?.pinCnt ?? '-', widthType: 'half' },
          { label: 'KIT X/Y', value: model?.kitW && model?.kitL ? model?.kitW+"/"+model?.kitL: '-', widthType: 'half' },
          { label: 'PCS X/Y', value: model?.pcsW && model?.pcsL ? model?.pcsW+"/"+model?.pcsL : '-', widthType: 'half' },
          { label: 'PNL X/Y', value: model?.pnlW && model?.pnlL ? model?.pnlW+"/"+model?.pnlL : '-', widthType: 'half' },
          { label: 'kitPcs', value: model?.kitPcs ?? '-', widthType: 'half' },
          { label: 'pnlKit', value: model?.pnlKit ?? '-', widthType: 'half' },
          { label: 'sthPcs', value: model?.sthPcs ?? '-', widthType: 'half' },
          { label: 'sthPnl', value: model?.sthPnl ?? '-', widthType: 'half' },
          // { label: '브이컷유무', value: model?.vcutYn ?? '-', widthType: 'half' },
          { label: '브이컷형태', value: model?.vcutType?.cdNm ?? '-', widthType: 'half' },
          { label: '연조KIT', value: model?.ykitW && model?.ykitL ? model?.ykitW+' '+model?.ykitL : '-', widthType: 'half' },
          { label: '연조PNL', value: model?.ypnlW && model?.ypnlL ? model?.ypnlW+"/"+model?.ypnlL : '-', widthType: 'half' },
        ]);
      } else {
        setModelItem([]);
      }
    }
  }, [modelDetail])
  
  return (
    <>
      <ListPagination 
        totalData={totalData} 
        pagination={pagination}
        onChange={handlePageChange}
      />
      <List>
        <AntdTableEdit
          columns={sayangModelStatusClmn(totalData, pagination, setPartnerData, setPartnerMngData, setModelDetail)}
          data={data}
          styles={{ th_bg: '#FAFAFA', td_bg: '#FFFFFF', round: '0px', line: 'n' }}
          loading={dataLoading}
        />
      </List>

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
      />

      <AntdDrawer
        open={modelOpen}
        close={()=>{
          setModelOpen(false);
          setModelDetail(null);
        }}
        width={600}
        maskClosable={false}
        mask={false}
      >
      <div className="flex flex-col gap-15 p-20 !pr-5">
        <div className="v-between-h-center">
          <TabSmall
            items={[
              {key:1,text:'고객 발주 정보'},
              {key:2,text:'모델 정보'},
            ]}
            selectKey={selectTabDrawer}
            setSelectKey={setSelectTabDrawer}
          />
          <div className="flex justify-end cursor-pointer" onClick={() => setModelOpen(false)}><Close/></div>
        </div>
        { selectTabDrawer === 1 &&
          <ModelDrawerContent orderId={modelDetail?.orderModel?.order.id} />
        }
        {
          selectTabDrawer === 2 &&
          ( modelItem.length > 0 ?
            <CardList title="모델 정보" items={modelItem} />
            :
            <div className="w-full h-[300px] v-h-center flex-col p-20">
              <InboxOutlined style={{ fontSize: 50, color: "#aaa" }} />
              폐기되었거나 등록 전인 모델입니다.
            </div>
          )
        }
      </div>
      </AntdDrawer>
    </>
  );
};

SayangModelStatPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/wait'},
      {text:'모델 등록 현황', link:'/sayang/model/status'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelStatPage;