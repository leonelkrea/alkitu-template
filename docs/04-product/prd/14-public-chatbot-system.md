# 💬 Public Chatbot System PRD

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El Sistema de Chatbot Público es un **sistema completo de captura de leads y soporte al cliente** que permite a los visitantes del sitio web interactuar con el negocio a través de un widget de chat flotante, gestionado desde el dashboard administrativo.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-004 (Interface Segregation Principle) - Interfaces específicas para chat
- **Relacionado con**: REFACTOR-003 (NotificationService) - Integración de notificaciones
- **Implementación**: Semana 11-14 (después de completar notification system)

### **Objetivos Comerciales**

- **Lead Generation**: Capturar prospectos directamente desde el sitio web
- **Customer Support**: Proporcionar canal de comunicación inmediato
- **Conversion Boost**: Incrementar conversiones 30% con interacción directa
- **Revenue Impact**: Captura directa de leads calificados

### **Metas Técnicas**

- **Real-time Communication**: WebSocket para chat en tiempo real
- **Lead Capture**: Formularios progresivos inteligentes
- **Scalability**: Soporte para 100+ conversaciones simultáneas
- **Admin Management**: Dashboard completo para gestión interna

---

## 🎨 4. Características por Licencia

### **Free Tier ($0)**

| Funcionalidad       | Incluido | Limitaciones                     |
| ------------------- | -------- | -------------------------------- |
| Chat Widget         | ✅       | Con branding "Powered by Alkitu" |
| Basic Contact Form  | ✅       | Solo email y mensaje             |
| Message History     | ✅       | 7 días de historial              |
| Basic Notifications | ✅       | Solo in-app                      |
| Admin Responses     | ✅       | Respuestas básicas               |

### **Professional Tier ($297)**

| Funcionalidad           | Incluido | Limitaciones                     |
| ----------------------- | -------- | -------------------------------- |
| Custom Chat Widget      | ✅       | Sin branding externo             |
| Advanced Contact Forms  | ✅       | Email, teléfono, nombre, empresa |
| Extended History        | ✅       | 90 días de historial             |
| Real-time Notifications | ✅       | In-app + email alerts            |
| Conversation Assignment | ✅       | Asignación a team members        |
| Internal Notes          | ✅       | Notas privadas del equipo        |
| Basic Analytics         | ✅       | Métricas de conversación         |
| Custom Branding         | ✅       | Colores y textos personalizables |

### **Enterprise Tier ($997)**

| Funcionalidad      | Incluido | Limitaciones           |
| ------------------ | -------- | ---------------------- |
| Advanced Analytics | ✅       | Dashboards completos   |
| Custom Workflows   | ✅       | Automation rules       |
| Advanced Branding  | ✅       | White-label completo   |
| API Integration    | ✅       | Webhooks y API externa |
| Unlimited History  | ✅       | Historial completo     |
| Priority Support   | ✅       | Soporte técnico 24/7   |
| Multi-language     | ✅       | Soporte de idiomas     |
| CRM Integration    | ✅       | Integración con CRMs   |

---

## 🛠️ 5. Requisitos Técnicos (CORREGIDOS)

### **🔧 Tech Stack Actual**

