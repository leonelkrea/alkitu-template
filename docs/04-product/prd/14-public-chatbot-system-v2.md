# 💬 Public Chatbot System PRD (v2.0)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El Sistema de Chatbot Público es una solución integral de **captura de leads, soporte al cliente y comunicación en tiempo real** que permite a los visitantes del sitio web interactuar con el negocio a través de un widget de chat flotante. La gestión de estas conversaciones se realiza desde un dashboard administrativo robusto, diseñado para empleados y administradores.

### **🔗 Conexión con la Arquitectura SOLID Actual**

Este módulo se integra y se beneficia directamente de la arquitectura SOLID implementada en el backend, utilizando:

-   **Interface Segregation Principle (ISP)**: A través de interfaces específicas para los servicios de chat y sus repositorios.
-   **Dependency Inversion Principle (DIP)**: Mediante la inyección de dependencias de los servicios y repositorios de chat.
-   **Single Responsibility Principle (SRP)**: Con servicios y componentes enfocados en una única responsabilidad.
-   **Open/Closed Principle (OCP)**: Permitiendo la extensión de funcionalidades sin modificar el código existente (ej. nuevos tipos de mensajes, integraciones).

### **Objetivos Comerciales**

-   **Generación de Leads**: Capturar información de contacto de prospectos directamente desde el sitio web, aumentando la base de datos de leads calificados.
-   **Soporte al Cliente Inmediato**: Proporcionar un canal de comunicación en tiempo real para resolver dudas y ofrecer asistencia, mejorando la satisfacción del usuario.
-   **Aumento de Conversiones**: Facilitar la interacción directa con los visitantes, lo que se espera que incremente las tasas de conversión en un 30%.
-   **Eficiencia Operacional**: Reducir el volumen de tickets de soporte tradicionales y optimizar el tiempo del equipo mediante la gestión centralizada de conversaciones.
-   **Ventaja Competitiva**: Ofrecer una experiencia de usuario moderna y eficiente, diferenciando el producto en el mercado.

### **Metas Técnicas**

-   **Comunicación en Tiempo Real**: Implementar un sistema de chat basado en WebSockets (Socket.IO) para una interacción fluida y sin demoras.
-   **Captura de Leads Inteligente**: Desarrollar formularios progresivos y configurables para la recolección de datos de contacto.
-   **Escalabilidad**: Diseñar el sistema para soportar un alto volumen de conversaciones concurrentes (100+ conversaciones simultáneas) sin degradación del rendimiento.
-   **Gestión Administrativa Completa**: Proporcionar un dashboard intuitivo para la gestión de conversaciones, asignación de agentes, seguimiento de estados y notas internas.
-   **Integración Transparente**: Asegurar una integración fluida con los módulos existentes de Notificaciones, Usuarios y Roles, y el sistema de Feature Flags.

---

## ✨ 2. Características

### **2.1. Widget de Chat Público (Frontend)**

Un widget flotante y personalizable que se integra en cualquier página del sitio web.

-   **Visibilidad**: Widget flotante en la esquina inferior derecha de las páginas públicas.
-   **Formulario de Contacto**: Formulario inicial configurable para capturar email, nombre, teléfono, empresa y mensaje inicial.
-   **Mensajería en Tiempo Real**: Interfaz de chat para el intercambio de mensajes bidireccional.
-   **Historial de Conversación**: Persistencia del historial de mensajes para el visitante (basado en cookies/local storage o ID de conversación).
-   **Indicadores de Estado**: Muestra el estado del chat (online/offline) y el estado de escritura del agente.
-   **Personalización**: Opciones para configurar colores, textos y posición del widget.
-   **Diseño Responsivo**: Adaptación automática a diferentes tamaños de pantalla (móvil, tablet, desktop).

### **2.2. Dashboard de Gestión de Conversaciones (Frontend & Backend)**

Una interfaz administrativa para que el equipo gestione las interacciones del chatbot.

-   **Lista de Conversaciones**: Vista paginada y filtrable de todas las conversaciones (por estado, agente asignado, prioridad, fecha).
-   **Búsqueda**: Funcionalidad de búsqueda por email, nombre, teléfono o contenido del mensaje.
-   **Vista Detalle de Conversación**: Interfaz para ver el historial completo de una conversación y responder a los mensajes.
-   **Asignación de Agentes**: Capacidad de asignar conversaciones a miembros específicos del equipo.
-   **Gestión de Estado**: Cambiar el estado de la conversación (Abierta, En Progreso, Esperando Cliente, Resuelta, Cerrada).
-   **Notas Internas**: Añadir notas privadas a las conversaciones, visibles solo para el equipo interno.
-   **Priorización**: Asignar niveles de prioridad a las conversaciones (Baja, Normal, Alta, Urgente).

### **2.3. Notificaciones en Tiempo Real (Backend & Frontend)**

Alertas para el equipo interno sobre nuevas interacciones.

