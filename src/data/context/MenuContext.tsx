import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { loginCheck } from "@/utils/signUtil";

import Logo from "@/assets/logo/gpn-logo.png";
import LogoSY from "@/assets/logo/sy-logo.png";
import Star from "@/assets/svg/icons/star.svg";
import DashBoard from "@/assets/svg/icons/dashboard.svg";
import Buy from "@/assets/svg/icons/buy.svg";
import Kpi from "@/assets/svg/icons/kpi.svg";
import Mng from "@/assets/svg/icons/mng.svg";
import Sales from "@/assets/svg/icons/sales.svg";
import Sayang from "@/assets/svg/icons/sayang.svg";
import Wk from "@/assets/svg/icons/l_calendar.svg";
import MenuIcon from "@/assets/svg/icons/l_menu.svg";
import Setting from "@/assets/svg/icons/s_setting.svg";
import Logout from "@/assets/svg/icons/logout.svg";
import Login from "@/assets/svg/icons/s_login.svg";
import Err from "@/assets/svg/icons/s_excalm.svg";

import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Dayjs } from "dayjs";
import cookie from "cookiejs";
import { useRouter } from "next/router";

interface MenuFlat {
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  id?: string;
  menuNm?: string;
  menuNmOrigin?: string;
  menuRefNm?: string;
  menuUrl?: string;
  menuDepth?: number;
  menuTypeEm?: string;
  menuClassifyEm?: string;
  menuActList?: boolean;
  menuActAdd?: boolean;
  menuActUp?: boolean;
  menuActDel?: boolean;
  menuActApp?: boolean;
  menuActOther?: string;
  menuSearchJsxcrud?: string | null;
  ordNo?: number;
  useYn?: boolean;
  parent?: {
    createdAt?: Date | Dayjs | null;
    updatedAt?: Date | Dayjs | null;
    id?: string;
    menuNm?: string;
    menuNmOrigin?: string;
    menuRefNm?: string;
    menuUrl?: string;
    menuDepth?: number;
    menuTypeEm?: string;
    menuClassifyEm?: string;
    menuActList?: boolean;
    menuActAdd?: boolean;
    menuActUp?: boolean;
    menuActDel?: boolean;
    menuActApp?: boolean;
    menuActOther?: string;
    menuSearchJsxcrud?: string | null;
    ordNo?: number;
    useYn?: boolean;
  };
}
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
  menuSearchJsxcrud?: string;
  menuNmOrigin?: string;
  ordNo?: number;
  useYn?: boolean;
  children?: Menu[];
  parentsNm?: string;
}

interface MenuContextType {
  menu: Menu[] | null;
  menuLoading: boolean;
  refetchMenu: () => void;
  sider: ItemType<MenuItemType>[];
  setSider: React.Dispatch<SetStateAction<ItemType<MenuItemType>[]>>;
  menuFlat: MenuFlat[];
  setMenuFlat: React.Dispatch<SetStateAction<MenuFlat[]>>;
  selectMenu: Menu | null;
  setSelectMenu: React.Dispatch<SetStateAction<Menu | null>>;
}

const iconClassNm = "h-40 min-w-[40px!important]";
const SELECT_MENU_COOKIE_KEY = "select_menu_id";

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [login, setLogin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if (typeof window !== "undefined" && !loginCheck()) {
      setLogin(false);
      router.push("/sign/in");
    } else {
      setLogin(true);
    }
  });

  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [menuLoading, setMenuLoading] = useState<boolean>(true);
  const [sider, setSider] = useState<ItemType<MenuItemType>[]>([]);
  const [selectMenu, setSelectMenu] = useState<Menu | null>(null);
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["menu", login],
    queryFn: async () => {
      setMenuLoading(true);
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "menu/tree-view/by-max-depth/4",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        const data = (result.data ?? []) as Menu[];
        setMenu(data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login,
  });

  const [menuFlat, setMenuFlat] = useState<MenuFlat[]>([]);
  const { refetch: refetchMenuFlat } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["menuFlat", login],
    queryFn: async () => {
      const result = await getAPI(
        {
          type: "baseinfo",
          utype: "tenant/",
          url: "menu/default/flat",
        },
        {
          sort: "ordNo,ASC",
        }
      );

      if (result.resultCode === "OK_0000") {
        const data = (result.data ?? []) as MenuFlat[];
        setMenuFlat(data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login,
  });

  useEffect(() => {
    const arr = menu?.map((m1) => ({
      id: m1.id,
      key: m1.menuUrl ?? "/",
      title: m1.menuUrl ?? "/",
      label: m1.menuNm ?? "홈",
      icon:
        m1.menuNmOrigin === "영업" ? (
          <p className={iconClassNm}>
            <Sales className="w-24 h-24" />
          </p>
        ) : m1.menuNmOrigin === "사양" ? (
          <p className={iconClassNm}>
            <Sayang />
          </p>
        ) : m1.menuNmOrigin === "생산" ? (
          <p className={iconClassNm}>
            <Wk />
          </p>
        ) : m1.menuNmOrigin === "관리/구매" ? (
          <p className={iconClassNm}>
            <Buy />
          </p>
        ) : m1.menuNmOrigin === "품질" ? (
          <p className={iconClassNm}>
            <Buy />
          </p>
        ) : (
          <p className={iconClassNm}>
            <DashBoard />
          </p>
        ),
      children: m1.children?.map((m2) => ({
        id: m2.children?.[0]?.id ?? "",
        key: m2.children?.[0]?.menuUrl?.split("/").slice(0, 2).join("/"),
        title: m2.children?.[0]?.menuUrl,
        label: m2.menuNm,
        onClick: () => {
          setTimeout(() => setSelectMenu({ ...m2, parentsNm: m1.menuNm }), 50);
        },
      })),
    }));

    setSider([
      {
        key: "/",
        title: "/",
        label: "홈 피드",
        icon: (
          <p className={iconClassNm}>
            <DashBoard />
          </p>
        ),
        onClick: () => {
          setSelectMenu(null);
        },
      },
      {
        type: "divider",
        style: { margin: 15 },
      },
      ...(arr ?? []),
    ]);
    setMenuLoading(false);
  }, [menu]);

  // 새로고침 시에도 어떤 메뉴를 선택중인지를 저장되기 위해 쿠키에 넣어줌
  useEffect(() => {
    if (selectMenu?.id) {
      cookie.set(SELECT_MENU_COOKIE_KEY, selectMenu.id);
      console.log(selectMenu);
    }
  }, [selectMenu]);

  // 쿠키에 들어가있는 메뉴 id값을 추출
  useEffect(() => {
    if (menu && menu.length > 0) {
      const savedId = cookie.get(SELECT_MENU_COOKIE_KEY);
      if (savedId) {
        // menu 트리에서 ID에 맞는 메뉴 찾아서 복원
        const findMenuById = (menus: Menu[]): Menu | null => {
          for (const m of menus) {
            if (m.id === savedId) return m;
            if (m.children) {
              const found = findMenuById(m.children);
              if (found) return found;
            }
          }
          return null;
        };

        const restored = findMenuById(menu);
        if (restored) {
          setSelectMenu(restored);
        }
      }
    }
  }, [menu]);

  return (
    <MenuContext.Provider
      value={{
        menu,
        refetchMenu: refetch,
        menuLoading,
        sider,
        setSider,
        menuFlat,
        setMenuFlat,
        selectMenu,
        setSelectMenu,
      }}
    >
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
