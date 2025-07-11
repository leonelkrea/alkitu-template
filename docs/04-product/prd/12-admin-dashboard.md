# 🛠️ Admin Dashboard & Management Module PRD (CORREGIDO)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El Admin Dashboard & Management es el **centro de control** para operar cualquier SaaS profesionalmente. Permite a business owners y administradores gestionar usuarios, monitorear métricas clave, configurar el sistema, y tomar decisiones data-driven para hacer crecer el negocio.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-001 (Single Responsibility) - Separación de responsabilidades del dashboard
- **Depende de**: SOLID-003 (Liskov Substitution) - Widgets intercambiables
- **Integración**: **Dynamic Configuration System** - Configuración en tiempo real
- **Integración**: **User Management** - Gestión avanzada de usuarios
- **Integración**: **File Storage** - Analytics de archivos
- **Implementación**: Semana 17-18 (después de file storage)

### **Objetivos Comerciales**

- **Business Intelligence**: Métricas y analytics en tiempo real
- **User Management**: Control total sobre usuarios y permisos
- **Revenue Optimization**: Tools para maximizar ingresos
- **Operational Efficiency**: Automatización de tareas repetitivas
- **🔗 Configuration Control**: Gestión de feature flags y configuraciones

### **Metas Técnicas**

- **Real-time Updates**: Métricas actualizadas cada 30 segundos
- **Performance**: Dashboard carga en < 2 segundos
- **Mobile Responsive**: Funcional en todos los devices
- **Extensible**: Fácil agregar nuevos widgets y métricas
- **✅ Enhanced**: Integración completa con sistema de configuración

---

## 👥 2. Stakeholders

### **Primary Users (Admin Dashboard)**

- **Founders/CEOs**: Métricas de high-level y growth
- **Product Managers**: Feature usage y user behavior
- **Customer Success**: User engagement y support
- **Finance/Revenue**: Billing y revenue analytics

### **Template Users (Developers)**

- **SaaS Builders**: Necesitan admin desde día 1
- **Agencies**: Managing multiple client dashboards
- **Enterprises**: Advanced user management y compliance

### **Secondary Users**

- **Support Teams**: User troubleshooting y assistance
- **Marketing Teams**: User acquisition y conversion metrics
- **Sales Teams**: Lead management y conversion funnels

---

## 📖 3. Historias de Usuario

### **Business Owner/Admin**

```gherkin
Como business owner
Quiero ver métricas de revenue en tiempo real
Para tomar decisiones informadas sobre el negocio

Como admin
Quiero gestionar usuarios y sus permisos
Para mantener seguridad y control de acceso

Como CEO
Quiero dashboard ejecutivo con KPIs principales
Para monitorear la salud del negocio
```

### **Product Manager**

```gherkin
Como product manager
Quiero ver feature usage analytics
Para priorizar development roadmap

Como PM
Quiero cohort analysis de usuarios
Para entender retention patterns

Como product owner
Quiero A/B testing results
Para validar product decisions
```

### **Customer Success Manager**

```gherkin
Como customer success manager
Quiero identificar usuarios at-risk
Para intervenir proactivamente

Como CSM
Quiero user journey analytics
Para optimizar onboarding

Como support manager
Quiero ticket analytics y resolution times
Para mejorar customer satisfaction
```

### **Developer (Template Implementation)**

```gherkin
Como developer usando el template
Quiero admin dashboard funcional out-of-the-box
Para no construir desde cero

Como developer
Quiero widgets customizables
Para adaptar a necesidades específicas

Como dev team lead
Quiero role-based access controls
Para security y compliance
```

---

## 🎨 4. Características por Licencia

### **Template Free ($0) - Evaluation**

| Funcionalidad    | Incluido | Limitaciones          |
| ---------------- | -------- | --------------------- |
| Basic User List  | ✅       | Solo read-only        |
| Simple Analytics | ✅       | Last 7 days data      |
| Basic Settings   | ✅       | Limited configuration |
| Revenue Overview | ✅       | Basic metrics only    |
| Support Tools    | ⚠️       | Solo documentación    |

### **Template Professional ($297)**

| Funcionalidad            | Incluido | Limitaciones             |
| ------------------------ | -------- | ------------------------ |
| Complete User Management | ✅       | CRUD + bulk operations   |
| Advanced Analytics       | ✅       | 12 months history        |
| Revenue Dashboard        | ✅       | MRR, churn, LTV          |
| Feature Usage Tracking   | ✅       | Detailed analytics       |
| Support Integration      | ✅       | Ticket management        |
| Role-based Access        | ✅       | Multiple admin roles     |
| Export Capabilities      | ✅       | CSV, PDF reports         |
| Mobile Responsive        | ✅       | Full mobile experience   |
| Real-time Notifications  | ✅       | Critical alerts          |
| System Configuration     | ✅       | Feature flags management |

