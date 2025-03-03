import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import AntdSelectRound from "@/components/Select/AntdSelectRound";
import { selectType } from "@/data/type/componentStyles";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { getCulChkList } from "@/utils/culChk";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Table } from "antd";
import { MenuProps } from "antd/lib";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"

import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const getDeptNteam = async () => {
  return await axios.get(`http://1.234.23.160:3301/pcb/dept/list/with/sub`);
};

const getSecomData = async (date: Dayjs, dept?: number) => {
  let dt = dayjs(date).format("YYYY-MM").toString();
  console.log(dt, dept);
  if (!dept) return await axios.get(`http://1.234.23.160:3301/pcb/secom/list/${dt}`);
  return await axios.get(`http://1.234.23.160:3301/pcb/secom/list/${dt}/${dept}`);
};



// ============ 트리를 1차원 배열로 변환하는 유틸 ============
function flattenTreeData(nodes: any[]): any[] {
  let result: any[] = [];
  nodes.forEach((node) => {
    result.push(node);
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenTreeData(node.children));
    }
  });
  return result;
}

// =================== 엑셀 / 프린트 전용 로직 ===================

/** (1) 휴일/주말 색상 */
function getHolidayColor(dayNum: number, selDate: Dayjs, culList: string[]) {
  const dayStr = String(dayNum).padStart(2, "0");
  const isHoliday = culList.includes(dayStr);
  const current = dayjs(`${selDate.format("YYYY")}-${selDate.format("MM")}-${dayStr}`);
  const dow = current.day(); // 0=일요일, 6=토요일

  if (isHoliday || dow === 0) return "#fff0e1"; // 공휴일·일요일
  if (dow === 6) return "#d4f9f4"; // 토요일
  return undefined;
}

/** (2) 출퇴근 색상 */
function getAttendanceColor(timeValue: string | null, empTit: string, flag1: string) {
  // 사무직 출근
  if (timeValue && timeValue > "08:30" && empTit === "사무직" && flag1 === "1") {
    return "#96b670";
  }
  // 사무직 퇴근
  if (timeValue && timeValue < "17:30" && empTit === "사무직" && flag1 === "4") {
    return "#96b670";
  }
  // 생산직(주간) 출근
  if (timeValue && timeValue > "08:20" && empTit === "생산직(주간)" && flag1 === "1") {
    return "#96b670";
  }
  // 생산직(주간) 퇴근
  if (timeValue && timeValue < "17:20" && empTit === "생산직(주간)" && flag1 === "4") {
    return "#96b670";
  }
  // 생산직(주간/야간) 출근
  if (timeValue && timeValue > "17:00" && empTit === "생산직(주간/야간)" && flag1 === "1") {
    return "#96b670";
  }
  // 생산직(주간/야간) 퇴근
  if (timeValue && timeValue < "04:30" && empTit === "생산직(주간/야간)" && flag1 === "4") {
    return "#96b670";
  }
  return undefined;
}

/** (3) 최종 색상 결정 (출퇴근 우선) */
function getExcelCellBackground(timeValue: string | null, empTit: string, flag1: string, dayNum: number, selDate: Dayjs, culList: string[], isParent?: boolean) {
  // 부모(대표) 행이면 timeValue 없음 => 휴일 색만
  if (isParent) {
    // check holiday / weekend
    return getHolidayColor(dayNum, selDate, culList);
  }

  // 자식(직원)
  const attColor = getAttendanceColor(timeValue, empTit, flag1);
  if (attColor) return attColor;

  // 없으면 휴일/주말 색
  return getHolidayColor(dayNum, selDate, culList);
}

/**
 * (4) 엑셀 다운로드: 
 *   - 헤더: [ 팀명, 직원명, 업무구분, 구분, 1, 2, ..., lastDay ]
 *   - 각 행: tableDataFlattened 를 순회
 *   - 셀 스타일 (특히 행1=헤더 스타일, 나머지=데이터)
 *   - dayNum 에 따른 배경색
 */
