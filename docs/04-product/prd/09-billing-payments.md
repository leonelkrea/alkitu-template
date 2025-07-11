# 💳 Billing & Payments Module PRD

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El módulo de billing y pagos es el **corazón comercial** del template Alkitu, proporcionando un sistema completo de monetización con Stripe como proveedor principal, diseñado para que developers puedan lanzar productos SaaS rentables inmediatamente.

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

### **Database Schema**

```sql
-- Customers (extends users)
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255) UNIQUE,
  billing_email VARCHAR(255),
  tax_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  plan_id VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_invoice_id VARCHAR(255) UNIQUE,
  amount_paid INTEGER,
  currency VARCHAR(3),
  status VARCHAR(50),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
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
