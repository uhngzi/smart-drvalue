import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { FloatButton, Tooltip } from "antd";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";

import { loginCheck } from "@/utils/signUtil";

import { useMenu } from "@/data/context/MenuContext";

import Close from "@/assets/svg/icons/s_close.svg";
import Plus from "@/assets/svg/icons/l_plus.svg";

import MyMemo from "@/contents/footerBtn/MyMemo";

import { TabLarge } from "@/components/Tab/Tabs";
import AntdModal from "@/components/Modal/AntdModal";
import { MenuOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { useUser } from "@/data/context/UserContext";
import { UserType } from "@/data/type/auth/user";
import { patchAPI } from "@/api/patch";

interface Props {
  children: React.ReactNode;

  menu?: {
    text: string;
    link: string;
  }[];

  menuTitle: string;

  writeButtonHref?: string;
  bg?: string;
  pd?: string;

  modal?: boolean;
  head?: boolean;
}

const Sider = dynamic(() => import("../Sider/Sider"), { ssr: false });

const MainPageLayout: React.FC<Props> = ({
  children,
  menu,
  menuTitle,
  bg,
  pd = "0",
  modal,
  head,
}) => {
  const router = useRouter();
  const { selectMenu } = useMenu();
  const { user, handleSubmitBookmark } = useUser();
  const [login, setLogin] = useState<boolean>(false);

  useEffect(() => {
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if (typeof window !== "undefined" && !loginCheck()) {
      setLogin(false);
      router.push("/sign/in");
    } else {
      setLogin(true);
    }
  });

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("siderCollapsed");
      return stored === "true";
    }
    return false;
  });

  // collapsed 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("siderCollapsed", collapsed.toString());
  }, [collapsed]);

  const [width, setWidth] = useState<number>(240);
  useEffect(() => {
    if (collapsed) setWidth(80);
    else setWidth(240);
  }, [collapsed]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex max-h-[100vh]" key="mainPageLayout">
      <div>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div
        className="flex flex-col"
        style={{
          width: `calc(100% - ${width}px)`,
        }}
      >
        {!modal && (
          <>
            <MainHeader login={login} />

            <div
              className="w-full h-[calc(100vh-70px)] overflow-auto pt-10 px-30 pb-20"
              style={{
                height:
                  typeof window !== "undefined" && window.innerWidth < 1920
                    ? "calc(100vh - 80px)"
                    : "calc(100vh - 70px)",
              }}
            >
              <Contents padding={pd} bg={bg}>
                {router.pathname !== "/" &&
                  selectMenu?.children &&
                  selectMenu?.children?.length > 1 && (
                    <TabLarge
                      items={selectMenu.children.map((menu) => ({
                        text: menu.menuNm ?? "",
                        link: "/" + (menu.menuUrl ?? ""),
                        parentsText: selectMenu.parentsNm,
                      }))}
                      pathname={router.pathname}
                      bookmarks={user?.detail?.metaData?.[0]?.bookMarkMenu}
                      handleSubmitBookmark={handleSubmitBookmark}
                    />
                  )}
                {children}
              </Contents>
            </div>
          </>
        )}

        {head && modal && (
          <div>
            <div className="px-30 min-h-70 !h-70 v-between-h-center w-full">
              <p className="text-18 font-[500]">{menuTitle}</p>
              <p
                className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
                onClick={() => router.back()}
              >
                <Close />
              </p>
            </div>
            <div
              className="w-full h-[calc(100vh-70px)] overflow-auto pt-10 pl-30 pb-20"
              style={{
                height:
                  typeof window !== "undefined" && window.innerWidth < 1920
                    ? "calc(100vh - 80px)"
                    : "calc(100vh - 70px)",
              }}
            >
              {children}
            </div>
          </div>
        )}

        {!head && modal && (
          <>
            <div
              className="w-full max-h-[calc(100vh)] h-[calc(100vh)] overflow-auto "
              style={{
                height:
                  typeof window !== "undefined" && window.innerWidth < 1920
                    ? "calc(100vh - 10px)"
                    : "100vh",
              }}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainPageLayout;
