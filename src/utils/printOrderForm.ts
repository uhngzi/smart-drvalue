import { companyType } from "@/data/type/base/company";
import { buyOrderType } from "@/data/type/buy/cost";
import dayjs from "dayjs";
import Logo from "@/assets/logo/gpn-logo.png";
import { baseURL } from "@/api/lib/config";
import { SetStateAction } from "react";

export const handleDirectPrint = async (
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
  }[],
  order: buyOrderType | null,
  data: companyType | null,
  setOpen: React.Dispatch<SetStateAction<boolean>>,
) => {
  const orderPrice = mtList.reduce((acc, item) => acc + item.price, 0);

  const numberToKorean = (n: number): string => {
    if (n === 0) return "영";

    const digit = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    const unit = ["", "십", "백", "천"];
    const bigUnit = ["", "만", "억", "조", "경"];

    let result = "";
    let groupIndex = 0;

    while (n > 0) {
      const groupNum = n % 10000;
      n = Math.floor(n / 10000);

      let groupStr = "";
      let temp = groupNum;
      let pos = 0;
      while (temp > 0) {
        const d = temp % 10;
        if (d !== 0) {
          const prefix = d === 1 && pos > 0 ? "" : digit[d];
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
  };

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const style = `
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 210mm;
        height: 297mm;
      }
      table { width:100%; border-collapse:collapse; }
      th, td { border:2px solid black; text-align:center; padding:4px; font-size:14px; }
      th { font-weight:bold; }
    </style>
  `;

  let rows = "";
  let tot = 0;
  for (let i = 0; i < 20; i++) {
    const item = mtList[i];
    rows += `<tr style="height: 30px;">
      <td>${item ? i + 1 : ""}</td>
      <td style="text-align: left;">${item?.nm ?? ""}</td>
      <td>${item ? `${item.w}*${item.h}*${item.thk}` : ""}</td>
      <td style="text-align: left;">${item?.unit ?? ""}</td>
      <td style="text-align: right;">${item ? item.wgt.toLocaleString() : ""}</td>
      <td style="text-align: right;">${item ? item.cnt.toLocaleString() : ""}</td>
      <td style="text-align: right;">${item ? item.priceUnit.toLocaleString() : ""}</td>
      <td style="text-align: right;">${item ? item.price.toLocaleString() : ""}</td>
    </tr>`;
    if(item) {
      tot += item.price;
    }
  }

  printWindow.document.write(`
    <html>
      <head>${style}</head>
      <body>
        <div style="width: 100%; border: 2px solid black;">
          <div style="display: flex; height: 115px; border-bottom: 2px solid black;">
            <div style="width: 25%; height: 100%; display: flex; align-items: center; justify-content: center; border-right: 2px solid black;">
              ${Logo ? `<img src="../assets/logo/gpn-logo.png"" width="120"/>` : ""}
            </div>
            <div style="width: 50%; height: 100%; display: flex; align-items: center; justify-content: center; border-right: 2px solid black;">
              <h1 style="fontWeight: 500; fontSize: 25px;">발주서</h1>
            </div>
            <div style="width: 25%; height: 100%">
              <div style="padding: 0px 10px; display: flex; align-items: center; justify-content: space-between; height: 50%; border-bottom: 2px solid black;">
                <span>Doc No. : </span>
                <span>${order?.detailInfo?.docNo}</span>
              </div>
              <div style="padding: 0px 10px; display: flex; align-items: center; justify-content: space-between; height: 50%;">
                <span>Date :</span>
                <span>${dayjs().format("YYYY-MM-DD")}</span>
              </div>
            </div>
          </div>
          
          <div style="height: calc(100% - 115px); padding: 0 40px; display: flex; flex-direction: column; gap: 50px; padding-top: 30px;">
            <div style="display: flex; justify-content: space-between">
              <div style="width: 250px; display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; align-items: center; justify-content: space-between;">
                  <div style="width: 200px; text-align: center; font-weight: bold;">
                    ${order?.detailInfo?.prtInfo?.prt?.prtNm}
                  </div>
                  <div style="width: 50px; text-align: center;">貴中</div>
                </div>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; align-items: center; justify-content: space-between;">
                  <span style="width: 80px; text-align: right;">발주일 : </span>
                  <span>${order?.detailInfo?.orderDt ? dayjs(order?.detailInfo?.orderDt).format("YYYY-MM-DD") : null}</span>
                </div>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; align-items: center; justify-content: space-between;">
                  <span style="width: 80px; text-align: right;">납품요구일 : </span>
                  <span>${order?.detailInfo?.deliveryDueDt ? dayjs(order?.detailInfo?.deliveryDueDt).format("YYYY-MM-DD") : null}</span>
                </div>
              </div>
  
              <div style={companyInfoStyle}>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; text-align: center;">
                  <div style="padding: 0 20px;">${data?.companyName}</div>
                  ${
                    data?.signatureImageId
                      ? `<img src="${baseURL}file-mng/v1/every/file-manager/download/${data.signatureImageId}" width="100"/>`
                      : ""
                  }
                </div>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; align-items: center; text-align: left;">
                  ${data?.address}
                </div>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; justify-content: space-between; align-items: center;">
                  <div style="width: 200px; text-align: left;">TEL : ${data?.ceoPhone ?? ""}</div>
                  <div style="width: 200px; text-align: left;">FAX : ${data?.ceoFax ?? ""}</div>
                </div>
                <div style="width: 100%; height: 25px; border-bottom: 2.5px solid black; display: flex; justify-content: space-between; align-items: center;">
                  <div style="width: 200px; text-align: left;">H.P : ${data?.ceoPhone ?? ""}</div>
                  <div style="width: 200px; text-align: left;">E-mail : ${data?.ceoEmail ?? ""}</div>
                </div>
              </div>
            </div>
  
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
              <div style="font-weight: 500;">
                <div>1. 귀사의 익일 번창하심을 기원드립니다.</div>
                <div>2. 아래의 사양으로 발주 드리오니 빠른 납기 부탁드립니다.</div>
                <div style="display: flex; gap: 16px; align-items: center;">
                  <span>3. 발주금액 : ${(orderPrice ?? 0).toLocaleString()}</span>
                  <span>(一金 ${numberToKorean(orderPrice ?? 0)} 정)</span>
                </div>
                <div style="display: flex; gap: 16px; align-items: center;">
                  <span>4. 결제조건 : </span>
                  <span>${order?.detailInfo?.paymentCondition ?? ""}</span>
                </div>
              </div>
              <div style="width: 300px; display: flex; align-items: center; justify-content: center;">
                VAT 별도
              </div>
            </div>
  
            <table style="width:100%;border:2px solid black;border-collapse:collapse;">
              <thead>
                <tr style="height: 30px;">
                  <th style="width: 50px;">번호</th>
                  <th style="flex: 1;">품명</th>
                  <th style="flex: 1;">사양</th>
                  <th style="width: 100px;">단위</th>
                  <th style="width: 60px;">중량</th>
                  <th style="width: 60px;">수량</th>
                  <th style="width: 80px;">단가</th>
                  <th style="width: 80px;">금액</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
                <tr>
                  <td colspan="8" style="font-weight: bold; text-align: right;">
                    TOTAL : ${tot.toLocaleString()} 원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.title = dayjs().format("YYYYMMDD")+"_"+order?.detailInfo?.prtInfo?.prt?.prtNm+"_"+order?.detailInfo?.orderName;

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  if(printWindow.closed)  setOpen(false);
};
