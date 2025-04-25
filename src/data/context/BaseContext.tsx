import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { boardType } from "../type/base/board";
import { selectType } from "../type/componentStyles";
import { commonCodeRType } from "../type/base/common";
import { processRType } from "../type/base/process";
import { loginCheck } from "@/utils/signUtil";

interface BaseContextType {
  board: boardType[];
  boardSelectList: selectType[];
  refetchBoard: () => void;
  metarial: commonCodeRType[];
  metarialSelectList: selectType[];
  refetchMetarial: () => void;
  surface: commonCodeRType[];
  surfaceSelectList: selectType[];
  refetchSurface: () => void;
  unit: commonCodeRType[];
  unitSelectList: selectType[];
  refetchUnit: () => void;
  vcut: commonCodeRType[];
  vcutSelectList: selectType[];
  refetchVcut: () => void;
  out: commonCodeRType[];
  outSelectList: selectType[];
  refetchOut: () => void;
  smPrint: commonCodeRType[];
  smPrintSelectList: selectType[];
  refetchSmPrint: () => void;
  smColor: commonCodeRType[];
  smColorSelectList: selectType[];
  refetchSmColor: () => void;
  smType: commonCodeRType[];
  smTypeSelectList: selectType[];
  refetchSmType: () => void;
  mkPrint: commonCodeRType[];
  mkPrintSelectList: selectType[];
  refetchMkPrint: () => void;
  mkColor: commonCodeRType[];
  mkColorSelectList: selectType[];
  refetchMkColor: () => void;
  mkType: commonCodeRType[];
  mkTypeSelectList: selectType[];
  refetchMkType: () => void;
  spPrint: commonCodeRType[];
  spPrintSelectList: selectType[];
  refetchSpPrint: () => void;
  spType: commonCodeRType[];
  spTypeSelectList: selectType[];
  refetchSpType: () => void;
  ozUnit: commonCodeRType[];
  ozUnitSelectList: selectType[];
  refetchOzUnit: () => void;
  stampColor: commonCodeRType[];
  stampColorSelectList: selectType[];
  refetchStampColor: () => void;
  stampType: commonCodeRType[];
  stampTypeSelectList: selectType[];
  refetchStampType: () => void;
}

const BaseContext = createContext<BaseContextType | undefined>(undefined);

