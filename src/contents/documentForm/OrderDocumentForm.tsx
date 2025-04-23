// 완제 발주서
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { LayerEm, ModelTypeEm } from "@/data/type/enum";
import { useQuery } from '@tanstack/react-query';
import { getAPI } from '@/api/get';
import { buyOrderType } from '@/data/type/buy/cost';
import { companyType } from '@/data/type/base/company';

//현재 날짜 구하는 함수
const now = dayjs();
const year = now.format("YYYY");
const month = now.format("MM");
const day = now.format("DD");
const sample:any[] = [
  {
      modelTypeEm: ModelTypeEm.SAMPLE,
      layerEm: LayerEm.L1,
      estimateModelNm: "1",
      quantity: "1",
      unitPrice: "1000",
      cost: "1000",
      index: "",       
  },
]

interface Props {
  id: string;
}

const OrderDocumentForm:React.FC<Props> = ({
  id
}) => {
  const [order, setOrder] = useState<buyOrderType | null>(null);
  const {data:queryDetailData} = useQuery({
    queryKey: ['request/material/detail/jsxcrud/one', id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `request/material/detail/jsxcrud/one/${id}`
      });

      if(result.resultCode === "OK_0000") {
        setOrder(result.data?.data ?? null);
      }

      return result;
    },
    enabled: !!id
  });

  const [company, setCompany] = useState<companyType | null>(null);
  const { data:queryData, refetch } = useQuery({
    queryKey: ['company-default/jsxcrud/one'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'company-default/jsxcrud/one'
      });

      if (result.resultCode === 'OK_0000') {
        setCompany(result.data?.data ?? null);
      }
      return result;
    },
  });

  return (
    <div className="flex w-[595px] h-[842px] px-[20px] py-[30px] gap-[15px] items-center justify-center flex-col bg-[white]  ">
      
      <div className="flex items-center gap-[77px] w-full justify-start">
        <div className="w-[75px] h-[40px] bg-[#000] text-[#fff] flex items-center justify-center text-[12px]">
          임시 로고
        </div>     
        <div className="text-20 text-[#000] font-medium whitespace-nowrap">
          발주서
        </div>

        {/* 결재란 테이블 */}
        <table className="table-fixed border border-[#D9D9D9] text-center text-[9px] font-[Spoqa Han Sans Neo] w-[270px]">
          <tbody>
            <tr className="bg-[rgba(238,238,238,0.5)]">
              <td rowSpan={2} className="w-[20px] border border-[#D9D9D9] align-middle">
                결<br />재<br />란
              </td>
              <td className="w-[50px] h-[20px] border border-[#D9D9D9]">담당</td>
              <td className="w-[50px] h-[20px] border border-[#D9D9D9]">검토</td>
              <td className="w-[50px] h-[20px] border border-[#D9D9D9]">팀장</td>
              <td className="w-[50px] h-[20px] border border-[#D9D9D9]">임원</td>
              <td className="w-[50px] h-[20px] border border-[#D9D9D9]">승인</td>
              </tr>
              <tr>
              <td className="h-[36px] border border-[#D9D9D9]"></td>
              <td className="border border-[#D9D9D9]"></td>
              <td className="border border-[#D9D9D9]"></td>
              <td className="border border-[#D9D9D9]"></td>
              <td className="border border-[#D9D9D9]"></td>
            </tr>
          </tbody>
        </table>
      </div> {/* 타이틀 영역 end */}

      {/* 상단 타이틀 정보*/}
      <div className="w-full h-[125px] gap-[20px] flex">
        {/* 상단 왼쪽 정보*/}
        <div className="w-[170px] h-[125px] gap-[10px]">
          <div className="w-full h-[34px] px-[10px] py-[5px] text-[9px] font-[Spoqa Han Sans Neo] flex items-center border-b border-[#D9D9D9]">
            <span>P0 :</span>
            <span className='pl-[10px]'>{order?.detailInfo?.docNo}</span>
          </div>

          <div className="w-full flex justify-center">  
          <div className= "w-[121px] h-[81px] gap-[10px]  text-[9px] font-[Spoqa Han Sans Neo] flex flex-col items-center justify-center">
            <div className = "w-full h-[22px] flex items-center justify-center gap-[10px]"> 
              <p>{dayjs().format("YYYY년")}</p>
              <p>{dayjs().format("MM월")}</p>
              <p>{dayjs().format("DD일")}</p>
            </div> 
            <p className= "font-medium"> 아래와 같이 발주합니다.</p>
          </div>
          </div>  
        </div>{/* 상단 왼쪽 정보 끝*/}
          
        {/* 상단 오른쪽 정보*/}
        <div className="w-[365px] h-[125px] flex-start">
        <table className="table-auto w-full border-t border-[#D9D9D9]"> 
          <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
            
            <tr className="border-b border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">회사명</td>
                <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px] whitespace-nowrap pb-[5px]">{company?.companyName}</td>
            </tr>

            <tr className="border-b border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">사업자등록번호</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.businessRegNo}</td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">대표명</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.ceoName}</td>
            </tr>

            <tr className="border-b border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">업태</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.bizCondition}</td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">업종</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.bizType}</td>
            </tr>

            <tr className="border-b border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">전화번호</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.ceoPhone}</td>
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">팩스번호</td>
                <td className="max-w-[105px] pl-[8px] whitespace-nowrap">{company?.ceoFax}</td>
            </tr>

            <tr className="border-b border-[#D9D9D9] h-[25px]">
                <td className="w-[75px] pl-[8px] bg-[#E9EDF5] whitespace-nowrap">주소</td>
                <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px] whitespace-nowrap pb-[5px]">{company?.address}</td>
            </tr>
            </tbody>
        </table>
        </div>{/* 상단 오른쪽 정보 끝*/}
      </div>{/* 상단 타이틀 정보 끝*/}

        
        {/* 하단 발주서 정보 */}
      <div className= "w-full h-[571px]">
      <table className="h-[25px] table-auto w-full border-t border-[#D9D9D9]">
            {/* 테이블 제목 */}
            <tbody className="mb-0 font-[Spoqa Han Sans Neo] text-[10px] font-style:normal bg-[rgba(238,238,238,0.5)]">
                <tr className="border-b border-[#D9D9D9] h-[25px] text-center align-middle whitespace-nowrap">
                <td className="border-r border-[#D9D9D9] w-[40px] h-[25px] px-[8px] ">No</td>
                <td className="border-r border-[#D9D9D9] w-[335px] h-[25px] px-[8px] ">품명</td>
                <td className="border-r border-[#D9D9D9] w-[40px] h-[25px] px-[8px] ">수량</td>
                <td className="border-r border-[#D9D9D9] w-[70px] h-[25px] px-[8px] ">단가 </td>
                <td className="w-[70px] h-[25px] px-[8px] ">납기</td>
                </tr>
            </tbody>

                <tbody className="font-[Spoqa Han Sans Neo] text-[10px] font-style:normal text-center align-middle">
                {/* 맵 입력 값 */}
                {order?.detailInfo?.details && order?.detailInfo?.details.map((item, index) => (
                <tr key={index} className="border-b border-[#D9D9D9] h-[30px] text-[#000000A6]">
                    <td className="border-r border-[#D9D9D9] px-[8px]">{index + 1}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px] text-left">{item.mtNm ? item.mtNm : item.material?.mtNm}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{(item.mtOrderQty ?? 0).toLocaleString()}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{(item.mtOrderInputPrice ?? 0).toLocaleString()}</td>
                    <td className="px-[8px]">{(item.mtOrderAmount ?? 0).toLocaleString()}</td>
                </tr>
                ))}

                {/* 빈 줄 */}
                {Array.from({ length: Math.max(0, 16 - sample.length - 1) }, (_, index) => (
                <tr key={`empty-${index}`} className="border-b border-[#D9D9D9] h-[30px]">
                    {Array.from({ length: 5 }).map((_, colIdx) => (
                    <td 
                    key={colIdx} className={`px-[8px] ${colIdx !== 4 ? 'border-r border-[#D9D9D9]' : ''}`}>&nbsp;
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>

            <tbody className="mb-0 font-[Spoqa Han Sans Neo] text-[10px] font-style:normal text-[#000000A6]">
                <tr className="border-b border-[#D9D9D9] h-[25px] text-center align-middle whitespace-nowrap">
                <td className="border-r border-[#D9D9D9] w-[40px] h-[96px] px-[8px] ">비고</td>
                <td colSpan={4} className="max-w-[75px] h-[96px] pl-[8px] pt-[5px] whitespace-nowrap pb-[5px]">-</td>
                </tr>
            </tbody>  
      </table>
      
      </div>
    </div>
  )
}

export default OrderDocumentForm;