import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import { LabelMedium } from "@/components/Text/Label";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { BuyCostOutClmn, BuyCostOutPriceClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { processVendorPriceRType } from "@/data/type/base/process";
import { buyCostOutType } from "@/data/type/buy/cost";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BuyCostWaitPage: React.FC & {
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
        anykey: "applyAutoFilterType",
        anyvalue: "UNMATCH",
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

  // ------------- 필요 데이터 세팅 ------------- 시작
  const [prices, setPrices] = useState<processVendorPriceRType[]>([]);
  const { data:queryPriceData } = useQuery({
    queryKey: ['process-vendor-price/jsxcrud/many'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-vendor-price/jsxcrud/many'
      });

      if(result.resultCode === "OK_0000") {
        setPrices(result?.data?.data ?? []);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
      return result;
    }
  });
  // ------------- 필요 데이터 세팅 ------------- 끝

  const handlePageMenuClick = (key:number)=>{
    const clmn = BuyCostOutClmn(totalData, pagination, setOpen, setSelect)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가등록대기", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "외주단가등록대기", "print", showToast);
    }
  }
  
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<buyCostOutType | null>(null);
  const [selectPrice, setSelectPrice] = useState<{id:string, value:number}[]>([]);

  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"success" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");

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
          columns={BuyCostOutClmn(totalData, pagination, setOpen, setSelect)}
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

      <AntdModal
        open={open}
        setOpen={setOpen}
        width={1300}
        title={"외주처 단가 등록"}
        contents={<>
          <div className="w-full h-full p-30 bg-white rounded-14 flex flex-col gap-20">
            {
              prices.map((price, index) => (<div key={index}>
                <div className="h-center gap-30 mb-10">
                  <LabelMedium label={(price?.process?.prcNm ?? "")+" ("+(price?.vendor?.prtNm ?? "")+")"}/>
                  <div className="h-center gap-5">
                    <LabelMedium label="선택된 단가 : "/>
                    <AntdInput
                      value={selectPrice.find(f=>f.id === price.id)?.value}
                      className="!w-[120px]"
                      type="number"
                    />
                  </div>
                </div>
                <AntdTableEdit
                  columns={BuyCostOutPriceClmn(selectPrice, setSelectPrice)}
                  data={prices.filter(f=>f.vendor.id === price.vendor.id)}
                  styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',th_ht:"32px",td_ht:"30px",round:'0px',line:'n'}}
                />
              </div>))
            }
          </div>
        </>}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "error" ? "오류 발생" : 
          ""
        }
        contents={
          resultType === "error" ? <div>{errMsg}</div> :
          <></>
        }
        type={resultType === "success" ? "confirm" : "error"}
        onOk={()=>{
          setResultOpen(false);
        }}
        onCancle={()=>{
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "error" ? "확인" :
          ""
        }
      />
      
      <ToastContainer />
    </>
  )
};

BuyCostWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="외주처단가등록대기"
    menu={[
      { text: '외주처단가등록대기', link: '/buy/cost/wait' },
      { text: '외주처단가등록현황', link: '/buy/cost/status' },
    ]}
  >{page}</MainPageLayout>
);

export default BuyCostWaitPage;