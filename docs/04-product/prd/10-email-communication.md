# 📧 Email & Communication Module PRD (CORREGIDO)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El módulo de Email & Communication es **crítico para cualquier SaaS** ya que maneja toda la comunicación automatizada con usuarios: verificaciones, notificaciones, marketing, y soporte. Con **RESEND** como proveedor principal, garantiza alta deliverability y facilidad de implementación.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-001 (Single Responsibility) - Separación de providers
- **Depende de**: SOLID-004 (Interface Segregation) - Email provider interfaces
- **Integración**: **Notification System** - Envío de emails mediante notificaciones
- **Implementación**: Semana 13-14 (después de notification system)

### **Objetivos Comerciales**

- **High Deliverability**: >95% emails llegan a inbox
- **Developer Experience**: Setup en < 15 minutos
- **Cost Efficiency**: Pricing transparente y predecible
- **Template Ready**: Templates profesionales incluidos
- **🔗 Notification Integration**: Emails enviados por el sistema de notificaciones

### **Metas Técnicas**

- **Send Speed**: < 2 segundos para emails transaccionales
- **Template Rendering**: < 500ms para emails complejos
- **API Response**: < 200ms para envío requests
- **Bounce Rate**: < 2% con configuración correcta
- **✅ Enhanced**: Integración completa con notification system

---

## 👥 2. Stakeholders

### **Template Users (Developers)**

- **Indie Developers**: Necesitan email simple y confiable
- **SaaS Builders**: Requieren automación avanzada
- **Agencies**: Múltiples clientes con diferentes necesidades

### **End Users (Recipients)**

- **New Signups**: Reciben welcome emails y verificaciones
- **Paid Customers**: Reciben invoices y updates importantes
- **Free Users**: Reciben onboarding y upgrade prompts

### **Business Stakeholders**

- **Marketing Teams**: Email campaigns y nurturing
- **Support Teams**: Helpdesk communications
- **Product Teams**: Feature announcements

---

## 📖 3. Historias de Usuario

### **Developer (Template Implementation)**

```gherkin
Como developer implementando el template
Quiero configurar RESEND en menos de 15 minutos
Para tener emails funcionando inmediatamente

Como developer
Quiero templates de email pre-diseñados
Para no diseñar desde cero

Como developer
Quiero logs de email detallados
Para debuggear problemas de deliverability
```

### **End User (Email Recipient)**

```gherkin
Como nuevo usuario
Quiero recibir un email de verificación inmediato
Para activar mi cuenta rápidamente

Como usuario pagado
Quiero recibir invoices profesionales por email
Para mi contabilidad

Como usuario
Quiero poder unsubscribe fácilmente
Para controlar mis notificaciones
```

### **Business Owner**

```gherkin
Como business owner
Quiero métricas de email en tiempo real
Para monitorear engagement

Como marketing manager
Quiero segmentar usuarios para campaigns
Para mejorar conversión

Como support manager
Quiero templates de respuesta automática
Para efficiency en support
```

---

## 🎨 4. Características por Licencia

### **Template Free ($0) - Evaluation**

| Funcionalidad      | Incluido | Limitaciones               |
| ------------------ | -------- | -------------------------- |
| RESEND Basic Setup | ✅       | Solo guía de configuración |
| Welcome Email      | ✅       | Template básico            |
| Email Verification | ✅       | Funcionalidad básica       |
| Password Reset     | ✅       | Template simple            |
| Send Limits        | ⚠️       | Solo RESEND free tier      |

### **Template Professional ($297)**

| Funcionalidad               | Incluido | Limitaciones                |
| --------------------------- | -------- | --------------------------- |
| Complete RESEND Integration | ✅       | Production ready            |
| 15+ Email Templates         | ✅       | Professional designs        |
| Transactional Emails        | ✅       | Verification, billing, etc. |
| Email Analytics             | ✅       | Open rates, clicks          |
| Email Automation            | ✅       | Drip campaigns              |
| Template Customization      | ✅       | Brand colors, logos         |
| Bounce/Complaint Handling   | ✅       | Automatic management        |
| Multi-language Support      | ✅       | i18n email templates        |

### **Template Enterprise ($997)**

