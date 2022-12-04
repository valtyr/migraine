import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@guzzler/worker/src/router";

function getBaseUrl() {
  //   if (typeof window !== "undefined")
  //     // browser should use relative path
  //     return "";
  //   if (process.env.WORKER_URL)
  //     // reference for vercel.com
  //     return `https://${process.env.VERCEL_URL}`;
  //   // assume localhost
  return `http://127.0.0.1:8787`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
});
