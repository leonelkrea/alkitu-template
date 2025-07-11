# 🔔 Notification System PRD (CORREGIDO)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El Notification System es el **centro de comunicación** de la plataforma Alkitu, proporcionando un sistema completo de notificaciones multi-canal (email, push, in-app, SMS) con gestión de preferencias, templates personalizables y analytics avanzadas.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-002 (Open/Closed Principle) - Extensible notification channels
- **Relacionado con**: REFACTOR-003 (NotificationService) - Architecture refactoring
- **Integración**: **Chatbot System** - Notificaciones de nuevos mensajes de chat
- **Implementación**: Semana 11-12 (parallel con chatbot backend)

### **Objetivos Comerciales**

- **User Engagement**: Incrementar engagement 40% con notificaciones relevantes
- **Retention**: Mejorar retention 25% con comunicación proactiva
- **Conversion**: Aumentar conversiones 30% con notificaciones targeted
- **Automation**: Reducir trabajo manual 80% con workflows automatizados
- **🔗 Chatbot Integration**: Notificaciones en tiempo real para mensajes de chat

### **Metas Técnicas**

- **Real-time Delivery**: < 100ms latencia para notificaciones in-app
- **High Throughput**: 10K+ notificaciones por segundo
- **Reliability**: 99.9% delivery rate para notificaciones críticas
- **Scalability**: Soporte para millones de usuarios
- **✅ Enhanced**: Integración completa con chatbot system

---

## 👥 2. Stakeholders

### **Primary Users**

- **Product Managers**: Configuración de campañas y workflows
- **Marketing Teams**: Gestión de comunicaciones masivas
- **Customer Success**: Onboarding y engagement de usuarios
- **Developers**: Integración de notificaciones en aplicaciones

### **Secondary Users**

- **End Users**: Recepción y gestión de notificaciones
- **System Administrators**: Configuración y monitoring
- **Support Teams**: Gestión de comunicaciones de soporte
- **Compliance Officers**: Gestión de consent y privacy

### **Technical Stakeholders**

- **DevOps Engineers**: Infraestructura y monitoreo
- **Data Teams**: Analytics y reporting
- **Security Teams**: Protección de datos personales
- **QA Engineers**: Testing de flujos de notificación

---

## 📖 3. Historias de Usuario

### **Product Manager**

```gherkin
Como product manager
Quiero crear workflows de onboarding automatizados
Para guiar a nuevos usuarios through key features

Como product manager
Quiero segmentar usuarios para notificaciones targeted
Para maximizar relevancia y engagement

Como product manager
Quiero ver métricas de engagement por notificación
Para optimizar la estrategia de comunicación
```

### **Marketing Manager**

```gherkin
Como marketing manager
Quiero enviar campañas de email personalizadas
Para promocionar features y aumentar conversiones

Como marketing manager
Quiero A/B test different notification messages
Para optimizar open rates y click-through rates

Como marketing manager
Quiero programar notificaciones para optimal timing
Para maximizar engagement por timezone
```

### **End User**

```gherkin
Como end user
Quiero controlar qué notificaciones recibo
Para personalizar mi experiencia de comunicación

Como end user
Quiero ver un historial de mis notificaciones
Para no perder información importante

Como end user
Quiero recibir notificaciones en múltiples canales
Para estar informado en mi canal preferido
```

---

## 🎨 4. Características por Licencia

### **Free Tier ($0)**

| Funcionalidad        | Incluido | Limitaciones             |
| -------------------- | -------- | ------------------------ |
| Email Notifications  | ✅       | 100 emails/mes           |
| In-App Notifications | ✅       | Templates básicos        |
| Basic Templates      | ✅       | 3 templates predefinidos |
| User Preferences     | ✅       | On/off básico            |
| Notification History | ✅       | 7 días de historial      |
| Basic Analytics      | ✅       | Métricas básicas         |

### **Professional Tier ($297)**

