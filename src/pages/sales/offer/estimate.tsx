import FullChip from "@/components/Chip/FullChip";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import Edit from "@/assets/svg/icons/edit.svg";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Close from "@/assets/svg/icons/s_close.svg";

import { Button, Checkbox, List, TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMenu } from "@/data/context/MenuContext";
import useToast from "@/utils/useToast";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import {
  salesEstimateProductType,
  salesEstimateType,
} from "@/data/type/sales/order";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import { ListPagination } from "@/layouts/Body/Pagination";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import cookie from "cookiejs";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { salesEstimateClmn } from "@/data/columns/Sales";
import { port } from "@/pages/_app";
import domtoimage from "dom-to-image";
import dayjs from "dayjs";
import AntdModal from "@/components/Modal/AntdModal";
import EstimateDocumentForm from "@/contents/documentForm/EstimateDocumentForm";

const SalesUserEstimatePage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
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

  const handlePageMenuClick = async (key: number) => {
    const clmn = salesEstimateClmn(
      totalData,
      setPartnerData,
      setPartnerMngData,
      pagination,
      router,
      setFormData,
      setDocumentOpen
    ).map((item, index) => ({
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
        selectMenu?.menuNm ?? "견적",
        "excel",
        showToast,
        "sales-estimate",
        "core-d1"
      );
    } else {
      // 프린트
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "견적",
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
  const [data, setData] = useState<Array<salesEstimateType>>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sales-estimate/jsxcrud/many", pagination, sQueryJson],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d1",
          utype: "tenant/",
          url: "sales-estimate/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
        }
      );
    },
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading) {
      const arr = (queryData?.data?.data ?? []).map(
        (item: salesEstimateType) => ({
          ...item,
          modelCnt: item.products?.length,
        })
      );
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ---------------- 거래처  ---------------- 시작
  // 리스트 내 거래처
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [partnerData, setPartnerData] = useState<partnerRType | null>(null);
  const [partnerMngData, setPartnerMngData] = useState<partnerMngRType | null>(
    null
  );

  // 드로워 닫힐 때 값 초기화
  useEffect(() => {
    if (!drawerOpen) {
      setPartnerData(null);
      setPartnerMngData(null);
    }
  }, [drawerOpen]);
  // ---------------- 거래처  ---------------- 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  // 견적 메인
  const [formData, setFormData] = useState<salesEstimateType | null>(null);
  // 견적 모델
  const [products, setProducts] = useState<salesEstimateProductType[]>([]);

  // id 값이 변경될 경우마다 실행됨
  const { data: queryDetailData } = useQuery({
    queryKey: ["sales-estimate/jsxcrud/one", formData?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: `sales-estimate/jsxcrud/one/${formData?.id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result.data.data as salesEstimateType;
        const product = (entity.products ?? [])
          .sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0))
          .map((model, index) => ({
            ...model,
            ordNo: model.ordNo ? model.ordNo : index,
          }));
        setFormData(entity);
        setProducts(product);
      }

      return result;
    },
    enabled: !!formData?.id && !formData.id.includes("new"),
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // ---------------- 양식 모달 --------------- 시작
  const [documentOpen, setDocumentOpen] = useState<boolean>(false);
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
              <title>견적서_${dayjs().format("YYYYMMDD")}</title>
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
        handleSubmitNew={() => {
          router.push("/sales/offer/estimate/new");
        }}
      />

      <List>
        <AntdTableEdit
          columns={
            (port === "3000" ? cookie.get("companySY") === "sy" : port === "90")
              ? salesEstimateClmn(
                  totalData,
                  setPartnerData,
                  setPartnerMngData,
                  pagination,
                  router,
                  setFormData,
                  setDocumentOpen
                ).filter((f) => f.key !== "orderRepDt")
              : salesEstimateClmn(
                  totalData,
                  setPartnerData,
                  setPartnerMngData,
                  pagination,
                  router,
                  setFormData,
                  setDocumentOpen
                )
          }
          data={data}
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

      <AntdModal
        open={documentOpen}
        setOpen={setDocumentOpen}
        title={"견적서 미리보기"}
        draggable
        contents={
          <>
            <div id="print-area" ref={componentRef}>
              <EstimateDocumentForm formData={formData} products={products} />
            </div>
            <div className="v-h-center gap-5 mt-20">
              <Button onClick={handlePrint}>인쇄</Button>
              <Button type="primary">견적서 발송</Button>
            </div>
          </>
        }
        width={635}
      />

      <PrtDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        partnerId={partnerData?.id ?? ""}
        partnerData={partnerData}
        partnerMngData={partnerMngData}
        prtSuccessFn={() => {
          refetch();
          showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
        }}
      />

      <ToastContainer />
    </>
  );
};

SalesUserEstimatePage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: "고객발주", link: "/sales/offer/order" },
      { text: "견적", link: "/sales/offer/estimate" },
    ]}
  >
    {page}
  </MainPageLayout>
);

export default SalesUserEstimatePage;
