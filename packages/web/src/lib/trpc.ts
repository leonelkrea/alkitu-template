import { createTRPCReact } from '@trpc/react-query';

// Definir el tipo de AppRouter basado en la estructura real del backend
export type AppRouter = {
  hello: {
    input: { name: string };
    output: { greeting: string };
  };
  chat: any; // Por ahora any para debugging
  notification: any;
  billing: any;
  user: any;
  chatbotConfig: any;
  theme: any;
  company: any;
};

// Solo necesitamos el React Query client para componentes
export const trpc = createTRPCReact<AppRouter>();
