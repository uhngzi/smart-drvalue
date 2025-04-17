import { LayerEm, ModelTypeEm } from "@/data/type/enum";
import { salesEstimateProductType } from "@/data/type/sales/order";
import Dojang from '@assets/svg/icons/dojang.svg';
import Logo from "@/assets/svg/icons/logo.svg";
const EstimateDocumentForm: React.FC = () => {
    const sample:any[] = [
        {
            modelTypeEm: ModelTypeEm.SAMPLE,
            layerEm: LayerEm.L1,
            estimateModelNm: "모델 A",
            array: "2",
            texturenm: "FR",
            sizeH: 180,
            sizeW: 90,
            thickness: 5,
            quantityUnit: "PCS",
            quantity: "1",
            unitPrice: "1000",
            cost: "1000",
            index: "",
            
        },
        {
            modelTypeEm: ModelTypeEm.SAMPLE,
            layerEm: LayerEm.L1,
            estimateModelNm: "",
            array: "",
            texturenm: "",
            sizeH: 0,
            sizeW: 0,
            thickness: 0,
            quantityUnit: "",
            quantity: "",
            unitPrice: "",
            cost: "",
            index: "",
            
        },
        {
            modelTypeEm: ModelTypeEm.SAMPLE,
            layerEm: LayerEm.L1,
            estimateModelNm: "",
            array: "",
            texturenm: "",
            sizeH: 0,
            sizeW: 0,
            thickness: 0,
            quantityUnit: "",
            quantity: "",
            unitPrice: "",
            cost: "",
            index: "",
            
        },
        {
            modelTypeEm: ModelTypeEm.SAMPLE,
            layerEm: LayerEm.L1,
            estimateModelNm: "",
            array: "",
            texturenm: "",
            sizeH: 0,
            sizeW: 0,
            thickness: 0,
            quantityUnit: "",
            quantity: "",
            unitPrice: "",
            cost: "",
            index: "",
            
        },
        {
            modelTypeEm: ModelTypeEm.SAMPLE,
            layerEm: LayerEm.L1,
            estimateModelNm: "",
            array: "",
            texturenm: "",
            sizeH: 0,
            sizeW: 0,
            thickness: 0,
            quantityUnit: "",
            quantity: "",
            unitPrice: "",
            cost: "",
            index: "",
            
        },
        
        
    ]

  return (
    
    //메인 바디

    <div className="flex w-[595px] h-[842px] px-[20px] py-[30px] items-center justify-center flex-col  ">
        <div className="flex flex-col w-[555px] h-[782px] gap-[15px]">
        {/* 견적서 */}
        <div className="flex w-full h-[42px] pb-[20px] items-center justify-center gap-[10px]
                font-[Spoqa Han Sans Neo] font-[20px] font-style:normal">
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
                        <td className="w-[50px] pl-[8px] bg-[rgba(238,238,238,0.5)] ">견적번호</td>
                        <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px]">2123812903812390128390890</td>
                        </tr>

                        <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">고객사</td>
                        <td colSpan={3} className="max-w-[75px] pl-[8px]">21231221321312</td>
                        </tr>

                        <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">프로젝트</td>
                        <td colSpan={3} className="max-w-[75px] pl-[8px]">21231221321312</td>
                        </tr>

                        <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] ">납기일</td>
                        <td colSpan={3} className="max-w-[75px] pl-[8px]">21231221321312</td>
                        </tr>

                        <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">배송조건</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">후불</td>
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">지불조건</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">현금</td>
                        </tr>

                        <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">위치</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">대한민국</td>
                        <td className="pl-[8px] bg-[rgba(238,238,238,0.5)] whitespace-nowrap">유효기간</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">2025-04-14</td>
                        </tr> 
                    </tbody>
            </table>
            </div> {/* 좌측 Table 끝 */}

            {/* 좌측 날짜 */}
            <div className="flex-col w-full h-[44px] justify-end items-center">
                <div className="h-[22px] flex items-center justify-center gap-[10px] font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                    <p> 2025</p>
                    <p>년</p>
                    <p> 04</p>
                    <p>월</p>
                    <p> 12</p>
                    <p>일</p>
                </div>
                <div className="h-[22px] flex items-center justify-center gap-[10px] font-[Spoqa Han Sans Neo] text-[9px] font-medium">아래와 같이 견적합니다.</div>
            </div>        
        </div>{/* 좌측 화면 끝 */}

        {/*우측 화면 */}
        <div className="w-[335px] h-full flex-start relative">

        <table className="table-auto w-full border-t border-[#D9D9D9]">
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">회사명</td>
                    <td colSpan={3} className="flex max-w-[75px] w-[90px] pl-[8px] pt-[5px]">12312312</td>
                    <td rowSpan={3} className="h-[75px] w-[168px] border-l border-[#D9D9D9] pl-[8px] pt-[5px]">
                        <div className="flex items-center justify-center"><Logo/></div></td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">사업자등록번호</td>
                    <td colSpan={3} className="flex max-w-[75px] w-[90px]  pl-[8px] pt-[5px]">134-81-91609</td>
                </tr>

                <tr className="h-[25px]">
                    <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">대표명</td>
                    <td colSpan={3} className="flex max-w-[75px] w-[90px]  pl-[8px] pt-[5px]">21290890 
                        <div className="absolute top-[20%] left-[39%]"><Dojang/></div></td>
                </tr>

            </tbody>
        </table>
        
        <table className="table-auto w-full border-t border-[#D9D9D9]">
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal">
                
                <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">업태</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">대한민국</td>
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">업종</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">2025-04-14</td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">전화번호</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">대한민국</td>
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">팩스번호</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">2025-04-14</td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">주소</td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px]">2123812903812390128390890</td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">담당자</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">대한민국</td>
                        <td className="pl-[8px] bg-[#E9EDF5] whitespace-nowrap">휴대번호</td>
                        <td className="max-w-[75px] pl-[8px] whitespace-nowrap">2025-04-14</td>
                </tr>

                <tr className="border-b border-[#D9D9D9] h-[25px]">
                    <td className="w-[75px] pl-[8px] bg-[#E9EDF5] ">E-Mail</td>
                    <td colSpan={3} className="max-w-[75px] pl-[8px] pt-[5px]">2123812903812390128390890</td>
                </tr>
            </tbody>
        </table>
        </div>{/* 좌측 화면 끝*/}
    </div>{/* 상단 바디 끝*/}

        <div className="w-full h-[30px] px-[5px] py-[20px] flex items-center bg-[rgba(238,238,238,0.5)]">
            <div className= "w-[515px] h-[24px] flex items-center pl-[20px] gap-[10px] font-[Spoqa Han Sans Neo] text-[12px] font-style:normal">
            
            <p>금액 :</p>
            <p>일백육십만</p>
            <p>원 정</p>        
        </div>
        <div className="w-[140px] h-[24px] pr-[20px] flex items-center justify-end gap-[10px] font-[Spoqa Han Sans Neo] text-[12px] font-style:normal whitespace-nowrap"> (￦1,600,000원) / VAT포함) </div>
        </div>

    {/* 하단 바디 시작 */}
    <div className= "w-full h-[445px] ">
        <table className="h-[25px] table-auto w-full border-t border-[#D9D9D9]">
            {/* 테이블 제목 */}
            <tbody className="mb-0 font-[Spoqa Han Sans Neo] text-[9px] font-style:normal bg-[rgba(238,238,238,0.5)]">
                <tr className="border-b border-[#D9D9D9] h-[25px] text-center align-middle whitespace-nowrap">
                <td className="border-r border-[#D9D9D9] w-[20px] h-[25px] px-[8px] ">No</td>
                <td className="border-r border-[#D9D9D9] w-[195px] h-[25px] px-[8px] ">견적 모델명</td>
                <td className="border-r border-[#D9D9D9] w-[30px] h-[25px] px-[8px] ">Array</td>
                <td className="border-r border-[#D9D9D9] w-[80px] h-[25px] px-[8px] ">재질</td>
                <td className="border-r border-[#D9D9D9] w-[65px] h-[25px] px-[8px] ">사이즈 x 두께</td>
                <td className="border-r border-[#D9D9D9] w-[25px] h-[25px] px-[8px] ">단위</td>
                <td className="border-r border-[#D9D9D9] w-[30px] h-[25px] px-[8px] ">수량</td>
                <td className="border-r border-[#D9D9D9] w-[50px] h-[25px] px-[8px] ">
                    단가 <span className="text-[7px]">(VAT 포함)</span>
                </td>
                <td className="border-r border-[#D9D9D9] w-[60px] h-[25px] px-[8px] ">금액</td>
                </tr>
            </tbody>

            {/* 항목 메인 */}
            <tbody className="font-[Spoqa Han Sans Neo] text-[9px] font-style:normal text-center align-middle">
                {/* 맵 입력 값 */}
                {sample.map((item, index) => (
                <tr key={index} className="border-b border-[#D9D9D9] h-[30px]">
                    <td className="border-r border-[#D9D9D9] px-[8px]">{index + 1}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.estimateModelNm}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.array}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.texturenm}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">
                    {item.sizeW} x {item.sizeH} x {item.thickness}T
                    </td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.quantityUnit}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.quantity}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.unitPrice}</td>
                    <td className="border-r border-[#D9D9D9] px-[8px]">{item.cost}</td>
                </tr>
                ))}

                {/* 총 합계 */}
                <tr className="border-b border-[#D9D9D9] h-[25px] bg-[rgba(238,238,238,0.5)]">
                <td className="border-r border-[#D9D9D9] px-[8px]" colSpan={5}>총 합계</td>
                <td className="border-r border-[#D9D9D9] px-[8px]">LOT</td>
                <td className="border-r border-[#D9D9D9] px-[8px]">160</td>
                <td className="border-r border-[#D9D9D9] px-[8px] text-right">합계 금액</td>
                <td className="border-r border-[#D9D9D9] px-[8px] text-right">1,600,000</td>
                </tr>

                {/* 빈 줄 */}
                {Array.from({ length: Math.max(0, 11 - sample.length - 1) }, (_, index) => (
                <tr key={`empty-${index}`} className="border-b border-[#D9D9D9] h-[30px]">
                    {Array.from({ length: 9 }).map((_, colIdx) => (
                    <td key={colIdx} className="border-r border-[#D9D9D9] px-[8px]">&nbsp;</td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
                            
            {/* 하단 푸터 시작 */}
            <div className="flex w-full h-[75px] font-[Spoqa Han Sans Neo] font-style:normal border-t border-b border-[#D9D9D9] mt-[-1px]">
                <div className="flex w-[40px] h-full p-[8px] items-center justify-center text-[10px] border-r border-[#D9D9D9]"> 비고 </div>
                <div className="w-full h-full p-[8px] text-[8px] leading-[10px]">
                    <div className="h-full ">
                    <p>견적서 요청하오니 확인 후 회신 부탁드립니다.</p>
                    <p>*원판1매 최대 수량으로 요청드립니다</p>
                    <p>순번 품목코드 품목명 규격 메이커 수량 단가 금액 비고</p>
                    <p>1 PCB-A0-05769 YUJ-YB14_CPU_R1.2 160x100x1.6T,4LY(GREEN,GOLD,FR4) Order Made 10 메탈마스크 동일사용: 타업체 CAM DATA</p>
                    <p>참조요망</p>
                    <p>2 PCB-A0-05720 YUJ-YB14_DISP_R1.4 256x120x1.6T,2LY,5AR(GREEN,GOLD,FR4) Order Made 10</p>
                </div>
                </div>
            </div>{/* 하단 푸터 끝 */}
    
        </div> {/* 하단 바디 끝 */}
            
        </div>
    </div>
);
}

export default EstimateDocumentForm;              


