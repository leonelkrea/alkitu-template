### TICKET-MIG-02: Diseñar y Migrar el Esquema del Theme Builder

**Descripción:**
Definir el esquema de la base de datos en `packages/tweakcn/prisma/schema.prisma` para soportar el Theme Builder, incluyendo los modelos `User` y `Theme` con campos JSON para configuraciones de modo claro y oscuro, y la lógica de Atomic Design. Luego, generar el cliente de Prisma y sincronizar el esquema con la base de datos MongoDB.

**Tareas:**
- [ ] Actualizar `packages/tweakcn/prisma/schema.prisma` con los modelos `User` y `Theme`.
  - `User` con `id`, `email`, `name` y relación con `Theme`.
  - `Theme` con `id`, `name`, `userId`, `lightModeConfig` (JSON), `darkModeConfig` (JSON).
  - Asegurarse de que los `id` de MongoDB usen `@map("_id")` y `@default(auto()) @db.ObjectId`.
- [ ] Ejecutar `npx prisma generate` en `packages/tweakcn`.
- [ ] Ejecutar `npx prisma db push` en `packages/tweakcn` para sincronizar el esquema con la base de datos.
