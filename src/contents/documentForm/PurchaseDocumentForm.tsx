//구매 발주서
import React, { useEffect, useState } from "react";
import { LayerEm, ModelTypeEm } from "@/data/type/enum";
import { buyOrderDetailType, buyOrderType } from "@/data/type/buy/cost";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { companyType } from "@/data/type/base/company";
import dayjs from "dayjs";
import Image from "next/image";
import { baseURL } from "@/api/lib/config";
import { partnerMngRType } from "@/data/type/base/partner";

interface Props {
  formData: buyOrderType | null;
  products: buyOrderDetailType[];
  prtNm: string;
  prtMng: partnerMngRType | null;
}

const PurchaseDocumentForm: React.FC<Props> = ({
  formData,
  products,
  prtNm,
  prtMng,
}) => {
  const [company, setCompany] = useState<companyType | null>(null);
  const { data: queryData, refetch } = useQuery({
    queryKey: ["company-default/jsxcrud/one"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "company-default/jsxcrud/one",
      });

      if (result.resultCode === "OK_0000") {
        setCompany(result.data?.data ?? null);
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

  return (
    <>
      {/* 타이틀 영역 */}
      <div className="flex w-full items-center justify-center flex-col bg-[white]">
        {/* 구매 발주서란 */}
        <div className="flex items-center w-full justify-between">
          <div className="w-[100px] h-[40px] text-[#fff] flex items-center justify-center text-[12px] leading-[40px] align-middle">
            {logoBase64 && (
              <img
                src={logoBase64}
                alt="logo"
                width={100}
                height={40}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>

          <div className="text-20 text-[#000] font-medium leading-[20px] align-middle">
            구매 발주서
          </div>
          <table className="border border-[#D9D9D9] text-center text-[9px] w-[170px]">
            <tbody>
              <tr>
                <td
                  rowSpan={3}
                  className="w-[20px] border-r-1 border-[#D9D9D9] align-middle bg-[rgba(238,238,238,0.5)] text-center"
                >
                  결<br />재
                </td>
                <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)] leading-[20px] align-middle">
                  담당
                </td>
                <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)] leading-[20px] align-middle">
                  검토
                </td>
                <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)] leading-[20px] align-middle">
                  승인
                </td>
              </tr>
              <tr>
                <td className="h-[36px] border border-[#D9D9D9] text-[#000000A6]"></td>
                <td className=" border border-[#D9D9D9] text-[#000000A6]"></td>
                <td className=" border border-[#D9D9D9] text-[#000000A6]"></td>
              </tr>
              <tr>
                <td className="h-[20px] border border-[#D9D9D9]">/</td>
                <td className="border border-[#D9D9D9]">/</td>
                <td className="border border-[#D9D9D9]">/</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 구매 발주서란 끝 */}

        {/* 상단 내용 */}
        <div className="flex w-full h-[125px] flex-row items-center justify-space-between gap-[20px] mt-[15px] text-[#000000D9]">
          {/* 좌측 Table */}
          <div className="flex w-[391px] h-[125px] items-center justify-center flex-[1_0_0]">
            <table className="table-auto w-full border-t border-[#D9D9D9]">
              <tbody className="text-[9px] font-style:normal">
                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="w-[50px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    발주 번호
                  </td>
                  <td colSpan={3} className="max-w-[75px] pl-[8px]">
                    {formData?.detailInfo?.docNo}
                  </td>
                </tr>

                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    발주 금액
                  </td>
                  <td colSpan={3} className="max-w-[75px] pl-[8px]">
                    {(formData?.orderRoot?.totalAmount ?? 0).toLocaleString()}
                  </td>
                </tr>

                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    발주 일자
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] ">
                    {formData?.orderRoot?.orderDt
                      ? dayjs(formData?.orderRoot?.orderDt).format(
                          "YYYY년 MM월 DD일"
                        )
                      : ""}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    납품 장소
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] "></td>
                </tr>

                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    담당 부서
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] ">
                    {prtMng?.prtMngDeptNm}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    담당자
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] ">
                    {prtMng?.prtMngNm}
                  </td>
                </tr>

                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    전화번호
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] ">
                    {prtMng?.prtMngTel}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                    팩스번호
                  </td>
                  <td className="max-w-[120px] w-[120px] pl-[8px] ">
                    {prtMng?.prtMngFax}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 좌측 Table 끝*/}

          {/* 우측 Table */}
          <div className="w-[391px] h-[125px] flex-start">
            <table className="table-auto w-full border-t border-[#D9D9D9]">
              <tbody className="text-[9px] font-style:normal">
                <tr className="h-[25px]">
                  <td
                    rowSpan={5}
                    className="w-[30px] bg-[#E9EDF5] border-r-1 border-[#D9D9D9]"
                  >
                    <div className="h-full flex flex-col justify-center items-center">
                      {["발", "주", "서"].map((char, idx) => (
                        <div key={idx}>{char}</div>
                      ))}
                    </div>
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    <p className="w-full h-full flex !items-center">회사명</p>
                  </td>
                  <td
                    colSpan={3}
                    className="max-w-[75px] pl-[8px]  border-b-1 border-[#D9D9D9]"
                  >
                    {company?.companyName}
                  </td>
                </tr>

                <tr className="h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    사업자등록번호
                  </td>
                  <td className="max-w-[105px] pl-[8px]  border-b-1 border-[#D9D9D9]">
                    {company?.businessRegNo}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5] border-b-1 border-[#D9D9D9]">
                    대표명
                  </td>
                  <td className="max-w-[105px] pl-[8px] border-b-1 border-[#D9D9D9]">
                    {company?.ceoName}
                  </td>
                </tr>

                <tr className="h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    업태
                  </td>
                  <td className="max-w-[105px] pl-[8px]  border-b-1 border-[#D9D9D9]">
                    {company?.bizCondition}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    업종
                  </td>
                  <td className="max-w-[105px] pl-[8px]  border-b-1 border-[#D9D9D9]">
                    {company?.bizType}
                  </td>
                </tr>

                <tr className="h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    전화번호
                  </td>
                  <td className="max-w-[105px] pl-[8px]  border-b-1 border-[#D9D9D9]">
                    {company?.ceoPhone}
                  </td>
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5]  border-b-1 border-[#D9D9D9]">
                    팩스번호
                  </td>
                  <td className="max-w-[105px] pl-[8px]  border-b-1 border-[#D9D9D9]">
                    {company?.ceoFax}
                  </td>
                </tr>

                <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                  <td className="w-[75px] pl-[8px] bg-[#E9EDF5] border-b-1 border-[#D9D9D9]">
                    주소
                  </td>
                  <td colSpan={3} className="max-w-[75px] pl-[8px]">
                    {company?.address}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 우측 Table 끝*/}
        </div>
        {/* 상단 내용 끝*/}

        <div className="w-full h-[22px] flex justify-center items-center font-medium text-[10px]">
          하기와 같이 주문하오니 기일 내 납품하여 주시기 바랍니다.
        </div>

        <div className="w-full h-[445px] ">
          <table className="h-[25px] table-auto w-full border-t border-[#D9D9D9]">
            {/* 테이블 제목 */}
            <tbody className="mb-0 text-[9px] font-style:normal bg-[rgba(238,238,238,0.5)]">
              <tr className="border-b-1 border-[#D9D9D9] h-[25px] text-center align-middle ">
                <td className="border-r border-[#D9D9D9] w-[40px] h-[25px] px-[8px] ">
                  No
                </td>
                <td className="border-r border-[#D9D9D9] w-[342px] h-[25px] px-[8px] ">
                  품명
                </td>
                <td className="border-r border-[#D9D9D9] w-[70px] h-[25px] px-[8px] ">
                  납기
                </td>
                <td className="border-r border-[#D9D9D9] w-[100px] h-[25px] px-[8px] ">
                  규격
                </td>
                <td className="border-r border-[#D9D9D9] w-[70px] h-[25px] px-[8px] ">
                  소재명
                </td>
                <td className="border-r border-[#D9D9D9] w-[40px] h-[25px] px-[8px] ">
                  수량
                </td>
                <td className="border-r border-[#D9D9D9] w-[70px] h-[25px] px-[8px] ">
                  단가
                </td>
                <td className="w-[70px] h-[25px] px-[8px] ">금액</td>
              </tr>
            </tbody>

            {/* 항목 메인 */}
            <tbody className="text-[9px] font-style:normal text-center align-middle ">
              {/* 맵 입력 값 */}
              {products &&
                products.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b-1 border-[#D9D9D9] h-[20px] text-[#000000A6]"
                  >
                    <td className="border-r border-[#D9D9D9] px-[8px]">
                      {index + 1}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px] text-left">
                      {item.mtNm}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">
                      {formData?.deliveryDate
                        ? dayjs(formData.deliveryDate).format("YYYY-MM-DD")
                        : ""}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">
                      {item.mtOrderSizeW} * {item.mtOrderSizeH} *{" "}
                      {item.mtOrderThk}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">
                      {item.mtOrderTxtur}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                      {item.mtOrderQty}
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                      {(item.mtOrderPrice ?? 0).toLocaleString()}
                    </td>
                    <td className="px-[8px] text-right">
                      {(item.mtOrderAmount ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}

              {/* 빈 줄 */}
              {Array.from(
                {
                  length: Math.max(0, 18 - products.length - 1),
                },
                (_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="border-b-1 border-[#D9D9D9] h-[20px]"
                  >
                    {Array.from({ length: 8 }).map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-[8px] ${
                          colIdx !== 7 ? "border-r border-[#D9D9D9]" : ""
                        }`}
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                )
              )}

              {/* 총 합계 */}
              <tr className="border-b-1 border-[#D9D9D9] h-[25px] bg-[rgba(238,238,238,0.5)]">
                <td className="border-r border-[#D9D9D9] px-[8px]" colSpan={5}>
                  <span className="px-[30px]">합</span>
                  <span>계</span>
                </td>
                <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                  {products.length > 0 &&
                    products
                      .map((item) => item.mtOrderQty ?? 0)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                </td>
                <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                  {products.length > 0 &&
                    products
                      .map((item) => item.mtOrderPrice ?? 0)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                </td>
                <td className="border-r-0 border-[#D9D9D9] px-[8px] text-right">
                  {products.length > 0 &&
                    products
                      .map((item) => item.mtOrderAmount ?? 0)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="font-normal text-[9px] flex text-[#000000A6] w-full">
            <div className="w-[55px] h-[47px] flex justify-center items-center gap-[8px] border-b-1 border-r border-[#D9D9D9]">
              특기 사항
            </div>
            <div className="flex-1 h-[47px] flex items-center px-[8px] border-b-1 border-r border-[#D9D9D9] whitespace-pre-wrap">
              {formData?.orderRoot?.paymentCondition
                ? `결제조건 : ${formData?.orderRoot?.paymentCondition}`
                : ""}
            </div>
            <div className="w-[55px] h-[47px] flex justify-center items-center gap-[8px] border-b-1 border-r border-[#D9D9D9]">
              비고
            </div>
            <div className="flex-1 h-[47px] flex items-center px-[8px] border-b-1 border-[#D9D9D9] whitespace-pre-wrap">
              {formData?.orderRoot?.remarks}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseDocumentForm;
