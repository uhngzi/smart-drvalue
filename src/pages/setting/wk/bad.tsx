import { deleteAPI } from "@/api/delete";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import CustomTreeUsed from "@/components/Tree/CustomTreeUsed";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import {
  onTreeAdd,
  onTreeDelete,
  onTreeEdit,
  updateTreeDatas,
} from "@/utils/treeCUDfunc";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { CheckboxChangeEvent } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WkBadListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // ---------- 필요 데이터 ---------- 시작
  const [addChildEditsInfo, setAddChildEditsInfo] = useState<any[]>([]);

  const addEdits = {
    childInfo: addChildEditsInfo,
    setChildInfo: setAddChildEditsInfo,
    addChildEditList: [{ type: "input", key: "badDesc", name: "불량 내용" }],
  };

  const [processId, setProcessId] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<treeType[]>([]);
  const [badGroupData, setBadGroupData] = useState<treeType[]>([]);
  const [procBadData, setProcBadData] = useState<
    { matchId: string; checkId: string }[]
  >([]);
  const { data: queryTreeData } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-group/jsxcrud/many"],
    queryFn: async () => {
      //공정그룹 목록 조회
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
        const arr = (result.data?.data ?? []).map(
          (group: processGroupRType) => ({
            id: group.id,
            label: group.prcGrpNm,
            ordNo: group.ordNo,
            children: group.processes
              .sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0))
              .map((process: processRType) => ({
                id: process.id,
                label: process.prcNm,
                isInternal: process.isInternal,
                ordNo: process.ordNo,
              })),
            open: true,
          })
        );
        setTreeData(arr);
      } else {
        console.log("error:", result.response);
      }
      console.log(result.data);
      return result;
    },
  });
  const { refetch: badGroupRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-bad-group/jsxcrud/many"],
    queryFn: async () => {
      //공정 불량 그룹 목록 조회
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process-bad-group/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((group: any) => ({
          id: group.id,
          label: group.badGrpNm,
          ordNo: group.ordNo,
          children: group.processBads
            .sort((a: any, b: any) => a.ordNo - b.ordNo)
            .map((process: any) => ({
              id: process.id,
              label: process.badNm,
              badDesc: process.badDesc || "",
              ordNo: process.ordNo,
            })),
          open: true,
        }));
        setBadGroupData(arr);
        const childInfoArr = (result.data?.data ?? []).flatMap((d: any) =>
          (d.processBads ?? []).map((c: any) => ({
            id: c.id,
            label: c.badNm,
            badDesc: c.badDesc,
            ordNo: c.ordNo,
          }))
        );
        setAddChildEditsInfo(childInfoArr);
      } else {
        console.log("error:", result.response);
      }
      console.log(result.data);
      return result;
    },
  });

  useEffect(() => {
    if (processId == null) {
      setProcBadData([]);
    }
  }, [processId]);

  const { refetch: procBadRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process/bad-mapping/jsxcrud/many", processId],
    queryFn: async () => {
      //공정 불량 매핑 조회
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: `process/bad-mapping/jsxcrud/many`,
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? [])
          .filter((d: any) => d.process.id === processId)
          .map((d: any) => ({
            matchId: d.id,
            checkId: d.processBad.id,
          }));

        setProcBadData(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: !!processId,
  });

  const handleCheck = async (e: CheckboxChangeEvent, matchId: any) => {
    if (!processId) {
      showToast("공정을 먼저 선택해주세요.", "error");
      return;
    }
    console.log(e.target.checked, matchId, e.target.value);
    const data = {
      process: {
        id: processId,
      },
      processBad: {
        id: e.target.value,
      },
    };

    if (e.target.checked) {
      const result = await postAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process/bad-mapping",
          jsx: "jsxcrud",
        },
        data
      );
      if (result.resultCode === "OK_0000") {
        setProcBadData((prev) => [
          ...prev,
          { matchId: result.data?.data.id, checkId: e.target.value },
        ]);
        showToast("저장이 완료되었습니다.", "success");
      } else {
        console.log("error:", result.response);
      }
    } else {
      const dResult = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: `process/bad-mapping`,
          jsx: "jsxcrud",
        },
        matchId
      );
      if (dResult.resultCode === "OK_0000") {
        setProcBadData((prev) =>
          prev.filter((item) => item.matchId !== matchId)
        );
        showToast("삭제가 완료되었습니다.", "success");
      }
    }
    setProcBadData((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((id) => id !== e.target.value);
      } else {
        return [...prev, e.target.value];
      }
    });
  };

  // ---------- 필요 데이터 ---------- 끝

  const [addList, setAddList] = useState<any[]>([]);
  const [editList, setEditList] = useState<any[]>([]);
  const [deleteList, setDeleteList] = useState<{ type: string; id: string }[]>(
    []
  );
  const [badPopOpen, setBadPopOpen] = useState<boolean>(false);

  async function onBadPopSubmit(list: treeType[]) {
    const { updatedAddList, finalEditList, updatedDeleteList } =
      updateTreeDatas(addList, editList, deleteList);
    let result: boolean = false;

    for (const item of updatedAddList) {
      const jsonData: { [key: string]: any; useYn: boolean } = {
        useYn: true,
        ordNo: item.ordNo,
      };
      let url = "";
      if (item.parentId) {
        url = "process/bad";
        jsonData.processBadGroup = { id: item.parentId };
        jsonData.badNm = item.label;
        jsonData.badDesc = item.badDesc;
      } else {
        url = "process-bad-group";
        jsonData.badGrpNm = item.label;
      }
      console.log("add :: ", JSON.stringify(jsonData));
      result = await onTreeAdd(url, jsonData);

      if (!result) {
        showToast("데이터 추가중 오류가 발생했습니다.", "error");
      }
      console.log("add", result);
    }

    for (const item of finalEditList) {
      const jsonData: { [key: string]: any; useYn: boolean } = {
        useYn: true,
        ordNo: Number(item.ordNo),
      };
      let url = "";
      if (item.parentId) {
        url = "process/bad";
        jsonData.processBadGroup = { id: item.parentId };
        jsonData.badNm = item.label;
        jsonData.badDesc = item.badDesc;
      } else {
        url = "process-bad-group";
        jsonData.badGrpNm = item.label;
      }
      console.log("edit :: ", JSON.stringify(jsonData));

      result = await onTreeEdit(item, url, jsonData);
      if (!result) {
        showToast("데이터 수정중 오류가 발생했습니다.", "error");
      }
    }

    for (const item of updatedDeleteList) {
      let url = "";
      if (item.type === "child") {
        url = "process/bad";
      } else {
        url = "process-bad-group";
      }
      console.log("delete :: ", JSON.stringify(item));
      result = await onTreeDelete(item, url);

      if (!result) {
        showToast("데이터 삭제중 오류가 발생했습니다.", "error");
      }
    }

    if (result) {
      setAddList([]);
      setEditList([]);
      setDeleteList([]);
      showToast("저장이 완료되었습니다.", "success");
      badGroupRefetch();
    }
  }

  function modalClose() {
    setBadPopOpen(false);
  }

  return (
    <section>
      <div className="h-center justify-end pb-20">
        <div
          className="w-90 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
          onClick={() => setBadPopOpen(true)}
        >
          불량 관리
        </div>
      </div>
      <div className="w-full flex gap-30 !h-[calc(100vh-210px)]">
        <div
          className="p-20 min-h-[600px] w-[50%] rounded-8"
          style={{ border: "1px solid #B9B9B9" }}
        >
          <CustomTreeUsed
            data={treeData}
            isSelect={true}
            selectId={processId}
            setSelectId={setProcessId}
            notCollapsed={true}
          />
        </div>
        <div
          className="p-20 min-h-[600px] w-[50%] rounded-8"
          style={{ border: "1px solid #B9B9B9" }}
        >
          <CustomTreeUsed
            data={badGroupData}
            isCheck={true}
            checkedData={procBadData}
            checkChange={handleCheck}
          />
        </div>
      </div>

      <BaseTreeCUDModal
        title={{ name: "불량 관리" }}
        open={badPopOpen}
        setOpen={setBadPopOpen}
        data={badGroupData}
        onClose={() => modalClose()}
        onSubmit={onBadPopSubmit}
        onUpdateDataFunc={{
          addList: addList,
          editList: editList,
          deleteList: deleteList,
          setAddList: setAddList,
          setEditList: setEditList,
          setDeleteList: setDeleteList,
        }}
        addEdits={addEdits}
      />
      <ToastContainer />
    </section>
  );
};

WkBadListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default WkBadListPage;