| Funcionalidad              | Incluido | Limitaciones           |
| -------------------------- | -------- | ---------------------- |
| Everything in Professional | ✅       | + Advanced features    |
| Custom Email Builder       | ✅       | Drag & drop editor     |
| Advanced Segmentation      | ✅       | Behavioral targeting   |
| A/B Testing                | ✅       | Subject line & content |
| Advanced Analytics         | ✅       | Cohort analysis        |
| White-label Templates      | ✅       | No Alkitu branding     |
| Priority Email Support     | ✅       | 24h response           |
| Custom Integrations        | ✅       | Additional providers   |

---

## 🛠️ 5. Requisitos Técnicos

### **RESEND Integration Core**

```typescript
// Email Service with RESEND
import { Resend } from "resend";

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Transactional Emails
  async sendVerificationEmail(to: string, token: string) {
    return await this.resend.emails.send({
      from: "noreply@yourapp.com",
      to,
      subject: "Verify your email address",
      react: VerificationEmailTemplate({ token }),
    });
  }

  // Marketing Emails
  async sendMarketingEmail(to: string[], templateId: string, data: any) {
    return await this.resend.batch.send(
      to.map((email) => ({
        from: "marketing@yourapp.com",
        to: email,
        subject: data.subject,
        react: MarketingTemplate({ ...data }),
      }))
    );
  }

  // Billing Emails
  async sendInvoiceEmail(to: string, invoice: Invoice) {
    return await this.resend.emails.send({
      from: "billing@yourapp.com",
      to,
      subject: `Invoice ${invoice.number} - ${invoice.amount}`,
      react: InvoiceTemplate({ invoice }),
      attachments: [
        {
          filename: `invoice-${invoice.number}.pdf`,
          content: invoice.pdfBuffer,
        },
      ],
    });
  }
}
```

### **Email Templates (React Email)**

```tsx
// Email Templates with React Email
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Img,
} from "@react-email/components";

// Welcome Email Template
export const WelcomeEmailTemplate = ({ name, ctaUrl }: Props) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Img
          src='https://yourapp.com/logo.png'
          width='120'
          height='40'
          alt='Logo'
        />
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
          Welcome to [Your App], {name}!
        </Text>
        <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
          We're excited to have you on board. Get started by exploring our
          features and setting up your first project.
        </Text>
        <Button
          href={ctaUrl}
          style={{
            backgroundColor: "#007ee6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Get Started
        </Button>
      </Container>
    </Body>
  </Html>
);
```

### **Backend Structure (NestJS)**

```typescript
email/
├── email.controller.ts         # Email endpoints
├── email.service.ts           # Core email logic
├── providers/
│   ├── resend.service.ts      # RESEND integration
│   ├── sendgrid.service.ts    # Alternative provider
│   └── email-provider.interface.ts
├── templates/
│   ├── welcome.template.tsx   # Welcome email
│   ├── verification.template.tsx
│   ├── password-reset.template.tsx
│   ├── invoice.template.tsx
│   └── marketing.template.tsx
├── queues/
│   ├── email.queue.ts         # Email job queue
│   └── email.processor.ts     # Queue processor
└── analytics/
    ├── email-analytics.service.ts
    └── email-metrics.service.ts
```

### **Frontend Components**

