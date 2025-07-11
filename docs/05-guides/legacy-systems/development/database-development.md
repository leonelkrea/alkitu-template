# 🗄️ Database Development Guide

Esta guía explica cómo trabajar con la base de datos en el proyecto Alkitu usando Prisma + MongoDB.

## 🚨 MongoDB vs PostgreSQL - Diferencias Importantes

| Aspecto | PostgreSQL | MongoDB |
|---------|------------|---------|
| **Migraciones** | `prisma migrate dev` | **NO USAR** - Solo `db push` |
| **ID Fields** | `Int @id @default(autoincrement())` | `String @id @default(auto()) @map("_id") @db.ObjectId` |
| **Relaciones** | Foreign Keys nativos | ObjectId references |
| **Schema Changes** | Requiere migración | Push directo |

## 🔄 Proceso para Crear Nuevos Modelos

### 1. Definir el Modelo en Prisma Schema

```prisma
// packages/api/prisma/schema.prisma
model NuevoModelo {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  status    String   @default("active")
  metadata  Json?    // MongoDB permite JSON flexible
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

// No olvides actualizar el modelo User si es necesario:
model User {
  // ... otros campos
  nuevoModelos NuevoModelo[]
}
```

### 2. Comandos Prisma (MongoDB)

```bash
# 🚨 IMPORTANTE: MongoDB usa DB Push, NO migraciones
cd packages/api

# Sincronizar schema con BD (desarrollo)
npx prisma db push

# Generar cliente Prisma (después de cambios en schema)
npx prisma generate

# Abrir Prisma Studio para ver/editar datos
npx prisma studio

# Resetear BD completa (¡CUIDADO! - Borra todos los datos)
npx prisma db push --force-reset

# Verificar conexión con BD
npx prisma db pull
```

### 3. Crear DTO (Data Transfer Objects)

```typescript
// packages/api/src/nuevo-modelo/dto/create-nuevo-modelo.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateNuevoModeloDto {
  @IsString()
  name: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;

  @IsOptional()
  metadata?: any;
}

export class UpdateNuevoModeloDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;

  @IsOptional()
  metadata?: any;
}
```

### 4. Crear Servicio NestJS

```typescript
// packages/api/src/nuevo-modelo/nuevo-modelo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNuevoModeloDto, UpdateNuevoModeloDto } from './dto';

@Injectable()
export class NuevoModeloService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateNuevoModeloDto) {
    return this.prisma.nuevoModelo.create({
      data: {
        ...createDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findAll(userId: string, filters?: { status?: string }) {
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.nuevoModelo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findOne(id: string, userId: string) {
    const item = await this.prisma.nuevoModelo.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async update(id: string, userId: string, updateDto: UpdateNuevoModeloDto) {
    // Verificar que existe y pertenece al usuario
    await this.findOne(id, userId);

    return this.prisma.nuevoModelo.update({
      where: { id },
      data: updateDto,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async remove(id: string, userId: string) {
    // Verificar que existe y pertenece al usuario
    await this.findOne(id, userId);

    return this.prisma.nuevoModelo.delete({
      where: { id }
    });
  }

  async count(userId: string, filters?: { status?: string }) {
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.nuevoModelo.count({ where });
  }
}
```

### 5. Crear Router tRPC

```typescript
// packages/api/src/trpc/routers/nuevo-modelo.router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { NuevoModeloService } from '../../nuevo-modelo/nuevo-modelo.service';
import { PrismaService } from '../../prisma.service';

const t = initTRPC.create();

// Initialize services
const prisma = new PrismaService();
const nuevoModeloService = new NuevoModeloService(prisma);

export const nuevoModeloRouter = t.router({
  // Obtener todos los items del usuario
  getAll: t.procedure
    .input(z.object({ 
      userId: z.string(),
      status: z.string().optional()
    }))
    .query(async ({ input }) => {
      try {
        const items = await nuevoModeloService.findAll(input.userId, {
          status: input.status
        });
        return items;
      } catch (error) {
        throw new Error('Failed to fetch items');
      }
    }),

  // Obtener un item específico
  getById: t.procedure
    .input(z.object({ 
      id: z.string(),
      userId: z.string()
    }))
    .query(async ({ input }) => {
      try {
        return await nuevoModeloService.findOne(input.id, input.userId);
      } catch (error) {
        throw new Error('Failed to fetch item');
      }
    }),

  // Crear nuevo item
  create: t.procedure
    .input(z.object({
      userId: z.string(),
      name: z.string(),
      status: z.enum(['active', 'inactive']).optional(),
      metadata: z.any().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        const { userId, ...createDto } = input;
        return await nuevoModeloService.create(userId, createDto);
      } catch (error) {
        throw new Error('Failed to create item');
      }
    }),

  // Actualizar item
  update: t.procedure
    .input(z.object({
      id: z.string(),
      userId: z.string(),
      name: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      metadata: z.any().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, userId, ...updateDto } = input;
        return await nuevoModeloService.update(id, userId, updateDto);
      } catch (error) {
        throw new Error('Failed to update item');
      }
    }),

  // Eliminar item
  delete: t.procedure
    .input(z.object({
      id: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        return await nuevoModeloService.remove(input.id, input.userId);
      } catch (error) {
        throw new Error('Failed to delete item');
      }
    }),

  // Obtener conteo de items
  getCount: t.procedure
    .input(z.object({
      userId: z.string(),
      status: z.string().optional()
    }))
    .query(async ({ input }) => {
      try {
        const count = await nuevoModeloService.count(input.userId, {
          status: input.status
        });
        return { count };
      } catch (error) {
        throw new Error('Failed to get count');
      }
    })
});
```

