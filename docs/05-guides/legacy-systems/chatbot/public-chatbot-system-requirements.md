# 💬 Sistema de Chatbot Público - Requisitos y Tickets

## 🎯 **Objetivo**
Crear un sistema de chatbot público que permita a los visitantes del sitio web dejar sus datos de contacto y mensajes, gestionables desde el dashboard interno por empleados y administradores.

## 🎯 **Requisitos Funcionales**

### **R1: Widget de Chatbot Público**
**Priority**: High
**Description**: Implementar un widget de chat flotante en las rutas públicas del sitio web.

**Acceptance Criteria**:
- ❌ Widget flotante visible en esquina inferior derecha (Not Implemented)
- ❌ Diseño responsive y accesible (Not Implemented)
- ❌ Animaciones suaves de entrada/salida (Not Implemented)
- ❌ Personalizable desde configuración del sistema (Not Implemented)
- ❌ Se puede minimizar/maximizar (Not Implemented)
- ❌ Indicador de estado (online/offline) (Not Implemented)

### **R2: Formulario de Contacto Inteligente**
**Priority**: High
**Description**: Formulario progresivo que solicita datos de contacto del usuario.

**Acceptance Criteria**:
- ❌ Solicita email y/o teléfono de forma progresiva (Not Implemented)
- ❌ Validación en tiempo real de email y teléfono (Not Implemented)
- ❌ Campos opcionales configurables desde admin (Not Implemented)
- ❌ Soporte para múltiples idiomas (Not Implemented)
- ❌ Protección anti-spam con rate limiting (Not Implemented)
- ❌ Confirmación visual tras envío exitoso (Not Implemented)

### **R3: Sistema de Mensajería**
**Priority**: High
**Description**: Permitir intercambio de mensajes entre visitantes y equipo interno.

**Acceptance Criteria**:
- ❌ Visitante puede enviar múltiples mensajes (Not Implemented)
- ❌ Sistema identifica visitantes por email/teléfono (Not Implemented)
- ❌ Historial de conversación persistente (Not Implemented)
- ❌ Timestamps en todos los mensajes (Not Implemented)
- ❌ Indicadores de mensaje leído/no leído (Not Implemented)
- ❌ Límite de caracteres por mensaje (Not Implemented)

### **R4: Dashboard de Gestión de Mensajes**
**Priority**: High
**Description**: Interfaz interna para que empleados y administradores gestionen las conversaciones.

**Acceptance Criteria**:
- ❌ Lista de conversaciones ordenada por más reciente (Not Implemented)
- ❌ Filtros por estado (nuevo, en progreso, cerrado) (Not Implemented)
- ❌ Búsqueda por email, teléfono o contenido (Not Implemented)
- ❌ Asignación de conversaciones a empleados específicos (Not Implemented)
- ❌ Marcado de conversaciones como resueltas (Not Implemented)
- ❌ Notas internas no visibles para el cliente (Not Implemented)

### **R5: Notificaciones en Tiempo Real**
**Priority**: Medium
**Description**: Notificar al equipo interno cuando llegan nuevos mensajes.

**Acceptance Criteria**:
- ❌ Notificación in-app cuando llega nuevo mensaje (Not Implemented)
- ❌ Badge de contador en navegación del dashboard (Not Implemented)
- ❌ Email opcional para mensajes importantes (Not Implemented)
- ❌ Integración con sistema de notificaciones existente (Not Implemented)
- ❌ Configuración de preferencias por usuario (Not Implemented)
- ❌ Notificaciones respetan horarios laborales (Not Implemented)

### **R6: Configuración y Personalización**
**Priority**: Medium
**Description**: Permitir personalizar la apariencia y comportamiento del chatbot.

