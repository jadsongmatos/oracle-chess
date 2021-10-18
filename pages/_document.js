import Script from "next/script";
import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  componentDidMount() {
    this.loadFbLoginApi();
  }
  render() {
    return (
      <Html>
        <Head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7540935582112706"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