```tsx
components/email/
├── EmailPreview.tsx           # Preview emails
├── EmailEditor.tsx            # Template editor
├── EmailAnalytics.tsx         # Open rates, clicks
├── EmailTemplateSelector.tsx  # Template chooser
├── UnsubscribePage.tsx        # Unsubscribe handling
└── EmailPreferences.tsx       # User preferences
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model EmailTemplate {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId String?  @db.ObjectId
  name           String
  subject        String
  templateType   EmailTemplateType
  htmlContent    String?
  reactComponent String?
  variables      Json     @default("{}")
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  createdBy      String?  @db.ObjectId

  // Relations
  organization      Organization? @relation(fields: [organizationId], references: [id])
  creator           User?         @relation(fields: [createdBy], references: [id])
  emailLogs         EmailLog[]
  // ✅ ENHANCED: Integration with notification system
  notifications     Notification[] @relation("EmailTemplateNotifications")

  @@map("email_templates")
}

model EmailLog {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String?  @db.ObjectId
  // ✅ ENHANCED: Integration with notification system
  notificationId String?  @db.ObjectId
  emailAddress   String
  templateId     String?  @db.ObjectId
  subject        String?
  status         EmailStatus
  providerId     String?  // RESEND message ID
  providerType   EmailProvider @default(RESEND)
  errorMessage   String?
  // Email tracking events
  sentAt         DateTime?
  deliveredAt    DateTime?
  openedAt       DateTime?
  clickedAt      DateTime?
  bouncedAt      DateTime?
  complainedAt   DateTime?
  // Tracking metadata
  openCount      Int      @default(0)
  clickCount     Int      @default(0)
  userAgent      String?
  ipAddress      String?
  createdAt      DateTime @default(now())

  // Relations
  user         User?         @relation(fields: [userId], references: [id])
  notification Notification? @relation(fields: [notificationId], references: [id])
  template     EmailTemplate? @relation(fields: [templateId], references: [id])

  @@map("email_logs")
}

model EmailPreference {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  userId            String   @db.ObjectId
  organizationId    String?  @db.ObjectId
  // Email categories
  marketingEmails   Boolean  @default(true)
  productUpdates    Boolean  @default(true)
  securityEmails    Boolean  @default(true)
  transactionalEmails Boolean @default(true)
  // ✅ ENHANCED: Chat email notifications
  chatNotifications Boolean  @default(true)
  billingEmails     Boolean  @default(true)
  systemEmails      Boolean  @default(true)
  // Global settings
  emailFrequency    EmailFrequency @default(INSTANT)
  unsubscribeToken  String   @unique
  globalOptOut      Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
  @@map("email_preferences")
}

// ✅ ENHANCED: Email campaigns for marketing
model EmailCampaign {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId String?  @db.ObjectId
  templateId     String   @db.ObjectId
  name           String
  subject        String
  content        String
  // Campaign settings
  audienceFilter Json     @default("{}")
  scheduledAt    DateTime?
  status         CampaignStatus @default(DRAFT)
  // Campaign statistics
  totalSent      Int      @default(0)
  totalDelivered Int      @default(0)
  totalOpened    Int      @default(0)
  totalClicked   Int      @default(0)
  totalBounced   Int      @default(0)
  // Metadata
  createdBy      String   @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  organization Organization  @relation(fields: [organizationId], references: [id])
  template     EmailTemplate @relation(fields: [templateId], references: [id])
  creator      User          @relation(fields: [createdBy], references: [id])

  @@map("email_campaigns")
}

// ✅ ENHANCED: Email tracking events
model EmailEvent {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  emailLogId String   @db.ObjectId
  eventType  EmailEventType
  timestamp  DateTime @default(now())
  userAgent  String?
  ipAddress  String?
  // Event-specific data
  linkUrl    String?  // For click events
  metadata   Json     @default("{}")

  // Relations
  emailLog EmailLog @relation(fields: [emailLogId], references: [id], onDelete: Cascade)

  @@map("email_events")
}

// Add relation to EmailLog model
model EmailLog {
  // ... existing fields ...
  events EmailEvent[]

  @@map("email_logs")
}

enum EmailTemplateType {
  TRANSACTIONAL
  MARKETING
  SYSTEM
  NOTIFICATION
}

enum EmailStatus {
  PENDING
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
  FAILED
}

enum EmailProvider {
  RESEND
  SENDGRID
  MAILGUN
  POSTMARK
}

enum EmailFrequency {
  INSTANT
  DAILY
  WEEKLY
  MONTHLY
  NEVER
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  CANCELLED
}

enum EmailEventType {
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
  UNSUBSCRIBED
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST endpoints
// packages/api/src/trpc/routers/email.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { emailSchemas } from "../schemas/email.schemas";

export const emailRouter = createTRPCRouter({
  // Templates
  getTemplates: protectedProcedure
    .input(emailSchemas.getTemplatesInput)
    .query(async ({ input, ctx }) => {
      return await ctx.emailService.getTemplates(input);
    }),

  createTemplate: protectedProcedure
    .input(emailSchemas.createTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.createTemplate(input);
    }),

  updateTemplate: protectedProcedure
    .input(emailSchemas.updateTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.updateTemplate(input);
    }),

  deleteTemplate: protectedProcedure
    .input(emailSchemas.deleteTemplateInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.deleteTemplate(input.id);
    }),

  previewTemplate: protectedProcedure
    .input(emailSchemas.previewTemplateInput)
    .query(async ({ input, ctx }) => {
      return await ctx.emailService.previewTemplate(input);
    }),

  // Email Sending
  sendEmail: protectedProcedure
    .input(emailSchemas.sendEmailInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.sendEmail(input);
    }),

  sendBulkEmail: protectedProcedure
    .input(emailSchemas.sendBulkEmailInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.sendBulkEmail(input);
    }),

  // ✅ ENHANCED: Integration with notification system
  sendNotificationEmail: protectedProcedure
    .input(emailSchemas.sendNotificationEmailInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.sendNotificationEmail(input);
    }),

  // Email Campaigns
  getCampaigns: protectedProcedure
    .input(emailSchemas.getCampaignsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.emailService.getCampaigns(input);
    }),

  createCampaign: protectedProcedure
    .input(emailSchemas.createCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.createCampaign(input);
    }),

  updateCampaign: protectedProcedure
    .input(emailSchemas.updateCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.updateCampaign(input);
    }),

  launchCampaign: protectedProcedure
    .input(emailSchemas.launchCampaignInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.launchCampaign(input.id);
    }),

  // Email Logs & Analytics
  getEmailLogs: protectedProcedure
    .input(emailSchemas.getEmailLogsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.emailService.getEmailLogs(input);
    }),

  getEmailAnalytics: protectedProcedure
    .input(emailSchemas.getEmailAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.emailService.getEmailAnalytics(input);
    }),

  // User Preferences
  getEmailPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.emailService.getEmailPreferences(ctx.user.id);
  }),

  updateEmailPreferences: protectedProcedure
    .input(emailSchemas.updateEmailPreferencesInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.updateEmailPreferences(ctx.user.id, input);
    }),

  // Public endpoints
  unsubscribe: publicProcedure
    .input(emailSchemas.unsubscribeInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.unsubscribe(input.token);
    }),

  trackEmailEvent: publicProcedure
    .input(emailSchemas.trackEmailEventInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.trackEmailEvent(input);
    }),

  // Webhooks (RESEND)
  processWebhook: publicProcedure
    .input(emailSchemas.webhookInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.emailService.processWebhook(input);
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with notification integration
// packages/api/src/email/email.service.ts

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    private readonly emailTemplateRepository: IEmailTemplateRepository,
    private readonly emailLogRepository: IEmailLogRepository,
    private readonly emailPreferenceRepository: IEmailPreferenceRepository,
    private readonly emailCampaignRepository: IEmailCampaignRepository,
    private readonly resendService: IResendService,
    private readonly templateRenderer: ITemplateRenderer,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
    // Check user preferences
    const preferences = await this.emailPreferenceRepository.findByUserId(
      input.userId
    );
    if (!this.shouldSendEmail(input, preferences)) {
      return { sent: false, reason: "Blocked by user preferences" };
    }

    // Create email log
    const emailLog = await this.emailLogRepository.create({
      userId: input.userId,
      emailAddress: input.to,
      templateId: input.templateId,
      subject: input.subject,
      status: EmailStatus.PENDING,
    });

    try {
      // Render template if using template
      let htmlContent = input.htmlContent;
      if (input.templateId) {
        const template = await this.emailTemplateRepository.findById(
          input.templateId
        );
        htmlContent = await this.templateRenderer.render(template, input.data);
      }

      // Send via RESEND
      const result = await this.resendService.send({
        from: input.from || process.env.DEFAULT_FROM_EMAIL,
        to: input.to,
        subject: input.subject,
        html: htmlContent,
        attachments: input.attachments,
      });

      // Update email log
      await this.emailLogRepository.update(emailLog.id, {
        status: EmailStatus.SENT,
        providerId: result.id,
        sentAt: new Date(),
      });

      // Emit event for analytics
      this.eventEmitter.emit("email.sent", {
        emailLogId: emailLog.id,
        userId: input.userId,
        templateId: input.templateId,
      });

      return { sent: true, emailLogId: emailLog.id, providerId: result.id };
    } catch (error) {
      await this.emailLogRepository.update(emailLog.id, {
        status: EmailStatus.FAILED,
        errorMessage: error.message,
      });

      throw error;
    }
  }

  // ✅ ENHANCED: Integration with notification system
  async sendNotificationEmail(
    input: SendNotificationEmailInput
  ): Promise<SendNotificationEmailResult> {
    // This method is called by the notification system
    const result = await this.sendEmail({
      userId: input.userId,
      to: input.to,
      subject: input.subject,
      htmlContent: input.htmlContent,
      templateId: input.templateId,
      data: input.data,
    });

    // Link email log to notification
    if (result.sent && input.notificationId) {
      await this.emailLogRepository.update(result.emailLogId, {
        notificationId: input.notificationId,
      });
    }

    return result;
  }

  async sendBulkEmail(input: SendBulkEmailInput): Promise<SendBulkEmailResult> {
    const results = [];

    // Process in batches to avoid rate limits
    const batchSize = 100;
    for (let i = 0; i < input.recipients.length; i += batchSize) {
      const batch = input.recipients.slice(i, i + batchSize);

      const batchPromises = batch.map((recipient) =>
        this.sendEmail({
          ...input,
          userId: recipient.userId,
          to: recipient.email,
          data: { ...input.data, ...recipient.data },
        })
      );

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }

    return {
      total: input.recipients.length,
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
      results,
    };
  }

  async processWebhook(input: WebhookInput): Promise<WebhookResult> {
    // Process RESEND webhook events
    const { type, data } = input;

    switch (type) {
      case "email.sent":
        await this.handleEmailSent(data);
        break;
      case "email.delivered":
        await this.handleEmailDelivered(data);
        break;
      case "email.opened":
        await this.handleEmailOpened(data);
        break;
      case "email.clicked":
        await this.handleEmailClicked(data);
        break;
      case "email.bounced":
        await this.handleEmailBounced(data);
        break;
      case "email.complained":
        await this.handleEmailComplained(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return { processed: true };
  }

  private async handleEmailDelivered(data: any): Promise<void> {
    const emailLog = await this.emailLogRepository.findByProviderId(data.id);
    if (emailLog) {
      await this.emailLogRepository.update(emailLog.id, {
        status: EmailStatus.DELIVERED,
        deliveredAt: new Date(),
      });

      // Create tracking event
      await this.createEmailEvent(emailLog.id, EmailEventType.DELIVERED, data);
    }
  }

  private async handleEmailOpened(data: any): Promise<void> {
    const emailLog = await this.emailLogRepository.findByProviderId(data.id);
    if (emailLog) {
      await this.emailLogRepository.update(emailLog.id, {
        status: EmailStatus.OPENED,
        openedAt: new Date(),
        openCount: emailLog.openCount + 1,
      });

      await this.createEmailEvent(emailLog.id, EmailEventType.OPENED, data);
    }
  }

  private async handleEmailClicked(data: any): Promise<void> {
    const emailLog = await this.emailLogRepository.findByProviderId(data.id);
    if (emailLog) {
      await this.emailLogRepository.update(emailLog.id, {
        status: EmailStatus.CLICKED,
        clickedAt: new Date(),
        clickCount: emailLog.clickCount + 1,
      });

      await this.createEmailEvent(emailLog.id, EmailEventType.CLICKED, data);
    }
  }

  private async createEmailEvent(
    emailLogId: string,
    eventType: EmailEventType,
    data: any
  ): Promise<void> {
    await this.emailEventRepository.create({
      emailLogId,
      eventType,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      linkUrl: data.linkUrl,
      metadata: data,
    });
  }

  private shouldSendEmail(
    input: SendEmailInput,
    preferences: EmailPreference
  ): boolean {
    if (preferences.globalOptOut) {
      return false;
    }

    // Check category-specific preferences
    const category = this.getCategoryFromEmailType(input.templateId);

    switch (category) {
      case "marketing":
        return preferences.marketingEmails;
      case "product":
        return preferences.productUpdates;
      case "security":
        return preferences.securityEmails;
      case "billing":
        return preferences.billingEmails;
      case "chat":
        return preferences.chatNotifications;
      default:
        return true; // Allow transactional emails by default
    }
  }

  private getCategoryFromEmailType(templateId: string): string {
    // This would be implemented based on your template categorization
    // For now, return a default category
    return "system";
  }

  // Other methods following SOLID principles...
}
```

