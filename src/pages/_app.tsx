import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { AppRouter } from "@/backend/router";
import "@/styles/tailwind.css";
import { Wrapper } from "@/components";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { RecoilRoot } from "recoil";

const publicPages = ["/user/sign-in"];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <MantineProvider
        theme={{
          primaryColor: "dark",
          focusRing: "always",
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        <ClerkProvider {...pageProps}>
          <RecoilRoot>
            {publicPages.includes(router.pathname) ? (
              <Component {...pageProps} />
            ) : (
              <Wrapper>
                <SignedIn>
                  <Component {...pageProps} />
                  <div id="modal-root" />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn
                    redirectUrl="/user/sign-in"
                    afterSignInUrl="/"
                  />
                </SignedOut>
              </Wrapper>
            )}
          </RecoilRoot>
        </ClerkProvider>
      </MantineProvider>
    </>
  );
}

function getBaseUrl() {
  if (process.browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);
