import { useRouter } from "next/router"

import Logo from "@/assets/logo/gpn-logo.png"
import LogoSY from "@/assets/logo/sy-logo.png";

import Setting from "@/assets/svg/icons/s_setting.svg"
import HomeOutlined from "@/assets/svg/icons/home.svg"
import Logout from "@/assets/svg/icons/logout.svg"
import Login from "@/assets/svg/icons/s_login.svg"

import Company from "@/assets/svg/icons/company.svg";
import Hr from "@/assets/svg/icons/hr.svg";
import Client from "@/assets/svg/icons/client.svg";
import Wk from "@/assets/svg/icons/wkSetting.svg";
import Buy from "@/assets/svg/icons/buySetting.svg";

import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react"
import { loginCheck, logout } from "@/utils/signUtil"
import cookie from "cookiejs";

interface Props {
}

// 브라우저 환경인지 체크
const isBrowser = typeof window !== 'undefined';
const port = isBrowser ? window.location.port : ''; // 현재 포트

const SettingSider: React.FC<Props> = ({ }) => {
  const router = useRouter();

  const iconClassNm = "h-40 min-w-[40px!important]";

  const [selectedKey, setSelectedKey] = useState<string>("");

  useEffect(() => {
    const segments = router.asPath.split("/"); // ex: ["", "setting", "client", "sup"]
    const key = segments.slice(2, 4).join("/"); // "client/sup"
    setSelectedKey(key);
  }, [router.asPath]);

  const currentPath = router.pathname.split('/').slice(1).join();

  const [signIn, setSignIn] = useState<boolean>(false);
  useEffect(()=>{
    setSignIn(loginCheck);
  }, [signIn])

  const items: ItemType<MenuItemType>[] = [
    {
      key: 'company',
      title:'',
      label: '기본정보',
      icon: <p className={iconClassNm}><Company /></p>,
      children: [
        {
          key: 'company/base',
          title: 'company/base',
          label: '회사 정보',
        },
        {
          key: 'company/offday',
          title: 'company/offday',
          label: '쉬는날',
        },
      ]
    },
    {
      type: 'divider',
      style: {margin: 10},
    },
    {
      key: 'hr/user',
      title:'hr/user',
      label: '인사',
      icon: <p className={iconClassNm}><Hr /></p>,
      // children: [
      //   {
      //     key: 'hr/user',
      //     title: 'hr/user',
      //     label: '인사 · 구성원',
      //   },
      //   {
      //     key: 'hr/confirm',
      //     title: 'hr/confirm',
      //     label: '승인정채',
      //   },
      // ]
    },
    {
      type: 'divider',
      style: {margin: 10},
    },
    {
      key: 'client',
      title:'client',
      label: '거래처',
      icon: <p className={iconClassNm}><Client /></p>,
      children: [
        {
          key: 'client/cs',
          title: 'client/cs',
          label: '고객',
        },
        {
          key: 'client/vndr',
          title: 'client/vndr',
          label: '외주처',
        },
        {
          key: 'client/sup',
          title: 'client/sup',
          label: '구매처',
        },
      ]
    },
    {
      type: 'divider',
      style: {margin: 10},
    },
    {
      key: 'wk',
      title:'wk',
      label: '생산설정',
      icon: <p className={iconClassNm}><Wk /></p>,
      children: [
        {
          key: 'wk/process',
          title: 'wk/process/list',
          label: '공정 정보',
        },
        {
          key: 'wk/bad',
          title: 'wk/bad',
          label: '불량 유형',
        },
        {
          key: 'wk/product',
          title: 'wk/product',
          label: '제품군 유형',
        },
        {
          key: 'wk/lamination',
          title: 'wk/lamination/material',
          label: '적층 구조 유형',
        },
        {
          key: 'wk/board',
          title: 'wk/board',
          label: '원판 정보',
        },
      ]
    },
    {
      type: 'divider',
      style: {margin: 10},
    },
    {
      key: 'buy',
      title:'buy',
      label: '구매/매입',
      icon: <p className={iconClassNm}><Buy /></p>,
      children: [
        {
          key: 'buy/mt',
          title: 'buy/mt/list',
          label: '원자재',
        },
        {
          key: 'buy/submt',
          title: 'buy/submt',
          label: '부자재',
        },
        {
          key: 'buy/out',
          title: 'buy/out',
          label: '외주 매입',
        },
        {
          key: 'buy/unit',
          title: 'buy/unit/model',
          label: '제품 단가',
        },
      ]
    },
    {
      type: 'divider',
      style: {margin: 10},
    },
    {
      key: 'comm',
      title:'',
      label: '공통 코드',
      icon: <p className={iconClassNm}><Company /></p>,
      children: [
        {
          key: 'comm/list',
          title: 'comm/list',
          label: '공통 코드 관리',
        },
      ]
    },
  ]

  const getOpenKeys = (path: string) => {
    const firstSegment = path.split(',')[0];
    return [firstSegment];
  };
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted)      return null;
  
  return (
    <SiderStyled>
      <div>
        <div className="flex justify-center h-80 cursor-pointer w-[100%]">
          <div className="h-center cursor-pointer" onClick={()=>{router.push('/');}}>
            {/* <Image src={Logo} alt="logo" width={120}/> */}
            <Image
              src={port === '90' ? LogoSY : Logo}
              alt="logo"
              width={120}
            />
            {/* <Image src={cookie.get('companySY') === 'gpn' ? Logo : cookie.get('companySY') === 'sy' ? LogoSY : ""} alt="logo" width={120}/> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col max-h-[calc(100vh-230px)] overflow-y-auto overflow-x-hidden">
        <Menu
          mode="inline"
          items={items}
          onClick={({ key, item }) => {
            const it: any = item;
            router.push(`/setting/${it.props.title}`);  //title이 실제 url이므로 title 추출
          }}
          className="sider__menu h-[100%]"
          defaultOpenKeys={getOpenKeys(currentPath)} // 현재 경로에 따라 열린 메뉴
          selectedKeys={[selectedKey]} // 현재 경로에 해당하는 메뉴 항목을 선택
        />
      </div>
      
      <div className="flex flex-col mt-[auto] h-[130px]">
        <Menu
          mode="vertical"
          items={[
            {
              type: 'divider',
              style: {marginBottom: 20},
            },
            {
              key: 'main',
              title: '',
              label:'메인',
              icon: <p className={iconClassNm}><HomeOutlined /></p>,
              onClick:() => {
                router.push('/');
              }
            },
            {
              key: signIn?'logout':'login',
              title: '',
              label:signIn?'로그아웃':'로그인',
              icon: <p className={iconClassNm}>{signIn?<Logout />:<Login />}</p>,
              onClick:()=>{
                if(signIn) {
                  logout();
                  setSignIn(false);
                  router.push('/');
                } else {
                  router.push('/sign/in');
                }
              }
            },
          ]}
          className="sider__menu h-[100%]"
        />
      </div>
    </SiderStyled>
  )
}

const SiderStyled = styled.div<{
  
}>`
  display: flex;
  flex-direction: column;

  width: 240px;
  height: 100vh;
  max-height: 100vh;

  background: #F9F9F9;
  color: #666666;

  & .ant-menu {
    background: #F9F9F9 !important;
  }

  & .ant-menu-submenu-title {
    padding-left: 23px !important;
    color: #666666 !important;
  }

  .ant-menu-sub {
    & .ant-menu-item-only-child > .ant-menu-title-content {
      margin-left: 20px;
    }
  }
  
  & .ant-menu-item {
    padding-left: 23px !important;
    display: flex;
    align-items: center;
    border-inline-end: 0 !important; 
    background: #F9F9F9;
    color: #666666 !important;
  }

  .ant-menu-item-selected {
    background: #03C75A;
    color: white !important;
  }
  
  .menu_under {
    margin-top: auto;
  }
`

export default SettingSider;