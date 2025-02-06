import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation"; // DataGrid 테마 확장 (필수)

const theme = createTheme({
  typography: {
    fontSize: 14, // 기본 글자 크기
    fontFamily: "'Spoqa Han Sans Neo', sans-serif", // 폰트 패밀리 설정
    body1: {
      fontSize: "14px",
      color: "#444444",
    },
    body2: {
      fontSize: "14px",
      color: "#444444",
    },
    h1: {
      fontSize: "24px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "20px",
      fontWeight: 600,
    },
    h3: {
      fontSize: "18px",
      fontWeight: 500,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variant: "body1",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          fontSize: "14px", // DataGrid 기본 글자 크기
        },
        cell: {
          height: 55,
          color: "#444444",
          fontWeight: 400,
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        },
        columnHeader: {
          height: 56,
          backgroundColor: "#FAFAFA",
          color: "#222222",
          fontWeight: 500,
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06) !important",
          padding: 16,
        },
        columnHeaderTitleContainer: {
          justifyContent: "center",
        }
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: "24px",
          height: "24px",
          fontSize: "24px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "14px", // Select 내부 텍스트 크기
        },
        select: {
          fontSize: "14px", // 선택된 값 표시 부분
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: "14px", // Pagination 폰트 크기
        },
        select: {
          fontSize: "14px", // 페이지 선택 박스
        },
        displayedRows: {
          fontSize: "14px", // "1-10 of 100" 같은 텍스트 크기
        },
      },
    },
  },
});

export default theme;