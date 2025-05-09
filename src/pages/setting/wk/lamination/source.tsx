import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import AddContents from "@/contents/base/wk/lamination/AddContents";
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  laminationSourceList,
  newLaminationSourceList,
  setLaminationSourceList,
} from "@/data/type/base/lamination";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Radio, Spin } from "antd";
import { useBase } from "@/data/context/BaseContext";
import { selectType } from "@/data/type/componentStyles";
import { LamDtlTypeEm } from "@/data/type/enum";

const WkLaminationSourceListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [type, setType] = useState<"cf" | "pp" | "ccl" | "">("");

  const { metarialSelectList } = useBase();
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.MaterialListPage.CUDPopItems
  );
  const [addModalCopper, setaddModalCopper] = useState<any[]>(
    MOCK.MaterialListPage.CUDPopItems
  );

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<laminationSourceList>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["setting", "wk", "lamination", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
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
      console.log(result.data);
      return result;
    },
  }); // --------------------------meterial API-----------------------------`
  const [materialOptions, setMaterialOptions] = useState<selectType[]>([]);
  const [materialEpoxy, setMaterialEpoxy] = useState<selectType[]>([]);
  const [materialCode, setMaterialCode] = useState<selectType[]>([]);
  const [dataGroup, setDataGroup] = useState<Array<laminationSourceList>>([]);
  const { data: queryDataGroup } = useQuery<apiGetResponseType, Error>({
    queryKey: ["lamination-material/jsxcrud/many"],
    queryFn: async () => {
      setDataGroup([]);
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "lamination-material/jsxcrud/many",
      });
      if (result.resultCode === "OK_0000") {
        setDataGroup(result.data?.data ?? []);
        console.log("group : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // --------------------------meterial API----------------------------- 끝
  // --------------------------Copper API-------------------------------
  const [copperList, setCopperList] = useState<selectType[]>([]);
  const [copperListCopThk, setCopperListCopThk] = useState<selectType[]>([]);
  const [dataCopper, setDataCopper] = useState<Array<laminationSourceList>>([]);
  const { data: queryDataCopper } = useQuery<apiGetResponseType, Error>({
    queryKey: ["lamination-copper-foil/jsxcrud/many"],
    queryFn: async () => {
      setDataCopper([]);
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "lamination-copper-foil/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        setDataCopper(result.data?.data ?? []);
        console.log("group : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // -----------------------------Copper API----------------------------끝
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
          matNm: "",
        });
      } else if (name === "matNm") {
        //epoxy, code
        const matchedMaterial = dataGroup.find((d) => d.id === value);
        setNewData({
          ...newData,
          [name]: value,
          epoxy: matchedMaterial?.epoxy ?? "",
          code: matchedMaterial?.code ?? "",
        });
      } else if (name === "name") {
        //copThk
        const matchedCopper = dataCopper.find((d) => d.id === value);
        setNewData({
          ...newData,
          name: value,
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

  //등록 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    try {
      const payload = {
        ...data,
        matNm: data.matNm,
        copNm: data.name,
        epoxy: Number(data.epoxy),
      };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.name;

      console.log(data);
      if (data?.id) {
        const id = data.id;

        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source/",
            jsx: "jsxcrud",
          },
          id,
          payload
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultFunc(
            "success",
            "적층 구조 수정 성공",
            "적층 구조 수정이 완료되었습니다."
          );
        } else {
          setNewOpen(false);

          setResultFunc(
            "error",
            "적층 구조 수정 실패",
            "적층 구조 수정을 실패하였습니다."
          );
        }
      } else {
        const payload = {
          ...data,
          matNm: data.matNm,
          copNm: data.name,
          epoxy: Number(data.epoxy),
        };
        delete payload.id;
        delete payload.createdAt;
        delete payload.updatedAt;
        delete payload.name;

        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source",
            jsx: "jsxcrud",
          },
          payload
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          setResultFunc(
            "success",
            "적층 구조 등록 성공",
            "적층 구조 등록이 완료되었습니다."
          );
        } else {
          setNewOpen(false);
          setResultFunc(
            "error",
            "적층 구조 등록 실패",
            "적층 구조 등록을 실패하였습니다."
          );
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultFunc(
        "error",
        "적층 구조 등록 실패",
        "적층 구조 등록을 실패하였습니다."
      );
    }
  };
  //----------------------------------copper,material API 설정 ---------------------------------------------------
  useEffect(() => {
    if (dataGroup.length > 0) {
      setMaterialOptions(
        dataGroup.map((materialMatNm) => ({
          value: materialMatNm.id,
          label: materialMatNm.matNm ?? "",
        }))
      );
    }

    if (dataGroup.length > 0) {
      setMaterialEpoxy(
        dataGroup.map((materialEpoxyGap) => ({
          value: materialEpoxyGap.id,
          label: materialEpoxyGap.epoxy ?? "",
        }))
      );
    }

    if (dataGroup.length > 0) {
      setMaterialCode(
        dataGroup.map((materialCodeGap) => ({
          value: materialCodeGap.id,
          label: materialCodeGap.code ?? "",
        }))
      );
    }

    if (dataCopper.length > 0) {
      setCopperList(
        dataCopper.map((copper) => ({
          value: copper.id,
          label: copper.name ?? "",
        }))
      );
    }

    if (dataCopper.length > 0) {
      setCopperListCopThk(
        dataCopper.map((copperCopThk) => ({
          value: copperCopThk.id,
          label: copperCopThk.copThk ?? "",
        }))
      );
    }
  }, [dataGroup, dataCopper]);

  useEffect(() => {
    if (
      materialOptions.length > 0 ||
      copperList.length > 0 ||
      materialEpoxy.length > 0 ||
      materialCode.length > 0 ||
      copperListCopThk.length > 0
    ) {
      const updatedItems = MOCK.laminationItems.CUDPopItems.map((item) => {
        if (
          item.optionSource === "materialOptions" &&
          materialOptions.length > 0
        ) {
          const filteredMaterialOptions = newData?.lamDtlTypeEm
            ? materialOptions.filter((opt) =>
                dataGroup.find(
                  (d) =>
                    d.id === opt.value &&
                    d.lamDtlTypeEm === newData.lamDtlTypeEm
                )
              )
            : materialOptions;

          return { ...item, option: filteredMaterialOptions };
        }

        if (item.optionSource === "copperList" && copperList.length > 0) {
          return { ...item, option: copperList };
        }
        if (item.optionSource === "materialEpoxy" && materialEpoxy.length > 0) {
          return { ...item, option: materialEpoxy };
        }
        if (item.optionSource === "materialCode" && materialCode.length > 0) {
          return { ...item, option: materialCode };
        }
        if (
          item.optionSource === "copperListCopThk" &&
          copperListCopThk.length > 0
        ) {
          return { ...item, option: copperListCopThk };
        }

        return item;
      });

      setAddModalInfoList(updatedItems);
    }
  }, [
    materialOptions,
    copperList,
    materialEpoxy,
    materialCode,
    copperListCopThk,
    newData?.lamDtlTypeEm,
    dataGroup,
  ]);
  //----------------------------------copper,material API 설정  끝 ---------------------------------------------------
  // ----------- 신규 데이터 끝 -----------
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
                render: (_, record) => {
                  const materialMatNm = materialOptions.find(
                    (option) => option.value === record.matNm
                  );
                  return (
                    <div
                      className="w-full h-full justify-center h-center cursor-pointer reference-detail"
                      onClick={() => {
                        const fullRecord = setLaminationSourceList(record);

                        const matchedMaterial = dataGroup.find(
                          (d) => d.matNm === record.matNm
                        );
                        const matchedCopper = dataCopper.find(
                          (d) => d.id === record.copNm
                        );
                        setNewData({
                          ...fullRecord,
                          matNm: matchedMaterial?.id ?? record.matNm,
                          name: matchedCopper?.id ?? record.copNm,
                          epoxy: matchedMaterial?.epoxy ?? record.epoxy,
                          code: matchedMaterial?.code ?? record.code,
                          copThk: matchedCopper?.copThk ?? record.copThk,
                        });

                        setNewOpen(true);
                      }}
                    >
                      {materialMatNm?.label ?? "-"}
                    </div>
                  );
                },
              },
              {
                title: "Epoxy",
                width: 130,
                dataIndex: "epoxy",
                key: "epoxy",
                align: "center",
                render: (_, record) => {
                  const materialEpoxyGap = materialEpoxy.find(
                    (option) => option.value === record.matNm
                  );
                  return <div>{materialEpoxyGap?.label ?? "-"}</div>;
                },
              },
              {
                title: "코드",
                width: 130,
                dataIndex: "code",
                key: "code",
                align: "center",
                render: (_, record) => {
                  const materialCodeGap = materialCode.find(
                    (option) => option.value === record.matNm
                  );
                  return <div>{materialCodeGap?.label ?? "-"}</div>;
                },
              },
              {
                title: "동박",
                width: 130,
                dataIndex: "copNm",
                key: "copNm",
                align: "center",
                render: (_, record) => {
                  const copper = copperList.find(
                    (option) => option.value === record.copNm
                  );
                  return <div>{copper?.label ?? "-"}</div>;
                },
              },
              {
                title: "동박두께",
                width: 130,
                dataIndex: "copThk",
                key: "copThk",
                align: "center",
                render: (_, record) => {
                  const copperCopThk = copperListCopThk.find(
                    (option) => option.value === record.copNm
                  );
                  return <div>{copperCopThk?.label ?? "-"}</div>;
                },
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

      {/* <AntdModal
        title={"거래처 등록"}
        open={newOpen}
        setOpen={setNewOpen}
        width={800}
        contents={
          <AddContents
            handleDataChange={handleDataChange}
            newData={newData}
            handleSubmitNewData={handleSubmitNewData}
            setNewOpen={setNewOpen}
            setNewData={setNewData}
            item={[
              { 
                name: 'lamDtlTypeEm',
                label: '유형',
                type: 'select',
                value: newData.lamDtlTypeEm,
                option: [{value:'cf',label:'CF'},{value:'pp',label:'PP'},{value:'ccl',label:'CCL'}]
              },
              { 
                name: 'matCd',
                label: '재질',
                type: 'select',
                value: newData.matCd,
                option: [{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}]
              },
              { 
                name: 'matThk',
                label: '재질두께',
                type: 'input',
                value: newData.matThk,
                inputType: 'number',
              },
              { 
                name: 'copOut',
                label: '동박외층',
                type: 'input',
                value: newData.copOut,
              },
              { 
                name: 'copIn',
                label: '동박내층',
                type: 'input',
                value: newData.copIn,
              },
              { 
                name: 'lamDtlThk',
                label: '두께',
                type: 'input',
                value: newData.lamDtlThk,
                inputType: 'number',
              },
              { 
                name: 'lamDtlRealThk',
                label: '실두께',
                type: 'input',
                value: newData.lamDtlRealThk,
                inputType: 'number',
              },
              { 
                name: 'useYn',
                label: '사용여부',
                type: 'select',
                option: [{value:true,label:"사용"},{value:false,label:"미사용"}],
                value: newData.useYn,
              },
            ]}
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newLaminationCUType);
        }}
      /> */}

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
    </>
  );
};

WkLaminationSourceListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    styles={{ pd: "70px" }}
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
