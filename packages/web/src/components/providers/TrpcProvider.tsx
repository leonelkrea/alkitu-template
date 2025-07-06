'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpcReact } from '@/lib/trpc';

/**
 * Wrapper Client Component para el provider de tRPC con React Query.
 *
 * @param children - Componentes hijos que tendrán acceso a tRPC
 * @returns JSX.Element - Provider de tRPC envolviendo a los hijos
 */
export function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [
        httpBatchLink({
          url:
            process.env.NODE_ENV === 'production'
              ? '/api/trpc'
              : 'http://localhost:3001/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcReact.Provider>
  );
}
