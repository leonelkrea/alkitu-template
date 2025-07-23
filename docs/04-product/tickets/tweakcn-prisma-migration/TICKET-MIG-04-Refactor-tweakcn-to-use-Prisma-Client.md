### TICKET-MIG-04: Refactorizar `tweakcn` para usar el Cliente de Prisma

**Descripción:**
Actualizar todo el código en `packages/tweakcn` que actualmente interactúa con Drizzle ORM para que utilice el Cliente de Prisma. Esto incluye la creación de una instancia singleton del cliente de Prisma y la refactorización de todas las consultas a la base de datos.

**Tareas:**
- [ ] Crear un archivo `lib/prisma.ts` en `packages/tweakcn` para exportar una instancia singleton del Cliente de Prisma.
- [ ] Identificar todos los archivos en `packages/tweakcn` que importan y utilizan Drizzle.
- [ ] Reemplazar las operaciones de base de datos de Drizzle con las equivalentes de Prisma (e.g., `db.select().from(...)` a `prisma.model.findMany(...)`).
- [ ] Asegurar que todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) estén correctamente implementadas con Prisma.
- [ ] Eliminar cualquier código o importación relacionada con Drizzle que ya no sea necesaria.
