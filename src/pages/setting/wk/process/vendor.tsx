import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  newDataProcessVendorCUType,
  processGroupRType,
  processRType,
  processVendorCUType,
  processVendorRType,
} from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import { partnerRType } from "@/data/type/base/partner";
import { treeType } from "@/data/type/componentStyles";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Dropdown,
  Input,
  Spin,
} from "antd";

import dayjs from "dayjs";
import useToast from "@/utils/useToast";

import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Search from "@/assets/svg/icons/s_search.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import { CloseOutlined, MoreOutlined } from "@ant-design/icons";
import { deleteAPI } from "@/api/delete";
import CustomTreeUsed from "@/components/Tree/CustomTreeUsed";

const WkProcessVendorListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
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

  // --------- 필요 데이터 시작 ----------

  const [treeData, setTreeData] = useState<treeType[]>([]);
  const { data: queryTreeData } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-group/jsxcrud/many"],
    queryFn: async () => {
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
            children: group.processes
              .sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0))
              .map((process: processRType) => ({
                id: process.id,
                label: process.prcNm,
                wipPrcNm: process.wipPrcNm,
                isInternal: process.isInternal,
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

  const [dataVendor, setDataVendor] = useState<Array<partnerRType>>([]);
  const [vendorSch, setVendorSch] = useState<string>("");
  const {
    data: queryDataVendor,
    isLoading: vendorLoading,
    refetch: vendorRefetch,
  } = useQuery<apiGetResponseType, Error>({
    queryKey: ["biz-partner/jsxcrud/many", pagination.current],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "biz-partner/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: [
            { key: "prtTypeEm", oper: "eq", value: "vndr" },
            { key: "prtNm", oper: "startsL", value: vendorSch },
          ],
        }
      );

      if (result.resultCode === "OK_0000") {
        setDataVendor(result.data?.data ?? []);
        setTotalData(result.data.total ?? 0);
        console.log("vendor : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  const [dataProcess, setDataProcess] = useState<Array<processRType>>([]);
  const { data: queryDataProcess } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process/jsxcrud/many"],
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "process/jsxcrud/many",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        setDataProcess(result.data?.data ?? []);
        console.log("process : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ---------- 필요 데이터 끝 -----------

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<any>>([]);
  const [childCheckId, setChildCheckId] = useState<string | null>(null);
  useEffect(() => {
    if (childCheckId == null) {
      setData([]);
    }
  }, [childCheckId]);
  const { refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["process-vendor/jsxcrud/many", pagination.current, childCheckId],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: `process-vendor/jsxcrud/many`,
        },
        {
          sort: "ordNo,ASC",
          s_query: childCheckId
            ? { "process.id": { $eq: childCheckId } }
            : undefined,
        }
      );

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        console.log("data : ", result.data?.data);
      } else {
        console.log("error:", result.response);
      }
      setDataLoading(false);
      return result;
    },
    enabled: !!childCheckId, // childCheckId가 있을 때만 쿼리 실행
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
  //등록 모달창 데이터
  const [newData, setNewData] = useState<any[]>([]);
  //값 변경 함수
  const [deleteData, setDeleteData] = useState<string[]>([]); // 삭제할 데이터
  // ----------- 신규 데이터 끝 -----------

  function handleSelect(id: string) {
    const selectId = id;
    setChildCheckId((prev) => (prev === selectId ? null : selectId));
    setNewData([]);
  }

  function addVendor(record: partnerRType) {
    if (data.find((item) => item.vendor.id === record.id)) {
      showToast("이미 등록된 외주처입니다.", "error");
      return;
    }
    const newId = `new${Math.random()}`;
    const find = dataProcess.find((proc) => proc.id === childCheckId);
    if (!find) {
      showToast("추가 중 오류가 발생하였습니다.", "error");
      return;
    }

    const newData = {
      id: newId,
      process: { id: childCheckId },
      processGroup: { id: find?.processGroup?.id ?? "" },
      vendor: { id: record.id ?? "" },
      ordNo: 0,
      useYn: true,
    };
    const renderAddData = {
      id: newId,
      processGroup: {
        id: find?.processGroup?.id ?? "",
        prcGrpNm: find?.processGroup?.prcGrpNm ?? "",
      },
      process: {
        id: childCheckId,
        prcNm: find?.prcNm,
      },
      vendor: { id: record.id, prtNm: record.prtNm },
      createdAt: dayjs().format("YYYY-MM-DD"),
      useYn: true,
    };
    console.log(newData);
    setNewData((prev: any) => [...prev, newData]);
    setData((prev) => [renderAddData, ...prev]);
  }

  async function vendorSave() {
    console.log("new : ", newData);
    console.log("delete : ", deleteData);
    if (newData.length < 1 && deleteData.length < 1) {
      showToast("변경된 내용이 없습니다.", "error");
      return;
    }

    let flag = false;
    if (deleteData.length > 0) {
      for (const item of deleteData) {
        try {
          const result = await deleteAPI(
            {
              type: "baseinfo",
              utype: "tenant/",
              url: `process-vendor`,
              jsx: "jsxcrud",
            },
            item
          );
          console.log(result);
          if (result.resultCode === "OK_0000") {
            flag = true;
          } else {
            flag = false;
            showToast("삭제중 오류가 발생했습니다.", "error");
          }
        } catch (e) {
          showToast("삭제중 오류가 발생했습니다.", "error");
          console.error("error", "삭제중 오류가 발생했습니다.");
        }
      }
    }
    if (newData.length > 0) {
      for (const item of newData) {
        try {
          delete item.id;
          console.log(JSON.stringify(item));
          const result = await postAPI(
            {
              type: "baseinfo",
              utype: "tenant/",
              url: "process-vendor",
              jsx: "jsxcrud",
            },
            item
          );
          console.log(result);
          if (result.resultCode === "OK_0000") {
            flag = true;
          } else {
            flag = false;
            showToast("등록중 오류가 발생했습니다.", "error");
          }
        } catch (e) {
          showToast("등록중 오류가 발생했습니다.", "error");
          console.error("error", "등록중 오류가 발생했습니다.");
        }
      }
    }
    if (flag) {
      showToast("저장되었습니다.", "success");
    } else {
      showToast("저장중 오류가 발생했습니다.", "error");
    }
    setNewData([]);
    setDeleteData([]);
    refetch();
  }
  return (
    <>
      {vendorLoading && (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {!vendorLoading && (
        <>
          <div className="w-full flex gap-30">
            <div
              className="w-[30%] h-[calc(100vh-210px)] rounded-14 p-20"
              style={{ border: "1px solid #D9D9D9" }}
            >
              <CustomTreeUsed
                data={treeData}
                isSelect={true}
                selectId={childCheckId}
                setSelectId={handleSelect}
              />
            </div>
            <div className="w-[850px] flex flex-col gap-15">
              <div className="flex justify-end">
                <div
                  className="w-80 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
                  onClick={vendorSave}
                >
                  등록
                </div>
              </div>
              <div className="flex flex-col">
                <AntdTableEdit
                  columns={[
                    {
                      title: "공정그룹명",
                      dataIndex: "processGroup.prcGrpNm",
                      key: "processGroup.prcGrpNm",
                      align: "center",
                    },
                    {
                      title: "공정명",
                      dataIndex: "process.prcNm",
                      key: "process.prcNm",
                      align: "center",
                    },
                    {
                      title: "외주처명",
                      dataIndex: "vendor.prtNm",
                      key: "vendor.prtNm",
                      align: "center",
                    },
                    {
                      title: "생성일",
                      dataIndex: "createdAt",
                      key: "createdAt",
                      align: "center",

                      render: (item: string) => item?.substring(0, 10),
                    },
                    {
                      title: "사용여부",
                      width: 130,
                      dataIndex: "useYn",
                      key: "useYn",
                      align: "center",
                      render: (item: boolean) => (item ? "사용" : "미사용"),
                    },
                    {
                      title: "",
                      width: 30,
                      dataIndex: "id",
                      key: "id",
                      align: "center",
                      render: (item: boolean) => (
                        <Dropdown
                          trigger={["click"]}
                          menu={{
                            items: [
                              {
                                label: (
                                  <div className="h-center gap-5 flex text-[red]">
                                    <CloseOutlined />
                                    해제
                                  </div>
                                ),
                                key: 0,
                                onClick: () => {
                                  console.log(data, item);
                                  if (
                                    typeof item === "string" &&
                                    (item as string).includes("new")
                                  ) {
                                    setNewData((prev: any) =>
                                      prev.filter(
                                        (data: any) => data.id !== item
                                      )
                                    );
                                  } else {
                                    setDeleteData((prev: any) => [
                                      ...prev,
                                      item,
                                    ]);
                                  }
                                  setData((prev: any) =>
                                    prev.filter((data: any) => data.id !== item)
                                  );
                                },
                              },
                            ],
                          }}
                        >
                          <Button type="text" className="!w-24 !h-24 !p-0">
                            <MoreOutlined />
                          </Button>
                        </Dropdown>
                      ),
                    },
                  ]}
                  data={data}
                />
              </div>
              <div className="v-between-h-center">
                <p>총 {totalData}건</p>
                <div className="flex">
                  <Input
                    value={vendorSch}
                    className="!rounded-0 w-[350px]"
                    placeholder="외주처명 또는 업종 검색"
                    onChange={({ target }) => setVendorSch(target.value)}
                  />
                  <Button className="!rounded-0 !w-38 !p-0">
                    <p className="w-16 h-16" onClick={() => vendorRefetch()}>
                      <Search />
                    </p>
                  </Button>
                </div>
              </div>

              <AntdTableEdit
                columns={[
                  {
                    title: "",
                    width: 50,
                    dataIndex: "id",
                    render: (_, record) => (
                      <Button
                        size="small"
                        onClick={() => {
                          if (childCheckId === "" || !childCheckId) {
                            showToast("공정을 먼저 선택해주세요.", "error");
                            return;
                          }
                          addVendor(record);
                        }}
                      >
                        추가
                      </Button>
                    ),
                    align: "center",
                  },
                  {
                    title: "거래처명",
                    dataIndex: "prtNm",
                    key: "prtNm",
                    align: "center",
                  },
                  {
                    title: "식별코드",
                    width: 100,
                    dataIndex: "prtRegCd",
                    key: "prtRegCd",
                    align: "center",
                  },
                  {
                    title: "영문명",
                    width: 100,
                    dataIndex: "prtEngNm",
                    key: "prtEngNm",
                    align: "center",
                  },
                  {
                    title: "사업자등록번호",
                    width: 130,
                    dataIndex: "prtRegNo",
                    key: "prtRegNo",
                    align: "center",
                  },
                  {
                    title: "법인등록번호",
                    width: 130,
                    dataIndex: "prtCorpRegNo",
                    key: "prtCorpRegNo",
                    align: "center",
                  },
                ]}
                data={dataVendor}
              />

              <div className="w-full h-50 h-center justify-end">
                <AntdSettingPagination
                  current={pagination.current}
                  total={totalData}
                  size={pagination.size}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </>
  );
};

WkProcessVendorListPage.layout = (page: React.ReactNode) => (
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

export default WkProcessVendorListPage;
