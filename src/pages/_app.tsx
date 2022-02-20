import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { CookiesProvider } from 'react-cookie';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = NextPage & {
  // define the getLayout method for every page
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  // override the default Component definition
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CookiesProvider>
      <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
    </CookiesProvider>
  );
}

export default MyApp;
