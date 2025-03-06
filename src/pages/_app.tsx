import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import ko_KR from 'antd/locale/ko_KR';

import { client } from '@/api/lib/reactQuery';

import '@/styles/fonts.css';
import '@/styles/globals.css';

import StyledComponentsRegistry from '@/utils/registry';

import { UserProvider } from '@/data/context/UserContext';
import { ModelProvider } from '@/data/context/ModelContext';
import { BaseProvider } from '@/data/context/BaseContext';


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
    }
  },[pathname]);

  return (
    <QueryClientProvider client={client}>
      <UserProvider>
      <BaseProvider>
      <ModelProvider>
      <ConfigProvider 
        locale={ko_KR}
        theme={{
          token: {
            zIndexPopupBase: 1000,
          },
        }}
      >
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
      </ModelProvider>
      </BaseProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