**Acceptance Criteria**:
- ❌ Personalización de colores y textos del widget (Not Implemented)
- ❌ Configuración de campos requeridos/opcionales (Not Implemented)
- ❌ Horarios de atención personalizables (Not Implemented)
- ❌ Mensajes automáticos configurables (Not Implemented)
- ❌ Integración con sistema de configuración dinámico (Not Implemented)
- ❌ Preview en tiempo real de cambios (Not Implemented)

## 🎯 **Requisitos No Funcionales**

### **RNF1: Performance**
- ❌ Widget se carga en < 500ms (Not Implemented)
- ❌ Envío de mensajes responde en < 1 segundo (Not Implemented)
- ❌ Soporte para 100+ conversaciones simultáneas (Not Implemented)
- ❌ Optimización para móviles y desktop (Not Implemented)

### **RNF2: Seguridad**
- ❌ Rate limiting para prevenir spam (Not Implemented)
- ❌ Validación y sanitización de inputs (Not Implemented)
- ❌ Protección contra XSS y injection (Not Implemented)
- ❌ Logs de actividad sospechosa (Not Implemented)

### **RNF3: Usabilidad**
- ❌ Interfaz intuitiva sin necesidad de instrucciones (Not Implemented)
- ❌ Accesibilidad WCAG 2.1 AA (Not Implemented)
- ❌ Soporte multi-idioma (Not Implemented)
- ❌ Funciona sin JavaScript (degradación elegante) (Not Implemented)

### **RNF4: Escalabilidad**
- ❌ Arquitectura preparada para alto tráfico (Not Implemented)
- ❌ Base de datos optimizada para búsquedas (Not Implemented)
- ❌ Cache de conversaciones activas (Not Implemented)
- ❌ Cleanup automático de conversaciones antiguas (Not Implemented)

## 🎫 **Tickets de Desarrollo**

### **TICKET #1: Modelo de Datos para Conversaciones**
**Type**: Feature | **Priority**: High | **Estimation**: 1 day | **Status**: ❌ Not Implemented

**Description**: Crear modelos de base de datos para conversaciones y mensajes del chatbot.

**Technical Tasks**:
- [ ] Crear modelo `Conversation` en Prisma schema
- [ ] Crear modelo `ChatMessage` en Prisma schema
- [ ] Crear modelo `ContactInfo` para datos del visitante
- [ ] Añadir relaciones entre modelos
- [ ] Crear migrations para nuevas tablas
- [ ] Añadir índices para optimizar consultas

**Schema Structure**:
```typescript
// These models are NOT implemented in the current schema.prisma.
model Conversation {
  id            String        @id @default(auto()) @map("_id") @db.ObjectId
  contactInfo   ContactInfo   @relation(fields: [contactInfoId], references: [id])
  contactInfoId String        @db.ObjectId
  assignedTo    User?         @relation(fields: [assignedToId], references: [id])
  assignedToId  String?       @db.ObjectId
  status        ConversationStatus @default(OPEN)
  priority      Priority      @default(NORMAL)
  source        String        @default("website") // website, landing, etc.
  tags          String[]
  internalNotes String?
  lastMessageAt DateTime      @default(now())
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  messages      ChatMessage[]
}

model ChatMessage {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId String       @db.ObjectId
  content        String
  isFromVisitor  Boolean      @default(true)
  senderUser     User?        @relation(fields: [senderUserId], references: [id])
  senderUserId   String?      @db.ObjectId
  isRead         Boolean      @default(false)
  createdAt      DateTime     @default(now())
}

model ContactInfo {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  email         String?
  phone         String?
  name          String?
  company       String?
  source        String?        // UTM, referrer, etc.
  ipAddress     String?
  userAgent     String?
  conversations Conversation[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@unique([email])
  @@unique([phone])
}

enum ConversationStatus {
  OPEN
  IN_PROGRESS
  WAITING_CUSTOMER
  RESOLVED
  CLOSED
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

**Validation Criteria**:
- Modelos se crean correctamente en BD
- Relaciones funcionan apropiadamente
- Índices mejoran performance de consultas

---

### **TICKET #2: API Backend para Chatbot**
**Type**: Feature | **Priority**: High | **Estimation**: 3 days | **Status**: ❌ Not Implemented

**Description**: Implementar servicios y controladores backend para gestionar conversaciones y mensajes.

**Technical Tasks**:
- [ ] Crear `ChatService` para lógica de negocio
- [ ] Crear `ChatController` con endpoints REST
- [ ] Implementar endpoints tRPC para dashboard
- [ ] Añadir validación de datos de entrada
- [ ] Implementar rate limiting anti-spam
- [ ] Crear sistema de assignación automática
- [ ] Añadir logs y métricas

**Endpoints to create**:
```typescript
// These endpoints are NOT implemented in the current backend.
// Public API (REST)
POST /api/chat/start           // Iniciar conversación
POST /api/chat/:id/message     // Enviar mensaje
GET  /api/chat/:id/messages    // Obtener historial

