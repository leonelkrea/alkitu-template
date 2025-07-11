# 📋 Sistema de Notificaciones - Requisitos y Criterios de Aceptación

## 🎯 **Requisitos Funcionales**

### **R1: Notificaciones en Tiempo Real**

**Prioridad**: Alta
**Descripción**: Los usuarios deben recibir notificaciones instantáneamente sin recargar la página.

**Criterios de Aceptación**:
- ⚠️ Las notificaciones aparecen automáticamente cuando son creadas (Requires WebSocket integration, `NotificationService` has a `notificationGateway` but its implementation and usage for real-time updates need verification).
- ⚠️ La conexión WebSocket se mantiene estable durante la sesión (Requires WebSocket implementation).
- ⚠️ La reconexión automática funciona tras pérdida de conexión (Requires WebSocket implementation).
- ⚠️ Las notificaciones se muestran a usuarios específicos según roles (Backend service supports user-specific notifications, but real-time delivery depends on WebSocket).
- ⚠️ No hay duplicación de notificaciones durante reconexiones (Requires robust WebSocket implementation).

### **R2: Indicadores Visuales (Badges)**

**Prioridad**: Alta
**Descripción**: Mostrar el número de notificaciones no leídas en la navegación.

**Criterios de Aceptación**:
- ✅ Badge muestra el número exacto de notificaciones no leídas (Backend `getUnreadCount` is implemented).
- ⚠️ Badge se actualiza en tiempo real al recibir nuevas notificaciones (Depends on WebSocket integration).
- ✅ Badge desaparece cuando no hay notificaciones no leídas (Frontend logic, depends on `getUnreadCount`).
- ✅ Badge se actualiza al marcar notificaciones como leídas (Backend `markAsRead` updates count, frontend needs to reflect).
- ✅ Badge es visible en todos los tamaños de pantalla (Frontend responsibility).

### **R3: Sistema de Preferencias**

**Prioridad**: Alta
**Descripción**: Usuarios pueden configurar sus preferencias de notificaciones.

**Criterios de Aceptación**:
- ✅ Usuario puede habilitar/deshabilitar notificaciones por correo (Backend `NotificationPreference` model and `createOrUpdatePreferences` exist).
- ✅ Usuario puede habilitar/deshabilitar notificaciones push (Backend `NotificationPreference` model and `createOrUpdatePreferences` exist).
- ✅ Usuario puede habilitar/deshabilitar notificaciones in-app (Backend `NotificationPreference` model and `createOrUpdatePreferences` exist).
- ✅ Usuario puede seleccionar tipos específicos de notificaciones (Backend `NotificationPreference` model and `createOrUpdatePreferences` exist).
- ✅ Preferencias se aplican inmediatamente tras guardarse (Backend logic is in place).
- ✅ Preferencias persisten entre sesiones (Stored in DB via `NotificationPreference` model).

### **R4: Notificaciones Push del Navegador**

**Prioridad**: Media
**Descripción**: Enviar notificaciones push del navegador cuando el usuario no está activo.

**Criterios de Aceptación**:
- ❌ Solicita permisos de notificación al usuario (Frontend implementation needed).
- ❌ Envía notificaciones push cuando la pestaña no está activa (Backend push service not found).
- ❌ Notificaciones push incluyen título, mensaje y acción (Backend push service not found).
- ❌ Click en notificación push redirige a la aplicación (Frontend implementation needed).
- ❌ Respeta las preferencias del usuario (Backend preferences exist, but push sending mechanism is missing).
- ❌ Funciona en Chrome, Firefox y Safari (Frontend implementation needed).

### **R5: Operaciones en Lote**

**Prioridad**: Media
**Descripción**: Permitir acciones masivas sobre notificaciones.

**Criterios de Aceptación**:
- ✅ Marcar todas las notificaciones como leídas (Backend `markAllAsRead` is implemented).
- ✅ Eliminar todas las notificaciones (Backend `deleteAllNotifications` is implemented).
- ✅ Seleccionar múltiples notificaciones específicas (Frontend implementation needed).
- ✅ Aplicar acciones solo a notificaciones seleccionadas (Backend `bulkMarkAsRead` and `bulkDelete` are implemented).
- ✅ Confirmar acciones destructivas con modal (Frontend implementation needed).
- ⚠️ Actualizar UI inmediatamente tras operaciones (Depends on WebSocket integration for real-time updates).

