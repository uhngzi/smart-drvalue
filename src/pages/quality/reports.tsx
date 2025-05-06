import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  reportsDetailType,
  reportsReq,
  reportsType,
} from "@/data/type/quality/reports";
import { Button, Dropdown, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import cookie from "cookiejs";
import Image from "next/image";
import { port } from "../_app";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { getPrtCsAPI } from "@/api/cache/client";
import { baseURL, cookieName } from "@/api/lib/config";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";

import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import FullChip from "@/components/Chip/FullChip";
import AntdModal from "@/components/Modal/AntdModal";
import LabelItem from "@/components/Text/LabelItem";
import AntdInput from "@/components/Input/AntdInput";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import AntdDraggerSmallBottom from "@/components/Upload/AntdDraggerSmallBottom";
import { downloadFileByObjectName } from "@/components/Upload/upLoadUtils";

import { useMenu } from "@/data/context/MenuContext";
import { useUser } from "@/data/context/UserContext";
import { selectType } from "@/data/type/componentStyles";
import { partnerRType } from "@/data/type/base/partner";

import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Clock from "@/assets/svg/icons/clock_back.svg";
import Upload from "@/assets/svg/icons/upload.svg";
import Download from "@/assets/svg/icons/s_download.svg";
import Print from "@/assets/svg/icons/print.svg";
import Open from "@/assets/svg/icons/s_open_window.svg";
import BlueCheck from "@/assets/svg/icons/blue_check.svg";

import dynamic from "next/dynamic";
const PdfView = dynamic(() => import("@/contents/quality/PdfView"), {
  ssr: false,
});

const QualityReportsPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
  const { selectMenu } = useMenu();
  const { showToast, ToastContainer } = useToast();

  // ------------- 페이지네이션 세팅 ------------ 시작
  const [searchs, setSearchs] = useState<string>("");
  const [sQueryJson, setSQueryJson] = useState<string>("");
  useEffect(() => {
    if (searchs.length < 2) setSQueryJson("");
  }, [searchs]);
  const handleSearchs = () => {
    if (searchs.length < 2) {
      showToast("2글자 이상 입력해주세요.", "error");
      return;
    }
    // url를 통해 현재 메뉴를 가져옴
    const jsx = selectMenu?.children?.find((f) =>
      router.pathname.includes(f.menuUrl ?? "")
    )?.menuSearchJsxcrud;
    if (jsx) {
      setSQueryJson(jsx.replaceAll("##REPLACE_TEXT##", searchs));
    } else {
      setSQueryJson("");
    }
  };
  // ------------- 페이지네이션 세팅 ------------ 끝

  // ------------ 구매처 데이터 세팅 ------------ 시작
  const [csList, setCsList] = useState<selectType[]>([]);
  const { data: cs, refetch: csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  useEffect(() => {
    if (cs?.data?.data?.length) {
      setCsList(
        cs.data?.data.map((cs: partnerRType) => ({
          value: cs.id,
          label: cs.prtNm,
        }))
      );
    }
  }, [cs?.data?.data]);
  // ------------ 구매처 데이터 세팅 ------------ 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [data, setData] = useState<any[]>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quality-reports/jsxcrud/many", pagination, sQueryJson],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          url: "quality-reports/jsxcrud/many",
        },
        {
          limit: pagination.size,
          page: pagination.current,
          s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
        }
      );
    },
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item: reportsType) => ({
        ...item,
      }));
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------ 드래그 핸들러 세팅 ------------ 시작
  const [previewWidth, setPreviewWidth] = useState<number>(595);
  const previewMin = 300;
  const previewMax = 1100;

  const handleDragMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = previewWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = startX - moveEvent.clientX;
      const newWidth = startWidth + diffX;
      if (newWidth >= previewMin && newWidth <= previewMax) {
        setPreviewWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  // ------------ 드래그 핸들러 세팅 ------------ 끝

  const [detail, setDetail] = useState<reportsType | null>(null);
  const [detailContents, setDetailContents] = useState<reportsDetailType[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  // new - 등록 , update - 수정, re - 갱신
  const [edit, setEdit] = useState<"new" | "update" | "re" | "">("");
  // 변경사항 모달
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  // 이미지 아이디
  const [selectImage, setSelectImage] = useState<string>("");

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const handleDetail = async (record: reportsType) => {
    try {
      const result = await getAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          url: "quality-reports-history/jsxcrud/many",
        },
        {
          anykeys: { qualityReportId: record.id },
          sort: "version,DESC",
        }
      );

      if (result.resultCode === "OK_0000") {
        setEdit("re");
        setDetail(record);

        const list: reportsDetailType[] = result.data?.data ?? [];
        setDetailContents(list);

        // 이미지 자동 선택 조건 1. 변경 적용일이 아직 지나지 않은 것
        const today = dayjs().startOf("day");
        const validList = list.filter((item) => {
          return dayjs(item.appliedAt).isSameOrBefore(today, "day");
        });

        if (validList.length === 0) {
          setSelectImage(list[0].file ?? ""); // 조건에 맞는 게 없으면 0번째로 선택
          return;
        }

        setSelectImage(validList[0].file ?? "");
      } else {
        showToast("성적서 상세 조회 실패", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("성적서 상세 조회 중 오류가 발생했습니다.", "error");
    }
  };
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // --------------- 파일 세팅 --------------- 시작
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileIdList, setFileIdList] = useState<string[]>([]);

  useEffect(() => {
    if (fileIdList.length > 0)
      setDetail({
        ...detail,
        file: fileIdList[0],
      });
  }, [fileIdList]);

  const { data: queryFileData } = useQuery({
    queryKey: ["quality-reports/jsxcrud/many", selectImage],
    queryFn: async () => {
      const result = await getAPI({
        type: "file-mng",
        url: `every/file-manager/default/info/${selectImage}`,
      });

      if (result.resultCode === "OK_0000") {
        setFileList([{ ...result?.data?.fileEntity }]);
      }

      return result;
    },
    enabled: !!selectImage && selectImage !== "",
  });
  // --------------- 파일 세팅 --------------- 끝

  // ------------ 등록 / 수정 함수 ------------ 시작
  const handleSubmit = async () => {
    try {
      if (edit === "re" && detail?.id) {
        if (!detail.file || detail.file === "") {
          showToast("파일을 입력해주세요.", "error");
          return;
        }

        // 갱신 (세부 변경사항 등록)
        const jsonData = {
          qualityReport: {
            id: detail.id,
          },
          content: detail.content,
          file: detail.file,
          appliedAt: detail.appliedAt
            ? dayjs(detail.appliedAt).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        };
        console.log(JSON.stringify(jsonData));

        const result = await postAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-reports-history",
          },
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          refetch();
          handleDetail(detail);
          showToast("갱신 완료", "success");
          setOpen(false);
          setFileIdList([]);
          setFileList([]);
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      } else if (edit === "update" && detail?.id) {
        const jsonData = {
          prt: {
            id: detail.prt?.id,
          },
          name: detail?.name,
        };
        console.log(JSON.stringify(jsonData));

        const result = await patchAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-reports",
          },
          detail.id,
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          refetch();
          showToast("수정 완료", "success");
          setOpen(false);
          setFileIdList([]);
          setFileList([]);
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      } else {
        // 성적서 등록
        const req = validReq(detail, reportsReq());
        if (!req.isValid) {
          showToast(req.missingLabels + "은(는) 필수 입력입니다.", "error");
          return;
        }

        const jsonData = {
          prt: {
            id: detail?.prt?.id,
          },
          name: detail?.name,
          content: detail?.content,
          file: detail?.file,
          appliedAt: detail?.appliedAt
            ? dayjs(detail.appliedAt).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        };
        console.log(JSON.stringify(jsonData));

        const result = await postAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-reports",
          },
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          refetch();
          showToast("등록 완료", "success");
          setOpen(false);
          setFileIdList([]);
          setFileList([]);
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // ------------ 등록 / 수정 함수 ------------ 끝

  // --------------- 삭제 함수 --------------- 시작
  const [deleted, setDeleted] = useState<{
    id: string;
    type: "main" | "sub";
  }>();

  const handleDelete = async () => {
    try {
      if (!deleted?.id || deleted?.id === "") {
        showToast(
          "삭제 중 에러가 발생했습니다. 잠시후에 시도해주세요.",
          "error"
        );
        return;
      }
      if (deleted.type === "main") {
        const result = await deleteAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-reports",
          },
          deleted.id
        );

        if (result.resultCode === "OK_0000") {
          refetch();
          setDetail(null);
          showToast("삭제 완료", "success");
          setFileIdList([]);
          setFileList([]);
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      } else {
        const result = await deleteAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-reports-history",
          },
          deleted.id
        );

        if (result.resultCode === "OK_0000") {
          handleDetail(detail ?? {});
          showToast("삭제 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  };
  // --------------- 삭제 함수 --------------- 끝

  // 값 초기화
  useEffect(() => {
    if (!open) {
      if (!edit) setDetail(null);
      setFileIdList([]);
      setFileList([]);
    }
  }, [open]);

  // ----------------- 인쇄 ----------------- 시작
  const handlePrint = async () => {
    if (!selectImage) {
      showToast("인쇄할 이미지가 없습니다.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${selectImage}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${cookie.get(cookieName)}`,
            "x-tenant-code": String(
              port === "90"
                ? cookie.get("dev-code") || "shinyang-test"
                : port === "3000"
                ? "gpntest-dev"
                : cookie.get("x-custom-tenant-code") || "gpntest-sebuk-ver"
            ),
          },
        }
      );

      if (!response.ok) {
        throw new Error("파일을 불러오는 데 실패했습니다.");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${fileList?.[0]?.originalName ?? "(QA)시스템"}</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 0;
                }
                body, html {
                  margin: 0;
                  padding: 0;
                  height: 297mm;
                  width: 210mm;
                  background: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  page-break-inside: avoid;
                }
              </style>
            </head>
            <body>
              <img src="${blobUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error(error);
      showToast("파일 인쇄 중 오류가 발생했습니다.", "error");
    }
  };
  // ----------------- 인쇄 ----------------- 끝

  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"error" | "delete" | "">("");
  const [resultMsg, setResultMsg] = useState<string>("");

  return (
    <div className="flex gap-20">
      {/* 리스트 보여주는 부분 */}
      <div className="flex flex-col flex-1 h-full pr-2">
        <ListPagination
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          // handleMenuClick={handlePageMenuClick}
          searchs={searchs}
          setSearchs={setSearchs}
          handleSearchs={handleSearchs}
          handleSubmitNew={() => {
            setDetail(null);
            setHistoryOpen(false);
            setOpen(true);
            setEdit("");
            setFileIdList([]);
            setFileList([]);
          }}
        />

        <List>
          <AntdTableEdit
            columns={[
              {
                title: "No",
                width: 50,
                dataIndex: "index",
                key: "index",
                align: "center",
                leftPin: true,
                render: (_: any, __: any, index: number) =>
                  totalData -
                  ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              },
              {
                title: "코드/업체명",
                width: 150,
                dataIndex: "prtInfo.prt.prtRegCd/prtInfo.prt.prtNm",
                key: "prtInfo.prt.prtRegCd/prtInfo.prt.prtNm",
                align: "center",
                tooltip:
                  "코드/업체명을 클릭하면 해당 업체의 상세 성적서를 볼 수 있어요",
                render: (_, record: reportsType) => (
                  <div
                    className="reference-detail gap-5"
                    onClick={() => {
                      setEdit("re");
                      setDetail(record);
                      setHistoryOpen(false);
                      handleDetail(record);
                    }}
                  >
                    {record.prt ? (
                      <>
                        <FullChip
                          label={record.prt?.prtRegCd?.toString() ?? ""}
                          state="line"
                          className="!font-normal"
                        />
                        {record.prt?.prtNm}
                      </>
                    ) : (
                      <div className="w-full text-center">-</div>
                    )}
                  </div>
                ),
              },
              {
                title: "성적서명",
                width: 200,
                dataIndex: "name",
                key: "name",
                render: (value: string, record: reportsType) => (
                  <div
                    className="reference-detail"
                    onClick={() => {
                      setEdit("re");
                      setDetail(record);
                      setHistoryOpen(false);
                      handleDetail(record);
                    }}
                  >
                    {value}
                  </div>
                ),
              },
              {
                title: "ver",
                width: 80,
                dataIndex: "latestVersion",
                key: "latestVersion",
              },
              {
                title: "변경 적용일",
                width: 150,
                dataIndex: "lastestAppliedAt",
                key: "lastestAppliedAt",
              },
              {
                title: "",
                width: 40,
                dataIndex: "delete",
                key: "delete",
                render: (_, record: reportsType) => (
                  <div className="w-full v-h-center">
                    <Dropdown
                      trigger={["click"]}
                      placement="bottomLeft"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement!
                      }
                      menu={{
                        items: [
                          {
                            label: (
                              <div className="w-50 h-center gap-5">
                                <p className="w-16 h-16">
                                  <Memo />
                                </p>
                                수정
                              </div>
                            ),
                            key: 0,
                            onClick: () => {
                              setEdit("update");
                              setDetail(record);
                              setOpen(true);
                            },
                          },
                          {
                            label: (
                              <div className="w-50 h-center gap-5 text-[red]">
                                <p className="w-16 h-16">
                                  <Trash />
                                </p>
                                삭제
                              </div>
                            ),
                            key: 1,
                            onClick: () => {
                              setDeleted({
                                id: record.id ?? "",
                                type: "main",
                              });
                              setResultMsg(
                                "삭제 시 복구가 불가능합니다. 정말 삭제하시겠습니까?"
                              );
                              setResultType("delete");
                              setResultOpen(true);
                            },
                          },
                        ],
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <div className="w-24 h-24 cursor-pointer v-h-center">
                            <p className="w-16 h-16">
                              <Edit />
                            </p>
                          </div>
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                ),
              },
            ]}
            data={data}
            styles={{
              th_bg: "#E9EDF5",
              td_bg: "#FFFFFF",
              round: "14px",
              line: "n",
            }}
            loading={dataLoading}
          />
        </List>

        <ListPagination
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          // handleMenuClick={handlePageMenuClick}
          searchs={searchs}
          setSearchs={setSearchs}
          handleSearchs={handleSearchs}
        />
      </div>

      {/* 드래그 핸들 */}
      <div
        className="w-14 min-h-[85vh] h-full cursor-col-resize h-center justify-center"
        onMouseDown={handleDragMouseDown}
      >
        <HolderOutlined />
      </div>

      {/* 성적서 미리보기 부분 */}
      <div
        className="flex flex-col min-w-[595px] w-[595px] h-full overflow-auto"
        style={{
          width: `${previewWidth}px`,
          minWidth: `${previewMin}px`,
          maxWidth: `${previewMax}px`,
        }}
      >
        {!detail?.id && (
          <div className="w-full !h-[calc(85vh-60px)] v-h-center bg-[#EEE] mt-50">
            성적서를 선택하시면 미리 볼 수 있어요
          </div>
        )}
        {detail?.id && (
          <div>
            {/* 헤더 부분 */}
            <div className="flex-none h-50 v-between-h-center">
              <div className="h-center gap-10">
                <p>{detail.name}</p>
                <Button
                  onClick={() => {
                    setEdit("re");
                    setDetail({
                      ...detail,
                      appliedAt: null,
                      content: "",
                      file: "",
                    });
                    setFileList([]);
                    setFileIdList([]);
                    setOpen(true);
                  }}
                >
                  <Upload /> 성적서 갱신
                </Button>
              </div>
              <div className="h-center gap-10">
                <div
                  className="w-24 h-26 rounded-2 cursor-pointer hover:bg-[#F5F6FA] hover:shadow-md transition-all duration-300 v-h-center"
                  onClick={() => setHistoryOpen(true)}
                >
                  <p className="w-16 h-16">
                    <Clock />
                  </p>
                </div>
                <div>
                  <Dropdown
                    trigger={["click"]}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement!
                    }
                    menu={{
                      items: [
                        {
                          label: (
                            <div className="h-center gap-5">
                              <p className="w-16 h-16">
                                <Download />
                              </p>
                              다운로드
                            </div>
                          ),
                          key: 0,
                          onClick: () => {
                            console.log(fileList);
                            if (
                              fileList.length > 0 &&
                              selectImage &&
                              selectImage !== ""
                            )
                              downloadFileByObjectName(selectImage, {
                                ...fileList[0],
                                name: fileList[0].originalName,
                              });
                            else
                              showToast(
                                "파일 다운로드 중 오류가 발생하였습니다. 잠시후에 다시 시도해주세요.",
                                "error"
                              );
                          },
                        },
                        {
                          label: (
                            <div className="h-center gap-5">
                              <p className="w-16 h-16">
                                <Print />
                              </p>
                              인쇄
                            </div>
                          ),
                          key: 1,
                          onClick: handlePrint,
                        },
                      ],
                    }}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <div className="w-24 h-26 rounded-2 cursor-pointer v-h-center bg-back hover:shadow-md transition-all duration-300">
                          <p className="w-16 h-16">
                            <Edit />
                          </p>
                        </div>
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </div>
            {/* 이미지 부분 */}
            <div
              className="relative bg-[#EEE] flex-1"
              style={{
                width: `${previewWidth}px`,
                minWidth: `${previewMin}px`,
                maxWidth: `${previewMax}px`,
                height: "calc(85vh - 60px)", // 높이 고정
              }}
            >
              {detailContents &&
                detailContents.length > 0 &&
                fileList.length > 0 && (
                  <>
                    {fileList[0]?.type === "application/pdf" ? (
                      <PdfView selectImage={selectImage} />
                    ) : (
                      <Image
                        src={`${baseURL}file-mng/v1/every/file-manager/download/${selectImage}`}
                        fill
                        sizes={`${previewWidth}px`}
                        style={{ objectFit: "contain" }}
                        alt=""
                      />
                    )}
                  </>
                )}
              {historyOpen && (
                <div className="bg-[#00000050] w-1/2 h-full absolute top-0 right-0 z-10 px-10 gap-10 flex flex-col">
                  <div className="h-40 v-between-h-center">
                    <div className="text-16">변경 이력</div>
                    <CloseOutlined
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => setHistoryOpen(false)}
                    />
                  </div>
                  {detailContents.length > 0 &&
                    detailContents.map((item, index) => (
                      <div
                        className="w-full bg-white rounded-8 px-10 py-10 border-1 border-bdDefault flex flex-col"
                        key={index + ":" + item.id}
                      >
                        <div
                          className="v-between-h-center p-5 rounded-6"
                          style={{
                            background:
                              item.file === selectImage ? "#2161dc15" : "",
                          }}
                        >
                          <div className="h-center gap-5">
                            <p>
                              ver {item.version}.{" "}
                              {dayjs(item.updatedAt).format("YYYY-MM-DD")}
                            </p>
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectImage(item.file ?? "");
                              }}
                            >
                              {item.file === selectImage ? (
                                <BlueCheck />
                              ) : (
                                <Open />
                              )}
                            </p>
                          </div>
                          <div>
                            <Dropdown
                              trigger={["click"]}
                              placement="bottomLeft"
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentElement!
                              }
                              menu={{
                                items: [
                                  {
                                    label: (
                                      <div className="w-50 h-center gap-5 text-[red]">
                                        <p className="w-16 h-16">
                                          <Trash />
                                        </p>
                                        삭제
                                      </div>
                                    ),
                                    key: 0,
                                    onClick: () => {
                                      if (detailContents.length < 2) {
                                        showToast(
                                          "최소 1개의 항목이 존재해야 합니다.",
                                          "error"
                                        );
                                        return;
                                      }
                                      setDeleted({
                                        id: item.id ?? "",
                                        type: "sub",
                                      });
                                      setResultMsg(
                                        "삭제 시 복구가 불가능합니다. 정말 삭제하시겠습니까?"
                                      );
                                      setResultType("delete");
                                      setResultOpen(true);
                                    },
                                  },
                                ],
                              }}
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <div className="w-24 h-24 cursor-pointer v-h-center">
                                    <p className="w-16 h-16">
                                      <Edit />
                                    </p>
                                  </div>
                                </Space>
                              </a>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap text-[#00000085] px-5">
                          {item.content}
                        </div>
                        <div className="text-12 text-[#00000045] px-5">
                          {dayjs(item.appliedAt).format("YYYY-MM-DD")}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 모달창 */}
      <AntdModal
        open={open}
        setOpen={setOpen}
        title={
          edit === "update"
            ? "고객성적서 수정"
            : edit === "re"
            ? "고객성적서 갱신"
            : "고객성적서 등록"
        }
        width={600}
        bgColor="#fff"
        draggable
        contents={
          <>
            {edit === "update" ? (
              <div className="w-full p-20 border-1 border-bdDefault rounded-8 bg-back flex flex-col gap-24">
                <LabelItem label="현재 버전">
                  <div className="h-32">
                    ver.{detail?.latestVersion} {"("}
                    {detail?.lastestAppliedAt &&
                      dayjs(detail?.lastestAppliedAt).format("YYYY-MM-DD")}
                    {")"}
                  </div>
                </LabelItem>
                <LabelItem label="고객사">
                  <CustomAutoComplete
                    option={csList}
                    value={detail?.prt?.id}
                    onChange={(value) => {
                      const p = csList.find((f) => f.value === value);
                      if (p) {
                        setDetail({
                          ...detail,
                          prt: {
                            ...detail?.prt,
                            id: value,
                            prtNm: p.label.toString(),
                          },
                        });
                      }
                    }}
                    clear={false}
                    inputClassName="!h-32 !rounded-2"
                    className="!h-32 !rounded-2"
                    placeholder="고객명 검색 후 선택"
                  />
                </LabelItem>
                <LabelItem label="성적서명">
                  <AntdInput
                    value={detail?.name}
                    onChange={(e) => {
                      setDetail({ ...detail, name: e.target.value });
                    }}
                  />
                </LabelItem>
              </div>
            ) : edit === "re" ? (
              <>
                <div className="w-full p-20 border-1 border-bdDefault rounded-8 bg-back flex flex-col gap-24">
                  <LabelItem label="현재 버전">
                    <div className="h-32">
                      ver.{detail?.latestVersion} {"("}
                      {detail?.lastestAppliedAt &&
                        dayjs(detail?.lastestAppliedAt).format("YYYY-MM-DD")}
                      {")"}
                    </div>
                  </LabelItem>
                  <LabelItem label="변경 적용일">
                    <AntdDatePicker
                      value={detail?.appliedAt ?? dayjs()}
                      onChange={(value) => {
                        setDetail({
                          ...detail,
                          appliedAt: value,
                        });
                      }}
                      className="w-full h-32"
                      styles={{ bc: "#D9D9D9", br: "2px" }}
                      suffixIcon={"cal"}
                    />
                  </LabelItem>
                  <LabelItem label="갱신 내용">
                    <TextArea
                      className="min-h-55 rounded-0"
                      value={detail?.content}
                      onChange={(e) => {
                        setDetail({
                          ...detail,
                          content: e.target.value,
                        });
                      }}
                    />
                  </LabelItem>
                  <AntdDraggerSmallBottom
                    fileList={fileList}
                    setFileList={setFileList}
                    fileIdList={fileIdList}
                    setFileIdList={setFileIdList}
                    defaultHeight={"auto"}
                    max={1}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full p-20 border-1 border-bdDefault rounded-8 bg-back flex flex-col gap-24">
                  <LabelItem label="고객사">
                    <CustomAutoComplete
                      option={csList}
                      value={detail?.prt?.id}
                      onChange={(value) => {
                        const p = csList.find((f) => f.value === value);
                        if (p) {
                          setDetail({
                            ...detail,
                            prt: {
                              ...detail?.prt,
                              id: value,
                              prtNm: p.label.toString(),
                            },
                          });
                        }
                      }}
                      clear={false}
                      inputClassName="!h-32 !rounded-2"
                      className="!h-32 !rounded-2"
                      placeholder="고객명 검색 후 선택"
                    />
                  </LabelItem>
                  <LabelItem label="성적서명">
                    <AntdInput
                      value={detail?.name}
                      onChange={(e) => {
                        setDetail({ ...detail, name: e.target.value });
                      }}
                    />
                  </LabelItem>
                  <LabelItem label="변경 적용일">
                    <AntdDatePicker
                      value={detail?.appliedAt ?? dayjs()}
                      onChange={(value) => {
                        setDetail({
                          ...detail,
                          appliedAt: value,
                        });
                      }}
                      className="w-full h-32"
                      styles={{ bc: "#D9D9D9", br: "2px" }}
                      suffixIcon={"cal"}
                    />
                  </LabelItem>
                  <LabelItem label="비고">
                    <TextArea
                      className="min-h-55 rounded-0"
                      value={detail?.content}
                      onChange={(e) => {
                        setDetail({
                          ...detail,
                          content: e.target.value,
                        });
                      }}
                    />
                  </LabelItem>
                  <AntdDraggerSmallBottom
                    fileList={fileList}
                    setFileList={setFileList}
                    fileIdList={fileIdList}
                    setFileIdList={setFileIdList}
                    defaultHeight={"auto"}
                    max={1}
                  />
                </div>
              </>
            )}
            <div className="mt-10 w-full h-center justify-end">
              <Button
                className="text-white bg-point1"
                onClick={() => {
                  handleSubmit();
                }}
              >
                <Arrow /> 성적서{" "}
                {edit === "update" ? "수정" : edit === "re" ? "갱신" : "등록"}
              </Button>
            </div>
          </>
        }
      />
      {/* 알림창 */}
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "error"
            ? "오류 발생"
            : resultType === "delete"
            ? "삭제하시겠습니까?"
            : ""
        }
        contents={<div>{resultMsg}</div>}
        type={
          resultType === "error"
            ? "error"
            : resultType === "delete"
            ? "warning"
            : "success"
        }
        onOk={() => {
          setResultOpen(false);
          if (resultType === "delete") {
            handleDelete();
          }
        }}
        onCancel={() => {
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "error"
            ? "확인"
            : resultType === "delete"
            ? "네 삭제할래요"
            : ""
        }
        cancelText={resultType === "delete" ? "아니요 삭제 안할래요" : ""}
      />

      <ToastContainer />
    </div>
  );
};

QualityReportsPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="(QC)성적서">{page}</MainPageLayout>
);

export default QualityReportsPage;