```typescript
// CORRECT Tech Stack (aligned with project)
const CHATBOT_TECH_STACK = {
  backend: {
    framework: "NestJS 10+",
    database: "MongoDB with Prisma ORM", // ✅ CORRECTED
    api: "tRPC + REST", // ✅ CORRECTED
    realtime: "WebSocket Gateway",
    validation: "Zod schemas", // ✅ CORRECTED
    testing: "Jest + Stryker mutation testing",
  },
  frontend: {
    framework: "Next.js 14+ App Router", // ✅ CORRECTED
    ui: "shadcn/ui + Radix UI + Tailwind", // ✅ CORRECTED
    state: "Zustand + React Query", // ✅ CORRECTED
    realtime: "WebSocket client",
  },
};
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model Conversation {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  contactInfoId String   @db.ObjectId
  assignedToId  String?  @db.ObjectId
  status        ConversationStatus @default(OPEN)
  priority      Priority @default(NORMAL)
  source        String   @default("website")
  tags          String[]
  internalNotes String?
  lastMessageAt DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  contactInfo ContactInfo @relation(fields: [contactInfoId], references: [id])
  assignedTo  User?       @relation(fields: [assignedToId], references: [id])
  messages    ChatMessage[]

  @@map("conversations")
}

model ChatMessage {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String   @db.ObjectId
  content        String
  isFromVisitor  Boolean  @default(true)
  senderUserId   String?  @db.ObjectId
  isRead         Boolean  @default(false)
  metadata       Json?    // Additional message data
  createdAt      DateTime @default(now())

  // Relations
  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderUser   User?        @relation(fields: [senderUserId], references: [id])

  @@map("chat_messages")
}

model ContactInfo {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  email         String?  @unique
  phone         String?  @unique
  name          String?
  company       String?
  source        String?  // UTM source, referrer
  ipAddress     String?
  userAgent     String?
  metadata      Json?    // Additional contact data
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  conversations Conversation[]

  @@map("contact_info")
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

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST controllers
// packages/api/src/trpc/routers/chat.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { chatSchemas } from "../schemas/chat.schemas";

export const chatRouter = createTRPCRouter({
  // Public API for website visitors
  startConversation: publicProcedure
    .input(chatSchemas.startConversation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.startConversation(input);
    }),

  sendMessage: publicProcedure
    .input(chatSchemas.sendMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.sendMessage(input);
    }),

  getMessages: publicProcedure
    .input(chatSchemas.getMessages)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getMessages(input.conversationId);
    }),

  // Admin API for internal management
  getConversations: protectedProcedure
    .input(chatSchemas.getConversations)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversations(input);
    }),

  assignConversation: protectedProcedure
    .input(chatSchemas.assignConversation)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.assignConversation(input);
    }),

  updateStatus: protectedProcedure
    .input(chatSchemas.updateStatus)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.updateStatus(input);
    }),

  replyToMessage: protectedProcedure
    .input(chatSchemas.replyToMessage)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.replyToMessage(input);
    }),

  addInternalNote: protectedProcedure
    .input(chatSchemas.addInternalNote)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.addInternalNote(input);
    }),

  markAsRead: protectedProcedure
    .input(chatSchemas.markAsRead)
    .mutation(async ({ input, ctx }) => {
      return await ctx.chatService.markAsRead(input);
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with proper interfaces
// packages/api/src/chat/chat.service.ts

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly contactRepository: IContactRepository,
    private readonly notificationService: INotificationService,
    private readonly websocketGateway: ChatWebSocketGateway
  ) {}

  async startConversation(
    data: StartConversationDto
  ): Promise<ConversationResult> {
    // Find or create contact info
    let contactInfo = await this.contactRepository.findByEmail(data.email);
    if (!contactInfo) {
      contactInfo = await this.contactRepository.create({
        email: data.email,
        phone: data.phone,
        name: data.name,
        company: data.company,
        source: data.source,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    }

    // Create conversation
    const conversation = await this.conversationRepository.create({
      contactInfoId: contactInfo.id,
      status: ConversationStatus.OPEN,
      priority: Priority.NORMAL,
      source: data.source || "website",
    });

    // Send initial message if provided
    if (data.message) {
      await this.sendMessage({
        conversationId: conversation.id,
        content: data.message,
        isFromVisitor: true,
      });
    }

    // Notify admins of new conversation
    await this.notificationService.notifyNewChatConversation(conversation);

    return {
      conversation: this.sanitizeConversation(conversation),
      contactInfo: this.sanitizeContactInfo(contactInfo),
    };
  }

  async sendMessage(data: SendMessageDto): Promise<MessageResult> {
    const message = await this.messageRepository.create({
      conversationId: data.conversationId,
      content: data.content,
      isFromVisitor: data.isFromVisitor,
      senderUserId: data.senderUserId,
      metadata: data.metadata,
    });

    // Update conversation last message time
    await this.conversationRepository.updateLastMessageTime(
      data.conversationId,
      message.createdAt
    );

    // Send real-time update
    await this.websocketGateway.sendMessageUpdate(message);

    // Send notification if message is from visitor
    if (data.isFromVisitor) {
      await this.notificationService.notifyNewChatMessage(message);
    }

    return {
      message: this.sanitizeMessage(message),
    };
  }

  // Other methods following SOLID principles...
}
```

