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
import { isValidNumber } from "@/utils/formatNumber";

// 타입 정의
import { LayerEm } from "@/data/type/enum";
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  unitModelType,
  unitModelCUType,
  setUnitModelType,
  setUnitModelCUType,
  newUnitModelCUType,
  unitModelApplyType,
  unitModelReq,
} from "@/data/type/base/unit";

// 아이콘
import Bag from "@/assets/svg/icons/bag.svg";
import { Radio, Spin } from "antd";

const BuyUnitModelListPage: React.FC & {
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
  const [data, setData] = useState<Array<unitModelType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    //queryKey: ['setting', 'buy', 'unit', type, pagination.current],
    queryKey: ["model-base-price/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);

      // 모델 단가 리스트 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "model-base-price/jsxcrud/many",
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
  const [newData, setNewData] = useState<unitModelCUType>(newUnitModelCUType);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.unitModelItems.CUDPopItems
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
      const val = validReq(data, unitModelReq());
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
              price: data.price,
              appDt: data.applyAppDt,
            }
          : data;

        // 필요없는 필드 제거
        delete patchData.id;
        delete patchData.applyAppDt;
        delete patchData.applyPrice;
        delete patchData.originPrice;
        delete patchData.appOriginDt;

        // 모델 단가 수정
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "model-base-price",
            jsx: "jsxcrud",
          },
          id,
          patchData
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          refetch();
          setNewOpen(false);
          setNewData(newUnitModelCUType());
          setResultFunc(
            "success",
            "모델 단가 수정 성공",
            "모델 단가 수정이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "모델 단가 수정 실패",
            "모델 단가 수정을 실패하였습니다."
          );
        }
      } else {
        // 모델 단가 등록
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "model-base-price",
            jsx: "jsxcrud",
          },
          newData
        );

        console.log(result);

        if (result.resultCode === "OK_0000") {
          refetch();
          setNewOpen(false);
          setResultFunc(
            "success",
            "모델 단가 등록 성공",
            "모델 단가 등록이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "모델 단가 등록 실패",
            "모델 단가 등록을 실패하였습니다."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc(
        "error",
        "모델 단가 등록 실패",
        "모델 단가 등록을 실패하였습니다."
      );
    }
  };
  // ----------- 신규 데이터 끝 -----------

  // ----------- 단가 적용일, 적용단가 데이터 시작 -----------
  // apply 데이터
  const [applyData, setApplyData] = useState<unitModelApplyType[]>([]);

  const convertCUType = (record: unitModelType): unitModelCUType => ({
    id: record.id,
    layerEm: record.layerEm,
    minAmount: record.minAmount,
    maxAmount: record.maxAmount,
    price: record.price,
    deliveryDays: record.deliveryDays,
    ordNo: record.ordNo,
    useYn: record.useYn,
    remark: record.remark,
    appDt: record.appDt,
    appOriginDt: record.appDt,
    applyAppDt: record.appDt,
    applyPrice: record.price,
  });

  const fetchApplyData = async (targetId: string) => {
    const result = await getAPI({
      type: "core-d2",
      utype: "tenant/",
      url: `cbiz-apply-price-data/default/one/MODEL_BASE_PRICE/${targetId}`,
    });

    if (result.resultCode === "OK_0000") {
      setApplyData(result.data?.data ?? []);
      console.log("applydata:", result.data?.data);
    } else {
      console.log("error:", result.response);
    }

    return result;
  };

  const handleEditClick = async (record: unitModelCUType) => {
    const applyDataResult = await fetchApplyData(record.id ?? "");
    const converted = convertCUType(record);

    // 기본값으로 현재 단가 설정
    let currentData = {
      ...converted,
      applyPrice: record.price, // 기본값으로 현재 단가 설정
    };

    if (applyDataResult.resultCode === "OK_0000") {
      const applyData = applyDataResult.data;
      const applyDate = dayjs(applyData.applyDate);
      const today = dayjs();

      // 단가적용일이 오늘이거나 과거면 적용단가 정보 설정
      if (applyDate.isBefore(today, "day") || applyDate.isSame(today, "day")) {
        currentData = {
          ...currentData,
          applyPrice: applyData.price ?? record.price, // 적용 단가로 설정
        };
      }

      if (applyDataResult.resultCode === "OK_0000") {
        const applyData = applyDataResult.data;

        currentData = {
          ...currentData,
          applyPrice: applyData.mapping?.price ?? record.price,
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
        MOCK.applyUnitModelItems.CUDPopItems
      );
      setAddModalInfoList(applyItems);
    } else {
      // 미래면 기본 폼 (모든 필드 수정 가능)
      const standardItems = getUpdatedCUDPopItems(
        MOCK.unitModelItems.CUDPopItems
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
        if (item.name !== "price" && item.name !== "applyAppDt") {
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

  // ----------- 단가 적용일, 적용단가 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      // 모델 단가 삭제
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "model-base-price",
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
          "모델 단가 삭제가 완료되었습니다."
        );
      } else {
        setNewOpen(false);
        setResultFunc("error", "삭제 실패", "모델 단가 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "삭제 실패", "모델 단가 삭제를 실패하였습니다.");
    }
  };

  function modalClose() {
    setNewOpen(false);
    setNewData(newUnitModelCUType);
  }

  // newData 변경 감지
  useEffect(() => {
    // 등록 modal의 레이어 유형 리스트 갱신
    if (!newData.id) {
      const updatedItems = MOCK.unitModelItems.CUDPopItems.map((item) => {
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
                setNewData(newUnitModelCUType());
                setAddModalInfoList(MOCK.unitModelItems.CUDPopItems);
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
                title: "최소 수량",
                width: 130,
                dataIndex: "minAmount",
                key: "minAmount",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "최대 수량",
                width: 130,
                dataIndex: "maxAmount",
                key: "maxAmount",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "현재 단가",
                width: 130,
                dataIndex: "price",
                key: "price",
                align: "center",
                render: (value: number) => (
                  <div className="text-right">{value.toLocaleString()}</div>
                ),
              },
              {
                title: "배송일",
                width: 130,
                dataIndex: "deliveryDays",
                key: "deliveryDays",
                align: "center",
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
              {
                title: "변경이력",
                width: 130,
                dataIndex: "updatedAt",
                key: "updatedAt",
                align: "center",
                render: (value: string) => <div>{value.split("T")[0]}</div>,
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
          name: `모델 단가 ${newData?.id ? "수정" : "등록"}`,
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
          setNewData(newUnitModelCUType);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

BuyUnitModelListPage.layout = (page: React.ReactNode) => (
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

export default BuyUnitModelListPage;
