import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { salesModelsClmn } from "@/data/columns/Sales";
import { useUser } from "@/data/context/UserContext";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { modelsType } from "@/data/type/sayang/models";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { List } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import { DividerH } from "@/components/Divider/Divider";
import { useMenu } from "@/data/context/MenuContext";
import cookie from "cookiejs";
import { port } from "../_app";

const SalesModelPage: React.FC & {
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
    const clmn = salesModelsClmn(
      totalData,
      setPartnerData,
      setPartnerMngData,
      pagination,
      router
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
        selectMenu?.menuNm ?? "영업모델현황",
        "excel",
        showToast,
        "models",
        "core-d1"
      );
    } else {
      // 프린트
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "영업모델현황",
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
  const [data, setData] = useState<Array<modelsType>>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["models/jsxcrud/many", pagination, sQueryJson],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d1",
          utype: "tenant/",
          url: "models/jsxcrud/many",
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
      const arr = (queryData?.data?.data ?? []).map((item: modelsType) => ({
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
        cs?.data?.data.map((cs: partnerRType) => ({
          value: cs.id,
          label: cs.prtNm,
        }))
      );
    }
  }, [cs?.data?.data]);
  // ------------- 필요 데이터 세팅 ------------- 끝

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

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
          router.push("/sales/model/new");
        }}
      />

      <List>
        <AntdTableEdit
          columns={
            (port === "3000" ? cookie.get("companySY") === "sy" : port === "90")
              ? salesModelsClmn(
                  totalData,
                  setPartnerData,
                  setPartnerMngData,
                  pagination,
                  router
                ).filter(
                  (f) => f.dataIndex !== "fpNo" && !f.dataIndex.includes("pnl")
                )
              : salesModelsClmn(
                  totalData,
                  setPartnerData,
                  setPartnerMngData,
                  pagination,
                  router
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
        prtMngSuccessFn={(entity: partnerMngRType) => {
          csRefetch();
        }}
      />

      <ToastContainer />
    </>
  );
};

SalesModelPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="모델 현황">{page}</MainPageLayout>
);

export default SalesModelPage;