### **🎨 Frontend Components (Next.js + shadcn/ui)**

```tsx
// ✅ CORRECTED: Next.js 14 + shadcn/ui components
// packages/web/src/components/public/ChatWidget/ChatWidget.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useChat } from "./hooks/useChat";

interface ChatWidgetProps {
  config?: ChatWidgetConfig;
}

export function ChatWidget({ config }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"contact" | "chat">("contact");

  const {
    conversation,
    messages,
    isLoading,
    sendMessage,
    startConversation,
    error,
  } = useChat();

  const handleStartChat = async (contactData: ContactFormData) => {
    try {
      await startConversation(contactData);
      setStep("chat");
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;

    try {
      await sendMessage({
        conversationId: conversation.id,
        content,
        isFromVisitor: true,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isOpen) {
    return (
      <div className='fixed bottom-4 right-4 z-50'>
        <Button
          onClick={() => setIsOpen(true)}
          className='rounded-full w-14 h-14 shadow-lg'
          style={{ backgroundColor: config?.primaryColor || "#007ee6" }}
        >
          <MessageCircle className='h-6 w-6' />
        </Button>
      </div>
    );
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80 h-96'>
      <Card className='h-full flex flex-col shadow-2xl'>
        <CardHeader className='flex-row items-center justify-between p-4'>
          <CardTitle className='text-sm'>
            {config?.title || "Chat with us"}
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={() => setIsOpen(false)}>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent className='flex-1 p-0'>
          {step === "contact" ? (
            <ContactForm
              onSubmit={handleStartChat}
              isLoading={isLoading}
              config={config}
            />
          ) : (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              config={config}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Contact Form Component
function ContactForm({ onSubmit, isLoading, config }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    email: "",
    name: "",
    company: "",
    message: "",
  });

  // Implementation details...
}

// Chat Interface Component
function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  config,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");

  // Implementation details...
}
```

---

## 📅 **TIMELINE CORREGIDO**

### **🔗 Integración con Planning SOLID**

```typescript
// ✅ CORRECTED: Aligned with SOLID implementation
const CHATBOT_IMPLEMENTATION_PLAN = {
  // PREREQUISITE: Complete SOLID principles first
  prerequisites: [
    "SOLID-004: Interface Segregation Principle", // Week 4
    "REFACTOR-003: NotificationService refactoring", // Week 5-6
  ],

  // ACTUAL IMPLEMENTATION: Weeks 11-14
  implementation: {
    week11: [
      "Database models implementation",
      "Backend Chat Service (SOLID-compliant)",
      "tRPC router setup",
      "WebSocket gateway implementation",
    ],
    week12: [
      "Public chat widget (React + shadcn/ui)",
      "Contact form with validation",
      "Real-time messaging interface",
      "Basic admin notifications",
    ],
    week13: [
      "Admin dashboard for conversations",
      "Message management interface",
      "Assignment and status systems",
      "Internal notes functionality",
    ],
    week14: [
      "Advanced features (analytics, branding)",
      "Testing and optimization",
      "Integration with notification system",
      "Performance validation",
    ],
  },
};
```

---

## 🎯 **Feature Flags Integration**

```typescript
// ✅ CORRECTED: Integration with existing feature flags
// packages/shared/src/config/freemium-flags.ts

export const CHATBOT_FEATURE_FLAGS = {
  // Free tier
  basicChat: {
    publicWidget: true,
    contactForm: true,
    messageHistory: 7, // days
    adminNotifications: "in-app",
  },

  // Professional tier
  advancedChat: {
    customBranding: true,
    conversationAssignment: true,
    internalNotes: true,
    emailNotifications: true,
    extendedHistory: 90, // days
    analytics: "basic",
  },

  // Enterprise tier
  enterpriseChat: {
    advancedAnalytics: true,
    customWorkflows: true,
    whiteLabel: true,
    apiIntegration: true,
    unlimitedHistory: true,
    multiLanguage: true,
  },
} as const;
```

