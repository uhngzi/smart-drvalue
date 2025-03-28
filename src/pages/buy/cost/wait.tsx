import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Button, List } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import { LabelMedium } from "@/components/Text/Label";

import { BuyCostOutClmn, BuyCostOutPriceClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import { processVendorPriceRType } from "@/data/type/base/process";
import { buyCostOutDetailType, buyCostOutType } from "@/data/type/buy/cost";

import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";

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
        anykeys: {applyAutoFilterType : "UNMATCH"},
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

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<buyCostOutType | null>(null);
  const [selectPrice, setSelectPrice] = useState<{id:string, processId:string, vendorId:string, value:number}[]>([]);

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

  useEffect(() => {
    if (detailData && detailData.procs) {
      const newExpanded: { [key: string]: boolean } = {};
      detailData.procs.forEach((proc, index) => {
        const procId = proc.id || index.toString();
        newExpanded[procId] = true;
      });
      setExpandedProcs(newExpanded);
    }
  }, [detailData]);

  // 값 초기화
  useEffect(()=>{
    if(!open) {
      setSelect(null);
      setDetailData(null);
      setSelectPrice([]);
      setTot(0);
    }
  }, [open])

  const [tot, setTot] = useState<number>(0);
  useEffect(()=>{
    let tot = 0;
    selectPrice.map((p) => {tot += p.value});
    setTot(tot);
  },[selectPrice])
  // ------------ 디테일 데이터 세팅 ------------ 끝
  
  // ----------- 페이지네이션 내보내기 ----------- 시작
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
  // ----------- 페이지네이션 내보내기 ----------- 끝
  
  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"success" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");
  
  // ------------ 모달창 내 펼침/접힘 ----------- 시작
  // 각 프로세스의 펼침/접힘 상태를 관리하는 state (프로세스 id를 key로 사용)
  const [expandedProcs, setExpandedProcs] = useState<{ [key: string]: boolean }>({});

  // 토글 함수
  const toggleProc = (procId: string) => {
    setExpandedProcs((prev) => ({
      ...prev,
      [procId]: !prev[procId],
    }));
  };

  // 전체 펼치기: detailData의 모든 프로세스의 expanded 상태를 true로 설정
  const expandAll = () => {
    const newState: { [key: string]: boolean } = {};
    detailData?.procs?.forEach((proc, index) => {
      const procId = proc.id || index.toString();
      newState[procId] = true;
    });
    setExpandedProcs(newState);
  };

  // 전체 접기: expandedProcs를 빈 객체로 설정
  const collapseAll = () => {
    setExpandedProcs({});
  };

  // 토글 버튼: 하나라도 펼쳐져 있으면 전체 접기, 아니면 전체 펼치기
  const toggleAll = () => {
    if (Object.keys(expandedProcs).length > 0) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  // 버튼 레이블 결정
  const toggleButtonLabel = Object.keys(expandedProcs).length > 0 ? "전체 접기" : "전체 펼치기";
  // ------------ 모달창 내 펼침/접힘 ----------- 끝
  
  // ---------------- 비용 저장 --------------- 시작
  const handleSubmit = async () => {
    try {
      if(selectPrice.length < 1) {
        showToast("선택된 단가가 없습니다.", "error");
        return;
      }

      const jsonData = {
        worksheetId: detailData?.id,
        venderPrice: selectPrice.map((item) => ({
          worksheetProcId: detailData?.procs?.find(f=>f.specPrdGrp?.process?.id === item.processId)?.id,
          venderPrice: item.value,
        }))
      }
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'worksheet/vender-price/default/update-vender-price',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        showToast("단가 등록 완료", "success");
        setOpen(false);
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
  // ---------------- 비용 저장 --------------- 끝

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
            <div className="v-between-h-center justify-end">
              <Button onClick={toggleAll}>{toggleButtonLabel}</Button>
              <LabelMedium label={"단가 합계 : "+(tot.toLocaleString() ?? 0)+"원"} />
            </div>
            <div className="max-h-[700px] overflow-y-auto flex flex-col gap-20">
              {detailData?.procs?.map((proc, index) => {
                // 각 프로세스 항목에 고유 id가 있다고 가정 (예: proc.id)
                const procId = proc.id || index.toString();
                const isExpanded = expandedProcs[procId];

                return (
                  <div key={procId}>
                    <div className="v-between-h-center gap-30 mb-10 px-10">
                      <LabelMedium
                        label={
                          (proc.specPrdGrp?.process?.prcNm ?? "") +
                          " (" + (proc?.vendor?.prtNm ?? "") + ")"
                        }
                      />
                      <DownOutlined
                        className="cursor-pointer"
                        onClick={() => toggleProc(procId)}
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </div>
                    {/* 조건부 렌더링: 펼쳐진 경우에만 테이블 표시 */}
                    {isExpanded && (
                      <AntdTableEdit
                        columns={BuyCostOutPriceClmn(
                          selectPrice,
                          setSelectPrice,
                          selectPrice.find(
                            (f) =>
                              f.processId === proc.specPrdGrp?.process?.id &&
                              f.vendorId === proc.vendor?.id
                          )?.id
                        )}
                        data={prices.filter(
                          (f) =>
                            f.vendor.id === proc?.vendor?.id &&
                            f.process.id === proc.specPrdGrp?.process?.id
                        )}
                        styles={{
                          th_bg: "#FAFAFA",
                          td_bg: "#FFFFFF",
                          th_ht: "32px",
                          td_ht: "30px",
                          round: "14px",
                          th_fw: "bold",
                          fs: "12px",
                          td_pd: "0",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
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
    menuTitle="외주처 단가 등록"
    menu={[
      { text: '외주처 단가 등록', link: '/buy/cost/wait' },
      { text: '외주처 단가 현황', link: '/buy/cost/status' },
    ]}
  >{page}</MainPageLayout>
);

export default BuyCostWaitPage;