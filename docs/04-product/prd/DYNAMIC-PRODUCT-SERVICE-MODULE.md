# PRD Template - DYNAMIC-BUSINESS-PLATFORM

## 📋 **Document Information**

- **PRD ID**: DYNAMIC-BUSINESS-PLATFORM
- **Title**: Dynamic Business Platform with Forms, Services & Products
- **Type**: Core Feature
- **Priority**: HIGH
- **Status**: 🆕 **DRAFT**
- **Owner**: Product Team
- **Created**: 2024-01-17T00:00:00Z
- **Last Updated**: 2024-01-17T00:00:00Z

## 🎯 **Product Overview**

### **Purpose**

Create a modular platform that enables businesses to dynamically create and manage services, products, and forms through an intuitive drag-and-drop interface, with flexible data structures and seamless user interactions.

### **Target Users**

- **Primary**: Business owners who need to create services, products, and capture leads
- **Secondary**: End customers who interact with forms and request services
- **Tertiary**: Service providers who fulfill requests and manage customer relationships

### **Business Value**

- **Reduced Time-to-Market**: 70% faster creation of digital services and products
- **Increased Conversion**: 40% improvement in lead capture through better forms
- **Enhanced Flexibility**: 100% customizable forms and service structures
- **Cost Reduction**: 60% less development time for business customizations

## 🏗️ **Technical Architecture**

### **Stack Alignment**

- ✅ **Database**: MongoDB with Prisma ORM
- ✅ **Backend**: NestJS with tRPC + REST APIs
- ✅ **Frontend**: Next.js 15+ with React Server Components
- ✅ **Authentication**: JWT with role-based permissions
- ✅ **Real-time**: WebSocket implementation
- ✅ **Email**: Resend integration
- ✅ **File Storage**: Configured storage solution

### **Architecture Patterns**

- ✅ **SOLID Principles**: All services follow SRP, OCP, LSP, ISP, DIP
- ✅ **Repository Pattern**: Data access abstraction
- ✅ **Event-Driven**: Domain events for loose coupling
- ✅ **Validation**: Zod schemas throughout

### **Modular Architecture (SOLID-Compliant)**

