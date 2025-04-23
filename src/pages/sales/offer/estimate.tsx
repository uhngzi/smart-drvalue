import FullChip from "@/components/Chip/FullChip";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import Edit from "@/assets/svg/icons/edit.svg"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";

import { Checkbox, List, TableProps } from "antd";
import { useEffect, useState } from "react";
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
import { salesEstimateClmn } from "@/data/columns/Sales";
import { port } from "@/pages/_app";

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
          router.push('/sales/offer/estimate/new');
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
          port === '90' || cookie.get('companySY') === 'sy' ?
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
          styles={{th_bg:'#E9EDF5',td_bg:'#FFFFFF',round:'14px',line:'n'}}
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