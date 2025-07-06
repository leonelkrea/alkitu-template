import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/types/trpc';

// Regular proxy client for server-side or non-React usage
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});

// React Query client for components
export const trpcReact = createTRPCReact<AppRouter>();