```typescript
business-platform/
├── 🎯 services-module/          # Gestión de servicios
│   ├── interfaces/              # ISP - Interfaces segregadas
│   │   ├── IServiceRepository.ts
│   │   ├── IServiceValidator.ts
│   │   └── IServiceAnalytics.ts
│   ├── entities/               # Entidades de dominio
│   │   └── Service.entity.ts
│   ├── repositories/           # DIP - Abstracciones de datos
│   │   └── ServiceRepository.ts
│   ├── use-cases/              # Casos de uso específicos
│   │   ├── CreateService.usecase.ts
│   │   ├── UpdateService.usecase.ts
│   │   └── DeleteService.usecase.ts
│   └── services/               # Servicios especializados
│       ├── ServiceCreationService.ts
│       ├── ServiceValidationService.ts
│       └── ServiceAnalyticsService.ts
├── 📦 products-module/          # Gestión de productos
│   ├── interfaces/
│   │   ├── IProductRepository.ts
│   │   ├── IProductPricing.ts
│   │   └── IProductCatalog.ts
│   ├── entities/
│   │   └── Product.entity.ts
│   ├── repositories/
│   │   └── ProductRepository.ts
│   ├── use-cases/
│   │   ├── CreateProduct.usecase.ts
│   │   ├── UpdateProduct.usecase.ts
│   │   └── ManageInventory.usecase.ts
│   └── services/
│       ├── ProductCreationService.ts
│       ├── ProductPricingService.ts
│       └── ProductCatalogService.ts
├── 📋 forms-module/             # Sistema de formularios
│   ├── form-builder/           # Constructor drag-and-drop
│   │   ├── interfaces/
│   │   │   ├── IFormBuilder.ts
│   │   │   ├── IComponentFactory.ts
│   │   │   └── IDragDropEngine.ts
│   │   ├── services/
│   │   │   ├── FormBuilderService.ts
│   │   │   ├── ComponentFactoryService.ts
│   │   │   └── DragDropService.ts
│   │   └── components/
│   │       ├── FormCanvas.tsx
│   │       ├── ComponentSidebar.tsx
│   │       └── PropertiesPanel.tsx
│   ├── form-renderer/          # Renderizado dinámico
│   │   ├── interfaces/
│   │   │   ├── IFormRenderer.ts
│   │   │   └── IThemeManager.ts
│   │   └── services/
│   │       ├── FormRenderingService.ts
│   │       └── ThemeManagementService.ts
│   ├── form-validator/         # Validación de respuestas
│   │   ├── interfaces/
│   │   │   ├── IFormValidator.ts
│   │   │   └── IValidationRule.ts
│   │   └── services/
│   │       ├── FormValidationService.ts
│   │       └── ValidationRuleService.ts
│   └── form-analytics/         # Métricas y conversiones
│       ├── interfaces/
│       │   ├── IFormAnalytics.ts
│       │   └── IConversionTracker.ts
│       └── services/
│           ├── FormAnalyticsService.ts
│           └── ConversionTrackingService.ts
├── 🎯 requests-module/          # Gestión de solicitudes
│   ├── lead-capture/           # Captura de leads
│   │   ├── interfaces/
│   │   │   ├── ILeadCapture.ts
│   │   │   └── ILeadProcessor.ts
│   │   └── services/
│   │       ├── LeadCaptureService.ts
│   │       └── LeadProcessorService.ts
│   ├── satisfaction-survey/    # Encuestas de satisfacción
│   │   ├── interfaces/
│   │   │   ├── ISatisfactionSurvey.ts
│   │   │   └── IInsightGenerator.ts
│   │   └── services/
│   │       ├── SatisfactionSurveyService.ts
│   │       └── InsightGeneratorService.ts
│   ├── service-request/        # Solicitudes de servicios
│   │   ├── interfaces/
│   │   │   ├── IServiceRequest.ts
│   │   │   └── IRequestProcessor.ts
│   │   └── services/
│   │       ├── ServiceRequestService.ts
│   │       └── RequestProcessorService.ts
│   └── request-processor/      # Procesamiento de requests
│       ├── interfaces/
│       │   ├── IRequestProcessor.ts
│       │   └── INotificationSender.ts
│       └── services/
│           ├── RequestProcessorService.ts
│           └── NotificationSenderService.ts
├── 👥 users-module/             # Gestión de usuarios
│   ├── interfaces/
│   │   ├── IUserRepository.ts
│   │   ├── IUserAuthentication.ts
│   │   └── IUserPermissions.ts
│   └── services/
│       ├── UserManagementService.ts
│       ├── UserAuthenticationService.ts
│       └── UserPermissionsService.ts
├── 🎨 design-system/           # Componentes reutilizables
│   ├── components/              # Componentes base
│   │   ├── form-elements/       # Inputs, selects, etc.
│   │   ├── layout/              # Grids, containers
│   │   ├── interactive/         # Buttons, modals
│   │   └── visualization/       # Charts, cards
│   ├── drag-drop-engine/        # Motor drag-and-drop
│   │   ├── interfaces/
│   │   │   ├── IDragDropEngine.ts
│   │   │   └── IDropZone.ts
│   │   └── services/
│   │       ├── DragDropEngineService.ts
│   │       └── DropZoneService.ts
│   ├── page-builder/            # Sistema tipo Elementor
│   │   ├── interfaces/
│   │   │   ├── IPageBuilder.ts
│   │   │   └── IBlockManager.ts
│   │   └── services/
│   │       ├── PageBuilderService.ts
│   │       └── BlockManagerService.ts
│   └── theme-system/            # Sistema de temas
│       ├── interfaces/
│       │   ├── IThemeManager.ts
│       │   └── IStyleGenerator.ts
│       └── services/
│           ├── ThemeManagerService.ts
│           └── StyleGeneratorService.ts
└── 🔌 integrations/            # Integraciones externas
    ├── interfaces/
    │   ├── IPaymentProvider.ts
    │   ├── IEmailProvider.ts
    │   └── IAnalyticsProvider.ts
    └── services/
        ├── PaymentIntegrationService.ts
        ├── EmailIntegrationService.ts
        └── AnalyticsIntegrationService.ts
```

## 📊 **Database Schema (Prisma + MongoDB)**

### **Data Models**

