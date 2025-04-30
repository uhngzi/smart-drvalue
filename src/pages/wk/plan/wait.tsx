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
import { Button, List } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/data/context/MenuContext";
import cookie from "cookiejs";
import { port } from "@/pages/_app";
import AntdModal from "@/components/Modal/AntdModal";
import domtoimage from "dom-to-image";
import FilmDocumentForm from "@/contents/documentForm/FilmDocumentForm";

const WkPlanWaitPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
  const { selectMenu } = useMenu();
  const { showToast, ToastContainer } = useToast();

  // ------------- 페이지네이션 세팅 ------------ 시작
  const [searchs, setSearchs] = useState<string>("");
  const [sQueryJson, setSQueryJson] = useState<string>("");
  useEffect(() => {
    if (searchs.length < 2) setSQueryJson("");
  }, [searchs]);
  const handleSearchs = () => {
    if (searchs.length < 2) {
      showToast("2글자 이상 입력해주세요.", "error");
      return;
    }
    // url를 통해 현재 메뉴를 가져옴
    const jsx = selectMenu?.children?.find((f) =>
      router.pathname.includes(f.menuUrl ?? "")
    )?.menuSearchJsxcrud;
    if (jsx) {
      setSQueryJson(jsx.replaceAll("##REPLACE_TEXT##", searchs));
    } else {
      setSQueryJson("");
    }
  };

  const handlePageMenuClick = (key: number) => {
    const clmn = WkPalnWaitClmn(
      totalData,
      pagination,
      handleSubmit,
      setFormData,
      setDocumentFormOpen
    ).map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }));
    if (key === 1) {
      // 엑셀 다운로드
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "생산대기",
        "excel",
        showToast,
        "worksheet/wait-for-production-plan",
        "core-d2"
      );
    } else {
      // 프린트
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "생산대기",
        "print",
        showToast
      );
    }
  };
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
  const [data, setData] = useState<Array<wkPlanWaitType>>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "worksheet/wait-for-production-plan/jsxcrud/many",
      pagination,
      sQueryJson,
    ],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d2",
          utype: "tenant/",
          url: "worksheet/wait-for-production-plan/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
          anykeys: {
            applyAutoFilter:
              port === "90" || cookie.get("companySY") === "sy" ? true : false,
          },
        }
      );
    },
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item: wkPlanWaitType) => ({
        ...item,
      }));
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------- 시작
  // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [csList, setCsList] = useState<Array<{ value: any; label: string }>>(
    []
  );
  const [csMngList, setCsMngList] = useState<Array<partnerMngRType>>([]);
  const { data: cs, refetch: csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });

  // 거래처 변경 시 해당 거래처 담당자 리스트 세팅
  useEffect(() => {
    if (cs?.data?.data?.length) {
      setCsList(
        cs.data?.data.map((cs: partnerRType) => ({
          value: cs.id,
          label: cs.prtNm,
        }))
      );
    }
  }, [cs?.data?.data]);
  // ------------- 필요 데이터 세팅 ------------- 끝

  const handleSubmit = async (id: string, value: any) => {
    console.log(id, value);
    const dt = dayjs(value).format("YYYY-MM-DD");
    if (dt && dayjs(dt).isValid()) {
      console.log(dt);

      const result = await postAPI(
        {
          type: "core-d2",
          utype: "tenant/",
          url: "worksheet/wait-for-production-plan/default/update-production-plan-start-date",
          jsx: "default",
          etc: true,
        },
        { worksheetId: id, wsExpDt: dt }
      );

      if (result.resultCode === "OK_0000") {
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
  };

  const [open, setOpen] = useState<boolean>(false);

  // ---------------- 양식 모달 --------------- 시작
  const [formData, setFormData] = useState<wkPlanWaitType | null>(null);
  const [documentFormOpen, setDocumentFormOpen] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    const node = document.getElementById("print-area");
    if (!node) return;

    try {
      const dataUrl = await domtoimage.toPng(node, {
        quality: 1,
        height: node.offsetHeight * 2,
        width: node.offsetWidth * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });

      const win = window.open("");
      win?.document.write(`
            <html>
              <head>
                <title>구매발주서_${dayjs().format("YYYYMMDD")}</title>
                <style>
                  @page {
                    size: A4;
                    margin: 0;
                  }
                  @media print {
                    table {
                      table-layout: fixed;
                      width: 100%;
                    }
                    td {
                      word-wrap: break-word;
                    }
                  }
                  body { margin: 0; }
                  img { width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" />
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  }
                </script>
              </body>
            </html>
          `);
      win?.document.close();
    } catch (error) {
      console.error("캡처 실패", error);
    }
  };
  // ---------------- 양식 모달 --------------- 끝

  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"success" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  return (
    <>
      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs}
        setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <List>
        <AntdTableEdit
          create={true}
          columns={
            port === "90" || cookie.get("companySY") === "sy"
              ? WkPalnWaitClmn(
                  totalData,
                  pagination,
                  handleSubmit,
                  setFormData,
                  setDocumentFormOpen,
                  router
                )?.filter(
                  (f) =>
                    !f.key?.toString().includes("layerEm") &&
                    !f.key?.toString().includes("sm") &&
                    !f.key?.toString().includes("mk") &&
                    !f.key?.toString().includes("pnlL") &&
                    !f.key?.toString().includes("kit") &&
                    !f.key?.toString().includes("Kit") &&
                    !f.key?.toString().includes("board") &&
                    !f.key?.toString().includes("prdCnt") &&
                    !f.key?.toString().includes("sth")
                )
              : WkPalnWaitClmn(
                  totalData,
                  pagination,
                  handleSubmit,
                  setFormData,
                  setDocumentFormOpen
                )
          }
          data={data}
          setData={setData}
          styles={{
            th_bg: "#E9EDF5",
            td_bg: "#FFFFFF",
            round: "14px",
            line: "n",
          }}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs}
        setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <AntdDrawer
        open={open}
        close={() => {
          setOpen(false);
        }}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5"></div>
      </AntdDrawer>

      {/* 제작의뢰서 */}
      <AntdModal
        open={documentFormOpen}
        setOpen={setDocumentFormOpen}
        title={"FIML 제작의뢰서 미리보기"}
        width={635}
        draggable
        contents={
          <>
            <div id="print-area" ref={componentRef}>
              <FilmDocumentForm
                id={formData?.id ?? ""}
                // formData={order}
                // products={orderDetails}
                // prtNm={csList.find((f: any) => f.id === prtId)?.label ?? ""}
                // prtMng={
                //   csMngList.filter((f: any) => f.id === prtMngId)?.[0] ?? null
                // }
              />
            </div>
            <div className="v-h-center gap-5 mt-20">
              <Button onClick={handlePrint}>인쇄</Button>
            </div>
          </>
        }
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "error" ? "오류 발생" : ""}
        contents={resultType === "error" ? <div>{errMsg}</div> : <></>}
        type={resultType === "success" ? "confirm" : "error"}
        onOk={() => {
          setResultOpen(false);
        }}
        onCancel={() => {
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={resultType === "error" ? "확인" : ""}
      />

      <ToastContainer />
    </>
  );
};

WkPlanWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="생산 대기">{page}</MainPageLayout>
);

export default WkPlanWaitPage;
