import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Button, List } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import cookie from "cookiejs";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import { LabelMedium } from "@/components/Text/Label";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";

import { BuyCostOutClmn, BuyCostOutPriceClmn } from "@/data/columns/Buy";
import { useUser } from "@/data/context/UserContext";
import {
  newDataProcessVendorPriceCUType,
  processGroupRType,
  processRType,
  processVendorPriceCUType,
  processVendorPriceReq,
  processVendorPriceRType,
  processVendorRType,
} from "@/data/type/base/process";
import { buyCostOutDetailType, buyCostOutType } from "@/data/type/buy/cost";
import { useMenu } from "@/data/context/MenuContext";

import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import useToast from "@/utils/useToast";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Edit from "@/assets/svg/icons/memo.svg";
import Plus from "@/assets/svg/icons/s_plus_gray.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import dayjs from "dayjs";
import { generateFloorOptions } from "@/data/type/enum";
import { validReq } from "@/utils/valid";
import { selectType } from "@/data/type/componentStyles";
import { port } from "@/pages/_app";

const BuyCostWaitPage: React.FC & {
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
    const clmn = BuyCostOutClmn(totalData, pagination, setOpen, setSelect).map(
      (item) => ({
        title: item.title?.toString() as string,
        dataIndex: item.dataIndex,
        width: Number(item.width ?? item.minWidth ?? 0),
        cellAlign: item.cellAlign,
      })
    );
    if (key === 1) {
      // 엑셀 다운로드
      exportToExcelAndPrint(
        clmn,
        data,
        totalData,
        pagination,
        selectMenu?.menuNm ?? "외주단가등록대기",
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
        selectMenu?.menuNm ?? "외주단가등록대기",
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
  const [data, setData] = useState<Array<buyCostOutType>>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["worksheet/vender-price/jsxcrud/many", pagination, sQueryJson],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d2",
          utype: "tenant/",
          url: "worksheet/vender-price/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
          anykeys: { applyAutoFilterType: "UNMATCH" },
        }
      );
    },
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item: buyCostOutType) => ({
        ...item,
        progress: Math.floor((item?.progress ?? 0) * 100),
      }));
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------- 시작
  // 공정 외주처 단가
  const [prices, setPrices] = useState<processVendorPriceRType[]>([]);
  const { data: queryPriceData, refetch: priceRefetch } = useQuery({
    queryKey: ["process-vendor-price/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "process-vendor-price/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        setPrices(result?.data?.data ?? []);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
      return result;
    },
  });

  // 공정 외주처 데이터
  const [dataVendorSelectList, setDataVendorSelectList] = useState<
    selectType[]
  >([]);
  const { data: queryDataVendor } = useQuery({
    queryKey: ["process-vendor/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "process-vendor/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        const arr = ((result.data?.data as processVendorRType[]) ?? []).map(
          (item) => ({
            value: item.vendor.id,
            label: item.vendor.prtNm ?? "",
          })
        );
        setDataVendorSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  // 공정 그룹 데이터
  const [dataGroupSelectList, setDataGroupSelectList] = useState<selectType[]>(
    []
  );
  const { data: queryDataGroup } = useQuery({
    queryKey: ["process-group/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "process-group/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        const arr = ((result.data?.data as processGroupRType[]) ?? []).map(
          (item) => ({
            value: item.id,
            label: item.prcGrpNm ?? "",
          })
        );
        setDataGroupSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  // 공정 데이터
  const [dataProcessSelectList, setDataProcessSelectList] = useState<
    selectType[]
  >([]);
  const { data: queryDataProcess } = useQuery({
    queryKey: ["process/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "process/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        const arr = ((result.data?.data as processRType[]) ?? []).map(
          (item) => ({
            value: item.id,
            label: item.prcNm ?? "",
          })
        );
        setDataProcessSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------- 필요 데이터 세팅 ------------- 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<buyCostOutType | null>(null);
  const [selectPrice, setSelectPrice] = useState<
    { id: string; processId: string; vendorId: string; value: number }[]
  >([]);

  const [detailData, setDetailData] = useState<buyCostOutDetailType | null>(
    null
  );
  const { data: queryDetailData } = useQuery({
    queryKey: ["worksheet/vender-price/jsxcrud/one", select],
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "core-d2",
          utype: "tenant/",
          url: `worksheet/vender-price/jsxcrud/one/${select?.id}`,
        },
        {
          anykeys: { excludeInternalProc: true },
        }
      );

      if (result.resultCode === "OK_0000") {
        const entity = result.data.data as buyCostOutDetailType;
        let priceArr: {
          id: string;
          processId: string;
          vendorId: string;
          value: number;
        }[] = [];
        entity.procs?.map((item) => {
          if (item.vendorPriceIdxNoForgKey) {
            priceArr.push({
              id: item.vendorPriceIdxNoForgKey,
              processId: item.specPrdGrp?.process?.id ?? "",
              vendorId: item.vendor?.id ?? "",
              value: Number(item.vendorPrice ?? 0),
            });
          }
        });
        setDetailData(entity);
        console.log(priceArr);
        setSelectPrice(priceArr);

        setOpen(true);
      }

      return result;
    },
    enabled: !!select?.id,
  });

  // 값 초기화
  useEffect(() => {
    if (!open) {
      setSelect(null);
      setDetailData(null);
      setSelectPrice([]);
      setTot(0);
    }
  }, [open]);

  const [tot, setTot] = useState<number>(0);
  useEffect(() => {
    let tot = 0;
    selectPrice.map((p) => {
      tot += p.value;
    });
    setTot(tot);
  }, [selectPrice]);
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"success" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  // ------------ 모달창 내 펼침/접힘 ----------- 시작
  // 각 프로세스의 펼침/접힘 상태를 관리하는 state (프로세스 id를 key로 사용)
  const [expandedProcs, setExpandedProcs] = useState<{
    [key: string]: boolean;
  }>({});

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
  const toggleButtonLabel =
    Object.keys(expandedProcs).length > 0 ? "전체 접기" : "전체 펼치기";

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
  // ------------ 모달창 내 펼침/접힘 ----------- 끝

  // ---------------- 비용 저장 --------------- 시작
  const handleSubmit = async () => {
    try {
      if (selectPrice.length < 1) {
        showToast("선택된 단가가 없습니다.", "error");
        return;
      }

      const jsonData = {
        worksheetId: detailData?.id,
        venderPrice: selectPrice.map((item) => ({
          worksheetProcId: detailData?.procs?.find(
            (f) => f.specPrdGrp?.process?.id === item.processId
          )?.id,
          venderPrice: item.value,
          venderPriceIdxNoForgKey: item.id,
        })),
      };
      console.log(JSON.stringify(jsonData));

      const result = await postAPI(
        {
          type: "core-d2",
          utype: "tenant/",
          url: "worksheet/vender-price/default/update-vender-price",
          jsx: "default",
          etc: true,
        },
        jsonData
      );

      if (result.resultCode === "OK_0000") {
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
  };
  // ---------------- 비용 저장 --------------- 끝

  // 신규 등록 모달 입력값 상태
  const [newData, setNewData] = useState<processVendorPriceCUType>(
    newDataProcessVendorPriceCUType
  );
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>([]);

  const handleSubmitNewData = async () => {
    try {
      const val = validReq(newData, processVendorPriceReq());
      if (!val.isValid) {
        showToast(val.missingLabels + "은(는) 필수 입력입니다.", "error");
        return;
      }

      const result = await postAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process-vendor-price",
          jsx: "jsxcrud",
        },
        {
          ...newData,
          process: { id: newData.processIdx },
          processGroup: { id: newData.processGroupIdx },
          vendor: { id: newData.vendorIdx },
          processIdx: undefined,
          processGroupIdx: undefined,
          vendorIdx: undefined,
        }
      );

      if (result.resultCode === "OK_0000") {
        setSettingOpen(false);
        showToast("등록 완료", "success");
        setNewData(newDataProcessVendorPriceCUType);
        priceRefetch();
      } else {
        const msg = result?.response?.data?.message;
        setSettingOpen(false);
        setResultType("error");
        setErrMsg(msg);
        setResultOpen(true);
      }
    } catch (e) {
      setSettingOpen(false);
      showToast("등록 실패", "error");
    }
  };

  const [settingOpen, setSettingOpen] = useState<boolean>(false);

  // 모달 입력 필드 값 변경 핸들러
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: "input" | "select" | "date" | "other",
    key?: string
  ) => {
    if (type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setNewData({ ...newData, [name]: value });
    } else if (type === "select") {
      if (key) {
        setNewData({
          ...newData,
          [name]: {
            ...((newData as any)[name] || {}), // 기존 객체 값 유지
            [key]: e?.toString(), // 새로운 key 값 업데이트
          },
        });
      } else {
        setNewData({ ...newData, [name]: e });
      }
    }
  };

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
          columns={
            (port === "3000" ? cookie.get("companySY") === "sy" : port === "90")
              ? BuyCostOutClmn(
                  totalData,
                  pagination,
                  setOpen,
                  setSelect
                ).filter(
                  (f) =>
                    !f.key?.toString().includes("layerEm") &&
                    !f.key?.toString().includes("sm") &&
                    !f.key?.toString().includes("mk") &&
                    !f.key?.toString().includes("pnlL") &&
                    !f.key?.toString().includes("pnlW") &&
                    !f.key?.toString().includes("kit") &&
                    !f.key?.toString().includes("Kit") &&
                    !f.key?.toString().includes("prdMngNo") &&
                    !f.key?.toString().includes("wkOutCnt") &&
                    !f.key?.toString().includes("board") &&
                    !f.key?.toString().includes("prdCnt") &&
                    !f.key?.toString().includes("sth") &&
                    !f.key?.toString().includes("rein") &&
                    !f.key?.toString().includes("m2")
                )
              : BuyCostOutClmn(totalData, pagination, setOpen, setSelect)
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
        open={open}
        setOpen={setOpen}
        width={1300}
        draggable={true}
        title={"외주처 단가 등록"}
        contents={
          <>
            <div className="w-full h-full p-30 bg-white rounded-14 flex flex-col gap-20">
              <div className="v-between-h-center justify-end">
                <Button onClick={toggleAll}>{toggleButtonLabel}</Button>
                <LabelMedium
                  label={"단가 합계 : " + (tot.toLocaleString() ?? 0) + "원"}
                />
              </div>
              <div className="max-h-[700px] overflow-y-auto flex flex-col gap-20">
                {detailData?.procs?.map((proc, index) => {
                  // 각 프로세스 항목에 고유 id가 있다고 가정 (예: proc.id)
                  const procId = proc.id || index.toString();
                  const isExpanded = expandedProcs[procId];

                  return (
                    <div key={procId}>
                      <div className="v-between-h-center gap-30 mb-10 px-10">
                        <div className="h-center gap-5">
                          <LabelMedium
                            label={
                              (proc.specPrdGrp?.process?.prcNm ?? "") +
                              " (" +
                              (proc?.vendor?.prtNm ?? "") +
                              ")"
                            }
                          />
                          <Button
                            className="v-h-center !p-4 !rounded-50 !borer-1 !border-[#008A1E] !w-23 !h-23"
                            onClick={() => {
                              setAddModalInfoList(
                                MOCK.vendorItems.CUDPopItems.map((item) => {
                                  if (item.name === "processGroupIdx") {
                                    return {
                                      ...item,
                                      option: dataGroupSelectList,
                                      disabled: true,
                                    };
                                  } else if (item.name === "processIdx") {
                                    return {
                                      ...item,
                                      option: dataProcessSelectList,
                                      disabled: true,
                                    };
                                  } else if (item.name === "vendorIdx") {
                                    return {
                                      ...item,
                                      option: dataVendorSelectList,
                                      disabled: true,
                                    };
                                  }
                                  return item;
                                })
                              );
                              setNewData({
                                ...newData,
                                processIdx: proc.specPrdGrp?.process?.id,
                                processGroupIdx:
                                  proc.specPrdGrp?.process?.processGroup?.id,
                                vendorIdx: proc.vendor?.id,
                              });
                              setSettingOpen(true);
                            }}
                          >
                            <p className="w-16 h-16">
                              <Plus />
                            </p>
                          </Button>
                        </div>
                        <DownOutlined
                          className="cursor-pointer"
                          onClick={() => toggleProc(procId)}
                          style={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      {/* 조건부 렌더링: 펼쳐진 경우에만 테이블 표시 */}
                      {isExpanded && (
                        <AntdTableEdit
                          columns={
                            (
                              port === "3000"
                                ? cookie.get("companySY") === "sy"
                                : port === "90"
                            )
                              ? BuyCostOutPriceClmn(
                                  selectPrice,
                                  setSelectPrice,
                                  selectPrice.find(
                                    (f) =>
                                      f.processId ===
                                        proc.specPrdGrp?.process?.id &&
                                      f.vendorId === proc.vendor?.id
                                  )?.id
                                ).filter(
                                  (f) =>
                                    !f.key?.toString().includes("pnlcntMax") &&
                                    !f.key?.toString().includes("m2")
                                )
                              : BuyCostOutPriceClmn(
                                  selectPrice,
                                  setSelectPrice,
                                  selectPrice.find(
                                    (f) =>
                                      f.processId ===
                                        proc.specPrdGrp?.process?.id &&
                                      f.vendorId === proc.vendor?.id
                                  )?.id
                                )
                          }
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
                  style={{ color: "#ffffffE0", backgroundColor: "#4880FF" }}
                  onClick={handleSubmit}
                >
                  <Arrow />
                  저장
                </Button>
              </div>
            </div>
          </>
        }
      />

      <BaseInfoCUDModal
        title={{
          name: `공정 외주처 가격 ${newData.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        data={newData}
        onSubmit={handleSubmitNewData}
        open={settingOpen}
        setOpen={setSettingOpen}
        onClose={() => {
          setSettingOpen(false);
        }}
        onDelete={() => {}}
        items={addModalInfoList}
        handleDataChange={handleDataChange}
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

BuyCostWaitPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="외주처 단가 등록"
    menu={[
      { text: "외주처 단가 등록", link: "/buy/cost/wait" },
      { text: "외주처 단가 현황", link: "/buy/cost/status" },
    ]}
  >
    {page}
  </MainPageLayout>
);

export default BuyCostWaitPage;
