import { getAPI } from "@/api/get";
import { baseURL } from "@/api/lib/config";
import FullChip from "@/components/Chip/FullChip";
import { companyType } from "@/data/type/base/company";
import { HotGrade, ModelStatus } from "@/data/type/enum";
import { approveMetaDataType } from "@/data/type/sayang/sample";
import { wkDetailType, wkPlanWaitType, wkProcsType } from "@/data/type/wk/plan";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const titleTableStyle = "w-75 h-20 px-8";

// 기본정보 테이블 스타일
const defaultInfoTheadStyle = "h-25 font-normal border-[#D9D9D9]";
const defaultInfoTbodyStyle = "px-8 py-7 border-[#D9D9D9]";

// left 기본사양 테이블 스타일
const defaultSpecTrStyle = "border-t border-[#D9D9D9]";
const defaultSpecThStyle =
  "w-75 px-8 h-20 bg-[#EEEEEE80] text-left font-normal";
const defaultSpecTdStyle = "max-w-75 w-75 px-8 h-20";

// 배열 테이블 및 SPEC 테이블 스타일
const arrAndSpecTrStyle = "border-t border-[#D9D9D9]";
const arrAndSpecThStyle = "w-75 h-20 bg-[#EEEEEE80] text-left font-normal";
const arrAndSpecTdStyle = "max-w-75 w-75 h-20 px-8";

// Film 소요량 테이블 스타일
const filmAmountThStyle =
  "h-20 border-t border-r border-[#D9D9D9] bg-[#FAFAFA] font-normal";
const filmAmountTdStyle = "py-3 border-t border-b border-[#D9D9D9] text-center";