// Internal API (tRPC)
conversations.list()           // Listar conversaciones
conversations.assign()         // Asignar a empleado
conversations.updateStatus()   // Cambiar estado
conversations.addNote()        // Añadir nota interna
messages.markAsRead()          // Marcar como leído
messages.reply()               // Responder mensaje
```

**Validation Criteria**:
- Todos los endpoints funcionan correctamente
- Rate limiting previene spam efectivamente
- Validación protege contra datos maliciosos
- Logs permiten debugging y métricas

---

### **TICKET #3: Widget de Chatbot Frontend**
**Type**: Feature | **Priority**: High | **Estimation**: 4 days | **Status**: ❌ Not Implemented

**Description**: Crear widget de chatbot para mostrar en rutas públicas del sitio web.

**Technical Tasks**:
- [ ] Crear componente `ChatWidget` standalone
- [ ] Implementar formulario progresivo de contacto
- [ ] Añadir interfaz de chat con historial
- [ ] Implementar estados de loading y error
- [ ] Añadir animaciones y micro-interacciones
- [ ] Crear sistema de themes personalizable
- [ ] Optimizar para móviles y desktop

**Components to create**:
```
// These components are NOT implemented in the current frontend.
packages/web/src/components/public/ChatWidget/
├── ChatWidget.tsx              // Componente principal
├── ChatButton.tsx              // Botón flotante
├── ChatWindow.tsx              // Ventana de chat
├── ContactForm.tsx             // Formulario inicial
├── MessageList.tsx             // Lista de mensajes
├── MessageInput.tsx            // Input para mensajes
├── ChatHeader.tsx              // Header con estado
└── hooks/
    ├── useChat.ts              // Hook principal
    ├── useChatWidget.ts        // Estado del widget
    └── useChatMessages.ts      // Gestión de mensajes
```

**Features incluidas**:
- Botón flotante personalizable
- Formulario de contacto progresivo
- Chat interface con historial
- Indicadores de estado online/offline
- Validación en tiempo real
- Soporte multi-idioma
- Animaciones suaves

**Validation Criteria**:
- Widget se muestra correctamente en rutas públicas
- Formulario de contacto funciona sin errores
- Chat interface es intuitiva y responsive
- Animaciones mejoran la experiencia de usuario

---

### **TICKET #4: Dashboard de Gestión de Mensajes**
**Type**: Feature | **Priority**: High | **Estimation**: 4 days | **Status**: ❌ Not Implemented

**Description**: Crear interfaz en el dashboard para que empleados gestionen las conversaciones del chatbot.

**Technical Tasks**:
- [ ] Crear página `/dashboard/messages`
- [ ] Implementar lista de conversaciones con filtros
- [ ] Crear vista detalle de conversación individual
- [ ] Añadir sistema de asignación de conversaciones
- [ ] Implementar respuesta a mensajes
- [ ] Crear sistema de notas internas
- [ ] Añadir estadísticas básicas

**Pages to create**:
```
// These pages are NOT implemented in the current frontend.
packages/web/src/app/[lang]/(private)/dashboard/messages/
├── page.tsx                    // Lista de conversaciones
├── [conversationId]/
│   └── page.tsx               // Detalle de conversación
└── components/
    ├── ConversationList.tsx    // Lista con filtros
    ├── ConversationCard.tsx    // Card individual
    ├── ConversationDetail.tsx  // Vista detalle
    ├── MessageBubble.tsx       // Burbuja de mensaje
    ├── ReplyForm.tsx           // Formulario respuesta
    ├── AssignmentSelect.tsx    // Selector asignación
    ├── StatusSelect.tsx        // Selector estado
    └── InternalNotes.tsx       // Notas internas
