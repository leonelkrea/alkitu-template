# 🚀 Alkitu Template - Fullstack Monorepo

A production-ready **monorepo** template featuring a **Next.js** frontend and a **NestJS** backend, designed for modern development with **tRPC**, **GraphQL**, and **REST** APIs. Includes complete authentication, role-based access control, notification system, and MongoDB integration.

## 📁 Project Structure

```
alkitu-template/
├── packages/
│   ├── web/                         # 🌐 Next.js Web App (tRPC)
│   ├── api/                         # 🔧 NestJS Backend (GraphQL + tRPC + REST)
│   └── shared/                      # 📦 Shared TypeScript utilities
├── infrastructure/
│   ├── docker/
│   └── scripts/
├── tools/
└── docs/
```

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                 │
│                      (Port 80/443)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┴─────────────┐
         │                          │
         ▼                          ▼
┌─────────────────┐         ┌─────────────────┐
│   Next.js Web   │◄──tRPC──┤   NestJS API    │
│   (Port 3000)   │         │   (Port 3001)   │
└─────────────────┘         └─────────────────┘
         │                          
         ▼                          
┌─────────────────┐         ┌─────────────────┐
│   MongoDB       │         │   Redis Cache   │
│   (Port 27017)  │         │   (Port 6379)   │
└─────────────────┘         └─────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** (>=18.0.0)
- **npm** (>=8.0.0)
- **Docker Desktop** (para el entorno de desarrollo simplificado)

### 2. Setup

```bash
# Clone the repository
git clone <repository-url>
cd alkitu-template

# Install dependencies for all packages
npm install

# Create environment file (if not exists)
npm run setup:env
```

### 3. Start Development

#### Opción 1: Docker (Recomendado)
```bash
# Entorno completo con Docker (auto-reload incluido)
npm run dev:docker
```

#### Opción 2: Local
```bash
# Desarrollo local (requiere configuración manual de BD)
npm run dev
```

### 4. Access Applications

- **Frontend Web**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health
- **Database**: mongodb://localhost:27017/alkitu

### 5. Comandos útiles

```bash
# Gestión de servicios
npm run docker:stop
npm run docker:logs
npm run docker:restart

# Base de datos
npm run db:shell      # MongoDB shell
npm run db:push       # Sincronizar schema
npm run db:studio     # Prisma Studio
npm run migrate       # Migraciones (producción)

# Testing
npm run test          # Todos los tests
npm run test:api      # Backend tests
npm run test:web      # Frontend tests
```

## 🐳 Docker Development Setup

### Servicios Incluidos

| Servicio         | Puerto | URL                            | Descripción           |
| ---------------- | ------ | ------------------------------ | --------------------- |
| **Frontend**     | 3000   | http://localhost:3000          | Next.js Web App       |
| **Backend API**  | 3001   | http://localhost:3001          | NestJS API            |
| **API Docs**     | 3001   | http://localhost:3001/api/docs | Swagger Documentation |
| **Health Check** | 3001   | http://localhost:3001/health   | Health Status         |
| **MongoDB**      | 27017  | mongodb://localhost:27017      | Database              |
| **Redis**        | 6379   | redis://localhost:6379         | Cache & Sessions      |

### Auto-reload

✅ **Funciona automáticamente:**
- **Backend API**: Cambios en `packages/api/src/` se recargan automáticamente
- **Frontend**: Cambios en `packages/web/` se recargan automáticamente
- **Shared**: Cambios en `packages/shared/` se propagan a ambos

### Solución de problemas

```bash
# Puerto ocupado
lsof -i :3000 && kill -9 <PID>

# Limpiar Docker
docker system prune -a
npm run docker:stop
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Problemas de MongoDB
npm run docker:logs mongodb
npm run docker:restart mongodb
```

### Variables de entorno

```env
# Base de datos
DATABASE_URL="mongodb://localhost:27017/alkitu?replicaSet=rs0&directConnection=true"

# Redis
REDIS_URL="redis://redis:6379"

# URLs de aplicación
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📖 Documentación

- [🗄️ **Database Development**](./docs/database-development.md) - Guía de Prisma + MongoDB
- [🚀 **Deployment**](./docs/deployment.md) - Despliegue en producción
- [🧪 **Testing**](./docs/testing.md) - Estrategia de testing
- [📚 **API Reference**](./packages/api/README.md) - Documentación de APIs

## 🏗️ Technologies

### 🌐 Web Frontend (`packages/web`)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **State**: React Query + tRPC
- **Auth**: NextAuth.js
- **TypeScript**: Full type safety

### 🔧 Backend API (`packages/api`)

- **Framework**: NestJS with TypeScript
- **APIs**: tRPC + GraphQL + REST
- **Database**: MongoDB with Prisma
- **Auth**: JWT + Passport
- **Docs**: Swagger + GraphQL Playground

### 📦 Shared Library (`packages/shared`)

- **Types**: Shared TypeScript interfaces
- **Schemas**: Zod validation schemas
- **Utils**: Common utilities

## 🛠️ Development Commands

### Root Commands

```bash
npm run dev           # Start web + api
npm run build         # Build all packages
npm run test          # Run all tests
npm run lint          # Lint all packages
```

### Package-Specific Commands

```bash
# Web frontend
npm run dev:web
npm run build:web
npm run test:web

# Backend API
npm run dev:api
npm run build:api
npm run test:api
```


## 🤝 Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the **MIT License**.