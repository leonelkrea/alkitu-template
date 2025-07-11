# 🛠️ Dynamic Configuration System PRD

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El Sistema de Configuración Dinámico es el **núcleo de flexibilidad** del template Alkitu, proporcionando configuración en tiempo real, feature flags, theming personalizable y gestión de variables de entorno sin necesidad de redeploy.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-005 (Dependency Inversion Principle) - Configuración como abstracción
- **Relacionado con**: REFACTOR-002 (AuthService) - Configuración de autenticación
- **Implementación**: Semana 15-16 (después de completar chatbot system)

### **Objetivos Comerciales**

- **Feature Flags**: Habilitar/deshabilitar features dinámicamente
- **White-labeling**: Personalización completa para clientes Enterprise
- **Rapid Deployment**: Cambios sin downtime ni redeploy
- **A/B Testing**: Experimentación continua con features

### **Metas Técnicas**

- **Real-time Updates**: Cambios aplicados instantáneamente
- **Type Safety**: Configuración tipada y validada
- **Performance**: < 50ms para obtener configuraciones
- **Scalability**: Soporte para miles de configuraciones

---

## 👥 2. Stakeholders

### **Primary Users**

- **System Administrators**: Gestión de configuraciones globales
- **Product Managers**: Control de feature flags y A/B testing
- **Developers**: Acceso a configuraciones en código
- **UI/UX Designers**: Personalización de theming y branding

### **Secondary Users**

- **DevOps Engineers**: Gestión de variables de entorno
- **QA Engineers**: Testing de configuraciones
- **Support Teams**: Troubleshooting de configuraciones
- **End Users**: Beneficiarios de personalización

### **Technical Stakeholders**

- **Architecture Teams**: Integración con sistemas existentes
- **Security Teams**: Validación de configuraciones sensibles
- **Performance Teams**: Optimización de configuraciones
- **Data Teams**: Analytics de uso de features

---

## 📖 3. Historias de Usuario

### **System Administrator**

```gherkin
Como system administrator
Quiero gestionar configuraciones globales centralizadamente
Para controlar el comportamiento de toda la plataforma

Como system administrator
Quiero ver historial de cambios de configuración
Para auditar y hacer rollback si es necesario

Como system administrator
Quiero configurar variables de entorno por módulo
Para organizar y gestionar configuraciones fácilmente
```

### **Product Manager**

```gherkin
Como product manager
Quiero habilitar/deshabilitar features dinámicamente
Para hacer rollouts controlados y A/B testing

Como product manager
Quiero configurar theming personalizado
Para ofrecer white-labeling a clientes Enterprise

Como product manager
Quiero ver métricas de uso de features
Para tomar decisiones basadas en datos
```

### **Developer**

```gherkin
Como developer
Quiero acceder a configuraciones de forma tipada
Para evitar errores y tener mejor DX

Como developer
Quiero que las configuraciones se actualicen en tiempo real
Para no reiniciar la aplicación

Como developer
Quiero crear nuevas configuraciones fácilmente
Para agregar features configurables
```

---

## 🎨 4. Características por Licencia

### **Free Tier ($0)**

| Funcionalidad         | Incluido | Limitaciones              |
| --------------------- | -------- | ------------------------- |
| Basic Configuration   | ✅       | 50 configuraciones máximo |
| Theme Switching       | ✅       | 2 themes predefinidos     |
| Feature Flags         | ✅       | 10 flags básicos          |
| Environment Variables | ✅       | Variables no sensibles    |
| Basic Admin Panel     | ✅       | Interface básica          |

### **Professional Tier ($297)**

| Funcionalidad          | Incluido | Limitaciones             |
| ---------------------- | -------- | ------------------------ |
| Advanced Configuration | ✅       | 500 configuraciones      |
| Custom Theming         | ✅       | Theming personalizado    |
| Advanced Feature Flags | ✅       | 100 flags + dependencias |
| A/B Testing            | ✅       | Testing básico           |
| Configuration History  | ✅       | 30 días de historial     |
| API Access             | ✅       | Rate limiting estándar   |
| Multi-environment      | ✅       | Dev/staging/prod         |

### **Enterprise Tier ($997)**

| Funcionalidad              | Incluido | Limitaciones             |
| -------------------------- | -------- | ------------------------ |
| Unlimited Configuration    | ✅       | Sin límites              |
| White-label Theming        | ✅       | Branding completo        |
| Advanced Feature Flags     | ✅       | Flags ilimitados + ML    |
| Advanced A/B Testing       | ✅       | Testing avanzado         |
| Full Configuration History | ✅       | Historial completo       |
| Advanced API Access        | ✅       | Sin rate limiting        |
| Multi-tenant Support       | ✅       | Configuración por tenant |
| Custom Modules             | ✅       | Módulos personalizados   |