### **Template Enterprise ($997)**

| Funcionalidad              | Incluido | Limitaciones            |
| -------------------------- | -------- | ----------------------- |
| Everything in Professional | ✅       | + Advanced features     |
| Custom Dashboards          | ✅       | Drag & drop builder     |
| Advanced Segmentation      | ✅       | Behavioral targeting    |
| Cohort Analysis            | ✅       | Retention metrics       |
| A/B Testing Management     | ✅       | Experiment tracking     |
| Advanced User Workflows    | ✅       | Automation rules        |
| API Analytics              | ✅       | Usage y performance     |
| White-label Interface      | ✅       | Custom branding         |
| Multi-tenant Management    | ✅       | Manage multiple tenants |
| Advanced Security          | ✅       | Audit logs, 2FA         |
| Custom Integrations        | ✅       | Third-party tools       |
| Priority Support           | ✅       | 24h response time       |

---

## 🛠️ 5. Requisitos Técnicos

### **Dashboard Architecture**

```typescript
// Dashboard Service with Real-time Updates
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UserService,
    private readonly billingService: BillingService,
    private readonly analyticsService: AnalyticsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // Real-time Metrics
  async getDashboardMetrics(timeRange: string): Promise<DashboardMetrics> {
    const [users, revenue, usage, support] = await Promise.all([
      this.getUserMetrics(timeRange),
      this.getRevenueMetrics(timeRange),
      this.getUsageMetrics(timeRange),
      this.getSupportMetrics(timeRange),
    ]);

    return {
      users,
      revenue,
      usage,
      support,
      lastUpdated: new Date(),
    };
  }

  // User Management
  async getUsers(filters: UserFilters): Promise<PaginatedUsers> {
    return await this.userService.findWithFilters({
      ...filters,
      include: ["subscriptions", "analytics", "support_tickets"],
    });
  }

  // Bulk User Operations
  async bulkUpdateUsers(
    userIds: string[],
    updates: BulkUserUpdate
  ): Promise<void> {
    await this.userService.bulkUpdate(userIds, updates);

    // Emit event for real-time updates
    this.eventEmitter.emit("users.bulk_updated", {
      userIds,
      updates,
      timestamp: new Date(),
    });
  }

  // Revenue Analytics
  async getRevenueAnalytics(timeRange: string): Promise<RevenueAnalytics> {
    return {
      mrr: await this.billingService.calculateMRR(timeRange),
      arr: await this.billingService.calculateARR(timeRange),
      churnRate: await this.calculateChurnRate(timeRange),
      ltv: await this.calculateCustomerLTV(timeRange),
      revenueGrowth: await this.calculateRevenueGrowth(timeRange),
    };
  }
}
```

### **Real-time Dashboard Updates**

```typescript
// WebSocket Gateway for Real-time Updates
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "/admin",
})
export class AdminDashboardGateway {
  @WebSocketServer()
  server: Server;

  // Broadcast metric updates
  broadcastMetricUpdate(metric: string, data: any) {
    this.server.emit("metric:update", {
      metric,
      data,
      timestamp: new Date(),
    });
  }

  // Real-time user activity
  broadcastUserActivity(activity: UserActivity) {
    this.server.emit("user:activity", activity);
  }

  // System alerts
  broadcastSystemAlert(alert: SystemAlert) {
    this.server.emit("system:alert", alert);
  }
}
```

### **Backend Structure (NestJS)**

```typescript
admin/
├── dashboard/
│   ├── dashboard.controller.ts    # Dashboard endpoints
│   ├── dashboard.service.ts       # Dashboard logic
│   ├── dashboard.gateway.ts       # WebSocket updates
│   └── dto/
│       ├── metrics.dto.ts         # Metrics data types
│       └── filters.dto.ts         # Filter options
├── users/
│   ├── admin-users.controller.ts  # User management
│   ├── admin-users.service.ts     # User operations
│   └── bulk-operations.service.ts # Bulk actions
├── analytics/
│   ├── analytics.controller.ts    # Analytics endpoints
│   ├── revenue.service.ts         # Revenue analytics
│   ├── usage.service.ts           # Feature usage
│   └── cohort.service.ts          # Cohort analysis
├── settings/
│   ├── settings.controller.ts     # System config
│   ├── feature-flags.service.ts   # Feature management
│   └── notifications.service.ts   # Alert config
└── reports/
    ├── reports.controller.ts      # Report generation
    ├── export.service.ts          # Data export
    └── scheduled-reports.service.ts # Automatic reports
```