```prisma
// Core model for dynamic entities (services, products, forms)
model DynamicEntity {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  type      String   // 'form', 'service', 'product', 'request'
  name      String
  slug      String   @unique
  
  // JSON Schema flexible para estructuras dinámicas
  schema    Json     // Estructura del formulario/servicio/producto
  data      Json     // Datos específicos de configuración
  config    Json     // Configuración de comportamiento
  
  // Metadatos
  description String?
  tags        String[]
  status      String   @default("active") // active, inactive, draft
  version     Int      @default(1)
  
  // Relaciones
  ownerId   String @map("owner_id") @db.ObjectId
  owner     User   @relation(fields: [ownerId], references: [id])
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // Relaciones con respuestas
  responses FormResponse[]
  
  // Índices para performance
  @@index([type, ownerId])
  @@index([status])
  @@index([slug])
  @@index([createdAt])
  
  @@map("dynamic_entities")
}

// Modelo para respuestas de formularios
model FormResponse {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Relación con la entidad dinámica
  entityId  String   @map("entity_id") @db.ObjectId
  entity    DynamicEntity @relation(fields: [entityId], references: [id])
  
  // Respuestas en formato JSON
  responses Json
  
  // Información del respondiente
  respondent Json?   // Datos opcionales del usuario
  
  // Metadatos de la respuesta
  submittedAt DateTime @default(now()) @map("submitted_at")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  
  // Estado de procesamiento
  status      String   @default("pending") // pending, processed, failed
  processedAt DateTime? @map("processed_at")
  
  // Relación opcional con usuario registrado
  userId      String?  @map("user_id") @db.ObjectId
  user        User?    @relation(fields: [userId], references: [id])
  
  // Índices para performance
  @@index([entityId])
  @@index([submittedAt])
  @@index([status])
  @@index([userId])
  
  @@map("form_responses")
}

// Modelo para solicitudes de servicios
model ServiceRequest {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Relación con el servicio
  serviceId String   @map("service_id") @db.ObjectId
  service   DynamicEntity @relation(fields: [serviceId], references: [id])
  
  // Cliente que solicita
  customerId String @map("customer_id") @db.ObjectId
  customer   User   @relation(fields: [customerId], references: [id])
  
  // Proveedor asignado
  providerId String? @map("provider_id") @db.ObjectId
  provider   User?   @relation(fields: [providerId], references: [id])
  
  // Datos de la solicitud
  requestData Json
  
  // Estado de la solicitud
  status      String   @default("pending") // pending, assigned, in_progress, completed, cancelled
  priority    String   @default("medium") // low, medium, high, urgent
  
  // Fechas importantes
  requestedAt  DateTime @default(now()) @map("requested_at")
  assignedAt   DateTime? @map("assigned_at")
  startedAt    DateTime? @map("started_at")
  completedAt  DateTime? @map("completed_at")
  dueDate      DateTime? @map("due_date")
  
  // Comunicación
  notes       String?
  
  // Índices para performance
  @@index([serviceId])
  @@index([customerId])
  @@index([providerId])
  @@index([status])
  @@index([requestedAt])
  
  @@map("service_requests")
}

// Modelo para leads capturados
model Lead {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Relación con el formulario que capturó el lead
  formId    String   @map("form_id") @db.ObjectId
  form      DynamicEntity @relation(fields: [formId], references: [id])
  
  // Datos del lead
  leadData  Json
  
  // Información de contacto extraída
  email     String?
  phone     String?
  name      String?
  company   String?
  
  // Estado del lead
  status    String   @default("new") // new, contacted, qualified, converted, lost
  source    String?  // Fuente del lead
  
  // Propietario del lead
  ownerId   String   @map("owner_id") @db.ObjectId
  owner     User     @relation(fields: [ownerId], references: [id])
  
  // Asignación
  assignedTo String? @map("assigned_to") @db.ObjectId
  assignee   User?   @relation(fields: [assignedTo], references: [id])
  
  // Timestamps
  capturedAt DateTime @default(now()) @map("captured_at")
  lastContactAt DateTime? @map("last_contact_at")
  
  // Índices para performance
  @@index([formId])
  @@index([ownerId])
  @@index([status])
  @@index([capturedAt])
  @@index([email])
  
  @@map("leads")
}

// Actualización del modelo User para incluir las nuevas relaciones
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  role      String   @default("user") // user, admin, provider
  
  // Relaciones con el sistema dinámico
  ownedEntities  DynamicEntity[]
  responses      FormResponse[]
  
  // Relaciones con servicios
  serviceRequests ServiceRequest[] @relation("CustomerRequests")
  assignedRequests ServiceRequest[] @relation("ProviderRequests")
  
  // Relaciones con leads
  ownedLeads     Lead[] @relation("LeadOwner")
  assignedLeads  Lead[] @relation("LeadAssignee")
  
  // Metadatos adicionales para seguimiento
  lastFormSubmission DateTime? @map("last_form_submission")
  totalFormResponses Int @default(0) @map("total_form_responses")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}
```

