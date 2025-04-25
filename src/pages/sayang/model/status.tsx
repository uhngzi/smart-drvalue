import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { ListPagination } from "@/layouts/Body/Pagination";
import { List } from "@/layouts/Body/List";

import Close from "@/assets/svg/icons/s_close.svg";

import { sayangModelStatusClmn } from "@/data/columns/Sayang";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import PrtDrawer from "@/contents/partner/PrtDrawer";
import { modelsMatchRType, modelsType } from "@/data/type/sayang/models";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import CardList from "@/components/List/CardList";
import ModelDrawerContent from "@/contents/sayang/model/add/ModelDrawerContent";
import { TabSmall } from "@/components/Tab/Tabs";
import { ModelTypeEm } from "@/data/type/enum";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";
import { useMenu } from "@/data/context/MenuContext";

const SayangModelStatPage: React.FC & {
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

  const handlePageMenuClick = (key: number) => {
    const clmn = sayangModelStatusClmn(
      totalData,
      pagination,
      setPartnerData,
      setPartnerMngData,
      setModelDetail
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
        selectMenu?.menuNm ?? "사양모델현황",
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
        selectMenu?.menuNm ?? "사양모델현황",
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
  const [data, setData] = useState<modelsType[]>([]);
  const { data: queryData, isLoading } = useQuery({
    queryKey: ["models/jsxcrud/many", pagination, sQueryJson],
    // queryKey: ['sales-order/jsxcrud/many', pagination],
    queryFn: async () => {
      try {
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
      } catch (e) {
        return;
      }
    },
  });
  useEffect(() => {
    setDataLoading(true);
    if (!isLoading && queryData?.resultCode === "OK_0000") {
      setData(queryData?.data?.data ?? []);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

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

  const [modelDetail, setModelDetail] = useState<modelsType | null>(null);
  const [selectTabDrawer, setSelectTabDrawer] = useState<1 | 2>(1);
  const [modelItem, setModelItem] = useState<any[]>([]);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  useEffect(() => {
    if (modelDetail) {
      setModelOpen(true);
      setModelItem([
        {
          label: "모델명",
          value: modelDetail?.prdNm ?? "-",
          widthType: "half",
        },
        {
          label: "관리No",
          value: modelDetail?.prdMngNo ?? "-",
          widthType: "half",
        },
        {
          label: "제조사",
          value: modelDetail?.mnfNm ?? "-",
          widthType: "half",
        },
        {
          label: "REV",
          value: modelDetail?.prdRevNo ?? "-",
          widthType: "half",
        },
        {
          label: "구분",
          value:
            modelDetail?.modelTypeEm === ModelTypeEm.SAMPLE
              ? "샘플"
              : modelDetail?.modelTypeEm === ModelTypeEm.PRODUCTION
              ? "양산"
              : "-",
          widthType: "half",
        },
        // { label: '원판', value: modelDetail?.board?.cdNm ?? '-', widthType: 'half' },
        {
          label: "층",
          value: modelDetail?.layerEm?.replace("L", "") ?? "-",
          widthType: "half",
        },
        { label: "두께", value: modelDetail?.thk ?? "-", widthType: "half" },
        {
          label: "단위",
          value: modelDetail?.unit?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "재질",
          value: modelDetail?.material?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "외형가공형태",
          value: modelDetail?.aprType?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "동박내층",
          value: modelDetail?.copIn ?? "-",
          widthType: "half",
        },
        {
          label: "동박외층",
          value: modelDetail?.copOut ?? "-",
          widthType: "half",
        },
        {
          label: "S/M 인쇄",
          value: modelDetail?.smPrint?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "M/K 인쇄",
          value: modelDetail?.mkPrint?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "S/M 색상",
          value: modelDetail?.smColor?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "M/K 색상",
          value: modelDetail?.mkColor?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "S/M 종류",
          value: modelDetail?.smType?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "M/K 종류",
          value: modelDetail?.mkType?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "특수인쇄",
          value: modelDetail?.spPrint?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "특수인쇄종류",
          value: modelDetail?.spType?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "도금 두께",
          value: modelDetail?.pltThk ?? "-",
          widthType: "half",
        },
        {
          label: "도금 두께 여유",
          value: modelDetail?.pltAlph ?? "-",
          widthType: "half",
        },
        {
          label: "특별도금(Au)",
          value: modelDetail?.spPltAu ?? "-",
          widthType: "half",
        },
        {
          label: "특별도금여유(Au)",
          value: modelDetail?.spPltAuAlph ?? "-",
          widthType: "half",
        },
        {
          label: "특별도금(Ni)",
          value: modelDetail?.spPltNi ?? "-",
          widthType: "half",
        },
        {
          label: "특별도금여유(Ni)",
          value: modelDetail?.spPltNiAlph ?? "-",
          widthType: "half",
        },
        // { label: '도면번호', value: modelDetail?.drgNo ?? '-', widthType: 'half' },
        {
          label: "핀 수",
          value: modelDetail?.pinCnt ?? "-",
          widthType: "half",
        },
        {
          label: "KIT X/Y",
          value:
            modelDetail?.kitW && modelDetail?.kitL
              ? modelDetail?.kitW + "/" + modelDetail?.kitL
              : "-",
          widthType: "half",
        },
        {
          label: "PCS X/Y",
          value:
            modelDetail?.pcsW && modelDetail?.pcsL
              ? modelDetail?.pcsW + "/" + modelDetail?.pcsL
              : "-",
          widthType: "half",
        },
        {
          label: "PNL X/Y",
          value:
            modelDetail?.pnlW && modelDetail?.pnlL
              ? modelDetail?.pnlW + "/" + modelDetail?.pnlL
              : "-",
          widthType: "half",
        },
        {
          label: "kitPcs",
          value: modelDetail?.kitPcs ?? "-",
          widthType: "half",
        },
        {
          label: "pnlKit",
          value: modelDetail?.pnlKit ?? "-",
          widthType: "half",
        },
        {
          label: "sthPcs",
          value: modelDetail?.sthPcs ?? "-",
          widthType: "half",
        },
        {
          label: "sthPnl",
          value: modelDetail?.sthPnl ?? "-",
          widthType: "half",
        },
        {
          label: "브이컷유무",
          value: modelDetail?.vcutYn ?? "-",
          widthType: "half",
        },
        {
          label: "브이컷형태",
          value: modelDetail?.vcutType?.cdNm ?? "-",
          widthType: "half",
        },
        {
          label: "연조KIT",
          value:
            modelDetail?.ykitW && modelDetail?.ykitL
              ? modelDetail?.ykitW + " " + modelDetail?.ykitL
              : "-",
          widthType: "half",
        },
        {
          label: "연조PNL",
          value:
            modelDetail?.ypnlW && modelDetail?.ypnlL
              ? modelDetail?.ypnlW + "/" + modelDetail?.ypnlL
              : "-",
          widthType: "half",
        },
        {
          label: "등록일",
          value:
            dayjs(modelDetail?.createdAt).format("YYYY-MM-DD HH:ss") ?? "-",
          widthType: "half",
        },
      ]);
    }
  }, [modelDetail]);

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
          columns={sayangModelStatusClmn(
            totalData,
            pagination,
            setPartnerData,
            setPartnerMngData,
            setModelDetail
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
      />

      <AntdDrawer
        open={modelOpen}
        close={() => {
          setModelOpen(false);
          setModelDetail(null);
        }}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div
            className="flex justify-end cursor-pointer"
            onClick={() => {
              setModelOpen(false);
              setModelDetail(null);
            }}
          >
            <Close />
          </div>
          {/* <div className="v-between-h-center">
          <TabSmall
            items={[
              {key:1,text:'고객 발주 정보'},
              {key:2,text:'모델 정보'},
            ]}
            selectKey={selectTabDrawer}
            setSelectKey={setSelectTabDrawer}
          />
          <div className="flex justify-end cursor-pointer" onClick={() => setModelOpen(false)}><Close/></div>
        </div>
        { selectTabDrawer === 1 &&
          <ModelDrawerContent orderId={modelDetail?.orderModel?.order.id} />
        }
        {
          selectTabDrawer === 2 &&
          ( modelItem.length > 0 ? */}
          <CardList title="모델 정보" items={modelItem} />
          {/* :
            <div className="w-full h-[300px] v-h-center flex-col p-20">
              <InboxOutlined style={{ fontSize: 50, color: "#aaa" }} />
              폐기되었거나 등록 전인 모델입니다.
            </div>
          )
        } */}
        </div>
      </AntdDrawer>
      <ToastContainer />
    </>
  );
};

SayangModelStatPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="모델 확정 및 현황"
    menu={[
      { text: "모델 확정", link: "/sayang/model/confirm" },
      { text: "모델 현황", link: "/sayang/model/status" },
    ]}
  >
    {page}
  </MainPageLayout>
);

export default SayangModelStatPage;