### **Frontend Components (React)**

```tsx
components/admin/
├── Dashboard/
│   ├── DashboardLayout.tsx        # Main layout
│   ├── MetricsCards.tsx           # KPI cards
│   ├── RevenueChart.tsx           # Revenue visualization
│   ├── UserGrowthChart.tsx        # User metrics
│   └── ActivityFeed.tsx           # Real-time activity
├── Users/
│   ├── UserTable.tsx              # Advanced user table
│   ├── UserDetails.tsx            # User detail modal
│   ├── BulkActions.tsx            # Bulk operations
│   ├── UserFilters.tsx            # Advanced filtering
│   └── UserAnalytics.tsx          # Individual user analytics
├── Analytics/
│   ├── AnalyticsDashboard.tsx     # Analytics overview
│   ├── CohortAnalysis.tsx         # Retention analysis
│   ├── FeatureUsage.tsx           # Feature analytics
│   └── CustomReports.tsx          # Report builder
├── Settings/
│   ├── SystemSettings.tsx         # System configuration
│   ├── FeatureFlagsManager.tsx    # Flag management
│   ├── NotificationSettings.tsx   # Alert configuration
│   └── SecuritySettings.tsx       # Security controls
└── Shared/
    ├── AdminSidebar.tsx           # Navigation
    ├── SearchBar.tsx              # Global search
    ├── ExportButton.tsx           # Data export
    └── RealTimeIndicator.tsx      # Connection status
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model AdminUser {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @db.ObjectId
  organizationId String? @db.ObjectId
  role          AdminRole
  permissions   Json     @default("{}")
  lastLogin     DateTime?
  // Security
  twoFactorEnabled Boolean @default(false)
  ipRestrictions String[] @default([])
  sessionCount   Int      @default(0)
  // Audit
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  createdBy     String?  @db.ObjectId

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])
  creator      User?         @relation("AdminCreatedBy", fields: [createdBy], references: [id])
  activities   UserActivity[]
  alertsResolved SystemAlert[] @relation("AlertResolver")
  featureOverrides AdminFeatureOverride[]

  @@unique([userId, organizationId])
  @@map("admin_users")
}

model DashboardMetric {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  metricType   String   // 'revenue', 'users', 'usage', 'support'
  timePeriod   String   // '24h', '7d', '30d', '90d'
  metricData   Json
  organizationId String? @db.ObjectId
  // Cache settings
  calculatedAt DateTime @default(now())
  expiresAt    DateTime
  isStale      Boolean  @default(false)

  // Relations
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@unique([metricType, timePeriod, organizationId])
  @@map("dashboard_metrics")
}

model UserActivity {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId
  adminId    String?  @db.ObjectId // If action performed by admin
  action     String   // 'login', 'logout', 'create', 'update', 'delete'
  resource   String?  // Resource affected
  details    Json     @default("{}")
  // Request metadata
  ipAddress  String?
  userAgent  String?
  location   Json?    // { country, city, region }
  timestamp  DateTime @default(now())

  // Relations
  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  admin AdminUser? @relation(fields: [adminId], references: [id])

  @@map("user_activities")
}

model SystemAlert {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  alertType  AlertType
  title      String
  message    String
  severity   AlertSeverity @default(MEDIUM)
  // Resolution
  resolved   Boolean  @default(false)
  resolvedBy String?  @db.ObjectId
  resolvedAt DateTime?
  // Metadata
  metadata   Json     @default("{}")
  affectedUsers Int?   // Number of users affected
  organizationId String? @db.ObjectId
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  organization Organization? @relation(fields: [organizationId], references: [id])
  resolver     AdminUser?    @relation("AlertResolver", fields: [resolvedBy], references: [id])

  @@map("system_alerts")
}

model AdminFeatureOverride {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  featureKey     String   // Feature flag key
  userId         String?  @db.ObjectId
  organizationId String?  @db.ObjectId
  enabled        Boolean
  reason         String?
  // Admin info
  createdBy      String   @db.ObjectId
  expiresAt      DateTime?
  createdAt      DateTime @default(now())

  // Relations
  user         User?         @relation(fields: [userId], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])
  admin        AdminUser     @relation(fields: [createdBy], references: [id])

  @@map("admin_feature_overrides")
}

// ✅ ENHANCED: Integration with Dynamic Configuration System
model AdminDashboardConfig {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  adminId        String   @db.ObjectId
  organizationId String?  @db.ObjectId
  // Dashboard layout
  widgets        Json     @default("[]") // Widget configuration
  layout         Json     @default("{}") // Layout settings
  theme          String   @default("light")
  // Preferences
  defaultTimeRange String @default("7d")
  autoRefresh    Boolean  @default(true)
  notifications  Json     @default("{}")
  // Timestamps
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  admin        AdminUser     @relation(fields: [adminId], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@unique([adminId, organizationId])
  @@map("admin_dashboard_configs")
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MANAGER
  SUPPORT
  ANALYST
}

enum AlertType {
  ERROR
  WARNING
  INFO
  SECURITY
  PERFORMANCE
}

enum AlertSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST endpoints
// packages/api/src/trpc/routers/admin.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { adminSchemas } from "../schemas/admin.schemas";

export const adminRouter = createTRPCRouter({
  // Dashboard Metrics
  getDashboardMetrics: protectedProcedure
    .input(adminSchemas.getDashboardMetricsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getDashboardMetrics(input);
    }),

  getRealtimeMetrics: protectedProcedure
    .input(adminSchemas.getRealtimeMetricsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getRealtimeMetrics(input);
    }),

  // User Management
  getUsers: protectedProcedure
    .input(adminSchemas.getUsersInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getUsers(input);
    }),

  getUserDetails: protectedProcedure
    .input(adminSchemas.getUserDetailsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getUserDetails(input.userId);
    }),

  updateUser: protectedProcedure
    .input(adminSchemas.updateUserInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.updateUser(input);
    }),

  bulkUpdateUsers: protectedProcedure
    .input(adminSchemas.bulkUpdateUsersInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.bulkUpdateUsers(input);
    }),

  impersonateUser: protectedProcedure
    .input(adminSchemas.impersonateUserInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.impersonateUser(input.userId, ctx.user.id);
    }),

  // Analytics
  getRevenueAnalytics: protectedProcedure
    .input(adminSchemas.getRevenueAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getRevenueAnalytics(input);
    }),

  getUsageAnalytics: protectedProcedure
    .input(adminSchemas.getUsageAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getUsageAnalytics(input);
    }),

  getCohortAnalysis: protectedProcedure
    .input(adminSchemas.getCohortAnalysisInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getCohortAnalysis(input);
    }),

  // System Alerts
  getSystemAlerts: protectedProcedure
    .input(adminSchemas.getSystemAlertsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getSystemAlerts(input);
    }),

  resolveAlert: protectedProcedure
    .input(adminSchemas.resolveAlertInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.resolveAlert(input.alertId, ctx.user.id);
    }),

  // ✅ ENHANCED: Configuration Management Integration
  getFeatureFlags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.adminService.getFeatureFlags();
  }),

  updateFeatureFlag: protectedProcedure
    .input(adminSchemas.updateFeatureFlagInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.updateFeatureFlag(input);
    }),

  overrideFeatureForUser: protectedProcedure
    .input(adminSchemas.overrideFeatureForUserInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.overrideFeatureForUser(input, ctx.user.id);
    }),

  // Dashboard Configuration
  getDashboardConfig: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.adminService.getDashboardConfig(ctx.user.id);
  }),

  updateDashboardConfig: protectedProcedure
    .input(adminSchemas.updateDashboardConfigInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.updateDashboardConfig(ctx.user.id, input);
    }),

  // Reports & Export
  generateReport: protectedProcedure
    .input(adminSchemas.generateReportInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.generateReport(input);
    }),

  exportData: protectedProcedure
    .input(adminSchemas.exportDataInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.adminService.exportData(input);
    }),

  // Security & Audit
  getAuditLogs: protectedProcedure
    .input(adminSchemas.getAuditLogsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getAuditLogs(input);
    }),

  getSecurityEvents: protectedProcedure
    .input(adminSchemas.getSecurityEventsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.adminService.getSecurityEvents(input);
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant admin service
// packages/api/src/admin/admin.service.ts

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly dashboardMetricRepository: IDashboardMetricRepository,
    private readonly systemAlertRepository: ISystemAlertRepository,
    private readonly userActivityRepository: IUserActivityRepository,
    private readonly configurationService: IConfigurationService,
    private readonly analyticsService: IAnalyticsService,
    private readonly websocketGateway: AdminWebSocketGateway,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getDashboardMetrics(
    input: GetDashboardMetricsInput
  ): Promise<DashboardMetrics> {
    // Check cache first
    const cachedMetrics =
      await this.dashboardMetricRepository.findByTypeAndPeriod(
        input.metricType,
        input.timePeriod,
        input.organizationId
      );

    if (cachedMetrics && !this.isMetricStale(cachedMetrics)) {
      return cachedMetrics.metricData as DashboardMetrics;
    }

    // Calculate fresh metrics
    const metrics = await this.calculateDashboardMetrics(input);

    // Cache the results
    await this.dashboardMetricRepository.upsert({
      metricType: input.metricType,
      timePeriod: input.timePeriod,
      organizationId: input.organizationId,
      metricData: metrics,
      calculatedAt: new Date(),
      expiresAt: new Date(
        Date.now() + this.getCacheExpirationTime(input.metricType)
      ),
    });

    return metrics;
  }

  async getUsers(input: GetUsersInput): Promise<GetUsersResult> {
    const users = await this.userRepository.findWithFilters({
      skip: input.skip,
      take: input.take,
      where: this.buildUserFilters(input.filters),
      include: {
        subscriptions: true,
        organizations: true,
        activities: {
          take: 5,
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await this.userRepository.count(
      this.buildUserFilters(input.filters)
    );

    return {
      users: users.map((user) => this.sanitizeUserForAdmin(user)),
      total,
      hasMore: users.length === input.take,
    };
  }

  async bulkUpdateUsers(
    input: BulkUpdateUsersInput
  ): Promise<BulkUpdateUsersResult> {
    const results = [];

    for (const userId of input.userIds) {
      try {
        const user = await this.userRepository.update(userId, input.updates);
        results.push({
          userId,
          success: true,
          user: this.sanitizeUserForAdmin(user),
        });

        // Log the action
        await this.logUserActivity({
          userId,
          adminId: input.adminId,
          action: "bulk_update",
          resource: "user",
          details: input.updates,
        });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    // Emit real-time update
    this.websocketGateway.broadcastUserUpdate({
      type: "bulk_update",
      userIds: input.userIds,
      updates: input.updates,
    });

    return {
      results,
      total: input.userIds.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  }

  // ✅ ENHANCED: Configuration management integration
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await this.configurationService.getAllFeatureFlags();
  }

  async updateFeatureFlag(input: UpdateFeatureFlagInput): Promise<FeatureFlag> {
    const flag = await this.configurationService.updateFeatureFlag(input);

    // Emit real-time update
    this.websocketGateway.broadcastFeatureFlagUpdate(flag);

    return flag;
  }

  async overrideFeatureForUser(
    input: OverrideFeatureForUserInput,
    adminId: string
  ): Promise<AdminFeatureOverride> {
    const override = await this.adminFeatureOverrideRepository.create({
      featureKey: input.featureKey,
      userId: input.userId,
      organizationId: input.organizationId,
      enabled: input.enabled,
      reason: input.reason,
      createdBy: adminId,
      expiresAt: input.expiresAt,
    });

    // Update configuration service
    await this.configurationService.setUserFeatureOverride(
      input.userId,
      input.featureKey,
      input.enabled
    );

    // Log the action
    await this.logUserActivity({
      userId: input.userId,
      adminId,
      action: "feature_override",
      resource: "feature_flag",
      details: { featureKey: input.featureKey, enabled: input.enabled },
    });

    return override;
  }

  private async calculateDashboardMetrics(
    input: GetDashboardMetricsInput
  ): Promise<DashboardMetrics> {
    switch (input.metricType) {
      case "users":
        return await this.calculateUserMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "revenue":
        return await this.calculateRevenueMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "usage":
        return await this.calculateUsageMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "support":
        return await this.calculateSupportMetrics(
          input.timePeriod,
          input.organizationId
        );
      default:
        throw new Error(`Unknown metric type: ${input.metricType}`);
    }
  }

  private async calculateUserMetrics(
    timePeriod: string,
    organizationId?: string
  ): Promise<UserMetrics> {
    const timeRange = this.getTimeRange(timePeriod);

    return {
      totalUsers: await this.userRepository.count({ organizationId }),
      activeUsers: await this.userRepository.count({
        organizationId,
        lastLoginAt: { gte: timeRange.start },
      }),
      newUsers: await this.userRepository.count({
        organizationId,
        createdAt: { gte: timeRange.start },
      }),
      churnedUsers: await this.userRepository.count({
        organizationId,
        deletedAt: { gte: timeRange.start },
      }),
      growth: await this.calculateUserGrowth(timeRange, organizationId),
    };
  }

  private buildUserFilters(filters: UserFilters): any {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.createdAfter) {
      where.createdAt = { gte: new Date(filters.createdAfter) };
    }

    if (filters.lastLoginAfter) {
      where.lastLoginAt = { gte: new Date(filters.lastLoginAfter) };
    }

    return where;
  }

  private sanitizeUserForAdmin(user: any): AdminUserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      organizationId: user.organizationId,
      subscription: user.subscriptions?.[0],
      activityCount: user.activities?.length || 0,
      recentActivity: user.activities?.[0],
    };
  }

  // Other methods following SOLID principles...
}
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant admin service
// packages/api/src/admin/admin.service.ts

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly dashboardMetricRepository: IDashboardMetricRepository,
    private readonly systemAlertRepository: ISystemAlertRepository,
    private readonly userActivityRepository: IUserActivityRepository,
    private readonly configurationService: IConfigurationService,
    private readonly analyticsService: IAnalyticsService,
    private readonly websocketGateway: AdminWebSocketGateway,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getDashboardMetrics(
    input: GetDashboardMetricsInput
  ): Promise<DashboardMetrics> {
    // Check cache first
    const cachedMetrics =
      await this.dashboardMetricRepository.findByTypeAndPeriod(
        input.metricType,
        input.timePeriod,
        input.organizationId
      );

    if (cachedMetrics && !this.isMetricStale(cachedMetrics)) {
      return cachedMetrics.metricData as DashboardMetrics;
    }

    // Calculate fresh metrics
    const metrics = await this.calculateDashboardMetrics(input);

    // Cache the results
    await this.dashboardMetricRepository.upsert({
      metricType: input.metricType,
      timePeriod: input.timePeriod,
      organizationId: input.organizationId,
      metricData: metrics,
      calculatedAt: new Date(),
      expiresAt: new Date(
        Date.now() + this.getCacheExpirationTime(input.metricType)
      ),
    });

    return metrics;
  }

  async getUsers(input: GetUsersInput): Promise<GetUsersResult> {
    const users = await this.userRepository.findWithFilters({
      skip: input.skip,
      take: input.take,
      where: this.buildUserFilters(input.filters),
      include: {
        subscriptions: true,
        organizations: true,
        activities: {
          take: 5,
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await this.userRepository.count(
      this.buildUserFilters(input.filters)
    );

    return {
      users: users.map((user) => this.sanitizeUserForAdmin(user)),
      total,
      hasMore: users.length === input.take,
    };
  }

  async bulkUpdateUsers(
    input: BulkUpdateUsersInput
  ): Promise<BulkUpdateUsersResult> {
    const results = [];

    for (const userId of input.userIds) {
      try {
        const user = await this.userRepository.update(userId, input.updates);
        results.push({
          userId,
          success: true,
          user: this.sanitizeUserForAdmin(user),
        });

        // Log the action
        await this.logUserActivity({
          userId,
          adminId: input.adminId,
          action: "bulk_update",
          resource: "user",
          details: input.updates,
        });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    // Emit real-time update
    this.websocketGateway.broadcastUserUpdate({
      type: "bulk_update",
      userIds: input.userIds,
      updates: input.updates,
    });

    return {
      results,
      total: input.userIds.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  }

  // ✅ ENHANCED: Configuration management integration
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return await this.configurationService.getAllFeatureFlags();
  }

  async updateFeatureFlag(input: UpdateFeatureFlagInput): Promise<FeatureFlag> {
    const flag = await this.configurationService.updateFeatureFlag(input);

    // Emit real-time update
    this.websocketGateway.broadcastFeatureFlagUpdate(flag);

    return flag;
  }

  async overrideFeatureForUser(
    input: OverrideFeatureForUserInput,
    adminId: string
  ): Promise<AdminFeatureOverride> {
    const override = await this.adminFeatureOverrideRepository.create({
      featureKey: input.featureKey,
      userId: input.userId,
      organizationId: input.organizationId,
      enabled: input.enabled,
      reason: input.reason,
      createdBy: adminId,
      expiresAt: input.expiresAt,
    });

    // Update configuration service
    await this.configurationService.setUserFeatureOverride(
      input.userId,
      input.featureKey,
      input.enabled
    );

    // Log the action
    await this.logUserActivity({
      userId: input.userId,
      adminId,
      action: "feature_override",
      resource: "feature_flag",
      details: { featureKey: input.featureKey, enabled: input.enabled },
    });

    return override;
  }

  private async calculateDashboardMetrics(
    input: GetDashboardMetricsInput
  ): Promise<DashboardMetrics> {
    switch (input.metricType) {
      case "users":
        return await this.calculateUserMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "revenue":
        return await this.calculateRevenueMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "usage":
        return await this.calculateUsageMetrics(
          input.timePeriod,
          input.organizationId
        );
      case "support":
        return await this.calculateSupportMetrics(
          input.timePeriod,
          input.organizationId
        );
      default:
        throw new Error(`Unknown metric type: ${input.metricType}`);
    }
  }

  private async calculateUserMetrics(
    timePeriod: string,
    organizationId?: string
  ): Promise<UserMetrics> {
    const timeRange = this.getTimeRange(timePeriod);

    return {
      totalUsers: await this.userRepository.count({ organizationId }),
      activeUsers: await this.userRepository.count({
        organizationId,
        lastLoginAt: { gte: timeRange.start },
      }),
      newUsers: await this.userRepository.count({
        organizationId,
        createdAt: { gte: timeRange.start },
      }),
      churnedUsers: await this.userRepository.count({
        organizationId,
        deletedAt: { gte: timeRange.start },
      }),
      growth: await this.calculateUserGrowth(timeRange, organizationId),
    };
  }

  private buildUserFilters(filters: UserFilters): any {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.createdAfter) {
      where.createdAt = { gte: new Date(filters.createdAfter) };
    }

    if (filters.lastLoginAfter) {
      where.lastLoginAt = { gte: new Date(filters.lastLoginAfter) };
    }

    return where;
  }

  private sanitizeUserForAdmin(user: any): AdminUserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      organizationId: user.organizationId,
      subscription: user.subscriptions?.[0],
      activityCount: user.activities?.length || 0,
      recentActivity: user.activities?.[0],
    };
  }

  // Other methods following SOLID principles...
}
```