### **Data Relationships**

- **1:Many Relations**: 
  - User → DynamicEntity (un usuario puede crear múltiples entidades)
  - DynamicEntity → FormResponse (una entidad puede tener múltiples respuestas)
  - User → ServiceRequest (un usuario puede hacer múltiples solicitudes)
  
- **Many:Many Relations**: 
  - ServiceRequest ↔ User (cliente y proveedor)
  - Lead ↔ User (owner y assignee)
  
- **Embedded Documents**: 
  - JSON fields para máxima flexibilidad en schema, data, config, responses

### **Performance Considerations**

- **Indexes**: Compuestos por type+ownerId, status, timestamps
- **Query Patterns**: Optimizado para búsquedas por usuario, tipo, y estado
- **Document Size**: JSON fields limitados a 16MB (límite MongoDB)

## 🔌 **API Endpoints**

### **tRPC Procedures**

```typescript
// Dynamic Entity Router
export const dynamicEntityRouter = createTRPCRouter({
  // Crear entidad dinámica
  create: protectedProcedure
    .input(CreateDynamicEntitySchema)
    .mutation(async ({ input, ctx }) => {
      const entity = await ctx.db.dynamicEntity.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
        },
      });
      return entity;
    }),

  // Obtener entidades por tipo
  getByType: protectedProcedure
    .input(z.object({ 
      type: z.enum(['form', 'service', 'product', 'request']),
      limit: z.number().optional(),
      offset: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      const entities = await ctx.db.dynamicEntity.findMany({
        where: {
          type: input.type,
          ownerId: ctx.session.user.id,
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { createdAt: 'desc' },
      });
      return entities;
    }),

  // Actualizar entidad
  update: protectedProcedure
    .input(UpdateDynamicEntitySchema)
    .mutation(async ({ input, ctx }) => {
      const entity = await ctx.db.dynamicEntity.update({
        where: { id: input.id },
        data: input,
      });
      return entity;
    }),

  // Eliminar entidad
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.dynamicEntity.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});

// Form Response Router
export const formResponseRouter = createTRPCRouter({
  // Enviar respuesta de formulario
  submit: publicProcedure
    .input(SubmitFormResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.db.formResponse.create({
        data: {
          entityId: input.entityId,
          responses: input.responses,
          respondent: input.respondent,
          ipAddress: ctx.ip,
          userAgent: ctx.userAgent,
          userId: ctx.session?.user?.id,
        },
      });
      
      // Trigger processing
      await ctx.eventBus.emit('form.response.submitted', response);
      
      return response;
    }),

  // Obtener respuestas de un formulario
  getByForm: protectedProcedure
    .input(z.object({ 
      entityId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      const responses = await ctx.db.formResponse.findMany({
        where: {
          entityId: input.entityId,
          entity: { ownerId: ctx.session.user.id },
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { submittedAt: 'desc' },
      });
      return responses;
    }),
});

// Service Request Router
export const serviceRequestRouter = createTRPCRouter({
  // Crear solicitud de servicio
  create: protectedProcedure
    .input(CreateServiceRequestSchema)
    .mutation(async ({ input, ctx }) => {
      const request = await ctx.db.serviceRequest.create({
        data: {
          ...input,
          customerId: ctx.session.user.id,
        },
      });
      
      // Trigger notification
      await ctx.eventBus.emit('service.request.created', request);
      
      return request;
    }),

  // Asignar proveedor
  assign: protectedProcedure
    .input(z.object({ 
      requestId: z.string(),
      providerId: z.string() 
    }))
    .mutation(async ({ input, ctx }) => {
      const request = await ctx.db.serviceRequest.update({
        where: { id: input.requestId },
        data: {
          providerId: input.providerId,
          status: 'assigned',
          assignedAt: new Date(),
        },
      });
      
      // Trigger notification
      await ctx.eventBus.emit('service.request.assigned', request);
      
      return request;
    }),

  // Actualizar estado
  updateStatus: protectedProcedure
    .input(z.object({ 
      requestId: z.string(),
      status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
      notes: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const request = await ctx.db.serviceRequest.update({
        where: { id: input.requestId },
        data: {
          status: input.status,
          notes: input.notes,
          ...(input.status === 'in_progress' && { startedAt: new Date() }),
          ...(input.status === 'completed' && { completedAt: new Date() }),
        },
      });
      
      // Trigger appropriate events
      await ctx.eventBus.emit(`service.request.${input.status}`, request);
      
      return request;
    }),
});

// Lead Router
export const leadRouter = createTRPCRouter({
  // Obtener leads
  getAll: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const leads = await ctx.db.lead.findMany({
        where: {
          ownerId: ctx.session.user.id,
          ...(input.status && { status: input.status }),
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { capturedAt: 'desc' },
        include: {
          form: { select: { name: true, type: true } },
          assignee: { select: { name: true, email: true } },
        },
      });
      return leads;
    }),

  // Actualizar estado de lead
  updateStatus: protectedProcedure
    .input(z.object({
      leadId: z.string(),
      status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const lead = await ctx.db.lead.update({
        where: { id: input.leadId },
        data: {
          status: input.status,
          lastContactAt: new Date(),
        },
      });
      
      // Trigger analytics event
      await ctx.eventBus.emit('lead.status.updated', lead);
      
      return lead;
    }),
});

// User Activity Router
export const userActivityRouter = createTRPCRouter({
  // Obtener todas las respuestas de formularios de un usuario
  getUserFormResponses: protectedProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const responses = await ctx.db.formResponse.findMany({
        where: {
          userId: input.userId,
          ...(input.dateFrom && { submittedAt: { gte: input.dateFrom } }),
          ...(input.dateTo && { submittedAt: { lte: input.dateTo } }),
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { submittedAt: 'desc' },
        include: {
          entity: {
            select: {
              name: true,
              type: true,
              description: true,
            },
          },
        },
      });
      return responses;
    }),

  // Obtener estadísticas de actividad del usuario
  getUserActivityStats: protectedProcedure
    .input(z.object({
      userId: z.string(),
      period: z.enum(['week', 'month', 'quarter', 'year']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          responses: {
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              responses: true,
              serviceRequests: true,
            },
          },
        },
      });

      return {
        totalFormResponses: user?._count.responses || 0,
        totalServiceRequests: user?._count.serviceRequests || 0,
        lastFormSubmission: user?.responses[0]?.submittedAt || null,
        memberSince: user?.createdAt,
      };
    }),

  // Obtener timeline de actividad del usuario
  getUserTimeline: protectedProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input, ctx }) => {
      // Combinar diferentes tipos de actividades
      const formResponses = await ctx.db.formResponse.findMany({
        where: { userId: input.userId },
        take: input.limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          entity: { select: { name: true, type: true } },
        },
      });

      const serviceRequests = await ctx.db.serviceRequest.findMany({
        where: { customerId: input.userId },
        take: input.limit,
        orderBy: { requestedAt: 'desc' },
        include: {
          service: { select: { name: true } },
        },
      });

      // Combinar y ordenar por fecha
      const timeline = [
        ...formResponses.map(response => ({
          type: 'form_response',
          date: response.submittedAt,
          title: `Formulario completado: ${response.entity.name}`,
          data: response,
        })),
        ...serviceRequests.map(request => ({
          type: 'service_request',
          date: request.requestedAt,
          title: `Solicitud de servicio: ${request.service.name}`,
          data: request,
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, input.limit);

      return timeline;
    }),
});
```

