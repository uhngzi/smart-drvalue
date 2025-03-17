import dayjs from "dayjs";

interface Props {
  mtList: {
    nm: string;
    w: number;
    h: number;
    thk: number;
    cnt: number;
    unit: string;
    wgt: number;
    price: number;
    priceUnit: number;
  }[];
  orderPrice: number;
}


const OrderDocumentForm: React.FC<Props> = ({
  mtList,
  orderPrice,
}) => {
  function numberToKorean(n: number): string {
    if (n === 0) return "영";

    const digit = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    const unit = ["", "십", "백", "천"];
    const bigUnit = ["", "만", "억", "조", "경"]; // 필요에 따라 확장 가능

    let result = "";
    let groupIndex = 0; // 4자리씩 그룹화할 때마다 단위(만, 억 등) 결정

    while (n > 0) {
      const groupNum = n % 10000; // 4자리 그룹
      n = Math.floor(n / 10000);

      let groupStr = "";
      let temp = groupNum;
      let pos = 0; // 일,십,백,천 자리

      while (temp > 0) {
        const d = temp % 10;
        if (d !== 0) {
          // 자리수가 10, 100, 1000 등일 때 d가 1이면 "일"을 생략하는 경우 (예: 10은 "십"으로 표기)
          const prefix = (d === 1 && pos > 0) ? "" : digit[d];
          groupStr = prefix + unit[pos] + groupStr;
        }
        temp = Math.floor(temp / 10);
        pos++;
      }

      if (groupStr !== "") {
        result = groupStr + bigUnit[groupIndex] + result;
      }
      groupIndex++;
    }

    return result;
  }

  const mtTable = () => {
    let rows: any[] = [];
    let tot = 0;
    for (let i = 0; i < 20; i++) {
      const item = mtList[i];
      if (item !== undefined) {
        // 값이 있을 경우 데이터 보여주는 행 추가
        tot += Number(item.price);
        rows.push(
          <div
            key={i}
            className="flex h-25 border-b-2 border-black"
          >
            <div className="w-50 v-h-center border-r-2 border-black px-10">
              {i + 1}
            </div>
            <div className="flex-1 h-center justify-start border-r-2 border-black px-10">
              {item.nm}
            </div>
            <div className="flex-1 v-h-center border-r-2 border-black px-10">
              {item.w} * {item.h} * {item.thk}
            </div>
            <div className="w-80 h-center justify-end border-r-2 border-black px-10">
              {item.cnt}
            </div>
            <div className="w-[200px] h-center justify-start border-r-2 border-black px-10">
              {item.unit}
            </div>
            <div className="w-80 h-center justify-end border-r-2 border-black px-10">
              {item.wgt}
            </div>
            <div className="w-100 h-center justify-end border-r-2 border-black px-10">
              {Number(item.priceUnit).toLocaleString()}
            </div>
            <div className="w-100 h-center justify-end px-10">
              {Number(item.price).toLocaleString()}
            </div>
          </div>
        );
      } else {
        // 빈 값일 경우 그냥 행만 추가
        rows.push(
          <div
            key={i}
            className="flex h-30 border-b-2 border-black"
          >
            <div className="w-50 v-h-center border-r-2 border-black" />
            <div className="flex-1 v-h-center border-r-2 border-black" />
            <div className="flex-1 v-h-center border-r-2 border-black" />
            <div className="w-80 v-h-center border-r-2 border-black" />
            <div className="w-[200px] v-h-center border-r-2 border-black" />
            <div className="w-80 v-h-center border-r-2 border-black" />
            <div className="w-100 v-h-center border-r-2 border-black" />
            <div className="w-100 v-h-center" />
          </div>
        );
      }
    }
    // Total 행 추가
    rows.push(
      <div
        key="total"
        className="h-30 border-b-[2.5px] border-black text-right"
      >
        <span className="mr-16">Total : </span>
        <span className="mr-4">{tot.toLocaleString()}</span>
        <span className="mr-4">원</span>
      </div>
    );
    return rows;
  };

  return (
    <div>
      <div className="w-full border-2 border-black">
        {/* 헤더 영역 */}
        <div className="h-[115px] flex border-b-2 border-black">
          <div className="w-1/4 h-full v-h-center border-r-2 border-black">
            회사 로고
          </div>
          <div className="w-1/2 h-full v-h-center border-r-2 border-black">
            <h1 className="text-2xl font-medium">발주서</h1>
          </div>
          <div className="w-1/4">
            <div className="px-10 v-between-h-center h-1/3 border-b-2 border-black">
              <span>Doc No. :</span>
            </div>
            <div className="px-10 v-between-h-center h-1/3 border-b-2 border-black">
              <span>Rev No. :</span>
            </div>
            <div className="px-10 v-between-h-center h-1/3">
              <span>Date :</span>
              <span>{dayjs().format("YYYY-MM-DD")}</span>
            </div>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="h-[1000px] px-10 flex flex-col gap-20">
          {/* 회사 및 프로젝트 정보 */}
          <div className="h-80 flex v-between-h-center">
            <div className="">
              <span>PJT CODE : </span>
              <span className="font-bold">프로젝트 코드</span>
            </div>
            <div className="font-semibold">
              회사명 (직인)
            </div>
          </div>

          {/* 주문 회사 정보 */}
          <div className="flex items-start justify-between">
            <div className="w-[250px] flex flex-col gap-2 items-end">
              <div className="w-full h-[25px] border-b-[2.5px] border-black flex justify-between">
                <div className="w-[200px] text-center font-semibold">
                  주문 회사명
                </div>
                <div className="w-[50px] text-center">貴中</div>
              </div>
              <div className="w-[200px] h-[25px] border-b-[2.5px] border-black text-center">
                발주일
              </div>
              <div className="w-[240px] h-[25px] border-b-[2.5px] border-black text-center">
                ...내용...
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-[400px] h-[25px] border-b-[2.5px] border-black text-center">
                주문 회사 주소
              </div>
              <div className="w-[400px] h-[25px] border-b-[2.5px] border-black v-between-h-center">
                <div className="w-[200px] text-left">TEL : 02-000-0000</div>
                <div className="w-[200px] text-left">FAX : 000-0000-0000</div>
              </div>
              <div className="w-[400px] h-[25px] border-b-[2.5px] border-black v-between-h-center">
                <div className="w-[200px] text-left">H.P : 010-0000-0000</div>
                <div className="w-[200px] text-left">담당자 : 홍길동</div>
              </div>
              <div className="w-[400px] h-[25px] border-b-[2.5px] border-black v-between-h-center">
                <div className="w-[200px] text-left">Site : </div>
                <div className="w-[200px] text-left">E-mail : </div>
              </div>
            </div>
          </div>

          {/* 발주 정보 */}
          <div className="v-between-h-center gap-2">
            <div className="font-[500]">
              <div>1. 귀사의 익일 번창하심을 기원드립니다.</div>
              <div>2. 아래의 사양으로 발주 드리오니 빠른 납기 부탁드립니다.</div>
              <div className="v-between-h-center gap-5">
                <span>3. 발주금액 : {orderPrice.toLocaleString()}</span>
                <span>(一金 {numberToKorean(orderPrice)} 정)</span>
              </div>
              <div className="v-between-h-center gap-5">
                <span>4. 결제조건 : </span>
                <span>...</span>
              </div>
            </div>
            <div className="w-[500px] v-h-center">
              VAT 별도
            </div>
          </div>

          {/* MT 내역 테이블 */}
          <div className="flex-1">
            <div className="w-full text-center border-[2.5px] border-black border-b-0">
              <div className="flex h-30 border-b-[2.5px] border-black">
                <div className="w-50 v-h-center border-r-2 border-black">번호</div>
                <div className="flex-1 v-h-center border-r-2 border-black">품명</div>
                <div className="flex-1 v-h-center border-r-2 border-black">사양</div>
                <div className="w-80 v-h-center border-r-2 border-black">수량</div>
                <div className="w-[200px] v-h-center border-r-2 border-black">단위</div>
                <div className="w-80 v-h-center border-r-2 border-black">중량</div>
                <div className="w-100 v-h-center border-r-2 border-black">단가</div>
                <div className="w-100 v-h-center">금액</div>
              </div>
              {mtTable()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDocumentForm;