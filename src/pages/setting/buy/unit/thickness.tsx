import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

// React 및 라이브러리 훅
import { useEffect, useState } from "react";
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
import { LayerEm } from "@/data/type/enum";
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  unitThicknessType,
  unitThicknessCUType,
  setUnitThicknessType,
  setUnitThicknessCUType,
  newUnitThicknessCUType,
  unitThicknessApplyType,
  unitThicknessReq,
} from "@/data/type/base/thickness";

// 아이콘
import Bag from "@/assets/svg/icons/bag.svg";
import { Radio, Spin } from "antd";

const BuyUnitThicknessListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;
  const { metarialSelectList } = useBase();
  const { showToast, ToastContainer } = useToast();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });

  // 레이어 유형 enum을 [0: {value: 'L1', label: 'L1'}, ... ] 형태로 변환
  const layerEmList = Object.keys(LayerEm).map((key) => ({
    value: key,
    label: LayerEm[key as keyof typeof LayerEm],
  }));

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<unitThicknessType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["add-thickness-price/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);

      // 두께 리스트 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "add-thickness-price/jsxcrud/many",
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
  const [newData, setNewData] = useState<unitThicknessCUType>(
    newUnitThicknessCUType
  );
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.unitThicknessItems.CUDPopItems
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
      const val = validReq(data, unitThicknessReq());
      if (!val.isValid) {
        showToast(`${val.missingLabels}은(는) 필수 입력입니다.`, "error");
        return;
      }

      if (data?.id) {
        const id = data.id;

        // 적용일이 오늘 또는 이전인지 확인
        const isPastOrToday =
          data.appOriginDt &&
          dayjs(data.appOriginDt).isValid() &&
          (dayjs(data.appOriginDt).isBefore(dayjs(), "day") ||
            dayjs(data.appOriginDt).isSame(dayjs(), "day"));

        // 적용일이 지났으면 가격만 업데이트
        const patchData = isPastOrToday
          ? {
              addCost: data.addCost,
              appDt: data.applyAppDt,
            }
          : data;

        // 필요없는 필드 제거
        delete patchData.id;
        delete patchData.applyAppDt;
        delete patchData.applyPrice;
        delete patchData.appOriginDt;

        // 두께 수정
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "add-thickness-price",
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
          setNewData(newUnitThicknessCUType());
          setResultFunc(
            "success",
            "두께 수정 성공",
            "두께 수정이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "두께 수정 실패",
            "두께 수정을 실패하였습니다."
          );
        }
      } else {
        // 두께 등록
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "add-thickness-price",
            jsx: "jsxcrud",
          },
          {
            ...newData,
            weight: Number(newData.weight) * 0.01, // 가중치(추가 비율) 등록 시 백분율 -> 소수점 변환
          }
        );

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultFunc(
            "success",
            "두께 등록 성공",
            "두께 등록이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "두께 등록 실패",
            "두께 등록을 실패하였습니다."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "두께 등록 실패", "두께 등록을 실패하였습니다.");
    }
  };
  // ----------- 신규 데이터 끝 -----------

  // ----------- 단가 적용일, 예정 단가 데이터 시작 -----------
  // apply 데이터
  const [applyData, setApplyData] = useState<unitThicknessApplyType[]>([]);

  const convertCUType = (record: unitThicknessType): unitThicknessCUType => ({
    id: record.id,
    layerEm: record.layerEm,
    minThickness: record.minThickness,
    maxThickness: record.maxThickness,
    addCost: record.addCost,
    weight: record.weight,
    ordNo: record.ordNo,
    useYn: record.useYn,
    remark: record.remark,
    appDt: record.appDt,
    appOriginDt: record.appDt,
    applyAppDt: record.appDt,
    applyPrice: record.addCost,
  });

  const fetchApplyData = async (targetId: string) => {
    const result = await getAPI({
      type: "core-d2",
      utype: "tenant/",
      url: `cbiz-apply-price-data/default/one/ADD_THICKNESS_PRICE/${targetId}`,
    });

    if (result.resultCode === "OK_0000") {
      setApplyData(result.data?.data ?? []);
      console.log("applydata:", result.data?.data);
    } else {
      console.log("error:", result.response);
    }

    return result;
  };

  const handleEditClick = async (record: unitThicknessCUType) => {
    const applyDataResult = await fetchApplyData(record.id ?? "");
    const converted = convertCUType(record);
    console.log("!!!!!", converted);
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
        MOCK.applyUnitThicknessItems.CUDPopItems
      );
      setAddModalInfoList(applyItems);
    } else {
      // 미래면 기본 폼 (모든 필드 수정 가능)
      const standardItems = getUpdatedCUDPopItems(
        MOCK.unitThicknessItems.CUDPopItems
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

      // 레이어 유형 리스트 갱신
      if (item.name === "layerEm") {
        return {
          key: "id",
          ...item,
          option: layerEmList,
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
      // 두께 삭제
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "add-thickness-price",
          jsx: "jsxcrud",
        },
        id
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setNewOpen(false);
        setResultFunc("success", "삭제 성공", "두께 삭제가 완료되었습니다.");
      } else {
        setNewOpen(false);
        setResultFunc("error", "삭제 실패", "두께 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "삭제 실패", "두께 삭제를 실패하였습니다.");
    }
  };

  function modalClose() {
    setNewOpen(false);
    setNewData(newUnitThicknessCUType);
  }

  // newData 변경 감지
  useEffect(() => {
    // 등록 modal의 레이어 유형 리스트 갱신
    if (!newData.id) {
      const updatedItems = MOCK.unitThicknessItems.CUDPopItems.map((item) => {
        let disabled = false;

        // 레이어 유형 리스트 갱신
        if (item.name === "layerEm") {
          return {
            key: "id",
            ...item,
            option: layerEmList,
            disabled,
          };
        }

        return { ...item, disabled };
      });

      setAddModalInfoList(updatedItems);
    }
  }, [newData]);

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
                setNewData(newUnitThicknessCUType());
                setAddModalInfoList(MOCK.unitThicknessItems.CUDPopItems);
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
                title: "레이어 유형",
                width: 130,
                dataIndex: "layerEm",
                key: "layerEm",
                align: "center",
                render: (_, record) => (
                  <div
                    className="w-full h-full h-center justify-center cursor-pointer reference-detail"
                    onClick={() => {
                      handleEditClick(record);
                    }}
                  >
                    {record.layerEm.replace("L", "") + "층"}
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
                    {/* 가중치(추가 비율) -> 백분율 형태로 보여줌 (소수점 첫째 자리까지) */}
                    {parseFloat((value * 100).toFixed(1))}
                  </div>
                ),
              },
              {
                title: "최소 두께",
                width: 130,
                dataIndex: "minThickness",
                key: "minThickness",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "최대 두께",
                width: 130,
                dataIndex: "maxThickness",
                key: "maxThickness",
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
        title={{ name: `두께 ${newData?.id ? "수정" : "등록"}`, icon: <Bag /> }}
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
          setNewData(newUnitThicknessCUType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  );
};

BuyUnitThicknessListPage.layout = (page: React.ReactNode) => (
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

export default BuyUnitThicknessListPage;