---

## 📏 6. Criterios de Aceptación

### **Dashboard Performance**

- [ ] Dashboard inicial carga en < 2 segundos
- [ ] Métricas real-time actualizan cada 30 segundos
- [ ] Charts y graphs renderizan smoothly
- [ ] Mobile responsive en todos los screen sizes
- [ ] Offline graceful degradation

### **User Management**

- [ ] User search con filters avanzados
- [ ] Bulk operations (activate, deactivate, delete)
- [ ] User detail view con complete history
- [ ] Role-based permissions funcionan correctamente
- [ ] User impersonation para support (with audit)

### **Analytics & Reporting**

- [ ] Revenue metrics calculan correctly (MRR, ARR, churn)
- [ ] Feature usage tracking funcional
- [ ] Export to CSV/PDF funcional
- [ ] Scheduled reports automáticos
- [ ] Custom date ranges funcionan

### **Real-time Features**

- [ ] WebSocket connections estables
- [ ] Real-time notifications funcionan
- [ ] Live user activity feed
- [ ] System alerts inmediatos
- [ ] Auto-refresh de métricas críticas

### **Security & Access Control**

- [ ] Role-based access enforcement
- [ ] Audit logs para todas las actions
- [ ] Two-factor authentication para admins
- [ ] Session management robusto
- [ ] IP restriction capabilities

