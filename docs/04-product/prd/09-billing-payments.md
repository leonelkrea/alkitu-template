# 💳 Billing & Payments Module PRD (CORREGIDO)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El módulo de billing y pagos es el **corazón comercial** del template Alkitu, proporcionando un sistema completo de monetización con Stripe como proveedor principal, diseñado para que developers puedan lanzar productos SaaS rentables inmediatamente.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-003 (Liskov Substitution Principle) - Interfaces de pago intercambiables
- **Relacionado con**: REFACTOR-004 (EmailService) - Notificaciones de billing
- **Implementación**: Semana 17-18 (después de completar notification system)

### **Objetivos Comerciales**

- **Revenue Generation**: Monetización desde día 1
- **Subscription Management**: Gestión completa de suscripciones
- **Global Payments**: Soporte para 135+ monedas
- **Developer-Friendly**: Setup en < 30 minutos

### **Metas Técnicas**

- **PCI Compliance**: Automático con Stripe
- **99.99% Uptime**: Procesamiento de pagos confiable
- **< 3 seconds**: Tiempo de procesamiento de pagos
- **0% Revenue Loss**: Por errores técnicos

---

## 👥 2. Stakeholders

### **Usuarios Finales**

- **End Customers**: Usuarios que pagan por el producto
- **Developers**: Que implementan el template
- **Business Owners**: Que monetizan sus productos

### **Compradores (Template)**

- **Indie Developers**: Developers independientes
- **Small Teams**: Equipos de 2-10 personas
- **Agencies**: Agencias que desarrollan para clientes
- **Entrepreneurs**: Emprendedores lanzando SaaS

### **Stakeholders Técnicos**

- **Finance Teams**: Contabilidad y reportes
- **Tax Advisors**: Compliance fiscal
- **Payment Processors**: Stripe, PayPal (futuro)

---

## 📖 3. Historias de Usuario

### **Por Rol**

#### **Developer (Template User)**

```gherkin
Como developer usando el template
Quiero configurar Stripe en < 30 minutos
Para empezar a cobrar inmediatamente

Como developer
Quiero documentación completa de setup
Para evitar errores de configuración

Como developer
Quiero templates de emails de billing
Para comunicación profesional con customers
```

#### **End Customer (Paga el SaaS)**

```gherkin
Como customer
Quiero actualizar mi plan fácilmente
Para escalar según mis necesidades

Como customer
Quiero ver mi historial de pagos
Para tener control de mis gastos

Como customer
Quiero cancelar mi suscripción si quiero
Para tener flexibilidad total
```

#### **Business Owner (Monetiza)**

```gherkin
Como business owner
Quiero dashboard de revenue en tiempo real
Para monitorear el crecimiento del negocio

Como business owner
Quiero reportes fiscales automáticos
Para compliance con regulaciones

Como business owner
Quiero métricas de churn y LTV
Para optimizar el negocio
```

---

## 🎨 4. Características por Licencia

### **Template Free ($0) - Para Evaluation**

| Funcionalidad       | Incluido | Limitaciones                  |
| ------------------- | -------- | ----------------------------- |
| Stripe Setup Guide  | ✅       | Solo documentación            |
| Basic Payment Forms | ✅       | Watermark "Powered by Alkitu" |
| Test Mode           | ✅       | Solo ambiente de pruebas      |
| Basic Analytics     | ✅       | Datos limitados               |

### **Template Premium ($297 one-time)**

| Funcionalidad               | Incluido | Limitaciones            |
| --------------------------- | -------- | ----------------------- |
| Complete Stripe Integration | ✅       | Production ready        |
| Subscription Management     | ✅       | Todos los planes        |
| Invoice Generation          | ✅       | PDF automático          |
| Tax Calculation             | ✅       | Global tax support      |
| Dunning Management          | ✅       | Failed payment recovery |
| Revenue Analytics           | ✅       | Dashboard completo      |
| Email Templates             | ✅       | 20+ templates           |
| Multi-Currency              | ✅       | 135+ currencies         |

### **Template Enterprise ($997 one-time)**

| Funcionalidad           | Incluido | Limitaciones          |
| ----------------------- | -------- | --------------------- |
| Everything in Premium   | ✅       | + Additional features |
| Custom Checkout Flows   | ✅       | Branded experience    |
| Advanced Analytics      | ✅       | Cohort analysis, LTV  |
| Multi-Payment Providers | ✅       | Stripe + PayPal + más |
| White-label Solution    | ✅       | Sin branding Alkitu   |
| Priority Support        | ✅       | 24h response time     |
| Custom Development      | ✅       | 10 hours included     |

