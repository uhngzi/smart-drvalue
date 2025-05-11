import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import {
  isValidBusinessLicense,
  isValidCorpRegNo,
} from "@/utils/formatBusinessHyphen";

import {
  partnerCUType,
  partnerRType,
  newDataPartnerType,
  setDataPartnerType,
} from "@/data/type/base/partner";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AddContents from "@/contents/base/client/AddContents";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { MOCK } from "@/utils/Mock";

import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Button, Dropdown, Input, Radio, Spin } from "antd";
import { LabelIcon } from "@/components/Text/Label";

import Bag from "@/assets/svg/icons/bag.svg";
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import Edit from "@/assets/svg/icons/pencilFill.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Plus from "@/assets/svg/icons/s_plus.svg";

import { MoreOutlined } from "@ant-design/icons";
import useToast from "@/utils/useToast";
import { isValidEnglish } from "@/utils/formatEnglish";
import { isValidEmail } from "@/utils/formatEmail";
import { isValidTel, inputTel } from "@/utils/formatPhoneNumber";
import AntdInput from "@/components/Input/AntdInput";
import _ from "lodash";
import { inputFax } from "@/utils/formatFax";

const ClientCuListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;
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

  // --------- 리스트 데이터 시작 ---------
  const [data, setData] = useState<Array<partnerRType>>([]);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["biz-partner/jsxcrud/many", type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
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
            { key: "prtTypeEm", oper: "eq", value: type?.toString() ?? "" },
          ],
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
    enabled: !!type, // type이 존재할 때만 쿼리 실행
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
  // 결과 모달창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>("info");
  const [resultTitle, setResultTitle] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  // 등록 모달창을 위한 변수
  const [newOpen, setNewOpen] = useState<boolean>(false);
  const [addModalInfoList] = useState<any[]>(MOCK.clientItems.CUDPopItems);

  // 등록 모달창 데이터
  const [newData, setNewData] = useState<partnerCUType>(newDataPartnerType);
  // 거래처 담당자 데이터
  const [prtData, setPrtData] = useState<any>([]);

  // 모든 담당자(신규 또는 기존)의 필드 업데이트를 처리하는 함수
  function updatePrt(id: string, key: string, value: string) {
    setPrtData((prev: any) =>
      prev.map((mng: any) => (mng.id === id ? { ...mng, [key]: value } : mng))
    );
  }

  // 새 담당자 추가 함수
  function addNewContact() {
    // 빈 필드로 새 담당자 추가
    setPrtData((prev: any) => [
      ...prev,
      {
        id: `new-${Date.now()}`, // 고유 ID를 위한 타임스탬프 사용
        prtMngNm: "",
        prtMngDeptNm: "",
        prtMngTel: "",
        prtMngFax: "",
        prtMngEmail: "",
        mode: "edit", // 편집 모드로 시작
      },
    ]);
  }

  // 담당자 편집 모드 전환 함수
  function toggleEditMode(id: string, newMode: "edit" | "view") {
    // 저장 전 필드 유효성 검사
    if (newMode === "view") {
      const contact = prtData.find((mng: any) => mng.id === id);

      // 기본 유효성 검사 예시 - 필요에 따라 확장
      if (!contact.prtMngNm.trim()) {
        showToast("담당자 이름을 입력해주세요", "error");
        return;
      }

      if (contact.prtMngEmail && !isValidEmail(contact.prtMngEmail)) {
        showToast("올바른 이메일 주소를 입력해주세요", "error");
        return;
      }

      if (contact.prtMngTel && !isValidTel(contact.prtMngTel)) {
        showToast("올바른 전화번호를 입력해주세요", "error");
        return;
      }
    }

    // 모드 업데이트
    setPrtData((prev: any) =>
      prev.map((mng: any) => (mng.id === id ? { ...mng, mode: newMode } : mng))
    );
  }

  // 담당자 삭제 함수
  function deleteContact(id: string) {
    setPrtData((prev: any) => prev.filter((mng: any) => mng.id !== id));
  }

  // 제출을 위한 담당자 데이터 준비 함수
  const prepareContactsForSubmission = () => {
    return prtData
      .filter(
        (mng: any) => mng.mode === "edit" || String(mng.id).includes("new")
      ) // 수정되거나 신규일 때만
      .map((mng: any) => {
        const cleanContact = { ...mng };
        if (String(cleanContact.id).includes("new")) delete cleanContact.id;
        delete cleanContact.mode;
        delete cleanContact.createdAt;
        delete cleanContact.updatedAt;
        delete cleanContact.deletedAt;
        return cleanContact;
      });
  };

  const saveMngData = async () => {
    const mngData = prepareContactsForSubmission();
    console.log("최종 보낼 담당자 데이터:", JSON.stringify(mngData, null, 2));

    const mngResult = await postAPI(
      {
        type: "baseinfo",
        utype: "tenant/",
        url: "biz-partner-mng/default/edit",
        jsx: "default",
        etc: true,
      },
      {
        partnerIdx: newData.id,
        data: mngData,
      }
    );
    console.log("담당자 저장 응답:", mngResult);
  };

  saveMngData();

  // 버튼 함수
  const handleSubmitNewData = async (data: any) => {
    for (const key in data) {
      const inputType = typeof data[key];
      const label = addModalInfoList.find((v) => v.name === key)?.label ?? key;
      if (key === "emp") continue; // emp는 제외

      if (!data.prtNm || data.prtNm === "") {
        showToast("거래처명을 입력해주세요.", "error");
        return;
      }

      if (data.prtEngNm && !isValidEnglish(data.prtEngNm)) {
        showToast("영문 또는 숫자만 입력 가능합니다.", "error");
        return;
      }
      if (data.prtEngSNm && !isValidEnglish(data.prtEngSNm)) {
        showToast("영문 또는 숫자만 입력 가능합니다.", "error");
        return;
      }
      if (data.prtTel && !isValidTel(data.prtTel)) {
        showToast("올바르지 않은 전화번호입니다.", "error");
        return;
      }
      if (data.prtEmail && !isValidEmail(data.prtEmail)) {
        showToast("올바르지 않은 이메일입니다.", "error");
        return;
      }
    }

    try {
      if (data?.id) {
        // 수정
        const id = data.id;
        delete data.id;
        delete data.managers;

        const result = await patchAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "biz-partner",
            jsx: "jsxcrud",
          },
          id,
          {
            ...data,
            prtTypeEm: type as "cs" | "vndr" | "sup" | "both",
          }
        );

        if (result.resultCode === "OK_0000") {
          // 담당자 저장은 실패하더라도 무시
          try {
            const mngData = prepareContactsForSubmission();
            if (mngData.length > 0) {
              await postAPI(
                {
                  type: "baseinfo",
                  utype: "tenant/",
                  url: "biz-partner-mng/default/edit",
                  jsx: "default",
                  etc: true,
                },
                {
                  partnerIdx: id,
                  data: mngData,
                }
              );
            }
          } catch (e) {
            console.warn("담당자 저장 실패 (무시됨)", e);
          }

          // 무조건 성공 메시지
          modalClose();
          setResultOpen(true);
          setResultType("success");
          setResultTitle("거래처 수정 완료");
          setResultText("거래처 수정이 완료되었습니다.");
        } else {
          showToast(result.response, "error");
        }
      } else {
        // 신규 등록
        delete data.managers;

        const result = await postAPI(
          {
            type: "baseinfo",
            utype: "tenant/",
            url: "biz-partner",
            jsx: "jsxcrud",
          },
          {
            ...data,
            prtTypeEm: type as "cs" | "vndr" | "sup" | "both",
          }
        );

        if (result.resultCode === "OK_0000") {
          const id = result.data.entity.id;
          try {
            const mngData = prepareContactsForSubmission();
            if (mngData.length > 0) {
              await postAPI(
                {
                  type: "baseinfo",
                  utype: "tenant/",
                  url: "biz-partner-mng/default/edit",
                  jsx: "default",
                  etc: true,
                },
                {
                  partnerIdx: id,
                  data: mngData,
                }
              );
            }
          } catch (e) {
            console.warn("담당자 저장 실패 (무시됨)", e);
          }

          modalClose();
          setResultOpen(true);
          setResultType("success");
          setResultTitle("거래처 등록 완료");
          setResultText("거래처 등록이 완료되었습니다.");
        } else {
          showToast(result.response?.data?.message, "error");
        }
      }
    } catch (e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType("error");
      setResultTitle("거래처 처리 실패");
      setResultText("거래처 처리에 오류가 발생했습니다.");
    }
  };

  // ----------- 신규 데이터 끝 -----------

  // 거래처 삭제 함수
  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "biz-partner",
          jsx: "jsxcrud",
        },
        id
      );

      if (result.resultCode === "OK_0000") {
        setNewOpen(false);
        setResultOpen(true);
        setResultType("success");
        setResultTitle("거래처 삭제 성공");
        setResultText("거래처 삭제가 완료되었습니다.");
      } else {
        setNewOpen(false);
        setResultOpen(true);
        setResultType("error");
        setResultTitle("거래처 삭제 실패");
        setResultText("거래처 삭제를 실패하였습니다.");
      }
    } catch (e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType("error");
      setResultTitle("거래처 삭제 실패");
      setResultText("거래처 삭제를 실패하였습니다.");
    }
  };

  // 모달 닫기 함수 - 상태 초기화
  function modalClose() {
    setNewOpen(false);
    setNewData(newDataPartnerType);
    setPrtData([]);
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
          <div className="h-center justify-between">
            <p>총 {totalData}건</p>
            <div
              className="w-80 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer mb-10"
              onClick={() => {
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
                title: "거래처명",
                dataIndex: "prtNm",
                key: "prtNm",
                align: "center",
                render: (_, record) => (
                  <div
                    className="reference-detail"
                    onClick={() => {
                      setPrtData(
                        record.managers?.length > 0 ? record.managers : []
                      );
                      setNewData(setDataPartnerType(record));
                      setNewOpen(true);
                    }}
                  >
                    {record.prtNm}
                  </div>
                ),
              },
              {
                title: "식별코드",
                width: 130,
                dataIndex: "prtRegCd",
                key: "prtRegCd",
                align: "center",
              },
              {
                title: "축약명",
                width: 130,
                dataIndex: "prtSnm",
                key: "prtSnm",
                align: "center",
              },
              {
                title: "영문명",
                width: 130,
                dataIndex: "prtEngNm",
                key: "prtEngNm",
                align: "center",
              },
              {
                title: "영문축약",
                width: 130,
                dataIndex: "prtEngSnm",
                key: "prtEngSnm",
                align: "center",
              },
              {
                title: "사업자등록번호",
                width: 200,
                dataIndex: "prtRegNo",
                key: "prtRegNo",
                align: "center",
                render: (value: string) => (
                  <div className="w-full h-full v-h-center">
                    {isValidBusinessLicense(value)}
                  </div>
                ),
              },
              {
                title: "법인등록번호",
                width: 200,
                dataIndex: "prtCorpRegNo",
                key: "prtCorpRegNo",
                align: "center",
                render: (value: string) => (
                  <div className="w-full h-full v-h-center">
                    {isValidCorpRegNo(value)}
                  </div>
                ),
              },
              {
                title: "업태",
                width: 200,
                dataIndex: "prtBizType",
                key: "prtBizType",
                align: "center",
              },
              {
                title: "업종",
                width: 200,
                dataIndex: "prtBizCate",
                key: "prtBizCate",
                align: "center",
              },
              {
                title: "주소",
                width: 200,
                dataIndex: "prtAddr",
                key: "prtAddr",
                align: "center",
              },
              {
                title: "상세주소",
                width: 200,
                dataIndex: "prtAddrDtl",
                key: "prtAddrDtl",
                align: "center",
              },
              {
                title: "대표자명",
                width: 200,
                dataIndex: "prtCeo",
                key: "prtCeo",
                align: "center",
              },
              {
                title: "전화번호",
                width: 200,
                dataIndex: "prtTel",
                key: "prtTel",
                align: "center",
              },
              {
                title: "팩스번호",
                width: 200,
                dataIndex: "prtFax",
                key: "prtFax",
                align: "center",
              },
              {
                title: "이메일",
                width: 200,
                dataIndex: "prtEmail",
                key: "prtEmail",
                align: "center",
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
        popWidth={810}
        title={{
          name: `거래처 ${newData?.id ? "수정" : "등록"}`,
          icon: <Bag />,
        }}
        open={newOpen}
        setOpen={setNewOpen}
        onClose={() => modalClose()}
        items={MOCK.clientItems.CUDPopItems}
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}
        addCustom={
          newData?.id ? (
            <>
              <div className="w-full flex justify-between items-center h-[50px]">
                <div className="flex items-center gap-10">
                  <Bag />
                  <p className="text-16 font-medium">담당자 정보</p>
                  <Button
                    className="w-24 !h-24 v-h-center !p-0"
                    onClick={addNewContact}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <section className="rounded-lg border border-[#D9D9D9] !p-10">
                {/* 담당자가 없을 때 메시지 표시 */}
                {
                  (!prtData || prtData.length === 0) && addNewContact() // 빈 상태이면 바로 1명 추가
                }
                {/* 담당자 목록 순회 */}
                {prtData?.map((mng: any, idx: number) => (
                  <div
                    className="w-full h-40 h-center gap-5"
                    key={mng.id || idx}
                  >
                    {mng?.mode !== "edit" ? (
                      // 보기 모드
                      <>
                        <p className="w-50 h-center gap-8">{mng.prtMngNm}</p>
                        <div className="w-[110px] px-8">
                          <LabelIcon
                            label={mng.prtMngDeptNm}
                            icon={<MessageOn />}
                          />
                        </div>
                        <div className="w-[140px] px-8">
                          <LabelIcon label={mng.prtMngFax} icon={<Mobile />} />
                        </div>
                        <div className="w-[140px] px-8">
                          <LabelIcon label={mng.prtMngTel} icon={<Call />} />
                        </div>
                        <div className="flex-1 px-12">
                          <LabelIcon label={mng.prtMngEmail} icon={<Mail />} />
                        </div>
                        <div className="w-24 h-40 v-h-center">
                          <Dropdown
                            trigger={["click"]}
                            menu={{
                              items: [
                                {
                                  label: (
                                    <div className="h-center gap-5">
                                      <p className="w-16 h-16">
                                        <Edit />
                                      </p>
                                      정보 수정
                                    </div>
                                  ),
                                  key: 0,
                                  onClick: () => toggleEditMode(mng.id, "edit"),
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
                                  onClick: () => deleteContact(mng.id),
                                },
                              ],
                            }}
                          >
                            <Button type="text" className="!w-24 !h-24 !p-0">
                              <MoreOutlined />
                            </Button>
                          </Dropdown>
                        </div>
                      </>
                    ) : (
                      // 편집 모드
                      <>
                        <div className="w-55">
                          <Input
                            value={mng.prtMngNm}
                            size="small"
                            className="!p-0"
                            onChange={({ target }) =>
                              updatePrt(mng.id, "prtMngNm", target.value)
                            }
                            placeholder="담당자명"
                          />
                        </div>
                        <div className="w-[130px] px-4 flex gap-5 h-center">
                          <p className="w-14">
                            <MessageOn />
                          </p>
                          <Input
                            value={mng.prtMngDeptNm}
                            size="small"
                            onChange={({ target }) =>
                              updatePrt(mng.id, "prtMngDeptNm", target.value)
                            }
                            placeholder="부서"
                          />
                        </div>
                        <div className="w-[145px] px-4 flex gap-5 h-center">
                          <p className="w-14">
                            <Mobile />
                          </p>
                          <Input
                            value={mng.prtMngFax}
                            size="small"
                            onChange={({ target }) => {
                              const formatted = inputFax(target.value);
                              updatePrt(mng.id, "prtMngFax", formatted);
                            }}
                            placeholder="팩스"
                          />
                        </div>
                        <div className="w-[145px] px-4 flex gap-5 h-center">
                          <p className="w-14">
                            <Call />
                          </p>
                          <Input
                            value={mng.prtMngTel}
                            size="small"
                            onChange={({ target }) => {
                              const formatted = inputTel(target.value);
                              updatePrt(mng.id, "prtMngTel", formatted);
                            }}
                            placeholder="연락처"
                          />
                        </div>
                        <div className="flex-1 px-4 flex gap-5 h-center">
                          <Mail />
                          <Input
                            value={mng.prtMngEmail}
                            size="small"
                            onChange={({ target }) =>
                              updatePrt(mng.id, "prtMngEmail", target.value)
                            }
                            placeholder="이메일"
                          />
                        </div>
                        <Button
                          size="small"
                          onClick={() => toggleEditMode(mng.id, "view")}
                        >
                          저장
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </section>
            </>
          ) : (
            <></>
          )
        }
      />

      <AntdAlertModal
        key={newData.id}
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType}
        onOk={() => {
          refetch();
          setResultOpen(false);
          modalClose();
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

ClientCuListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default ClientCuListPage;
