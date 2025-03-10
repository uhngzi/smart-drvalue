import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { WkPalnWaitClmn } from "@/data/columns/Wk";
import { useUser } from "@/data/context/UserContext";
import { wkPlanWaitType } from "@/data/type/wk/plan";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WkPlanWaitPage: React.FC & {
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
  const [ data, setData ] = useState<Array<wkPlanWaitType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['worksheet/wait-for-production-plan/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/wait-for-production-plan/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        anykeys: {applyAutoFilter : true},
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:wkPlanWaitType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<partnerMngRType>>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  
    // 거래처 변경 시 해당 거래처 담당자 리스트 세팅
  useEffect(()=>{
    if(cs?.data.data?.length) {
      setCsList(cs.data.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data.data]);
  // ------------- 필요 데이터 세팅 ------------- 끝

  const handleSubmit = async (id:string, value:any) => {
    console.log(id, value);
    const dt = dayjs(value).format("YYYY-MM-DD");
    if(dt && dayjs(dt).isValid()) {
      console.log(dt);

      const result = await postAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/wait-for-production-plan/default/update-production-plan-start-date',
        jsx: 'default',
        etc: true,
      }, { worksheetId: id, wsExpDt: dt }
      );

      if(result.resultCode === 'OK_0000') {
        showToast("생산예정일 입력 완료", "success");
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } else {
      showToast("유효하지 않은 날짜입니다.", "error");
    }
  }

  const handlePageMenuClick = (key:number)=>{
    const clmn = WkPalnWaitClmn(totalData, pagination, handleSubmit)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "생산계획대기", "excel", showToast);
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "생산계획대기", "print", showToast);
    }
  }
  
  const [open, setOpen] = useState<boolean>(false);

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
          columns={WkPalnWaitClmn(totalData, pagination, handleSubmit)}
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
        }}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
        </div>
      </AntdDrawer>

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

WkPlanWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="생산 계획 대기"
  >{page}</MainPageLayout>
);

export default WkPlanWaitPage;