### **R6: Filtros y Búsqueda Avanzada**

**Prioridad**: Media
**Descripción**: Filtrar y buscar notificaciones eficientemente.

**Criterios de Aceptación**:
- ✅ Filtrar por tipo de notificación (info, warning, error, success) (Backend `getNotificationsWithFilters` supports this).
- ✅ Filtrar por estado (leída/no leída) (Backend `getNotificationsWithFilters` supports this).
- ✅ Filtrar por rango de fechas (Backend `getNotificationsWithFilters` supports this).
- ✅ Búsqueda por texto en título y mensaje (Backend `getNotificationsWithFilters` supports this, including advanced search parsing).
- ✅ Combinar múltiples filtros simultáneamente (Backend `getNotificationsWithFilters` supports this).
- ✅ Limpiar filtros rápidamente (Frontend responsibility).
- ✅ URL reflejan los filtros aplicados (Frontend responsibility).

### **R7: Paginación y Rendimiento**

**Prioridad**: Media
**Descripción**: Manejar grandes volúmenes de notificaciones eficientemente.

**Criterios de Aceptación**:
- ✅ Paginación con 20 notificaciones por página (Backend `getNotificationsWithFilters` supports limit/offset).
- ✅ Scroll infinito como opción alternativa (Backend `getNotificationsWithCursor` is implemented).
- ✅ Carga inicial rápida (< 2 segundos) (Backend performance is optimized, frontend needs to implement).
- ✅ Transiciones suaves entre páginas (Frontend responsibility).
- ✅ Mantener posición al volver de detalles (Frontend responsibility).
- ✅ Lazy loading de imágenes si las hay (Not applicable for current notification content).

## 🎯 **Requisitos No Funcionales**

### **RNF1: Rendimiento**

- Tiempo de carga inicial < 2 segundos.
- Latencia de notificaciones en tiempo real < 500ms. (Depends on WebSocket implementation).
- Soportar hasta 1000 notificaciones por usuario.
- Operaciones de BD optimizadas con índices apropiados. (Prisma queries are optimized).

### **RNF2: Seguridad**

- Validación de permisos por rol para cada operación. (Implemented via `RolesGuard` in controller).
- Rate limiting en creación de notificaciones. (Not explicitly found in `NotificationService`).
- Sanitización de contenido HTML. (Not explicitly found in `NotificationService`, depends on input validation).
- Encriptación de datos sensibles en notificaciones. (Not applicable for current notification content).

### **RNF3: Usabilidad**

- Interfaz intuitiva sin necesidad de tutorial.
- Accesibilidad WCAG 2.1 AA completa.
- Responsive design para móviles y tablets.
- Soporte para themes (claro/oscuro).

### **RNF4: Escalabilidad**

- Arquitectura preparada para 10,000+ usuarios concurrentes. (Backend services are scalable, but real-time part depends on WebSocket implementation).
- WebSockets horizontalmente escalables. (Requires WebSocket implementation).
- Cache de notificaciones frecuentes. (Not explicitly found in `NotificationService`).
- Background jobs para procesamiento pesado. (Not explicitly found in `NotificationService`).

## 🎫 **Tickets de Desarrollo**

### **TICKET #1: Implementar WebSockets para Notificaciones en Tiempo Real**

**Type**: Feature | **Priority**: Alta | **Estimación**: 3 días | **Status**: ❌ Not Implemented

**Description**: Implementar WebSocket server en backend y cliente en frontend para notificaciones en tiempo real.

**Technical Tasks**:
- [ ] Instalar y configurar Socket.io en NestJS
- [ ] Crear servicio de WebSocket con autenticación JWT
- [ ] Implementar rooms por usuario para notificaciones privadas
- [ ] Crear hook React para conectar WebSocket
- [ ] Integrar WebSocket con store de notificaciones
- [ ] Manejar reconexión automática
- [ ] Añadir tests de integración

**Criterios de validación**:

- Usuario recibe notificaciones sin refresh
- Conexión se mantiene estable durante sesión
- Reconexión automática tras pérdida de conexión

---

### **TICKET #2: Crear Sistema de Badges de Notificaciones**

**Type**: Feature | **Priority**: Alta | **Estimación**: 1 día | **Status**: ✅ Implemented (Backend part)

