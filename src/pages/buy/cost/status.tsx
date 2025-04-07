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

const BuyCostStatusPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
  const { showToast, ToastContainer } = useToast();

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
    queryKey: ['worksheet/vender-price/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/vender-price/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
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
      />

      <List>
        <AntdTableEdit
          columns={BuyCostOutStatusClmn(totalData, pagination, setSelect)}
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