function handleExcelDownload2(flatData: any[], lastDay: number, selDate: Dayjs, culList: string[]) {
  if (!flatData.length) return;

  // 1) 헤더 row
  const headerRow = ["팀명", "직원명", "업무구분", "구분"];
  for (let i = 1; i <= lastDay; i++) {
    headerRow.push(String(i));
  }

  // 2) 데이터 rows (2차원 배열)
  //   예: [ [팀명, 직원명, 업무구분, 구분, d01, d02, ...], ... ]
  const aoa = [];
  aoa.push(headerRow);

  flatData.forEach((row) => {
    const isParent = !!row.children; // 대표행(부모)이면 children이 있음
    const arr = [];
    // (a) 앞 4개
    arr.push(row.teamNm || ""); 
    arr.push(row.name || "");    
    arr.push(row.empTit || "");  
    // 구분
    if (row.flag1 === "1") arr.push("출근");
    else if (row.flag1 === "4") arr.push("퇴근");
    else arr.push("");

    // (b) 날짜별
    for (let i = 1; i <= lastDay; i++) {
      const dayKey = i < 10 ? `d0${i}` : `d${i}`;
      arr.push(row[dayKey] || "");
    }

    aoa.push(arr);
  });

  // 3) 시트 만들기
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // 4) 컬럼 너비 (원하는 대로)
  //    ex: 첫 4개는 좀 넓게, 나머지는 6칸 정도
  const colWidths = [
    { wpx: 120 }, // 팀명
    { wpx: 80 },  // 직원명
    { wpx: 80 },  // 업무구분
    { wpx: 60 },  // 구분
  ];
  for (let i = 1; i <= lastDay; i++) {
    colWidths.push({ wpx: 30 });
  }
  worksheet["!cols"] = colWidths;

  // 5) 행 높이
  const rowHeights = aoa.map((_, idx) => {
    if (idx === 0) return { hpx: 24 }; // 헤더 행
    return { hpx: 20 };               // 데이터 행
  });
  worksheet["!rows"] = rowHeights;

  // 6) 셀 스타일 (헤더 / 데이터)
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      // (a) 헤더 스타일
      if (R === 0) {
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "F2F2F2" } },
          border: {
            top: { style: "thin", color: { rgb: "D5D5D5" } },
            left: { style: "thin", color: { rgb: "D5D5D5" } },
            right: { style: "thin", color: { rgb: "D5D5D5" } },
            bottom: { style: "medium", color: { rgb: "000000" } },
          },
        };
      } else {
        // (b) 데이터 스타일
        const rowIndexInData = R - 1; // aoa의 데이터 부분 index
        const dataRow = flatData[rowIndexInData];
        // day column index => C-4 (0~3 = 팀명/직원명/업무구분/구분)
        // => dayNum = C - 4 + 1
        let fillColor = undefined;
        if (C >= 3) {
          const dayNum = C - 3; // C=4 => dayNum=1
          const timeValue = dataRow[dayNum < 10 ? `d0${dayNum}` : `d${dayNum}`] || null;
          fillColor = getExcelCellBackground(timeValue, dataRow.empTit, dataRow.flag1, dayNum, selDate, culList, !!dataRow.children);
          // 만약 fillColor가 없다면 => 퇴근 행 체크
          if (!fillColor && String(dataRow.flag1) === "4") {
            fillColor = "#F2F2F2";
          }
        }

        cell.s = {
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "D5D5D5" } },
            left: { style: "thin", color: { rgb: "D5D5D5" } },
            right: { style: "thin", color: { rgb: "D5D5D5" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
          },
        };

        // 배경색이 있으면 fill 적용
        if (fillColor) {
          // fillColor 예: "#96b670" → XLSX는 "RRGGBB" hex만 인식. #을 빼고 uppercase.
          const hex = fillColor.replace("#", "").toUpperCase();
          cell.s.fill = { fgColor: { rgb: hex } };
        }
      }
    }
  }

  // 7) Workbook 생성 & 다운로드
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "근무표");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(excelData, `근무표_${dayjs().format("YYYYMMDD")}.xlsx`);
}