### **Validation Schemas**

```typescript
// Zod schemas para validación
export const CreateDynamicEntitySchema = z.object({
  type: z.enum(['form', 'service', 'product', 'request']),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  schema: z.record(z.any()), // JSON schema flexible
  data: z.record(z.any()), // Data específica
  config: z.record(z.any()), // Configuración
});

export const UpdateDynamicEntitySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  schema: z.record(z.any()).optional(),
  data: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
});

export const SubmitFormResponseSchema = z.object({
  entityId: z.string(),
  responses: z.record(z.any()),
  respondent: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
});

export const CreateServiceRequestSchema = z.object({
  serviceId: z.string(),
  requestData: z.record(z.any()),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
});

export type CreateDynamicEntityDto = z.infer<typeof CreateDynamicEntitySchema>;
export type UpdateDynamicEntityDto = z.infer<typeof UpdateDynamicEntitySchema>;
export type SubmitFormResponseDto = z.infer<typeof SubmitFormResponseSchema>;
export type CreateServiceRequestDto = z.infer<typeof CreateServiceRequestSchema>;
```

## 📋 **Business Requirements**

### **Functional Requirements**

1. **Dynamic Form Creation**
   - **Description**: Users can create forms using drag-and-drop interface
   - **Acceptance Criteria**: 
     - Drag components from sidebar to canvas
     - Configure component properties
     - Save form as JSON schema
     - Generate unique form URL
   - **Priority**: HIGH

