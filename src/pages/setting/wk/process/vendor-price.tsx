// React 및 라이브러리 훅
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

// API 모듈
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

// 타입 정의
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  newDataProcessVendorCUType,
  newDataProcessVendorPriceCUType,
  processGroupRType,
  processRType,
  processVendorCUType,
  processVendorPriceCUType,
  processVendorPriceReq,
  processVendorRType,
} from "@/data/type/base/process";
import { partnerRType } from "@/data/type/base/partner";
import { generateFloorOptions, LayerEm, ModelTypeEm } from "@/data/type/enum";

// 레이아웃
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

// 공통 컴포넌트
import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";

// 콘텐츠 영역
import AddContents from "@/contents/base/wk/process/vendor/AddContents";

// 유틸
import useToast from "@/utils/useToast";
import { MOCK } from "@/utils/Mock";
import { validReq } from "@/utils/valid";

// 아이콘
import Bag from "@/assets/svg/icons/bag.svg";
import { Spin } from "antd";
import CustomTreeUsed from "@/components/Tree/CustomTreeUsed";
import { treeType } from "@/data/type/componentStyles";
import { port } from "@/pages/_app";
import cookie from "cookiejs";

const WkProcessVendorPriceListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  // 신규 등록 모달 입력값 상태
  const [newData, setNewData] = useState<processVendorPriceCUType>(
    newDataProcessVendorPriceCUType
  );
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    (port === "3000" ? cookie.get("companySY") === "sy" : port === "90")
      ? MOCK.vendorItems.CUDPopItems.filter(
          (f) =>
            !f.name.includes("layerEm") &&
            !f.name.includes("modelTypeEm") &&
            !f.name.includes("pnl") &&
            !f.name.includes("hole")
        )
      : MOCK.vendorItems.CUDPopItems
  );
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 필요 데이터 시작 ----------
  const [dataGroup, setDataGroup] = useState<processGroupRType[]>([]);
  const [dataProcess, setDataProcess] = useState<processRType[]>([]);
  const [treeData, setTreeData] = useState<treeType[]>([]);
  const { data: queryTreeData } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-group/jsxcrud/many"],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process-group/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        let parr: processRType[] = [];
        const arr = (result.data?.data ?? []).map(
          (group: processGroupRType) => ({
            id: group.id,
            label: group.prcGrpNm,
            children: group.processes
              .sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0))
              .map((process: processRType) => {
                parr.push({
                  ...process,
                  processGroup: {
                    id: group.id,
                    prcGrpNm: group.prcGrpNm,
                    useYn: group.useYn,
                  },
                });
                return {
                  id: process.id,
                  label: process.prcNm,
                  wipPrcNm: process.wipPrcNm,
                  isInternal: process.isInternal,
                };
              }),
            open: true,
          })
        );
        setDataGroup(result.data?.data ?? []);
        setDataProcess(parr);
        setTreeData(arr);
      } else {
        console.log("error:", result.response);
      }
      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  //외주처
  const [dataVendor, setDataVendor] = useState<Array<processVendorRType>>([]);
  const { data: queryDataVendor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-vendor/jsxcrud/many"],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process-vendor/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        setDataVendor(result.data?.data ?? []);
        console.log("vendor : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ---------- 필요 데이터 끝 -----------

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<processVendorRType>>([]);
  const [childCheckId, setChildCheckId] = useState<string | null>(null);
  const [parentsCheckId, setParentsCheckId] = useState<string | null>(null);
  useEffect(() => {
    if (childCheckId == null) {
      setData([]);
    }
  }, [childCheckId]);
  const { refetch: refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: [
      "process-vendor-price/jsxcrud/many",
      pagination.current,
      childCheckId,
    ],
    queryFn: async () => {
      setData([]);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: `process-vendor-price/jsxcrud/many`,
        },
        {
          page: pagination.current,
          limit: pagination.size,
          sort: "ordNo,ASC",
          anykeys: { prcIdx: childCheckId },
        }
      );

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
        console.log("data : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: !!childCheckId, // childCheckId가 있을 때만 쿼리 실행
  });
  // const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
  //   queryKey: ["process-vendor-price/jsxcrud/many", pagination.current],
  //   queryFn: async () => {
  //     setDataLoading(true);
  //     setData([]);
  //     const result = await getAPI(
  //       {
  //         type: "baseinfo",
  //         utype: "tenant/",
  //         url: "process-vendor-price/jsxcrud/many",
  //       },
  //       {
  //         limit: pagination.size,
  //         page: pagination.current,
  //       }
  //     );

  //     if (result.resultCode === "OK_0000") {
  //       setData(result.data?.data ?? []);
  //       setTotalData(result.data?.total ?? 0);
  //       console.log("data : ", result.data?.data);
  //     } else {
  //       console.log("error:", result.response);
  //     }
  //     setDataLoading(false);
  //     return result;
  //   },
  // });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
  // 등록/수정 결과 알림 모달 상태
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>("info");
  const [errMsg, setErrMsg] = useState<string>("");
  //등록 모달창을 위한 변수
  const [newOpen, setNewOpen] = useState<boolean>(false);
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
        // 공정그룹이 바뀌었을 때 관련 종속 값들 초기화
        if (name === "processGroupIdx") {
          setNewData({
            ...newData,
            processIdx: undefined,
            vendorIdx: undefined,
          });
        } else if (name === "processIdx") {
          // 공정이 바뀌면 외주처 초기화
          setNewData({
            ...newData,
            vendorIdx: undefined,
          });
        } else {
          setNewData({ ...newData, [name]: e });
        }
      }
    }
  };

  const { showToast, ToastContainer } = useToast();

  //수정하기 위한 데이터 셋팅
  function setDataProcessVendorPriceType(
    record: any
  ): processVendorPriceCUType {
    return {
      id: record.id,
      process: record.process,
      processGroup: record.processGroup,
      vendor: record.vendor,
      processIdx: record.process.id,
      processGroupIdx: record.processGroup.id,
      vendorIdx: record.vendor.id,
      priceNm: record.priceNm,
      priceUnit: record.priceUnit,
      modelTypeEm: record.modelTypeEm,
      layerEm: record.layerEm,
      thk: record.thk,
      pnlcntMin: record.pnlcntMin,
      pnlcntMax: record.pnlcntMax,
      holecntMin: record.holecntMin,
      holecntMax: record.holecntMax,
      m2Min: record.m2Min,
      m2Max: record.m2Max,
      matCd: record.matCd,
      metCd: record.metCd,
      wgtMin: record.wgtMin,
      wgtMax: record.wgtMax,
      cntMin: record.cntMin,
      cntMax: record.cntMax,
      appDt: record.appDt,
      useYn: record.useYn,
      appOriginDt: record.appDt,
    };
  }

  // 신규 데이터 초기화 함수
  const [actionType, setActionType] = useState<"등록" | "수정" | "삭제">(
    "등록"
  );
  const handleSubmitNewData = async () => {
    try {
      const val = validReq(newData, processVendorPriceReq());
      if (!val.isValid) {
        showToast(val.missingLabels + "은(는) 필수 입력입니다.", "error");
        return;
      }

      console.log(newData);
      if (newData.id) {
        setActionType("수정");
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "process-vendor-price",
            jsx: "jsxcrud",
          },
          newData.id,
          newData.appOriginDt && dayjs(newData.appOriginDt) <= dayjs()
            ? {
                priceUnit: newData.priceUnit,
              }
            : {
                ...newData,
                id: undefined,
                process: { id: newData.processIdx },
                processGroup: { id: newData.processGroupIdx },
                vendor: { id: newData.vendorIdx },
                processIdx: undefined,
                processGroupIdx: undefined,
                vendorIdx: undefined,
                appDt: newData.appDt
                  ? dayjs(newData.appDt).format("YYYY-MM-DD")
                  : dayjs().format("YYYY-MM-DD"),
              }
        );

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultOpen(true);
          setResultType("success");
          setNewData(newDataProcessVendorPriceCUType);
        } else {
          const msg = result?.response?.data?.message;
          setNewOpen(false);
          setResultType("error");
          setErrMsg(msg);
          setResultOpen(true);
        }
      } else {
        setActionType("등록");
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
          setNewOpen(false);
          setResultOpen(true);
          setResultType("success");
          setNewData(newDataProcessVendorPriceCUType);
        } else {
          const msg = result?.response?.data?.message;
          setNewOpen(false);
          setResultType("error");
          setErrMsg(msg);
          setResultOpen(true);
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType("error");
    }
  };

  // 삭제 버튼 함수
  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process-vendor-price",
          jsx: "jsxcrud",
        },
        id
      );

      if (result.resultCode === "OK_0000") {
        setActionType("삭제");
        setResultType("success");
        refetch();
      } else {
        const msg = result?.response?.data?.message;
        setNewOpen(false);
        setResultType("error");
        setErrMsg(msg);
        setResultOpen(true);
      }
      setResultOpen(true);
      setNewOpen(false);
    } catch (e) {
      setResultType("error");
      setResultOpen(true);
      setNewOpen(false);
    }
  };
  // ----------- 신규 데이터 끝 -----------

  // 수정할때마다 옵션을 업데이트
  const getUpdatedCUDPopItems = () => {
    return MOCK.vendorItems.CUDPopItems.map((item) => {
      let disabled = false;
      if (
        newData.id &&
        dayjs(newData.appDt) <= dayjs() &&
        item.name !== "priceUnit"
      ) {
        // 적용일이 지났으면 가격을 제외한 모든 필드 disabled 처리
        disabled = true;
      }

      if (item.name === "processGroupIdx") {
        return {
          key: "id",
          ...item,
          option: dataGroup.map((group) => ({
            value: group.id,
            label: group.prcGrpNm,
          })),
          disabled: disabled,
        };
      }

      if (item.name === "processIdx") {
        const groupId = newData?.processGroupIdx;

        const option = groupId
          ? dataProcess
              .filter((p) => String(p?.processGroup?.id) === String(groupId))
              .map((p) => ({ value: p.id, label: p.prcNm }))
          : dataProcess.map((p) => ({ value: p.id, label: p.prcNm }));

        return {
          ...item,
          key: "id",
          option,
          disabled: disabled,
        };
      }

      if (item.name === "vendorIdx") {
        const procId = newData?.processIdx;
        const filteredVendors = dataVendor.filter(
          (v) => String(v.process?.id) === String(procId)
        );

        return {
          ...item,
          key: "id",
          option: filteredVendors.map((v) => ({
            value: v.vendor.id,
            label: v.vendor.prtNm,
          })),
          disabled: disabled,
        };
      }

      if (item.name === "layerEm") {
        return {
          ...item,
          key: "id",
          option: generateFloorOptions(),
          disabled: disabled,
        };
      }

      return {
        ...item,
        disabled: disabled,
      };
    });
  };

  // 의존성 중 하나라도 바뀌면 옵션 리스트 갱신
  useEffect(() => {
    if (!dataGroup || !dataProcess || !dataVendor) return;

    const updatedItems = getUpdatedCUDPopItems();
    setAddModalInfoList(
      (port === "3000" ? cookie.get("companySY") === "sy" : port === "90")
        ? updatedItems.filter(
            (f) =>
              !f.name.includes("layerEm") &&
              !f.name.includes("modelTypeEm") &&
              !f.name.includes("pnl") &&
              !f.name.includes("hole")
          )
        : updatedItems
    );
  }, [dataGroup, dataProcess, dataVendor, newData]);

  function handleSelect(id: string) {
    const select = dataProcess.find((f) => f.id === id);
    console.log(select);
    setChildCheckId(select?.id ?? null);
    setParentsCheckId(select?.processGroup?.id ?? null);
    // const selectId = id;
    // setChildCheckId((prev) => (prev === selectId ? null : selectId));
  }

  return (
    <>
      {dataLoading && (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {!dataLoading && (
        <div className="w-full flex gap-30">
          <div
            className="w-[30%] h-[calc(100vh-210px)] rounded-14 p-20"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <CustomTreeUsed
              data={treeData}
              isSelect={true}
              selectId={childCheckId}
              setSelectId={handleSelect}
            />
          </div>
          <div className="w-[850px] flex flex-col gap-15">
            <div className="v-between-h-center pb-10">
              <p>총 {totalData}건</p>
              <div
                className="w-80 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
                onClick={() => {
                  setNewOpen(true);
                  setNewData(
                    childCheckId
                      ? ({
                          ...newDataProcessVendorPriceCUType,
                          modelTypeEm: ModelTypeEm.SAMPLE,
                          layerEm: LayerEm.L1,
                          useYn: true,
                          appDt: dayjs(),
                          processGroupIdx: parentsCheckId,
                          processIdx: childCheckId,
                        } as processVendorPriceCUType)
                      : ({
                          ...newDataProcessVendorPriceCUType,
                          modelTypeEm: ModelTypeEm.SAMPLE,
                          layerEm: LayerEm.L1,
                          useYn: true,
                          appDt: dayjs(),
                        } as processVendorPriceCUType)
                  );
                }}
              >
                등록
              </div>
            </div>
            <AntdTable
              columns={[
                {
                  title: "No",
                  width: 50,
                  dataIndex: "no",
                  render: (_: any, __: any, index: number) =>
                    totalData -
                    ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
                  align: "center",
                },
                {
                  title: "공정그룹명",
                  dataIndex: "processGroup",
                  key: "processGroup",
                  align: "center",
                  render: (item: processGroupRType) => item.prcGrpNm,
                },
                {
                  title: "공정명",
                  dataIndex: "process",
                  key: "process",
                  align: "center",
                  render: (item: processRType) => item.prcNm,
                },
                {
                  title: "외주처명",
                  dataIndex: "vendor",
                  key: "vendor",
                  align: "center",
                  render: (item: partnerRType) => item.prtNm,
                },
                {
                  title: "가격명",
                  dataIndex: "priceNm",
                  key: "priceNm",
                  align: "center",
                  render: (_: any, record: any) => (
                    <div
                      className="cursor-pointer reference-detail"
                      onClick={() => {
                        setNewData(setDataProcessVendorPriceType(record));
                        setNewOpen(true);
                      }}
                    >
                      {record.priceNm}
                    </div>
                  ),
                },
                {
                  title: "가격",
                  dataIndex: "priceUnit",
                  key: "priceUnit",
                  align: "center",
                },
                {
                  title: "제품유형",
                  dataIndex: "modelTypeEm",
                  key: "modelTypeEm",
                  align: "center",
                  render: (item: string) =>
                    item === "sample" ? "샘플" : "양산",
                },
                {
                  title: "사용여부",
                  width: 130,
                  dataIndex: "useYn",
                  key: "useYn",
                  align: "center",
                  render: (value: boolean) => (value ? "사용" : "미사용"),
                },
              ]}
              data={data}
            />

            <div className="w-full h-100 h-center justify-end">
              <AntdSettingPagination
                current={pagination.current}
                total={totalData}
                size={pagination.size}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}

      <BaseInfoCUDModal
        title={{
          name: `공정 외주처 가격 ${newData.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        data={newData}
        onSubmit={handleSubmitNewData}
        setOpen={setNewOpen}
        open={newOpen}
        onClose={() => {
          setNewOpen(false);
        }}
        onDelete={() => handleDataDelete(newData.id ?? "")}
        items={addModalInfoList}
        handleDataChange={handleDataChange}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "success"
            ? `공정 외주처 가격 ${actionType} 성공`
            : `공정 외주처 가격 ${actionType} 실패`
        }
        contents={
          resultType === "success" ? (
            <div>공정 외주처 가격 {actionType}이 완료되었습니다.</div>
          ) : (
            <div>공정 외주처 가격 {actionType}에 실패하였습니다.</div>
          )
        }
        type={resultType}
        onOk={() => {
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

WkProcessVendorPriceListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    menu={[
      { text: "공정", link: "/setting/wk/process/list" },
      { text: "공정 외주처", link: "/setting/wk/process/vendor" },
      { text: "공정 외주처 가격", link: "/setting/wk/process/vendor-price" },
    ]}
  >
    {page}
  </SettingPageLayout>
);

export default WkProcessVendorPriceListPage;
