import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

// React 및 라이브러리 훅
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useBase } from "@/data/context/BaseContext";
import dayjs from "dayjs";

// API 모듈
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

// 공통 컴포넌트
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";

// 유틸
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { MOCK } from "@/utils/Mock";

// 타입 정의
import { apiGetResponseType } from "@/data/type/apiResponse";
import { selectType } from "@/data/type/componentStyles";
import { processRType } from "@/data/type/base/process";
import {
  unitSpecialType,
  unitSpecialCUType,
  setUnitSpecialType,
  setUnitSpecialCUType,
  newUnitSpecialCUType,
  unitSpecialReq,
  unitSpecialApplyType,
} from "@/data/type/base/special";

// 아이콘
import Bag from "@/assets/svg/icons/bag.svg";
import { Radio, Spin } from "antd";

const BuyUnitSpecialListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;
  const { unitSelectList } = useBase();
  const { showToast, ToastContainer } = useToast();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // ------------- 공정 데이터 세팅 ----------- 시작
  const [dataProcess, setDataProcess] = useState<processRType[]>([]);
  const { data: prcQueryData } = useQuery({
    queryKey: ["process/jsxcrud/many"],
    queryFn: async () => {
      setDataProcess([]);

      // 공정 데이터 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        setDataProcess(result.data?.data ?? []);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  // 공정 데이터를 [0: {value: '', label: ''}, ... ] 형태로 변환
  const dataProcessList = Object.keys(dataProcess).map((key) => {
    const item = dataProcess[key as keyof typeof dataProcess] as processRType;
    return {
      value: item.id,
      label: item.prcNm,
    };
  });

  const memoDataProcessList = useMemo(
    () => dataProcessList,
    [JSON.stringify(dataProcessList)]
  );
  // ------------ 공정 데이터 세팅 ------------ 끝

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<unitSpecialType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["special-specifications/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);

      // 특별사양 리스트 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "special-specifications/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          anykeys: { id: type },
        }
      );

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
      } else {
        console.log("error:", result.response);
      }

      setDataLoading(false);
      return result;
    },
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>("info");
  const [resultTitle, setResultTitle] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }
  //등록 모달창을 위한 변수
  const [newOpen, setNewOpen] = useState<boolean>(false);
  //등록 모달창 데이터
  const [newData, setNewData] =
    useState<unitSpecialCUType>(newUnitSpecialCUType);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.unitSpecialItems.CUDPopItems
  );

  //값 변경 함수
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
  //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    try {
      const val = validReq(data, unitSpecialReq());
      if (!val.isValid) {
        showToast(`${val.missingLabels}은(는) 필수 입력입니다.`, "error");
        return;
      }

      if (data?.id) {
        const id = data.id;
        delete data.id;

        // 적용일이 오늘 또는 이전인지 확인
        const isPastOrToday =
          dayjs(newData.appOriginDt).isBefore(dayjs(), "day") ||
          dayjs(newData.appOriginDt).isSame(dayjs(), "day");

        // 적용일이 지났으면 가격만 업데이트
        const patchData = isPastOrToday
          ? {
              addCost: newData.addCost,
              appDt: newData.applyAppDt,
            }
          : {
              ...data,
              process: {
                id: data.process,
              },
              unit: {
                id: data.unit,
              },
            };

        // 필요없는 필드 제거
        delete patchData.id;
        delete patchData.applyAppDt;
        delete patchData.applyPrice;
        delete patchData.appOriginDt;

        // 특별사양 수정
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "special-specifications",
            jsx: "jsxcrud",
          },
          id,
          {
            ...patchData,
            weight: Number(data.weight) * 0.01, // 가중치(추가 비율) 수정 시 백분율 -> 소수점 변환
          }
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultFunc(
            "success",
            "특별사양 수정 성공",
            "특별사양 수정이 완료되었습니다."
          );
        } else {
          setNewOpen(false);

          setResultFunc(
            "error",
            "특별사양 수정 실패",
            "특별사양 수정을 실패하였습니다."
          );
        }
      } else {
        // 특별사양 등록
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "special-specifications",
            jsx: "jsxcrud",
          },
          {
            ...newData,
            weight: Number(newData.weight) * 0.01, // 가중치(추가 비율) 등록 시 백분율 -> 소수점 변환
            process: {
              id: newData.process,
            },
            unit: {
              id: newData.unit,
            },
          }
        );

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultFunc(
            "success",
            "특별사양 등록 성공",
            "특별사양 등록이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "특별사양 등록 실패",
            "특별사양 등록을 실패하였습니다."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc(
        "error",
        "특별사양 등록 실패",
        "특별사양 등록을 실패하였습니다."
      );
    }
  };
  // ----------- 신규 데이터 끝 -----------

  // ----------- 단가 적용일, 예정 단가 데이터 시작 -----------
  // apply 데이터
  const [applyData, setApplyData] = useState<unitSpecialApplyType[]>([]);

  const fetchApplyData = async (targetId: string) => {
    const result = await getAPI({
      type: "core-d2",
      utype: "tenant/",
      url: `cbiz-apply-price-data/default/one/SPECIAL_SPECIFICATIONS/${targetId}`,
    });

    if (result.resultCode === "OK_0000") {
      setApplyData(result.data?.data ?? []);
      console.log("applydata:", result.data?.data);
    } else {
      console.log("error:", result.response);
    }

    return result;
  };

  const handleEditClick = async (record: unitSpecialCUType) => {
    const applyDataResult = await fetchApplyData(record.id ?? "");
    const converted = setUnitSpecialCUType(record);

    // 기본값으로 현재 단가 설정
    let currentData = {
      ...converted,
      weight: parseFloat((Number(record.weight) * 100).toFixed(1)), // 가중치(추가 비율) -> 백분율 형태로 보여줌
      applyPrice: record.addCost, // 기본값으로 현재 단가 설정
    };

    if (applyDataResult.resultCode === "OK_0000") {
      const applyData = applyDataResult.data;
      const applyDate = dayjs(applyData.applyDate);
      const today = dayjs();

      // 단가적용일이 오늘이거나 과거면 적용단가 정보 설정
      if (applyDate.isBefore(today, "day") || applyDate.isSame(today, "day")) {
        currentData = {
          ...currentData,
          applyPrice: applyData.price ?? record.addCost, // 예정 단가로 설정
        };
      }

      if (applyDataResult.resultCode === "OK_0000") {
        const applyData = applyDataResult.data;

        currentData = {
          ...currentData,
          applyPrice: applyData.mapping?.price ?? record.addCost,
          applyAppDt: applyData.applyDate ?? record.appDt, // 직접 넣어줘야 함
        };
      }
    }

    setNewData(currentData);

    const today = dayjs();
    // 적용일 기준으로 다른 모달 아이템 표시
    if (
      record.appDt &&
      (dayjs(record.appDt).isSame(today, "day") ||
        dayjs(record.appDt).isBefore(today, "day"))
    ) {
      // 과거/오늘이면 적용단가 수정 폼 (적용가격만 수정 가능)
      const applyItems = getUpdatedCUDPopItems(
        MOCK.applyUnitSpecialItems.CUDPopItems
      );
      setAddModalInfoList(applyItems);
    } else {
      // 미래면 기본 폼 (모든 필드 수정 가능)
      const standardItems = getUpdatedCUDPopItems(
        MOCK.unitSpecialItems.CUDPopItems
      );
      setAddModalInfoList(standardItems);
    }

    setNewOpen(true);
  };

  // 적용일이 지난 경우 가격만 수정 불가능하도록 처리
  const getUpdatedCUDPopItems = (items = addModalInfoList) => {
    return items.map((item) => {
      let disabled = false;

      if (
        newData.id &&
        newData.appDt &&
        dayjs(newData.appDt).isValid() &&
        (dayjs(newData.appDt).isBefore(dayjs(), "day") ||
          dayjs(newData.appDt).isSame(dayjs(), "day"))
      ) {
        if (item.name !== "addCost" && item.name !== "applyAppDt") {
          disabled = true;
        }
      }

      if (item.name === "unit") {
        return {
          key: "id",
          ...item,
          option: unitSelectList,
          disabled,
        };
      }

      if (item.name === "process") {
        return {
          key: "id",
          ...item,
          option: memoDataProcessList,
          disabled,
        };
      }

      return { ...item, disabled };
    });
  };

  useEffect(() => {
    setAddModalInfoList(getUpdatedCUDPopItems());
  }, [data, newData.appDt, newData.id]);

  // ----------- 단가 적용일, 예정 단가 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      // 특별사양 삭제
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "special-specifications",
          jsx: "jsxcrud",
        },
        id
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setNewOpen(false);
        setResultFunc(
          "success",
          "삭제 성공",
          "특별사양 삭제가 완료되었습니다."
        );
      } else {
        setNewOpen(false);
        setResultFunc("error", "삭제 실패", "특별사양 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "삭제 실패", "특별사양 삭제를 실패하였습니다.");
    }
  };

  function modalClose() {
    setNewOpen(false);
    setNewData(newUnitSpecialCUType);
  }

  // modal의 공정 및 단위 리스트 갱신
  useEffect(() => {
    if (!newData.id) {
      const updatedItems = MOCK.unitSpecialItems.CUDPopItems.map((item) => {
        let disabled = false;

        if (item.name === "unit") {
          return {
            key: "id",
            ...item,
            option: unitSelectList,
            disabled,
          };
        }

        if (item.name === "process") {
          return {
            key: "id",
            ...item,
            option: memoDataProcessList,
            disabled,
          };
        }

        return { ...item, disabled };
      });

      setAddModalInfoList(updatedItems);
    }
  }, [newData, unitSelectList, memoDataProcessList]);

  return (
    <>
      {dataLoading && (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {!dataLoading && (
        <>
          <div className="v-between-h-center pb-20">
            <div className="flex gap-10">
              <p>총 {totalData}건</p>
            </div>
            <div
              className="w-56 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
              onClick={() => {
                setNewOpen(true);
                setNewData(newUnitSpecialCUType());
                setAddModalInfoList(MOCK.unitSpecialItems.CUDPopItems);
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
                dataIndex: "id",
                render: (_: any, __: any, index: number) =>
                  totalData -
                  ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
                align: "center",
              },
              {
                title: "공정",
                width: 130,
                dataIndex: "process",
                key: "process",
                align: "center",
                render: (_, record) => (
                  <div
                    className="w-full h-full h-center justify-center cursor-pointer reference-detail"
                    onClick={() => {
                      handleEditClick(record);
                    }}
                  >
                    {record.process?.prcNm}
                  </div>
                ),
              },
              {
                title: "추가 비율(%)",
                width: 130,
                dataIndex: "weight",
                key: "weight",
                align: "center",
                render: (value: number) => (
                  <div>
                    {parseFloat((value * 100).toFixed(1))}
                    {/* 가중치(추가 비율) -> 백분율 형태로 보여줌 */}
                  </div>
                ),
              },
              {
                title: "최소 범위",
                width: 130,
                dataIndex: "minRange",
                key: "minRange",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "최대 범위",
                width: 130,
                dataIndex: "maxRange",
                key: "maxRange",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "현재 단가",
                width: 130,
                dataIndex: "addCost",
                key: "addCost",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "단위",
                width: 130,
                dataIndex: "unit",
                key: "unit",
                align: "center",
                render: (_, record) => (
                  <div className="w-full h-full h-center justify-center cursor-pointer">
                    {record.unit?.cdNm}
                  </div>
                ),
              },
              {
                title: "초기 적용일",
                width: 130,
                dataIndex: "appDt",
                key: "appDt",
                align: "center",
              },
              {
                title: "비고",
                width: 130,
                dataIndex: "remark",
                key: "remark",
                align: "center",
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
        </>
      )}

      <BaseInfoCUDModal
        title={{
          name: `특별사양 ${newData?.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        open={newOpen}
        setOpen={setNewOpen}
        onClose={() => modalClose()}
        items={addModalInfoList}
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}
        handleDataChange={handleDataChange}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType}
        onOk={() => {
          refetch();
          setResultOpen(false);
          setNewData(newUnitSpecialCUType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  );
};

BuyUnitSpecialListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    styles={{ pd: "70px" }}
    menu={[
      { text: "모델 단가", link: "/setting/buy/unit/model" },
      { text: "추가비용(두께)", link: "/setting/buy/unit/thickness" },
      { text: "재질", link: "/setting/buy/unit/texture" },
      { text: "특별사양", link: "/setting/buy/unit/special" },
    ]}
  >
    {page}
  </SettingPageLayout>
);

export default BuyUnitSpecialListPage;
