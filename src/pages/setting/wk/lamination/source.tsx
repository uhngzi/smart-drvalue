import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Radio, Spin } from "antd";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";

import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  laminationCopperList,
  laminationMaterialType,
  laminationSourceList,
  newLaminationSourceList,
} from "@/data/type/base/lamination";
import { selectType } from "@/data/type/componentStyles";
import { LamDtlTypeEm } from "@/data/type/enum";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import Bag from "@/assets/svg/icons/bag.svg";

import { MOCK } from "@/utils/Mock";
import useToast from "@/utils/useToast";

const WkLaminationSourceListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { ToastContainer, showToast } = useToast();
  const [type, setType] = useState<"cf" | "pp" | "ccl" | "">("");

  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.laminationItems.CUDPopItems
  );

  // --------- 필요 데이터 세팅 ---------- 시작
  const [materialOptions, setMaterialOptions] = useState<selectType[]>([]);
  const [material, setMaterial] = useState<Array<laminationMaterialType>>([]);
  const { data: queryMaterialGroup } = useQuery<apiGetResponseType, Error>({
    queryKey: ["lamination-material/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "lamination-material/jsxcrud/many",
      });
      if (result.resultCode === "OK_0000") {
        setMaterial(result.data?.data ?? []);
        setMaterialOptions(
          ((result.data?.data as laminationMaterialType[]) ?? []).map(
            (materialMatNm) => ({
              value: materialMatNm.id,
              label: materialMatNm.matNm ?? "",
            })
          )
        );
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  const [copperOptions, setCopperOptions] = useState<selectType[]>([]);
  const [copper, setCopper] = useState<Array<laminationCopperList>>([]);
  const { data: queryCopperData } = useQuery<apiGetResponseType, Error>({
    queryKey: ["lamination-copper-foil/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "lamination-copper-foil/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        setCopper(result.data?.data ?? []);
        setCopperOptions(
          ((result.data?.data as laminationCopperList[]) ?? []).map(
            (copper) => ({
              value: copper.id,
              label: copper.name ?? "",
            })
          )
        );
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // --------- 필요 데이터 세팅 ---------- 끝

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 리스트 데이터 세팅 --------- 시작
  const [data, setData] = useState<Array<laminationSourceList>>([]);
  const { refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["lamination-source/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "lamination-source/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          anykeys: type === "" ? {} : { lamDtlTypeEm: type },
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
  // --------- 리스트 데이터 세팅 --------- 끝

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
  const [newData, setNewData] = useState<laminationSourceList>(
    newLaminationSourceList
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
      const value = e as string;

      if (name === "lamDtlTypeEm") {
        // 유형 선택 시 자재 초기화
        setNewData({
          ...newData,
          [name]: value as LamDtlTypeEm,
          matIdx: "",
          matNm: "",
          epoxy: 0,
          code: "",
        });
      } else if (name === "matIdx") {
        // 자재 선택 시 해당 자재의 name, epoxy, code 값 자동 세팅
        const matchedMaterial = material.find((d) => d.id === value);

        setNewData({
          ...newData,
          [name]: value,
          matNm: matchedMaterial?.matNm,
          epoxy: Number(matchedMaterial?.epoxy ?? 0),
          code: matchedMaterial?.code ?? "",
        });
      } else if (name === "name") {
        // 동박 선택 시 해당 동박의 copNm, copThk 값 자동 세팅
        const matchedCopper = copper.find((d) => d.id === value);
        setNewData({
          ...newData,
          name: value,
          copNm: matchedCopper?.name ?? "",
          copThk: matchedCopper?.copThk ?? "",
        });
      } else if (key) {
        setNewData({
          ...newData,
          [name]: {
            ...((newData as any)[name] || {}),
            [key]: value.toString(),
          },
        });
      } else {
        setNewData({ ...newData, [name]: value });
      }
    }
  };

  // 등록, 수정 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    try {
      const jsonData = {
        lamDtlTypeEm: data.lamDtlTypeEm,
        material: {
          id: data?.matIdx,
        },
        matNm: data?.matNm,
        epoxy: data?.epoxy,
        code: data?.code,
        copperFoil: {
          id: data?.name,
        },
        copNm: data?.copNm,
        copThk: data?.copThk,
        useYn: data?.useYn,
      };
      console.log(JSON.stringify(jsonData));

      if (data?.id) {
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source/",
            jsx: "jsxcrud",
          },
          data.id,
          jsonData
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          showToast("수정 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          setNewOpen(false);

          setResultFunc(
            "error",
            "적층 구조 수정 실패",
            msg ??
              "데이터 저장 중 오류가 발생하였습니다. 잠시 후에 다시 시도해주세요."
          );
        }
      } else {
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source",
            jsx: "jsxcrud",
          },
          jsonData
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          showToast("등록 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          setNewOpen(false);

          setResultFunc(
            "error",
            "적층 구조 수정 실패",
            msg ??
              "데이터 저장 중 오류가 발생하였습니다. 잠시 후에 다시 시도해주세요."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc(
        "error",
        "오류 발생",
        "데이터 저장 중 오류가 발생하였습니다. 잠시 후에 다시 시도해주세요."
      );
    }
  };

  // ---------- 옵션 업데이트 ----------- 시작
  useEffect(() => {
    if (materialOptions.length > 0 || copperOptions.length > 0) {
      const updatedItems = MOCK.laminationItems.CUDPopItems.map((item) => {
        if (item.optionSource === "materialOptions") {
          // 유형 변경 시 자재의 값도 해당 유형에 맞춰 SELECT 값 수정
          const filteredMaterialOptions = newData?.lamDtlTypeEm
            ? materialOptions.filter((opt) =>
                material.find(
                  (d) =>
                    d.id === opt.value &&
                    d.lamDtlTypeEm === newData.lamDtlTypeEm
                )
              )
            : materialOptions;

          return { ...item, option: filteredMaterialOptions };
        }

        if (item.optionSource === "copperList") {
          return { ...item, option: copperOptions };
        }

        return item;
      });

      setAddModalInfoList(updatedItems);
    }
  }, [materialOptions, copperOptions, newData?.lamDtlTypeEm]);
  // ---------- 옵션 업데이트 ----------- 끝

  // ----------- 데이터 삭제 ----------- 시작
  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "lamination-source",
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
          "적층 구조 삭제가 완료되었습니다."
        );
      } else {
        setNewOpen(false);
        setResultFunc("error", "삭제 실패", "적층 구조 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc("error", "삭제 실패", "적층 구조 삭제를 실패하였습니다.");
    }
  };
  // ----------- 데이터 삭제 ----------- 끝

  function modalClose() {
    setNewOpen(false);
    setNewData(newLaminationSourceList);
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
              <Radio.Group
                value={type ? type : ""}
                size="small"
                className="custom-radio-group"
              >
                <Radio.Button
                  value=""
                  onClick={() => {
                    console.log("유형: ");
                    setType("");
                  }}
                >
                  전체
                </Radio.Button>
                <Radio.Button
                  value="cf"
                  onClick={() => {
                    console.log("유형: CF");
                    setType("cf");
                  }}
                >
                  C/F
                </Radio.Button>
                <Radio.Button
                  value="pp"
                  onClick={() => {
                    console.log("유형: PP");
                    setType("pp");
                  }}
                >
                  P/P
                </Radio.Button>
                <Radio.Button
                  value="ccl"
                  onClick={() => {
                    console.log("유형: CCL");
                    setType("ccl");
                  }}
                >
                  CCL
                </Radio.Button>
              </Radio.Group>
            </div>
            <div
              className="w-56 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
              onClick={() => {
                setNewData({
                  ...newLaminationSourceList(),
                  lamDtlTypeEm: type === "" ? null : (type as LamDtlTypeEm), //유형 선택칸 들어가서 등록 누를 시 유형에 자동으로 값 들어가게 설정
                });
                setNewOpen(true);
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
                title: "유형",
                dataIndex: "lamDtlTypeEm",
                key: "lamDtlTypeEm",
                align: "center",
                render: (_, record) => <div>{record.lamDtlTypeEm}</div>,
              },
              {
                title: "자재",
                width: 130,
                dataIndex: "matNm",
                key: "matNm",
                align: "center",
                render: (value, record) => (
                  <div
                    className="w-full h-full justify-center h-center cursor-pointer reference-detail"
                    onClick={() => {
                      setNewData({
                        ...(record as laminationSourceList),
                        matIdx: record?.material?.id ?? "",
                        name: record?.copperFoil?.id ?? "",
                      });
                      setNewOpen(true);
                    }}
                  >
                    {value}
                  </div>
                ),
              },
              {
                title: "Epoxy",
                width: 130,
                dataIndex: "epoxy",
                key: "epoxy",
                align: "center",
              },
              {
                title: "코드",
                width: 130,
                dataIndex: "code",
                key: "code",
                align: "center",
              },
              {
                title: "동박",
                width: 130,
                dataIndex: "copNm",
                key: "copNm",
                align: "center",
              },
              {
                title: "동박두께",
                width: 130,
                dataIndex: "copThk",
                key: "copThk",
                align: "center",
              },
              {
                title: "사용여부",
                width: 130,
                dataIndex: "useYn",
                key: "useYn",
                align: "center",
                render: (value: boolean) => (
                  <div>{value ? "사용" : "미사용"}</div>
                ),
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
          name: `적층구조 요소 ${newData?.id ? "수정" : "등록"}`,
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
          setNewData(newLaminationSourceList);
        }}
        hideCancel={true}
        theme="base"
      />

      <ToastContainer />
    </>
  );
};

WkLaminationSourceListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    menu={[
      { text: "적층구조 요소", link: "/setting/wk/lamination/source" },
      { text: "적층구조 자재", link: "/setting/wk/lamination/material" },
      { text: "적층구조 동박", link: "/setting/wk/lamination/copper" },
    ]}
  >
    {page}
  </SettingPageLayout>
);

export default WkLaminationSourceListPage;