---

## 📊 7. Key Metrics & Analytics

### **Business Metrics**

```typescript
interface BusinessMetrics {
  // Revenue
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  churnRate: number; // Monthly churn percentage
  ltv: number; // Customer Lifetime Value
  arpu: number; // Average Revenue Per User

  // Growth
  userGrowth: number; // Monthly user growth rate
  revenueGrowth: number; // Monthly revenue growth
  conversionRate: number; // Free to paid conversion

  // Engagement
  dau: number; // Daily Active Users
  mau: number; // Monthly Active Users
  sessionDuration: number; // Average session length
  featureAdoption: Record<string, number>; // Feature usage rates
}
```

### **Operational Metrics**

```typescript
interface OperationalMetrics {
  // System Health
  uptime: number; // System uptime percentage
  responseTime: number; // Average API response time
  errorRate: number; // Error rate percentage

  // Support
  ticketVolume: number; // Support tickets created
  resolutionTime: number; // Average resolution time
  satisfaction: number; // Customer satisfaction score

  // Security
  securityEvents: number; // Security incidents
  failedLogins: number; // Failed login attempts
  suspiciousActivity: number; // Flagged activities
}
```

### **User Analytics**

```typescript
interface UserAnalytics {
  // Segmentation
  usersByPlan: Record<string, number>; // Users per pricing tier
  usersByLocation: Record<string, number>; // Geographic distribution
  usersBySource: Record<string, number>; // Acquisition channels

  // Behavior
  onboardingCompletion: number; // % completed onboarding
  featureUsage: Record<string, number>; // Feature usage statistics
  retentionRate: number[]; // Retention by cohort

  // Risk Analysis
  atRiskUsers: number; // Users likely to churn
  powerUsers: number; // Highly engaged users
  dormantUsers: number; // Inactive users
}
```