---

## 🛠️ 5. Requisitos Técnicos (CORREGIDOS)

### **🔧 Tech Stack Actual**

```typescript
// CORRECT Tech Stack (aligned with project)
const CONFIG_SYSTEM_TECH_STACK = {
  backend: {
    framework: "NestJS 10+",
    database: "MongoDB with Prisma ORM", // ✅ CORRECTED
    api: "tRPC + NestJS", // ✅ CORRECTED
    validation: "Zod schemas", // ✅ CORRECTED
    realtime: "WebSocket Gateway",
    testing: "Jest + Stryker mutation testing",
  },
  frontend: {
    framework: "Next.js 14+ App Router", // ✅ CORRECTED
    ui: "shadcn/ui + Radix UI + Tailwind", // ✅ CORRECTED
    state: "Zustand + React Query", // ✅ CORRECTED
    theming: "CSS Variables + Tailwind",
  },
};
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model SystemConfig {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  key         String     @unique
  value       Json
  type        ConfigType
  module      String     // "theme", "email", "notifications", etc.
  description String?
  isPublic    Boolean    @default(false) // Si es accesible desde frontend
  isEncrypted Boolean    @default(false) // Si el valor está encriptado
  schema      Json?      // JSON Schema para validación
  defaultValue Json?     // Valor por defecto
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  createdBy   String?    @db.ObjectId
  updatedBy   String?    @db.ObjectId

  // Relations
  creator   User?              @relation("ConfigCreator", fields: [createdBy], references: [id])
  updater   User?              @relation("ConfigUpdater", fields: [updatedBy], references: [id])
  history   ConfigHistory[]
  overrides ConfigOverride[]

  @@map("system_configs")
}

model ConfigHistory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  configId    String   @db.ObjectId
  oldValue    Json?
  newValue    Json
  action      String   // CREATE, UPDATE, DELETE
  changedBy   String   @db.ObjectId
  reason      String?  // Reason for change
  timestamp   DateTime @default(now())

  // Relations
  config    SystemConfig @relation(fields: [configId], references: [id], onDelete: Cascade)
  user      User         @relation(fields: [changedBy], references: [id])

  @@map("config_history")
}

model ConfigOverride {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  configId       String   @db.ObjectId
  environment    String   // "development", "staging", "production"
  organizationId String?  @db.ObjectId // For tenant-specific overrides
  value          Json
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  config       SystemConfig  @relation(fields: [configId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@unique([configId, environment, organizationId])
  @@map("config_overrides")
}

model FeatureFlag {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  key            String   @unique
  name           String
  description    String?
  enabled        Boolean  @default(false)
  rolloutPercent Int      @default(0) // 0-100
  conditions     Json?    // Conditions for enabling
  dependencies   String[] // Other feature flags this depends on
  environment    String   @default("all") // "all", "development", "staging", "production"
  organizationId String?  @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  createdBy      String   @db.ObjectId

  // Relations
  creator      User          @relation(fields: [createdBy], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])
  experiments  Experiment[]

  @@map("feature_flags")
}

model Experiment {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  featureFlagId String  @db.ObjectId
  name         String
  description  String?
  variants     Json     // Different variants for A/B testing
  trafficSplit Json     // Traffic allocation between variants
  status       ExperimentStatus @default(DRAFT)
  startDate    DateTime?
  endDate      DateTime?
  results      Json?    // Experiment results
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  createdBy    String   @db.ObjectId

  // Relations
  featureFlag FeatureFlag @relation(fields: [featureFlagId], references: [id], onDelete: Cascade)
  creator     User        @relation(fields: [createdBy], references: [id])

  @@map("experiments")
}

model Theme {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  displayName    String
  description    String?
  colors         Json     // Color palette
  typography     Json     // Font settings
  spacing        Json     // Spacing scale
  borderRadius   Json     // Border radius scale
  shadows        Json     // Shadow definitions
  isDefault      Boolean  @default(false)
  isActive       Boolean  @default(true)
  organizationId String?  @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  createdBy      String   @db.ObjectId

  // Relations
  creator      User          @relation(fields: [createdBy], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@map("themes")
}

model ModuleConfig {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  moduleName  String   // e.g., "auth", "billing", "notifications"
  config      Json     // Module-specific configuration
  isEnabled   Boolean  @default(true)
  version     String   @default("1.0.0")
  dependencies String[] // Other modules this depends on
  environment String   @default("all")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([moduleName, environment])
  @@map("module_configs")
}

enum ConfigType {
  STRING
  NUMBER
  BOOLEAN
  JSON
  COLOR
  FILE
  SECRET
}

enum ExperimentStatus {
  DRAFT
  RUNNING
  COMPLETED
  PAUSED
  CANCELLED
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST endpoints
// packages/api/src/trpc/routers/config.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { configSchemas } from "../schemas/config.schemas";

export const configRouter = createTRPCRouter({
  // Public configuration access
  getPublicConfigs: publicProcedure
    .input(configSchemas.getPublicConfigsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.configService.getPublicConfigs(input.module);
    }),

  // Admin configuration management
  list: protectedProcedure
    .input(configSchemas.getConfigsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.configService.getConfigs(input);
    }),

  create: protectedProcedure
    .input(configSchemas.createConfigInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.configService.createConfig(input);
    }),

  update: protectedProcedure
    .input(configSchemas.updateConfigInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.configService.updateConfig(input);
    }),

  delete: protectedProcedure
    .input(configSchemas.deleteConfigInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.configService.deleteConfig(input.id);
    }),

  // Configuration history
  getHistory: protectedProcedure
    .input(configSchemas.getHistoryInput)
    .query(async ({ input, ctx }) => {
      return await ctx.configService.getConfigHistory(input.configId);
    }),

  rollback: protectedProcedure
    .input(configSchemas.rollbackConfigInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.configService.rollbackConfig(input);
    }),

  // Feature flags
  getFeatureFlags: publicProcedure
    .input(configSchemas.getFeatureFlagsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.featureFlagService.getFeatureFlags(input);
    }),

  createFeatureFlag: protectedProcedure
    .input(configSchemas.createFeatureFlagInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.featureFlagService.createFeatureFlag(input);
    }),

  updateFeatureFlag: protectedProcedure
    .input(configSchemas.updateFeatureFlagInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.featureFlagService.updateFeatureFlag(input);
    }),

  // Theming
  getThemes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.themeService.getThemes();
  }),

  createTheme: protectedProcedure
    .input(configSchemas.createThemeInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.themeService.createTheme(input);
    }),

  updateTheme: protectedProcedure
    .input(configSchemas.updateThemeInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.themeService.updateTheme(input);
    }),

  // A/B Testing
  createExperiment: protectedProcedure
    .input(configSchemas.createExperimentInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.experimentService.createExperiment(input);
    }),

  getExperimentResults: protectedProcedure
    .input(configSchemas.getExperimentResultsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.experimentService.getExperimentResults(
        input.experimentId
      );
    }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with proper interfaces
// packages/api/src/config/config.service.ts

@Injectable()
export class ConfigService implements IConfigService {
  constructor(
    private readonly configRepository: IConfigRepository,
    private readonly historyRepository: IConfigHistoryRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly cacheService: ICacheService,
    private readonly websocketGateway: ConfigWebSocketGateway
  ) {}

  async getPublicConfigs(module?: string): Promise<PublicConfigsResult> {
    const cacheKey = `public_configs:${module || "all"}`;

    // Try cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const configs = await this.configRepository.findPublicConfigs(module);

    const result = {
      configs: configs.reduce(
        (acc, config) => {
          acc[config.key] = this.decryptValue(config.value, config.isEncrypted);
          return acc;
        },
        {} as Record<string, any>
      ),
      timestamp: new Date(),
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, 300);

    return result;
  }

  async createConfig(input: CreateConfigInput): Promise<CreateConfigResult> {
    // Validate schema if provided
    if (input.schema) {
      await this.validateConfigSchema(input.value, input.schema);
    }

    // Encrypt sensitive values
    const encryptedValue =
      input.type === ConfigType.SECRET
        ? await this.encryptionService.encrypt(input.value)
        : input.value;

    const config = await this.configRepository.create({
      ...input,
      value: encryptedValue,
      isEncrypted: input.type === ConfigType.SECRET,
    });

    // Record history
    await this.historyRepository.create({
      configId: config.id,
      action: "CREATE",
      newValue: input.value,
      changedBy: input.createdBy,
      reason: input.reason,
    });

    // Invalidate cache
    await this.invalidateConfigCache(config.module);

    // Broadcast update
    await this.websocketGateway.broadcastConfigUpdate(config);

    return {
      config: this.sanitizeConfig(config),
    };
  }

  async updateConfig(input: UpdateConfigInput): Promise<UpdateConfigResult> {
    const existingConfig = await this.configRepository.findById(input.id);
    if (!existingConfig) {
      throw new Error("Configuration not found");
    }

    // Validate schema if provided
    if (input.schema) {
      await this.validateConfigSchema(input.value, input.schema);
    }

    // Encrypt sensitive values
    const encryptedValue =
      existingConfig.type === ConfigType.SECRET
        ? await this.encryptionService.encrypt(input.value)
        : input.value;

    const updatedConfig = await this.configRepository.update(input.id, {
      ...input,
      value: encryptedValue,
    });

    // Record history
    await this.historyRepository.create({
      configId: input.id,
      action: "UPDATE",
      oldValue: this.decryptValue(
        existingConfig.value,
        existingConfig.isEncrypted
      ),
      newValue: input.value,
      changedBy: input.updatedBy,
      reason: input.reason,
    });

    // Invalidate cache
    await this.invalidateConfigCache(updatedConfig.module);

    // Broadcast update
    await this.websocketGateway.broadcastConfigUpdate(updatedConfig);

    return {
      config: this.sanitizeConfig(updatedConfig),
    };
  }

  private async validateConfigSchema(value: any, schema: any): Promise<void> {
    // Implement JSON Schema validation
    // This would use a library like ajv or similar
  }

  private async invalidateConfigCache(module: string): Promise<void> {
    await this.cacheService.del(`public_configs:${module}`);
    await this.cacheService.del(`public_configs:all`);
  }

  private decryptValue(value: any, isEncrypted: boolean): any {
    return isEncrypted ? this.encryptionService.decrypt(value) : value;
  }

  private sanitizeConfig(config: SystemConfig): any {
    return {
      ...config,
      value: this.decryptValue(config.value, config.isEncrypted),
    };
  }
}
```