---

## 🛠️ 5. Requisitos Técnicos

### **Stripe Integration**

```typescript
// Core Stripe Service
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  // Subscription Management
  async createSubscription(customerId: string, priceId: string) {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
  }

  // Usage-based Billing
  async reportUsage(subscriptionItemId: string, quantity: number) {
    return await this.stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      { quantity, timestamp: Math.floor(Date.now() / 1000) }
    );
  }
}
```

### **Payment Models Support**

- **One-time Payments**: Para productos únicos
- **Recurring Subscriptions**: Mensual/Anual con descuentos
- **Usage-based Billing**: Por uso/consumo
- **Tiered Pricing**: Precios escalonados
- **Add-ons**: Funcionalidades adicionales

### **Backend Structure (NestJS)**

```typescript
billing/
├── billing.controller.ts       # REST endpoints
├── billing.service.ts          # Business logic
├── stripe/
│   ├── stripe.service.ts       # Stripe integration
│   ├── webhook.controller.ts   # Stripe webhooks
│   └── stripe.module.ts        # Stripe module
├── subscriptions/
│   ├── subscription.service.ts # Subscription logic
│   └── subscription.entity.ts  # Database model
├── invoices/
│   ├── invoice.service.ts      # Invoice generation
│   └── pdf.service.ts          # PDF generation
└── analytics/
    ├── revenue.service.ts      # Revenue analytics
    └── metrics.service.ts      # Business metrics
```

### **Frontend Components (React)**