const FilmDocumentForm: React.FC<{ id: string }> = ({ id }) => {
  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [formData, setFormData] = useState<wkPlanWaitType | null>(null);

  // id 값이 변경될 경우마다 실행됨
  const { data: queryDetailData } = useQuery({
    queryKey: ["worksheet/wait-for-production-plan/jsxcrud/one", id],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `worksheet/wait-for-production-plan/jsxcrud/one/${id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result.data.data as wkPlanWaitType;
        setFormData(entity ?? null);
      }

      return result;
    },
    enabled: !!id,
  });

  useEffect(() => {
    console.log(formData?.specModel?.spec?.id);
  }, [formData?.specModel?.spec?.id]);

  const [approveMetaData, setApproveMetaData] =
    useState<approveMetaDataType | null>(null);
  const { data: queryApproveData } = useQuery({
    queryKey: ["approve-metadata/default/one/spec", formData],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `approve-metadata/default/one/spec/${formData?.specModel?.spec?.id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result.data as approveMetaDataType;
        setApproveMetaData(entity ?? null);
      }

      return result;
    },
    enabled: !!formData?.specModel?.spec?.id,
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // ------------- 공정 데이터 세팅 ------------- 시작
  const [proc, setProc] = useState<wkDetailType | null>(null);
  const { data: queryWkProcData } = useQuery({
    queryKey: [
      "worksheet/production-status/process-status/detail/jsxcrud/one",
      id,
    ],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `worksheet/production-status/process-status/detail/jsxcrud/one/${id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result?.data?.data as wkDetailType;
        setProc(entity ?? null);
      }

      return result;
    },
    enabled: !!id,
  });
  // ------------- 공정 데이터 세팅 ------------- 끝

  // 회사 기본 정보 가져오는 api
  const [company, setCompany] = useState<companyType | null>(null);
  const { data: queryCompanyData } = useQuery({
    queryKey: ["company-default/jsxcrud/one"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "company-default/jsxcrud/one",
      });

      if (result.resultCode === "OK_0000") {
        setCompany(result.data.data);
      } else {
        setCompany(null);
      }

      return result;
    },
  });

  const [logoBase64, setLogoBase64] = useState<string>("");
  useEffect(() => {
    const fetchLogo = async () => {
      if (!company?.companyLogoId) return;

      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${company.companyLogoId}`
      );

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    fetchLogo();
  }, [company?.companyLogoId]);

  const [arrayBase64, setArrayBase64] = useState<string>("");
  useEffect(() => {
    const fetchLogo = async () => {
      if (!formData?.specModel?.spec?.brdArrStorageKey) return;

      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${formData?.specModel?.spec?.brdArrStorageKey}`
      );

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        setArrayBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    fetchLogo();
  }, [formData?.specModel?.spec?.brdArrStorageKey]);

  return (
    <div className="flex flex-col gap-10 w-[595px] px-20 py-20 bg-[#fff]">
      {/* 타이틀 영역 */}
      <div className="v-between-h-center">
        <div className="v-h-center w-75 h-40">
          {logoBase64 && (
            <img
              src={logoBase64}
              alt="logo"
              width={75}
              height={30}
              style={{ objectFit: "contain", display: "block" }}
            />
          )}
        </div>

        <div>
          <p className="text-20 text-[#000] font-medium">FILM 제작의뢰서</p>
        </div>

        <div>
          <table>
            <tbody className="text-left text-9">
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>
                  작성일
                </th>
                <td className={titleTableStyle}>
                  {approveMetaData?.writeAt
                    ? dayjs(approveMetaData?.writeAt).format("YYYY-MM-DD")
                    : ""}
                </td>
              </tr>
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>
                  작성자
                </th>
                <td className={titleTableStyle}>{approveMetaData?.writerNm}</td>
              </tr>
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>
                  CAM
                </th>
                <td className={titleTableStyle}>CTS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>{" "}
      {/* 타이틀 영역 end */}
      {/* 기본정보 영역 */}
      <div>
        <table className="w-full border-collapse text-center text-10">
          <thead className="bg-[#EEEEEE80]">
            <tr className="border-t border-b border-[#D9D9D9]">
              <th className={defaultInfoTheadStyle + " w-40"}>No</th>
              <th className={defaultInfoTheadStyle + " w-70 border-l"}>
                관리No
              </th>
              <th className={defaultInfoTheadStyle + " w-70 border-l"}>
                업체명
              </th>
              <th className={defaultInfoTheadStyle + " w-[255px] border-l"}>
                MODEL
              </th>
              <th className={defaultInfoTheadStyle + " w-40 border-l"}>Rev</th>
              <th className={defaultInfoTheadStyle + " w-80 border-l"}>
                적용사항
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-b border-[#D9D9D9]">
              <td className={defaultInfoTbodyStyle + " bg-[#FEFBAD80]"}>1</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>
                {formData?.specModel?.prdMngNo}
              </td>
              <td className={defaultInfoTbodyStyle + " border-l"}>
                {formData?.specModel?.partner?.prtNm}
              </td>
              <td className={defaultInfoTbodyStyle + " border-l"}>
                {formData?.specModel?.prdNm}
              </td>
              <td className={defaultInfoTbodyStyle + " border-l"}>
                {formData?.specModel?.prdRevNo}
              </td>
              <td className={defaultInfoTbodyStyle + " border-l"}></td>
            </tr>
          </tbody>
        </table>
      </div>{" "}
      {/* 기본정보 영역 end */}
      {/* 제작정보 영역 */}
      <div className="v-between-h-center">
        {/* left */}
        <div className="flex flex-col gap-10 w-[150px] text-9">
          {/* left 기본사양 테이블 */}
          <table className="w-full">
            <tbody>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>투입구분</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.orderProduct?.modelStatus === ModelStatus.MODIFY
                    ? "수정"
                    : formData?.orderProduct?.modelStatus === ModelStatus.REPEAT
                    ? "반복"
                    : "신규"}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>층수</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.layerEm?.replace("L", "")}층
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>제품 두께</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.thk}T
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>외형가공</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.aprType?.cdNm}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>V-CUT</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.vcutType?.cdNm ??
                    formData?.specModel?.vcutText}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>외층 동박</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.copOut}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>내층 동박</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.copIn}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>PSR 색상</th>
                <td className={defaultSpecTdStyle}>
                  {/* {formData?.specModel?.} */}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>MK 색상</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.mkColor?.cdNm}
                </td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>임피던스</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.impedanceLineCnt}
                </td>
              </tr>
              {/* <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>쿠폰</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.specModel?.couponYn ? "유" : "무"}
                </td>
              </tr> */}
              <tr className={defaultSpecTrStyle + " border-b"}>
                <th className={defaultSpecThStyle}>납기일</th>
                <td className={defaultSpecTdStyle}>
                  {formData?.orderProduct?.orderPrdDueDt
                    ? dayjs(formData?.orderProduct?.orderPrdDueDt).format(
                        "YYYY-MM-DD"
                      )
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 배열 테이블 */}
          <div>
            <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5]">
              배열
            </div>

            <table className="w-full">
              <tbody>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>연조</th>
                  <td className={arrAndSpecTdStyle}>
                    {formData?.specModel?.ykitL} x {formData?.specModel?.ykitW}{" "}
                    ={" "}
                    {Number(formData?.specModel?.ykitL ?? 0) *
                      Number(formData?.specModel?.ykitW ?? 0)}{" "}
                    연조
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>KIT SIZE</th>
                  <td className={arrAndSpecTdStyle + " v-between-h-center"}>
                    <p>{formData?.specModel?.kitL}</p>
                    <p>x</p>
                    <p>{formData?.specModel?.kitW}</p>
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>배열</th>
                  <td className={arrAndSpecTdStyle + " v-between-h-center"}>
                    {/* <p>{formData?.specModel?.kit}</p>
                    <p>x</p>
                    <p>{formData?.specModel?.kitW}</p> */}
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>규격</th>
                  <td className={arrAndSpecTdStyle + " v-between-h-center"}>
                    <p>{formData?.specModel?.spec?.stdW}</p>
                    <p>x</p>
                    <p>{formData?.specModel?.spec?.stdH}</p>
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle + " border-b"}>
                  <th className={arrAndSpecThStyle + " pl-8"}>WORKING SIZE</th>
                  <td className={arrAndSpecTdStyle + " v-between-h-center"}>
                    <p>{formData?.specModel?.spec?.wksizeW}</p>
                    <p>x</p>
                    <p>{formData?.specModel?.spec?.wksizeH}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SPEC 테이블 */}
          <div>
            <div className="v-h-center h-20 bg-[#E9EDF5] border-t border-[#D9D9D9]">
              SPEC
            </div>

            <table className="w-full">
              <tbody>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>회로두께</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>
                    {formData?.specModel?.specLine ?? 0} ㎜
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>회로간격</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>
                    {formData?.specModel?.specSpace ?? 0} ㎜
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>드릴(￠)</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>
                    {formData?.specModel?.specDr ?? 0} ￠
                  </td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>랜드(￠)</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>
                    {formData?.specModel?.specPad ?? 0} ￠
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col gap-10 w-[381px] text-9">
          {/* right 기본사양 테이블 */}
          <table className="w-full">
            <tr className="border-t border-b border-[#D9D9D9]">
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-[#000000D9] text-left font-normal">
                필름사이즈
              </th>
              <td className="max-w-[110px] w-[110px] h-36 bg-[#FEFBAD80] text-12 text-center">
                {formData?.specModel?.spec?.wksizeW} x{" "}
                {formData?.specModel?.spec?.wksizeH}
              </td>
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-[#000000D9] text-left font-normal">
                재단사이즈
              </th>
              <td className="max-w-[110px] w-[110px] h-36 bg-[#FEFBAD80] text-12 text-center">
                {formData?.specModel?.spec?.cutCnt}등분
              </td>
            </tr>
            <tr className="border-b border-[#D9D9D9]">
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-left font-normal">
                내층 스케일
              </th>
              <td className="max-w-[110px] w-[110px] h-36 text-10 text-center text-[#F92727]">
                {formData?.specModel?.spec?.wksizeW} X{" "}
                {formData?.specModel?.spec?.wksizeH}
              </td>
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-left font-normal">
                원판
              </th>
              <td className="max-w-[110px] w-[110px] h-36 text-10 text-center">
                {/* {formData?.specModel?.board?.brdType} */}
                {formData?.specModel?.board?.brdDesc}
                <br />
                {formData?.specModel?.board?.brdW} *{" "}
                {formData?.specModel?.board?.brdH}
              </td>
            </tr>
          </table>

          {/* 배열 도면 */}
          <div className="w-full h-center">
            <div className="w-1/2">
              <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">
                배열 도면
              </div>

              <div className="h-[268px] max-h-[268px] max-w-[380px]">
                {arrayBase64 && (
                  <img
                    src={arrayBase64}
                    alt="logo"
                    className="max-h-full w-auto object-contain mx-auto"
                  />
                )}
              </div>
            </div>
            <div className="w-1/2">
              <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">
                적층구조
              </div>

              <div className="h-[268px] max-h-[268px] max-w-[380px]">
                {/* {Array.isArray(lamination) &&
                  lamination.length > 0 &&
                  lamination.map((item: laminationSourceList, index: number) => (
                    <LaminationRow
                      key={item.id + ":" + index}
                      item={item}
                      index={index}
                      color={color}
                    />
                  ))} */}
              </div>
            </div>
          </div>

          {/* FILM 소요량 테이블 */}
          <div>
            <div className="v-h-center w-full h-20 border-t border-[#D9D9D9] bg-[#E9EDF5]">
              FILM 소요량
            </div>

            <table className="w-full">
              <tbody>
                <tr>
                  <th
                    colSpan={3}
                    className={filmAmountThStyle + " w-[95.25px]"}
                  >
                    PATT
                  </th>
                  <th colSpan={2} className={filmAmountThStyle + " w-[63.5px]"}>
                    S/M(코팅)
                  </th>
                  <th colSpan={2} className={filmAmountThStyle + " w-[63.5px]"}>
                    M/K(UV)
                  </th>
                  <th
                    colSpan={5}
                    className={filmAmountThStyle + " w-[158.75px]"}
                  >
                    특수인쇄
                  </th>
                </tr>
                <tr>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>C/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>S/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>내층</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>C/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>S/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>C/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>S/S</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>제판</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>HPL</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>GOLD</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>-</th>
                  <th className={filmAmountThStyle + " w-[31.75px]"}>-</th>
                </tr>
                <tr>
                  <td className={filmAmountTdStyle + " border-r"}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                  <td className={filmAmountTdStyle + " "}>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>{" "}
      {/* 제작정보 영역 end */}
      {/* CAM 전달사항 / UL주기 영역 */}
      <div className="v-between-h-center min-h-[170px] h-[180px] gap-10">
        {/* CAM 전달사항 */}
        <div className="flex-1 h-full flex flex-col">
          <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">
            CAM 전달사항
          </div>

          <div className="flex-1 p-10 border-t border-b border-[#D9D9D9] text-10 text-[#000000A6] whitespace-pre-line">
            {formData?.specModel?.spec?.camNotice}
          </div>
        </div>

        {/* 공정 */}
        <div
          className={`flex flex-col h-full ${
            (proc?.procs ?? []).length > 8 ? "min-w-[220px]" : "min-w-[150px]"
          }`}
        >
          <div className="v-h-center h-20 min-h-20 border-t border-b border-[#D9D9D9] bg-[#E9EDF5] text-9">
            공정
          </div>
          <div className="flex-1 h-center">
            <div className="flex-1">
              {Array.from(Array(8)).map((_, i) => (
                <div
                  key={i}
                  className="h-center text-9 border-b border-bdDefault h-20 max-h-20"
                >
                  <div className="w-50 h-20 h-center whitespace-nowrap overflow-hidden text-ellipsis px-5 border-r border-bdDefault">
                    {proc?.procs?.[i]?.specPrdGrp?.process?.wipPrcNm ?? ""}
                  </div>
                  <div className="flex-1 h-20 h-center whitespace-nowrap overflow-hidden text-ellipsis px-5">
                    {proc?.procs?.[i]?.vendor?.prtNm ?? ""}
                  </div>
                </div>
              ))}
            </div>
            {(proc?.procs ?? []).length > 8 && (
              <div className="w-1/2">
                {Array.from(Array(8)).map((_, i) => (
                  <div
                    key={i + 9}
                    className="h-center text-9 border-b border-l-2 border-bdDefault h-20 max-h-20"
                  >
                    <div className="w-50 h-20 h-center whitespace-nowrap overflow-hidden text-ellipsis px-5 border-r border-bdDefault">
                      {proc?.procs?.[i + 9]?.specPrdGrp?.process?.wipPrcNm ??
                        ""}
                    </div>
                    <div className="flex-1 h-20 h-center whitespace-nowrap overflow-hidden text-ellipsis px-5">
                      {proc?.procs?.[i + 9]?.vendor?.prtNm ?? ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* UL주기 / Tool No 영역 */}
        <div className="flex flex-col w-[120px] h-full">
          {/* UL주기 테이블 */}
          <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">
            UL/ 주기
          </div>

          <table className="w-full text-9">
            <tbody>
              <tr className="h-20">
                <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">
                  UL
                </th>
                <td
                  colSpan={2}
                  className="max-w-[150px] w-[150px] px-8 border-t border-[#D9D9D9]"
                >
                  {formData?.specModel?.ulTxt1}
                </td>
              </tr>
              <tr className="h-20">
                <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">
                  위치
                </th>
                <td className="max-w-75 w-75 px-8 border-t border-[#D9D9D9]">
                  {formData?.specModel?.ulCd1?.cdNm}
                </td>
              </tr>
              <tr className="h-20">
                <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">
                  주기
                </th>
                <td
                  colSpan={2}
                  className="max-w-[150px] w-[150px] px-8 border-t border-[#D9D9D9]"
                >
                  {formData?.specModel?.ulTxt2}
                </td>
              </tr>
              <tr className="h-20">
                <th className="w-75 px-8 border-t border-b border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">
                  위치
                </th>
                <td className="max-w-75 w-75 px-8 border-t border-b border-[#D9D9D9]">
                  {formData?.specModel?.ulCd2?.cdNm}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 관리No */}
          <div className="v-h-center flex-1 border-b border-[#D9D9D9]">
            <p className="text-20 font-bold">{formData?.specModel?.fpNo}</p>
          </div>
        </div>
      </div>
      {/* CAM 전달사항 / UL주기 영역 end */}
    </div>
  );
};

export default FilmDocumentForm;