### **🎨 Frontend Hook (Next.js + React)**

```tsx
// ✅ CORRECTED: Next.js 14 + React Query + Zustand
// packages/web/src/hooks/useConfig.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useConfigStore } from "@/stores/config-store";

export function useConfig<T = any>(key: string, defaultValue?: T) {
  const {
    data: configs,
    isLoading,
    error,
  } = trpc.config.getPublicConfigs.useQuery({
    module: key.split(".")[0],
  });

  const value = configs?.configs?.[key] ?? defaultValue;

  return {
    value: value as T,
    isLoading,
    error,
  };
}

export function useConfigs(module: string) {
  const {
    data: configs,
    isLoading,
    error,
  } = trpc.config.getPublicConfigs.useQuery({
    module,
  });

  return {
    configs: configs?.configs || {},
    isLoading,
    error,
  };
}

export function useFeatureFlag(flagKey: string) {
  const { data: flags, isLoading } = trpc.config.getFeatureFlags.useQuery({
    environment: process.env.NODE_ENV,
  });

  const flag = flags?.find((f) => f.key === flagKey);

  return {
    enabled: flag?.enabled || false,
    isLoading,
    rolloutPercent: flag?.rolloutPercent || 0,
  };
}

export function useTheme() {
  const { data: themes, isLoading } = trpc.config.getThemes.useQuery();
  const { currentTheme, setCurrentTheme } = useConfigStore();

  const activeTheme =
    themes?.find((t) => t.name === currentTheme) || themes?.[0];

  return {
    themes: themes || [],
    activeTheme,
    setTheme: setCurrentTheme,
    isLoading,
  };
}
```