### **🎨 Frontend Components (Next.js + shadcn/ui)**

```tsx
// ✅ CORRECTED: Next.js 14 + shadcn/ui components
// packages/web/src/components/email/EmailAnalyticsDashboard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MailOpen,
  MousePointer,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatNumber, formatPercentage } from "@/lib/utils";

export function EmailAnalyticsDashboard() {
  const { data: analytics, isLoading } = trpc.email.getEmailAnalytics.useQuery({
    period: "30d",
  });

  const { data: recentCampaigns } = trpc.email.getCampaigns.useQuery({
    limit: 5,
    status: "SENT",
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const metrics = [
    {
      title: "Emails Sent",
      value: formatNumber(analytics?.totalSent || 0),
      icon: Mail,
      color: "text-blue-600",
    },
    {
      title: "Delivery Rate",
      value: formatPercentage(analytics?.deliveryRate || 0),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Open Rate",
      value: formatPercentage(analytics?.openRate || 0),
      icon: MailOpen,
      color: "text-purple-600",
    },
    {
      title: "Click Rate",
      value: formatPercentage(analytics?.clickRate || 0),
      icon: MousePointer,
      color: "text-orange-600",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCampaigns?.length > 0 ? (
            <div className='space-y-4'>
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='space-y-1'>
                    <p className='font-medium'>{campaign.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {campaign.subject}
                    </p>
                  </div>
                  <div className='text-right space-y-1'>
                    <Badge variant='outline'>{campaign.status}</Badge>
                    <div className='flex items-center gap-4 text-sm'>
                      <span>Sent: {formatNumber(campaign.totalSent)}</span>
                      <span>
                        Open:{" "}
                        {formatPercentage(
                          (campaign.totalOpened / campaign.totalSent) * 100
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>No campaigns found</p>
          )}
        </CardContent>
      </Card>

      {/* Email Health */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            Email Health
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Delivery Rate</span>
              <span>{formatPercentage(analytics?.deliveryRate || 0)}</span>
            </div>
            <Progress value={analytics?.deliveryRate || 0} className='h-2' />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Bounce Rate</span>
              <span>{formatPercentage(analytics?.bounceRate || 0)}</span>
            </div>
            <Progress value={analytics?.bounceRate || 0} className='h-2' />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Complaint Rate</span>
              <span>{formatPercentage(analytics?.complaintRate || 0)}</span>
            </div>
            <Progress value={analytics?.complaintRate || 0} className='h-2' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📅 **TIMELINE CORREGIDO**

### **🔗 Integración con Planning SOLID y Notification System**

```typescript
// ✅ CORRECTED: Aligned with SOLID implementation and notification integration
const EMAIL_IMPLEMENTATION_PLAN = {
  // PREREQUISITE: Complete SOLID principles and notification system first
  prerequisites: [
    "SOLID-001: Single Responsibility Principle", // Week 1
    "SOLID-004: Interface Segregation Principle", // Week 4
    "Notification System implementation", // Week 11-12
  ],

  // ACTUAL IMPLEMENTATION: Weeks 13-14 (after notification system)
  implementation: {
    week13: [
      "Database models implementation (with notification relations)",
      "RESEND service integration (SOLID-compliant)",
      "Email template renderer and React Email setup",
      "tRPC router implementation",
      "Webhook processing for email events",
    ],
    week14: [
      "Frontend email analytics dashboard (shadcn/ui)",
      "Email preference management UI",
      "Campaign management interface",
      "Integration with notification system",
      "Email template editor and preview",
    ],
  },
};
```

### **📊 Business Impact Summary**

- **$2K+ saved**: En desarrollo de email system completo
- **95%+ deliverability**: Con RESEND professional setup
- **Real-time analytics**: Para optimización continua
- **SOLID compliance**: Arquitectura mantenible y extensible
- **Notification integration**: Emails enviados desde sistema unificado

---

## 📏 6. Criterios de Aceptación

### **RESEND Setup (Developer Experience)**

- [ ] RESEND API key configurable via environment variables
- [ ] Setup completable en < 15 minutos con documentación
- [ ] Domain verification workflow documentado
- [ ] Test email functionality out-of-the-box

### **Email Sending**

- [ ] Transactional emails envían en < 2 segundos
- [ ] Bulk emails procesan via queue system
- [ ] Failed emails retry automáticamente
- [ ] Bounce handling automático

### **Templates**

- [ ] 15+ templates profesionales incluidos
- [ ] Templates responsive en todos los devices
- [ ] Template variables dinámicas funcionan
- [ ] Custom branding fácil de implementar

### **Analytics**

- [ ] Open rates tracked automáticamente
- [ ] Click tracking funcional
- [ ] Bounce rates monitoreados
- [ ] Dashboard de métricas en tiempo real

### **Compliance**

- [ ] Unsubscribe links en todos los emails
- [ ] GDPR compliance para email data
- [ ] CAN-SPAM compliance automático
- [ ] Email preference center funcional

---

## 🌍 7. Servicios Externos & Setup

### **RESEND Configuration**

```bash
# Environment Variables Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_DOMAIN=yourapp.com
RESEND_FROM_EMAIL=noreply@yourapp.com