```

**Features incluidas**:
- Lista paginada de conversaciones
- Filtros por estado, asignación, fecha
- Búsqueda por email, teléfono, contenido
- Vista detalle con historial completo
- Respuesta directa a mensajes
- Asignación a empleados
- Cambio de estado y prioridad
- Notas internas del equipo
- Estadísticas básicas

**Validation Criteria**:
- Lista muestra conversaciones correctamente
- Filtros y búsqueda funcionan apropiadamente
- Vista detalle es clara e intuitiva
- Respuestas se envían sin errores
- Asignaciones y cambios de estado funcionan

---

### **TICKET #5: Notificaciones en Tiempo Real**
**Type**: Feature | **Priority**: Medium | **Estimation**: 2 days | **Status**: ❌ Not Implemented

**Description**: Integrar sistema de notificaciones para nuevos mensajes del chatbot.

**Technical Tasks**:
- [ ] Integrar con sistema de WebSockets existente
- [ ] Crear eventos para nuevos mensajes de chat
- [ ] Añadir notificaciones in-app para empleados
- [ ] Integrar badge de contador en navegación
- [ ] Crear preferencias de notificación específicas
- [ ] Añadir notificaciones por email opcionales

**Integration points**:
- Reutilizar `NotificationService` existente
- Extender `WebSocketService` para eventos de chat
- Usar componente `NotificationBadge` existente
- Integrar con `NotificationPreferences`

**Events to create**:
```typescript
// These events are NOT implemented.
// Eventos WebSocket
CHAT_NEW_MESSAGE          // Nuevo mensaje de visitante
CHAT_CONVERSATION_ASSIGNED // Conversación asignada a empleado
CHAT_CONVERSATION_UPDATED  // Estado de conversación cambió

// Tipos de notificación
CHAT_NEW_VISITOR_MESSAGE   // Para empleados/admins
CHAT_ASSIGNED_TO_YOU       // Para empleado específico
CHAT_HIGH_PRIORITY         // Para mensajes urgentes
```

**Validation Criteria**:
- Empleados reciben notificaciones de nuevos mensajes
- Badge se actualiza en tiempo real
- Preferencias de notificación se respetan
- Notificaciones por email funcionan opcionalmente

---

### **TICKET #6: Configuración y Personalización**
**Type**: Feature | **Priority**: Medium | **Estimation**: 3 days | **Status**: ❌ Not Implemented

**Description**: Permitir personalizar la apariencia y comportamiento del chatbot desde el dashboard.

**Technical Tasks**:
- [ ] Crear página `/dashboard/settings/chatbot`
- [ ] Implementar configuración de apariencia
- [ ] Añadir configuración de campos requeridos
- [ ] Crear configuración de horarios de atención
- [ ] Implementar mensajes automáticos personalizables
- [ ] Añadir preview en tiempo real
- [ ] Integrar con sistema de configuración dinámico

**Configuration options**:
```typescript
// These configuration options are NOT implemented.
interface ChatbotConfig {
  // Apariencia
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: number;
  position: 'bottom-right' | 'bottom-left';
  
