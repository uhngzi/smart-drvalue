import dayjs from "dayjs";
import { HolderOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPrtCsAPI } from "@/api/cache/client";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import LabelItem from "@/components/Text/LabelItem";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import FullChip from "@/components/Chip/FullChip";
import { LabelMedium } from "@/components/Text/Label";
import LabelItemH from "@/components/Text/LabelItemH";

import { useMenu } from "@/data/context/MenuContext";
import { useUser } from "@/data/context/UserContext";
import { partnerRType } from "@/data/type/base/partner";
import { selectType } from "@/data/type/componentStyles";
import {
  requirementContentsType,
  requirementType,
} from "@/data/type/quality/requitrment";

import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import useToast from "@/utils/useToast";

import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Back from "@/assets/svg/icons/back.svg";

const QualityRequirementsPage: React.FC & {
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
  const [data, setData] = useState<requirementType[]>([]);
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quality-requirements/jsxcrud/many", pagination, sQueryJson],
    queryFn: async () => {
      return getAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          url: "quality-requirements/jsxcrud/many",
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
      const arr = (queryData?.data?.data ?? []).map(
        (item: requirementType) => ({
          ...item,
        })
      );
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [detail, setDetail] = useState<requirementType | null>(null);
  const [detailContents, setDetailContents] = useState<
    requirementContentsType[]
  >([]);
  const [detailContentsNew, setDetailContentsNew] =
    useState<requirementContentsType | null>(null);
  const { data: queryDetailData, refetch: detailRefetch } = useQuery({
    queryKey: ["quality-requirements-detail/jsxcrud/one", detail?.id],
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          url: "quality-requirements-detail/jsxcrud/many",
        },
        {
          anykeys: { qualityRequirementsId: detail?.id },
          sort: "appliedAt,DESC",
        }
      );

      if (result.resultCode === "OK_0000") {
        setDetailContents(result.data?.data ?? []);
      }

      return result;
    },
    enabled: !!detail?.id,
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

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

  // 루트 요구사항 모달창
  const [open, setOpen] = useState<boolean>(false);
  // 루트 선택 시 edit은 true, 신규 버튼 클릭 시 edit은 false
  const [edit, setEdit] = useState<boolean>(false);
  // 내용 글자수 체크
  const [leng, setLeng] = useState<number>(0);

  // 삭제 시 저장하는 서브 아이디
  const [selectSubId, setSelectSubId] = useState<string>("");

  // 루트 요구사항 등록, 루트 요구사항 등급 수정, 서브 요구사항 등록, 서브 요구사항 취소/복구, 서브 요구사항 삭제
  const handleSubmit = async (
    type?: "main_update" | "sub_cancel" | "sub_delete",
    grade?: "BEST" | "GOOD" | "NORMAL",
    subCancelId?: string,
    cancel?: boolean
  ) => {
    try {
      if (!detail?.prt || !detail.prt.id) {
        showToast("고객사를 선택해주세요.", "error");
        return;
      }
      if (edit) {
        if (!detail.id) {
          showToast(
            "등록 중 에러가 발생했습니다. 잠시후에 시도해주세요.",
            "error"
          );
          return;
        }

        if (type === "main_update" && grade) {
          // 루트 요구사항 수정
          const result = await patchAPI(
            {
              type: "core-d3",
              utype: "tenant/",
              jsx: "jsxcrud",
              url: "quality-requirements",
            },
            detail.id,
            { qualityGrade: grade }
          );

          if (result.resultCode === "OK_0000") {
            refetch();
            showToast("등급 수정 완료", "success");
          } else {
            const msg = result?.response?.data?.message;
            setResultType("error");
            setResultMsg(msg);
            setResultOpen(true);
          }
        } else if (type === "sub_cancel") {
          // 서브 요구사항 취소
          if (!subCancelId || subCancelId === "" || cancel === undefined) {
            showToast(
              "취소 중 에러가 발생했습니다. 잠시후에 시도해주세요.",
              "error"
            );
            return;
          }
          const result = await patchAPI(
            {
              type: "core-d3",
              utype: "tenant/",
              jsx: "jsxcrud",
              url: "quality-requirements-detail",
            },
            subCancelId,
            { isCanceled: cancel }
          );

          if (result.resultCode === "OK_0000") {
            detailRefetch();
            showToast("요청 완료", "success");
          } else {
            const msg = result?.response?.data?.message;
            setResultType("error");
            setResultMsg(msg);
            setResultOpen(true);
          }
        } else if (type === "sub_delete") {
          // 서브 요구사항 삭제
          if (!selectSubId || selectSubId === "") {
            showToast(
              "취소 중 에러가 발생했습니다. 잠시후에 시도해주세요.",
              "error"
            );
            return;
          }
          const result = await deleteAPI(
            {
              type: "core-d3",
              utype: "tenant/",
              jsx: "jsxcrud",
              url: "quality-requirements-detail",
            },
            selectSubId
          );

          if (result.resultCode === "OK_0000") {
            detailRefetch();
            showToast("삭제 완료", "success");
          } else {
            const msg = result?.response?.data?.message;
            setResultType("error");
            setResultMsg(msg);
            setResultOpen(true);
          }
        } else {
          // 서브 요구사항 등록
          const jsonData = {
            qualityRequirements: {
              id: detail.id,
            },
            content: detailContentsNew?.content,
            appliedAt: dayjs(detailContentsNew?.appliedAt).format("YYYY-MM-DD"),
          };
          console.log(JSON.stringify(jsonData));

          const result = await postAPI(
            {
              type: "core-d3",
              utype: "tenant/",
              jsx: "jsxcrud",
              url: "quality-requirements-detail",
            },
            jsonData
          );

          if (result.resultCode === "OK_0000") {
            detailRefetch();
            showToast("등록 완료", "success");
            setDetailContentsNew({
              content: "",
              appliedAt: null,
            });
            setLeng(0);
          } else {
            const msg = result?.response?.data?.message;
            setResultType("error");
            setResultMsg(msg);
            setResultOpen(true);
          }
        }
      } else {
        // 루트 요구사항 등록
        const jsonData = {
          prt: {
            id: detail?.prt?.id,
          },
          emp: {
            id: me?.id ?? "1",
          },
          content: detail?.content,
          appliedAt: dayjs(detail?.appliedAt).format("YYYY-MM-DD"),
          qualityGrade: detail?.qualityGrade,
        };
        console.log(JSON.stringify(jsonData));

        // 신규 등록
        const result = await postAPI(
          {
            type: "core-d3",
            utype: "tenant/",
            jsx: "jsxcrud",
            url: "quality-requirements",
          },
          jsonData
        );

        if (result.resultCode === "OK_0000") {
          refetch();
          setLeng(0);
          showToast("등록 완료", "success");
          setOpen(false);
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

  useEffect(() => {
    if (!open)
      setDetail({
        ...detail,
        content: undefined,
      });
  }, [open]);

  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"error" | "delete" | "">("");
  const [resultMsg, setResultMsg] = useState<string>("");

  return (
    <div className="flex items-start gap-10 w-full h-full">
      <div className="flex-1">
        <ListPagination
          pagination={pagination}
          totalData={totalData}
          onChange={handlePageChange}
          // handleMenuClick={handlePageMenuClick}
          searchs={searchs}
          setSearchs={setSearchs}
          handleSearchs={handleSearchs}
          handleSubmitNew={() => {
            setEdit(false);
            setOpen(true);
            setDetailContentsNew({
              content: "",
              appliedAt: null,
            });
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
                  "코드/업체명을 클릭하면 해당 업체의 상세 정보를 볼 수 있어요",
                render: (_, record: requirementType) => (
                  <div
                    className="reference-detail gap-5"
                    onClick={() => {
                      setDetailContentsNew({
                        content: "",
                        appliedAt: null,
                      });
                      setEdit(true);
                      setDetail(record);
                    }}
                  >
                    <FullChip
                      label={record.prt?.prtRegCd?.toString() ?? ""}
                      state="line"
                      className="!font-normal"
                    />
                    {record.prt?.prtNm}
                  </div>
                ),
              },
              {
                title: "영업 담당자명",
                width: 150,
                dataIndex: "emp.name",
                key: "emp.name",
              },
              {
                title: "품질등급",
                width: 150,
                dataIndex: "qualityGrade",
                key: "qualityGrade",
                render: (value) => (
                  <div className="w-full v-h-center">
                    {value === "BEST" ? (
                      <FullChip label="최상급" state="purple" />
                    ) : value === "GOOD" ? (
                      <FullChip label="상급" state="pink" />
                    ) : (
                      <FullChip label="보통" />
                    )}
                  </div>
                ),
              },
              {
                title: "마지막 변경일",
                width: 150,
                dataIndex: "lastUpdatedAt",
                key: "lastUpdatedAt",
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

      {/* 상세 */}
      <div
        className="flex min-w-[595px] w-[595px] min-h-[85vh] max-h-[85vh] px-20 py-30 bg-[#EEE] overflow-auto"
        style={{
          width: `${previewWidth}px`,
          minWidth: `${previewMin}px`,
          maxWidth: `${previewMax}px`,
        }}
      >
        {!detail?.id && (
          <div className="w-full min-h-[calc(85vh-60px)] h-full v-h-center">
            업체를 선택하시면 상세 내용을 볼 수 있어요
          </div>
        )}
        {detail?.id && (
          <div className="flex flex-col gap-15 w-full min-w-[500px]">
            <div className="v-between-h-center">
              <LabelMedium
                label={detail.prt?.prtNm ?? ""}
                className="!flex-1"
              />
              <AntdSelect
                options={[
                  { value: "BEST", label: "최상급" },
                  { value: "GOOD", label: "상급" },
                  { value: "NORMAL", label: "보통" },
                ]}
                styles={{ bg: "#FFF" }}
                value={detail?.qualityGrade}
                className="!w-80"
                onChange={(e) => {
                  const value = (e + "") as "BEST" | "GOOD" | "NORMAL";
                  setDetail({
                    ...detail,
                    qualityGrade: value,
                  });
                  handleSubmit("main_update", value);
                }}
              />
            </div>
            <div className="w-full bg-white rounded-8 px-15 py-10 border-1 border-bdDefault">
              <TextArea
                value={detailContentsNew?.content}
                onChange={(e) => {
                  if (e.target.value.length > 2000) {
                    showToast("최대 2000자까지 입력 가능합니다.", "error");
                    return;
                  }

                  setDetailContentsNew({
                    ...detailContentsNew,
                    content: e.target.value,
                  });
                  setLeng(e.target.value.length);
                }}
              />

              <div className="w-full h-center justify-end text-[#00000025]">
                {leng}/2000
              </div>
              <div className="w-full flex justify-between items-end">
                <LabelItemH label="변경 적용일 ">
                  <AntdDatePicker
                    value={detailContentsNew?.appliedAt}
                    onChange={(value) => {
                      setDetailContentsNew({
                        ...detailContentsNew,
                        appliedAt: value,
                      });
                    }}
                    className="w-full h-32"
                    styles={{ bc: "#D9D9D9", br: "2px" }}
                    suffixIcon={"cal"}
                  />
                </LabelItemH>
                <Button
                  className="!h-32 max-h-32 bg-point1 text-white rounded-6"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  추가
                </Button>
              </div>
            </div>
            {detailContents &&
              detailContents.length > 0 &&
              detailContents.map((item) => (
                <div className="w-full bg-white rounded-8 px-15 py-10 border-1 border-bdDefault h-center">
                  <div className="flex-1">
                    <div
                      className={`whitespace-pre-wrap ${
                        item.isCanceled ? "line-through text-[#00000045]" : ""
                      }`}
                    >
                      {item.content}
                    </div>
                    <div className="text-12 text-[#00000045]">
                      {dayjs(item.appliedAt).format("YYYY-MM-DD")}
                    </div>
                  </div>
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
                                <Back />
                              </p>
                              {item.isCanceled ? "복구" : "취소"}
                            </div>
                          ),
                          key: 0,
                          onClick: () => {
                            handleSubmit(
                              "sub_cancel",
                              undefined,
                              item.id,
                              !item.isCanceled
                            );
                          },
                        },
                        {
                          label: (
                            <div className="text-[red] h-center gap-5">
                              <p className="w-16 h-16">
                                <Trash />
                              </p>
                              삭제
                            </div>
                          ),
                          key: 1,
                          onClick: () => {
                            setSelectSubId(item.id ?? "");
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
              ))}
          </div>
        )}
      </div>

      {/* 루트 요구사항 신규 등록 */}
      <AntdModal
        open={open}
        setOpen={setOpen}
        title="요구 & 요청 등록"
        width={600}
        bgColor="#fff"
        draggable
        contents={
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
                          prtNm: p.label,
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
              <div className="h-center gap-20 w-full">
                <LabelItem label="품질 등급" className="w-1/2">
                  <AntdSelect
                    options={[
                      { value: "BEST", label: "최상급" },
                      { value: "GOOD", label: "상급" },
                      { value: "NORMAL", label: "보통" },
                    ]}
                    styles={{ bg: "#FFF" }}
                    value={detail?.qualityGrade}
                    onChange={(e) => {
                      setDetail({
                        ...detail,
                        qualityGrade: (e + "") as "BEST" | "GOOD" | "NORMAL",
                      });
                    }}
                  />
                </LabelItem>
                <LabelItem label="변경 적용일" className="w-1/2">
                  <AntdDatePicker
                    value={detail?.appliedAt}
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
              </div>
              <LabelItem label="내용">
                <TextArea
                  className="min-h-55 rounded-0"
                  value={detail?.content}
                  onChange={(e) => {
                    if (e.target.value.length > 2000) {
                      showToast("최대 2000자까지 입력 가능합니다.", "error");
                      return;
                    }

                    setDetail({
                      ...detail,
                      content: e.target.value,
                    });
                    setLeng(e.target.value.length);
                  }}
                />

                <div className="w-full h-center justify-end text-[#00000025]">
                  {leng}/2000
                </div>
              </LabelItem>
            </div>
            <div className="mt-10 w-full h-center justify-end">
              <Button
                className="text-white bg-point1"
                onClick={() => {
                  handleSubmit();
                }}
              >
                <Arrow /> 요구 등록
              </Button>
            </div>
          </>
        }
      />

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
            handleSubmit("sub_delete");
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

QualityRequirementsPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="(QA)고객사">{page}</MainPageLayout>
);

export default QualityRequirementsPage;