| Funcionalidad          | Incluido | Limitaciones           |
| ---------------------- | -------- | ---------------------- |
| Unlimited Email        | ✅       | Sin límites de volumen |
| Push Notifications     | ✅       | Web + mobile push      |
| Custom Templates       | ✅       | Templates ilimitados   |
| Advanced Preferences   | ✅       | Granular control       |
| Workflow Automation    | ✅       | Workflows básicos      |
| A/B Testing            | ✅       | Split testing          |
| Extended History       | ✅       | 90 días de historial   |
| Advanced Analytics     | ✅       | Dashboards detallados  |
| API Access             | ✅       | Rate limiting estándar |
| Multi-language Support | ✅       | 10 idiomas             |

### **Enterprise Tier ($997)**

| Funcionalidad         | Incluido | Limitaciones               |
| --------------------- | -------- | -------------------------- |
| High-Volume Delivery  | ✅       | Millones de notificaciones |
| SMS Notifications     | ✅       | SMS integration            |
| Advanced Workflows    | ✅       | Complex automation         |
| Custom Integrations   | ✅       | Webhooks, APIs             |
| White-label Templates | ✅       | Branded templates          |
| Advanced Segmentation | ✅       | ML-powered targeting       |
| Real-time Analytics   | ✅       | Live dashboards            |
| Compliance Tools      | ✅       | GDPR, CAN-SPAM             |
| Priority Support      | ✅       | Dedicated support          |
| Custom Channels       | ✅       | Slack, Teams, Discord      |

---

## 🛠️ 5. Requisitos Técnicos

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model NotificationTemplate {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId String?  @db.ObjectId
  name           String
  description    String?
  type           NotificationType
  subjectTemplate String?
  bodyTemplate    String
  htmlTemplate    String?
  variables       Json     @default("{}")
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?  @db.ObjectId

  // Relations
  organization  Organization? @relation(fields: [organizationId], references: [id])
  creator       User?         @relation(fields: [createdBy], references: [id])
  campaigns     NotificationCampaign[]
  notifications Notification[]

  @@map("notification_templates")
}

model NotificationCampaign {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId String?  @db.ObjectId
  templateId     String   @db.ObjectId
  name           String
  description    String?
  audienceFilter Json     @default("{}")
  scheduling     Json     @default("{}")
  status         CampaignStatus @default(DRAFT)
  stats          Json     @default("{}")
  createdBy      String   @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  organization  Organization? @relation(fields: [organizationId], references: [id])
  template      NotificationTemplate @relation(fields: [templateId], references: [id])
  creator       User         @relation(fields: [createdBy], references: [id])
  notifications Notification[]

  @@map("notification_campaigns")
}

model Notification {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  organizationId String?  @db.ObjectId
  campaignId     String?  @db.ObjectId
  templateId     String?  @db.ObjectId
  // ✅ ENHANCED: Chatbot integration
  conversationId String?  @db.ObjectId // For chat notifications
  messageId      String?  @db.ObjectId // For chat message notifications
  type           NotificationType
  channel        NotificationChannel
  title          String?
  body           String
  htmlBody       String?
  data           Json     @default("{}")
  priority       NotificationPriority @default(NORMAL)
  status         NotificationStatus @default(PENDING)
  scheduledAt    DateTime?
  sentAt         DateTime?
  deliveredAt    DateTime?
  readAt         DateTime?
  errorMessage   String?
  retryCount     Int      @default(0)
  createdAt      DateTime @default(now())

  // Relations
  user         User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization?      @relation(fields: [organizationId], references: [id])
  campaign     NotificationCampaign? @relation(fields: [campaignId], references: [id])
  template     NotificationTemplate? @relation(fields: [templateId], references: [id])
  // ✅ ENHANCED: Chatbot relations
  conversation Conversation?      @relation(fields: [conversationId], references: [id])
  chatMessage  ChatMessage?       @relation(fields: [messageId], references: [id])
  events       NotificationEvent[]

  @@map("notifications")
}

model UserNotificationPreference {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  organizationId String?  @db.ObjectId
  category       String   // "chat", "billing", "system", "marketing", etc.
  emailEnabled   Boolean  @default(true)
  pushEnabled    Boolean  @default(true)
  inAppEnabled   Boolean  @default(true)
  smsEnabled     Boolean  @default(false)
  frequency      NotificationFrequency @default(INSTANT)
  quietHours     Json     @default("{}")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId, category])
  @@map("user_notification_preferences")
}