---

## 🚀 8. Implementation Priority

### **Phase 1: Core Dashboard (Days 1-5)**

- Basic dashboard layout y navigation
- User management CRUD operations
- Essential metrics (users, revenue)
- Role-based access control
- Mobile responsive layout

### **Phase 2: Advanced Analytics (Days 6-10)**

- Revenue analytics (MRR, churn, LTV)
- Feature usage tracking
- User behavior analytics
- Export functionality
- Real-time updates setup

### **Phase 3: Advanced Features (Days 11-15)**

- Cohort analysis
- A/B testing management
- Advanced user workflows
- System monitoring y alerts
- Scheduled reports

### **Phase 4: Enterprise Features (Days 16-20)**

- Custom dashboard builder
- Multi-tenant management
- Advanced security features
- API analytics
- White-label capabilities

---

## 📚 9. Developer Documentation

### **Setup Guides Required**

- [ ] **Admin Role Setup**: Creating first admin user
- [ ] **Permissions Configuration**: Role-based access setup
- [ ] **Analytics Configuration**: Metrics y tracking setup
- [ ] **Real-time Setup**: WebSocket configuration

### **Customization Examples**

```typescript
// Custom Dashboard Widget
import { DashboardWidget } from '@alkitu/admin';

export const CustomRevenueWidget = () => {
  const { data, loading } = useDashboardMetric('revenue', '30d');

  return (
    <DashboardWidget
      title="Monthly Revenue"
      loading={loading}
      data={data}
      chart="line"
      color="green"
      format="currency"
    />
  );
};

// Custom User Filter
export const CustomUserFilter = {
  key: 'high_value',
  label: 'High Value Customers',
  filter: (users) => users.filter(u => u.ltv > 1000),
  description: 'Users with LTV > $1000'
};
```