-   **Notificaciones In-App**: Alertas dentro del dashboard para nuevos mensajes o conversaciones.
-   **Contador de Notificaciones**: Badge numérico en la navegación del dashboard.
-   **Notificaciones por Email**: Opcional, para mensajes o conversaciones de alta prioridad.
-   **Preferencias de Notificación**: Configuración por usuario para tipos y frecuencia de notificaciones.

### **2.4. Configuración del Chatbot (Backend & Frontend)**

Panel para personalizar el comportamiento y la apariencia del chatbot.

-   **Apariencia**: Configuración de colores, fuentes, logo y textos del widget.
-   **Campos del Formulario**: Definir qué campos son requeridos u opcionales en el formulario de contacto.
-   **Horarios de Atención**: Establecer horarios de operación del chatbot, con mensajes automáticos fuera de horario.
-   **Mensajes Automáticos**: Personalizar mensajes de bienvenida, fuera de horario y de agradecimiento.
-   **Integración con Feature Flags**: Controlar la disponibilidad de funcionalidades según el plan de suscripción (Free, Professional, Enterprise).

### **2.5. Analíticas Básicas (Backend & Frontend)**

Métricas clave para evaluar el rendimiento del chatbot.

-   **Métricas de Conversación**: Número de conversaciones iniciadas, resueltas, tiempo promedio de respuesta.
-   **Métricas de Lead**: Cantidad de leads capturados, desglose por fuente.
-   **Dashboard de Analíticas**: Vista resumida de las métricas en el dashboard administrativo.

---

## 🛠️ 3. Requisitos Técnicos

### **3.1. Tech Stack**

-   **Backend**: NestJS (TypeScript), Prisma ORM (MongoDB), tRPC, Socket.IO.
-   **Frontend**: Next.js (App Router), React, TypeScript, shadcn/ui, Tailwind CSS, React Query, Zustand, Socket.IO Client.

### **3.2. Database Schema (Prisma + MongoDB)**

Los modelos ya han sido definidos y aplicados en `packages/api/prisma/schema.prisma`:

-   `Conversation`: Representa una conversación de chat.
-   `ChatMessage`: Representa un mensaje dentro de una conversación.
-   `ContactInfo`: Almacena la información de contacto del visitante.

### **3.3. API Endpoints (tRPC)**

El sistema de chat expondrá los siguientes procedimientos tRPC:

#### **API Pública (para el Widget de Chat)**

-   `chat.startConversation(input: StartConversationDto)`: Inicia una nueva conversación y captura la información de contacto.
-   `chat.sendMessage(input: SendMessageDto)`: Envía un mensaje a una conversación existente.
-   `chat.getMessages(input: GetMessagesDto)`: Recupera el historial de mensajes de una conversación.

#### **API Protegida (para el Dashboard Administrativo)**

-   `chat.getConversations(input: GetConversationsDto)`: Lista y filtra conversaciones.
-   `chat.assignConversation(input: AssignConversationDto)`: Asigna una conversación a un agente.
-   `chat.updateStatus(input: UpdateStatusDto)`: Actualiza el estado de una conversación.
-   `chat.replyToMessage(input: ReplyToMessageDto)`: Permite a un agente responder a un mensaje.
-   `chat.addInternalNote(input: AddInternalNoteDto)`: Añade una nota interna a una conversación.
-   `chat.markAsRead(input: MarkAsReadDto)`: Marca mensajes o conversaciones como leídos.
-   `chat.getUserStats()`: Obtiene estadísticas de usuarios (ya implementado en `users` module, se podría extender o integrar).

### **3.4. Backend Services (NestJS)**

-   `ChatService`: Contiene la lógica de negocio principal para la gestión de conversaciones y mensajes.
-   `ConversationRepository`: Abstracción para la interacción con el modelo `Conversation` en Prisma.
-   `MessageRepository`: Abstracción para la interacción con el modelo `ChatMessage` en Prisma.
-   `ContactInfoRepository`: Abstracción para la interacción con el modelo `ContactInfo` en Prisma.
-   `ChatGateway`: Maneja la comunicación en tiempo real a través de Socket.IO.

### **3.5. Frontend Components (Next.js)**

#### **Widget de Chat Público**

-   `packages/web/src/components/public/ChatWidget/ChatWidget.tsx` (Componente principal)
-   `packages/web/src/components/public/ChatWidget/ContactForm.tsx` (Formulario inicial)
-   `packages/web/src/components/public/ChatWidget/ChatInterface.tsx` (Interfaz de mensajes)
-   `packages/web/src/components/public/ChatWidget/hooks/useChat.ts` (Hook para la lógica del chat)

#### **Dashboard Administrativo**