model NotificationEvent {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  notificationId String   @db.ObjectId
  eventType      NotificationEventType
  timestamp      DateTime @default(now())
  userAgent      String?
  ipAddress      String?
  metadata       Json     @default("{}")

  // Relations
  notification Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)

  @@map("notification_events")
}

model PushToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId
  token      String
  platform   PushPlatform
  deviceName String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, token])
  @@map("push_tokens")
}

model NotificationWorkflow {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId    String?  @db.ObjectId
  name              String
  description       String?
  triggerType       WorkflowTriggerType
  triggerConditions Json     @default("{}")
  steps             Json     @default("{}")
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String   @db.ObjectId

  // Relations
  organization Organization?      @relation(fields: [organizationId], references: [id])
  creator      User              @relation(fields: [createdBy], references: [id])
  executions   WorkflowExecution[]

  @@map("notification_workflows")
}

model WorkflowExecution {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  workflowId   String   @db.ObjectId
  userId       String   @db.ObjectId
  status       WorkflowStatus @default(RUNNING)
  currentStep  Int      @default(0)
  context      Json     @default("{}")
  startedAt    DateTime @default(now())
  completedAt  DateTime?
  errorMessage String?

  // Relations
  workflow NotificationWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  user     User                 @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("workflow_executions")
}

enum NotificationType {
  EMAIL
  PUSH
  IN_APP
  SMS
  CHAT // ✅ ENHANCED: For chatbot notifications
}

enum NotificationChannel {
  EMAIL
  FCM
  APNS
  WEBSOCKET
  SMS
  CHAT_WIDGET // ✅ ENHANCED: For chatbot widget notifications
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum NotificationStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  RUNNING
  COMPLETED
  PAUSED
}

enum NotificationFrequency {
  INSTANT
  DAILY
  WEEKLY
  NEVER
}

enum NotificationEventType {
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
}

enum PushPlatform {
  IOS
  ANDROID
  WEB
}

enum WorkflowTriggerType {
  USER_ACTION
  TIME_BASED
  API_CALL
  CHAT_MESSAGE // ✅ ENHANCED: For chatbot triggers
}

enum WorkflowStatus {
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST endpoints
// packages/api/src/trpc/routers/notifications.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { notificationSchemas } from "../schemas/notification.schemas";

export const notificationsRouter = createTRPCRouter({
  // Templates
  getTemplates: protectedProcedure
    .input(notificationSchemas.getTemplatesInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getTemplates(input);
    }),

  createTemplate: protectedProcedure
    .input(notificationSchemas.createTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.createTemplate(input);
    }),

