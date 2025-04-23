//구매 발주서
import React, { useState } from "react";
import { LayerEm, ModelTypeEm } from "@/data/type/enum";
import { buyOrderType } from "@/data/type/buy/cost";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { companyType } from "@/data/type/base/company";
import dayjs from "dayjs";

interface Props {
  id: string;
}

const PurchaseDocumentForm: React.FC<Props> = ({ id }) => {
  const [order, setOrder] = useState<buyOrderType | null>(null);
  const { data: queryDetailData } = useQuery({
    queryKey: ["request/material/detail/jsxcrud/one", id],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `request/material/detail/jsxcrud/one/${id}`,
      });

      if (result.resultCode === "OK_0000") {
        setOrder(result.data?.data ?? null);
      }

      return result;
    },
    enabled: !!id,
  });

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

  return (
    //타이틀 영역
    <div className="flex w-[842px] h-[595px] px-[20px] py-[30px] items-center justify-center flex-col bg-[white]">
      {/* 구매 발주서란 */}
      <div className="flex items-center gap-[230px] w-full justify-start">
        <div className="w-[75px] h-[40px] bg-[#000] text-[#fff] flex items-center justify-center text-[12px]">
          임시 로고
        </div>

        <div className="text-20 text-[#000] font-medium whitespace-nowrap">
          구매 발주서
        </div>
        <table className="table-fixed border border-[#D9D9D9] text-center text-[9px] font-[Spoqa Han Sans Neo] w-[170px]">
          <tbody>
            <tr>
              <td
                rowSpan={3}
                className="w-[20px] border-r-1 border-[#D9D9D9] align-middle bg-[rgba(238,238,238,0.5)] text-center"
              >
                결<br />재
              </td>
              <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)]">
                담당
              </td>
              <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)]">
                검토
              </td>
              <td className="!w-[50px] h-[20px] border border-[#D9D9D9] bg-[rgba(238,238,238,0.5)]">
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
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[50px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                  발주 번호
                </td>
                <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px]">
                  {order?.detailInfo?.docNo}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">
                  발주 금액
                </td>
                <td colSpan={3} className="max-w-[75px] pl-[8px]">
                  {(order?.detailInfo?.totalAmount ?? 0).toLocaleString()}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  발주 일자
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {order?.detailInfo?.orderDt
                    ? dayjs(order?.detailInfo?.orderDt).format(
                        "YYYY년 MM월 DD일"
                      )
                    : ""}
                </td>
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  납품 장소
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {/* {order?.detailInfo?.} */}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  담당 부서
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {order?.detailInfo?.prtInfo?.mng?.prtMngDeptNm}
                </td>
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  담당자
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {order?.detailInfo?.prtInfo?.mng?.prtMngNm}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  전화번호
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {order?.detailInfo?.prtInfo?.mng?.prtMngTel}
                </td>
                <td className="w-[75px] pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">
                  팩스번호
                </td>
                <td className="max-w-[120px] pl-[8px] whitespace-nowrap">
                  {order?.detailInfo?.prtInfo?.mng?.prtMngFax}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 좌측 Table 끝*/}

        {/* 우측 Table */}
        <div className="w-[391px] h-[125px] flex-start">
          <table className="table-auto w-full border-t border-[#D9D9D9]">
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td
                  rowSpan={5}
                  className="w-[30px] border border-[#D9D9D9] bg-[#E9EDF5] pl-[10px]"
                >
                  발<br />주<br />서
                </td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  회사명
                </td>
                <td
                  colSpan={3}
                  className="max-w-[75px] pl-[8px] pt-[5px] whitespace-nowrap pb-[5px]"
                >
                  {company?.companyName}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  사업자등록번호
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.businessRegNo}
                </td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  대표명
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.ceoName}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  업태
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.bizCondition}
                </td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  업종
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.bizType}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  전화번호
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.ceoPhone}
                </td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  팩스번호
                </td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">
                  {company?.ceoFax}
                </td>
              </tr>

              <tr className="border-b-1 border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">
                  주소
                </td>
                <td
                  colSpan={3}
                  className="max-w-[75px] pl-[8px] pt-[5px] whitespace-nowrap pb-[5px]"
                >
                  {company?.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 우측 Table 끝*/}
      </div>
      {/* 상단 내용 끝*/}

      <div className="w-full h-[22px] flex justify-center items-center font-medium text-[10px] font-[Spoqa Han Sans Neo]">
        하기와 같이 주문하오니 기일 내 납품하여 주시기 바랍니다.
      </div>

      <div className="w-full h-[445px] ">
        <table className="h-[25px] table-auto w-full border-t border-[#D9D9D9]">
          {/* 테이블 제목 */}
          <tbody className="mb-0 font-[Spoqa Han Sans Neo] text-[9px] font-style:normal bg-[rgba(238,238,238,0.5)]">
            <tr className="border-b-1 border-[#D9D9D9] h-[25px] text-center align-middle whitespace-nowrap">
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
          <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal text-center align-middle ">
            {/* 맵 입력 값 */}
            {order?.detailInfo?.details &&
              order?.detailInfo?.details.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-1 border-[#D9D9D9] h-[20px] text-[#000000A6]"
                >
                  <td className="border-r border-[#D9D9D9] px-[8px]">
                    {index + 1}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-[8px] text-left">
                    {item.mtNm ? item.mtNm : item.material?.mtNm}
                  </td>
                  <td className="border-r border-[#D9D9D9] px-[8px]">
                    {order.detailInfo?.deliveryDueDt
                      ? dayjs(order.detailInfo?.deliveryDueDt).format(
                          "YYYY-MM-DD"
                        )
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

            {/* 총 합계 */}
            <tr className="border-b-1 border-[#D9D9D9] h-[25px] bg-[rgba(238,238,238,0.5)]">
              <td className="border-r border-[#D9D9D9] px-[8px]" colSpan={5}>
                <span className="px-[30px]">합</span>
                <span>계</span>
              </td>
              <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                {order?.detailInfo?.details &&
                  order?.detailInfo?.details.length > 0 &&
                  order.detailInfo.details
                    .map((item) => item.mtOrderQty ?? 0)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
              </td>
              <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                {order?.detailInfo?.details &&
                  order?.detailInfo?.details.length > 0 &&
                  order.detailInfo.details
                    .map((item) => item.mtOrderPrice ?? 0)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
              </td>
              <td className="border-r border-[#D9D9D9] px-[8px] text-right">
                {order?.detailInfo?.details &&
                  order?.detailInfo?.details.length > 0 &&
                  order.detailInfo.details
                    .map((item) => item.mtOrderAmount ?? 0)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
              </td>
            </tr>

            {/* 빈 줄 */}
            {Array.from(
              {
                length: Math.max(
                  0,
                  11 - (order?.detailInfo?.details ?? []).length - 1
                ),
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
          </tbody>
        </table>
        <div className="font-normal text-[9px] font-[Spoqa Han Sans Neo] flex text-[#000000A6]">
          <div className="w-[40px] h-[47px] flex justify-center items-center gap-[8px] border-b-1 border-r border-[#D9D9D9]">
            특기 사항
          </div>
          <div className="w-[361px] h-[47px] flex items-center px-[8px] border-b-1 border-r border-[#D9D9D9] whitespace-nowrap">
            {order?.detailInfo?.paymentCondition
              ? `지불 조건 : ${order?.detailInfo?.paymentCondition}`
              : ""}
          </div>
          <div className="w-[40px] h-[47px] flex justify-center items-center gap-[8px] border-b-1 border-r border-[#D9D9D9]">
            비고
          </div>
          <div className="w-[361px] h-[47px] flex items-center px-[8px] border-b-1 border-[#D9D9D9] whitespace-nowrap ">
            {order?.detailInfo?.paymentCondition
              ? `지불 조건 : ${order?.detailInfo?.paymentCondition}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDocumentForm;
