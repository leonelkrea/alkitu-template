# 📦 Shared Library

This package contains shared code that is used by both the `web` and `api` packages in the Alkitu monorepo.

## ✨ Purpose

The primary purpose of this package is to ensure consistency and reduce code duplication between the frontend and backend. By having a single source of truth for shared types, validation schemas, and utilities, we can avoid bugs and make the codebase easier to maintain.

## 📁 Contents

- **TypeScript Types**: Contains shared TypeScript interfaces and type definitions that are used in both the `web` and `api` packages. This ensures that the data models are consistent across the entire application.
- **Zod Schemas**: Provides Zod validation schemas that are used for both frontend form validation and backend API validation. This guarantees that the data is validated against the same rules on both the client and the server.
- **Utilities**: Includes common utility functions that can be used in both the frontend and backend.

## 🚀 Usage

This package is automatically imported by the `web` and `api` packages through npm workspaces. There is no need to publish it to a package registry.

When you make changes to this package, they will be automatically available in the other packages in the monorepo.

## 🤝 Contributing

When adding new code to this package, please ensure that it is generic and can be used by both the frontend and backend. Avoid adding code that is specific to a single package.
