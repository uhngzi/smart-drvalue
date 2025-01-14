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
  return (
    <Html lang="en">
      <Head>
        <script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
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
