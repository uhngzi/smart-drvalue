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
import Menu from "@/assets/svg/icons/l_menu.svg";
import Plus from "@/assets/svg/icons/l_plus.svg";
import News from "@/assets/svg/icons/news.svg";
import Bell from "@/assets/svg/icons/bell.svg";
import Todo from "@/assets/svg/icons/todo.svg";
import Memo from "@/assets/svg/icons/mymemo.svg";

import MyMemo from "@/contents/footerBtn/MyMemo";

import { TabLarge } from "@/components/Tab/Tabs";
import AntdModal from "@/components/Modal/AntdModal";
import { MenuOutlined } from "@ant-design/icons";


interface Props {
  children : React.ReactNode;

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

const Sider = dynamic(() => import('../Sider/Sider'), { ssr: false });

// const MotionDiv = dynamic(() =>
//   import("framer-motion").then((mod) => mod.motion.div), { ssr: false }
// );

const menuItems = [
  {
    key: "memo",
    icon: <p className="w-24 h-24"><Memo /></p>,
    label: "나의 메모",
  },
  {
    key: "todo",
    icon: <p className="w-24 h-24"><Todo /></p>,
    label: "나의 할일",
  },
  {
    key: "alert",
    icon: <p className="w-24 h-24"><Bell /></p>,
    label: "알림",
  },
  {
    key: "news",
    icon: <p className="w-24 h-24"><News /></p>,
    label: "회사소식",
  },
];

const MainPageLayout: React.FC<Props> = ({ children, menu, menuTitle, bg, pd="10px 30px 20px 30px", modal, head }) => {
  const router = useRouter();
  const { selectMenu } = useMenu();
  const [login, setLogin] = useState<boolean>(false);

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      setLogin(false);
      router.push('/sign/in');
    } else {
      setLogin(true);
    }
  });
  
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('siderCollapsed');
      return stored === 'true';
    }
    return false;
  });
  
  // collapsed 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('siderCollapsed', collapsed.toString());
  }, [collapsed]);

  const [ width, setWidth ] = useState<number>(240);
  useEffect(()=>{
    if(collapsed) setWidth(80);
    else          setWidth(240);
  }, [collapsed])
  
  // 1초 후 collapse 처리 (마운트 시 자동)
  // useEffect(() => {
  //   setCollapsed(false);
  //   const timer = setTimeout(() => {
  //     setCollapsed(true);
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  const [open, setOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<null | string>(null); // 모달 키

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted)      return null;
  
  return (
    <div className="flex max-h-[100vh]" key="mainPageLayout">
      <AntdFooterBtnStyled>
        <FloatButton
          className="w-48 h-48"
          icon={
            <AnimatePresence mode="wait">
              <motion.div
                key={open ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <Close /> : <MenuOutlined />}
              </motion.div>
            </AnimatePresence>
            // !open ? 
            //   <MenuOutlined /> : <p><Close /></p>
          }
          type="primary"
          style={{right: 24, bottom: 24}}
          onClick={() => setOpen(!open)}
        />

        {/* 팝업들 */}
        {menuItems.map((item, idx) => (
          <AntdModal
            key={idx}
            open={activePopup === item.key}
            setOpen={()=>{}}
            draggable={true}
            title={
              item.key === "news" ?
              <>회사 소식</>
              :
              item.key === "alert" ?
              <>알림</>
              :
              item.key === "todo" ?
              <>나의 할일</>
              :
              item.key === "memo" ?
              <p
                className="w-20 h-20 text-[#00000065] cursor-pointer"
                onClick={()=>setNewOpen(true)}
              >
                <Plus/>
              </p>
              :
              <></>
            }
            bgColor="#FFFFFF"
            contents={
              item.key === "news" ?
              <></>
              :
              item.key === "alert" ?
              <></>
              :
              item.key === "todo" ?
              <></>
              :
              item.key === "memo" ?
              <MyMemo login={login} open={newOpen} setOpen={setNewOpen} />
              :
              <></>
            }
            width={"450px"}
            onClose={() => setActivePopup(null)}
          />
        ))}

        {/* 확장 메뉴 버튼들 */}
        <AnimatePresence>
        { open && menuItems.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -20}}
            transition={{ delay: 0.05 * idx, duration: 0.25 }}
          >
            <FloatButton
              className="w-48 h-48 v-h-center"
              icon={item.icon}
              tooltip={<Tooltip title={item.label}>{item.label}</Tooltip>}
              style={{
                right: 24,
                bottom: 90 + idx * 65,
                zIndex: 999,
              }}
              onClick={() => setActivePopup(item.key)}
            />
          </motion.div>
        ))}
        </AnimatePresence>
      </AntdFooterBtnStyled>

      <div>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className='flex flex-col gap-40 bg-back' 
        style={{
          width:`calc(100% - ${width}px)`
        }}
      >
        { !modal && <>
          <MainHeader title={menuTitle} />
          
          <div className="w-full h-[calc(100vh-80px)] overflow-auto px-40 mb-40">
            <Contents padding={pd} bg={bg} >
              { router.pathname !== "/" && selectMenu?.children && selectMenu?.children?.length > 1 && 
                <TabLarge
                  items={selectMenu.children.map((menu) => ({
                    text: menu.menuNm ?? "",
                    link: "/"+(menu.menuUrl ?? ""),
                  }))}
                  pathname={router.pathname}
                />
              }
              {/* {menu && (
                <TabLarge
                  items={menu}
                  pathname={router.pathname}
                />
              )} */}
              {children}
            </Contents>
          </div>
        </>}

        { head && modal && <div>
          <div className="p-30 flex v-between-h-center">
            <p className="text-20 fw-500 font-semibold">{menuTitle}</p>
            <p 
              className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
              onClick={(()=>router.back())}
            >
              <Close />
            </p>
          </div>
          <div className="w-full max-h-[calc(100vh-80px)] h-[calc(100vh-80px)] overflow-auto pl-30 pb-20">
            {children}
          </div>
        </div>}

        { !head && modal && <>
          <div className="w-full max-h-[calc(100vh)] h-[calc(100vh)] overflow-auto ">
            {children}
          </div>
        </>}
      </div>
    </div>
  )
}

const AntdFooterBtnStyled = styled.div`
  & .ant-float-btn {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important;
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
  }
`

export default MainPageLayout;