### **API Integration**

```typescript
// Admin API Client
import { AdminAPIClient } from "@alkitu/admin-api";

const adminAPI = new AdminAPIClient({
  baseURL: process.env.API_URL,
  apiKey: process.env.ADMIN_API_KEY,
});

// Get dashboard metrics
const metrics = await adminAPI.dashboard.getMetrics({
  timeRange: "30d",
  metrics: ["revenue", "users", "usage"],
});

// Manage users
const users = await adminAPI.users.list({
  page: 1,
  limit: 50,
  filters: { plan: "premium", status: "active" },
});

// Bulk operations
await adminAPI.users.bulkUpdate(userIds, {
  plan: "enterprise",
  notify: true,
});
```

---

## 💰 10. Business Value & ROI

### **Value Proposition for Template**

- **$15K+ saved**: En desarrollo de admin dashboard
- **3-4 weeks saved**: Time to market acceleration
- **Professional appearance**: Enterprise-grade interface
- **Data-driven decisions**: Analytics desde día 1

### **Template Pricing Justification**

- **Admin dashboard alone**: Worth $500+ in development
- **Analytics system**: Worth $1000+ in specialized tools
- **User management**: Worth $300+ in development time
- **Real-time features**: Worth $800+ in WebSocket implementation

### **ROI for Template Users**