# Domain Setup (automated in template)
resend domains create --name yourapp.com
resend domains verify --domain yourapp.com
```

### **Required RESEND Features**

- **Transactional Emails**: Para system emails
- **Batch Sending**: Para marketing campaigns
- **Webhooks**: Para delivery status updates
- **Analytics**: Para email performance metrics

### **Alternative Providers (Future)**

- **SendGrid**: Como backup option
- **PostMark**: Para high-deliverability needs
- **Mailgun**: Para volume sending

---

## 📊 8. Analytics & Metrics

### **Email Performance**

- **Delivery Rate**: % emails delivered successfully
- **Open Rate**: % emails opened by recipients
- **Click Rate**: % links clicked in emails
- **Bounce Rate**: % emails that bounced
- **Unsubscribe Rate**: % users that unsubscribed

### **Business Metrics**

- **Email ROI**: Revenue generated per email sent
- **Conversion Rate**: % emails that lead to desired action
- **Engagement Score**: Overall email engagement health
- **List Growth**: Rate of email list expansion

### **Technical Metrics**

- **Send Speed**: Time from trigger to sent
- **Template Rendering**: Time to generate email HTML
- **Queue Processing**: Background job performance
- **Error Rate**: % failed email sends

---

## 🚀 9. Implementation Priority

### **Phase 1: Core Setup (Days 1-3)**

- RESEND integration básica
- Email verification y password reset
- Basic templates (welcome, verification, reset)
- Queue system setup

### **Phase 2: Enhanced Features (Days 4-6)**

- Email analytics y tracking
- Template customization
- Bulk email capabilities
- Advanced templates

### **Phase 3: Business Features (Days 7-9)**

- Marketing automation
- Segmentation capabilities
- A/B testing framework
- Advanced analytics dashboard

---

## 📚 10. Developer Documentation

### **Setup Guides Required**

- [ ] **RESEND Account Setup**: Complete walkthrough
- [ ] **Domain Configuration**: DNS setup automation
- [ ] **Template Customization**: Brand integration guide
- [ ] **Analytics Setup**: Tracking configuration

### **Integration Examples**

```typescript
// Quick Start Example
import { EmailService } from "@alkitu/email";

