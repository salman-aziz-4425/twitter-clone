"use client";

import { useState } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();
const isWindowAvailable: boolean = typeof window !== 'undefined';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const persister= createSyncStoragePersister({
  storage: (isWindowAvailable ? window.localStorage : undefined),
});

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(() => new QueryClient(
  ));

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
             
            };
          },
        }),
      ],
    })
  );

  return (
    <PersistQueryClientProvider
    client={queryClient}
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    persistOptions={{ persister }}
  >
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {props.children}
      </api.Provider>
      </PersistQueryClientProvider>
  );
}
