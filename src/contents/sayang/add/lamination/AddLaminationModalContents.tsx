import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "antd";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { specType } from "@/data/type/sayang/sample";

import useToast from "@/utils/useToast";

import AntdInputRound from "@/components/Input/AntdInputRound";
import AntdSelectRound from "@/components/Select/AntdSelectRound";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import { LabelMedium } from "@/components/Text/Label";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AutoHideTooltip from "@/components/Tooltip/AntdHideTooltip";

import Edit from "@/assets/svg/icons/edit.svg";
import Back from "@/assets/svg/icons/back.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Check from "@/assets/svg/icons/s_check.svg";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Bag from "@/assets/svg/icons/bag.svg";

import { generateFloorOptions, LamDtlTypeEm, LayerEm } from "@/data/type/enum";
import { specLaminationType } from "@/data/type/sayang/lamination";
import {
  laminationCUType,
  laminationSourceList,
  newLaminationCUType,
} from "@/data/type/base/lamination";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SpecSourceRow from "./SpecSourceRow";
import LaminationRow from "./LaminationRow";
import BaseLaminationRow from "./BaseLaminationRow";

import { Popup } from "@/layouts/Body/Popup";

import { MOCK } from "@/utils/Mock";

interface Props {
  defaultLayerEm?: LayerEm;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
  handleSumbitTemp: () => void;
  baseLamination: laminationSourceList[];
  baseLaminationLoading: boolean;
  baseLaminationRefetch: () => void;
  color: string[];
  mainLamination: laminationSourceList[];
  setMainLamination: React.Dispatch<SetStateAction<laminationSourceList[]>>;
  submitFlag: boolean;
  setSubmitFlag: React.Dispatch<SetStateAction<boolean>>;
  setLamNo: React.Dispatch<SetStateAction<string>>;
}