  updateTemplate: protectedProcedure
    .input(notificationSchemas.updateTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.updateTemplate(input);
    }),

  deleteTemplate: protectedProcedure
    .input(notificationSchemas.deleteTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.deleteTemplate(input.id);
    }),

  testTemplate: protectedProcedure
    .input(notificationSchemas.testTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.testTemplate(input);
    }),

  // Campaigns
  getCampaigns: protectedProcedure
    .input(notificationSchemas.getCampaignsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getCampaigns(input);
    }),

  createCampaign: protectedProcedure
    .input(notificationSchemas.createCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.createCampaign(input);
    }),

  updateCampaign: protectedProcedure
    .input(notificationSchemas.updateCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.updateCampaign(input);
    }),

  deleteCampaign: protectedProcedure
    .input(notificationSchemas.deleteCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.deleteCampaign(input.id);
    }),

  launchCampaign: protectedProcedure
    .input(notificationSchemas.launchCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.launchCampaign(input.id);
    }),

  pauseCampaign: protectedProcedure
    .input(notificationSchemas.pauseCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.pauseCampaign(input.id);
    }),

  // Send Notifications
  send: protectedProcedure
    .input(notificationSchemas.sendNotificationInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.send(input);
    }),

  sendBatch: protectedProcedure
    .input(notificationSchemas.sendBatchInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.sendBatch(input);
    }),

  broadcast: protectedProcedure
    .input(notificationSchemas.broadcastInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.broadcast(input);
    }),

  // ✅ ENHANCED: Chatbot-specific notifications
  sendChatNotification: protectedProcedure
    .input(notificationSchemas.sendChatNotificationInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.sendChatNotification(input);
    }),

  // User Notifications
  getUserNotifications: protectedProcedure
    .input(notificationSchemas.getUserNotificationsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getUserNotifications(
        ctx.user.id,
        input
      );
    }),

  markAsRead: protectedProcedure
    .input(notificationSchemas.markAsReadInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.markAsRead(input.notificationId);
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.notificationService.markAllAsRead(ctx.user.id);
  }),

  deleteNotification: protectedProcedure
    .input(notificationSchemas.deleteNotificationInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.deleteNotification(
        input.notificationId
      );
    }),

  // Preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.notificationService.getPreferences(ctx.user.id);
  }),

  updatePreferences: protectedProcedure
    .input(notificationSchemas.updatePreferencesInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.updatePreferences(
        ctx.user.id,
        input
      );
    }),

  // Push Tokens
  registerPushToken: protectedProcedure
    .input(notificationSchemas.registerPushTokenInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.registerPushToken(
        ctx.user.id,
        input
      );
    }),

  unregisterPushToken: protectedProcedure
    .input(notificationSchemas.unregisterPushTokenInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.unregisterPushToken(input.tokenId);
    }),

  // Workflows
  getWorkflows: protectedProcedure
    .input(notificationSchemas.getWorkflowsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getWorkflows(input);
    }),

  createWorkflow: protectedProcedure
    .input(notificationSchemas.createWorkflowInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.createWorkflow(input);
    }),

  updateWorkflow: protectedProcedure
    .input(notificationSchemas.updateWorkflowInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.updateWorkflow(input);
    }),

  deleteWorkflow: protectedProcedure
    .input(notificationSchemas.deleteWorkflowInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.deleteWorkflow(input.id);
    }),

  triggerWorkflow: protectedProcedure
    .input(notificationSchemas.triggerWorkflowInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.notificationService.triggerWorkflow(input);
    }),

  // Analytics
  getAnalytics: protectedProcedure
    .input(notificationSchemas.getAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getAnalytics(input);
    }),

  getCampaignAnalytics: protectedProcedure
    .input(notificationSchemas.getCampaignAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getCampaignAnalytics(
        input.campaignId
      );
    }),

  getTemplateAnalytics: protectedProcedure
    .input(notificationSchemas.getTemplateAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.notificationService.getTemplateAnalytics(
        input.templateId
      );
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with chatbot integration
// packages/api/src/notification/notification.service.ts

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly templateRepository: ITemplateRepository,
    private readonly preferenceRepository: IPreferenceRepository,
    private readonly emailService: IEmailService,
    private readonly pushService: IPushService,
    private readonly websocketGateway: NotificationWebSocketGateway,
    private readonly smsService: ISmsService
  ) {}

  async send(input: SendNotificationInput): Promise<SendNotificationResult> {
    // Create notification record
    const notification = await this.notificationRepository.create({
      userId: input.userId,
      type: input.type,
      channel: input.channel,
      title: input.title,
      body: input.body,
      data: input.data,
      priority: input.priority || NotificationPriority.NORMAL,
    });

    // Check user preferences
    const preferences = await this.preferenceRepository.findByUserId(
      input.userId
    );
    if (!this.shouldSendNotification(notification, preferences)) {
      await this.notificationRepository.updateStatus(
        notification.id,
        NotificationStatus.FAILED,
        "User preferences blocked"
      );
      return {
        notification,
        sent: false,
        reason: "Blocked by user preferences",
      };
    }

    // Send through appropriate channel
    try {
      await this.sendThroughChannel(notification);
      await this.notificationRepository.updateStatus(
        notification.id,
        NotificationStatus.SENT
      );

      return { notification, sent: true };
    } catch (error) {
      await this.notificationRepository.updateStatus(
        notification.id,
        NotificationStatus.FAILED,
        error.message
      );
      throw error;
    }
  }

  // ✅ ENHANCED: Chatbot-specific notification method
  async sendChatNotification(
    input: SendChatNotificationInput
  ): Promise<SendChatNotificationResult> {
    const notification = await this.notificationRepository.create({
      userId: input.userId,
      conversationId: input.conversationId,
      messageId: input.messageId,
      type: NotificationType.CHAT,
      channel: NotificationChannel.CHAT_WIDGET,
      title: "New chat message",
      body: input.message,
      data: {
        conversationId: input.conversationId,
        senderName: input.senderName,
        messagePreview: input.message.substring(0, 100),
      },
      priority: NotificationPriority.HIGH,
    });

    // Send real-time notification via WebSocket
    await this.websocketGateway.sendChatNotification(input.userId, {
      id: notification.id,
      conversationId: input.conversationId,
      message: input.message,
      senderName: input.senderName,
      timestamp: new Date(),
    });

    // Also send push notification if user has it enabled
    const preferences = await this.preferenceRepository.findByUserIdAndCategory(
      input.userId,
      "chat"
    );
    if (preferences?.pushEnabled) {
      await this.pushService.send({
        userId: input.userId,
        title: "New chat message",
        body: `${input.senderName}: ${input.message.substring(0, 50)}...`,
        data: {
          type: "chat",
          conversationId: input.conversationId,
        },
      });
    }

    await this.notificationRepository.updateStatus(
      notification.id,
      NotificationStatus.SENT
    );

    return {
      notification,
      sent: true,
      channels: ["websocket", preferences?.pushEnabled ? "push" : null].filter(
        Boolean
      ),
    };
  }

  private async sendThroughChannel(notification: Notification): Promise<void> {
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await this.emailService.send({
          to: notification.user.email,
          subject: notification.title,
          html: notification.htmlBody || notification.body,
        });
        break;

      case NotificationChannel.FCM:
      case NotificationChannel.APNS:
        await this.pushService.send({
          userId: notification.userId,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
        break;

      case NotificationChannel.WEBSOCKET:
        await this.websocketGateway.sendNotification(
          notification.userId,
          notification
        );
        break;

      case NotificationChannel.SMS:
        await this.smsService.send({
          to: notification.user.phone,
          message: notification.body,
        });
        break;

      case NotificationChannel.CHAT_WIDGET:
        await this.websocketGateway.sendChatNotification(
          notification.userId,
          notification
        );
        break;

      default:
        throw new Error(
          `Unsupported notification channel: ${notification.channel}`
        );
    }
  }

  private shouldSendNotification(
    notification: Notification,
    preferences: UserNotificationPreference[]
  ): boolean {
    const categoryPreference = preferences.find(
      (p) => p.category === this.getCategoryFromNotification(notification)
    );

    if (!categoryPreference) {
      return true; // Default to send if no preference set
    }

    // Check channel-specific preferences
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        return categoryPreference.emailEnabled;
      case NotificationChannel.FCM:
      case NotificationChannel.APNS:
        return categoryPreference.pushEnabled;
      case NotificationChannel.WEBSOCKET:
      case NotificationChannel.CHAT_WIDGET:
        return categoryPreference.inAppEnabled;
      case NotificationChannel.SMS:
        return categoryPreference.smsEnabled;
      default:
        return true;
    }
  }

  private getCategoryFromNotification(notification: Notification): string {
    // Determine category based on notification type or data
    if (notification.conversationId) {
      return "chat";
    }
    if (notification.type === NotificationType.EMAIL) {
      return "marketing";
    }
    return "system";
  }

  // Other methods following SOLID principles...
}
```

### **🎨 Frontend Components (Next.js + shadcn/ui)**

```tsx
// ✅ CORRECTED: Next.js 14 + shadcn/ui components
// packages/web/src/components/notifications/NotificationCenter.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  CreditCard,
  Settings,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatRelativeTime } from "@/lib/utils";
