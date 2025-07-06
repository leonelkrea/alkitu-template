# 🌐 Alkitu Web Frontend

This package contains the Next.js frontend for the Alkitu application. It is built with the App Router and uses tRPC for type-safe communication with the backend.

## ✨ Features

- **Next.js 15**: Utilizes the App Router for modern, server-centric React development.
- **TypeScript**: Full type safety throughout the application.
- **Tailwind CSS & Shadcn/UI**: For a modern and responsive user interface.
- **tRPC Client**: Enables end-to-end type-safe API communication with the backend.
- **NextAuth.js**: Handles user authentication and session management.
- **React Query**: Manages server state, caching, and data fetching.

## 🚀 Getting Started

### 1. Prerequisites

- The backend API (`packages/api`) must be running.
- All dependencies must be installed from the root of the monorepo (`npm install`).

### 2. Running the Development Server

To start the web frontend in development mode, run the following command from the root of the monorepo:

```bash
npm run dev:web
```

This will start the Next.js development server, typically on **http://localhost:3000**.

## 📁 Folder Structure

- `src/app/`: Contains the pages and layouts of the application, following the Next.js App Router conventions.
- `src/components/`: Reusable React components, organized by feature and type (e.g., `ui`, `layout`).
- `src/lib/`: Utility functions and helper modules.
- `src/utils/trpc.ts`: Configuration for the tRPC client.
- `src/hooks/`: Custom React hooks for reusable logic.
- `src/context/`: React context providers for global state.

## 🤝 API Communication

The frontend communicates with the backend exclusively through the type-safe tRPC client. All API procedures and their types are automatically inferred from the `api` package, eliminating the need for manual type definitions and providing a seamless development experience.

## 🧪 Testing

To run the tests for the web package, use the following command from the root of the monorepo:

```bash
npm run test:web
```
