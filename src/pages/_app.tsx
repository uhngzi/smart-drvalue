import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import ko_KR from 'antd/locale/ko_KR';

import { client } from '@/api/lib/reactQuery';

import '@/styles/fonts.css';
import '@/styles/globals.css';
import "react-toastify/dist/ReactToastify.css";

import StyledComponentsRegistry from '@/utils/registry';

import { UserProvider } from '@/data/context/UserContext';
import { BaseProvider } from '@/data/context/BaseContext';
import { ToastContainer } from 'react-toastify';
import { MenuProvider } from '@/data/context/MenuContext';

// 브라우저 환경인지 체크
const isBrowser = typeof window !== 'undefined';
export const port = isBrowser ? window.location.port : '';

type AppPropsWithLayout = AppProps & {
  Component: {
    layout: (page: React.ReactNode) => React.ReactNode;
  };
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { pathname } = useRouter();

  useEffect(() => {
    if(pathname.startsWith('/setting') || pathname.startsWith('/sign')){
      document.body.classList.add('no-width')
    } else {
      document.body.classList.remove('no-width');
    }
  },[pathname]);

  return (
    <QueryClientProvider client={client}>
      <MenuProvider>
      <UserProvider>
      <BaseProvider>
      <ConfigProvider 
        locale={ko_KR}
        theme={{
          token: {
            zIndexPopupBase: 1000,
          },
        }}
      >
        <ToastContainer
            position="top-right"
            limit={1}
            closeButton={false}
            autoClose={4000}
            hideProgressBar
        />
        <AntdApp>
          <StyledComponentsRegistry>
            {Component.layout ? (
              Component.layout(<Component {...pageProps} />)
            ) : (
              <Component {...pageProps} />
            )}
            {/* <MainFooter /> */}
          </StyledComponentsRegistry>
        </AntdApp>
      </ConfigProvider>
      </BaseProvider>
      </UserProvider>
      </MenuProvider>
    </QueryClientProvider>
  );
}
