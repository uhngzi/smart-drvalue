import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { loginCheck } from "@/utils/signUtil";

interface Menu {
  id?: string;
  menuNm?: string;
  menuRefNm?: string;
  menuUrl?: string;
  menuDepth?: number;
  menuTypeEm?: string;
  menuActList?: boolean;
  menuActAdd?: boolean;
  menuActUp?: boolean;
  menuActDel?: boolean;
  menuActApp?: boolean;
  menuActOther?: string;
  menuClassifyEm?: string;
  menuSearchJsxcrud?: string | null;
  menuNmOrigin?: string;
  ordNo?: number;
  useYn?: boolean;
  children?: {
    id?: string;
    menuNm?: string;
    menuRefNm?: string;
    menuUrl?: string;
    menuDepth?: number;
    menuTypeEm?: string;
    menuActList?: boolean;
    menuActAdd?: boolean;
    menuActUp?: boolean;
    menuActDel?: boolean;
    menuActApp?: boolean;
    menuActOther?: string;
    menuClassifyEm?: string;
    menuSearchJsxcrud?: string | null;
    menuNmOrigin?: string;
    ordNo?: number;
    useYn?: boolean;
    children?: {
      id?: string;
      menuNm?: string;
      menuRefNm?: string;
      menuUrl?: string;
      menuDepth?: number;
      menuTypeEm?: string;
      menuActList?: boolean;
      menuActAdd?: boolean;
      menuActUp?: boolean;
      menuActDel?: boolean;
      menuActApp?: boolean;
      menuActOther?: string;
      menuClassifyEm?: string;
      menuSearchJsxcrud?: string;
      menuNmOrigin?: string;
      ordNo?: number;
      useYn?: boolean;
      children?: any[];
    } [];
  }[];
}

interface MenuContextType {
  menu: Menu[] | null;
  menuLoading: boolean;
  refetchMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  });

  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [menuLoading, setMenuLoading] = useState<boolean>(true);

  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["menu", login],
    queryFn: async () => {
      setMenuLoading(true);
      const result = await getAPI({
        type: "baseinfo",
        utype:'tenant/',
        url: "menu/tree-view/by-max-depth/4"
      });

      if (result.resultCode === "OK_0000") {
        setMenu(result.data);
        setMenuLoading(false);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login
  });

  return (
    <MenuContext.Provider value={{ menu, refetchMenu: refetch, menuLoading }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
