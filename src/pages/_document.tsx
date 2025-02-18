import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ServerStyleSheet } from "styled-components";

export default function MyDocument() {
  const version = Date.now(); // 🔹 현재 타임스탬프 (버전 관리용)

  return (
    <Html lang="en">
      <Head>
        {/* 🔹 Daum 주소 API에 버전 쿼리 추가 */}
        <script
          src={`//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js?v=${version}`}
          defer
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  const sheet = new ServerStyleSheet();
  const version = Date.now(); // 🔹 버전 쿼리 추가

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        sheet.collectStyles(
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        {sheet.getStyleElement()}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};
