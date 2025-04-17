import React from 'react';

const sample = "h-[25px] border-t border-b border-[#D9D9D9] font-normal";
const titleTableStyle = "w-75 h-20 px-8";

// 기본정보 테이블 스타일
const defaultInfoTheadStyle = "h-25 font-normal border-[#D9D9D9]";
const defaultInfoTbodyStyle = "px-8 py-7 border-[#D9D9D9]";

// left 기본사양 테이블 스타일
const defaultSpecTrStyle = "border-t border-[#D9D9D9]";
const defaultSpecThStyle = "w-75 px-8 h-20 bg-[#EEEEEE80] text-left font-normal";
const defaultSpecTdStyle = "max-w-75 w-75 px-8 h-20";

// 배열 테이블 및 SPEC 테이블 스타일
const arrAndSpecTrStyle = "border-t border-[#D9D9D9]";
const arrAndSpecThStyle = "w-75 h-20 bg-[#EEEEEE80] text-left font-normal";
const arrAndSpecTdStyle = "max-w-75 w-75 h-20 px-8";

// Film 소요량 테이블 스타일
const filmAmountThStyle = "h-20 border-t border-r border-[#D9D9D9] bg-[#FAFAFA] font-normal";
const filmAmountTdStyle = "py-3 border-t border-b border-[#D9D9D9] text-center";

