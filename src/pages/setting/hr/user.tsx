import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

import People from "@/assets/svg/icons/people.svg";
import UserSetting from "@/assets/svg/icons/user-setting.svg";
import UserFollow from "@/assets/svg/icons/user-follow.svg";
import UserAdd from "@/assets/svg/icons/user-add.svg";
import Bag from "@/assets/svg/icons/bag.svg";

import { useEffect, useState } from "react";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { CUtreeType } from "@/data/type/componentStyles";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import {
  onTreeAdd,
  onTreeDelete,
  onTreeEdit,
  updateTreeDatas,
} from "@/utils/treeCUDfunc";
import useToast from "@/utils/useToast";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/List/AntdTable";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { MOCK } from "@/utils/Mock";
import { postAPI } from "@/api/post";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import CustomTreeUsed from "@/components/Tree/CustomTreeUsed";

const groupType = {
  dept: { name: "조직도", child: "team" },
  WORK_TYPE: { name: "근무형태", child: "" },
  JOB_TYPE: { name: "업무구분", child: "" },
  user: { name: "조직 구성원", child: "" },
};

const HrUserListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();

  const router = useRouter();

  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // 구성원 관련 변수
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

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

  const [newOpen, setNewOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<keyof typeof groupType | null>(null);
  const [newData, setNewData] = useState<any>({});
  useEffect(() => {
    console.log(newData);
  }, [newData]);

  const [baseJobData, setBaseJobData] = useState<
    { value: string; label: string }[]
  >([]);
  const [baseWorkData, setBaseWorkData] = useState<
    { value: string; label: string }[]
  >([]);

  // 트리를 사용하는 메뉴인 경우, 추가, 수정, 삭제를 하기위한 리스트, 한번에 submit을 하기때문에 각각의 리스트를 만들어서 한번에 처리
  const [addList, setAddList] = useState<CUtreeType[]>([]);
  const [editList, setEditList] = useState<CUtreeType[]>([]);
  const [deleteList, setDeleteList] = useState<{ type: string; id: string }[]>(
    []
  );

  //데이터 관련
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(
    MOCK.userItem.CUDPopItems
  );
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["dept/jsxcrud/many", newTitle],
    enabled: newTitle === "dept" || newTitle === "user",
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: `dept/jsxcrud/many`,
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        // 구성원 모달 좌측에 부서, 팀을 트리로 보여주기위한 소스
        let arr = [];
        arr = (result.data?.data ?? []).map((group: any) => ({
          id: group.id,
          label: group.deptNm,
          ordNo: group.ordNo,
          children: group.teams
            ?.sort((a: any, b: any) => a.ordNo - b.ordNo)
            ?.map((team: any) => ({
              id: team.id,
              label: team.teamNm,
              ordNo: team.ordNo,
            })),
          open: true,
        }));
        console.log(arr);
        setNewData(arr);

        // 구성원 등록시에 부서, 팀을 선택하기위한 select option을 생성하면서 동시에, 업무구분, 근무형태를 가져와서 selectOption을 생성하기 위한소스
        let baseJobData = []; // 업무구분
        let baseWorkData = []; // 근무형태
        const baseJob = await getAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: `default-metadata/jsxcrud/many`,
          },
          {
            anykeys: { type: "JOB_TYPE" },
            sort: "ordNo,ASC",
          }
        );
        if (baseJob.resultCode === "OK_0000") {
          baseJobData = baseJob.data?.data?.map((item: any) => ({
            value: item.data,
            label: item.data,
          }));
        }

        const baseWork = await getAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: `default-metadata/jsxcrud/many`,
          },
          {
            anykeys: { type: "WORK_TYPE" },
            sort: "ordNo,ASC",
          }
        );
        if (baseWork.resultCode === "OK_0000") {
          baseWorkData = baseWork.data?.data?.map((item: any) => ({
            value: item.data,
            label: item.data,
          }));
        }
        console.log(baseWorkData, baseJobData);
        setAddModalInfoList(
          MOCK.userItem.CUDPopItems.map((item) => {
            if (item.name === "deptId") {
              // 부서 option
              return {
                ...item,
                option: arr.map((group: any) => ({
                  value: group.id,
                  label: group.label,
                  children: group.children?.map((team: any) => ({
                    // 팀 option
                    value: team.id,
                    label: team.label,
                  })),
                })),
              };
            } else if (item.name === "defMetaDataWorkType") {
              // 근무형태 option
              return {
                ...item,
                option: baseWorkData,
              };
            } else if (item.name === "defMetaDataJobType") {
              // 업무구분 option
              return {
                ...item,
                option: baseJobData,
              };
            } else {
              return item;
            }
          })
        );
      } else {
        console.log("error:", result.response);
        setNewData({});
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });
  const { data: queryMetaData, refetch: metaRefetch } = useQuery<
    apiGetResponseType,
    Error
  >({
    queryKey: ["default-metadata/jsxcrud/many", newTitle],
    enabled: newTitle == "WORK_TYPE" || newTitle === "JOB_TYPE",
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: `default-metadata/jsxcrud/many`,
        },
        {
          anykeys: { type: newTitle },
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        console.log(result.data?.data);
        let arr = [];
        console.log(newTitle);
        arr = (result.data?.data ?? []).map((meta: any) => ({
          id: meta.id,
          label: meta.data,
          ordNo: meta.ordNo,
          open: true,
        }));
        console.log(arr);
        setNewData(arr);
      } else {
        console.log("error:", result.response);
        setNewData({});
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });
  const [userList, setUserList] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);

  const { isLoading: usersLoading, refetch: userRefetch } = useQuery<
    apiGetResponseType,
    Error
  >({
    queryKey: ["user/jsxcrud/many", selectedTeam, pagination.current],
    enabled: newTitle === "user",
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "auth",
          utype: "tenant/",
          url: `user/jsxcrud/many`,
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: selectedTeam
            ? { "detail.team.id": { $eq: selectedTeam } }
            : "",
        }
      );

      if (result.resultCode === "OK_0000") {
        setUserList(result.data?.data);
        setTotalData(result.data?.total ?? 0);
      } else {
        console.log("error:", result.response);
      }

      return result;
    },
  });

  async function onTreeSubmit() {
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
    if (newTitle != null) {
      if (newTitle === "dept") {
        for (const item of updatedAddList) {
          let url: string = newTitle;
          let parent: string = "";
          const jsonData: { [key: string]: any; useYn: boolean } = {
            useYn: true,
          };

          if (item.parentId) {
            url = groupType[newTitle].child;
            parent = newTitle;
            jsonData[parent] = { id: item.parentId };
            jsonData[`${groupType[newTitle].child}Nm`] = item.label;
            jsonData.ordNo = Number(item.ordNo);
          } else {
            jsonData[`${newTitle}Nm`] = item.label;
            jsonData.ordNo = Number(item.ordNo);
          }
          result = await onTreeAdd(url, jsonData);
          if (!result) {
            showToast("데이터 추가중 오류가 발생했습니다.", "error");
          }
          console.log("add", result);
        }

        for (const item of finalEditList) {
          let url: string = newTitle;
          const jsonData: { [key: string]: any; useYn: boolean } = {
            useYn: true,
          };

          if (item.parentId) {
            url = groupType[newTitle].child;
            jsonData[newTitle] = { id: item.parentId };
            jsonData[`${groupType[newTitle].child}Nm`] = item.label;
            jsonData.ordNo = Number(item.ordNo);
          } else {
            jsonData[`${newTitle}Nm`] = item.label;
            jsonData.ordNo = Number(item.ordNo);
          }
          result = await onTreeEdit(item, url, jsonData);
          if (!result) {
            showToast("데이터 수정중 오류가 발생했습니다.", "error");
          }
        }

        for (const item of updatedDeleteList) {
          let url: string = newTitle;
          if (item.type === "child") {
            url = groupType[newTitle].child;
          }
          result = await onTreeDelete(item, url);
          if (!result) {
            showToast("데이터 삭제중 오류가 발생했습니다.", "error");
          }
        }
        if (result) refetch();
      } else {
        const data = updatedAddList?.map((item) => ({
          type: newTitle,
          data: item.label,
          ordNo: item.ordNo,
          useYn: true,
        }));
        console.log(JSON.stringify(data));
        if (data.length > 0) {
          const metaCreateRes = await patchAPI(
            {
              type: "baseinfo",
              utype: "tenant/",
              url: `default-metadata/default/create-many`,
              jsx: "default",
              etc: true,
            },
            "",
            { data: data }
          );
          if (metaCreateRes.resultCode === "OK_0000") {
            result = true;
          } else {
            showToast("저장중 오류가 발생했습니다.", "error");
          }
        }
        console.log(finalEditList);
        if (finalEditList.length > 0) {
          for (const item of finalEditList) {
            const metaEditRes = await patchAPI(
              {
                type: "baseinfo",
                utype: "tenant/",
                url: `default-metadata`,
                jsx: "jsxcrud",
              },
              item.id,
              {
                type: newTitle,
                data: item.label,
                ordNo: item.ordNo,
                useYn: true,
              }
            );
            if (metaEditRes.resultCode === "OK_0000") {
              result = true;
            } else {
              showToast("저장중 오류가 발생했습니다.", "error");
            }
          }
        }
        if (updatedDeleteList.length > 0) {
          for (const item of updatedDeleteList) {
            const deleteRes = await deleteAPI(
              {
                type: "baseinfo",
                utype: "tenant/",
                url: `default-metadata`,
                jsx: "jsxcrud",
              },
              item.id
            );
            if (deleteRes.resultCode === "OK_0000") {
              result = true;
            } else {
              showToast("저장중 오류가 발생했습니다.", "error");
            }
          }
        }
        if (result) metaRefetch();
      }
    }
    console.log(result);
    if (result) {
      setAddList([]);
      setEditList([]);
      setDeleteList([]);
      showToast("저장이 완료되었습니다.", "success");
    }
  }

  const handleSubmitNewData = async (data: any) => {
    const newUserData = { status: "ACTIVE", ...data };

    console.log({ status: "ACTIVE", ...data });
    if (data?.id) {
      const id = data.id;
      delete newUserData.id;

      const result = await patchAPI(
        {
          type: "auth",
          utype: "tenant/",
          url: `user`,
          jsx: "default",
        },
        id,
        newUserData
      );

      if (result.resultCode === "OK_0000") {
        showToast("수정이 완료되었습니다.", "success");
        setUserDetailOpen(false);
        setUserData({});
        userRefetch();
      } else {
        showToast(result.response.data.message.split(",")[0], "error");
      }
    } else {
      const result = await postAPI(
        {
          type: "auth",
          utype: "tenant/",
          url: `user`,
          jsx: "default",
        },
        newUserData
      );

      if (result.resultCode === "OK_0000") {
        showToast("저장이 완료되었습니다.", "success");
        setUserDetailOpen(false);
        setUserData({});
        userRefetch();
      } else {
        showToast(result.response.data.message.split(",")[0], "error");
      }
    }
  };

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI(
        {
          type: "auth",
          utype: "tenant/",
          url: "user",
          jsx: "jsxcrud",
        },
        id
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setNewOpen(false);
        showToast("삭제가 완료되었습니다.", "success");
        userRefetch();
        setUserDetailOpen(false);
      } else {
        setNewOpen(false);
        showToast("삭제중 오류가 발생했습니다.", "error");
      }
    } catch (e) {
      setNewOpen(false);
      showToast("삭제중 오류가 발생했습니다.", "error");
    }
  };

  function modalOpen(title: keyof typeof groupType) {
    setNewOpen(true);
    setNewTitle(title);
  }

  function userAddOpen(title: keyof typeof groupType) {
    setAddUserOpen(true);
    setNewTitle(title);
  }

  function modalClose() {
    console.log("close");
    setNewTitle(null);
    setNewOpen(false);
    setNewData({});
  }

  function userModalClose() {
    setUserDetailOpen(false);
    setUserData({});
  }

  return (
    <section className="flex flex-col gap-20">
      <div>
        <p className="text-18 font-bold">조직도</p>
      </div>
      <div className="flex v-between-h-center">
        <div>
          <p className="text-16 font-medium">조직 설정하기</p>
          <p className="text-14 font-medium" style={{ color: "#00000073" }}>
            회사의 조직도를 관리해보세요.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div
          className="flex p-20 gap-10 rounded-8 h-center cursor-pointer"
          style={{ border: "1px solid #D9D9D9" }}
          onClick={() => modalOpen("dept")}
        >
          <People />
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{ color: "#000000D9" }}>
              조직도
            </span>
            <span style={{ color: "#00000073" }}>
              회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.
            </span>
          </div>
        </div>
        <div
          className="flex p-20 gap-10 rounded-8 h-center cursor-pointer"
          style={{ border: "1px solid #D9D9D9" }}
          onClick={() => modalOpen("WORK_TYPE")}
        >
          <UserSetting />
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{ color: "#000000D9" }}>
              근무형태
            </span>
            <span style={{ color: "#00000073" }}>
              회사의 근무 형태를를 설정하세요. {"예) 정규직, 비정구직, 계약직"}
            </span>
          </div>
        </div>
        <div
          className="flex p-20 gap-10 rounded-8 h-center cursor-pointer"
          style={{ border: "1px solid #D9D9D9" }}
          onClick={() => modalOpen("JOB_TYPE")}
        >
          <UserFollow />
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{ color: "#000000D9" }}>
              업무구분
            </span>
            <span style={{ color: "#00000073" }}>
              회사의 업무 구분을 설정하세요. {"예) 사무직, 연구직, 생산직"}
            </span>
          </div>
        </div>
        <div
          className="flex p-20 gap-10 rounded-8 h-center cursor-pointer"
          style={{ border: "1px solid #D9D9D9" }}
          onClick={() => userAddOpen("user")}
        >
          <UserAdd />
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{ color: "#000000D9" }}>
              조직 구성원
            </span>
            <span style={{ color: "#00000073" }}>
              회사 조직 구조에 속한 구성원을 관리하세요.
            </span>
          </div>
        </div>
      </div>

      <BaseTreeCUDModal
        title={{ name: `${newTitle != null && groupType[newTitle].name} 설정` }}
        open={newOpen}
        setOpen={setNewOpen}
        isChild={newTitle == "dept" ? true : false}
        data={newData}
        onClose={() => modalClose()}
        onSubmit={onTreeSubmit}
        onUpdateDataFunc={{
          addList: addList,
          editList: editList,
          deleteList: deleteList,
          setAddList: setAddList,
          setEditList: setEditList,
          setDeleteList: setDeleteList,
        }}
      />
      <AntdModal
        width={1300}
        title={"조직 구성원 설정"}
        draggable={true}
        open={addUserOpen}
        setOpen={setAddUserOpen}
        contents={
          <section>
            <div className="h-center justify-end pb-10">
              <div
                className="w-90 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
                onClick={() => {
                  setNewData({});
                  setUserDetailOpen(true);
                }}
              >
                구성원 관리
              </div>
            </div>
            <div className="flex gap-20 max-w-[1300px]">
              <div
                className="w-[230px] min-w-[230px] rounded-14 p-20 bg-white"
                style={{ border: "1px solid #D9D9D9" }}
              >
                <CustomTreeUsed
                  data={newData}
                  isSelect={true}
                  selectId={selectedTeam}
                  setSelectId={setSelectedTeam}
                />
              </div>
              <div className="flex-1 max-w-[1000px]">
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
                      title: "부서명",
                      minWidth: 100,
                      dataIndex: "detail.dept.deptNm",
                      key: "detail.dept.deptNm",
                      align: "center",
                      render: (_, record) => <>{record.detail?.dept?.deptNm}</>,
                    },
                    {
                      title: "팀명",
                      minWidth: 100,
                      dataIndex: "detail.team.teamNm",
                      key: "detail.team.teamNm",
                      align: "center",
                      render: (_, record) => <>{record.detail?.team?.teamNm}</>,
                    },
                    {
                      title: "이름",
                      width: 100,
                      dataIndex: "name",
                      key: "name",
                      align: "center",
                      render: (_, record) => (
                        <div
                          className="reference-detail !text-center !justify-center"
                          onClick={() => {
                            const recordData = {
                              id: record.id,
                              userName: record.name,
                              userId: record.userId,
                              empTit: record.detail?.empTit,
                              empRank: record.detail?.empRank,
                              empStDt: record.detail?.empStDt,
                              empSts: record.detail?.empSts,
                              deptId: record.detail?.dept.id,
                              teamId: record.detail?.team.id,
                              defMetaDataWorkType:
                                record.detail?.defMetaDataWorkType,
                              defMetaDataJobType:
                                record.detail?.defMetaDataJobType,
                              empRemarks: record.detail?.empRemarks,
                            };
                            console.log(recordData);
                            setUserData(recordData);
                            setUserDetailOpen(true);
                          }}
                        >
                          {record.name}
                        </div>
                      ),
                    },
                    {
                      title: "사용자 아이디",
                      width: 130,
                      dataIndex: "userId",
                      key: "userId",
                      align: "center",
                    },
                    {
                      title: "직함",
                      width: 80,
                      dataIndex: "detail.empTit",
                      key: "detail.empTit",
                      align: "center",
                      render: (_, record) => <>{record.detail?.empTit}</>,
                    },
                    {
                      title: "직급",
                      width: 80,
                      dataIndex: "detail.empRank",
                      key: "detail.empRank",
                      align: "center",
                      render: (_, record) => <>{record.detail?.empRank}</>,
                    },
                    {
                      title: "입사일",
                      width: 130,
                      dataIndex: "detail.empStDt",
                      key: "detail.empStDt",
                      align: "center",
                      render: (_, record) => <>{record.detail?.empStDt}</>,
                    },
                    {
                      title: "근무상태",
                      width: 80,
                      dataIndex: "detail.empRank",
                      key: "detail.empRank",
                      align: "center",
                      render: (_, record) => <>{record.detail?.empSts}</>,
                    },
                  ]}
                  data={userList}
                  styles={{ td_bg: "#FFF" }}
                />
                <div className="w-full h-100 h-center justify-end">
                  <AntdSettingPagination
                    current={pagination.current}
                    total={totalData}
                    size={pagination.size}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </section>
        }
      />
      <BaseInfoCUDModal
        popWidth={610}
        title={{
          name: `구성원 ${userData?.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        open={userDetailOpen}
        setOpen={setUserDetailOpen}
        onClose={() => userModalClose()}
        items={
          userData?.id
            ? [
                ...addModalInfoList?.map((f) => {
                  if (f.name === "userPassword") {
                    return {
                      name: "userPassword",
                      label: "비밀번호",
                      widthType: "third",
                      type: "password",
                      disabled: true,
                    };
                  } else {
                    return { ...f };
                  }
                }),
              ]
            : addModalInfoList
        }
        data={userData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}
      />
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType}
        onOk={() => {
          userRefetch();
          setResultOpen(false);
          setUserData({});
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </section>
  );
};

HrUserListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default HrUserListPage;