export const BaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  });

  // ------------ 원판 ------------ 시작
  const [boardSelectList, setBoardSelectList] = useState<selectType[]>([]);
  const [board, setBoard] = useState<boardType[]>([]);
  const { refetch:refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board/jsxcrud/many'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:boardType) => ({
          value: d.id,
          label: d.brdType,
        }))
        setBoard(result.data?.data ?? []);
        setBoardSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ 원판 ------------ 끝

  // ------------ 재질 ------------ 시작
  const [metarialSelectList, setMetarialSelectList] = useState<selectType[]>([]);
  const [metarial, setMetarial] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMetarial } = useQuery<apiGetResponseType, Error>({
    queryKey: ["metarial", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/재질'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMetarial(result.data?.data ?? []);
        setMetarialSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ 재질 ------------ 끝

  // ------------ 표면 ------------ 시작
  const [surfaceSelectList, setSurfaceSelectList] = useState<selectType[]>([]);
  const [surface, setSurface] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSurface } = useQuery<apiGetResponseType, Error>({
    queryKey: ["surface", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/표면처리'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSurface(result.data?.data ?? []);
        setSurfaceSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ 표면 ------------ 끝

  // ------------ 단위 ------------ 시작
  const [unitSelectList, setUnitSelectList] = useState<selectType[]>([]);
  const [unit, setUnit] = useState<commonCodeRType[]>([]);
  const { refetch:refetchUnit } = useQuery<apiGetResponseType, Error>({
    queryKey: ["unit", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/단위'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setUnit(result.data?.data ?? []);
        setUnitSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ 단위 ------------ 끝

  // ------------ VCUT ----------- 시작
  const [vcutSelectList, setVcutSelectList] = useState<selectType[]>([]);
  const [vcut, setVcut] = useState<commonCodeRType[]>([]);
  const { refetch:refetchVcut } = useQuery<apiGetResponseType, Error>({
    queryKey: ["vcut", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/VCUT형태'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setVcut(result.data?.data ?? []);
        setVcutSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ VCUT ----------- 끝

  // ----------- 외형가공 ---------- 시작
  const [outSelectList, setOutSelectList] = useState<selectType[]>([]);
  const [out, setOut] = useState<commonCodeRType[]>([]);
  const { refetch:refetchOut } = useQuery<apiGetResponseType, Error>({
    queryKey: ["out", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/외형가공형태'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setOut(result.data?.data ?? []);
        setOutSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 외형가공 ---------- 끝

  // ----------- SM인쇄 ----------- 시작
  const [smPrintSelectList, setSmPrintSelectList] = useState<selectType[]>([]);
  const [smPrint, setSmPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smPrint", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/SM인쇄'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmPrint(result.data?.data ?? []);
        setSmPrintSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- SM인쇄 ----------- 끝

  // ----------- SM색상 ----------- 시작
  const [smColorSelectList, setSmColorSelectList] = useState<selectType[]>([]);
  const [smColor, setSmColor] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmColor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smColor", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/SM색상'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmColor(result.data?.data ?? []);
        setSmColorSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- SM색상 ----------- 끝

  // ----------- SM종류 ----------- 시작
  const [smTypeSelectList, setSmTypeSelectList] = useState<selectType[]>([]);
  const [smType, setSmType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smType", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/SM종류'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmType(result.data?.data ?? []);
        setSmTypeSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- SM종류 ----------- 끝

  // ----------- MK인쇄 ----------- 시작
  const [mkPrintSelectList, setMkPrintSelectList] = useState<selectType[]>([]);
  const [mkPrint, setMkPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkPrint", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/MK인쇄'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkPrint(result.data?.data ?? []);
        setMkPrintSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- MK인쇄 ----------- 끝

  // ----------- MK색상 ----------- 시작
  const [mkColorSelectList, setMkColorSelectList] = useState<selectType[]>([]);
  const [mkColor, setMkColor] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkColor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkColor", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/MK색상'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkColor(result.data?.data ?? []);
        setMkColorSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- MK색상 ----------- 끝

  // ----------- MK종류 ----------- 시작
  const [mkTypeSelectList, setMkTypeSelectList] = useState<selectType[]>([]);
  const [mkType, setMkType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkType", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/MK종류'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkType(result.data?.data ?? []);
        setMkTypeSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ------------ MK종류 ----------- 끝

  // ----------- 특수인쇄 ---------- 시작
  const [spPrintSelectList, setSpPrintSelectList] = useState<selectType[]>([]);
  const [spPrint, setSpPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSpPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["spPrint", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/특수인쇄'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSpPrint(result.data?.data ?? []);
        setSpPrintSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 특수인쇄 ---------- 끝

  // ----------- 특수종류 ---------- 시작
  const [spTypeSelectList, setSpTypeSelectList] = useState<selectType[]>([]);
  const [spType, setSpType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSpType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["spType", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/특수인쇄종류'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSpType(result.data?.data ?? []);
        setSpTypeSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 특수인쇄 ---------- 끝

  // ---------- 동박외내층 --------- 시작
  const [ozUnitSelectList, setOzUnitSelectList] = useState<selectType[]>([]);
  const [ozUnit, setOzUnit] = useState<commonCodeRType[]>([]);
  const { refetch:refetchOzUnit } = useQuery<apiGetResponseType, Error>({
    queryKey: ["ozUnit", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/OZ단위'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setOzUnit(result.data?.data ?? []);
        setOzUnitSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 동박외내층 ---------- 끝

  // ---------- 도장 컬러 --------- 시작
  const [stampColorSelectList, setStampColorSelectList] = useState<selectType[]>([]);
  const [stampColor, setStampColor] = useState<commonCodeRType[]>([]);
  const { refetch:refetchStampColor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["stampColor", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/도장컬러'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setStampColor(result.data?.data ?? []);
        setStampColorSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 도장 컬러 ---------- 끝

  // ---------- 도장 종류 --------- 시작
  const [stampTypeSelectList, setStampTypeSelectList] = useState<selectType[]>([]);
  const [stampType, setStampType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchStampType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["stampType", login],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/도장종류'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setStampType(result.data?.data ?? []);
        setStampTypeSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });
  // ----------- 도장 컬러 ---------- 끝

  return (
    <BaseContext.Provider
      value={{ 
        board, boardSelectList, refetchBoard,
        metarial, metarialSelectList, refetchMetarial,
        surface, surfaceSelectList, refetchSurface,
        unit, unitSelectList, refetchUnit,
        vcut, vcutSelectList, refetchVcut,
        out, outSelectList, refetchOut,
        smPrint, smPrintSelectList, refetchSmPrint,
        smColor, smColorSelectList, refetchSmColor,
        smType, smTypeSelectList, refetchSmType,
        mkPrint, mkPrintSelectList, refetchMkPrint,
        mkColor, mkColorSelectList, refetchMkColor,
        mkType, mkTypeSelectList, refetchMkType,
        spPrint, spPrintSelectList, refetchSpPrint,
        spType, spTypeSelectList, refetchSpType,
        ozUnit, ozUnitSelectList, refetchOzUnit,
        stampColor, stampColorSelectList, refetchStampColor,
        stampType, stampTypeSelectList, refetchStampType,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
};

export const useBase = () => {
  const context = useContext(BaseContext);
  if (!context) {
    throw new Error("Base must be used within a BaseProvider");
  }
  return context;
};