2. **Form Response Collection**
   - **Description**: Forms can collect responses and store them flexibly
   - **Acceptance Criteria**: 
     - Public forms accessible via URL
     - Validate responses against schema
     - Store responses as JSON
     - Send notifications to owner
   - **Priority**: HIGH

3. **Service Request Management**
   - **Description**: Users can create services and manage requests
   - **Acceptance Criteria**: 
     - Create service with custom form
     - Customers can request services
     - Assign providers to requests
     - Track request status
   - **Priority**: HIGH

4. **Lead Capture and Management**
   - **Description**: Forms can capture leads and manage them
   - **Acceptance Criteria**: 
     - Identify lead forms vs other forms
     - Extract contact information
     - Assign leads to team members
     - Track lead status through pipeline
   - **Priority**: MEDIUM

5. **Analytics and Insights**
   - **Description**: Provide insights on form performance and conversions
   - **Acceptance Criteria**: 
     - Track form views and submissions
     - Calculate conversion rates
     - Generate performance reports
     - Export data for analysis
   - **Priority**: MEDIUM

6. **User Activity Tracking**
   - **Description**: Ver todos los lugares donde el usuario ha rellenado formularios
   - **Acceptance Criteria**: 
     - Vista de detalle del usuario con historial de formularios
     - Lista de todas las respuestas de formularios por usuario
     - Filtros por fecha, tipo de formulario, estado
     - Exportar historial de actividad del usuario
   - **Priority**: HIGH

7. **User Detail Dashboard**
   - **Description**: Vista completa del usuario con toda su actividad
   - **Acceptance Criteria**: 
     - Información básica del usuario
     - Historial de formularios completados
     - Estado de requerimientos cumplidos/pendientes
     - Timeline de actividad
     - Métricas de participación
   - **Priority**: HIGH

### **Non-Functional Requirements**

- **Performance**: Form loading <500ms, submission <200ms
- **Scalability**: Support 10,000+ concurrent form submissions
- **Security**: GDPR-compliant data handling, XSS protection
- **Availability**: 99.9% uptime
- **Usability**: Intuitive drag-and-drop interface

### **Business Rules**

1. **Form Ownership**: Only form creators can edit their forms
2. **Response Privacy**: Form responses are private to form owners
3. **Service Assignment**: Only service owners can assign providers
4. **Lead Assignment**: Leads can only be assigned to team members

## ✅ **Acceptance Criteria**

### **Feature Completion Criteria**

- [ ] **Database Schema**: Prisma models created and migrated
- [ ] **Backend Services**: SOLID-compliant services implemented
- [ ] **API Endpoints**: tRPC procedures working with validation
- [ ] **Frontend Components**: Drag-and-drop form builder
- [ ] **Form Rendering**: Dynamic form rendering from JSON schema
- [ ] **Response Collection**: Form submission and storage
- [ ] **Service Management**: Service creation and request handling
- [ ] **Lead Management**: Lead capture and pipeline management
- [ ] **User Activity Tracking**: Complete user form response history
- [ ] **User Detail Dashboard**: Comprehensive user activity view
- [ ] **Analytics**: Basic analytics dashboard
- [ ] **Integration**: Feature integrated with existing auth system
- [ ] **Testing**: Unit, integration, and E2E tests passing
- [ ] **Documentation**: Technical documentation updated

