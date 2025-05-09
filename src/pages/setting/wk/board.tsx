import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CardInputList from "@/components/List/CardInputList";
import AntdModal from "@/components/Modal/AntdModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  BoardGroupType,
  boardReq,
  boardType,
  newDataBoardType,
  setDataBoardType,
} from "@/data/type/base/board";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { useEffect, useState } from "react";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { deleteAPI } from "@/api/delete";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import { CUtreeType, treeType } from "@/data/type/componentStyles";
import {
  onTreeAdd,
  onTreeDelete,
  onTreeEdit,
  updateTreeDatas,
} from "@/utils/treeCUDfunc";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";

const WkBoardListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  // true - 등록 눌렸을 때 (저장 시 false)
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  const [addData, setAddData] = useState<boardType>(newDataBoardType);
  const [data, setData] = useState<Array<boardType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["setting", "wk", "board", pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "board/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          sort: "ordNo,ASC",
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
  function changeNewData(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: "input" | "select" | "date" | "other"
  ) {
    if (typeof e === "string") {
      setAddData((prev) => ({ ...prev, [name]: e } as boardType));
    } else {
      const { value } = e.target;
      setAddData((prev) => ({ ...prev, [name]: value } as boardType));
    }
  }
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }

  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>("info");
  const [resultTitle, setResultTitle] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const { showToast, ToastContainer } = useToast();

  const regBoard = async () => {
    const val = validReq(addData, boardReq());
    if (!val.isValid) {
      showToast(val.missingLabels + "은(는) 필수 입력입니다.", "error");
      return;
    }

    const result = await postAPI(
      {
        type: "baseinfo",
        utype: "tenant/",
        url: "board",
        jsx: "jsxcrud",
      },
      {
        brdType: addData?.brdType,
        brdDesc: addData?.brdDesc,
        brdW: addData?.brdW,
        brdH: addData?.brdH,
      } as boardType
    );

    if (result.resultCode === "OK_0000") {
      showToast("등록 완료", "success");
    } else {
      showToast(result?.response?.data?.message, "error");
    }
    refetch();
    setAddOpen(false);
  };

  // 수정 함수
  const handleSubmit = async (data: boardType) => {
    try {
      if (data?.id) {
        const id = data.id;
        delete data.id;
        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "board",
            jsx: "jsxcrud",
          },
          id,
          data
        );

        if (result.resultCode === "OK_0000") {
          setAddOpen(false);
          setResultFunc(
            "success",
            "수정 성공",
            "원판정보 수정이 완료되었습니다"
          );
        } else {
          setAddOpen(false);
          setResultFunc(
            "error",
            "수정 실패",
            "원판정보 수정을 실패하였습니다."
          );
        }

        refetch();
      } else {
        const val = validReq(addData, boardReq());
        if (!val.isValid) {
          showToast(val.missingLabels + "은(는) 필수 입력입니다.", "error");
          return;
        }

        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "board",
            jsx: "jsxcrud",
          },
          data
        );

        if (result.resultCode === "OK_0000") {
          setAddOpen(false);
          setResultFunc("success", "등록 성공", "원판정보 등록되었습니다.");
        } else {
          setAddOpen(false);
          setResultFunc(
            "success",
            "등록 실패",
            "원판정보 등록을 실패하였습니다."
          );
        }
        refetch();
        setAddOpen(false);
      }
      // const newData = data[editIndex];
      // console.log(newData);
    } catch (e) {
      showToast(
        "원판 등록 중 문제가 발생하였습니다. 잠시후 다시 이용해주세요.",
        "error"
      );
      refetch();
    }
  };

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "board",
          jsx: "jsxcrud",
        },
        id
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setAddOpen(false);
        setResultFunc(
          "success",
          "삭제 성공",
          "원판정보 삭제가 완료되었습니다."
        );
      } else {
        setAddOpen(false);
        setResultFunc("error", "삭제 실패", "원판정보 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setAddOpen(false);
      setResultFunc("error", "삭제 실패", "원판정보 삭제를 실패하였습니다.");
    }
  };

  // 엔터 시 data의 값이 변경되므로 useEffect로 자동 insert / update 되도록 변경

  function modalClose() {
    setAddOpen(false);
    setAddData(newDataBoardType);
  }

  // ---------- 트리 관련 시작 ----------
  const [bdGroupOpen, setBdGroupOpen] = useState<boolean>(false);
  const [boardGroupTreeData, setBoardGroupTreeData] = useState<any>([]);

  // 트리를 사용하는 메뉴인 경우, 추가, 수정, 삭제를 하기위한 리스트, 한번에 submit을 하기때문에 각각의 리스트를 만들어서 한번에 처리
  const [addList, setAddList] = useState<CUtreeType[]>([]);
  const [editList, setEditList] = useState<CUtreeType[]>([]);
  const [deleteList, setDeleteList] = useState<{ type: string; id: string }[]>(
    []
  );

  const { refetch: groupRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board-group/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "board-group/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d: BoardGroupType) => ({
          id: d.id,
          label: d.brdGrpName,
          ordNo: d.ordNo,
          useYn: d.useYn,
          open: true,
        }));
        setBoardGroupTreeData(arr);

        const addList = (result.data?.data ?? []).map((d: BoardGroupType) => ({
          value: d.id,
          label: d.brdGrpName,
        }));
        console.log(addList);
        // setAddModalInfoList((prev:any) => prev.map((d:any) => d.name === 'materialGroup.id' ? {...d, option: addList} : d));
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  async function onBoardGroupPopSubmit(list: treeType[]) {
    const { updatedAddList, finalEditList, updatedDeleteList } =
      updateTreeDatas(addList, editList, deleteList);
    console.log(
      "add:",
      updatedAddList,
      "edit:",
      finalEditList,
      "delete: ",
      updatedDeleteList
    );
    let result = false;
    const url = "board-group";

    console.log(updatedAddList);
    for (const item of updatedAddList) {
      const jsonData = { brdGrpName: item.label, ordNo: 1, useYn: true };

      result = await onTreeAdd(url, jsonData);

      if (!result) {
        showToast("데이터 추가중 오류가 발생했습니다.", "error");
      }
      console.log("add", result);
    }

    for (const item of finalEditList) {
      const jsonData = { brdGrpName: item.label, ordNo: Number(item.ordNo) };

      result = await onTreeEdit(item, url, jsonData);
      if (!result) {
        showToast("데이터 수정중 오류가 발생했습니다.", "error");
      }
    }

    for (const item of updatedDeleteList) {
      result = await onTreeDelete(item, url);

      if (!result) {
        showToast("데이터 삭제중 오류가 발생했습니다.", "error");
      }
    }
    console.log(result);
    if (result) {
      setAddList([]);
      setEditList([]);
      setDeleteList([]);
      showToast("저장이 완료되었습니다.", "success");
      groupRefetch();
    }
  }
  // ---------- 트리 관련 끝 ----------

  return (
    <>
      {dataLoading && (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {!dataLoading && (
        <>
          <div className="h-center justify-between pb-10">
            <p>총 {totalData}건</p>

            <div className="flex gap-10">
              <div
                className="w-[130px] h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
                onClick={() => {
                  setBdGroupOpen(true);
                }}
              >
                원판 그룹 관리
              </div>
              <div
                className="w-80 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
                onClick={() => {
                  setAddOpen(true);
                }}
              >
                등록
              </div>
            </div>
          </div>

          <AntdTableEdit
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
                title: "원판유형",
                width: 150,
                dataIndex: "brdType",
                key: "brdType",
                align: "center",
                render: (_, record) => (
                  <div
                    className="w-full h-full h-center justify-center cursor-pointer reference-detail"
                    onClick={() => {
                      setAddData(setDataBoardType(record));
                      setAddOpen(true);
                    }}
                  >
                    {record.brdType}
                  </div>
                ),
              },
              {
                title: "원판설명",
                width: 130,
                dataIndex: "brdDesc",
                key: "brdDesc",
                align: "center",
              },
              {
                title: "W",
                width: 150,
                dataIndex: "brdW",
                key: "brdW",
                align: "center",
                inputType: "number",
              },
              {
                title: "H",
                width: 150,
                dataIndex: "brdH",
                key: "brdW",
                align: "center",
                inputType: "number",
              },
            ]}
            data={data}
            setData={setData}
            setEditIndex={setEditIndex}
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
        title={{ name: `원판 ${addData?.id ? "수정" : "등록"}`, icon: <Bag /> }}
        open={addOpen}
        setOpen={setAddOpen}
        onClose={() => modalClose()}
        items={MOCK.wkBoardItems.CUDPopItems}
        data={addData}
        onSubmit={handleSubmit}
        onDelete={handleDataDelete}
      />

      <BaseTreeCUDModal
        title={{ name: `원판 그룹 관리` }}
        open={bdGroupOpen}
        setOpen={setBdGroupOpen}
        data={boardGroupTreeData}
        isChild={false}
        onClose={() => setBdGroupOpen(false)}
        onSubmit={onBoardGroupPopSubmit}
        onUpdateDataFunc={{
          addList: addList,
          editList: editList,
          deleteList: deleteList,
          setAddList: setAddList,
          setEditList: setEditList,
          setDeleteList: setDeleteList,
        }}
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
          setAddData(newDataBoardType);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

WkBoardListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default WkBoardListPage;
