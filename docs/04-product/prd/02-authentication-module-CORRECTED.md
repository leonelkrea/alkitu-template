# 🔐 Authentication Module PRD (CORRECTED VERSION)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El módulo de autenticación proporciona un sistema completo de autenticación y autorización para el template Alkitu, usando **Prisma + MongoDB** como base de datos y **tRPC + NestJS** como arquitectura de API.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-002 (Open/Closed Principle)
- **Relacionado con**: REFACTOR-002 (AuthService refactoring)
- **Implementación**: Semana 7-8 (después de completar principios SOLID)

### **Objetivos Comerciales**

- **Escalabilidad**: Soportar desde usuarios individuales hasta empresas grandes
- **Flexibilidad**: Múltiples métodos de autenticación según necesidades
- **Seguridad**: Estándares de seguridad empresarial aplicando principios SOLID
- **Facilidad de uso**: Onboarding rápido y experiencia fluida

---

## 🛠️ 5. Requisitos Técnicos (CORREGIDOS)

### **🔧 Tech Stack Actual**

```typescript
// CORRECT Tech Stack (aligned with project)
const AUTH_TECH_STACK = {
  backend: {
    framework: "NestJS 10+",
    database: "MongoDB with Prisma ORM", // ✅ CORRECTED
    api: "tRPC + REST", // ✅ CORRECTED
    auth: "JWT + Passport",
    validation: "Zod schemas", // ✅ CORRECTED
    testing: "Jest + Stryker mutation testing",
  },
  frontend: {
    framework: "Next.js 14+ App Router", // ✅ CORRECTED
    ui: "shadcn/ui + Radix UI + Tailwind", // ✅ CORRECTED
    state: "Zustand + React Query", // ✅ CORRECTED
    forms: "React Hook Form + Zod",
  },
};
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model User {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  email           String   @unique
  password        String?  // Optional for OAuth users
  firstName       String?
  lastName        String?
  avatar          String?
  emailVerified   Boolean  @default(false)
  emailVerifiedAt DateTime?
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // Relations
  sessions        Session[]
  organizations   OrganizationMember[]

  @@map("users")
}

model Session {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  token     String   @unique
  refreshToken String?
  deviceName String?
  ipAddress String?
  userAgent String?
  expiresAt DateTime
  lastUsedAt DateTime @default(now())
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Organization {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members OrganizationMember[]

  @@map("organizations")
}

model OrganizationMember {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  organizationId String   @db.ObjectId
  role           String   @default("member")
  invitedBy      String?  @db.ObjectId
  joinedAt       DateTime @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@map("organization_members")
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST controllers
// packages/api/src/trpc/routers/auth.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} from "../schemas/auth.schemas";

export const authRouter = createTRPCRouter({
  // User Registration
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.authService.register(input);
    }),

  // User Login
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    return await ctx.authService.login(input);
  }),

  // Verify Email
  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.authService.verifyEmail(input.token);
    }),

  // Get Current User
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Logout
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.authService.logout(ctx.user.id);
  }),

  // Enable 2FA
  enable2FA: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.authService.enable2FA(ctx.user.id);
  }),

  // Verify 2FA
  verify2FA: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.authService.verify2FA(ctx.user.id, input.code);
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with proper interfaces
// packages/api/src/auth/auth.service.ts

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService
  ) {}

  async register(data: RegisterDto): Promise<AuthResult> {
    // Implementation following SOLID principles
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await this.passwordService.hash(data.password);

    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, user.id);

    return {
      user: this.sanitizeUser(user),
      token: await this.tokenService.generateAccessToken(user.id),
      refreshToken: await this.tokenService.generateRefreshToken(user.id),
    };
  }

  // Other methods following SOLID principles...
}
```

### **🎨 Frontend Components (Next.js + shadcn/ui)**

```tsx
// ✅ CORRECTED: Next.js 14 + shadcn/ui components
// packages/web/src/components/auth/LoginForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Handle successful login
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      form.setError("root", { message: error.message });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

---

## 📅 **TIMELINE CORREGIDO**

### **🔗 Integración con Planning SOLID**

```typescript
// ✅ CORRECTED: Aligned with SOLID implementation
const AUTH_IMPLEMENTATION_PLAN = {
  // PREREQUISITE: Complete SOLID principles first
  prerequisites: [
    "SOLID-002: Open/Closed Principle", // Week 1-2
    "REFACTOR-002: AuthService refactoring", // Week 3-4
  ],

  // ACTUAL IMPLEMENTATION: Weeks 7-8
  implementation: {
    week7: [
      "Update Prisma schema for auth models",
      "Implement SOLID-compliant AuthService",
      "Create tRPC auth router",
      "Update frontend components to use tRPC",
    ],
    week8: [
      "Implement 2FA functionality",
      "Add OAuth providers (Google, GitHub)",
      "Complete testing with 95% coverage",
      "Integration with user management system",
    ],
  },
};
```

---

## 🎯 **Feature Flags Integration**

```typescript
// ✅ CORRECTED: Integration with existing feature flags
// packages/shared/src/config/freemium-flags.ts

export const AUTH_FEATURE_FLAGS = {
  // Free tier
  basicAuth: {
    emailPassword: true,
    emailVerification: true,
    passwordReset: true,
  },

  // Premium tier
  advancedAuth: {
    twoFactorAuth: true,
    socialLogin: ["google", "github"],
    multipleSessions: true,
  },

  // Enterprise tier
  enterpriseAuth: {
    samlSSO: true,
    ldapIntegration: true,
    auditLogs: true,
    customPolicies: true,
  },
} as const;
```

---

## ✅ **Criterios de Aceptación (ACTUALIZADOS)**

### **Prerequisitos SOLID**

- [ ] **SOLID-002 completado**: Open/Closed Principle aplicado
- [ ] **REFACTOR-002 completado**: AuthService refactorizado siguiendo SOLID
- [ ] **Arquitectura preparada**: Interfaces y contratos definidos

### **Implementación Técnica**

- [ ] **Prisma schema**: Modelos de User, Session, Organization definidos
- [ ] **tRPC router**: Endpoints de auth funcionando correctamente
- [ ] **SOLID compliance**: Servicios siguen principios SOLID
- [ ] **Frontend components**: shadcn/ui components implementados
- [ ] **Feature flags**: Integración con sistema de flags existente

### **Testing & Quality**

- [ ] **95% test coverage**: Unit tests + integration tests
- [ ] **85% mutation score**: Mutation testing con Stryker
- [ ] **Zero vulnerabilities**: Security scan passed
- [ ] **Performance**: < 500ms response time para auth operations

---

## 🔗 **Referencias al Proyecto Actual**

- **SOLID TODOs**: [SOLID-002](../../04-product/tickets/SOLID-002-OCP.md)
- **Refactor TODOs**: [REFACTOR-002](../../04-product/tickets/REFACTOR-002-AUTH-SERVICE.md)
- **Feature Flags**: [freemium-flags.ts](../../../packages/shared/src/config/freemium-flags.ts)
- **Current Auth**: [auth module](../../../packages/api/src/auth/)
- **Prisma Schema**: [schema.prisma](../../../packages/api/prisma/schema.prisma)

---

**🎯 Este PRD corregido está alineado con:**

- ✅ Stack tecnológico actual (Prisma + MongoDB)
- ✅ Arquitectura SOLID en implementación
- ✅ Timeline del proyecto (después de SOLID principles)
- ✅ Sistema de feature flags existente
- ✅ TODOs y dependencias actuales