const AddLaminationModalContents: React.FC<Props> = ({
  defaultLayerEm,
  detailData,
  setDetailData,
  handleSumbitTemp,
  baseLamination,
  baseLaminationLoading,
  baseLaminationRefetch,
  color,
  mainLamination,
  setMainLamination,
  submitFlag,
  setSubmitFlag,
  setLamNo,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 알림창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<
    "sel" | "oz" | "cf" | "error" | ""
  >("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [result, setResult] = useState<laminationSourceList | null>(null);

  // 라이브러리 ID 선택 값 저장
  const [select, setSelect] = useState<string>();
  const [selectSource, setSelectSource] = useState<specLaminationType | null>();

  // 라이브러리 필터 값 선택
  const [selectLamiEm, setSeletLamiEm] = useState<"cf" | "pp" | "ccl">("cf");
  const [selectSpecLamiFilter, setSelectSpecLamiFilter] = useState<{
    layer?: LayerEm | "";
    oz?: "cf" | "pp" | "ccl";
    thk?: number;
    cf?: number | boolean;
  }>({ cf: true });

  // 첫 모델의 Layer로 초기값 설정
  useEffect(() => {
    setSelectSpecLamiFilter({
      ...selectSpecLamiFilter,
      layer: defaultLayerEm,
    });
  }, [defaultLayerEm]);

  // ---------- 라이브러리 데이터 세팅 ---------- 시작
  const [specSourcesLoading, setSpecSourcesLoading] = useState<boolean>(true);
  const [specSources, setSpecSources] = useState<Array<specLaminationType>>([]);
  const { refetch: specSourcesRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["spec/lamination-source/jsxcrud/many"],
    queryFn: async () => {
      setSpecSourcesLoading(true);
      setSpecSources([]);

      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "spec/lamination-source/jsxcrud/many",
      });

      if (result.resultCode === "OK_0000") {
        setSpecSources(result.data?.data ?? []);
      } else {
        console.log("error:", result.response);
      }

      setSpecSourcesLoading(false);
      return result;
    },
  });
  // ---------- 라이브러리 데이터 세팅 ---------- 끝

  // 구성 요소 저장
  const [lamination, setLamination] = useState<laminationSourceList[]>([]);

  // 라이브러리 선택 시 구성 요소 보여주는 함수
  const handleSelectSource = (selectedSource?: specLaminationType) => {
    let arr = [] as laminationSourceList[];
    if (selectedSource) {
      const specDetail = selectedSource.specDetail as {
        data?: {
          index: number;
          specLamIdx: string;
        }[];
      };
      console.log(specDetail);
      specDetail.data?.map((detail) => {
        const item = baseLamination.find(
          (f) => f.id === detail.specLamIdx
        ) as laminationSourceList;
        if (item) arr.push(item);
      });
      setLamination(arr);
      setSelect(selectedSource.id);
    } else if (selectSource && typeof selectSource.specDetail !== "string") {
      selectSource.specDetail?.data?.map((detail) => {
        const item = baseLamination.find(
          (f) => f.id === detail.specLamIdx
        ) as laminationSourceList;
        if (item) arr.push(item);
      });
      setLamination(arr);
      setSelect(selectSource.id);
    }
  };

  useEffect(() => {
    // 확정된 라이브러리를 선택한 상태에서 값을 변경하면 새로 라이브러리를 추가해줘야 하므로 기존 선택된 라이브러리는 취소됨
    if (
      selectSpecLamiFilter.cf &&
      select &&
      selectSource &&
      typeof selectSource.specDetail !== "string"
    ) {
      // 기존 라이브러리가 있는데 편집을 할 경우 select가 취소되어야 함
      // 1. 구성요소 추가로 인한 길이의 값이 달라짐
      // 2. CF의 값이 달라짐
      // 3. 구성요소의 위치를 변경함 :: 드래그 시 함수 내부에서 자동 취소됨
      if (selectSource.specDetail?.data?.length !== lamination.length) {
        setSelect(undefined);
        setSelectSource(null);
      } else {
        const item = baseLamination.find(
          (f) =>
            typeof selectSource.specDetail !== "string" &&
            f.id === selectSource.specDetail?.data?.[0]?.specLamIdx
        ) as laminationSourceList;
        if (item.id !== lamination[0].id) {
          setSelect(undefined);
          setSelectSource(null);
        }
      }
    }
  }, [lamination]);

  // 베이스 적층 요소 클릭 시 메뉴 값에 따라 추가해주는 함수
  const handleMenuClick = (e: any, item: laminationSourceList) => {
    let index = 0;

    // 맨 위에 추가 (CF가 첫번째이므로 1을 넣어줌)
    if (e.key === "1") index = 1;
    // 중간에 추가
    else if (e.key === "2") index = Math.trunc(lamination.length / 2);
    // 맨 아래에 추가 (CF가 마지막이므로 -1 해줌)
    else if (e.key === "3") index = lamination.length - 1;

    // 맨 처음에 CF가 아닌 CCL, PP를 추가했을 경우 추가 안됨
    if (item.lamDtlTypeEm !== "cf" && lamination.length < 1) {
      showToast("OZ를 먼저 선택해주세요.", "error");
      return;
    } else if (item.lamDtlTypeEm === "cf") {
      // CF를 선택했으나 이미 값이 있는 경우
      if (lamination.length > 1) {
        // showToast("OZ는 한 번만 추가 가능합니다.", "error");
        setResultOpen(true);
        setResultType("oz");
        setResult(item);
        return;
      } else {
        // 위 아래로 2개 추가 됨
        setLamination((prevItems) => [item, ...prevItems, item]);
        return;
      }
    }

    // 이 외에는 index 값에 맞게 자동 추가
    setLamination((prevItems) => [
      ...prevItems.slice(0, index), // 기존 배열의 앞 부분
      item, // 추가할 아이템
      ...prevItems.slice(index), // 기존 배열의 뒷 부분
    ]);
  };

  // ---------- 적층 구조 드래그 함수 ---------- 시작
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (index === 0) {
      showToast("맨 위/맨 아래 위치는 고정되어있습니다.", "error");
      return;
    } else if (index === lamination.length - 1) {
      showToast("맨 위/맨 아래 위치는 고정되어있습니다.", "error");
      return;
    }
    setDraggedItemIndex(index);
  };

  // ★ 드래그가 종료될 때(유효/무효 상관없이) 플레이스홀더 없애기
  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    setSelectSpecLamiFilter({ ...selectSpecLamiFilter, cf: false });

    e.preventDefault();

    // 맨 위/아래 고정 로직
    if (
      lamination.length > 1 &&
      (dropIndex === 0 || dropIndex === lamination.length)
    ) {
      showToast("맨 위/맨 아래 위치는 고정되어있습니다.", "error");
      setDragOverIndex(null);
      return;
    }

    // 1) 오른쪽(BaseLaminationRow)에서 드래그해 온 데이터인지 확인
    const baseItemStr = e.dataTransfer.getData("application/base-lamination");
    if (baseItemStr) {
      // 오른쪽에서 온 새로 삽입 케이스
      try {
        const newItem = JSON.parse(baseItemStr) as laminationSourceList;

        // 예) CF 검사
        if (newItem.lamDtlTypeEm !== "cf" && lamination.length < 1) {
          showToast("OZ를 먼저 선택해주세요.", "error");
          return;
        } else if (newItem.lamDtlTypeEm === "cf") {
          if (lamination.length > 1) {
            setResultOpen(true);
            setResultType("oz");
            setResult(newItem);
            return;
          } else {
            // 위 아래로 생성
            setLamination((prev) => [newItem, ...prev, newItem]);
            return;
          }
        }

        // CF 아닐 때
        if (
          dropIndex === 0 ||
          (lamination.length > 1 && dropIndex === lamination.length)
        ) {
          showToast("맨 위/맨 아래에는 추가할 수 없습니다.", "error");
          return;
        }

        setLamination((prev) => [
          ...prev.slice(0, dropIndex),
          newItem,
          ...prev.slice(dropIndex),
        ]);

        if (selectSpecLamiFilter.cf) {
          setSelect(undefined);
          setSelectSource(null);
        }
      } catch (error) {
        console.error("JSON parse error: ", error);
      } finally {
        // ★ 드롭 후 플레이스홀더 제거
        setDragOverIndex(null);
      }
      return;
    }

    // 2) 왼쪽 목록 내부 재정렬
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      // 드롭 실패 or 같은 위치 드롭
      setDragOverIndex(null);
      return;
    }

    // 확정 라이브러리 편집 시 select 해제
    if (selectSpecLamiFilter.cf) {
      setSelect(undefined);
      setSelectSource(null);
    }

    // 재정렬
    const updated = [...lamination];
    const [movedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(dropIndex, 0, movedItem);
    setLamination(updated);

    // 드롭 후 플레이스홀더 제거
    setDragOverIndex(null);
    setDraggedItemIndex(null);
  };
  // ----------- 적층 구조 드래그 함수 ---------- 끝

  // ----------- 라이브러리 수정 함수 ----------- 시작
  // 기존에 매칭된 상태인데 라이브러리를 수정할 수 있나?... 일단 보류
  const handleSubmitTemp = async () => {
    try {
      if (selectSource?.id) {
        const jsonData = {
          specDetail: {
            data: lamination.map((d: laminationSourceList, idx: number) => ({
              index: idx,
              specLamIdx: d.id,
            })),
          },
        };
        console.log(JSON.stringify(jsonData), selectSource.id);

        const result = await patchAPI(
          {
            type: "core-d1",
            utype: "tenant/",
            url: "spec/lamination-source",
            jsx: "jsxcrud",
          },
          selectSource?.id,
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          showToast("라이브러리 수정 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          setErrMsg(msg);
          setResultType("error");
          setResultOpen(true);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ----------- 라이브러리 수정 함수 ----------- 끝

  // ------------ 임시 저장 시 함수 ----------- 시작
  const handleSubmitSaveSource = async (cf: boolean) => {
    try {
      const jsonData = {
        specDetail: {
          data: lamination.map((d: laminationSourceList, idx: number) => ({
            index: idx,
            specLamIdx: d.id,
          })),
        },
      };
      console.log(JSON.stringify(jsonData));

      const result = await postAPI(
        {
          type: "core-d1",
          utype: "tenant/",
          url: "spec/lamination-source",
          jsx: "jsxcrud",
        },
        jsonData
      );

      if (result.resultCode === "OK_0000") {
        specSourcesRefetch();
        const entity = result.data.entity as specLaminationType;
        setSpecSources([{ ...entity, confirmYn: cf ? 1 : 0 }, ...specSources]);
        // 생성 후 라이브러리 자동 선택
        setSelect(entity?.id);
        setSelectSource(entity);
        if (!cf) {
          showToast("라이브러리 추가 완료", "success");
          setSelectSpecLamiFilter({
            ...selectSpecLamiFilter,
            cf: 0,
            layer: "",
          });
        } else handleSubmitSaveSourceCf(true, entity);
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
  // ------------ 임시 저장 시 함수 ----------- 끝

  // ------------ 확정 저장 시 함수 ----------- 시작
  const handleSubmitSaveSourceCf = async (cf: boolean, entity?: any) => {
    try {
      if (selectSource?.id || entity?.id) {
        const result = await patchAPI(
          {
            type: "core-d1",
            utype: "tenant/",
            url: `spec/lamination-source/default/confirm/${
              selectSource?.id ?? entity?.id
            }`,
            jsx: "default",
            etc: true,
          },
          selectSource?.id ?? entity?.id
        );

        if (result.resultCode === "OK_0000") {
          const entity = result.data?.entity;
          setSelectSpecLamiFilter({ ...selectSpecLamiFilter, cf: 1 });
          specSourcesRefetch();
          setSelect(entity?.id);
          setSelectSource({ ...entity, confirmYn: 1 });

          if (!cf) {
            setResultType("cf");
            setResultOpen(true);
          } else {
            setDetailData({
              ...detailData,
              specLamination: { id: entity?.id, lamNo: entity?.lamNo },
              specLamNo: entity?.lamNo,
            });
            setLamNo(entity?.lamNo);
            setSubmitFlag(true);
          }
        } else {
          const msg = result?.response?.data?.message;
          setErrMsg(msg);
          setResultType("error");
          setResultOpen(true);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ------------ 확정 저장 시 함수 ----------- 끝

  // -------------- 선택 시 함수 ------------- 시작
  const handleSubmitSelectSource = async () => {
    // 메인에 해당 라이브러리 보여주기
    setMainLamination(lamination);

    // 선택된 라이브러리가 있을 경우
    if (select && selectSource) {
      setDetailData({
        ...detailData,
        specLamination: { id: select, lamNo: selectSource.lamNo },
        specLamNo: selectSource.lamNo,
      });
      setLamNo(selectSource?.lamNo ?? "");
      setSubmitFlag(true);
    } else {
      // 선택된 라이브러리가 없을 경우
      // 새 라이브러리 생성 후 해당 라이브러리 바로 확정한 뒤 메인 라이브러리의 값 임시 저장
      // handleSubmitSaveSource(true);
    }
  };
  // -------------- 선택 시 함수 ------------- 끝

  // ---------- 신규 데이터 시작 ----------
  const [lambaseType, setLambaseType] = useState<AlertType>("info");
  const [resultTitle, setResultTitle] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    type;
    setResultTitle(title);
    setResultText(text);
  }
  //등록 모달창을 위한 변수
  const [newOpen, setNewOpen] = useState<boolean>(false);
  //등록 모달창 데이터
  const [newData, setNewData] = useState<laminationCUType>(newLaminationCUType);
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
      console.log(data);
      if (data?.id) {
        const id = data.id;
        delete data.id;

        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source",
            jsx: "jsxcrud",
          },
          id,
          data
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          showToast("등록 완료", "success");
          baseLaminationRefetch();
        } else {
          setNewOpen(false);
          showToast("등록 실패", "error");
        }
      } else {
        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "lamination-source",
            jsx: "jsxcrud",
          },
          newData
        );
        console.log(result);

        if (result.resultCode === "OK_0000") {
          setNewOpen(false);
          showToast("등록 완료", "success");
          baseLaminationRefetch();
        } else {
          setNewOpen(false);
          showToast("등록 실패", "error");
        }
      }
    } catch (e) {
      setNewOpen(false);
      showToast("등록 실패", "error");
    }
  };
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
    setNewData(newLaminationCUType);
  }

  return (
    <div className="v-h-center gap-20 px-10">
      <Popup className="!min-w-[319px] !h-[612px]">
        <div className="v-between-h-center h-40">
          <LabelMedium label="적층구조 라이브러리" />
          <div className="w-96 h-24 flex v-h-center">
            <div
              onClick={() =>
                setSelectSpecLamiFilter({ ...selectSpecLamiFilter, cf: 1 })
              }
              className="w-42 v-h-center cursor-pointer"
              style={
                selectSpecLamiFilter.cf
                  ? { border: "1.6px solid #4880FF", color: "#4880FF" }
                  : { border: "1px solid #D5D5D5" }
              }
            >
              확정
            </div>
            <div
              onClick={() =>
                setSelectSpecLamiFilter({ ...selectSpecLamiFilter, cf: 0 })
              }
              className="w-55 v-h-center cursor-pointer"
              style={
                !selectSpecLamiFilter.cf
                  ? { border: "1.6px solid #4880FF", color: "#4880FF" }
                  : { border: "1px solid #D5D5D5" }
              }
            >
              미확정
            </div>
          </div>
        </div>
        <div className="h-32 v-between-h-center">
          <AntdSelectRound
            options={[{ value: "", label: "전체" }, ...generateFloorOptions()]}
            placeholder={"층선택"}
            value={selectSpecLamiFilter.layer}
            onChange={(e) => {
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                layer: (e + "") as LayerEm,
              });
            }}
            className="w-82"
          />
          <AntdSelectRound
            options={
              baseLamination
                .filter((f) => f.lamDtlTypeEm === "cf")
                .map((f) => ({
                  value: f.id,
                  label: "(" + f.matNm + ")" + f.code + "T",
                })) ?? []
            }
            value={selectSpecLamiFilter.oz}
            onChange={(e) =>
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                oz: (e + "") as LamDtlTypeEm,
              })
            }
            placeholder={"OZ선택"}
            className="w-88"
          />
          <AntdInputRound
            value={selectSpecLamiFilter.thk}
            onChange={(e) =>
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                thk: Number(e.target.value),
              })
            }
            placeholder={"두께"}
            className="w-69"
            type="number"
          />
        </div>
        <div className="h-[440px] overflow-y-auto">
          {!specSourcesLoading &&
            specSources
              .filter((source: specLaminationType) => {
                if (!selectSpecLamiFilter.layer) return true;
                else return source.layerEm === selectSpecLamiFilter.layer;
              })
              .filter((source: specLaminationType) => {
                if (!selectSpecLamiFilter.thk) return true;
                else return source.lamThk === selectSpecLamiFilter.thk;
              })
              .filter(
                (source: specLaminationType) =>
                  source.confirmYn === (selectSpecLamiFilter.cf ? true : false)
              )
              .map((source: specLaminationType, index: number) => (
                <SpecSourceRow
                  key={source.id}
                  source={source}
                  index={index}
                  isSelected={select === source.id}
                  onSelect={(selectedSource) => {
                    if (select && select === selectedSource.id) {
                      setSelect(undefined);
                      setLamination([]);
                      setSelectSource({ ...selectSource, confirmYn: 0 });
                    } else {
                      setSelectSource(selectedSource);
                      if (!selectSpecLamiFilter.cf && lamination.length > 0) {
                        setResultOpen(true);
                        setResultType("sel");
                      } else {
                        handleSelectSource(selectedSource);
                      }
                    }
                  }}
                  selectMenuClick={(specLaminationType) => {
                    setSelectSource(specLaminationType);
                    handleSelectSource(specLaminationType);
                    handleSubmitSaveSource(false);
                  }}
                />
              ))}
        </div>
      </Popup>
      <Popup className="!min-w-[298px] !h-[612px] !v-h-center">
        <div className="v-between-h-center h-40 w-full mb-20">
          <div style={{ position: "relative", zIndex: 9999 }}>
            <AutoHideTooltip
              title={
                selectSource?.confirmYn
                  ? "확정 라이브러리 변경 불가"
                  : "마우스 Drag & Drop으로 순서 변경"
              }
              getPopupContainer={() => document.body}
              time={1000}
            >
              <span>
                <LabelMedium label="적층구조 라이브러리 구성/편집" />
              </span>
            </AutoHideTooltip>
          </div>
          <div
            className="w-24 h-24 flex v-h-center border-1 border-line rounded-4 cursor-pointer"
            onClick={() => {
              setLamination(mainLamination);
              setTimeout(() => {
                setSelect(detailData?.specLamination?.id);
              }, 100);
            }}
          >
            <AutoHideTooltip
              title="편집 이전 상태로 초기화"
              getPopupContainer={() => document.body}
              time={1000}
            >
              <p className="w-16 h-16 text-[#FE5C73]">
                <Back />
              </p>
            </AutoHideTooltip>
          </div>
        </div>
        <div
          className="w-full h-[440px] overflow-y-auto"
          style={selectSource?.confirmYn ? { cursor: "no-drop" } : {}}
        >
          <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
            {Array.isArray(lamination) &&
              lamination.length > 0 &&
              lamination.map((item: laminationSourceList, i: number) => (
                <div key={item.id + ":" + i} style={{ position: "relative" }}>
                  {/* 드래그 시 내려놓을 위치 표시 */}
                  {dragOverIndex === i && (
                    <div
                      style={{
                        height: 10,
                        backgroundColor: "#EBF3FF", // 원하는 색상
                        border: "1px dashed #4880FF",
                      }}
                    />
                  )}
                  {/* 실제 아이템 영역 (드래그 이벤트들) */}
                  <div
                    draggable={selectSource?.confirmYn ? false : true}
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(i);
                    }}
                    onDrop={(e) => {
                      handleDrop(e, i);
                      setDragOverIndex(null); // 드롭하면 초기화
                    }}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor:
                        item.lamDtlTypeEm !== "cf" && selectSource?.confirmYn
                          ? "no-drop"
                          : "grab",
                    }}
                  >
                    <LaminationRow
                      key={item.id + ":" + i}
                      item={item}
                      index={i}
                      color={color}
                      lamination={lamination}
                      setLamination={setLamination}
                      disable={selectSource?.confirmYn ? true : false}
                    />
                  </div>
                </div>
              ))}
            <div
              style={{ height: 26 }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(lamination.length);
              }}
              onDragEnd={handleDragEnd}
              onDrop={(e) => {
                handleDrop(e, lamination.length);
                setDragOverIndex(null);
              }}
            >
              {lamination.length < 1 && (
                <div className="v-h-center text-center w-full text-[#00000060]">
                  확정된 라이브러리 선택
                  <br />
                  또는
                  <br />
                  구성요소 Drag & Drop으로 라이브러리 생성
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full v-h-center gap-10">
          {selectSpecLamiFilter.cf ? (
            <Button
              className="h-32 rounded-6"
              onClick={() => {
                handleSubmitSelectSource();
              }}
            >
              <p className="w-16 h-16 text-[#222222]">
                <Check />
              </p>{" "}
              선택
            </Button>
          ) : (
            <>
              <Button
                className="h-32 rounded-6"
                onClick={() => {
                  handleSubmitSaveSource(false);
                }}
              >
                임시 저장
              </Button>
              <Button
                className="h-32 rounded-6"
                style={{ color: "#ffffffE0", backgroundColor: "#4880FF" }}
                onClick={() => {
                  if (selectSource?.id) {
                    handleSubmitSaveSourceCf(false);
                  } else {
                    showToast("확정할 라이브러리를 선택해주세요.", "error");
                  }
                }}
              >
                <Arrow /> 확정 저장
              </Button>
            </>
          )}
        </div>
      </Popup>
      <Popup className="!min-w-[350px] !h-[612px]">
        <div className="v-between-h-center h-40 w-full">
          <p className="text-16 font-medium">적층구조 구성요소</p>
          <AutoHideTooltip
            title="적층구조의 구성요소를 추가할 수 있어요"
            time={1000}
          >
            <Button
              className="v-h-center !p-4 !rounded-50 !borer-1 !border-[#008A1E] !w-23 !h-23"
              onClick={() => {
                setNewOpen(true);
              }}
            >
              <p className="w-16 h-16">
                <SplusIcon />
              </p>
            </Button>
          </AutoHideTooltip>
          <div className="w-[128px] h-24 flex v-h-center">
            <div
              className="w-43 v-h-center cursor-pointer"
              onClick={() => {
                setSeletLamiEm("cf");
              }}
              style={
                selectLamiEm === "cf"
                  ? { border: "1.6px solid #4880FF", color: "#4880FF" }
                  : { border: "1px solid #D5D5D5", color: "#22222285" }
              }
            >
              C/F
            </div>
            <div
              className="w-42 v-h-center cursor-pointer"
              onClick={() => {
                setSeletLamiEm("pp");
              }}
              style={
                selectLamiEm === "pp"
                  ? { border: "1.6px solid #4880FF", color: "#4880FF" }
                  : { border: "1px solid #D5D5D5", color: "#22222285" }
              }
            >
              P/P
            </div>
            <div
              className="w-45 v-h-center cursor-pointer"
              onClick={() => {
                setSeletLamiEm("ccl");
              }}
              style={
                selectLamiEm === "ccl"
                  ? { border: "1.6px solid #4880FF", color: "#4880FF" }
                  : { border: "1px solid #D5D5D5", color: "#22222285" }
              }
            >
              CCL
            </div>
          </div>
        </div>
        <div className="h-[440px] overflow-y-auto text-12">
          <AutoHideTooltip
            title={
              selectSource?.confirmYn
                ? "확정 라이브러리 변경 불가"
                : "마우스 Drag & Drop으로 구성요소 추가"
            }
            getPopupContainer={() => document.body}
            time={1000}
          >
            <div className="h-40 bg-back v-between-h-center">
              <p className="flex-1 w-70 v-h-center">재질</p>
              <p className="w-56 v-h-center">동박</p>
              <p className="w-56 v-h-center">두께</p>
              <p className="w-56 v-h-center">실두께</p>
              <div className="w-34 v-h-center"></div>
            </div>
          </AutoHideTooltip>
          <div>
            {!baseLaminationLoading &&
              baseLamination
                .filter(
                  (f: laminationSourceList) => f.lamDtlTypeEm === selectLamiEm
                )
                .map((item: laminationSourceList, index: number) => (
                  <BaseLaminationRow
                    key={item.id + ":" + index}
                    item={item}
                    onMenuClick={handleMenuClick}
                    index={index}
                    onDragEnd={handleDragEnd}
                    disabled={selectSource?.confirmYn ? true : false}
                  />
                ))}
          </div>
        </div>
      </Popup>

      <BaseInfoCUDModal
        title={{
          name: `적층구조 ${newData?.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        open={newOpen}
        setOpen={setNewOpen}
        onClose={() => modalClose()}
        items={MOCK.laminationItems.CUDPopItems}
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "sel"
            ? "편집중인 라이브러리가 저장되지 않은 상태입니다."
            : resultType === "cf"
            ? "라이브러리 확정 완료"
            : resultType === "error"
            ? "오류 발생"
            : "OZ는 하나만 추가할 수 있습니다."
        }
        contents={
          resultType === "sel" ? (
            <div>
              변경된 내용을 저장하지 않고 선택한 라이브러리로 변경하시겠습니까?
            </div>
          ) : resultType === "cf" ? (
            <div>
              라이브러리를 확정하였습니다.
              <br />
              해당 라이브러리로 변경하시겠습니까?
            </div>
          ) : resultType === "error" ? (
            <div>{errMsg}</div>
          ) : (
            <div>선택하신 OZ로 변경하시겠습니까?</div>
          )
        }
        type="warning"
        onOk={() => {
          if (resultType === "sel") {
            handleSelectSource(selectSource ?? {});
          } else if (resultType === "error") {
            setResultOpen(false);
            return;
          } else if (resultType === "cf") {
            handleSubmitSelectSource();
          } else {
            if (result) {
              const newLami = lamination.slice(1, -1);
              setLamination([result, ...newLami, result]);
            }
          }
          setResultOpen(false);
        }}
        onCancel={() => {
          setResultOpen(false);
        }}
        hideCancel={resultType === "error"}
        okText={resultType === "error" ? "확인" : "변경 할래요"}
        cancelText="변경 안할래요"
      />

      <ToastContainer />
    </div>
  );
};

export default AddLaminationModalContents;