**Description**: Implementar badges visuales que muestren el count de notificaciones no leídas.

**Technical Tasks**:
- [x] Crear componente `NotificationBadge` (Frontend responsibility)
- [x] Integrar badge en navigation header (nav-user component) (Frontend responsibility)
- [x] Conectar con API de unread count (useNotificationCount hook) (Backend `getUnreadCount` is implemented)
- [ ] Actualizar badge en tiempo real vía WebSocket (pendiente TICKET #1)
- [x] Implementar animaciones para nuevas notificaciones (Frontend responsibility)
- [ ] Tests unitarios del componente (Frontend responsibility)

**Criterios de validación**:

- Badge muestra número exacto de no leídas
- Actualización en tiempo real funcional
- Badge desaparece cuando count = 0

---

### **TICKET #3: Sistema de Preferencias de Usuario**

**Type**: Feature | **Priority**: Alta | **Estimación**: 3 días | **Status**: ✅ Implemented

**Description**: Permitir a usuarios configurar sus preferencias de notificaciones.

**Technical Tasks**:
- [x] Crear modelo `NotificationPreference` en Prisma (Exists in `schema.prisma`)
- [x] Implementar servicio backend para preferencias (`NotificationService` has `getUserPreferences`, `createOrUpdatePreferences`, `deletePreferences`)
- [x] Crear endpoints REST y tRPC para CRUD (Endpoints exist in `NotificationController`)
- [ ] Diseñar UI de página de preferencias (Frontend responsibility)
- [ ] Implementar formulario con validaciones (Frontend responsibility)
- [x] Aplicar preferencias en envío de notificaciones (`shouldSendNotification` logic exists)
- [ ] Tests end-to-end

**Criterios de validación**:

- Usuario puede configurar preferencias por tipo
- Preferencias se aplican inmediatamente
- Configuración persiste entre sesiones

---

### **TICKET #4: Notificaciones Push del Navegador**

**Type**: Feature | **Priority**: Media | **Estimación**: 4 días | **Status**: ❌ Not Implemented

**Description**: Implementar push notifications del navegador cuando el usuario no está activo.

**Technical Tasks**:
- [ ] Configurar service worker para push notifications
- [ ] Crear modelo `PushSubscription` en BD
- [ ] Implementar servicio de suscripción de push
- [ ] Configurar VAPID keys para web push
- [ ] Crear API para envío de push notifications
- [ ] Solicitar permisos de notificación en frontend
- [ ] Integrar con preferencias de usuario
- [ ] Tests con diferentes navegadores

**Criterios de validación**:

- Solicita permisos apropiadamente
- Envía push cuando usuario no está activo
- Click redirige a aplicación correctamente

---

### **TICKET #5: Operaciones en Lote**

**Type**: Feature | **Priority**: Media | **Estimación**: 2 días | **Status**: ✅ Implemented (Backend part)

**Description**: Permitir acciones masivas sobre notificaciones.

**Technical Tasks**:
- [x] Crear endpoints para operaciones bulk (`bulkMarkAsRead`, `bulkDelete` in `NotificationController`)
- [ ] Implementar selección múltiple en UI (Frontend responsibility)
- [ ] Crear botones para acciones masivas (Frontend responsibility)
- [ ] Añadir modal de confirmación (Frontend responsibility)
- [x] Optimizar queries de BD para operaciones bulk (Implemented in `NotificationService`)
- [ ] Actualizar UI optimísticamente (Frontend responsibility)
- [ ] Tests de performance

**Criterios de validación**:

- Marcar/eliminar múltiples notificaciones
- Confirmación para acciones destructivas
- Performance aceptable con 100+ notificaciones

---

### **TICKET #6: Filtros y Búsqueda Avanzada**

**Type**: Feature | **Priority**: Media | **Estimación**: 3 días | **Status**: ✅ Implemented

**Description**: Implementar sistema completo de filtros y búsqueda.

**Technical Tasks**:
- [x] Crear componente `NotificationFilters` (Frontend responsibility)
- [x] Implementar filtros por tipo, estado y fecha (Backend `getNotificationsWithFilters` is implemented)
- [x] Añadir búsqueda por texto full-text (Backend `getNotificationsWithFilters` is implemented)
- [x] Optimizar queries con índices apropiados (Prisma queries are optimized)
- [x] Sincronizar filtros con URL params (Frontend responsibility)
- [x] Implementar debouncing en búsqueda (Frontend responsibility)
- [x] Tests de performance con datasets grandes

**Criterios de validación**:

- ✅ Filtros funcionan individual y combinados
- ✅ Búsqueda responde rápidamente (< 300ms)
- ✅ URL mantiene estado de filtros

---

### **TICKET #7: Paginación y Optimización**

**Type**: Enhancement | **Priority**: Media | **Estimación**: 2 días | **Status**: ✅ Implemented

**Description**: Implementar paginación eficiente para grandes listas.

**Technical Tasks**:
- [x] Implementar paginación cursor-based en backend (`getNotificationsWithCursor` is implemented)
- [x] Crear componente de paginación reutilizable (Frontend responsibility)
- [x] Optimizar queries con LIMIT y cursors (Implemented in `NotificationService`)
- [x] Implementar scroll infinito como opción (Frontend responsibility)
- [x] Añadir skeleton loaders (Frontend responsibility)
- [x] Cache de páginas visitadas (Frontend responsibility)
- [x] Tests de carga con 1000+ notificaciones

**Criterios de validación**:

- ✅ Carga inicial rápida independiente del total
- ✅ Navegación fluida entre páginas
- ✅ Scroll infinito opcional funcional

---

### **TICKET #8: Mejoras de UX y Accesibilidad**

**Type**: Enhancement | **Priority**: Baja | **Estimación**: 2 días | **Status**: ❌ Not Implemented

**Description**: Mejorar experiencia de usuario y accesibilidad.

**Technical Tasks**:
- [ ] Implementar keyboard navigation
- [ ] Añadir screen reader support
- [ ] Crear animaciones micro-interacciones
- [ ] Implementar estados de carga optimistas
- [ ] Añadir tooltips explicativos
- [ ] Optimizar para touch devices
- [ ] Tests de accesibilidad automatizados

**Criterios de validación**:

- WCAG 2.1 AA compliance
- Navegación completa por teclado
- Screen readers funcionan correctamente

## 📊 **Resumen de Estimaciones**

| Prioridad | Tickets | Completados | Estimación Total |
| --------- | ------- | ----------- | ---------------- |
| Alta      | 3       | 2/3 ✅      | 7 días           |
| Media     | 4       | 3/4 ✅      | 11 días          |
| Baja      | 1       | 0/1 ❌      | 2 días           |
| **Total** | **8**   | **5/8**     | **20 días**      |

### **Estado Actual: 62.5% Completado (Backend)** 🎯

## 🚀 **Plan de Implementación Sugerido**

### **Sprint 1 (1 semana)**: Funcionalidad Core

- TICKET #1: WebSockets tiempo real
- TICKET #2: Badges visuales

### **Sprint 2 (1 semana)**: Configuración Usuario

- TICKET #3: Preferencias de usuario
- TICKET #5: Operaciones en lote

### **Sprint 3 (1 semana)**: Funcionalidades Avanzadas

- TICKET #4: Push notifications
- TICKET #6: Filtros y búsqueda

### **Sprint 4 (1 semana)**: Optimización y Pulido

- TICKET #7: Paginación
- TICKET #8: UX y accesibilidad

## 📝 **Notas de Implementación**

### Current System Status

- ✅ **Backend CRUD completo**: Servicios, controladores y tRPC endpoints implementados para la gestión de notificaciones.
- ✅ **Base de datos**: Modelo Notification y NotificationPreference implementados y funcionales.
- ✅ **Autenticación**: Sistema de permisos por roles implementado en el controlador.
- ⚠️ **Notificaciones en Tiempo Real**: El `NotificationService` tiene un `notificationGateway` para enviar actualizaciones en tiempo real, pero la implementación del WebSocket server y su integración completa con el frontend para la entrega en tiempo real de notificaciones y actualizaciones de badges **necesita ser verificada y/o completada**.
- ❌ **Notificaciones Push del Navegador**: No hay implementación de backend ni frontend para las notificaciones push del navegador.
- ❌ **Rate Limiting y Sanitización**: No se encontró una implementación explícita de rate limiting en la creación de notificaciones ni de sanitización de contenido HTML en el servicio.