---

## 📅 **TIMELINE CORREGIDO**

### **🔗 Integración con Planning SOLID**

```typescript
// ✅ CORRECTED: Aligned with SOLID implementation
const CONFIG_IMPLEMENTATION_PLAN = {
  // PREREQUISITE: Complete SOLID principles first
  prerequisites: [
    "SOLID-005: Dependency Inversion Principle", // Week 5
    "REFACTOR-002: AuthService refactoring", // Week 6
  ],

  // ACTUAL IMPLEMENTATION: Weeks 15-16
  implementation: {
    week15: [
      "Database models implementation",
      "Basic configuration service (SOLID-compliant)",
      "tRPC router setup",
      "Frontend hooks and store",
      "Basic admin interface",
    ],
    week16: [
      "Feature flags system",
      "A/B testing framework",
      "Theme system implementation",
      "Advanced admin dashboard",
      "Performance optimization",
    ],
  },
};
```

---

## 🎯 **Feature Flags Integration**

```typescript
// ✅ CORRECTED: Integration with existing feature flags
// packages/shared/src/config/freemium-flags.ts

export const CONFIGURATION_FEATURE_FLAGS = {
  // Free tier
  basicConfig: {
    maxConfigurations: 50,
    themes: 2,
    featureFlags: 10,
    environmentVariables: "non-sensitive",
  },

  // Professional tier
  advancedConfig: {
    maxConfigurations: 500,
    customTheming: true,
    advancedFeatureFlags: true,
    abTesting: "basic",
    configurationHistory: 30, // days
    multiEnvironment: true,
  },

  // Enterprise tier
  enterpriseConfig: {
    maxConfigurations: "unlimited",
    whiteLabelTheming: true,
    advancedFeatureFlags: true,
    advancedAbTesting: true,
    fullConfigurationHistory: true,
    multiTenantSupport: true,
    customModules: true,
  },
} as const;
```

