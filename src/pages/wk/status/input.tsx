import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { LabelMedium } from "@/components/Text/Label";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { WKStatusInClmn } from "@/data/columns/Wk";
import { useUser } from "@/data/context/UserContext";
import { partnerRType } from "@/data/type/base/partner";
import { wkPlanWaitType } from "@/data/type/wk/plan";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WKStatusProcPage: {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
  const { showToast, ToastContainer } = useToast();

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [selectVendor, setSelectVendor] = useState<{
    prtVndrIdx: string;
    vendorId: string;
    vendorName: string;
    specPrdGrpId: string;
    processId: string;
    processName: string;
    processGroupId: string;
    processGroupName: string;
  }>();
  const [ vendorList, setVendorList ] = useState<{
    prtVndrIdx: string;
    vendorId: string;
    vendorName: string;
    specPrdGrpId: string;
    processId: string;
    processName: string;
    processGroupId: string;
    processGroupName: string;
  }[]>([]);
  const { data:queryVendorData } = useQuery({
    queryKey: ['worksheet/production-status/input-status/search-vender/default/vender-list'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/input-status/search-vender/default/vender-list',
      });

      if(result.resultCode === "OK_0000") {
        setVendorList(result?.data ?? []);
        console.log(result.data);
      }

      return result;
    }
  });

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [ data, setData ] = useState<Array<wkPlanWaitType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['worksheet/production-status/input-status/jsxcrud/many', pagination, selectVendor],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/input-status/jsxcrud/many',
      },{
        limit: pagination.size,
        page: pagination.current,
        anykeys: {applyAutoFilter:true, procVenderIdx: selectVendor?.vendorId},
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:wkPlanWaitType) => ({
        ...item,
        m2: Math.floor(((item.specModel?.spec?.wksizeH ?? 0) * (item.specModel?.spec?.wksizeW ?? 0)) / 1000000 * (item.specModel?.prdCnt ?? 0) * 100) / 100,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  const handlePageMenuClick = (key:number)=>{
    const clmn = WKStatusInClmn(totalData, pagination, setPartnerData)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "투입현황", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "투입현황", "print", showToast);
    }
  }
  
  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"cf" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");
  
  // ---------------- 거래처  ---------------- 시작
    // 리스트 내 거래처
  const [ prtOpen, setPrtOpen ] = useState<boolean>(false);
  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);

    // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!prtOpen) {
      setPartnerData(null);
    }
  }, [prtOpen]);
  // ---------------- 거래처  ---------------- 끝
  
  return (
    <div className="flex gap-20">
      <div className="w-[7%] pt-15">
        <LabelMedium label="투입모델 공정업체"/>
        <div className="w-full max-h-[700px] overflow-y-auto mt-10 flex flex-col gap-10">
          <div
            className="h-50 v-between-h-center border-1 border-line rounded-14 p-10 cursor-pointer"
            style={selectVendor?.vendorId === undefined ? {border:0,background:"#F5F6FA"} : {}}
            onClick={()=>{
              setSelectVendor(undefined);
            }}

          >
            전체
          </div>
          {
            vendorList.map((item, index) => (
              <div
                key={index}
                className="h-50 v-between-h-center border-1 border-line rounded-14 p-10 cursor-pointer"
                style={selectVendor?.vendorId === item.vendorId ? {border:0,background:"#F5F6FA"} : {}}
                onClick={()=>{
                  setSelectVendor(item);
                }}
              >
                {item.vendorName}
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex flex-col w-[93%]">
        <ListPagination
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          handleMenuClick={handlePageMenuClick}
        />

        <List>
          <AntdTableEdit
            columns={WKStatusInClmn(totalData, pagination, setPartnerData)}
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

        <PrtDrawer
          open={prtOpen}
          setOpen={setPrtOpen}
          partnerId={partnerData?.id ?? ''}
          partnerData={partnerData}
          prtSuccessFn={()=>{
            refetch();
            showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
          }}
        />
      </div>

      <ToastContainer />
    </div>
  )
};

WKStatusProcPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="투입현황"
    menu={[
      { text: '공정현황', link: '/wk/status/proc' },
      { text: '투입현황', link: '/wk/status/input' },
      { text: '출고현황', link: '/wk/status/out' },
    ]}
  >{page}</MainPageLayout>
);

export default WKStatusProcPage;