- **Operational efficiency**: 50% reduction in manual tasks
- **Better decisions**: Data-driven insights
- **Faster growth**: Optimize based on real metrics
- **Reduced churn**: Proactive user management

---

## 🔒 11. Security & Compliance

### **Security Features**

- **Role-based Access Control**: Granular permissions
- **Two-Factor Authentication**: For admin accounts
- **Audit Logging**: All admin actions logged
- **Session Management**: Secure session handling
- **IP Restrictions**: Limit admin access by IP

### **Compliance Features**

- **GDPR Support**: User data export/deletion
- **SOX Compliance**: Financial data controls
- **Audit Trails**: Complete action history
- **Data Retention**: Configurable retention policies
- **Access Reviews**: Regular permission audits

### **Privacy Controls**

- **Data Masking**: Sensitive data protection
- **Permission Inheritance**: Role-based visibility
- **Consent Management**: User consent tracking
- **Data Minimization**: Only necessary data exposed

---

## 📱 12. Mobile Experience

### **Mobile-First Design**

- **Responsive Layout**: Works on all screen sizes
- **Touch-Friendly**: Optimized for mobile interaction
- **Offline Support**: Critical functions work offline
- **Push Notifications**: Mobile alerts para admins

### **Mobile-Specific Features**

- **Quick Actions**: Swipe gestures para common tasks
- **Voice Search**: Voice-powered user search
- **Mobile Dashboard**: Simplified mobile view
- **Emergency Access**: Critical functions accessible

---

_El Admin Dashboard & Management module es el corazón operacional de cualquier SaaS exitoso. Proporciona las herramientas necesarias para gestionar usuarios, monitorear métricas, y tomar decisiones data-driven que impulsen el crecimiento del negocio._
