import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import { AlertType } from "@/components/Modal/AntdAlertModal";
import CustomTree from "@/components/Tree/CustomTree";
import useToast from "@/utils/useToast";
import { treeType } from "@/data/type/componentStyles";
import {
  onTreeAdd,
  onTreeDelete,
  onTreeEdit,
  updateTreeDatas,
} from "@/utils/treeCUDfunc";
import { Spin } from "antd";
import { port } from "@/pages/_app";
import cookie from "cookiejs";

const WkProcessGroupListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 리스트 데이터 시작 ---------
  const [treeData, setTreeData] = useState<treeType[]>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
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
        let childArr: processRType[] = [];

        const arr = (result.data?.data ?? []).map(
          (group: processGroupRType) => ({
            id: group.id,
            label: group.prcGrpNm,
            ordNo: group.ordNo,
            children: group.processes
              .sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0))
              .map((process: processRType) => {
                const child = {
                  id: process.id,
                  label: process.prcNm,
                  wipPrcNm: process.wipPrcNm,
                  isInternal: process.isInternal,
                  ordNo: process.ordNo,
                };
                childArr.push(child);
                return child;
              }),
            open: true,
          })
        );
        setTreeData(arr);
        setAddParentEditsInfo(arr);
        setAddChildEditsInfo(childArr);
      } else {
        console.log("error:", result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 tree 데이터 시작 ----------
  const [addList, setAddList] = useState<any[]>([]);
  const [editList, setEditList] = useState<any[]>([]);
  const [deleteList, setDeleteList] = useState<{ type: string; id: string }[]>(
    []
  );
  const [addParentEditsInfo, setAddParentEditsInfo] = useState<any[]>([]);
  const [addChildEditsInfo, setAddChildEditsInfo] = useState<any[]>([]);

  const addEdits = {
    info: addParentEditsInfo,
    setInfo: setAddParentEditsInfo,
    childInfo: addChildEditsInfo,
    setChildInfo: setAddChildEditsInfo,
    addChildEditList: (
      port === "3000" ? cookie.get("companySY") === "sy" : port === "90"
    )
      ? [
          { type: "input", key: "wipPrcNm", name: "WIP 공정명" },
          { type: "switch", key: "isInternal", name: "내부 여부" },
        ]
      : [{ type: "switch", key: "isInternal", name: "내부 여부" }],
  };

  // 트리데이터 submit 함수
  async function onTreeSubmit() {
    console.log(addList, editList, deleteList);
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

    for (const item of updatedAddList) {
      let url: string = "process-group";
      let parent: string = "";
      const jsonData: { [key: string]: any; useYn: boolean } = { useYn: true };

      if (item.parentId) {
        url = "process";
        parent = "process-group";
        jsonData.processGroup = { id: item.parentId };
        jsonData.prcNm = item.label;
        jsonData.ordNo = item.ordNo;
        jsonData.isInternal = item.isInternal ?? true;
      } else {
        jsonData.prcGrpNm = item.label;
        jsonData.ordNo = item.ordNo;
      }
      result = await onTreeAdd(url, jsonData);
      if (!result) {
        showToast("데이터 추가중 오류가 발생했습니다.", "error");
      }
      console.log("add", result);
    }

    for (const item of finalEditList) {
      let url: string = "process-group";
      const jsonData: { [key: string]: any; useYn: boolean } = { useYn: true };

      if (item.parentId) {
        url = "process";
        jsonData.processGroup = { id: item.parentId };
        jsonData.prcNm = item.label;
        jsonData.ordNo = Number(item.ordNo);
        jsonData.wipPrcNm = item.wipPrcNm;
        jsonData.isInternal = item.isInternal;
      } else {
        jsonData.prcGrpNm = item.label;
        jsonData.ordNo = Number(item.ordNo);
      }
      result = await onTreeEdit(item, url, jsonData);
      if (!result) {
        showToast("데이터 수정중 오류가 발생했습니다.", "error");
      }
    }

    for (const item of updatedDeleteList) {
      let url: string = "process-group";
      if (item.type === "child") {
        url = "process";
      }
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
      refetch();
    }
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
          <div className="!h-[calc(100vh-210px)] h-full">
            <CustomTree
              data={treeData}
              onSubmit={onTreeSubmit}
              setAddList={setAddList}
              setEditList={setEditList}
              setDelList={setDeleteList}
              addEdits={addEdits}
            />
          </div>
        </>
      )}

      <ToastContainer />
    </>
  );
};

WkProcessGroupListPage.layout = (page: React.ReactNode) => (
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

export default WkProcessGroupListPage;
