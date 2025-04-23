import { getAPI } from "@/api/get";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { BuyCostOutStatusClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { buyCostOutDetailType, buyCostOutType } from "@/data/type/buy/cost";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Close from "@/assets/svg/icons/s_close.svg";
import CardList from "@/components/List/CardList";
import { useMenu } from "@/data/context/MenuContext";
import cookie from "cookiejs";
import { port } from "@/pages/_app";

const BuyCostStatusPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
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

  const handlePageMenuClick = (key:number)=>{
    const clmn = BuyCostOutStatusClmn(totalData, pagination, setSelect)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가현황", "excel", showToast, "worksheet/vender-price", "core-d2");
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가현황", "print", showToast);
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
  const [ data, setData ] = useState<Array<buyCostOutType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['worksheet/vender-price/jsxcrud/many', pagination, sQueryJson],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/vender-price/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
        anykeys: {applyAutoFilterType : "MATCH"},
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:buyCostOutType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝
  
  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<buyCostOutType | null>(null);

  const [ detailData, setDetailData ] = useState<buyCostOutDetailType | null>(null);
  const { data:queryDetailData } = useQuery({
    queryKey: ['worksheet/vender-price/jsxcrud/one', select],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `worksheet/vender-price/jsxcrud/one/${select?.id}`
      });

      if(result.resultCode === "OK_0000") {
        console.log(result?.data?.data);
        setDetailData(result?.data?.data);
        setOpen(true);
      }

      return result;
    },
    enabled: !!select?.id
  });

  // 값 초기화
  useEffect(()=>{
    if(!open) {
      setSelect(null);
      setDetailData(null);
    }
  }, [open])
  // ------------ 디테일 데이터 세팅 ------------ 끝

  return (
    <>
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
            BuyCostOutStatusClmn(totalData, pagination, setSelect).filter(f=>
              !f.key?.toString().includes("layerEm") && !f.key?.toString().includes("sm") && !f.key?.toString().includes("mk")
              && !f.key?.toString().includes("pnlL") && !f.key?.toString().includes("pnlW") && !f.key?.toString().includes("kit")
              && !f.key?.toString().includes("Kit") && !f.key?.toString().includes("prdMngNo") && !f.key?.toString().includes("wkOutCnt")
              && !f.key?.toString().includes("board") && !f.key?.toString().includes("prdCnt") && !f.key?.toString().includes("sth")
              && !f.key?.toString().includes("rein") && !f.key?.toString().includes("m2")
            )
            :
            BuyCostOutStatusClmn(totalData, pagination, setSelect)
          }
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

      <AntdDrawer
        open={open}
        close={()=>{
          setOpen(false);
          setSelect(null);
        }}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div className="v-between-h-center">
            <p className="text-16 font-medium">외주처 단가 정보</p>
            <div className="flex justify-end cursor-pointer" onClick={() => {setOpen(false); setSelect(null)}}><Close/></div>
          </div>

          { detailData?.procs?.map((proc, index) => ( <div key={index}>
            <CardList
              items={[
                {label: '공정그룹명', value: proc.specPrdGrp?.process?.processGroup?.prcGrpNm, widthType: ''},
                {label: '공정명', value: proc.specPrdGrp?.process?.prcNm, widthType: 'half'},
                {label: '외주처명', value: proc.vendor?.prtNm, widthType: 'half'},
                {label: '단가', value: Number(proc.vendorPrice ?? 0).toLocaleString(), widthType: 'half'},
              ]}
              title="" btnLabel="" btnClick={()=>{}}
            />
          </div>))
          }
        </div>
      </AntdDrawer>
    </>
  )
};

BuyCostStatusPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="외주처 단가 현황"
    menu={[
      { text: '외주처 단가 등록', link: '/buy/cost/wait' },
      { text: '외주처 단가 현황', link: '/buy/cost/status' },
    ]}
  >{page}</MainPageLayout>
);

export default BuyCostStatusPage;