---

## ✅ **Criterios de Aceptación (ACTUALIZADOS)**

### **Prerequisitos SOLID**

- [ ] **SOLID-005 completado**: Dependency Inversion Principle aplicado
- [ ] **REFACTOR-002 completado**: AuthService usa configuración dinámica
- [ ] **Cache system**: Sistema de caché implementado para performance

### **Configuration Management**

- [ ] **CRUD operations**: Crear, leer, actualizar, eliminar configuraciones
- [ ] **Type validation**: Validación de tipos y schemas
- [ ] **Real-time updates**: Cambios aplicados sin restart
- [ ] **Encryption**: Valores sensibles encriptados
- [ ] **History tracking**: Historial completo de cambios

### **Feature Flags**

- [ ] **Boolean flags**: Flags simples on/off
- [ ] **Rollout percentage**: Gradual rollout de features
- [ ] **Conditions**: Flags basados en condiciones
- [ ] **Dependencies**: Flags dependientes de otros flags
- [ ] **Environment-specific**: Flags por environment

### **Theming System**

- [ ] **CSS variables**: Variables CSS dinámicas
- [ ] **Theme switching**: Cambio de tema en tiempo real
- [ ] **Custom themes**: Creación de temas personalizados
- [ ] **White-labeling**: Branding completo personalizable
- [ ] **Responsive themes**: Temas responsive para mobile

### **A/B Testing**

- [ ] **Experiment creation**: Crear experimentos fácilmente
- [ ] **Traffic splitting**: División de tráfico entre variantes
- [ ] **Results tracking**: Seguimiento de resultados
- [ ] **Statistical significance**: Validación estadística
- [ ] **Automatic winner**: Selección automática de ganador

---

## 💰 **Business Value & ROI**

### **Revenue Impact**

- **Feature Flags**: Reduce deployment risk, faster feature rollouts
- **White-labeling**: Enables Enterprise tier pricing
- **A/B Testing**: Optimize conversion rates and user engagement
- **Developer Productivity**: Faster development cycles

### **Implementation ROI**

```typescript
const CONFIG_SYSTEM_ROI = {
  developmentCosts: {
    fromScratch: 600, // hours (4 months)
    withLegacyDocs: 192, // hours (24 days)
    timeSaved: 408, // hours
  },

  businessImpact: {
    featureRolloutSpeed: 5, // 5x faster rollouts
    deploymentRisk: 0.2, // 80% risk reduction
    enterpriseFeatures: true, // Enables Enterprise pricing
    developerProductivity: 0.3, // 30% faster development
  },

  marketValue: {
    whiteLabelingRevenue: "enables $997 tier",
    abTestingValue: "optimization capabilities",
    competitiveAdvantage: "professional configuration",
  },
};
```

---

## 🔗 **Referencias al Proyecto Actual**

- **Legacy Documentation**: [Configuration Requirements](../../05-guides/legacy-systems/configuration/dynamic-configuration-system-requirements.md)
- **SOLID TODOs**: [SOLID-005](../tickets/SOLID-005-DIP.md)
- **Auth Integration**: [REFACTOR-002](../tickets/REFACTOR-002-AUTH-SERVICE.md)
- **Feature Flags**: [freemium-flags.ts](../../../packages/shared/src/config/freemium-flags.ts)
- **Cache Service**: [cache module](../../../packages/api/src/cache/)

---

**🎯 Este PRD está basado en:**

- ✅ 335 líneas de documentación legacy completa
- ✅ 8 tickets técnicos detallados y listos
- ✅ Stack tecnológico correcto (Prisma + MongoDB + tRPC)
- ✅ Integración con principios SOLID
- ✅ Feature flags del sistema actual
- ✅ Habilita Enterprise pricing tier y white-labeling
