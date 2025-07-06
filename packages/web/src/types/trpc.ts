// Re-export the AppRouter type from the backend
export type { AppRouter } from '../../../api/src/trpc/trpc.router';

// Utility types for tRPC
export interface HelloInput {
  name: string;
}

export interface HelloOutput {
  greeting: string;
}