  // Comportamiento
  autoOpen: boolean;
  autoOpenDelay: number;
  offlineMode: boolean;
  
  // Campos de contacto
  requireEmail: boolean;
  requirePhone: boolean;
  requireName: boolean;
  allowAnonymous: boolean;
  
  // Mensajes
  welcomeMessage: string;
  offlineMessage: string;
  thankYouMessage: string;
  
  // Horarios
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: WeeklySchedule;
  };
  
  // Anti-spam
  rateLimitMessages: number;
  rateLimitWindow: number;
  blockSpamKeywords: string[];
}
```

**Validation Criteria**:
- Configuración se guarda y aplica correctamente
- Preview muestra cambios en tiempo real
- Validación previene configuraciones inválidas
- Cambios se reflejan inmediatamente en widget público

---

### **TICKET #7: Analytics y Reportes Básicos**
**Type**: Feature | **Priority**: Low | **Estimation**: 2 days | **Status**: ❌ Not Implemented

**Description**: Implementar métricas básicas y reportes del sistema de chatbot.

**Technical Tasks**:
- [ ] Crear modelo `ChatAnalytics` para métricas
- [ ] Implementar tracking de eventos clave
- [ ] Crear dashboard de métricas básicas
- [ ] Añadir exportación de reportes
- [ ] Implementar alertas para alta actividad
- [ ] Crear gráficos de tendencias

**Metrics to track**:
- Número de conversaciones por día/semana/mes
- Tiempo promedio de respuesta
- Tasa de resolución de conversaciones
- Conversaciones por empleado
- Horarios de mayor actividad
- Fuentes de tráfico (páginas de origen)
- Conversiones (emails/teléfonos capturados)

**Validation Criteria**:
- Métricas se calculan correctamente
- Dashboard muestra información útil
- Reportes son exportables
- Alertas funcionan apropiadamente

## 📊 **Summary of Estimations**

| Priority | Tickets | Total Estimation |
|-----------|---------|------------------|
| High      | 4       | 12 days          |
| Medium    | 2       | 5 days           |
| Low       | 1       | 2 days           |
| **Total** | **7**   | **19 days**      |

## 🚀 **Implementation Plan**

### **Sprint 1 (1 semana)**: Fundación Backend
- TICKET #1: Modelo de Datos
- TICKET #2: API Backend

### **Sprint 2 (1 semana)**: Widget Público
- TICKET #3: Widget de Chatbot Frontend

### **Sprint 3 (1 semana)**: Dashboard Interno
- TICKET #4: Dashboard de Gestión

### **Sprint 4 (1 semana)**: Funcionalidades Avanzadas

- TICKET #5: Notificaciones en Tiempo Real
- TICKET #6: Configuración y Personalización

### **Sprint 5 (opcional)**: Analytics
- TICKET #7: Analytics y Reportes

## 📝 **Dependencies**

```
#1 (Database Model) ← #2 (Backend API) ← #3 (Frontend Widget)
#2 (Backend API) ← #4 (Dashboard) ← #5 (Notifications)
#4 (Dashboard) ← #6 (Configuration)
#2 (Backend API) ← #7 (Analytics)
```

## 🔌 **Integration Points**

### **Sistema de Notificaciones Existente**
- Reutilizar `NotificationService` y `WebSocketService`
- Integrar con badges y preferencias existentes
- Usar templates de email existentes

### **Sistema de Usuarios y Roles**
- Usar guards existentes para acceso al dashboard
- Integrar con roles ADMIN/EMPLOYEE para permisos
- Reutilizar sistema de autenticación actual

### **Sistema de Configuración Dinámico**
- Usar `SystemConfig` para configuraciones del chatbot
- Integrar con panel de configuración general
- Aprovechar feature flags para habilitar/deshabilitar

### **Componentes UI Existentes**
- Reutilizar componentes de `shadcn/ui`
- Usar theme system existente
- Aprovechar sistema de internacionalización