---

## ✅ **Criterios de Aceptación (ACTUALIZADOS)**

### **Prerequisitos SOLID**

- [ ] **SOLID-004 completado**: Interface Segregation Principle aplicado
- [ ] **REFACTOR-003 completado**: NotificationService integrado con chat
- [ ] **WebSocket infrastructure**: Sistema de tiempo real preparado

### **Public Chat Widget**

- [ ] **Widget flotante**: Funciona en todas las páginas públicas
- [ ] **Contact form**: Captura email, nombre, empresa, mensaje inicial
- [ ] **Real-time chat**: Mensajes en tiempo real con WebSocket
- [ ] **Responsive design**: Funciona en mobile y desktop
- [ ] **Custom branding**: Colores y textos configurables

### **Admin Dashboard**

- [ ] **Conversation list**: Lista paginada con filtros y búsqueda
- [ ] **Message interface**: Chat interface para responder
- [ ] **Assignment system**: Asignar conversaciones a team members
- [ ] **Status management**: Cambiar estado de conversaciones
- [ ] **Internal notes**: Notas privadas del equipo

### **Real-time Features**

- [ ] **WebSocket integration**: Mensajes en tiempo real
- [ ] **Notifications**: Alertas para nuevos mensajes
- [ ] **Live updates**: Cambios de estado en tiempo real
- [ ] **Typing indicators**: Indicadores de escritura

### **Business Features**

- [ ] **Lead capture**: Información de contacto capturada
- [ ] **Analytics**: Métricas básicas de conversaciones
- [ ] **Feature flags**: Funcionalidades por tier activadas
- [ ] **Performance**: < 500ms load time para widget

---

## 💰 **Business Value & ROI**

### **Revenue Impact**

- **Lead Generation**: 30% increase in website conversions
- **Customer Support**: Reduced support ticket volume
- **Sales Acceleration**: Direct communication with prospects
- **Competitive Advantage**: Professional customer communication

### **Implementation ROI**

```typescript
const CHATBOT_SYSTEM_ROI = {
  developmentCosts: {
    fromScratch: 480, // hours (3 months)
    withLegacyDocs: 152, // hours (19 days)
    timeSaved: 328, // hours
  },

  revenueImpact: {
    conversionIncrease: 0.3, // 30% more conversions
    averageLeadValue: 500, // USD
    monthlyLeads: 100,
    additionalRevenue: 15000, // USD/month
    yearlyRevenue: 180000, // USD/year
  },

  costSavings: {
    supportEfficiency: 0.4, // 40% more efficient
    reducedTickets: 0.2, // 20% fewer support tickets
    teamProductivity: 0.25, // 25% more productive
  },
};
```

---

## 🔗 **Referencias al Proyecto Actual**

- **Legacy Documentation**: [Chatbot Requirements](../../05-guides/legacy-systems/chatbot/public-chatbot-system-requirements.md)
- **SOLID TODOs**: [SOLID-004](../tickets/SOLID-004-ISP.md)
- **Notification Integration**: [REFACTOR-003](../tickets/REFACTOR-003-NOTIFICATION-SERVICE.md)
- **Feature Flags**: [freemium-flags.ts](../../../packages/shared/src/config/freemium-flags.ts)
- **WebSocket Service**: [websocket module](../../../packages/api/src/websocket/)

---

**🎯 Este PRD está basado en:**

- ✅ 522 líneas de documentación legacy completa
- ✅ 7 tickets técnicos detallados y listos
- ✅ Stack tecnológico correcto (Prisma + MongoDB + tRPC)
- ✅ Integración con principios SOLID
- ✅ Feature flags del sistema actual
- ✅ Impacto directo en revenue (lead generation)
