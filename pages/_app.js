import "../public/app.css";
import "react-chessground/dist/styles/chessground.css";
import "bootstrap/dist/css/bootstrap.min.css";

import GoogleTagManager from "../components/GoogleTagManager";

function MyApp({ Component, pageProps }) {
  return (
    <GoogleTagManager>
      <Component {...pageProps} />
    </GoogleTagManager>
  );
}

export default MyApp;