### **Quality Gates**

- [ ] **Test Coverage**: ≥95% for new services
- [ ] **Performance**: API responses <200ms
- [ ] **SOLID Compliance**: All principles followed
- [ ] **Security**: Input validation and sanitization
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Mobile**: Responsive design working

### **Business Validation**

- [ ] **User Flows**: All primary user journeys working
- [ ] **Error Handling**: Graceful error states implemented
- [ ] **Edge Cases**: Boundary conditions handled
- [ ] **Integration**: Works with existing features

## 🔗 **Dependencies**

### **Internal Dependencies**

- **Authentication System**: Required for user management
- **Email Service**: Required for notifications
- **File Storage**: Required for form uploads
- **Real-time Service**: Required for live form analytics

### **External Dependencies**

- **React DnD**: For drag-and-drop functionality
- **Zod**: For schema validation
- **Prisma**: For database ORM
- **MongoDB**: For flexible data storage

### **Blocker Dependencies**

- **User Management**: Must be completed before form ownership
- **File Upload**: Must be completed before form file uploads

## 📈 **Success Metrics**

### **Technical Metrics**

- **API Performance**: <200ms response times
- **Error Rate**: <1% error rate
- **Test Coverage**: ≥95% coverage
- **Code Quality**: No critical SonarQube issues

### **Business Metrics**

- **User Adoption**: 70% of users create at least one form
- **Form Submissions**: 10,000+ submissions per month
- **User Satisfaction**: NPS > 8.0
- **Form Completion Rate**: >60% average completion rate

### **Monitoring & Alerting**

- **Key Metrics to Track**: Form views, submissions, errors, performance
- **Alert Thresholds**: >5% error rate, >500ms response time
- **Dashboards**: Real-time analytics dashboard

## 📝 **Implementation Notes**

### **Technical Considerations**

- **JSON Schema Validation**: Use Zod for runtime validation
- **Database Flexibility**: MongoDB's JSON fields provide schema flexibility
- **Event-Driven Architecture**: Use events for loose coupling between modules
- **Caching Strategy**: Redis for form schemas and frequently accessed data

### **Migration Strategy**

- **Data Migration**: No existing data to migrate
- **Feature Flags**: Gradual rollout with feature flags
- **Rollback Plan**: Database rollback + feature flag disable

### **Security Considerations**

- **Authentication**: JWT-based authentication for API access
- **Authorization**: Role-based access control for forms and responses
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Comprehensive input sanitization

## 🚀 **Delivery Plan**

### **Phase 1: Foundation (4 weeks)**

- [ ] Database schema design and implementation
- [ ] Core service architecture (SOLID-compliant)
- [ ] Basic tRPC endpoints for CRUD operations
- [ ] Authentication integration

### **Phase 2: Form Builder (6 weeks)**

- [ ] Drag-and-drop form builder interface
- [ ] Component library for form elements
- [ ] JSON schema generation and validation
- [ ] Form preview functionality

### **Phase 3: Form Runtime (4 weeks)**

- [ ] Dynamic form rendering from JSON schema
- [ ] Form submission and response storage
- [ ] Basic analytics and reporting
- [ ] Email notifications

### **Phase 4: Service Management (4 weeks)**

- [ ] Service creation and management
- [ ] Service request workflow
- [ ] Provider assignment system
- [ ] Request status tracking

### **Phase 5: Lead Management (3 weeks)**

- [ ] Lead capture from forms
- [ ] Lead assignment and management
- [ ] Lead pipeline tracking
- [ ] Lead analytics and reporting

### **Phase 6: Polish & Optimization (3 weeks)**

- [ ] Performance optimization
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive design
- [ ] Comprehensive testing
- [ ] Documentation completion

---

## 📋 **Approval Checklist**

- [ ] **Technical Review**: Architecture Agent approval
- [ ] **Business Review**: Product Owner approval
- [ ] **Security Review**: Security considerations validated
- [ ] **Performance Review**: Performance requirements realistic
- [ ] **Resource Review**: Development capacity confirmed

---

**Next Steps**: Technical review and architecture refinement  
**Assigned Agents**: Architecture Agent, Frontend Agent, Backend Agent  
**Estimated Timeline**: 24 weeks total development time