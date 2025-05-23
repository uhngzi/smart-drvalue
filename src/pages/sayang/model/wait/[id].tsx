import type { InputRef } from "antd";
import { useEffect, useRef, useState } from "react";
import { Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";

import AntdTable from "@/components/List/AntdTable";
import ModelHead from "@/components/ModelTable/ModelHead";
import AddDrawer from "@/contents/sayang/model/add/AddDrawer";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import { TabSmall } from "@/components/Tab/Tabs";
import { salesOrderModelReadClmn } from "@/components/ModelTable/Column";

import { ModelStatus, SalesOrderStatus } from "@/data/type/enum";
import { sayangModelWaitAddClmn } from "@/data/columns/Sayang";
import { useBase } from "@/data/context/BaseContext";
import {
  modelReq,
  modelsType,
  orderModelType,
} from "@/data/type/sayang/models";
import {
  changeModelAddNewModel,
  changeModelAddTemp,
} from "@/data/type/sayang/changeData";
import {
  salesOrderDetailRType,
  salesOrderProductRType,
} from "@/data/type/sales/order";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";

import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import SalesModelHead from "@/components/ModelTable/SalesModelHead";
import { LabelMedium } from "@/components/Text/Label";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { DividerH } from "@/components/Divider/Divider";
import { RightTab } from "@/layouts/Body/RightTab";
import { IconButton } from "@/components/Button/IconButton";
import { Popup } from "@/layouts/Body/Popup";
import { selectType } from "@/data/type/componentStyles";
import { BoardGroupType, boardType } from "@/data/type/base/board";
import { apiGetResponseType } from "@/data/type/apiResponse";
import dayjs from "dayjs";

const SayangModelAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id: orderId } = router.query;

  const { showToast, ToastContainer } = useToast();

  // 베이스 값 가져오기
  const {
    boardSelectList,
    metarialSelectList,
    surfaceSelectList,
    unitSelectList,
    vcutSelectList,
    outSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    spPrintSelectList,
    spTypeSelectList,
    ozUnitSelectList,
  } = useBase();

  // ------------- 원판그룹(제조사) ------------- 시작
  const [boardGroupSelectList, setBoardGroupSelectList] = useState<
    selectType[]
  >([]);
  const [boardGroup, setBoardGroup] = useState<BoardGroupType[]>([]);
  const { refetch: refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "board-group/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        const bg = (result.data?.data ?? []) as BoardGroupType[];
        const arr = bg.map((d: BoardGroupType) => ({
          value: d.id,
          label: d.brdGrpName ?? "",
        }));
        setBoardGroup(bg);
        setBoardGroupSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------- 원판그룹(제조사) ------------- 끝

  // ------------- 발주 데이터 세팅 ------------- 시작
  const [orderModels, setOrderModels] = useState<salesOrderProductRType[]>([]);
  const { data: queryOrderModelData, isLoading: orderModelLoading } = useQuery({
    queryKey: ["sales-order/detail/jsxcrud/one", orderId],
    queryFn: async () => {
      try {
        return getAPI({
          type: "core-d1",
          utype: "tenant/",
          url: `sales-order/detail/jsxcrud/one/${orderId}`,
        });
      } catch (e) {
        return;
      }
    },
    enabled: !!orderId,
  });
  useEffect(() => {
    if (!orderModelLoading && queryOrderModelData?.resultCode === "OK_0000") {
      const products = (
        queryOrderModelData?.data?.data as salesOrderDetailRType
      )?.products;
      const omodels = products
        .sort((a, b) => a.orderNo.localeCompare(b.orderNo))
        .map((item: salesOrderProductRType, index: number) => ({
          ...item,
          index: index + 1,
          currPrdInfo: item.currPrdInfo
            ? JSON.parse(item.currPrdInfo ?? "")
            : {},
        }));
      setOrderModels(omodels);
    }
  }, [queryOrderModelData]);
  // ------------- 발주 데이터 세팅 ------------- 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [data, setData] = useState<orderModelType[]>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sales-order/product/jsxcrud/many/by-order-idx", orderId],
    queryFn: async () => {
      try {
        return getAPI({
          type: "core-d1",
          utype: "tenant/",
          url: `sales-order/product/jsxcrud/many/by-order-idx/${orderId}`,
        });
      } catch (e) {
        return;
      }
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading && queryData?.resultCode === "OK_0000") {
      const rdata: orderModelType[] = queryData?.data?.data ?? [];

      const arr = rdata
        .sort((a, b) => (a.orderNo ?? "").localeCompare(b.orderNo ?? ""))
        .map((d: orderModelType, index: number) => ({
          ...d,
          index: index + 1,
          completed:
            d.glbStatus?.salesOrderStatus ===
            SalesOrderStatus.MODEL_REG_COMPLETED
              ? true
              : false,
          // 고객 발주 모델 파싱
          currPrdInfo: JSON.parse(d.currPrdInfo ?? ""),
          // 임시저장 모델 파싱
          tempPrdInfo: d.tempPrdInfo ? JSON.parse(d.tempPrdInfo) : "",
        }));
      setData(arr);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // 우측 탭
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectTabDrawer, setSelectTabDrawer] = useState<number>(1);

  // 임시 함수 (삭제 추가해야 됨)
  function deleteModel(idx: number) {
    setData(data.filter((f: any) => f.id !== idx));
  }

  // 테이블에서 값 변경했을 때 실행되는 함수 (모델의 값 변경 시 실행 함수)
  const handleModelDataChange = (id: string, name: string, value: any) => {
    // 데이터를 복사
    const updatedData = data.map((item) => {
      if (item.id === id) {
        // 키 값이 객체일 경우 키값 분해
        // ex. orderModel?.prdNm > orderModel 안에 "prdNm"에 접근해야 함
        const keys = name.split(".");
        const updatedItem = {
          ...item,
          // temp: false
        };

        // 마지막 키를 제외한 객체 탐색
        const lastKey = keys.pop()!;
        let targetObject: any = updatedItem;

        keys.forEach((key) => {
          // 중간 키가 없거나 null인 경우 초기화
          if (!targetObject[key] || typeof targetObject[key] !== "object") {
            targetObject[key] = {};
          }
          targetObject = targetObject[key];
        });

        // 최종 키에 새 값 할당
        targetObject[lastKey] = value;

        return updatedItem;
      }
      return item; // 다른 데이터는 그대로 유지
    });

    setData(updatedData); // 상태 업데이트
  };

  // 임시저장 시 실행되는 함수 & 데이터 입력을 위해 확정 시에도 실행됨
  const handleSumbitTemp = async (id: string, temp: boolean) => {
    try {
      const tempData = data.find((d: orderModelType) => d.id === id);

      if (tempData) {
        const jsonData = changeModelAddTemp(tempData);
        console.log(JSON.stringify(jsonData));

        const result = await patchAPI(
          {
            type: "core-d1",
            utype: "tenant/",
            url: "sales-order/product",
            jsx: "jsxcrud",
          },
          id,
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          if (temp) showToast("임시저장 완료", "success");
          const index = data.findIndex((f) => f.id === id);
          if (index > -1) {
            const updateData = data;
            updateData[index] = {
              ...data[index],
              temp: true,
              updatedAt: dayjs(),
            };

            const newArray = [
              ...updateData.slice(0, index),
              updateData[index],
              ...updateData.slice(index + 1),
            ];
            setData(newArray);
          }
        } else {
          const msg = result?.response?.data?.message;
          setErrMsg(msg);
          setResultType("error");
          setResultOpen(true);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR : ", e);
    }
  };

  // 확정저장 시 실행되는 함수
  const handleSubmit = async (id: string) => {
    const modelStatus = data.find((f) => f.id === id)?.modelStatus;
    console.log("MODEL STATUS :: ", modelStatus);

    if (!modelStatus) {
      showToast("모델 반복 여부 선택", "error");
      return;
    }

    // 기존에 있는 모델을 선택한 것이 아닐 경우 새로 생성해야 함
    const tempData = data.find((d: orderModelType) => d.id === id);
    console.log(tempData);
    if (tempData) {
      const jsonData = changeModelAddNewModel(
        tempData,
        boardSelectList,
        metarialSelectList,
        surfaceSelectList,
        outSelectList,
        smPrintSelectList,
        smColorSelectList,
        smTypeSelectList,
        mkPrintSelectList,
        mkColorSelectList,
        mkTypeSelectList,
        unitSelectList
      );
      console.log(JSON.stringify(jsonData));

      const val = validReq(jsonData, modelReq());
      if (!val.isValid) {
        setErrMsg(val.missingLabels + "은(는) 필수 입력입니다.");
        setResultType("error");
        setResultOpen(true);
        return;
      }

      const resultPost = await postAPI(
        {
          type: "core-d1",
          utype: "tenant/",
          url: "models",
          jsx: "jsxcrud",
        },
        jsonData
      );

      if (resultPost.resultCode === "OK_0000") {
        const modelId = resultPost.data?.entity?.id;
        console.log("MODEL ID : ", modelId);
        handleConfirm(id, modelId, modelStatus);
      } else {
        const msg = resultPost?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
        console.log(msg);
      }
    }
  };

  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"success" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  // 확정저장 시 실행되는 함수 ("그대로 등록"은 위 submit 거치지 않고 바로 들어옴)
  const handleConfirm = async (
    id: string,
    modelId: string,
    modelStatus: ModelStatus
  ) => {
    const resultPatch = await patchAPI(
      {
        type: "core-d1",
        utype: "tenant/",
        url: `models-match/default/confirm/input-model/${id}`,
        jsx: "default",
        etc: true,
      },
      id,
      {
        modelId: modelId,
        modelStatus: modelStatus,
      }
    );

    if (resultPatch.resultCode === "OK_0000") {
      showToast("확정저장 완료", "success");
      const index = data.findIndex((f) => f.id === id);
      if (index > -1) {
        const updateData = data;
        updateData[index] = { ...data[index], completed: true };

        const newArray = [
          ...updateData.slice(0, index),
          updateData[index],
          ...updateData.slice(index + 1),
        ];
        setData(newArray);
      }
      handleSumbitTemp(id, false);
      const completedCnt = data.filter((f) => f.completed);
      console.log(data.filter((f) => f.completed));
      if (completedCnt.length === data.length) {
        setNewFlag(true);
        setResultOpen(true);
        setResultType("success");
      }
    } else {
      const msg = resultPatch?.response?.data?.message;
      setErrMsg(msg);
      setResultType("error");
      setResultOpen(true);
    }
  };

  const [newFlag, setNewFlag] = useState<boolean>(true);
  const [selectId, setSelectId] = useState<string | null>(null);

  // 모델명 Ref
  const inputRef = useRef<InputRef[]>([]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (inputRef.current.length > 0 && inputRef.current[0]?.input) {
        const targetInput = inputRef.current[0];
        targetInput.input?.focus();

        // 포커스 후 삭제
        observer.disconnect();
      }
    });

    // DOM 변경 감지 시작
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [inputRef]);

  const [orderModelsSelect, setOrderModelsSelect] = useState<string>("");
  const [orderTab, setOrderTab] = useState<
    { key: string; text: string; index?: number }[]
  >([]);
  useEffect(() => {
    if (orderModels.length > 0) {
      setOrderTab(
        orderModels
          .filter(
            (f) =>
              f.glbStatus?.salesOrderStatus !==
              SalesOrderStatus.MODEL_REG_DISCARDED
          )
          .map((m) => ({
            key: m.id,
            text: m.orderTit,
            index: m.index,
          }))
      );
      if (orderModelsSelect === "")
        setOrderModelsSelect(
          orderModels.filter(
            (f) =>
              f.glbStatus?.salesOrderStatus !==
              SalesOrderStatus.MODEL_REG_DISCARDED
          )?.[0].id
        );
    }
  }, [orderModels]);

  // 테이블에서 모델 검색을 통해 모델을 선택했을 경우 실행되는 함수
  const handleModelChange = (model: modelsType, productId: string) => {
    const newData = [...data];
    const index = newData.findIndex((f) => f.id === productId);
    if (index > -1) {
      newData[index] = {
        ...newData[index],
        currPrdInfo: { ...newData[index].currPrdInfo, ...model },
        prdMngNo: model.prdMngNo,
      };
      setData(newData);
      console.log(newData);
    }
  };

  if (dataLoading) {
    return (
      <div className="w-full h-[90vh] v-h-center">
        <Spin tip="Loading..." />
      </div>
    );
  }

  return (
    <>
      <div
        className="gap-20 flex w-full h-full justify-between"
        style={{ minWidth: 1600 }}
      >
        {/* 테이블 */}
        <div className="w-[calc(100%-100px)] flex flex-col gap-40 overflow-auto">
          {/* 수주 탭 */}
          <Popup className="!gap-0">
            <LabelMedium label="모델 등록 및 확정" className="mb-20" />
            <DividerH />
            <TabSmall
              items={orderTab}
              bd_b={false}
              selectKey={orderModelsSelect}
              setSelectKey={setOrderModelsSelect}
            />
            {!dataLoading &&
              data
                // 모델이 폐기 됐을 경우 필터링
                .filter(
                  (f) =>
                    f.glbStatus?.salesOrderStatus !==
                    SalesOrderStatus.MODEL_REG_DISCARDED
                )
                .map(
                  (model: orderModelType, index: number) =>
                    orderModelsSelect === model.id && (
                      <div
                        className="flex flex-col gap-16 mt-20"
                        key={model.id}
                        // style={model.completed?{background:"#F8F8F8"}:{}}
                      >
                        <ModelHead
                          model={model}
                          handleModelDataChange={handleModelDataChange}
                          boardSelectList={boardSelectList}
                          metarialSelectList={metarialSelectList}
                          selectId={selectId ?? ""}
                          newFlag={newFlag}
                          inputRef={inputRef}
                          index={index}
                          handleModelChange={handleModelChange}
                        />

                        <div className="flex flex-col ">
                          <AntdTable
                            columns={sayangModelWaitAddClmn(
                              deleteModel,
                              surfaceSelectList,
                              unitSelectList,
                              vcutSelectList,
                              outSelectList,
                              smPrintSelectList,
                              smColorSelectList,
                              smTypeSelectList,
                              mkPrintSelectList,
                              mkColorSelectList,
                              mkTypeSelectList,
                              spPrintSelectList,
                              spTypeSelectList,
                              ozUnitSelectList,
                              handleModelDataChange,
                              newFlag,
                              selectId
                            )}
                            data={[model]}
                            styles={{
                              th_bg: "#F9F9FB",
                              th_ht: "30px",
                              th_fw: "bold",
                              td_ht: "170px",
                              td_pd: "15px 3.8px",
                            }}
                            tableProps={{ split: "none" }}
                          />
                        </div>
                        {!model.completed ? (
                          <div className="w-full h-32 flex justify-end gap-5">
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                handleSumbitTemp(model.id, true);
                              }}
                            >
                              임시저장
                            </Button>
                            <FullOkButtonSmall
                              click={() => {
                                if (!model.modelStatus) {
                                  showToast("모델 선택", "error");
                                  return;
                                }

                                // 그대로 등록일 경우에는 바로 확정만 진행 (...필요없는 프로세스였음...)
                                // if(!newFlag && selectId !== "" && selectId !== null && selectId === model.id) {
                                //   handleConfirm(model.id, model?.editModel?.id, model.modelStatus);
                                // }

                                // 그대로 등록 또는 복사하여 수정일 경우 바로 확정만 진행
                                else if (model.model?.id) {
                                  handleConfirm(
                                    model.id,
                                    model?.model?.id,
                                    model.modelStatus
                                  );
                                }

                                // 신규일 경우 새로 생성
                                else handleSubmit(model.id);
                              }}
                              label="확정저장"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 flex justify-end gap-5">
                            {/* <FullChip label="확정 완료" state="mint" /> */}
                          </div>
                        )}
                      </div>
                    )
                )}
          </Popup>

          {/* 고객 발주 목록 */}
          <Popup className="!gap-0">
            <LabelMedium label="고객발주 모델" className="mb-20" />
            <DividerH />
            <TabSmall
              items={orderTab}
              bd_b={false}
              selectKey={orderModelsSelect}
              setSelectKey={setOrderModelsSelect}
            />
            {orderModels
              .filter(
                (f) =>
                  f.glbStatus?.salesOrderStatus !==
                  SalesOrderStatus.MODEL_REG_DISCARDED
              )
              .map(
                (model: salesOrderProductRType, index: number) =>
                  orderModelsSelect === model.id && (
                    <div key={index} className="flex flex-col gap-15 mt-20">
                      <div className="flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 p-15 gap-10 min-w-[1490px]">
                        <SalesModelHead
                          read={true}
                          model={model}
                          handleModelDataChange={handleModelDataChange}
                          boardGroup={boardGroup}
                          boardGroupSelectList={boardGroupSelectList}
                          boardSelectList={boardSelectList}
                          metarialSelectList={metarialSelectList}
                          selectId={selectId ?? ""}
                          newFlag={newFlag}
                          inputRef={inputRef}
                          index={index}
                        />
                        <AntdTable
                          columns={salesOrderModelReadClmn(
                            unitSelectList,
                            vcutSelectList,
                            outSelectList,
                            smPrintSelectList,
                            smColorSelectList,
                            smTypeSelectList,
                            mkPrintSelectList,
                            mkColorSelectList,
                            mkTypeSelectList,
                            spPrintSelectList,
                            spTypeSelectList,
                            surfaceSelectList
                          )}
                          data={[model]}
                          styles={{
                            th_bg: "#F9F9FB",
                            th_ht: "30px",
                            th_fw: "bold",
                            td_ht: "170px",
                            td_pd: "15px 3.8px",
                            td_bg: "#FFF",
                            round: "0",
                          }}
                          tableProps={{ split: "none" }}
                        />
                      </div>
                    </div>
                  )
              )}
          </Popup>
        </div>

        {/* 우측 탭 */}
        <RightTab className="!h-[calc(100vh-132px)]" key="contents-tab">
          <IconButton
            size="lg"
            icon={<User />}
            onClick={() => {
              setSelectTabDrawer(1);
              setDrawerOpen(true);
            }}
          />
          <IconButton
            size="lg"
            icon={<Category />}
            onClick={() => {
              setSelectTabDrawer(2);
              setDrawerOpen(true);
            }}
          />
        </RightTab>
      </div>

      <AddDrawer
        order={(queryOrderModelData?.data?.data ?? {}) as salesOrderDetailRType}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectTabDrawer={selectTabDrawer}
        setSelectTabDrawer={setSelectTabDrawer}
        products={data}
        setProducts={setData}
        setNewFlag={setNewFlag}
        selectId={selectId}
        setSelectId={setSelectId}
        partnerId={data?.[0]?.prtInfo?.prt?.id ?? ""}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "success"
            ? "확정 저장 완료"
            : resultType === "error"
            ? "오류 발생"
            : ""
        }
        contents={
          resultType === "success" ? (
            <div>
              확정 저장에 성공했습니다.
              <br />
              사양 등록으로 이동하시겠습니까?
            </div>
          ) : resultType === "error" ? (
            <div>{errMsg}</div>
          ) : (
            <></>
          )
        }
        type={resultType === "success" ? "confirm" : "error"}
        onOk={() => {
          setResultOpen(false);
          if (resultType === "success") router.push("/sayang/sample/regist");
        }}
        onCancel={() => {
          refetch();
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "success"
            ? "이동할게요"
            : resultType === "error"
            ? "확인"
            : ""
        }
        cancelText="여기 더 있을래요"
      />

      <ToastContainer />
    </>
  );
};

SayangModelAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="모델 등록" modal={true} head={true}>
    {page}
  </MainPageLayout>
);

export default SayangModelAddPage;