const FilmDocumentForm = () => {
  return (
    <div className="flex flex-col gap-10 w-[595px] h-[842px] px-20 py-30 bg-[#fff]">

      {/* 타이틀 영역 */}
      <div className="v-between-h-center">
        <div className="v-h-center w-75 h-40 bg-[#000] text-[#fff]">임시 로고</div>

        <div>
          <p className="text-20 text-[#000] font-medium">FILM 제작의뢰서</p>
        </div>
        
        <div>
          <table>
            <tbody className="text-left text-9">
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>작성일</th>
                <td className={titleTableStyle}>내용</td>
              </tr>
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>작성자</th>
                <td className={titleTableStyle}>내용</td>
              </tr>
              <tr className="border-t border-b border-[#D9D9D9]">
                <th className={titleTableStyle + " bg-[#EEEEEE80] font-normal"}>CAM</th>
                <td className={titleTableStyle}>내용</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> {/* 타이틀 영역 end */}
      

      {/* 기본정보 영역 */}
      <div>
        <table className="w-full border-collapse text-center text-10">
          <thead className="bg-[#EEEEEE80]">
            <tr className="border-t border-b border-[#D9D9D9]">
              <th className={defaultInfoTheadStyle + " w-40"}>No</th>
              <th className={defaultInfoTheadStyle + " w-70 border-l"}>관리No</th>
              <th className={defaultInfoTheadStyle + " w-70 border-l"}>업체명</th>
              <th className={defaultInfoTheadStyle + " w-[255px] border-l"}>MODEL</th>
              <th className={defaultInfoTheadStyle + " w-40 border-l"}>Rev</th>
              <th className={defaultInfoTheadStyle + " w-80 border-l"}>적용사항</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-b border-[#D9D9D9]">
              <td className={defaultInfoTbodyStyle + " bg-[#FEFBAD80]"}>1</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>900-0894</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>GPN</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>GPNERPTEST001-00005001V1.5,LSLV0110S-0.0</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>0.0.0</td>
              <td className={defaultInfoTbodyStyle + " border-l"}>브릿지 홀 삽입</td>
            </tr>
          </tbody>
        </table>
      </div> {/* 기본정보 영역 end */}


      {/* 제작정보 영역 */}
      <div className="v-between-h-center">

        {/* left */}
        <div className="flex flex-col gap-10 w-[150px] text-9">

          {/* left 기본사양 테이블 */}
          <table className="w-full">
            <tbody>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>투입구분</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>층수</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>제품 두께</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>외형가공</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>V-CUT</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>외층 동박</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>내층 동박</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>임피던스</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle}>
                <th className={defaultSpecThStyle}>쿠폰</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
              <tr className={defaultSpecTrStyle + " border-b"}>
                <th className={defaultSpecThStyle}>납기일</th>
                <td className={defaultSpecTdStyle}>test</td>
              </tr>
            </tbody>
          </table>

          {/* 배열 테이블 */}
          <div>
            <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5]">배열</div>
            
            <table className="w-full">
              <tbody>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>연조</th>
                  <td className={arrAndSpecTdStyle}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>KIT SIZE</th>
                  <td className={arrAndSpecTdStyle}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>배열</th>
                  <td className={arrAndSpecTdStyle}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>규격</th>
                  <td className={arrAndSpecTdStyle}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle + " border-b"}>
                  <th className={arrAndSpecThStyle + " pl-8"}>WORKING SIZE</th>
                  <td className={arrAndSpecTdStyle}>1</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SPEC 테이블 */}
          <div>
            <div className="v-h-center h-20 bg-[#E9EDF5] border-t border-[#D9D9D9]">SPEC</div>

            <table className="w-full">
              <tbody>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>회로두께</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>회로간격</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>드릴(￠)</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle}>
                  <th className={arrAndSpecThStyle + " px-8"}>랜드(￠)</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>1</td>
                </tr>
                <tr className={arrAndSpecTrStyle + " border-b"}>
                  <th className={arrAndSpecThStyle + " px-8"}>난이도</th>
                  <td className={arrAndSpecTdStyle + " bg-[#FEFBAD80]"}>1</td>
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
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-[#000000D9] text-left font-normal">필름사이즈</th>
              <td className="max-w-[110px] w-[110px] h-36 bg-[#FEFBAD80] text-12 text-center">326 X 400</td>
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-[#000000D9] text-left font-normal">재단사이즈</th>
              <td className="max-w-[110px] w-[110px] h-36 bg-[#FEFBAD80] text-12 text-center">2등분</td>  
            </tr>
            <tr className="border-b border-[#D9D9D9]">
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-left font-normal">내층 스케일</th>
              <td className="max-w-[110px] w-[110px] h-36 text-10 text-center text-[#F92727]">100.02 X 100.01</td>
              <th className="w-80 h-36 px-8 bg-[#EEEEEE80] text-12 text-left font-normal">원판</th>
              <td className="max-w-[110px] w-[110px] h-36 text-10 text-center">test</td>  
            </tr>
          </table>

          {/* 배열 도면 */}
          <div className="w-full">
            <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">배열 도면</div>

            <div className="h-[268px] bg-[#D9D9D9]">
              {/* ...배열 도면 content... */}
            </div>
          </div>

          {/* FILM 소요량 테이블 */}
          <div>
            <div className="v-h-center w-full h-20 border-t border-[#D9D9D9] bg-[#E9EDF5]">FILM 소요량</div>

            <table className="w-full">
              <tbody>
                <tr>
                  <th colSpan={3} className={filmAmountThStyle + " w-[95.25px]"}>PATT</th>
                  <th colSpan={2} className={filmAmountThStyle + " w-[63.5px]"}>S/M(코팅)</th>
                  <th colSpan={2} className={filmAmountThStyle + " w-[63.5px]"}>M/K(UV)</th>
                  <th colSpan={5} className={filmAmountThStyle + " w-[158.75px]"}>특수인쇄</th>
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

      </div> {/* 제작정보 영역 end */}


      {/* CAM 전달사항 / UL주기 영역 */}
      <div className="v-between-h-center">
        
        {/* CAM 전달사항 */}
        <div className="w-[320px]">
          <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">CAM 전달사항</div>

          <div className="h-[157px] p-10 border-t border-b border-[#D9D9D9] text-10 text-[#000000A6]">
            {/* ...CAM 전달사항 content... */}
            <div>
              <p>* VIA LAND 0.65 작업하되 간격 안 나오는 부분 0.63 작업</p>
              <p>* TOP IC 마스크 없는 부분 만들어서 작업</p>
              <p>* 승인원(필름1부) 제출</p>
            </div>
          </div>
        </div>

        {/* UL주기 / 관리No 영역 */}
        <div className="flex flex-col gap-10 w-[225px]">

          {/* UL주기 테이블 */}
          <div>
            <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">UL/ 주기</div>

            <table className="w-full text-9">
              <tbody>
                <tr className="h-20">
                  <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">UL</th>
                  <td colSpan={2} className="max-w-[150px] w-[150px] px-8 border-t border-[#D9D9D9]">test</td>
                </tr>
                <tr className="h-20">
                  <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">위치</th>
                  <td className="max-w-75 w-75 px-8 border-t border-r border-[#D9D9D9]">test</td>
                  <td className="max-w-75 w-75 px-8 border-t border-[#D9D9D9]">test</td>
                </tr>
                <tr className="h-20">
                  <th className="w-75 px-8 border-t border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">주기</th>
                  <td colSpan={2} className="max-w-[150px] w-[150px] px-8 border-t border-[#D9D9D9]">test</td>
                </tr>
                <tr className="h-20">
                  <th className="w-75 px-8 border-t border-b border-[#D9D9D9] bg-[#EEEEEE80] text-left font-normal">위치</th>
                  <td className="max-w-75 w-75 px-8 border-t border-b border-r border-[#D9D9D9]">test</td>
                  <td className="max-w-75 w-75 px-8 border-t border-b border-[#D9D9D9]">test</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 관리No */}
          <div className="w-full">
            <div className="v-h-center h-20 border-t border-[#D9D9D9] bg-[#E9EDF5] text-9">관리No</div>
            
            <div className="v-h-center h-47 border-t border-b border-[#D9D9D9]">
              {/* ...관리No content... */}
              <p className="text-20 font-bold">S24-I3199</p>
            </div>
          </div>
          
        </div>

      </div> {/* CAM 전달사항 / UL주기 영역 end */}

    </div> 
  )
}

export default FilmDocumentForm;