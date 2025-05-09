import { List, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdDrawer from "@/components/Drawer/AntdDrawer";

import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import PrtDrawer from "@/contents/partner/PrtDrawer";
import ModelDrawerContent from "@/contents/sayang/model/add/ModelDrawerContent";

import { useUser } from "@/data/context/UserContext";
import { salesOrderStatusClmn } from "@/data/columns/Sales";
import {
  salesOrderRType,
  salesOrderWorkSheetType,
} from "@/data/type/sales/order";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import { specModelType } from "@/data/type/sayang/sample";

import Close from "@/assets/svg/icons/s_close.svg";

import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import CardList from "@/components/List/CardList";
import { ModelTypeEm } from "@/data/type/enum";
import dayjs from "dayjs";
import { useMenu } from "@/data/context/MenuContext";
import { port } from "../_app";
import cookie from "cookiejs";

const SalesOrderStatusPage: React.FC & {
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
    const clmn = salesOrderStatusClmn(
      totalData,
      setPartnerData,
      setPartnerMngData,
      pagination,
      setOrderId,
      setSpecData,
      setDrawerModelOpen
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
        selectMenu?.menuNm ?? "수주현황",
        "excel",
        showToast,
        "sales-order/product/worksheet/detail",
        "core-d1"
      );
    } else {
      // 프린트
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "수주현황",
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
  const [data, setData] = useState<Array<salesOrderWorkSheetType>>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "sales-order/product/worksheet/jsxcrud/many",
      pagination,
      sQueryJson,
    ],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d1",
          utype: "tenant/",
          url: "sales-order/product/worksheet/jsxcrud/many",
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
        (item: salesOrderWorkSheetType) => ({
          ...item,
          m2:
            Math.floor(
              (((item.worksheet?.specModel?.spec?.wksizeH ?? 0) *
                (item.worksheet?.specModel?.spec?.wksizeW ?? 0)) /
                1000000) *
                (item.worksheet?.specModel?.prdCnt ?? 0) *
                100
            ) / 100,
        })
      );
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

  const [drawerModelOpen, setDrawerModelOpen] = useState<boolean>(false);

  const [orderId, setOrderId] = useState<string>("");
  const [specData, setSpecData] = useState<specModelType | null>(null);
  useEffect(() => {
    if (!drawerModelOpen) {
      setOrderId("");
      setSpecData(null);
    }
  }, [drawerModelOpen]);

  const cardItem = [
    {
      label: "모델명",
      value: specData?.prdNm ?? "-",
      widthType: "half",
    },
    {
      label: "관리No",
      value: specData?.prdMngNo ?? "-",
      widthType: "half",
    },
    {
      label: "제조사",
      value: specData?.mnfNm ?? "-",
      widthType: "half",
    },
    {
      label: "REV",
      value: specData?.prdRevNo ?? "-",
      widthType: "half",
    },
    {
      label: "구분",
      value:
        specData?.modelTypeEm === ModelTypeEm.SAMPLE
          ? "샘플"
          : specData?.modelTypeEm === ModelTypeEm.PRODUCTION
          ? "양산"
          : "-",
      widthType: "half",
    },
    {
      label: "층",
      value: specData?.layerEm?.replace("L", "") ?? "-",
      widthType: "half",
    },
    {
      label: "두께",
      value: specData?.thk ?? "-",
      widthType: "half",
    },
    {
      label: "단위",
      value: specData?.unit?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "재질",
      value: specData?.material?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "외형가공형태",
      value: specData?.aprType?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "동박내층",
      value: specData?.copIn ?? "-",
      widthType: "half",
    },
    {
      label: "동박외층",
      value: specData?.copOut ?? "-",
      widthType: "half",
    },
    {
      label: "S/M 인쇄",
      value: specData?.smPrint?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "M/K 인쇄",
      value: specData?.mkPrint?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "S/M 색상",
      value: specData?.smColor?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "M/K 색상",
      value: specData?.mkColor?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "S/M 종류",
      value: specData?.smType?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "M/K 종류",
      value: specData?.mkType?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "특수인쇄",
      value: specData?.spPrint?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "특수인쇄종류",
      value: specData?.spType?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "도금 두께",
      value: specData?.pltThk ?? "-",
      widthType: "half",
    },
    {
      label: "도금 두께 여유",
      value: specData?.pltAlph ?? "-",
      widthType: "half",
    },
    {
      label: "특별도금(Au)",
      value: specData?.spPltAu ?? "-",
      widthType: "half",
    },
    {
      label: "특별도금여유(Au)",
      value: specData?.spPltAuAlph ?? "-",
      widthType: "half",
    },
    {
      label: "특별도금(Ni)",
      value: specData?.spPltNi ?? "-",
      widthType: "half",
    },
    {
      label: "특별도금여유(Ni)",
      value: specData?.spPltNiAlph ?? "-",
      widthType: "half",
    },
    {
      label: "핀 수",
      value: specData?.pinCnt ?? "-",
      widthType: "half",
    },
    {
      label: "KIT X/Y",
      value:
        specData?.kitW && specData?.kitL
          ? specData?.kitW + "/" + specData?.kitL
          : "-",
      widthType: "half",
    },
    {
      label: "PCS X/Y",
      value:
        specData?.pcsW && specData?.pcsL
          ? specData?.pcsW + "/" + specData?.pcsL
          : "-",
      widthType: "half",
    },
    {
      label: "PNL X/Y",
      value:
        specData?.pnlW && specData?.pnlL
          ? specData?.pnlW + "/" + specData?.pnlL
          : "-",
      widthType: "half",
    },
    {
      label: "kitPcs",
      value: specData?.kitPcs ?? "-",
      widthType: "half",
    },
    {
      label: "pnlKit",
      value: specData?.pnlKit ?? "-",
      widthType: "half",
    },
    {
      label: "sthPcs",
      value: specData?.sthPcs ?? "-",
      widthType: "half",
    },
    {
      label: "sthPnl",
      value: specData?.sthPnl ?? "-",
      widthType: "half",
    },
    {
      label: "브이컷유무",
      value: specData?.vcutYn ?? "-",
      widthType: "half",
    },
    {
      label: "브이컷형태",
      value: specData?.vcutType?.cdNm ?? "-",
      widthType: "half",
    },
    {
      label: "연조KIT",
      value:
        specData?.ykitW && specData?.ykitL
          ? specData?.ykitW + " " + specData?.ykitL
          : "-",
      widthType: "half",
    },
    {
      label: "연조PNL",
      value:
        specData?.ypnlW && specData?.ypnlL
          ? specData?.ypnlW + "/" + specData?.ypnlL
          : "-",
      widthType: "half",
    },
    {
      label: "등록일",
      value: dayjs(specData?.createdAt).format("YYYY-MM-DD HH:ss") ?? "-",
      widthType: "half",
    },
  ];

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
          columns={salesOrderStatusClmn(
            totalData,
            setPartnerData,
            setPartnerMngData,
            pagination,
            setOrderId,
            setSpecData,
            setDrawerModelOpen
          )}
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

      <AntdDrawer
        open={drawerModelOpen}
        close={() => {
          setDrawerModelOpen(false);
          setOrderId("");
        }}
        width={600}
      >
        {orderId && orderId !== "" && (
          <div className="flex flex-col gap-15 p-20 !pr-5">
            <div className="v-between-h-center">
              <p className="text-16 font-medium">고객 발주 정보</p>
              <div
                className="flex justify-end cursor-pointer"
                onClick={() => setDrawerModelOpen(false)}
              >
                <Close />
              </div>
            </div>
            <ModelDrawerContent orderId={orderId} />
          </div>
        )}
        {specData && (
          <div className="flex flex-col gap-15 p-20 !pr-5">
            <div className="v-between-h-center">
              <p className="text-16 font-medium">사양 정보</p>
              <div
                className="flex justify-end cursor-pointer"
                onClick={() => setDrawerModelOpen(false)}
              >
                <Close />
              </div>
            </div>
            <CardList
              items={
                (
                  port === "3000"
                    ? cookie.get("companySY") === "sy"
                    : port === "90"
                )
                  ? [
                      {
                        label: "모델명",
                        value: specData?.prdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "관리No",
                        value: specData?.prdMngNo ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "제조사",
                        value: specData?.mnfNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "REV",
                        value: specData?.prdRevNo ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "두께",
                        value: specData?.thk ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "단위",
                        value: specData?.unit?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "재질",
                        value: specData?.material?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "외형가공형태",
                        value: specData?.aprType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "도금 두께",
                        value: specData?.pltThk ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특수도금",
                        value: specData?.spPltNi ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특수도금여유",
                        value: specData?.spPltNiAlph ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "도장색상",
                        value: specData?.spPrint?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "도장종류",
                        value: specData?.spType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "제품 X/Y",
                        value:
                          specData?.pcsW && specData?.pcsL
                            ? specData?.pcsW + "/" + specData?.pcsL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "브이컷형태",
                        value: specData?.vcutType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "등록일",
                        value:
                          dayjs(specData?.createdAt).format(
                            "YYYY-MM-DD HH:ss"
                          ) ?? "-",
                        widthType: "half",
                      },
                    ]
                  : [
                      {
                        label: "모델명",
                        value: specData?.prdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "관리No",
                        value: specData?.prdMngNo ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "제조사",
                        value: specData?.mnfNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "REV",
                        value: specData?.prdRevNo ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "구분",
                        value:
                          specData?.modelTypeEm === ModelTypeEm.SAMPLE
                            ? "샘플"
                            : specData?.modelTypeEm === ModelTypeEm.PRODUCTION
                            ? "양산"
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "층",
                        value: specData?.layerEm?.replace("L", "") ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "두께",
                        value: specData?.thk ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "단위",
                        value: specData?.unit?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "재질",
                        value: specData?.material?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "외형가공형태",
                        value: specData?.aprType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "동박내층",
                        value: specData?.copIn ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "동박외층",
                        value: specData?.copOut ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "S/M 인쇄",
                        value: specData?.smPrint?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "M/K 인쇄",
                        value: specData?.mkPrint?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "S/M 색상",
                        value: specData?.smColor?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "M/K 색상",
                        value: specData?.mkColor?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "S/M 종류",
                        value: specData?.smType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "M/K 종류",
                        value: specData?.mkType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특수인쇄",
                        value: specData?.spPrint?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특수인쇄종류",
                        value: specData?.spType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "도금 두께",
                        value: specData?.pltThk ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "도금 두께 여유",
                        value: specData?.pltAlph ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특별도금(Au)",
                        value: specData?.spPltAu ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특별도금여유(Au)",
                        value: specData?.spPltAuAlph ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특별도금(Ni)",
                        value: specData?.spPltNi ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "특별도금여유(Ni)",
                        value: specData?.spPltNiAlph ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "핀 수",
                        value: specData?.pinCnt ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "KIT X/Y",
                        value:
                          specData?.kitW && specData?.kitL
                            ? specData?.kitW + "/" + specData?.kitL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "PCS X/Y",
                        value:
                          specData?.pcsW && specData?.pcsL
                            ? specData?.pcsW + "/" + specData?.pcsL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "PNL X/Y",
                        value:
                          specData?.pnlW && specData?.pnlL
                            ? specData?.pnlW + "/" + specData?.pnlL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "kitPcs",
                        value: specData?.kitPcs ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "pnlKit",
                        value: specData?.pnlKit ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "sthPcs",
                        value: specData?.sthPcs ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "sthPnl",
                        value: specData?.sthPnl ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "브이컷유무",
                        value: specData?.vcutYn ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "브이컷형태",
                        value: specData?.vcutType?.cdNm ?? "-",
                        widthType: "half",
                      },
                      {
                        label: "연조KIT",
                        value:
                          specData?.ykitW && specData?.ykitL
                            ? specData?.ykitW + " " + specData?.ykitL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "연조PNL",
                        value:
                          specData?.ypnlW && specData?.ypnlL
                            ? specData?.ypnlW + "/" + specData?.ypnlL
                            : "-",
                        widthType: "half",
                      },
                      {
                        label: "등록일",
                        value:
                          dayjs(specData?.createdAt).format(
                            "YYYY-MM-DD HH:ss"
                          ) ?? "-",
                        widthType: "half",
                      },
                    ]
              }
              title=""
              btnLabel=""
              btnClick={() => {}}
            />
          </div>
        )}
      </AntdDrawer>

      <ToastContainer />
    </>
  );
};

SalesOrderStatusPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="수주 현황">{page}</MainPageLayout>
);

export default SalesOrderStatusPage;