-   `packages/web/src/app/dashboard/chat/page.tsx` (Página principal del dashboard de chat)
-   `packages/web/src/components/chat/ConversationList.tsx` (Lista de conversaciones con filtros y búsqueda)
-   `packages/web/src/components/chat/ConversationDetail.tsx` (Vista de detalle de conversación)
-   `packages/web/src/components/chat/MessageBubble.tsx` (Componente para mostrar mensajes individuales)
-   `packages/web/src/components/chat/ReplyForm.tsx` (Formulario para responder mensajes)
-   `packages/web/src/components/chat/AssignmentSelect.tsx` (Selector para asignar conversaciones)
-   `packages/web/src/components/chat/StatusSelect.tsx` (Selector para cambiar el estado de la conversación)
-   `packages/web/src/components/chat/InternalNotes.tsx` (Componente para notas internas)
-   `packages/web/src/components/chat/ChatAnalyticsDashboard.tsx` (Dashboard de analíticas)

### **3.6. Comunicación en Tiempo Real**

-   **Backend**: `ChatGateway` utilizando `@nestjs/platform-socket.io` para emitir eventos a los clientes.
-   **Frontend**: `socket.io-client` en el hook `useChat` para escuchar eventos de nuevos mensajes y actualizaciones de estado.

---

## 🎯 4. Criterios de Aceptación

### **4.1. Funcionales**

-   [ ] El widget de chat flotante es visible y funcional en todas las páginas públicas.
-   [ ] Los visitantes pueden iniciar una conversación proporcionando su información de contacto (email, nombre, mensaje).
-   [ ] Los mensajes se envían y reciben en tiempo real entre el visitante y el agente.
-   [ ] El historial de conversación se mantiene y es accesible para el visitante y el agente.
-   [ ] El dashboard administrativo muestra una lista completa de conversaciones con opciones de filtrado y búsqueda.
-   [ ] Los agentes pueden ver el detalle de una conversación, responder mensajes, asignar la conversación y cambiar su estado.
-   [ ] Los agentes pueden añadir notas internas a las conversaciones.
-   [ ] El sistema de notificaciones alerta a los agentes sobre nuevos mensajes o conversaciones.
-   [ ] La configuración del chatbot (apariencia, campos, mensajes) se puede gestionar desde el dashboard.
-   [ ] Se muestran métricas básicas de rendimiento del chatbot en el dashboard.

### **4.2. No Funcionales**

-   [ ] **Rendimiento**: El widget de chat se carga en menos de 500ms. Los mensajes se envían y reciben en menos de 1 segundo. El sistema soporta al menos 100 conversaciones concurrentes.
-   [ ] **Seguridad**: Implementación de validación de entrada, sanitización y protección contra ataques comunes (XSS, inyección). Uso de autenticación y autorización para el dashboard administrativo.
-   [ ] **Usabilidad**: Interfaz intuitiva y fácil de usar para visitantes y agentes. Diseño responsivo para todos los dispositivos.
-   [ ] **Escalabilidad**: La arquitectura backend y la base de datos están diseñadas para manejar un crecimiento futuro en el volumen de conversaciones.
-   [ ] **Observabilidad**: Logs adecuados para depuración y monitoreo. Métricas disponibles para análisis.

---

## 💰 5. Valor de Negocio y ROI

-   **Aumento de Leads**: Se espera un incremento del 30% en la captura de leads calificados directamente desde el sitio web.
-   **Mejora en la Satisfacción del Cliente**: Proporcionar soporte inmediato y personalizado reduce los tiempos de espera y mejora la experiencia del usuario.
-   **Reducción de Costos de Soporte**: La eficiencia en la gestión de conversaciones y la automatización de respuestas básicas pueden reducir el volumen de tickets de soporte.
-   **Aceleración de Ventas**: La comunicación directa con prospectos permite al equipo de ventas intervenir rápidamente y cerrar más negocios.
-   **Análisis de Datos**: Las métricas de conversación y lead proporcionan información valiosa para optimizar estrategias de marketing y soporte.

---

## 🔗 6. Referencias al Proyecto Actual

-   **Esquema de Base de Datos**: `packages/api/prisma/schema.prisma`
-   **Servicio de Notificaciones**: `packages/api/src/notification/notification.service.ts`
-   **Módulo de Usuarios**: `packages/api/src/users/`
-   **Feature Flags**: `packages/shared/src/config/freemium-flags.ts`
-   **Configuración tRPC**: `packages/api/src/trpc/`
-   **Componentes UI Base**: `packages/web/src/components/ui/`

---

## 📅 7. Plan de Implementación (Alto Nivel)

Este plan se desglosará en tickets de trabajo detallados.

-   **Fase 1: Core Backend del Chat** (Servicios, Repositorios, tRPC, Gateway WebSocket)
-   **Fase 2: Widget de Chat Público** (Frontend UI, Integración con Backend)
-   **Fase 3: Dashboard de Gestión de Conversaciones** (Frontend UI, Integración con Backend)
-   **Fase 4: Notificaciones y Configuración** (Integración de notificaciones, UI y Backend de configuración)
-   **Fase 5: Analíticas Básicas** (UI y Backend de analíticas)

---

**Estado Actual**: PRD Creado y Aprobado. Listo para la creación de tickets.
