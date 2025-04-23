import { Menu } from "antd";
import cookie from "cookiejs";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

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

import { loginCheck, logout } from "@/utils/signUtil";

import { useMenu } from "@/data/context/MenuContext";
import { port } from "@/pages/_app";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sider: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const { menuLoading, sider } = useMenu();

  const iconClassNm = "h-40 min-w-[40px!important]";

  const [selectedKey, setSelectedKey] = useState<string>("");

  useEffect(() => {
    const pathSegments = router.asPath.split("/").filter(Boolean);
    
    let matched = "";
    if (pathSegments.length >= 2) {
      matched = `${pathSegments[0]}/${pathSegments[1]}`;
    } else if (pathSegments.length === 1) {
      matched = pathSegments[0];
    } else {
      matched = '/';
    }
  
    setSelectedKey(matched);
  }, [router.asPath]);

  const [signIn, setSignIn] = useState<boolean>(false);
  useEffect(()=>{
    setSignIn(loginCheck);
  }, [signIn]);

  const items: ItemType<MenuItemType>[] = [
    {
      key: '/',
      title:'/',
      label: '홈 피드',
      icon: <p className={iconClassNm}><DashBoard /></p>,
    },
    {
      key: 'star',
      title:'',
      label: '즐겨찾는 메뉴',
      icon: <p className={iconClassNm}><Star /></p>,
    },
    {
      type: 'divider',
      style: {margin: 15},
    },
    {
      key: 'sales',
      title:'sales',
      label: '영업',
      icon: <p className={iconClassNm}><Sales className="w-24 h-24" /></p>,
      children: [
        // {
        //   key: 'sales/project',
        //   title: 'sales/project',
        //   label: '임시 일정관리',
        // },
        {
          key: 'sales/model',
          title: 'sales/model',
          label: '모델 등록 및 현황',
        },
        {
          key: 'sales/offer',
          title: 'sales/offer/order',
          label: '고객발주/견적',
        },
        {
          key: 'sales/status',
          title: 'sales/status',
          label: '수주현황',
        },
        {
          key: 'sales/array',
          title: 'sales/array',
          label: '원판 수율 계산',
        },
      ]
    },
    {
      key: 'sayang',
      title:'sayang',
      label: '사양',
      icon: <p className={iconClassNm}><Sayang /></p>,
      children: [
        {
          key: 'sayang/model',
          title: 'sayang/model/confirm',
          label: '모델 확정 및 현황',
        },
        {
          key: 'sayang/sample',
          title: 'sayang/sample/regist',
          label: '사양 등록 및 현황',
        },
      ]
    },
    {
      key: 'wk',
      title:'wk',
      label: '생산',
      icon: <p className={iconClassNm}><Wk /></p>,
      children: [
        {
          key: 'wk/plan',
          title: 'wk/plan/wait',
          label: '생산 대기',
        },
        {
          key: 'wk/status',
          title: 'wk/status/proc',
          label: '생산 관리',
        },
      ]
    },
    {
      key: 'buy',
      title:'buy',
      label: '관리/구매',
      icon: <p className={iconClassNm}><Buy /></p>,
      children: [
        {
          key: 'buy/cost',
          title: 'buy/cost/wait',
          label: '외주처 단가 등록 및 현황',
        },
        {
          key: 'buy/order',
          title: 'buy/order',
          label: '구매 및 발주',
        },
      ]
    },
    // {
    //   key: 'attd/secom',
    //   title:'attd/secom',
    //   label: '근태',
    //   icon: <p className={iconClassNm}><Wk /></p>,
    // },
  ]
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted)      return null;
  if(menuLoading)   return;

  return (
    <SiderStyled $width={collapsed?'80px':'240px'}>
      <div>
        <div className="flex justify-center h-80 cursor-pointer w-[100%]">
          <div className="h-center cursor-pointer" style={{display:collapsed?'none':'flex'}} onClick={()=>{router.push('/');}}>
            <Image
              src={port === '90' ? LogoSY : Logo}
              alt="logo"
              width={120}
            />
          </div>
          <div className="h-center cursor-pointer" style={{marginLeft:collapsed?0:40}} onClick={()=>{setCollapsed(!collapsed)}}>
            <MenuIcon />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Menu
          mode="inline"
          items={sider}
          onClick={({ key, item }) => {
            const it: any = item;
            router.push(`/${it.props.title}`);  //title이 실제 url이므로 title 추출
          }}
          className="sider__menu"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[selectedKey.split('/')[0]]}
        />
      </div>
      
      <div className="flex flex-col h-[150px]">
        <Menu
          mode="vertical"
          items={[
            {
              type: 'divider',
              style: {marginBottom: 20},
            },
            {
              key: 'setting',
              title: '',
              label:'설정',
              icon: <p className={iconClassNm}><Setting /></p>,
              onClick:() => {
                router.push('/setting');
                sessionStorage.setItem('prevUrl', router.asPath);
              }
              // children: [
              //   {
              //     key: 'setting/profile',
              //     label: '프로필',
              //   }
              // ]
            },
            {
              key: 'err',
              title: 'err',
              label:'오류사항',
              icon: <div className={iconClassNm}><p className="w-22 h-22 icons"><Err /></p></div>,
              onClick:()=>{
                router.push("/err");
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
          className="sider__menu"
          inlineCollapsed={collapsed}
        />
      </div>
    </SiderStyled>
  )
}

const SiderStyled = styled.div<{
  $width: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: ${({ $width }) => $width};
  height: calc(100vh - 10px);
  max-height: calc(100vh - 15px);

  background: white;
  
  transition: width 0.7s ease;
  
  .ant-menu-item {
    display: flex;
    align-items: center;
    border-inline-end: 0 !important; 
    padding-left: 23px !important;
  }

  .ant-menu-submenu-title {
    padding-left: 23px !important;
  }

  .ant-menu-sub {
    & .ant-menu-item-only-child > .ant-menu-title-content {
      margin-left: 20px;
    }
  }
    
  .ant-menu-item-selected {
    background:  #4880FF;
    color: white;

    .icons {
      color: #4880FF;
    }
  }
  
  .menu_under {
    margin-top: auto;
  }
`

export default Sider;