import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, List } from "antd";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import Description from "@/components/Description/Description";
import DescriptionItems from "@/components/Description/DescriptionItems";
import DescriptionItems3 from "@/components/Description/DescriptionItems3";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import { LabelMedium } from "@/components/Text/Label";
import PrtDrawer from "@/contents/partner/PrtDrawer";

import { WKStatusProcClmn, WkStatusProcPopClmn } from "@/data/columns/Wk";
import { useUser } from "@/data/context/UserContext";
import { partnerRType } from "@/data/type/base/partner";
import { wkDetailType, wkPlanWaitType, wkProcsType } from "@/data/type/wk/plan";

import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import { ExportOutlined } from "@ant-design/icons";
import { processVendorRType } from "@/data/type/base/process";
import { apiGetResponseType } from "@/data/type/apiResponse";
import FullChip from "@/components/Chip/FullChip";
import { useMenu } from "@/data/context/MenuContext";

const WKStatusProcPage: {
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
    const clmn = WKStatusProcClmn(totalData, pagination, setPartnerData, setSelect, checkeds, setCheckeds, handleCheckedAllClick)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }))
    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "공정현황", "excel", showToast, "worksheet/production-status/process-status", "core-d2");
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "공정현황", "print", showToast);
    }
  }
  // ------------- 페이지네이션 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------ 시작
  const [ dataVendor, setDataVendor ] = useState<Array<processVendorRType>>([]);
  const { data:queryDataVendor } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process-vendor/jsxcrud/many'],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-vendor/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataVendor(result.data?.data ?? []);
        console.log('vendor : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ------------- 필요 데이터 세팅 ------------ 끝

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
    queryKey: ['worksheet/production-status/process-status/jsxcrud/many', pagination, sQueryJson],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/process-status/jsxcrud/many',
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
        anykeys: {applyAutoFilter : true},
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:wkPlanWaitType) => ({
        ...item,
        progress: (item?.progress ?? 0) * 100,
        wkLatestDtm: item.wkLatestDtm ? dayjs(item.wkLatestDtm).format("YYYY-MM-DD") : null,
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
  
  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<wkPlanWaitType | null>(null);
  const [detailData, setDetailData] = useState<wkDetailType | null>(null);
  const [procs, setProcs] = useState<wkProcsType[]>([]);
  const {data:queryDetailData} = useQuery({
    queryKey: ['worksheet/production-status/process-status/detail/jsxcrud/one', select],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `worksheet/production-status/process-status/detail/jsxcrud/one/${select?.id}`
      });

      if(result.resultCode === "OK_0000") {
        const rdata = (result?.data?.data as wkDetailType).procs?.sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0)) as wkProcsType[];
        const procs = (rdata ?? []).map((item, index) => ({
          ...item,
          prdCnt: select?.specModel?.prdCnt,
          prevWkProcEdCnt: index > 0 ? rdata[index-1].wkProcEdCnt : 0,
          wkProcStCnt: (item?.wkProcStCnt ?? 0) < 0 ? 0 : item?.wkProcStCnt,
          wkProcEdCnt: (item?.wkProcEdCnt ?? 0) < 0 ? 0 : item?.wkProcEdCnt,
          wkProcBadCnt: (item?.wkProcBadCnt ?? 0) < 0 ? 0 : item?.wkProcBadCnt,
        }))
        setDetailData({...result?.data?.data, procs: procs});
        setProcs(procs?.sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0)) ?? []);
        setOpen(true);
      }

      return result;
    },
    enabled: !!select?.id
  });
  useEffect(()=>{
    if(!open) {
      setSelect(null);
      setDetailData(null);
      setProcs([]);
    }
  }, [open])
  // ------------ 디테일 데이터 세팅 ------------ 끝

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

  const handleSubmit = async () => {
    try {
      const jsonData = {
        worksheetId: detailData?.id,
        worksheetProcData: procs?.map((item) => ({
          worksheetProcId: item.id,
          wkProcStCnt: item.wkProcStCnt,
          wkProcStDtm: item.wkProcStDtm,
          wkProcEdCnt: item.wkProcEdCnt,
          wkProcEdDtm: item.wkProcEdDtm,
          wkProcBadCnt: item.wkProcBadCnt,
          wkProcMemo: item.wkProcMemo,
        }))
      }
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/process-status/default/process',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        showToast("공정 진행 등록 완료", "success");
        setOpen(false);
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

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

      const result = await postAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/production-status/process-status/default/shipment',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        showToast("출고 처리 완료", "success");
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

  useEffect(() => {
    setProcs((prevProcs) => {
      // 이전 행의 wkProcEdCnt 값을 다음 행의 prevWkProcEdCnt로 업데이트
      const updatedProcs = prevProcs.map((row, index) => {
        if (index > 0) {
          const newPrevValue = prevProcs[index - 1].wkProcEdCnt;
          // 이미 값이 동일하면 그대로 반환하여 불필요한 재렌더링 방지
          if (row.prevWkProcEdCnt !== newPrevValue) {
            return { ...row, prevWkProcEdCnt: newPrevValue };
          }
        }
        return row;
      });
      return updatedProcs;
    });
  }, [procs.map((row) => row.wkProcEdCnt).join(",")]);

  return (<>
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
          <p className="text-point1"><ExportOutlined /></p> 출고
        </Button>
      }
      pagination={pagination}
      totalData={totalData}
      onChange={handlePageChange}
      handleMenuClick={handlePageMenuClick}
      searchs={searchs} setSearchs={setSearchs}
      handleSearchs={handleSearchs}
    />

    <List>
      <AntdTableEdit
        columns={WKStatusProcClmn(totalData, pagination, setPartnerData, setSelect, checkeds, setCheckeds, handleCheckedAllClick)}
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

    <AntdModal
      open={open}
      setOpen={setOpen}
      width={1300}
      title={"공정 현황"}
      contents={
      <div className="w-full h-full flex flex-col gap-20">
        <div className="w-full h-full p-30 bg-white rounded-14 flex flex-col gap-30">
          <div className="flex flex-col gap-10">
            <LabelMedium label="생산 정보"/>
            <Description separatorColor="#e7e7ed">
              <DescriptionItems3
                height="20"
                title1="모델명"
                children1={select?.specModel?.prdNm}
                title2="코드/업체명"
                children2={<div className="w-full h-center text-left gap-5">
                  <FullChip label={select?.specModel?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
                  {select?.specModel?.partner?.prtNm??""}
                </div>
                }
                title3="관리번호"
                children3={select?.specModel?.prdMngNo}
                />
              <DescriptionItems3
                height="20"
                title1="두께"
                children1={select?.specModel?.thk}
                title2="층"
                children2={select?.specModel?.layerEm?.replace("L", "")}
                title3="Film No"
                children3={select?.specModel?.fpNo}
              />
              <DescriptionItems3
                height="20"
                title1="판넬수"
                children1={select?.specModel?.prdCnt}
                title2="매수"
                children2={select?.m2}
                title3="납기일"
                children3={select?.orderProduct?.orderPrdDueDt ? dayjs(select?.orderProduct?.orderPrdDueDt).format("YYYY-MM-DD") : null}
              />
              <DescriptionItems
                height="20"
                title="비고"
              >
                <div>
                  {select?.wsRemark}
                </div>
              </DescriptionItems>
            </Description>
          </div>

          <AntdTableEdit
            create={true}
            columns={WkStatusProcPopClmn(dataVendor)}
            data={procs}
            setData={setProcs}
            styles={{
              th_bg: "#FAFAFA",
              td_bg: "#FFFFFF",
              th_ht: "50px",
              td_ht: "50px",
              round: "0",
              th_fw: "bold",
              fs: "12px",
              td_pd: "0",
              line: "n",
            }}
          />

          <div className="h-40 w-full v-h-center">
            <Button
              className="w-109 h-32 bg-point1 text-white rounded-6"
              style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={handleSubmit}
            >
              <Arrow />저장
            </Button>
          </div>
        </div>
      </div>}
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
        resultType === "cf" ? "출고 처리를 하시겠습니까?" : 
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
        resultType === "cf" ? "네 출고할래요" :
        ""
      }
      cancelText={
        resultType === "cf" ? "아니요 안할래요" :
        ""
      }
    />
    
    <ToastContainer />
  </>)
};

WKStatusProcPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="공정현황"
    menu={[
      { text: '공정현황', link: '/wk/status/proc' },
      { text: 'WIP', link: '/wk/status/wip' },
      { text: '투입현황', link: '/wk/status/input' },
      { text: '출고현황', link: '/wk/status/out' },
    ]}
  >{page}</MainPageLayout>
);

export default WKStatusProcPage;