/** (5) 프린트 */
function handlePrint2(flatData: any[], lastDay: number, selDate: Dayjs, culList: string[]) {
  if (!flatData.length) return;

  // (a) colgroup + thead
  let colgroup = `
    <colgroup>
      <col style="width:30mm;" />  <!-- 팀명 -->
      <col style="width:25mm;" />  <!-- 직원명 -->
      <col style="width:25mm;" />  <!-- 업무구분 -->
      <col style="width:20mm;" />  <!-- 구분 -->
  `;
  for (let i = 1; i <= lastDay; i++) {
    colgroup += `<col style="width:10mm;" />`; // 날짜 열
  }
  colgroup += `</colgroup>`;
  
  // (a) HTML 표의 헤더
  let thead = `<thead><tr>
    <th>팀명</th>
    <th>직원명</th>
    <th>업무구분</th>
    <th>구분</th>
  `;
  for (let i = 1; i <= lastDay; i++) {
    thead += `<th>${i}</th>`;
  }
  thead += "</tr></thead>";

  // (b) tbody
  let tbody = "<tbody>";
  flatData.forEach((row) => {
    const isParent = !!row.children;
    tbody += "<tr>";

    // 팀명
    tbody += `<td>${row.teamNm || ""}</td>`;
    // 직원명
    tbody += `<td>${row.name || ""}</td>`;
    // 업무구분
    tbody += `<td>${row.empTit || ""}</td>`;
    // 구분
    let gubun = "";
    let fill = "";
    if (row.flag1 === "1") { gubun = "출근"; fill="none"; }
    else if (row.flag1 === "4") { gubun = "퇴근"; fill="#F2F2F2"; }
    tbody += `<td style="background-color:${fill}">${gubun}</td>`;

    // 날짜별
    for (let i = 1; i <= lastDay; i++) {
      const dayKey = i < 10 ? `d0${i}` : `d${i}`;
      const timeValue = row[dayKey] || null;
      let fillColor = getExcelCellBackground(timeValue, row.empTit, row.flag1, i, selDate, culList, isParent);
      if (!fillColor && row.flag1 === "4") {
        fillColor = "#F2F2F2";
      }
      const styleBg = fillColor ? `background-color:${fillColor};` : "";
      const val = timeValue || "";
      tbody += `<td style="${styleBg}">${val}</td>`;
    }

    tbody += "</tr>";
  });
  tbody += "</tbody>";

  // (c) 완성된 HTML
  const tableHTML = `
    <h2 style="text-align:center; margin:0 0 10px;">근무표</h2>
    <table style="
      border-collapse:collapse;
      table-layout:fixed;
      width:280mm;  /* A4 landscape는 약 297mm 폭 - 좌우 여백 10mm 정도 */
      font-size:14px;">
      ${colgroup}
      ${thead}
      ${tbody}
    </table>
  `;

  // 새 창 열기
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const style = `
    <style>
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
      }
      h2 {
        text-align: center;
        margin-bottom: 10px;
      }
      table, td, th {
        border:1px solid #D9D9D9;
      }
      th {
        background: #F2F2F2;
        font-weight: bold;
        border-bottom:2px solid black;
      }
      td, th {
        text-align:center;
        vertical-align: middle;
        overflow:hidden;
        white-space:nowrap;
        height:20px;
        line-height:20px;
      }
      @media print {
        body, table, td, th {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    </style>
  `;

  printWindow.document.write(`<!DOCTYPE html><html><head>${style}</head><body>${tableHTML}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

const AtdSecomPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [selDate, setSelDate] = useState<Dayjs>(dayjs());
  const [selDept, setSelDept] = useState<number>(0);
  const [last, setLast] = useState<number>();

  // 해당 월의 마지막 날짜
  useEffect(() => {
    const year = Number(selDate.format("YYYY"));
    const mon = Number(selDate.format("MM"));
    setLast(new Date(year, mon, 0).getDate());
  }, [selDate]);

  // 공휴일 체크
  const { isLoading: culLoading, data: culData } = useQuery({
    queryKey: ["culChk", selDate],
    queryFn: async () => getCulChkList(selDate),
  });
  const [culList, setCulList] = useState<string[]>([]);

  useEffect(() => {
    if (!culLoading) {
      const data = culData?.data?.response?.body?.items;
      let arr = [];
      if (data === "") {
        arr = [];
      } else if (data?.item?.length) {
        arr = [...data?.item];
      } else {
        arr.push(data?.item);
      }
      let days: string[] = [];
      arr.forEach((d) => {
        // 'YYYYMMDD' → 뒤 2자리
        days.push(String(d?.locdate).slice(-2));
      });
      setCulList(days);
    }
  }, [culData, culLoading]);

  // select
  const [team, setTeam] = useState<selectType[]>([]);
  const { isLoading: hrLoading, data: hrData } = useQuery({
    queryKey: ["deptNteam"],
    queryFn: async () => getDeptNteam(),
  });

  useEffect(() => {
    if (!hrLoading) {
      let teamArr: selectType[] = [];
      hrData?.data?.resultData?.forEach((d: any) => {
        d?.teams?.map((t:any) => {
          teamArr.push({value: t?.id, label: t?.teamNm});
        })
      });
      setTeam(teamArr);
    }
  }, [hrData, hrLoading]);

  // secoms
  const [secoms, setSecoms] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // 근무표 secom
  const { isLoading, data } = useQuery({
    queryKey: ["secom", selDate, selDept],
    queryFn: async () => getSecomData(selDate, selDept),
  });

  useEffect(() => {
    setDataLoading(true);
    if (!isLoading) {
      console.log(data?.data?.resultData);
      const arr = data?.data?.resultData?.map((d: any) => ({
        ...d,
        name: d.name === "" ? "0" : d.name,
      }));
      // name='0'이면 제외
      setSecoms(arr.filter((f: any) => f.name !== "0"));
      setDataLoading(false);
    }
  }, [data, isLoading]);

  /**
   * (A) 날짜별로 휴일/주말 배경색을 구하는 함수
   */
  const getHolidayColor = (type:"bg" | "fc", dayNum: number): string | undefined => {
    const dayStr = String(dayNum).padStart(2, "0");
    const isHoliday = culList.includes(dayStr);
    const current = dayjs(
      `${selDate.format("YYYY")}-${selDate.format("MM")}-${dayStr}`
    );
    const dow = current.day(); // 0=일, 6=토

    // 공휴일·일요일 → yellow Tag의 배경
    if (isHoliday || dow === 0) {
      return type === "bg" ? "#ffa75620" : "red";
    }
    // 토요일 → mint Tag의 배경
    if (dow === 6) {
      return type === "bg" ? "#00b69b20" : "blue";
    }
    return undefined; // 평일이면 없음
  };

  /**
   * (B) 출퇴근 조건 색상 (평일에만 적용한다고 가정; 필요하면 공휴일에도 적용 가능)
   * flag1: '1' 출근, '4' 퇴근
   */
  const getAttendanceColor = (
    timeValue: string | null,
    empTit: string,
    flag1: string
  ): string | undefined => {
    // 사무직 출근
    if (timeValue && timeValue > "08:30" && empTit === "사무직" && flag1 === "1") {
      return "#96b670";
    }
    // 사무직 퇴근
    if (timeValue && timeValue < "17:30" && empTit === "사무직" && flag1 === "4") {
      return "#96b670";
    }

    // 생산직(주간) 출근
    if (
      timeValue &&
      timeValue > "08:20" &&
      empTit === "생산직(주간)" &&
      flag1 === "1"
    ) {
      return "#96b670";
    }
    // 생산직(주간) 퇴근
    if (
      timeValue &&
      timeValue < "17:20" &&
      empTit === "생산직(주간)" &&
      flag1 === "4"
    ) {
      return "#96b670";
    }

    // 생산직(주간/야간) 출근
    if (
      timeValue &&
      timeValue > "17:00" &&
      empTit === "생산직(주간/야간)" &&
      flag1 === "1"
    ) {
      return "#96b670";
    }
    // 생산직(주간/야간) 퇴근
    if (
      timeValue &&
      timeValue < "04:30" &&
      empTit === "생산직(주간/야간)" &&
      flag1 === "4"
    ) {
      return "#96b670";
    }

    return undefined;
  };

  /**
   * (C) 최종적으로 셀 배경색 결정:
   *  - 팀(부모) 행도 처리 → timeValue가 없으니 출퇴근 색상은 안 뜨고 휴일 색만 표시.
   *  - 자식(직원) 행이면, "출퇴근이 우선" => 출퇴근 색상 있으면 우선, 없으면 휴일/주말 색
   */
  const getCellBackgroundColor = (timeValue: string|null, row: any, dayNum: number): string|undefined => {
    // 1) 출퇴근 색
    const attColor = getAttendanceColor(timeValue, row.empTit, String(row.flag1));
    if (attColor) return attColor;

    // 2) 휴일/주말 색
    const holidayColor = getHolidayColor("bg",dayNum);
    if (holidayColor) return holidayColor;

    // 3) 퇴근 행이면 회색
    if (String(row.flag1) === "4") {
      return "#F2F2F2";
    }

    // 4) 기본 없음
    return undefined;
  };

  /**
   * (D) 날짜 컬럼 - 헤더 & 본문 모두 휴일 색을 표시
   */
  const dayColumns = useMemo(() => {
    if (!last) return [];
    return Array.from({ length: last }, (_, idx) => {
      const dayNum = idx + 1;
      const dayKey = dayNum < 10 ? `d0${dayNum}` : `d${dayNum}`;

      // 1) 헤더 배경색
      const headerBg = getHolidayColor("bg",dayNum);
      const headerFc = getHolidayColor("fc",dayNum);
      const isHoliday = !!getHolidayColor("fc", dayNum);

      return {
        title: dayNum.toString(),
        dataIndex: dayKey,
        align: "center" as const,

        // (1) 헤더 배경색
        onHeaderCell: () => {
          // 휴일/주말이면 배경색; 아니면 undefined
          return {
            style: {
              backgroundColor: headerBg,
              fontSize: "11px",
              whiteSpace: "nowrap",
              color: headerFc,
            },
          };
        },

        // (2) 본문 셀 배경색
        onCell: (row: any) => {
          // 가져올 값 (timeValue)
          const timeValue = row[dayKey] || null;
          const bgColor = getCellBackgroundColor(timeValue, row, dayNum);
          return {
            style: {
              backgroundColor: bgColor,
              fontSize: "11px",
              padding: "0",
            },
          };
        },

        // (3) 본문 표시
        render: (timeValue: string | null) => {
          if (!timeValue) return ""; // 값이 없으면 빈 칸

          const [hour, minute] = timeValue.split(":");
          return (
            <span>
              <span style={{ fontSize: "10px" }}>{hour}:</span>
              <span style={{ fontSize: "12px" }}>{minute}</span>
            </span>
          );
        },
      };
    });
  }, [last, selDate, culList]);

  // 기본 컬럼
  const baseColumns = useMemo(() => {
    return [
      {
        title: "직원명",
        dataIndex: "teamNm/name",
        align: "center" as const,
        width: 175,
        render: (value: any, row: any) => {
          return row?.teamNm + " / " + row?.name;
        },
      },
      {
        title: "업무구분",
        dataIndex: "empTit",
        align: "center" as const,
        width: 130,
        render: (value: any) => {
          return value || "";
        },
      },
      {
        title: "구분",
        dataIndex: "flag1",
        align: "center" as const,
        width: 50,
        render: (value: string) => {
          if (value === "1") return "출근";
          if (value === "4") return "퇴근";
          return "";
        },
        // (2) 본문 셀 배경색
        onCell: (row: any) => {
          // 가져올 값 (timeValue)
          return {
            style: {
              backgroundColor: String(row?.flag1) === "4" ? "#F2F2F2" : "",
            },
          };
        },
      },
    ];
  }, []);

  // 최종 columns
  const columns = useMemo(() => {
    return [...baseColumns, ...dayColumns];
  }, [baseColumns, dayColumns]);

  // *********************************************************
  // **팀 - 대표 직원** 한 줄만 보여 주고, 펼치면 나머지 직원 표시
  // *********************************************************
  const tableData = useMemo(() => {
    if (!secoms?.length) return [];

    // 팀별로 묶기
    const teamMap = new Map<string, any[]>();
    secoms.forEach((item) => {
      const teamName = item.teamNm || "미지정";
      if (!teamMap.has(teamName)) {
        teamMap.set(teamName, []);
      }
      teamMap.get(teamName)!.push(item);
    });

    const result: any[] = [];

    teamMap.forEach((records, teamName) => {
      // 일단 정렬해두면 "첫 직원"이 누가 될지 확정 가능
      // (정렬 조건은 원하는 대로. 여기선 사번 순으로 예시)
      records.sort((a, b) => {
        // a.sabun > b.sabun ? 1 : -1
        const sabunA = parseInt(a.sabun, 10);
        const sabunB = parseInt(b.sabun, 10);
        if (sabunA !== sabunB) {
          return sabunA - sabunB;
        } else {
          // flag1도 문자열일 가능성이 있으니 Number() 변환
          return Number(a.flag1) - Number(b.flag1);
        }
      });

      // 대표 직원(맨 앞)
      const rep = records[0];

      // 대표 행 만들기
      const parentKey = `parent-${teamName}-${rep.sabun}`;
      // "팀명 - 직원명"을 합쳐서 한 칸에 넣고 싶다면,
      // columns에서 'teamNm' 컬럼에 이 값을 표시하도록 하면 됨.
      // 아래는 대표 행의 teamNm 필드를 "임원 - 홍길동" 식으로 만듦
      const parentTeamNm = `${rep.teamNm} / ${rep.name}`;

      const parentRow = {
        key: parentKey,
        // 부모 행에 표시할 "팀명" 필드 → "팀명 - 대표직원"
        teamNm: parentTeamNm,
        empTit: rep.empTit,
        flag1: rep.flag1,
        // 날짜별 근무도 그대로
        ...rep,
      };

      // 나머지 직원들 (대표직원 제외) → children
      const childRows = records.slice(1).map((emp, idx) => {
        // 마찬가지로 "팀명 - 직원명" 합치기
        const childTeamNm = `${emp.teamNm} / ${emp.name}`;
        return {
          key: `child-${teamName}-${emp.sabun}-${idx}`,
          teamNm: childTeamNm,
          empTit: emp.empTit,
          flag1: emp.flag1,
          // 날짜별 근무
          ...emp,
        };
      });

      // 자식이 하나도 없어도 괜찮음 (한 팀에 직원이 1명뿐)
      if (childRows.length > 0) {
        parentRow.children = childRows;
      }

      // 최종적으로 result에 push
      result.push(parentRow);
    });

    return result;
  }, [secoms]);

  // ***********************
  // ** "전체 펼치기" 제어 **
  // ***********************
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 1) (선택) "전체 펼치기"
  const expandAllRows = () => {
    // 대표행(부모)의 key들을 전부 추출
    // 필요하면 자식 key까지 넣을 수도 있지만,
    // 보통은 "부모만" 펼치면 자동으로 자식이 열린 상태가 됩니다
    // (단, 3단 구조 이상이라면 전부 모아야 함)
    const allParentKeys: React.Key[] = tableData.map((row) => row.key);

    setExpandedKeys(allParentKeys);
  };

  // 2) (선택) "전체 접기"
  const collapseAllRows = () => {
    setExpandedKeys([]);
  };

  // 3) 펼침/접힘이 일어날 때 상태 업데이트
  const handleExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      // 펼쳐졌으면 expandedKeys에 추가
      setExpandedKeys((prev) => [...prev, record.key]);
    } else {
      // 접혔으면 expandedKeys에서 제거
      setExpandedKeys((prev) => prev.filter((k) => k !== record.key));
    }
  };
  
  const flatData = useMemo(() => {
    return flattenTreeData(tableData);
  }, [tableData]);

  /** 엑셀 다운로드 */
  const handleExcelDownload = () => {
    if (!flatData.length || !last) return;
    handleExcelDownload2(flatData, last, selDate, culList);
  };

  /** 프린트 */
  const handlePrint = () => {
    if (!flatData.length || !last) return;
    handlePrint2(flatData, last, selDate, culList);
  };

  const items: MenuProps['items'] = [
    {
      label: <span className="text-12">엑셀 다운로드</span>,
      key: 1,
      icon: <Image src={Excel} alt="Excel" width={16} height={16} />,
      onClick: handleExcelDownload,
    },
    {
      label: <span className="text-12">프린트</span>,
      key: 2,
      icon: <Image src={Print} alt="Print" width={16} height={16} />,
      onClick: handlePrint,
    },
  ]

  return (
    <div className="w-full h-[calc(100vh-192px)] flex flex-col gap-10">
      <div className="v-between-h-center">
        <div className="h-center gap-10">
        { team && 
          <AntdSelectRound
            options={[ {value:0, label:"전체"}, ...team]}
            value={selDept}
            onChange={(e)=>{
              console.log(e);
              const value = Number(e+"");
              setSelDept(value ?? undefined);
            }}
            className="!w-[200px]"
          />
        }
        {
          <AntdDatePicker
            value={selDate}
            onChange={(e)=>{
              const value = e+"";
              setSelDate(dayjs(value));
            }}
            className="!w-[200px] !h-30 !border-line"
            format="YYYY-MM"
            picker="month"
          />
        }
        </div>
        <div className="h-center gap-10">
        {
          expandedKeys.length > 0 ?
          <Button onClick={collapseAllRows} className="!text-point1 !border-point1">전체 접기</Button>
          :
          <Button onClick={expandAllRows} className="!bg-point1 !text-white">
            전체 펼치기
          </Button>
        }
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomCenter"
          getPopupContainer={() => document.body}
        >
          <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
        </Dropdown>
        </div>
      </div>
      <div className="w-full h-full overflow-auto">
      <TableWrapper>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={dataLoading}
          pagination={false}
          rowKey="key"
          bordered
          // 펼치기/접기 상태를 제어
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpand: handleExpand,
          }}
          tableLayout="fixed"
          size="small"
          className="my-compact-table"
        />
      </TableWrapper>
      </div>
    </div>
  );
};

AtdSecomPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="근태">{page}</MainPageLayout>
);

// 스타일 오버라이드 (예: styled-components 사용)
const TableWrapper = styled.div`
  .my-compact-table {
    /* 테이블 헤더 / 바디 셀 패딩, 라인 높이 축소 */
    .ant-table-thead > tr > th {
      height: 55px;
    }
    .ant-table-tbody > tr > td {
      height: 48px;
    }
  }
`;


export default AtdSecomPage;