### 6. Registrar en Router Principal

```typescript
// packages/api/src/trpc/trpc.router.ts
import { nuevoModeloRouter } from './routers/nuevo-modelo.router';

export const appRouter = t.router({
  // ... otros routers existentes
  user: userRouter,
  notification: notificationRouter,
  nuevoModelo: nuevoModeloRouter, // 👈 Agregar aquí
});
```

### 7. Crear Módulo NestJS (Opcional para REST)

```typescript
// packages/api/src/nuevo-modelo/nuevo-modelo.module.ts
import { Module } from '@nestjs/common';
import { NuevoModeloService } from './nuevo-modelo.service';
import { NuevoModeloController } from './nuevo-modelo.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [NuevoModeloController],
  providers: [NuevoModeloService, PrismaService],
  exports: [NuevoModeloService],
})
export class NuevoModeloModule {}
```

### 8. Usar en Frontend

```typescript
// packages/web/src/components/nuevo-modelo-list.tsx
'use client';

import { trpcReact } from '@/lib/trpc';
import { useSession } from 'next-auth/react';

export function NuevoModeloList() {
  const { data: session } = useSession();
  
  const { data: items, isLoading, refetch } = trpcReact.nuevoModelo.getAll.useQuery({
    userId: session?.user?.id || '',
    status: 'active'
  });

  const createMutation = trpcReact.nuevoModelo.create.useMutation({
    onSuccess: () => {
      refetch(); // Recargar lista después de crear
    }
  });

  const deleteMutation = trpcReact.nuevoModelo.delete.useMutation({
    onSuccess: () => {
      refetch(); // Recargar lista después de eliminar
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Mis Items</h2>
      {items?.map(item => (
        <div key={item.id} className="border p-4 mb-2">
          <h3>{item.name}</h3>
          <p>Status: {item.status}</p>
          <button 
            onClick={() => deleteMutation.mutate({
              id: item.id,
              userId: session?.user?.id || ''
            })}
            disabled={deleteMutation.isLoading}
          >
            Delete
          </button>
        </div>
      ))}
    }
  );
}
```

## 🛠️ Comandos de Desarrollo

### Scripts del Proyecto

```bash
# Desarrollo completo con Docker (recomendado)
npm run dev:docker

# Solo desarrollo local (sin Docker)
npm run dev

# Ver logs de servicios específicos
npm run docker:logs api
npm run docker:logs mongodb

# Conectar a MongoDB shell
npm run db:shell

# Sincronizar schema (development)
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```

### Comandos Prisma Directos

```bash
cd packages/api

# Generar cliente después de cambios en schema
npx prisma generate

# Verificar conexión con BD
npx prisma db pull

# Formatear schema
npx prisma format

# Validar schema
npx prisma validate
```

## 🚨 Mejores Prácticas

### 1. Siempre usar índices
```prisma
model MiModelo {
  // ... campos
  @@index([userId])          // Para filtros por usuario
  @@index([status])          // Para filtros por estado
  @@index([userId, status])  // Para filtros combinados
}
```

### 2. Usar ObjectId correctamente
```prisma
// ✅ Correcto
id     String @id @default(auto()) @map("_id") @db.ObjectId
userId String @db.ObjectId

// ❌ Incorrecto
id     Int @id @default(autoincrement())
userId String
```

### 3. Relaciones con onDelete
```prisma
model ChildModel {
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 4. Validación en DTOs
```typescript
// Siempre usar validación en los DTOs
@IsString()
@IsNotEmpty()
name: string;

@IsOptional()
@IsEnum(['active', 'inactive'])
status?: string;
```

### 5. Error Handling en Servicios
```typescript
// Siempre verificar existencia antes de updates/deletes
async update(id: string, userId: string, updateDto: UpdateDto) {
  await this.findOne(id, userId); // Lanza error si no existe
  return this.prisma.model.update({ ... });
}
```

## 🔧 Troubleshooting

### Error: "Can't reach database server"
```bash
# Verificar que MongoDB está corriendo
npm run docker:logs mongodb

# Reiniciar servicios
npm run docker:restart
```

### Error: "Type 'xxx' is not assignable"
```bash
# Regenerar cliente Prisma
cd packages/api
npx prisma generate
```

### Schema out of sync
```bash
# Sincronizar schema con BD
cd packages/api
npx prisma db push
```

## 📚 Referencias

- [Prisma MongoDB Guide](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [tRPC Documentation](https://trpc.io/docs)
- [NestJS Documentation](https://docs.nestjs.com/)

## ⚠️ **Discrepancias con la Implementación Actual**

Aunque esta guía describe las mejores prácticas para el desarrollo de bases de datos con Prisma y MongoDB, se ha identificado una discrepancia clave en la implementación actual del proyecto:

- **Modelos `SystemConfig` y `EnvironmentVariable`**: Los modelos `SystemConfig` y `EnvironmentVariable`, que son fundamentales para el sistema de configuración dinámica y la gestión de variables de entorno descritos en `docs/05-guides/legacy-systems/configuration/dynamic-configuration-system-requirements.md`, **no están presentes** en el `packages/api/prisma/schema.prisma` actual. Esto significa que las funcionalidades de configuración dinámica y gestión de variables de entorno no están implementadas en la base de datos.

Sin embargo, para los modelos existentes (como `User`, `Notification`, `Billing`, etc.), la implementación en `schema.prisma` y su uso en los servicios (ej., `UsersService`) **es coherente** con las mejores prácticas y los patrones de desarrollo de bases de datos descritos en esta guía.
