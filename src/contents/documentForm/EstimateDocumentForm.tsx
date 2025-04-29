import { LayerEm, ModelTypeEm } from "@/data/type/enum";
import {
  salesEstimateProductType,
  salesEstimateType,
} from "@/data/type/sales/order";
import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { companyType } from "@/data/type/base/company";
import { set } from "lodash";
import { comma } from "postcss/lib/list";
import dayjs from "dayjs";
import { baseURL } from "@/api/lib/config";
import Image from "next/image";

interface Props {
  formData: salesEstimateType | null;
  products: salesEstimateProductType[];
}
//현재 날짜 구하는 함수
const now = dayjs();
const year = now.format("YYYY");
const month = now.format("MM");
const day = now.format("DD");

const EstimateDocumentForm: React.FC<Props> = ({ formData, products }) => {
  // 합계 구하는 함수
  const totalCost = products.reduce(
    (acc, cur) => acc + (Number(cur.cost) || 0),
    0
  );
  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  // 숫자를 한글 금액으로 변환하는 유틸
  const numberToKorean = (num: number): string => {
    const hanA = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    const danA = ["", "십", "백", "천"];
    const unit = ["", "만", "억", "조", "경"];

    let result = "";
    let numStr = String(num);
    let len = numStr.length;

    let unitIndex = 0;
    while (len > 0) {
      let part = numStr.slice(Math.max(0, len - 4), len);
      let partResult = "";

      for (let i = 0; i < part.length; i++) {
        const digit = +part[i];
        if (digit !== 0) {
          partResult += hanA[digit] + danA[part.length - i - 1];
        }
      }

      if (partResult !== "") {
        result = partResult + unit[unitIndex] + result;
      }

      unitIndex++;
      len -= 4;
    }

    return result || "영";
  };

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

  const [logoBase64Sign, setLogoBase64Sign] = useState<string>("");
  useEffect(() => {
    const fetchLogo = async () => {
      if (!company?.signatureImageId) return;

      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${company.signatureImageId}`
      );

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64Sign(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    fetchLogo();
  }, [company?.signatureImageId]);

  return (
    //메인 바디

    <div className="flex w-[595px] px-[20px] py-[30px] items-center justify-center flex-col bg-[white]">
      <div className="flex flex-col w-[555px] gap-[15px]">
        {/* 견적서 */}
        <div
          className="flex w-full h-30 pb-[20px] items-center justify-center gap-[10px]
            font-[Spoqa Han Sans Neo] font-[20px] font-style:normal"
        >
          견적서
        </div>
        {/* 상단 바디 */}
        <div className="flex w-full h-[200px] items-end gap-[20px]">
          {/* 좌측 화면 */}
          <div className="flex w-[200px] h-[200px] flex-col items-center justify-space-between">
            {/* 좌측 Table */}
            <div className="flex w-full h-[156px] items-center justify-center flex-[1_0_0]">
              <table className="table-auto w-full border-t border-[#D9D9D9]">
                <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="w-[50px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                      견적번호
                    </td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px]">
                      {formData?.estimateNo}
                    </td>
                  </tr>

                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                      고객사
                    </td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px]">
                      {formData?.prtInfo?.prt?.prtNm}
                    </td>
                  </tr>

                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                      프로젝트
                    </td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px]">
                      {formData?.estimateNm}
                    </td>
                  </tr>

                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                      납기일
                    </td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px]">
                      {dayjs(formData?.estimateDt).format("YYYY-MM-DD")}
                    </td>
                  </tr>

                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                      배송조건
                    </td>
                    <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                      후불
                    </td>
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                      지불조건
                    </td>
                    <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                      현금
                    </td>
                  </tr>

                  <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                      위치
                    </td>
                    <td className="max-w-[75px] pl-[8px] ">
                      {formData?.prtInfo?.prt?.prtAddr}
                    </td>
                    <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                      유효기간
                    </td>
                    <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                      {dayjs(formData?.createdAt).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>{" "}
            {/* 좌측 Table 끝 */}
            {/* 좌측 날짜 */}
            <div className="flex-col w-full h-[44px] justify-end items-center pt-[8px]">
              <div className="h-[22px] flex items-center justify-center gap-[10px] font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                <p>{year}</p>
                <p>년</p>
                <p>{month}</p>
                <p>월</p>
                <p>{day}</p>
                <p>일</p>
              </div>
              <div className="h-[22px] flex items-center justify-center gap-[10px] font-[Spoqa Han Sans Neo] text-[9px] font-medium">
                아래와 같이 견적합니다.
              </div>
            </div>
          </div>
          {/* 좌측 화면 끝 */}

          {/*우측 화면 */}
          <div className="w-[335px] h-full flex-start relative">
            <table className="table-auto w-full border-t border-[#D9D9D9]">
              <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="!w-[75px] !min-w-[75px] pl-[8px] bg-[#E9EDF5] ">
                    회사명
                  </td>
                  <td
                    colSpan={3}
                    className="min-w-[90px] !max-w-[100px] w-[90px] pl-[8px] pt-[5px]"
                  >
                    {company?.companyName}
                  </td>
                  <td
                    rowSpan={3}
                    className="h-[75px] !w-[157px] !max-w-[157px] border-l border-[#D9D9D9] pl-[8px] pt-[5px]"
                  >
                    <div className="flex items-center justify-center !max-w-[157px]">
                      {logoBase64 && (
                        <img
                          src={logoBase64}
                          alt="logo"
                          width={90}
                          height={30}
                          style={{ objectFit: "contain", display: "block" }}
                        />
                      )}
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="!w-[75px] !min-w-[75px] pl-[8px] bg-[#E9EDF5] ">
                    사업자등록번호
                  </td>
                  <td
                    colSpan={3}
                    className="max-w-[75px] w-[90px] !max-w-[90px]  pl-[8px] pt-[5px]"
                  >
                    {company?.businessRegNo}
                  </td>
                </tr>

                <tr className="h-[25px]">
                  <td className="!w-[75px] !min-w-[75px] pl-[8px] bg-[#E9EDF5] ">
                    대표명
                  </td>
                  <td
                    colSpan={3}
                    className="max-w-[75px] w-[75px]  pl-[8px] pt-[5px] relative"
                  >
                    {company?.ceoName}
                    <div className="absolute top-[-12px] right-[-5px]">
                      {logoBase64Sign && (
                        <img
                          src={logoBase64Sign}
                          alt="logo"
                          width={50}
                          height={50}
                          style={{ objectFit: "contain", display: "block" }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table-auto w-full border-t border-[#D9D9D9]">
              <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    업태
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.bizCondition}
                  </td>
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    업종
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.bizType}
                  </td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    전화번호
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.ceoPhone}
                  </td>
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    팩스번호
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.ceoFax}
                  </td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">주소</td>
                  <td
                    colSpan={3}
                    className="flex max-w-[75px] pl-[8px] pt-[5px] whitespace-nowrap"
                  >
                    {company?.address}
                  </td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    담당자
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.taxManagerName}
                  </td>
                  <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                    휴대번호
                  </td>
                  <td className="max-w-[75px] pl-[8px] whitespace-nowrap">
                    {company?.taxManagerPhone}
                  </td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">E-Mail</td>
                  <td
                    colSpan={3}
                    className="flex max-w-[75px] pl-[8px] pt-[5px]"
                  >
                    {company?.ceoEmail}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 좌측 화면 끝*/}
        </div>
        {/* 상단 바디 끝*/}
        <div className="w-full h-[30px] px-[5px] py-[20px] flex items-center bg-[rgba(238,238,238,0.5)]">
          <div className="w-[515px] h-[24px] flex items-center pl-[20px] gap-[10px] font-[Spoqa Han Sans Neo] text-[12px] font-style:normal">
            <p>금액 :</p>
            <p>{numberToKorean(totalCost)}</p>
            <p>원 정</p>
          </div>
          <div className="w-[140px] h-[24px] pr-[20px] flex items-center justify-end gap-[10px] font-[Spoqa Han Sans Neo] text-[12px] font-style:normal whitespace-nowrap">
            {" "}
            (￦{formatNumber(totalCost)}원) / VAT포함){" "}
          </div>
        </div>
        {/* 하단 바디 시작 */}
        <div className="w-full">
          <table className="h-[25px] table-auto w-full border-t border-[#D9D9D9]">
            {/* 테이블 제목 */}
            <tbody className="mb-0 font-[Spoqa Han Sans Neo] text-[9px] font-style:normal bg-[rgba(238,238,238,0.5)]">
              <tr className="border-b border-[#D9D9D9] h-[25px] text-center align-middle whitespace-nowrap">
                <td className="border-r border-[#D9D9D9] w-[20px] h-[25px] px-3 ">
                  No
                </td>
                <td className="border-r border-[#D9D9D9] w-[195px] h-[25px] px-3 ">
                  견적 모델명
                </td>
                <td className="border-r border-[#D9D9D9] w-[30px] h-[25px] px-3 ">
                  Array
                </td>
                <td className="border-r border-[#D9D9D9] w-[50px] h-[25px] px-3 ">
                  재질
                </td>
                <td className="border-r border-[#D9D9D9] w-[100px] h-[25px] px-3 ">
                  사이즈 x 두께
                </td>
                <td className="border-r border-[#D9D9D9] w-[25px] h-[25px] px-3 ">
                  단위
                </td>
                <td className="border-r border-[#D9D9D9] w-[30px] h-[25px] px-3 ">
                  수량
                </td>
                <td className="border-r border-[#D9D9D9] w-[50px] h-[25px] px-3 ">
                  단가 <span className="text-[7px]">(VAT 포함)</span>
                </td>
                <td className="border-r border-[#D9D9D9] w-[60px] h-[25px] px-3 ">
                  금액
                </td>
              </tr>
            </tbody>
            {/* 항목 메인 */}
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal text-center align-middle">
              {/* 맵 입력 값 */}
              {products.map((item, index) => (
                <tr key={index} className="border-b border-[#D9D9D9] h-30">
                  <td className="border-r border-[#D9D9D9] px-3">
                    {index + 1}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3">
                    {item?.estimateModelNm}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3">
                    {item?.array}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3">
                    {item?.surfaceTreatment}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3">
                    {item?.sizeW} x {item?.sizeH} x {item?.thickness}T
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3">
                    {item?.quantity}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3 text-right">
                    {Number(item?.quantity ?? 0).toLocaleString()}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3 text-right">
                    {Number(
                      item?.autoCalculatedUnitPrice ?? 0
                    ).toLocaleString()}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-3 text-right">
                    {Number(item?.cost ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* 빈 줄 */}
              {Array.from(
                { length: Math.max(0, 11 - products.length - 1) },
                (_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="border-b border-[#D9D9D9] h-30"
                  >
                    {Array.from({ length: 9 }).map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="border-r border-[#D9D9D9] px-3"
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                )
              )}

              {/* 총 합계 */}
              <tr className="border-b border-[#D9D9D9] h-[25px] bg-[rgba(238,238,238,0.5)]">
                <td colSpan={5} className="border-r border-[#D9D9D9] px-3">
                  총 합계
                </td>
                <td className="border-r border-[#D9D9D9] px-3">LOT</td>
                <td className="border-r border-[#D9D9D9] px-3">
                  {products.length}
                </td>
                <td className="border-r border-[#D9D9D9] px-3">합계 금액</td>
                <td className="border-r border-[#D9D9D9] px-3 text-right">
                  {formatNumber(totalCost)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 하단 푸터 시작 */}
          <div className="flex w-full font-[Spoqa Han Sans Neo] font-style:normal border-t border-b border-[#D9D9D9] mt-[-1px]">
            <div className="flex w-[40px] h-full p-[8px] items-center justify-center text-[10px]">
              비고
            </div>
            <div className="w-full h-full text-[8px] leading-[10px] py-8">
              <div className="h-full whitespace-pre-line border-l border-[#D9D9D9] pl-8">
                {formData?.estimateTxt}
              </div>
            </div>
          </div>
          {/* 하단 푸터 끝 */}
        </div>
        {/* 하단 바디 끝 */}
      </div>
    </div>
  );
};

export default EstimateDocumentForm;
