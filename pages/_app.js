import "../styles/globals.css";
import '@tremor/react/dist/esm/tremor.css'

// 1. import `ChakraProvider` component
import { Noto_Sans_Thai } from "@next/font/google";

const roboto = Noto_Sans_Thai({
  weight: "400",
});

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

function MicroApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <main className={roboto.className}>
      <SessionProvider session={session}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </main>
  );
}

export default MicroApp;