```tsx
components/billing/
├── PaymentForm.tsx             # Stripe Elements
├── PlanSelector.tsx            # Plan selection
├── BillingHistory.tsx          # Payment history
├── InvoiceViewer.tsx           # Invoice display
├── UsageMetrics.tsx            # Usage tracking
├── PaymentMethods.tsx          # Saved payment methods
└── CancelFlow.tsx              # Cancellation flow
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model Customer {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  userId           String   @db.ObjectId
  stripeCustomerId String   @unique
  billingEmail     String?
  taxId            String?
  taxRates         Json?    // Tax rates by region
  address          Json?    // Billing address
  metadata         Json?    // Additional customer data
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscriptions Subscription[]
  invoices      Invoice[]
  paymentMethods PaymentMethod[]

  @@map("customers")
}

model Subscription {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId
  customerId            String   @db.ObjectId
  stripeSubscriptionId  String   @unique
  status                SubscriptionStatus
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  planId                String   // References to plan/price
  quantity              Int      @default(1)
  trialStart            DateTime?
  trialEnd              DateTime?
  cancelAtPeriodEnd     Boolean  @default(false)
  canceledAt            DateTime?
  endedAt               DateTime?
  metadata              Json?    // Additional subscription data
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relations
  customer     Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  invoices     Invoice[]
  usageRecords UsageRecord[]

  @@map("subscriptions")
}

model Invoice {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  customerId      String   @db.ObjectId
  subscriptionId  String?  @db.ObjectId
  stripeInvoiceId String   @unique
  amountDue       Int      // Amount in cents
  amountPaid      Int      // Amount paid in cents
  currency        String   @default("usd")
  status          InvoiceStatus
  description     String?
  invoiceNumber   String?
  hostedInvoiceUrl String?
  invoicePdf      String?
  paidAt          DateTime?
  dueDate         DateTime?
  periodStart     DateTime
  periodEnd       DateTime
  metadata        Json?    // Additional invoice data
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  customer     Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])
  lineItems    InvoiceLineItem[]

  @@map("invoices")
}

model InvoiceLineItem {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  invoiceId   String   @db.ObjectId
  description String
  amount      Int      // Amount in cents
  currency    String   @default("usd")
  quantity    Int      @default(1)
  unitAmount  Int      // Unit amount in cents
  metadata    Json?    // Additional line item data
  createdAt   DateTime @default(now())

  // Relations
  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@map("invoice_line_items")
}

model PaymentMethod {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  customerId         String   @db.ObjectId
  stripePaymentMethodId String @unique
  type               PaymentMethodType
  cardBrand          String?
  cardLast4          String?
  cardExpMonth       Int?
  cardExpYear        Int?
  isDefault          Boolean  @default(false)
  metadata           Json?    // Additional payment method data
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Relations
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@map("payment_methods")
}

model UsageRecord {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  subscriptionId String   @db.ObjectId
  quantity       Int      // Usage quantity
  timestamp      DateTime
  action         String?  // What action generated this usage
  metadata       Json?    // Additional usage data
  createdAt      DateTime @default(now())

  // Relations
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@map("usage_records")
}

model Plan {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  stripePriceId String   @unique
  name          String
  description   String?
  amount        Int      // Amount in cents
  currency      String   @default("usd")
  interval      String   // month, year
  intervalCount Int      @default(1)
  trialDays     Int?     // Trial period in days
  isActive      Boolean  @default(true)
  features      Json?    // Plan features
  metadata      Json?    // Additional plan data
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("plans")
}

model WebhookEvent {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  stripeEventId   String   @unique
  eventType       String   // stripe event type
  processed       Boolean  @default(false)
  processingError String?  // Error message if processing failed
  data            Json     // Raw webhook data
  createdAt       DateTime @default(now())
  processedAt     DateTime?

  @@map("webhook_events")
}

enum SubscriptionStatus {
  INCOMPLETE
  INCOMPLETE_EXPIRED
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}

enum InvoiceStatus {
  DRAFT
  OPEN
  PAID
  UNCOLLECTIBLE
  VOID
}

enum PaymentMethodType {
  CARD
  BANK_ACCOUNT
  SEPA_DEBIT
  IDEAL
  PAYPAL
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST controllers
// packages/api/src/trpc/routers/billing.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { billingSchemas } from "../schemas/billing.schemas";

export const billingRouter = createTRPCRouter({
  // Customer Management
  createCustomer: protectedProcedure
    .input(billingSchemas.createCustomerInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.createCustomer(input);
    }),

  getCustomer: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.billingService.getCustomer(ctx.user.id);
  }),

  updateCustomer: protectedProcedure
    .input(billingSchemas.updateCustomerInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.updateCustomer(ctx.user.id, input);
    }),

  // Subscription Management
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.billingService.getSubscriptions(ctx.user.id);
  }),

  createSubscription: protectedProcedure
    .input(billingSchemas.createSubscriptionInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.createSubscription({
        ...input,
        userId: ctx.user.id,
      });
    }),

  updateSubscription: protectedProcedure
    .input(billingSchemas.updateSubscriptionInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.updateSubscription(input);
    }),

  cancelSubscription: protectedProcedure
    .input(billingSchemas.cancelSubscriptionInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.cancelSubscription(input);
    }),

  // Payment Methods
  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.billingService.getPaymentMethods(ctx.user.id);
  }),

  addPaymentMethod: protectedProcedure
    .input(billingSchemas.addPaymentMethodInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.addPaymentMethod(ctx.user.id, input);
    }),

  removePaymentMethod: protectedProcedure
    .input(billingSchemas.removePaymentMethodInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.removePaymentMethod(
        input.paymentMethodId
      );
    }),

  setDefaultPaymentMethod: protectedProcedure
    .input(billingSchemas.setDefaultPaymentMethodInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.setDefaultPaymentMethod(
        input.paymentMethodId
      );
    }),

  // Invoices
  getInvoices: protectedProcedure
    .input(billingSchemas.getInvoicesInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getInvoices(ctx.user.id, input);
    }),

  getInvoice: protectedProcedure
    .input(billingSchemas.getInvoiceInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getInvoice(input.invoiceId);
    }),

  downloadInvoice: protectedProcedure
    .input(billingSchemas.downloadInvoiceInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.downloadInvoice(input.invoiceId);
    }),

  // Usage Tracking
  reportUsage: protectedProcedure
    .input(billingSchemas.reportUsageInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.reportUsage(input);
    }),

  getUsage: protectedProcedure
    .input(billingSchemas.getUsageInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getUsage(ctx.user.id, input);
    }),

  // Plans
  getPlans: publicProcedure.query(async ({ ctx }) => {
    return await ctx.billingService.getPlans();
  }),

  getPlan: publicProcedure
    .input(billingSchemas.getPlanInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getPlan(input.planId);
    }),

  // Admin endpoints
  createPlan: protectedProcedure
    .input(billingSchemas.createPlanInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.createPlan(input);
    }),

  updatePlan: protectedProcedure
    .input(billingSchemas.updatePlanInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.updatePlan(input);
    }),

  // Webhooks (handled separately in REST controller)
  processWebhook: publicProcedure
    .input(billingSchemas.webhookInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.billingService.processWebhook(input);
    }),

  // Analytics
  getRevenue: protectedProcedure
    .input(billingSchemas.getRevenueInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getRevenue(input);
    }),

  getMetrics: protectedProcedure
    .input(billingSchemas.getMetricsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.billingService.getMetrics(input);
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with proper interfaces
// packages/api/src/billing/billing.service.ts

@Injectable()
export class BillingService implements IBillingService {
  constructor(
    private readonly stripeService: IStripeService,
    private readonly customerRepository: ICustomerRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly paymentMethodRepository: IPaymentMethodRepository,
    private readonly planRepository: IPlanRepository,
    private readonly usageRepository: IUsageRepository,
    private readonly notificationService: INotificationService,
    private readonly emailService: IEmailService
  ) {}

  async createCustomer(
    input: CreateCustomerInput
  ): Promise<CreateCustomerResult> {
    // Create Stripe customer
    const stripeCustomer = await this.stripeService.customers.create({
      email: input.billingEmail,
      name: input.name,
      metadata: {
        userId: input.userId,
        organizationId: input.organizationId,
      },
    });

    // Save to database
    const customer = await this.customerRepository.create({
      userId: input.userId,
      stripeCustomerId: stripeCustomer.id,
      billingEmail: input.billingEmail,
      taxId: input.taxId,
      address: input.address,
    });

    return {
      customer: this.sanitizeCustomer(customer),
      stripeCustomer,
    };
  }

  async createSubscription(
    input: CreateSubscriptionInput
  ): Promise<CreateSubscriptionResult> {
    const customer = await this.customerRepository.findByUserId(input.userId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Create Stripe subscription
    const stripeSubscription = await this.stripeService.subscriptions.create({
      customer: customer.stripeCustomerId,
      items: [{ price: input.planId }],
      trial_period_days: input.trialDays,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // Save to database
    const subscription = await this.subscriptionRepository.create({
      customerId: customer.id,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status as SubscriptionStatus,
      currentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      planId: input.planId,
      quantity: input.quantity || 1,
      trialStart: stripeSubscription.trial_start
        ? new Date(stripeSubscription.trial_start * 1000)
        : null,
      trialEnd: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
    });

    // Send notification
    await this.notificationService.sendSubscriptionCreatedNotification(
      subscription
    );

    return {
      subscription: this.sanitizeSubscription(subscription),
      stripeSubscription,
    };
  }

  async processWebhook(input: WebhookInput): Promise<WebhookResult> {
    const sig = input.signature;
    const payload = input.payload;

    let event;
    try {
      event = this.stripeService.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Save webhook event
    await this.saveWebhookEvent(event);

    // Process event
    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await this.handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleInvoicePaymentSucceeded(invoice: any): Promise<void> {
    // Update invoice in database
    await this.invoiceRepository.updateByStripeId(invoice.id, {
      status: "PAID" as InvoiceStatus,
      paidAt: new Date(invoice.status_transitions.paid_at * 1000),
      amountPaid: invoice.amount_paid,
    });

    // Send receipt email
    const customer = await this.customerRepository.findByStripeId(
      invoice.customer
    );
    if (customer) {
      await this.emailService.sendInvoiceReceipt(customer, invoice);
    }
  }

  private async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    // Update invoice in database
    await this.invoiceRepository.updateByStripeId(invoice.id, {
      status: "OPEN" as InvoiceStatus,
    });

    // Send payment failed notification
    const customer = await this.customerRepository.findByStripeId(
      invoice.customer
    );
    if (customer) {
      await this.notificationService.sendPaymentFailedNotification(
        customer,
        invoice
      );
    }
  }

  // Other methods following SOLID principles...
}
```

