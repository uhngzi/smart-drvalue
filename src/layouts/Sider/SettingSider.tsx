import { useRouter } from "next/router"

import Logo from "@/assets/logo/gpn-logo.png"

import Setting from "@/assets/svg/icons/s_setting.svg"
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

interface Props {
}

const SettingSider: React.FC<Props> = ({ }) => {
  const router = useRouter();

  const iconClassNm = "h-40 min-w-[40px!important]";

  const currentPath = router.pathname.split('/').slice(1).join();
  const [newPath, setNewPath] = useState<string>('');
  useEffect(()=>{
    //3뎁스일 때 마지막을 제외한 키 값 추출
    const path = currentPath.split(',').slice(1).slice(0, 2);
    setNewPath(path.join('/'));
  },[currentPath])

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
      key: 'hr',
      title:'hr',
      label: '인사',
      icon: <p className={iconClassNm}><Hr /></p>,
      children: [
        {
          key: 'hr/user',
          title: 'hr/user',
          label: '인사 · 구성원',
        },
        {
          key: 'hr/confirm',
          title: 'hr/confirm',
          label: '승인정채',
        },
      ]
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
          title: 'wk/lamination',
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
          title: 'buy/mt',
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
      ]
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
  
  return (
    <SiderStyled>
      <div>
        <div className="flex justify-center h-80 cursor-pointer w-[100%]">
          <div className="h-center cursor-pointer" onClick={()=>{router.push('/');}}>
            <Image src={Logo} alt="logo" width={120}/>
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
          selectedKeys={[newPath]} // 현재 경로에 해당하는 메뉴 항목을 선택
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
              icon: <p className={iconClassNm}><Setting /></p>,
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
    color: #666666 !important;
  }
  
  & .ant-menu-item {
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