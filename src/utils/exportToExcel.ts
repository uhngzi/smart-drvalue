import get from "lodash/get";
import dayjs from "dayjs";
import { FinalGlbStatus, HotGrade, ModelStatus, ModelTypeEm, SalesOrderStatus } from "@/data/type/enum";
import { postAPI } from "@/api/post";
import { downloadFileByObjectName } from "@/components/Upload/upLoadUtils";
import { toast } from "react-toastify";

export const exportToExcelAndPrint = async (
  columns: {
    title: string;
    dataIndex: string;
    width?: number;
    cellAlign?: "left" | "center" | "right";
  }[],
  data: any[],
  totalData: number,
  pagination: { current: number; size: number },
  menuTitle: string,
  actionType: "excel" | "print",
  showToast?: (message: string, type?: "success" | "error" | "info", duration?: number) => void,
  excelUrl?: string,
  excelType?: "file-mng" | "auth" | "sync" | "baseinfo" | "core-d1" | "core-d2" | "core-d3" | "utility",
) => {
  if (!data || data.length === 0) {
    showToast?.("출력할 데이터가 없습니다.", "error");
    return;
  }

  if(actionType === "excel" && excelUrl && excelType) {
    const toastId = toast.loading("엑셀 파일을 생성 중입니다...", {
      className: "custom-toast",
    });

    const cal = columns.flatMap((item, index) => {
      if(item.title.includes("M/K") || item.title.includes("S/M") ||
        item.title.includes("Pcs/Kit") || item.title.includes("Kit/Pnl") ||
        item.title.includes("Pcs/Sht") || item.title.includes("Pnl/Sht")) {
        return {
          key: item.dataIndex,
          value: item.title,
          width: item.width,
        };
      } else {
        const keys = item.dataIndex.split(/[/|*]/); // "/" 또는 "*"로 분리
        const values = item.title?.toString().split(/[/|*]/); // value도 같은 방식으로 분리

        return keys.map((key:string, i:number) => ({
          key: key.trim(),
          value: values?.[i]?.trim() || "",
          width: item.width,
        }));
      }
    });

    const result = await postAPI({
      type: excelType, 
      utype: 'tenant/',
      jsx: 'jsxcrud',
      url: `${excelUrl}/excel-download/jsxcrud?sort=createdAt,DESC`,
      etc: true,
    }, {cal: cal.filter(f=>f.key !== 'index' && f.key !== 'check').map((item, index)=>({...item, order:index+1}))});
    console.log(JSON.stringify({cal: cal.filter(f=>f.key !== 'index' && f.key !== 'check').map((item, index)=>({...item, order:index+1}))}));

    if(result.resultCode === 'OK_0000') {
      const fileId = result.data.data as string;
      console.log(fileId);
      if(fileId) {
        downloadFileByObjectName(fileId, {uid:fileId, name:`${menuTitle}_${dayjs().format("YYYYMMDD")}.xlsx`})
        toast.update(toastId, {
          render: "엑셀 파일 다운로드가 완료되었습니다.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          className: "custom-toast",
        });
        return;
      }
    } else {
      const msg = result.response?.data?.message;
      showToast?.(msg, "error");
      toast.update(toastId, {
        render: "엑셀 파일 다운로드를 하던 중에 문제가 생겼습니다. 잠시후에 시도해주세요.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        className: "custom-toast",
      });
      return;
    }
    return;
  }

  // "id" 컬럼 제외한 새로운 컬럼 목록
  const filteredColumns = columns.filter(col => col.dataIndex !== "id");

  // 데이터 변환 (id 제외)
  const formattedData = data.map((row, rowIndex) => {
    let newRow: Record<string, any> = {};

    filteredColumns.forEach(({ dataIndex, title }) => {
      let value;

      if (dataIndex === "index") {
        value = rowIndex + 1;
      } 
      else if (dataIndex.includes("/")) {
        const keys = dataIndex.split("/");
        value = keys.map((key) => get(row, key, "")).filter(Boolean).join(" / ");
      } 
      else if (dataIndex.includes("*")) {
        const keys = dataIndex.split("*");
        value = keys.map((key) => get(row, key, "")).filter(Boolean).join(" * ");
      }
      
      else {
        value = get(row, dataIndex, "") || "";
      }

      if (Number.isNaN(value) && (value instanceof Date || (value && dayjs(value).isValid()))) {
        value = dayjs(value).format("YYYY-MM-DD");
      }

      if (dataIndex.toLowerCase().includes("modelstatus")) {
        value = value === ModelStatus.MODIFY ? "수정" : value === ModelStatus.REPEAT ? " 반복" : "일반";
      }

      if (dataIndex.toLowerCase().includes("modeltypeem")) {
        value = value === ModelTypeEm.SAMPLE ? "샘플" : "양산";
      }

      if (dataIndex.toLowerCase().includes("layerem")) {
        value = value?.replace("L","");
      }

      if (dataIndex.toLowerCase().includes("salesorderstatus")) {
        value = value === SalesOrderStatus.MODEL_REG_COMPLETED ? "확정" :
          SalesOrderStatus.MODEL_REG_DISCARDED ? "폐기" :
          SalesOrderStatus.MODEL_REG_REGISTERING ? "등록중" :
          SalesOrderStatus.MODEL_REG_WAITING ? "대기" :
          "양산";
      }

      if (dataIndex.toLowerCase().includes("hotgrade")) {
        value = value === HotGrade.SUPER_URGENT ? "초긴급" : value === HotGrade.URGENT ? "긴급" : "일반";
      }

      if (dataIndex.toLowerCase().includes("finalglbstatus")) {
        const isDiscard = get(row, "isDiscard", "");
        value = isDiscard ? "폐기" :
          value === FinalGlbStatus.COMPLETED ? "완료" : 
          value === FinalGlbStatus.REGISTERING ? "등록중" :
          value === FinalGlbStatus.WAITING ? "대기" :
          "폐기";
      }

      newRow[title] = value;
    });

    return newRow;
  });

  // **엑셀 다운로드 처리**
  // if (actionType === "excel") {
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);

  //   worksheet["!cols"] = filteredColumns.map((col) => ({
  //     wpx: col.width ?? 100,
  //     hidden: false,
  //   }));

  //   worksheet["!rows"] = [
  //     { hpx: 27 }, 
  //     ...formattedData.map(() => ({ hpx: 20 })),
  //   ];

  //   const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  //   for (let rowIdx = range.s.r; rowIdx <= range.e.r; rowIdx++) {
  //     for (let colIdx = range.s.c; colIdx <= range.e.c; colIdx++) {
  //       const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
  //       if (!worksheet[cellAddress]) continue;

  //       const columnDef = filteredColumns[colIdx] || {};
  //       const alignment = columnDef.cellAlign || "center";

  //       if (rowIdx === 0) {
  //         worksheet[cellAddress].s = {
  //           font: { bold: true },
  //           alignment: { horizontal: "center", vertical: "center" },
  //           fill: { fgColor: { rgb: "F2F2F2" } },
  //           border: {
  //             top: { style: "thin", color: { rgb: "D5D5D5" } },
  //             left: { style: "thin", color: { rgb: "D5D5D5" } },
  //             right: { style: "thin", color: { rgb: "D5D5D5" } },
  //             bottom: { style: "medium", color: { rgb: "000000" } },
  //           },
  //         };
  //       } else {
  //         worksheet[cellAddress].s = {
  //           alignment: { horizontal: alignment, vertical: "center" },
  //           border: {
  //             top: { style: "thin", color: { rgb: "D5D5D5" } },
  //             left: { style: "thin", color: { rgb: "D5D5D5" } },
  //             right: { style: "thin", color: { rgb: "D5D5D5" } },
  //             bottom: { style: "thin", color: { rgb: "000000" } },
  //           },
  //         };
  //       }
  //     }
  //   }

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, menuTitle);

  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const excelData = new Blob([excelBuffer], { type: "application/octet-stream" });

  //   saveAs(excelData, `${menuTitle}_${dayjs().format("YYYYMMDD")}.xlsx`);
  // }

  // **프린트 기능**
  if (actionType === "print") {
    let printWindow = window.open("", "_blank")!;
    if (!printWindow) return;

    let style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #D9D9D9; padding: 8px; text-align: center; font-size: 14px; }
        th { background: #F2F2F2; font-weight: bold; border-bottom: 2px solid black; }
        td { border-bottom: 1px solid black; }
      </style>
    `;

    let tableHTML = `
      <h2>${menuTitle}</h2>
      <table>
        <thead>
          <tr>
            ${filteredColumns.map(col => `<th style="text-align:center;">${col.title}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${formattedData
            .map(row => `<tr>${filteredColumns.map(col => `<td style="text-align:${col.cellAlign || "center"};">${row[col.title] || ""}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    `;

    printWindow.document.write("<html><head>" + style + "</head><body>" + tableHTML + "</body></html>");
    printWindow.document.close();
    printWindow.print();
  }
};
