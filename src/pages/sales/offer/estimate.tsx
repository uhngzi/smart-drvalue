import PopupCancleButton from "@/components/Button/PopupCancleButton";
import PopupOkButton from "@/components/Button/PopupOkButton";
import FullChip from "@/components/Chip/FullChip";
import Description from "@/components/Description/Description";
import DescriptionItems from "@/components/Description/DescriptionItems";
import AntdInput from "@/components/Input/AntdInput";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdTable from "@/components/List/AntdTable";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import Edit from "@/assets/svg/icons/edit.svg"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";

import dynamic from "next/dynamic";
import { Button, Checkbox, List, TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import AntdDragger from "@/components/Upload/AntdDragger";
import YieldCalculate from "@/contents/base/yield/YieldCalculate";
import { useRouter } from "next/router";
import { useMenu } from "@/data/context/MenuContext";
import useToast from "@/utils/useToast";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { salesEstimateType } from "@/data/type/sales/order";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import { ListPagination } from "@/layouts/Body/Pagination";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import cookie from "cookiejs";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import { salesEstimateClmn } from "@/data/columns/Sales";

const sampleCl = (setOpen: React.Dispatch<React.SetStateAction<boolean>>): TableProps['columns'] => [
  {
    title: <><Checkbox /></>,
    width: 50,
    dataIndex: 'checkbox',
    key: 'checkbox',
    align: 'center',
  },
  {
    title: '번호',
    width: 50,
    dataIndex: 'idx',
    key: 'idx',
    align: 'center',
  },
  {
    title: '관리 No',
    width: 130,
    dataIndex: 'no',
    align: 'center',
    key: 'no',
  },
  {
    title: '업체명/코드',
    width: 180,
    dataIndex: 'no',
    align: 'center',
    key: 'cuName',
  },
  {
    title: '고객발주명',
    dataIndex: 'orderName',
    align: 'center',
    key: 'orderName',
  },
  {
    title: '업체담당',
    width: 80,
    dataIndex: 'mngName',
    align: 'center',
    key: 'mngName',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hotYn',
    align: 'center',
    key: 'hotYn',
    render: (value) => (
      <div className="v-h-center">{
        value==="super"?
        <FullChip label="초긴급" state="purple"/>:
        value==="hot"?
        <FullChip label="긴급" state="pink"/>:
        <FullChip label="일반" />
      }</div>
    )
  },
  {
    title: '구분',
    width: 80,
    dataIndex: 'state',
    align: 'center',
    key: 'state',
    render: (value) => (
      <div className="v-h-center">{
        value==="re"?
        <FullChip label="반복" state="mint"/>:
        value==="edit"?
        <FullChip label="수정" state="yellow"/>:
        <FullChip label="신규" />
      }</div>
    )
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'thic',
    align: 'center',
    key: 'thic',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'layer',
    align: 'center',
    key: 'layer',
  },
  {
    title: '영업담당',
    width: 80,
    dataIndex: 'saleMng',
    align: 'center',
    key: 'saleMng',
  },
  {
    title: '발주 접수일',
    width: 120,
    dataIndex: 'orderDt',
    align: 'center',
    key: 'otderDt',
  },
  {
    title: '발주일',
    width: 120,
    dataIndex: 'submitDt',
    align: 'center',
    key: 'submitDt',
  },
  {
    title: '모델 등록',
    width: 100,
    dataIndex: 'model',
    align: 'center',
    key: 'model',
    render: (value) => (
      <div className="v-h-center">{
        value===3?
        <FullChip label="완료"/>:
        value===2?
        <FullChip label="등록중" state="mint" click={()=>setOpen(true)}/>:
        <FullChip label="대기" state="yellow"/>
      }</div>
    )
  },
]
const sampleDt = [
  {
    checkbox:<Checkbox />,
    key:4,
    idx:4,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hotYn:'super',
    state:'re',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:'등록',
  },
  {
    checkbox:<Checkbox />,
    key:3,
    idx:3,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'SWEDF 모델 재생산 100PCS',
    mngName:'홍길동',
    hotYn:'hot',
    state:'edit',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:3,
  },
  {
    checkbox:<Checkbox />,
    key:2,
    idx:2,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hotYn:'N',
    state:'new',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:2,
  },
  {
    checkbox:<Checkbox />,
    key:1,
    idx:1,
    no:'900-0894',
    cuName:'GPN/900',
    orderName:'GPNERPTEST001-00005001V1.5, LALC0100A-0.0',
    mngName:'홍길동',
    hotYn:'N',
    state:'new',
    thic:0.1,
    layer:1,
    saleMng:'홍길동',
    orderDt:'2024-12-01',
    submitDt:'2024-12-01',
    model:1,
  },
]

const SalesUserEstimatePage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { selectMenu } = useMenu();
  const { showToast, ToastContainer } = useToast();

  // ------------- 페이지네이션 세팅 ------------ 시작
  const [searchs, setSearchs] = useState<string>("");
  const [sQueryJson, setSQueryJson] = useState<string>("");
  useEffect(()=>{
    if(searchs.length < 2)  setSQueryJson("");
  }, [searchs])
  const handleSearchs = () => {
    if(searchs.length < 2) {
      showToast("2글자 이상 입력해주세요.", "error");
      return;
    }
    // url를 통해 현재 메뉴를 가져옴
    const jsx = selectMenu?.children?.find(f=>router.pathname.includes(f.menuUrl ?? ""))?.menuSearchJsxcrud;
    if(jsx) {
      setSQueryJson(jsx.replaceAll("##REPLACE_TEXT##", searchs));
    } else {
      setSQueryJson("");
    }
  }

  const handlePageMenuClick = async (key:number)=>{
    const clmn = salesEstimateClmn(
      totalData,
      setPartnerData,
      setPartnerMngData,
      pagination,
      router
    ).map((item, index) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
    }))

    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "견적", "excel", showToast, "sales-estimate", "core-d1");
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "견적", "print", showToast);
    }
  }
  // ------------- 페이지네이션 세팅 ------------ 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [ data, setData ] = useState<Array<salesEstimateType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['sales-estimate/jsxcrud/many', pagination, sQueryJson],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-estimate/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:salesEstimateType) => ({
        ...item,
        modelCnt: item.products?.length,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ---------------- 거래처  ---------------- 시작
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
  // ---------------- 거래처  ---------------- 끝


  return (
    <>
      <ListTitleBtn
        label="신규"
        onClick={()=>{
          router.push('/sales/order/new');
        }}
        icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
      />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs} setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <List>
        <AntdTableEdit
          columns={
          cookie.get('company') === 'sy' ?
          salesEstimateClmn(
            totalData,
            setPartnerData,
            setPartnerMngData,
            pagination,
            router,
          ).filter(f=>f.key !== 'orderRepDt')
          :
          salesEstimateClmn(
            totalData,
            setPartnerData,
            setPartnerMngData,
            pagination,
            router,
          )}
          data={data}
          styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs} setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ''}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
        prtSuccessFn={()=>{
          refetch();
          showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
        }}
      />
      
      <ToastContainer />
    </>
  )
};

SalesUserEstimatePage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/offer/order' },
      { text: '견적', link: '/sales/offer/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserEstimatePage;