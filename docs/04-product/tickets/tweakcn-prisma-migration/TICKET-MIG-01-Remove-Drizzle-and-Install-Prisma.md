### TICKET-MIG-01: Eliminar Drizzle e Instalar Prisma

**Descripción:**
Desinstalar todas las dependencias de Drizzle ORM de `packages/tweakcn` y eliminar los archivos de configuración y migraciones asociados. Luego, instalar Prisma y `@prisma/client` e inicializar Prisma en el proyecto.

**Tareas:**
- [ ] Desinstalar `drizzle-orm` y `drizzle-kit` de `packages/tweakcn/package.json`.
- [ ] Eliminar `drizzle.config.ts`.
- [ ] Eliminar el directorio `drizzle/`.
- [ ] Ejecutar `npm install` en `packages/tweakcn`.
- [ ] Instalar `prisma` como `devDependency` y `@prisma/client` como `dependency` en `packages/tweakcn`.
- [ ] Ejecutar `npx prisma init` en `packages/tweakcn`.
