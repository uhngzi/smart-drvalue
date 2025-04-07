import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { WkStatusOutClmn } from "@/data/columns/Wk";
import { useUser } from "@/data/context/UserContext";
import { partnerRType } from "@/data/type/base/partner";
import { wkPlanWaitType } from "@/data/type/wk/plan";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { CloseCircleOutlined, CloseOutlined, ExportOutlined, ImportOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, List } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Back from "@/assets/svg/icons/back.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { LabelMedium } from "@/components/Text/Label";
import { patchAPI } from "@/api/patch";

const WKStatusOutPage: {
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
    queryKey: ['worksheet/shipment-status/jsxcrud/many', pagination],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/shipment-status/jsxcrud/many',
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
        progress: Math.floor((item?.progress ?? 0) * 100) / 100,
        make: item.wkLatestProc?.wkProcStDtm && item.wsStDt
        ? (() => {
            const diffMs = dayjs(item.wkLatestProc.wkProcStDtm).diff(item.wsStDt);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${days}일 ${hours}시간 ${minutes}분`;
          })() : null,
        diff: item?.wkLatestDtm
        ? (() => {
            const diffMs = dayjs().diff(item.wkLatestDtm);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${days}일 ${hours}시간 ${minutes}분`;
          })()
        : null,
        m2: Math.floor(((item.specModel?.spec?.wksizeH ?? 0) * (item.specModel?.spec?.wksizeW ?? 0)) / 1000000 * (item.specModel?.prdCnt ?? 0) * 100) / 100,
      }))
      console.log(arr);
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝
  
  const handlePageMenuClick = (key:number)=>{
    const clmn = WkStatusOutClmn(totalData, pagination, setPartnerData, checkeds, setCheckeds, handleCheckedAllClick)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "투입현황", "excel", showToast, "worksheet/production-status/input-status", "core-d2");
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
  
  
  const [checkeds, setCheckeds] = useState<wkPlanWaitType[]>([]);

  const handleCheckedAllClick = () => {
    if(checkeds.length === data.length) {
      setCheckeds([]);
    } else {
      setCheckeds(data.map((record) => ({
        ...record
      })))
    }
  }

  const handleSubmitOut = async () => {
    try {
      const jsonData = {
        worksheetIds: checkeds.map((item) => {return item.id})
      }
      console.log(JSON.stringify(jsonData));
      const result = await patchAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/shipment-status/default/cancel-shipment',
        jsx: 'default',
        etc: true,
      }, "", jsonData);

      if(result.resultCode === 'OK_0000') {
        showToast("출고 취소 처리 완료", "success");
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  return (
    <>
      <ListPagination
        titleBtn={
          <Button
            onClick={()=>{
              if(checkeds.length < 1) {
                showToast("선택된 값이 없습니다.", "error");
                return;
              }
              setResultType("cf");
              setResultOpen(true);
            }}
            className="!text-point1 !border-point1"
          >
            <p className="text-point1 h-16 w-16"><Back /></p> 출고취소
          </Button>
        }
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
      />

      <List>
        <AntdTableEdit
          columns={WkStatusOutClmn(totalData, pagination, setPartnerData, checkeds, setCheckeds, handleCheckedAllClick)}
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

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "error" ? "오류 발생" : 
          resultType === "cf" ? "출고 취소 처리를 하시겠습니까?" : 
          ""
        }
        contents={
          resultType === "error" ? <div>{errMsg}</div> :
          resultType === "cf" ? <div>
            <LabelMedium label="선택된 모델"/>
            {
              checkeds.map((item, index) => (
                <div key={index}>{item.specModel?.prdNm}</div>
              ))
            }
          </div> :
          <></>
        }
        type={resultType === "cf" ? "confirm" : "error"}
        onOk={()=>{
          setResultOpen(false);
          if(resultType === "cf") handleSubmitOut();
        }}
        onCancle={()=>{
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "error" ? "확인" :
          resultType === "cf" ? "네 출고 취소할래요" :
          ""
        }
        cancelText={
          resultType === "cf" ? "아니요 안할래요" :
          ""
        }
      />
    </>
  )
};

WKStatusOutPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="출고현황"
    menu={[
      { text: '공정현황', link: '/wk/status/proc' },
      { text: 'WIP', link: '/wk/status/wip' },
      { text: '투입현황', link: '/wk/status/input' },
      { text: '출고현황', link: '/wk/status/out' },
    ]}
  >{page}</MainPageLayout>
);

export default WKStatusOutPage;