### **🎨 Frontend Components (Next.js + shadcn/ui)**

```tsx
// ✅ CORRECTED: Next.js 14 + shadcn/ui components
// packages/web/src/components/billing/BillingDashboard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate } from "@/lib/utils";

export function BillingDashboard() {
  const { data: customer, isLoading: customerLoading } =
    trpc.billing.getCustomer.useQuery();
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    trpc.billing.getSubscriptions.useQuery();
  const { data: invoices, isLoading: invoicesLoading } =
    trpc.billing.getInvoices.useQuery({
      limit: 10,
    });

  if (customerLoading || subscriptionsLoading || invoicesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5' />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions?.length > 0 ? (
            <div className='space-y-4'>
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='font-medium'>{subscription.plan?.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatCurrency(
                        subscription.plan?.amount,
                        subscription.plan?.currency
                      )}
                      /{subscription.plan?.interval}
                    </p>
                  </div>
                  <div className='text-right'>
                    <Badge
                      variant={
                        subscription.status === "ACTIVE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {subscription.status}
                    </Badge>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Next billing: {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>No active subscription</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices?.length > 0 ? (
            <div className='space-y-4'>
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='font-medium'>
                      Invoice #{invoice.invoiceNumber}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={
                        invoice.status === "PAID" ? "default" : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <span className='font-medium'>
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </span>
                    {invoice.invoicePdf && (
                      <Button variant='ghost' size='sm'>
                        <Download className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>No invoices found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📏 6. Criterios de Aceptación

### **Setup para Developers**

- [ ] Stripe setup completable en < 30 minutos
- [ ] Variables de entorno claramente documentadas
- [ ] Webhook endpoints configurables automáticamente
- [ ] Test mode funcional out-of-the-box

### **Payment Processing**

- [ ] One-click payment form con Stripe Elements
- [ ] 3D Secure support automático
- [ ] Failed payment retry logic
- [ ] Refund processing desde dashboard

### **Subscription Management**

- [ ] Plan upgrades/downgrades instantáneos
- [ ] Proration automática
- [ ] Cancel at period end
- [ ] Reactivation de subscriptions canceladas

### **Analytics & Reporting**

- [ ] Revenue dashboard en tiempo real
- [ ] MRR/ARR calculation
- [ ] Churn rate tracking
- [ ] Customer LTV metrics

### **Compliance**

- [ ] PCI compliance automático (Stripe)
- [ ] Tax calculation por país
- [ ] Invoice PDF generation
- [ ] GDPR data export para billing data

---

## 🌍 7. Servicios Externos Requeridos

### **Stripe Configuration**

```bash
# Required Stripe Products/Prices
stripe prices create \
  --unit-amount=2900 \
  --currency=usd \
  --recurring='{"interval":"month"}' \
  --product-data='{"name":"Premium Plan"}'

