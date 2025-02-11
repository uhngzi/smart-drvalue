import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { boardType } from "../type/base/board";
import { selectType } from "../type/componentStyles";
import { commonCodeRType } from "../type/base/common";

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
}

const BaseContext = createContext<BaseContextType | undefined>(undefined);

export const BaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ------------ 원판 ------------ 시작
  const [boardSelectList, setBoardSelectList] = useState<selectType[]>([]);
  const [board, setBoard] = useState<boardType[]>([]);
  const { refetch:refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board/jsxcrud/many'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:boardType) => ({
          value: d.id,
          label: d.brdType,
        }))
        setBoard(result.data.data ?? []);
        setBoardSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 원판 ------------ 끝

  // ------------ 재질 ------------ 시작
  const [metarialSelectList, setMetarialSelectList] = useState<selectType[]>([]);
  const [metarial, setMetarial] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMetarial } = useQuery<apiGetResponseType, Error>({
    queryKey: ["metarial"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/e7bd6d53-8398-43f2-a970-6a55607fc373'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMetarial(result.data.data ?? []);
        setMetarialSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 재질 ------------ 끝

  // ------------ 표면 ------------ 시작
  const [surfaceSelectList, setSurfaceSelectList] = useState<selectType[]>([]);
  const [surface, setSurface] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSurface } = useQuery<apiGetResponseType, Error>({
    queryKey: ["surface"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/40aa5cce-d07d-4014-bc47-d1413cd0a17a'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSurface(result.data.data ?? []);
        setSurfaceSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 표면 ------------ 끝

  // ------------ 단위 ------------ 시작
  const [unitSelectList, setUnitSelectList] = useState<selectType[]>([]);
  const [unit, setUnit] = useState<commonCodeRType[]>([]);
  const { refetch:refetchUnit } = useQuery<apiGetResponseType, Error>({
    queryKey: ["unit"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/270c79ea-da3e-420a-9fc1-b1a4bf24d11d'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setUnit(result.data.data ?? []);
        setUnitSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 단위 ------------ 끝

  // ------------ VCUT ----------- 시작
  const [vcutSelectList, setVcutSelectList] = useState<selectType[]>([]);
  const [vcut, setVcut] = useState<commonCodeRType[]>([]);
  const { refetch:refetchVcut } = useQuery<apiGetResponseType, Error>({
    queryKey: ["vcut"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/44584dfd-9efb-4755-bc99-7ff15030b014'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setVcut(result.data.data ?? []);
        setVcutSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ VCUT ----------- 끝

  // ----------- 외형가공 ---------- 시작
  const [outSelectList, setOutSelectList] = useState<selectType[]>([]);
  const [out, setOut] = useState<commonCodeRType[]>([]);
  const { refetch:refetchOut } = useQuery<apiGetResponseType, Error>({
    queryKey: ["out"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/5fd0a413-d1be-45b1-a0bf-12b12404fdbc'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setOut(result.data.data ?? []);
        setOutSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- 외형가공 ---------- 끝

  // ----------- SM인쇄 ----------- 시작
  const [smPrintSelectList, setSmPrintSelectList] = useState<selectType[]>([]);
  const [smPrint, setSmPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smPrint"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/19ce3430-717d-49e7-b12e-28ffe3795532'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmPrint(result.data.data ?? []);
        setSmPrintSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- SM인쇄 ----------- 끝

  // ----------- SM색상 ----------- 시작
  const [smColorSelectList, setSmColorSelectList] = useState<selectType[]>([]);
  const [smColor, setSmColor] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmColor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smColor"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/c442dea4-2698-4d03-a530-4f65a7f201a6'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmColor(result.data.data ?? []);
        setSmColorSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- SM색상 ----------- 끝

  // ----------- SM종류 ----------- 시작
  const [smTypeSelectList, setSmTypeSelectList] = useState<selectType[]>([]);
  const [smType, setSmType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSmType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["smType"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/dba38485-1225-44a8-a78b-1d07bd74447a'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSmType(result.data.data ?? []);
        setSmTypeSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- SM종류 ----------- 끝

  // ----------- MK인쇄 ----------- 시작
  const [mkPrintSelectList, setMkPrintSelectList] = useState<selectType[]>([]);
  const [mkPrint, setMkPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkPrint"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/2a05aade-4a37-474a-8d15-e520f855cc11'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkPrint(result.data.data ?? []);
        setMkPrintSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- MK인쇄 ----------- 끝

  // ----------- MK색상 ----------- 시작
  const [mkColorSelectList, setMkColorSelectList] = useState<selectType[]>([]);
  const [mkColor, setMkColor] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkColor } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkColor"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/2a05aade-4a37-474a-8d15-e520f855cc11'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkColor(result.data.data ?? []);
        setMkColorSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- MK색상 ----------- 끝

  // ----------- MK색상 ----------- 시작
  const [mkTypeSelectList, setMkTypeSelectList] = useState<selectType[]>([]);
  const [mkType, setMkType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchMkType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["mkType"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/9d71f1d3-206c-460d-baed-4f056c50d8a0'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setMkType(result.data.data ?? []);
        setMkTypeSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- MK색상 ----------- 끝

  // ----------- 특수인쇄 ---------- 시작
  const [spPrintSelectList, setSpPrintSelectList] = useState<selectType[]>([]);
  const [spPrint, setSpPrint] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSpPrint } = useQuery<apiGetResponseType, Error>({
    queryKey: ["spPrint"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/8fd8a5dc-e144-4b43-8c28-f795561cf793'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSpPrint(result.data.data ?? []);
        setSpPrintSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- 특수인쇄 ---------- 끝

  // ----------- 특수종류 ---------- 시작
  const [spTypeSelectList, setSpTypeSelectList] = useState<selectType[]>([]);
  const [spType, setSpType] = useState<commonCodeRType[]>([]);
  const { refetch:refetchSpType } = useQuery<apiGetResponseType, Error>({
    queryKey: ["spType"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-idx/d021b48d-7dfa-494a-b906-2a767cad1182'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setSpType(result.data.data ?? []);
        setSpTypeSelectList(arr);
        console.log(result.data.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ----------- 특수인쇄 ---------- 끝

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
