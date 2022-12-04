import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