import { NotificationType } from "@/types/notification";

export function NotificationCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    data: notifications,
    isLoading,
    refetch,
  } = trpc.notifications.getUserNotifications.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 50,
  });

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteNotificationMutation =
    trpc.notifications.deleteNotification.useMutation({
      onSuccess: () => refetch(),
    });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate({ notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId: string) => {
    deleteNotificationMutation.mutate({ notificationId });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "CHAT":
        return <MessageSquare className='h-4 w-4' />;
      case "EMAIL":
        return <Bell className='h-4 w-4' />;
      default:
        return <Bell className='h-4 w-4' />;
    }
  };

  const categories = [
    { id: "all", name: "All", count: notifications?.length || 0 },
    {
      id: "chat",
      name: "Chat",
      count: notifications?.filter((n) => n.type === "CHAT").length || 0,
    },
    {
      id: "billing",
      name: "Billing",
      count:
        notifications?.filter((n) => n.data?.type === "billing").length || 0,
    },
    {
      id: "system",
      name: "System",
      count:
        notifications?.filter((n) => n.data?.type === "system").length || 0,
    },
  ];

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-5 w-5' />
          Notifications
          {notifications?.filter((n) => !n.readAt).length > 0 && (
            <Badge variant='destructive' className='ml-2'>
              {notifications.filter((n) => !n.readAt).length}
            </Badge>
          )}
        </CardTitle>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isLoading}
          >
            <CheckCheck className='h-4 w-4 mr-1' />
            Mark all read
          </Button>
          <Button variant='outline' size='sm'>
            <Settings className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        {/* Category Filter */}
        <div className='flex gap-1 p-4 border-b'>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size='sm'
              onClick={() => setSelectedCategory(category.id)}
              className='flex items-center gap-1'
            >
              {category.name}
              {category.count > 0 && (
                <Badge variant='secondary' className='ml-1 text-xs'>
                  {category.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <ScrollArea className='h-96'>
          {notifications?.length > 0 ? (
            <div className='divide-y'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.readAt ? "bg-muted/20" : ""
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className={`flex-shrink-0 ${
                        !notification.readAt
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center justify-between'>
                        <p
                          className={`font-medium text-sm ${
                            !notification.readAt
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <div className='flex items-center gap-1'>
                          {!notification.readAt && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleMarkAsRead(notification.id)}
                              className='h-6 w-6 p-0'
                            >
                              <Check className='h-3 w-3' />
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(notification.id)}
                            className='h-6 w-6 p-0'
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>

                      <p className='text-sm text-muted-foreground'>
                        {notification.body}
                      </p>

                      {/* ✅ ENHANCED: Chat-specific data */}
                      {notification.conversationId && (
                        <div className='mt-2 p-2 bg-muted rounded-md text-xs'>
                          <p className='font-medium'>Chat conversation</p>
                          <p>Sender: {notification.data?.senderName}</p>
                        </div>
                      )}

                      <p className='text-xs text-muted-foreground'>
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-8 text-center text-muted-foreground'>
              <Bell className='h-12 w-12 mx-auto mb-4 opacity-30' />
              <p>No notifications found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Chat Notification Component specifically for chat widget
export function ChatNotificationBadge() {
  const { data: chatNotifications } =
    trpc.notifications.getUserNotifications.useQuery({
      category: "chat",
      unreadOnly: true,
    });

  const unreadCount = chatNotifications?.length || 0;

  if (unreadCount === 0) return null;

  return (
    <Badge
      variant='destructive'
      className='absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs'
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}
```

---

## 📅 **TIMELINE CORREGIDO**

### **🔗 Integración con Planning SOLID y Chatbot**

```typescript
// ✅ CORRECTED: Aligned with SOLID implementation and chatbot integration
const NOTIFICATION_IMPLEMENTATION_PLAN = {
  // PREREQUISITE: Complete SOLID principles first
  prerequisites: [
    "SOLID-002: Open/Closed Principle", // Week 2
    "REFACTOR-003: NotificationService refactoring", // Week 5-6
  ],

  // ACTUAL IMPLEMENTATION: Weeks 11-12 (parallel with chatbot)
  implementation: {
    week11: [
      "Database models implementation (with chatbot relations)",
      "Basic notification service (SOLID-compliant)",
      "tRPC router setup",
      "Email and push notification providers",
      "Chat notification integration",
    ],
    week12: [
      "Frontend notification center (shadcn/ui)",
      "User preference management",
      "Real-time notifications via WebSocket",
      "Chat notification badges and alerts",
      "Template and campaign systems",
    ],
  },
};
```

### **Real-time Infrastructure**

```typescript
// WebSocket Events for Real-time Notifications
interface NotificationWebSocketEvents {
  // Server to Client
  "notification:received": {
    notification: Notification;
    user: User;
  };

  "notification:read": {
    notificationId: string;
    readAt: Date;
  };

  "notification:count_updated": {
    unreadCount: number;
  };

  // Client to Server
  "notification:mark_read": {
    notificationId: string;
  };

  "notification:mark_all_read": {};

  "notification:subscribe": {
    userId: string;
    organizationId: string;
  };

  "notification:unsubscribe": {};
}

// Push Notification Service
interface PushNotificationService {
  // FCM (Firebase Cloud Messaging)
  sendToDevice(token: string, payload: PushPayload): Promise<void>;
  sendToTopic(topic: string, payload: PushPayload): Promise<void>;

  // APNs (Apple Push Notification service)
  sendToiOS(token: string, payload: APNsPayload): Promise<void>;

  // Web Push
  sendToWeb(
    subscription: PushSubscription,
    payload: WebPushPayload
  ): Promise<void>;
}
```

---

## 📏 6. Criterios de Aceptación

### **Template Management**

- [ ] WYSIWYG editor para templates HTML
- [ ] Variable substitution con preview
- [ ] Template versioning y rollback
- [ ] Multi-language template support
- [ ] Template testing con usuarios reales
- [ ] Template library con ejemplos

### **Campaign Management**

- [ ] Audience segmentation avanzada
- [ ] Scheduling con timezone support
- [ ] A/B testing capabilities
- [ ] Campaign analytics en tiempo real
- [ ] Drip campaigns automatizadas
- [ ] Campaign performance optimization

### **Multi-Channel Delivery**

- [ ] Email delivery con SMTP/API
- [ ] Push notifications (Web, iOS, Android)
- [ ] In-app notifications con WebSocket
- [ ] SMS notifications (opcional)
- [ ] Fallback entre canales
- [ ] Delivery confirmation tracking

### **User Experience**

- [ ] Notification center interface
- [ ] Granular preference controls
- [ ] Notification history y search
- [ ] Bulk actions (mark all read, delete)
- [ ] Real-time notification display
- [ ] Mobile-responsive design

### **Analytics & Reporting**

- [ ] Open rates y click-through rates
- [ ] Delivery success rates
- [ ] User engagement metrics
- [ ] Campaign performance comparison
- [ ] Conversion tracking
- [ ] Custom reporting dashboards

---

## 🚀 7. Implementation Priority

### **Phase 1: Foundation (Days 1-3)**

- Database schema y basic models
- Template system básico
- Email notification service
- Basic API endpoints
- User preference system

### **Phase 2: Core Features (Days 4-7)**

- In-app notifications con WebSocket
- Push notification service
- Campaign management
- Basic analytics
- Notification center UI

### **Phase 3: Advanced Features (Days 8-10)**

- Workflow automation
- Advanced segmentation
- A/B testing framework
- Advanced analytics
- Template editor

### **Phase 4: Enterprise Features (Days 11-12)**

- SMS notifications
- Advanced workflows
- White-label templates
- Compliance tools
- Performance optimization

---

## 🔧 8. Integration Points

### **Email Service Providers**

```typescript
// Email Service Integration
interface EmailProvider {
  sendEmail(payload: EmailPayload): Promise<EmailResult>;
  sendBatch(payloads: EmailPayload[]): Promise<EmailResult[]>;
  getDeliveryStatus(messageId: string): Promise<DeliveryStatus>;
  handleWebhook(payload: WebhookPayload): Promise<void>;
}

// Supported Providers
const EMAIL_PROVIDERS = {
  resend: ResendProvider,
  sendgrid: SendGridProvider,
  mailgun: MailgunProvider,
  ses: AWSSeseProvider,
  postmark: PostmarkProvider,
};
```

### **Push Notification Services**

```typescript
// Push Service Integration
interface PushProvider {
  sendPush(payload: PushPayload): Promise<PushResult>;
  sendBatch(payloads: PushPayload[]): Promise<PushResult[]>;
  validateToken(token: string): Promise<boolean>;
  getTokenInfo(token: string): Promise<TokenInfo>;
}

// Supported Providers
const PUSH_PROVIDERS = {
  fcm: FCMProvider,
  apns: APNsProvider,
  webpush: WebPushProvider,
  onesignal: OneSignalProvider,
};
```

### **SMS Service Providers**

```typescript
// SMS Service Integration
interface SMSProvider {
  sendSMS(payload: SMSPayload): Promise<SMSResult>;
  sendBatch(payloads: SMSPayload[]): Promise<SMSResult[]>;
  getDeliveryStatus(messageId: string): Promise<DeliveryStatus>;
  validateNumber(phoneNumber: string): Promise<boolean>;
}

// Supported Providers
const SMS_PROVIDERS = {
  twilio: TwilioProvider,
  aws_sns: AWSSNSProvider,
  vonage: VonageProvider,
  messagebird: MessageBirdProvider,
};
```

---

## 📊 9. Analytics & Metrics

### **Key Performance Indicators**

```typescript
// Notification KPIs
interface NotificationKPIs {
  // Delivery Metrics
  deliveryRate: number; // % of notifications delivered
  bounceRate: number; // % of notifications bounced
  failureRate: number; // % of notifications failed

  // Engagement Metrics
  openRate: number; // % of notifications opened
  clickRate: number; // % of notifications clicked
  conversionRate: number; // % converted after notification

  // User Behavior
  unsubscribeRate: number; // % of users unsubscribing
  spamRate: number; // % marked as spam
  responseTime: number; // Average response time

  // Technical Metrics
  averageDeliveryTime: number; // ms
  systemUptime: number; // %
  errorRate: number; // %
}
```

### **Reporting Dashboard**

- **Campaign Performance**: Success rates, engagement metrics
- **User Engagement**: Activity patterns, preference trends
- **System Health**: Delivery rates, error rates, performance
- **Revenue Impact**: Conversion attribution, ROI analysis
- **Compliance Metrics**: Opt-out rates, complaint rates

---

## 🔒 10. Security & Compliance

### **Data Protection**

- **PII Encryption**: All personal data encrypted at rest
- **Token Security**: Secure push token management
- **Rate Limiting**: Protection against spam and abuse
- **Input Validation**: Sanitization of all templates and content
- **Access Control**: Role-based permissions for campaign management

### **Compliance Features**

- **GDPR Compliance**: Consent management, data export/deletion
- **CAN-SPAM Act**: Unsubscribe links, sender identification
- **CCPA Compliance**: Privacy controls, data transparency
- **SOC 2**: Audit trails, security controls
- **HIPAA Ready**: Healthcare notification compliance

### **Privacy Controls**

- **Consent Management**: Granular opt-in/opt-out controls
- **Data Minimization**: Only collect necessary data
- **Retention Policies**: Automatic data cleanup
- **User Rights**: Access, portability, deletion rights
- **Audit Logging**: Complete activity tracking

---

## 💰 11. Business Value & ROI

### **Value Proposition**

- **Engagement Boost**: 40% increase in user engagement
- **Retention Improvement**: 25% better user retention
- **Conversion Growth**: 30% increase in conversions
- **Operational Efficiency**: 80% reduction in manual work

### **Cost Savings**

```typescript
const NOTIFICATION_SYSTEM_ROI = {
  developmentCosts: {
    fromScratch: 360, // hours
    withTemplate: 60, // hours
    timeSaved: 300, // hours
  },
  operationalSavings: {
    manualWork: 20, // hours/week
    automationSavings: 1040, // hours/year
    hourlyRate: 50, // USD
    yearlySavings: 52000, // USD
  },
  revenueBenefit: {
    engagementIncrease: 0.4, // 40%
    conversionIncrease: 0.3, // 30%
    averageUserValue: 100, // USD
    userBase: 10000,
    additionalRevenue: 130000, // USD/year
  },
};
```

---

_El Notification System proporciona una plataforma completa de comunicación que maximiza el engagement del usuario mientras mantiene los más altos estándares de privacidad y compliance._
