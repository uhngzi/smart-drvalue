import { useRouter } from "next/router";
import { FloatButton } from "antd";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";

import Close from "@/assets/svg/icons/s_close.svg";
import Plus from "@/assets/svg/icons/l_plus.svg";
import Setting from "@/assets/svg/icons/l_setting.svg";
import Bell from "@/assets/svg/icons/bell_line.svg";
import News from "@/assets/svg/icons/news.svg";
import Todo from "@/assets/svg/icons/todo.svg";
import Memo from "@/assets/svg/icons/mymemo.svg";
import Star from "@/assets/svg/icons/star.svg";

import { useUser } from "@/data/context/UserContext";
import { useMenu } from "@/data/context/MenuContext";

import AntdModal from "@/components/Modal/AntdModal";

import MyMemo from "@/contents/footerBtn/MyMemo";

interface Props {
  title?: string;
  login?: boolean;
}

const menuItems = [
  {
    key: "memo",
    icon: (
      <p className="w-24 h-24">
        <Memo />
      </p>
    ),
    label: "나의 메모",
  },
  {
    key: "todo",
    icon: (
      <p className="w-24 h-24">
        <Todo />
      </p>
    ),
    label: "나의 할일",
  },
  {
    key: "alert",
    icon: (
      <p className="w-24 h-24">
        <Bell />
      </p>
    ),
    label: "알림",
  },
  {
    key: "news",
    icon: (
      <p className="w-24 h-24">
        <News />
      </p>
    ),
    label: "회사소식",
  },
];

const MainHeader: React.FC<Props> = ({ title, login }) => {
  const router = useRouter();
  const { me, user, handleSubmitBookmark } = useUser();
  const { selectMenu } = useMenu();

  const [open, setOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<null | string>(null); // 모달 키

  useEffect(() => {
    const handleClose = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".menu-toggle-area") &&
        !target.closest(".ant-float-btn")
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener("click", handleClose);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (
    <div className="!h-70 min-h-70 w-full v-between-h-center px-30 gap-15">
      <div className="flex-1 h-center text-18 font-medium text-[#222]">
        <p>{selectMenu?.menuNm}</p>
        {!selectMenu?.children ||
          (selectMenu?.children?.length < 2 && (
            <p
              className="ml-5 w-16 h-16 cursor-pointer text-[#00000065]"
              style={
                user?.detail?.metaData?.[0]?.bookMarkMenu?.some(
                  (b: any) => b.url === router.asPath
                )
                  ? { color: "#FBE158" }
                  : {}
              }
              onClick={() => {
                handleSubmitBookmark(
                  selectMenu.parentsNm + " > " + selectMenu.menuNm,
                  router.asPath
                );
              }}
            >
              <Star
                fill={
                  user?.detail?.metaData?.[0]?.bookMarkMenu?.some(
                    (b: any) => b.url === router.asPath
                  )
                    ? "#FBE158"
                    : "none"
                }
              />
            </p>
          ))}
      </div>
      <div className="h-center gap-15">
        <div
          className="w-40 h-40 v-h-center bg-back rounded-50 cursor-pointer"
          onClick={() => {
            router.push("/setting");
          }}
        >
          <p className="w-24 h-24 text-[#718EBF] bg-back rounded-50">
            <Setting />
          </p>
        </div>
        <div className="w-40 h-40 v-h-center bg-back rounded-50 cursor-pointer">
          <p className="w-24 h-24 text-[#718EBF]">
            <Bell />
          </p>
        </div>
        <div className="w-40 h-40 v-h-center text-[#718EBF] text-12 font-normal bg-back rounded-50">
          {me?.userName ?? "-"}
        </div>
        <AntdFooterBtnStyled>
          <div
            className="menu-toggle-area w-40 h-40 v-h-center text-[#718EBF] text-12 font-normal bg-back rounded-50 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={open ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {open ? (
                  <Close />
                ) : (
                  <MenuOutlined style={{ color: "#718EBF" }} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 팝업들 */}
          {menuItems.map((item, idx) => (
            <AntdModal
              key={idx}
              open={activePopup === item.key}
              setOpen={() => {}}
              draggable={true}
              title={
                item.key === "news" ? (
                  <>회사 소식</>
                ) : item.key === "alert" ? (
                  <>알림</>
                ) : item.key === "todo" ? (
                  <>나의 할일</>
                ) : item.key === "memo" ? (
                  <p
                    className="w-20 h-20 text-[#00000065] cursor-pointer"
                    onClick={() => setNewOpen(true)}
                  >
                    <Plus />
                  </p>
                ) : (
                  <></>
                )
              }
              bgColor="#FFFFFF"
              contents={
                item.key === "news" ? (
                  <></>
                ) : item.key === "alert" ? (
                  <></>
                ) : item.key === "todo" ? (
                  <></>
                ) : item.key === "memo" ? (
                  <MyMemo
                    login={login ?? false}
                    open={newOpen}
                    setOpen={setNewOpen}
                  />
                ) : (
                  <></>
                )
              }
              width={"450px"}
              onClose={() => setActivePopup(null)}
            />
          ))}

          {/* 확장 메뉴 버튼들 */}
          <AnimatePresence>
            {open &&
              menuItems.map((item, idx) => (
                <motion.div
                  key={item.key}
                  style={{ position: "fixed", right: 30, top: 65, zIndex: 999 }}
                >
                  <FloatButton
                    className="w-40 h-40 v-h-center !bg-back"
                    icon={item.icon}
                    tooltip={item.label}
                    style={{
                      right: 30,
                      top: 65 + idx * 50,
                      zIndex: 999,
                    }}
                    onClick={() => setActivePopup(item.key)}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </AntdFooterBtnStyled>
      </div>
    </div>
  );
};

const AntdFooterBtnStyled = styled.div`
  & .ant-float-btn {
    background: #f5f6fa !important;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important;
  }

  & .ant-float-btn-body {
    background: #f5f6fa !important;
  }

  & .ant-float-btn-content {
    padding: 0px !important;
    width: 100% !important;
    height: 100% !important;
  }

  & .ant-float-btn-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
    color: #718ebf !important;
  }
`;

export default MainHeader;
