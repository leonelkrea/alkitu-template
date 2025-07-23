### Plan de Implementación Revisado: `tweakcn` como un Theme Builder con Prisma

#### Resumen del Objetivo

El proyecto `tweakcn` será refactorizado para reemplazar Drizzle ORM con Prisma (usando MongoDB). Se convertirá en un microfrontend que consume y se comunica con la `api` principal del monorepo. Esto permitirá una gestión de datos centralizada y la capacidad de asociar personalizaciones de temas de `tweakcn` con entidades de usuario en la `api`, además de soportar un Theme Builder granular basado en Atomic Design con lógica de anulación jerárquica.

---

### Fases del Proyecto

**Fase 1: Migración y Fundación (Prisma)**

1.  **Eliminar Drizzle:** Desinstalar `drizzle-orm`, `drizzle-kit` y eliminar todos los archivos de configuración y migraciones relacionados de `packages/tweakcn`.
2.  **Instalar e Inicializar Prisma:** Configurar Prisma y `@prisma/client` en `packages/tweakcn`. Inicializar un nuevo `schema.prisma`.

**Fase 2: Diseño del Esquema de Datos para el Theme Builder**

1.  **Definir Modelos en `schema.prisma`:** El esquema debe ser capaz de almacenar configuraciones de temas complejas y jerárquicas. Usaremos campos JSON para esto. La `api` gestionará al `User`, y `tweakcn` gestionará el `Theme`.
    *   **Modelo `Theme`:** Almacenará el nombre del tema y dos objetos JSON: uno para el modo claro y otro para el oscuro. Cada objeto contendrá la estructura de Atomic Design (átomos, moléculas, organismos) con sus personalizaciones.
    *   **Relación:** El `User` en la `api` tendrá una relación con el `Theme` para saber qué tema aplicar.

2.  **Generar Migración:** Crear y aplicar la migración de la base de datos con este nuevo esquema.

**Fase 3: Refactorización de la Lógica de Acceso a Datos**

1.  **Reemplazar Lógica de Drizzle:** Actualizar todo el código de `tweakcn` para que use el Cliente de Prisma para leer y escribir las configuraciones de temas en la base de datos.

**Fase 4: Integración con la API Principal**

1.  **Crear Endpoints en la `api`:**
    *   `GET /api/users/me/theme`: Para que `tweakcn` obtenga la configuración del tema del usuario autenticado.
    *   `POST /api/users/me/theme`: Para que `tweakcn` guarde o actualice la configuración del tema del usuario.
2.  **Asegurar Comunicación:** La comunicación se protegerá mediante el sistema de autenticación existente.

**Fase 5: Implementación del Theme Builder (UI)**

1.  **Librería de Componentes:** Desarrollar la interfaz de usuario en `tweakcn` que muestre la lista de componentes (Átomos, Moléculas, Organismos) en un sidebar.
2.  **Panel de Personalización:** Crear los controles (selectores de color, inputs, etc.) para modificar los estilos de cada componente.
3.  **Lógica de Anulación:** Implementar la lógica de renderizado que aplique los estilos jerárquicamente: Estilo Base -> Estilo de Átomo -> Estilo de Molécula -> Estilo de Organismo.
4.  **Soporte Dark/Light:** Asegurar que la UI permita cambiar y configurar los modos claro y oscuro de forma independiente.

**Fase 6: Documentación y Tickets**

1.  **Actualizar Documentación:** Crear un `README.md` detallado para el nuevo sistema.
2.  **Crear Tickets:** Generar tickets para cada fase y tarea.

---

### Tickets

*   `TICKET-MIG-01-Remove-Drizzle-and-Install-Prisma.md`
*   `TICKET-MIG-02-Design-and-Migrate-Theme-Builder-Schema.md`
*   `TICKET-MIG-03-Create-API-Endpoints-for-Theme-Management.md`
*   `TICKET-MIG-04-Refactor-tweakcn-to-use-Prisma-Client.md`
*   `TICKET-UI-01-Build-Atomic-Design-Component-Library-UI.md`
*   `TICKET-UI-02-Implement-Hierarchical-Style-Override-Logic.md`
