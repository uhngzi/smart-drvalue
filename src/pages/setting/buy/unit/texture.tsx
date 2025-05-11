import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { apiGetResponseType } from "@/data/type/apiResponse";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useToast from "@/utils/useToast";

// 기초 타입 import
import {
  unitTextureType,
  unitTextureCUType,
  setUnitTextureType,
  setUnitTextureCUType,
  newUnitTextureCUType,
  unitTextureApplyType,
  unitTextureReq,
} from "@/data/type/base/texture";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Radio, Spin } from "antd";
import { useBase } from "@/data/context/BaseContext";
import { validReq } from "@/utils/valid";

const BuyunitTextureListPage: React.FC & {
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

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  // --------- 적용 예정일 데이터 시작---------
  const [applyData, setApplyData] = useState<unitTextureApplyType[]>([]);

  const fetchApplyPriceData = async (targetId: string) => {
    const result = await getAPI({
      type: "core-d2",
      utype: "tenant/",
      url: `cbiz-apply-price-data/default/one/BP_TEXTURE/${targetId}`,
    });
    if (result.resultCode === "OK_0000") {
      setApplyData(result.data?.data ?? []);
      console.log("applydata:", result.data?.data);
    } else {
      console.log("error:", result.response);
    }
    return result;
  };

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<unitTextureType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    // queryKey: ['setting', 'buy', 'unit', type, pagination.current],
    queryKey: ["bp-texture/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);

      // 재질 리스트 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "bp-texture/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          anykeys: { id: type }, // 수정한거(보류)
        }
      );

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
      } else {
        console.log("error:", result.response);
      }

      setDataLoading(false);
      console.log(result.data);
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
    useState<unitTextureCUType>(newUnitTextureCUType);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.unitTextureItems.CUDPopItems
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

      if (name === "weight" && Number(value ?? 0) > 100) {
        showToast("최대 100까지 입력할 수 있습니다.", "error");
        setNewData({ ...newData, weight: 100 });
        return;
      }

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
      }
    }
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
        if (
          item.name !== "addCost" &&
          item.name !== "weight" &&
          item.name !== "applyAppDt"
        ) {
          disabled = true;
        }

        if (item.name === "texture") {
          return { ...item, option: metarialSelectList, disabled };
        }
      }

      if (item.name === "texture") {
        return { ...item, option: metarialSelectList };
      }

      return { ...item, disabled };
    });
  };

  useEffect(() => {
    setAddModalInfoList(getUpdatedCUDPopItems());
  }, [newData.appDt, newData.id]);

  //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    console.log(newData);
    if (!newData.texture) {
      showToast("재질은 필수 입력입니다.", "error");
      return;
    }

    try {
      console.log(data);
      if (data?.id) {
        const { appOriginDt, applyPrice, applyAppDt } = data.id;
        delete data.id;

        // 재질 수정
        const today = dayjs();

        if (
          newData.appOriginDt &&
          (dayjs(newData.appDt).isBefore(today, "day") ||
            dayjs(newData.appDt).isSame(today, "day"))
        ) {
          const result = await patchAPI(
            {
              type: "baseinfo",
              utype: "tenant/",
              url: "bp-texture",
              jsx: "jsxcrud",
            },
            newData?.id ?? "",
            {
              addCost: newData.addCost ?? 0,
              appDt: newData.applyAppDt,
              weight: Number(data.weight ?? 0) * 0.01, // 가중치(추가 비율) 수정 시 백분율 -> 소수점 변환
            }
          );

          if (result.resultCode === "OK_0000") {
            setNewOpen(false);
            showToast("수정 완료", "success");
            refetch();
          } else {
            setNewOpen(false);
            setResultFunc(
              "error",
              "재질 수정 실패",
              "재질 수정을 실패하였습니다."
            );
          }
        } else {
          const { id, appOriginDt, applyPrice, applyAppDt } = newData;
          const result = await patchAPI(
            {
              type: "baseinfo",
              utype: "tenant/",
              url: "bp-texture",
              jsx: "jsxcrud",
            },
            newData?.id ?? "",
            {
              remark: newData.remark,
              appDt: newData.appDt,
              ordNo: newData.ordNo,
              useYn: newData.useYn,
              texture: { id: newData.texture },
              addCost: newData.addCost ?? 0,
              weight: Number(data.weight ?? 0) * 0.01,
            }
          );

          if (result.resultCode === "OK_0000") {
            setNewOpen(false);
            showToast("수정 완료", "success");
            refetch();
          } else {
            setNewOpen(false);
            setResultFunc(
              "error",
              "재질 수정 실패",
              "재질 수정을 실패하였습니다."
            );
          }
        }
      } else {
        // 재질 등록
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "bp-texture",
            jsx: "jsxcrud",
          },
          {
            ...newData,
            weight: Number(newData.weight) * 0.01, // 가중치(추가 비율) 등록 시 백분율 -> 소수점 변환
            texture: {
              id: newData.texture,
            },
          }
        );

        // Debug
        // console.log(result, JSON.stringify(newData));

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          showToast("등록 완료", "success");
          refetch();
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "재질 등록 실패",
            "재질 등록을 실패하였습니다."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "재질 등록 실패", "재질 등록을 실패하였습니다.");
    }
  };
  // ----------- 신규 데이터 끝 -----------
  const handleEditClick = async (record: unitTextureType) => {
    const applyDataResult = await fetchApplyPriceData(record.id ?? "");
    console.log("[applyDataResult]", applyDataResult);
    const converted = setUnitTextureCUType(record);

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

      // 적용일이 오늘이거나 과거면 적용단가 정보 설정
      if (applyDate.isBefore(today, "day") || applyDate.isSame(today, "day")) {
        currentData = {
          ...currentData,
          applyPrice: applyData.addCost ?? record.addCost, // 적용 단가로 설정
        };
      }

      if (applyDataResult.resultCode === "OK_0000") {
        const applyData = applyDataResult.data;
        currentData = {
          ...currentData,
          applyPrice: applyData.mapping?.addCost ?? record.addCost,
          applyAppDt: applyData.applyDate ?? record.appDt,
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
      // 과거/오늘이면 적용단가 수정 폼 (추가비용만 수정 가능)
      const applyItems = getUpdatedCUDPopItems(
        MOCK.applyUnitTextureItems.CUDPopItems
      );
      setAddModalInfoList(applyItems);
    } else {
      // 미래면 기본 폼 (모든 필드 수정 가능)
      const standardItems = getUpdatedCUDPopItems(
        MOCK.unitTextureItems.CUDPopItems
      );
      setAddModalInfoList(standardItems);
    }

    setNewOpen(true);
  };

  const handleDataDelete = async (id: string) => {
    try {
      // 재질 삭제
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "bp-texture",
          jsx: "jsxcrud",
        },
        id
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setNewOpen(false);
        setResultFunc("success", "삭제 성공", "재질 삭제가 완료되었습니다.");
      } else {
        setNewOpen(false);
        setResultFunc("error", "삭제 실패", "재질 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "삭제 실패", "재질 삭제를 실패하였습니다.");
    }
  };

  function modalClose() {
    setNewOpen(false);
    setNewData(newUnitTextureCUType);
  }

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
                setAddModalInfoList(
                  MOCK.unitTextureItems.CUDPopItems.map((item) => {
                    if (item.name === "texture") {
                      return { ...item, option: metarialSelectList };
                    } else {
                      return item;
                    }
                  })
                );
                setNewOpen(true);
                setNewData(newUnitTextureCUType());
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
                title: "재질",
                width: 130,
                dataIndex: "texture",
                key: "texture",
                align: "center",
                render: (_, record) => (
                  <div
                    className="reference-detail"
                    onClick={() => handleEditClick(record)}
                  >
                    {record.texture?.cdNm}
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
                title: "적용일",
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
        title={{ name: `재질 ${newData?.id ? "수정" : "등록"}`, icon: <Bag /> }}
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
          setNewData(newUnitTextureCUType);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

BuyunitTextureListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
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

export default BuyunitTextureListPage;