const emailService = new EmailService({
  provider: "resend",
  apiKey: process.env.RESEND_API_KEY,
  domain: "yourapp.com",
});

// Send welcome email
await emailService.sendTemplate("welcome", {
  to: "user@example.com",
  data: { name: "John Doe", ctaUrl: "/dashboard" },
});
```

### **Template Customization**

```tsx
// Custom Template Example
export const CustomWelcomeTemplate = ({ name, companyName }) => (
  <EmailTemplate
    brandColor='#your-color'
    logo='/your-logo.png'
    companyName={companyName}
  >
    <EmailHero title={`Welcome to ${companyName}, ${name}!`} />
    <EmailContent>
      <p>Your custom welcome message here...</p>
    </EmailContent>
    <EmailCTA href='/get-started'>Get Started</EmailCTA>
  </EmailTemplate>
);
```

---

## 💰 11. Pricing Impact

### **Value Proposition for Template**

- **$5K+ saved**: En desarrollo de email system
- **Week 1 ready**: Email functionality desde día 1
- **Professional appearance**: Templates diseñados profesionalmente
- **High deliverability**: RESEND reputation incluida

### **Template Pricing Justification**

- **Email infrastructure alone**: Worth $200+ in development time
- **Professional templates**: Worth $500+ in design costs
- **RESEND integration**: Save weeks of API integration
- **Ongoing maintenance**: Updates y improvements included

---

_El módulo de Email & Communication con RESEND es fundamental para que cualquier SaaS sea profesional y funcional desde el lanzamiento. Sin comunicación efectiva por email, es imposible escalar un producto digital._