# Webhook Endpoints Required
- payment_intent.succeeded
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.updated
- customer.subscription.deleted
```

### **Additional Services**

- **Stripe Tax**: Automatic tax calculation
- **Stripe Billing**: Advanced subscription features
- **Stripe Terminal**: In-person payments (optional)

---

## 📊 8. Analytics & Metrics

### **Revenue Metrics**

- **MRR** (Monthly Recurring Revenue)
- **ARR** (Annual Recurring Revenue)
- **ARPU** (Average Revenue Per User)
- **Customer LTV** (Lifetime Value)

### **Operational Metrics**

- **Churn Rate**: Monthly/Annual
- **Upgrade Rate**: Free to Paid conversion
- **Payment Success Rate**: % successful payments
- **Dunning Success Rate**: Recovery de failed payments

### **Developer Metrics (Template)**

- **Setup Time**: Time to first payment
- **Integration Success Rate**: % successful implementations
- **Support Ticket Volume**: Template-related issues
- **Template Satisfaction**: NPS from developers

---

## 🚀 9. Implementation Roadmap

### **Week 1: Core Integration**

- Stripe API integration
- Basic payment forms
- Webhook processing
- Database schema

### **Week 2: Subscription Management**

- Plan creation/management
- Upgrade/downgrade flows
- Cancellation handling
- Invoice generation

### **Week 3: Analytics & UX**

- Revenue dashboard
- Billing history UI
- Email notifications
- Tax calculation

---

## 📚 10. Developer Documentation Required

### **Setup Guides**

- [ ] **Stripe Account Setup**: Step-by-step guide
- [ ] **Environment Variables**: Complete list with examples
- [ ] **Webhook Configuration**: Automated setup
- [ ] **Test Data**: Sample products and customers

### **Integration Guides**

- [ ] **Custom Plans**: How to add new pricing tiers
- [ ] **Usage Billing**: Implement metered billing
- [ ] **Tax Setup**: Configure tax collection
- [ ] **Multi-Currency**: Enable global payments

### **Deployment Guides**

- [ ] **Vercel Deployment**: Complete setup
- [ ] **Railway Deployment**: Alternative platform
- [ ] **Production Checklist**: Go-live requirements
- [ ] **Monitoring Setup**: Payment monitoring

---

## 💰 11. Pricing Strategy (Template)

### **Value Proposition**

- **Save 2-3 months** of development time
- **$50K+ value** in payment infrastructure
- **Production-ready** billing system
- **Global compliance** included

### **Template Pricing**

- **Free**: Evaluation + basic setup
- **Premium ($297)**: Complete production system
- **Enterprise ($997)**: White-label + support

### **ROI for Customers**

- Break-even at **10-20 customers** (depending on their pricing)
- **$50K+ saved** in development costs
- **Faster time-to-market** = earlier revenue

---

_Este PRD de Billing & Payments es fundamental para que el template Alkitu sea comercializable. Sin este módulo, los developers no pueden monetizar sus productos efectivamente._
