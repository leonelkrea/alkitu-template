### TICKET-MIG-03: Crear Endpoints de API para la Gestión de Temas

**Descripción:**
Desarrollar los endpoints necesarios en el paquete `api` para permitir que `tweakcn` obtenga y guarde la configuración de temas de los usuarios. Estos endpoints deben estar protegidos por el sistema de autenticación existente.

**Tareas:**
- [ ] Definir y crear un nuevo módulo o controlador en `packages/api` para la gestión de temas de usuario.
- [ ] Implementar el endpoint `GET /api/users/me/theme` para recuperar la configuración del tema del usuario autenticado.
- [ ] Implementar el endpoint `POST /api/users/me/theme` para guardar o actualizar la configuración del tema del usuario autenticado.
- [ ] Asegurar que los endpoints utilicen el middleware de autenticación existente.
- [ ] Validar los datos de entrada para el endpoint `POST` para asegurar la integridad de la configuración del tema.
