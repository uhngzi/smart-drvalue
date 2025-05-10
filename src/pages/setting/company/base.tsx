import CardInputList from "@/components/List/CardInputList";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { MOCK } from "@/utils/Mock";
import { Button, Spin, Upload } from "antd";
import { postAPI } from "@/api/post";

import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";
import Sign from "@/assets/png/signImage.png";
import PlaceHolderImg from "@/assets/png/placeholderImg.png";
import Search from "@/assets/svg/icons/s_search.svg";

import Image from "next/image";
import {
  companyType,
  newDataCompanyType,
  setDataCompanyType,
} from "@/data/type/base/company";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AntdDragger from "@/components/Upload/AntdDragger";
import { baseURL } from "@/api/lib/config";
import { PictureOutlined } from "@ant-design/icons";
import {
  isValidBusinessLicense,
  isValidCorpRegNo,
} from "@/utils/formatBusinessHyphen";
import { inputTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";

const CompanyBaseListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [postalCode, setPostalCode] = useState<string>("");
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<companyType>(newDataCompanyType);
  const { data: queryData, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["setting", "company", "base"],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "company-default/jsxcrud/one",
      });

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? {});
        // 회사 직인 정보가 있을 경우 파일 정보 가져오기
        if (result.data?.data?.signFileId) {
          await fetchSignFileInfo(result.data?.data?.signFileId);
        }
      } else {
        console.log("error:", result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  // 우편 번호 검색 버튼 클릭 이벤트
  const handleSearchAddress = () => {
    const w: any = window;
    const d: any = w.daum;
    new d.Postcode({
      oncomplete: function (map: any) {
        handleDataChange(map.address, "address", "select");
        setPostalCode(map.zonecode);
        // setData({...data, postalCode: map.zonecode});
      },
    }).open();
  };

  const companyInfo = [
    {
      value: data?.companyName,
      name: "companyName",
      label: "회사명",
      type: "input",
      widthType: "full",
    },
    {
      value: data?.companyKorAlias,
      name: "companyKorAlias",
      label: "회사명 약칭",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.companyEngName,
      name: "companyEngName",
      label: "영문 회사명",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.businessRegNo,
      name: "businessRegNo",
      label: "사업자등록번호",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.corpRegNo,
      name: "corpRegNo",
      label: "법인등록번호",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.bizCondition,
      name: "bizCondition",
      label: "업태",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.bizType,
      name: "bizType",
      label: "업종",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.ceoName,
      name: "ceoName",
      label: "대표자명",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.ceoPhone,
      name: "ceoPhone",
      label: "대표 전화번호",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.ceoFax,
      name: "ceoFax",
      label: "대표 팩스번호",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.ceoEmail,
      name: "ceoEmail",
      label: "대표 이메일",
      type: "input",
      widthType: "half",
    },
    {
      value: data?.address,
      name: "address",
      label: "주소",
      type: "input",
      widthType: "full",
      fbtn: (
        <Button
          type="primary"
          size="large"
          onClick={handleSearchAddress}
          className="flex h-center gap-8 text-white !text-14 !h-32"
          style={{ background: "#038D07" }}
        >
          <p className="w-16 h-16">
            <Search />
          </p>
          <span>우편번호</span>
        </Button>
      ),
    },
    {
      value: data?.detailAddress,
      name: "detailAddress",
      type: "input",
      widthType: "full",
    },
  ];
  const companyTaxMng = [
    {
      value: data?.taxManagerName,
      name: "taxManagerName",
      label: "담당자명",
      type: "input",
      widthType: "third",
    },
    {
      value: data?.taxManagerEmail,
      name: "taxManagerEmail",
      label: "이메일",
      type: "input",
      widthType: "third",
    },
    {
      value: data?.taxManagerPhone,
      name: "taxManagerPhone",
      label: "전화번호",
      type: "input",
      widthType: "third",
    },
  ];

  //회사 직인 등록

  const [signFileList, setSignFileList] = useState<any[]>([]);
  const [signFileIdList, setSignFileIdList] = useState<string[]>([]);
  const [signImagePreview, setSignImagePreview] = useState<string | null>(null);

  // 직인 이미지 정보 가져오기
  const fetchSignFileInfo = async (fileId: string) => {
    if (!fileId) return;

    try {
      const result = await getAPI({
        type: "file-mng",
        url: `every/file-manager/default/info/${fileId}`,
        header: true,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result?.data?.fileEntity;
        const fileInfo = {
          ...entity,
          name: entity?.originalName,
          originFileObj: {
            name: entity?.originalName,
            size: entity?.size,
            type: entity?.type,
          },
        };

        setSignFileList([fileInfo]);
        setSignFileIdList([fileId]);

        // 이미지 URL 설정 (실제 구현에서는 이미지 URL 생성 방식에 맞게 조정 필요)
        if (entity?.objectName) {
          setSignImagePreview(`/api/file-mng/download/${entity.objectName}`);
        }
      }
    } catch (error) {
      console.error("직인 이미지 정보 조회 실패:", error);
    }
  };

  // 직인 파일 ID가 변경될 때마다 데이터 업데이트
  useEffect(() => {
    if (signFileIdList.length > 0) {
      setData((prev) => ({ ...prev, signFileId: signFileIdList[0] }));
    }
  }, [signFileIdList]);

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

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: "input" | "select" | "date" | "other",
    key?: string
  ) => {
    if (type === "input" && typeof e !== "string") {
      const { value } = e.target;
      if (name.includes("businessRegNo")) {
        setData({ ...data, [name]: isValidBusinessLicense(value) });
      } else if (name.includes("corpRegNo")) {
        setData({ ...data, [name]: isValidCorpRegNo(value) });
      } else if (name.includes("Phone")) {
        setData({ ...data, [name]: inputTel(value) });
      } else if (name.includes("Fax")) {
        setData({ ...data, [name]: inputFax(value) });
      } else {
        setData({ ...data, [name]: value });
      }
    } else if (type === "select") {
      if (key) {
        setData({
          ...data,
          [name]: {
            ...((data as any)[name] || {}), // 기존 객체 값 유지
            [key]: e?.toString(), // 새로운 key 값 업데이트
          },
        });
      } else {
        setData({ ...data, [name]: e });
      }
    }
  };

  const handleSubmitNewData = async () => {
    try {
      const newData = setDataCompanyType({
        ...data,
        postalCode,
      });

      const result = await patchAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "company-default/jsxcrud/update",
          jsx: "jsxcrud",
          etc: true,
        },
        "",
        newData
      );
      console.log(result);

      if (result.resultCode === "OK_0000") {
        setResultFunc(
          "success",
          "회사 정보 수정 성공",
          "회사 정보 수정이 완료되었습니다."
        );
      } else {
        setResultFunc(
          "error",
          "회사 정보 수정 실패",
          "회사 정보 수정을 실패하였습니다."
        );
      }
    } catch (e) {
      setResultFunc(
        "error",
        "회사 정보 등록 실패",
        "회사 정보 등록을 실패하였습니다."
      );
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (file: File, type: string) => {
    try {
      const formData = new FormData();
      formData.append("files", file); // 단일 파일 추가
      formData.append("type", "SIGN_IMAGE");

      const result = await postAPI(
        {
          type: "file-mng",
          utype: "tenant/",
          url: "file-manager/upload/multiple",
          etc: true,
          jsx: "jsxcrud",
        },
        formData
      );

      if (result.resultCode === "OK_0000") {
        if (result.data && result.data.length === 0) {
          setResultFunc(
            "error",
            "업로드 실패",
            `${
              type === "sign" ? "직인" : "로고"
            } 이미지 등록 중 문제가 발생했습니다.`
          );
          return;
        }

        const uploadedId = result.data?.[0]?.uploadEntityResult?.storageName;
        if (uploadedId) {
          // 파일 ID 상태 업데이트
          setSignFileIdList([]);

          // 직접 데이터 상태에 파일 ID 업데이트
          setData((prev) => ({
            ...prev,
            signatureImageId:
              type === "sign" ? uploadedId : prev.signatureImageId,
            companyLogoId: type === "logo" ? uploadedId : prev.companyLogoId,
          }));
        }
      } else {
        setResultFunc(
          "error",
          "업로드 실패",
          `${
            type === "sign" ? "직인" : "로고"
          } 이미지 등록 중 문제가 발생했습니다.`
        );
      }
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      setResultFunc(
        "error",
        "업로드 실패",
        `${
          type === "sign" ? "직인" : "로고"
        } 이미지 등록 중 문제가 발생했습니다.`
      );
    }
  };

  return (
    <>
      {dataLoading && (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      )}
      {!dataLoading && (
        <section className="flex flex-col gap-40">
          <div>
            <p className="text-18 font-bold pb-10 pl-10">회사 정보</p>
            <CardInputList
              title=""
              styles={{ gap: "gap-20" }}
              items={companyInfo}
              handleDataChange={handleDataChange}
            />
          </div>
          <div>
            <p className="text-18 font-bold pb-10 pl-10">세금계산서 담당자</p>
            <CardInputList
              title=""
              styles={{ gap: "gap-20" }}
              items={companyTaxMng}
              handleDataChange={handleDataChange}
            />
          </div>
          <div>
            <div className=" text-18 pb-10 px-10 flex items-center justify-between">
              <p className="text-18 font-bold pb-10 pl-10">회사 직인</p>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  setSignFileList([
                    {
                      originFileObj: file,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    },
                  ]);
                  handleFileUpload(file, "sign");
                  return false; // 기본 업로드 막기
                }}
              >
                <Button
                  icon={<Image src={Sign} alt="img" width={16} height={16} />}
                >
                  서명 파일 업로드
                </Button>
              </Upload>
            </div>

            <div
              className="rounded-8 h-[150px] bg-[#F2F1ED]"
              style={{ border: "1px solid #d9d9d9" }}
            >
              <div
                className="w-[730px] h-[120px] bg-white rounded-tl-[8px] relative"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span
                  className="text-24 font-bold absolute"
                  style={{ color: "#d9d9d9", top: "30px", right: "100px" }}
                >
                  서명 (인)
                </span>
                <div className="absolute" style={{ top: 25, right: 30 }}>
                  {data.signatureImageId ? (
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data.signatureImageId}`}
                      alt=""
                      width={50}
                      height={50}
                    />
                  ) : (
                    <Image
                      src={PlaceHolderImg}
                      width={50}
                      height={50}
                      alt="placeholder"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className=" text-18 pb-10 px-10 flex items-center justify-between">
              <p className="text-18 font-bold pb-10 pl-10">회사 로고</p>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  setSignFileList([
                    {
                      originFileObj: file,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    },
                  ]);
                  handleFileUpload(file, "logo");
                  return false; // 기본 업로드 막기
                }}
              >
                <Button
                  icon={<Image src={Sign} alt="img" width={16} height={16} />}
                >
                  로고 파일 업로드
                </Button>
              </Upload>
            </div>

            <div
              className="rounded-8 h-[150px] bg-[#F2F1ED] v-h-center"
              style={{ border: "1px solid #d9d9d9" }}
            >
              <div
                className="w-[730px] h-[130px] bg-white relative top-9"
                style={{ boxShadow: "4px -2px 4px 0px #00000040" }}
              >
                <div className="absolute" style={{ top: 35, left: 30 }}>
                  {data.companyLogoId ? (
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data.companyLogoId}`}
                      alt=""
                      width={120}
                      height={120}
                    />
                  ) : (
                    <Image
                      src={PlaceHolderImg}
                      width={120}
                      height={120}
                      alt="placeholder"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="h-[50px]">
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitNewData}
              className="w-full flex h-center gap-8 !h-full"
              style={{
                background: "linear-gradient(90deg, #008A1E 0%, #03C75A 100%)",
              }}
            >
              <TrArrow />
              <span>저장</span>
            </Button>
          </div>
        </section>
      )}
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType}
        onOk={() => {
          // 성공 타입일 때만 refetch 및 모달 닫기
          if (resultType === "success") {
            refetch();
            setResultOpen(false);
          } else {
            // 에러나 경고일 경우 모달은 닫지만 refetch는 하지 않음
            setResultOpen(false);
          }
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  );
};

CompanyBaseListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default CompanyBaseListPage;
