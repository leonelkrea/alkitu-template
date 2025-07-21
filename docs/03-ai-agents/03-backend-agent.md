# 💻 Backend Agent - NestJS Services Specialist

**🔧 Stack Real Implementado**: NestJS 11.0.1 + MongoDB + Prisma 6.10.1 + tRPC 11.4.3 + Resend 4.6.0 + Zod 3.25.67 + Socket.IO

## 🎯 Role Definition

**Primary Responsibility**: Implementar servicios backend siguiendo principios SOLID usando el stack tecnológico real: NestJS + MongoDB + Prisma + tRPC + Resend + OAuth (GitHub/Google) + Socket.IO para WebSocket + Zod para validación.

**Duration**: Días 6-15 (implementación continua)
**Current Status**: ✅ **COMPLETED** - All backend services operational, ready for Frontend integration

---

## 📋 Responsibilities

### **Core Services Implementation**

1. **Products/Services System**: Gestión completa de productos y servicios
2. **User Groups Management**: Sistema de grupos de usuarios con permisos
3. **Tags System**: Sistema de etiquetado polimórfico
4. **Public Chat System**: Chat público para lead generation
5. **Integration**: Integrar servicios con sistema existente

### **Deliverables**

- [ ] **Products Module** (`packages/api/src/products/`)
- [ ] **User Groups Module** (`packages/api/src/user-groups/`)
- [ ] **Tags Module** (`packages/api/src/tags/`)
- [ ] **Chat Module** (`packages/api/src/chat/`)
- [ ] **Database Migrations** (Prisma schemas actualizados)
- [ ] **tRPC Routers** para todos los servicios
- [ ] **Test Coverage** 95%+ para cada módulo
- [ ] **API Documentation** (Swagger/OpenAPI)
- [ ] **Resend Integration** para emails transaccionales
- [ ] **OAuth Integration** (GitHub/Google)
- [ ] **WebSocket Gateway** para real-time features
- [ ] **Feature Flags** integration con freemium model
- [ ] **Push Notifications** sistema completo

---

## 🛠️ Implementation Stack

### **Backend Technologies (Stack Real)**

- **Framework**: NestJS 11.0.1 con TypeScript 5.7.3
- **Database**: MongoDB con Prisma ORM 6.10.1
- **APIs**: tRPC 11.4.3 + REST + WebSocket (Socket.IO)
- **Validation**: Zod 3.25.67 + class-validator 0.14.2 + nestjs-zod 4.3.1
- **Testing**: Jest + Supertest + ESLint + Prettier
- **Authentication**: JWT + Passport.js (Local + JWT strategies)
- **Email Service**: Resend 4.6.0 (completamente integrado)
- **OAuth**: GitHub + Google (configurado, requiere secrets)
- **Push Notifications**: Web-Push 3.6.7
- **WebSocket**: Socket.IO para real-time features
- **Monorepo**: Workspaces configurado

### **Architecture Patterns (Implementado)**

- **SOLID Principles**: Implementación estricta
- **Repository Pattern**: Para acceso a datos
- **Service Layer**: Lógica de negocio
- **Domain Events**: Para comunicación entre módulos
- **Feature Flags**: Sistema freemium avanzado en `/packages/shared/src/config/freemium-flags.ts`
- **Role-Based Access Control**: ADMIN, EMPLOYEE, CLIENT, LEAD, USER, MODERATOR
- **Two-Factor Authentication**: Implementado con TOTP
- **Multi-tenant Ready**: User Groups con permisos granulares
- **Real-time Features**: WebSocket con Socket.IO
- **Polymorphic Relations**: Tags system polimórfico

---

## 📐 Implementation Plan

### **Phase 1: Products/Services System (Days 6-8)**

#### **Day 6: Database & Repository Layer**

```yaml
Morning:
  - Update Prisma schema with Product models
  - Create Product repository implementations
  - Create Category repository implementations
  - Generate and run migrations

Afternoon:
  - Implement ProductRepository with all CRUD operations
  - Create ProductCategoryRepository
  - Add database indexes for performance
  - Write repository unit tests

Deliverables:
  - Product models in Prisma schema
  - Repository implementations with tests
  - Database migrations applied
```

#### **Day 7: Service Layer & Business Logic**

```yaml
Morning:
  - Implement ProductService with SOLID principles
  - Create CategoryService for hierarchical categories
  - Implement PricingService for dynamic pricing
  - Add inventory management logic

Afternoon:
  - Create validation DTOs with Zod
  - Implement business rules and constraints
  - Add error handling and logging
  - Write service unit tests

Deliverables:
  - ProductService with all business logic
  - Validation schemas and DTOs
  - Service layer tests (95%+ coverage)
```

#### **Day 8: API Layer & Integration**

```yaml
Morning:
  - Create ProductController for REST API
  - Implement ProductRouter for tRPC
  - Add authentication guards
  - Create admin-specific endpoints

Afternoon:
  - Integrate with Tags system
  - Add search and filtering capabilities
  - Implement pagination
  - Create API documentation

Deliverables:
  - Complete Products API (REST + tRPC)
  - Search and filtering functionality
  - API documentation and examples
```

---

### **Phase 2: User Groups System (Days 9-11)**

#### **Day 9: Groups Foundation**

```yaml
Morning:
  - Update Prisma schema with UserGroup models
  - Create UserGroupRepository implementation
  - Create GroupMembershipRepository
  - Generate and run migrations

Afternoon:
  - Implement UserGroupService
  - Create MembershipService for user management
  - Add group hierarchy logic
  - Write repository and service tests

Deliverables:
  - UserGroup models and repositories
  - Basic group management functionality
  - Membership management system
```

#### **Day 10: Permissions & Roles**

```yaml
Morning:
  - Implement GroupPermissionService
  - Create role-based access control (RBAC)
  - Add permission checking logic
  - Create permission guards

Afternoon:
  - Implement group invitation system
  - Add approval workflows
  - Create bulk operations for management
  - Write permission system tests

Deliverables:
  - Complete permission system
  - RBAC implementation
  - Group invitation and approval workflows
```

#### **Day 11: Groups API & Integration**

```yaml
Morning:
  - Create UserGroupController for REST API
  - Implement UserGroupRouter for tRPC
  - Add WebSocket events for real-time updates
  - Create admin dashboard endpoints

Afternoon:
  - Integrate with existing User system
  - Add search and filtering for groups
  - Implement group analytics
  - Create API documentation

Deliverables:
  - Complete Groups API (REST + tRPC + WS)
  - Integration with user system
  - Real-time group updates
```

---

### **Phase 3: Tags System (Days 12-13)**

#### **Day 12: Tags Infrastructure**

```yaml
Morning:
  - Update Prisma schema with Tag models
  - Create TagRepository implementation
  - Create polymorphic relations
  - Generate and run migrations

Afternoon:
  - Implement TagService with CRUD operations
  - Create TagCategoryService
  - Add tag suggestion algorithms
  - Implement usage tracking

Deliverables:
  - Tag models and repositories
  - Polymorphic tagging system
  - Tag suggestions and analytics
```

#### **Day 13: Tags API & Integration**

```yaml
Morning:
  - Create TagController for REST API
  - Implement TagRouter for tRPC
  - Add bulk tagging operations
  - Create tag management endpoints

Afternoon:
  - Integrate tags with Products and Groups
  - Add search and autocomplete
  - Implement popular tags functionality
  - Create tag analytics dashboard

Deliverables:
  - Complete Tags API
  - Integration with all entities
  - Tag analytics and insights
```

---

### **Phase 4: Public Chat System (Days 14-15)**

#### **Day 14: Chat Foundation**

```yaml
Morning:
  - Update Prisma schema with Chat models
  - Create ConversationRepository
  - Create ChatMessageRepository
  - Generate and run migrations

Afternoon:
  - Implement ChatService for conversations
  - Create MessageService for message handling
  - Add ContactInfoService for leads
  - Implement rate limiting and spam protection

Deliverables:
  - Chat models and repositories
  - Conversation and message management
  - Lead capture system
```

#### **Day 15: Chat API & Real-time**

```yaml
Morning:
  - Create ChatController for public API
  - Implement ChatAdminController for dashboard
  - Create ChatRouter for tRPC
  - Add WebSocket gateway for real-time chat

Afternoon:
  - Integrate with notification system
  - Add chat analytics and metrics
  - Create chat configuration system
  - Implement auto-assignment logic

Deliverables:
  - Complete Chat system (REST + tRPC + WS)
  - Real-time messaging
  - Chat analytics and configuration
```

---

## 🔧 Service Implementation Templates

### **Repository Implementation Template**

```typescript
@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...data,
          slug: this.generateSlug(data.name),
        },
        include: this.getProductIncludes(),
      });

      await this.updateSearchIndex(product);
      return product;
    } catch (error) {
      throw new ProductCreationException(error.message);
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: this.getProductIncludes(),
    });
  }

  private getProductIncludes() {
    return {
      category: true,
      tags: true,
      pricing: true,
      variants: true,
      createdBy: {
        select: { id: true, email: true, name: true },
      },
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}
```

### **Service Implementation Template**

```typescript
@Injectable()
export class ProductService implements IProductService {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: IProductCategoryRepository,
    private tagService: ITagService,
    private eventEmitter: EventEmitter2,
    private logger: Logger
  ) {}

  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    // Validation
    await this.validateProductData(data);

    // Business logic
    const productData = await this.prepareProductData(data);

    // Create product
    const product = await this.productRepository.create(productData);

    // Handle tags if provided
    if (data.tagIds?.length) {
      await this.tagService.tagEntity("product", product.id, data.tagIds);
    }

    // Emit domain event
    this.eventEmitter.emit("product.created", {
      productId: product.id,
      product,
    });

    this.logger.log(`Product created: ${product.id}`, "ProductService");

    return this.mapToResponse(product);
  }

  private async validateProductData(data: CreateProductRequest): Promise<void> {
    // Check category exists
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new CategoryNotFoundException(data.categoryId);
      }
    }

    // Validate pricing
    if (data.pricing?.length) {
      this.validatePricing(data.pricing);
    }

    // Check unique constraints
    await this.checkUniqueConstraints(data);
  }

  private async prepareProductData(
    data: CreateProductRequest
  ): Promise<CreateProductData> {
    return {
      ...data,
      slug: await this.generateUniqueSlug(data.name),
      status: data.status || ProductStatus.DRAFT,
      trackInventory: data.trackInventory || false,
      createdById: data.userId,
    };
  }
}
```

### **Controller Implementation Template**

```typescript
@Controller("products")
@ApiTags("Products")
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productService: IProductService) {}

  @Post()
  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({ status: 201, type: ProductResponse })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: User
  ): Promise<ProductResponse> {
    return this.productService.createProduct({
      ...dto,
      userId: user.id,
    });
  }

  @Get(":identifier")
  @ApiOperation({ summary: "Get product by ID or slug" })
  @ApiResponse({ status: 200, type: ProductResponse })
  @Public()
  async getProduct(
    @Param("identifier") identifier: string
  ): Promise<ProductResponse> {
    return this.productService.getProduct(identifier);
  }

  @Get()
  @ApiOperation({ summary: "Search products" })
  @ApiResponse({ status: 200, type: PaginatedProductResponse })
  @Public()
  async searchProducts(
    @Query() filters: ProductSearchDto
  ): Promise<PaginatedResponse<ProductResponse>> {
    return this.productService.searchProducts(filters);
  }
}
```

### **tRPC Router Template**

```typescript
export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.productService.createProduct({
        ...input,
        userId: ctx.user.id,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.productService.getProduct(input.id);
    }),

  search: publicProcedure
    .input(productSearchSchema)
    .query(async ({ ctx, input }) => {
      return ctx.productService.searchProducts(input);
    }),

  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.productService.updateProduct(input.id, {
        ...input,
        userId: ctx.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.productService.deleteProduct(input.id);
      return { success: true };
    }),
});
```

---

## 🧪 Testing Requirements

### **Test Coverage Standards**

- **Unit Tests**: 95%+ coverage for all services
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user journeys
- **Mutation Tests**: 85%+ survival rate with Stryker

### **Testing Templates**

```typescript
describe("ProductService", () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: IProductRepository,
          useValue: createMockRepository(),
        },
        {
          provide: EventEmitter2,
          useValue: createMockEventEmitter(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(IProductRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  describe("createProduct", () => {
    it("should create product successfully", async () => {
      // Arrange
      const createRequest = createMockProductRequest();
      const expectedProduct = createMockProduct();
      repository.create.mockResolvedValue(expectedProduct);

      // Act
      const result = await service.createProduct(createRequest);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createRequest.name,
          slug: expect.any(String),
        })
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        "product.created",
        expect.objectContaining({ productId: expectedProduct.id })
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: expectedProduct.id,
          name: expectedProduct.name,
        })
      );
    });

    it("should validate category exists", async () => {
      // Arrange
      const createRequest = createMockProductRequest({
        categoryId: "non-existent",
      });
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createProduct(createRequest)).rejects.toThrow(
        CategoryNotFoundException
      );
    });
  });
});
```

---

## 🔄 Integration Points

### **With Existing Systems (Implementados)**

- **User Service**: Sistema completo con roles, 2FA, OAuth (GitHub/Google)
- **Notification Service**: Implementado con Resend + Push Notifications + Web-Push
- **Analytics Service**: Tracking de usage y performance metrics
- **Billing Service**: Estructura básica (sin procesador de pagos implementado)
- **Feature Flags**: Sistema freemium completo por módulos
- **Email Templates**: Sistema completo con plantillas HTML
- **Access Control**: RBAC completo con permisos granulares
- **WebSocket Gateway**: Para real-time features
- **Shared Package**: Tipos, esquemas Zod, y utilidades compartidas

### **Module Dependencies**

```typescript
// Dependencies graph
Tags System <- Products System
Tags System <- User Groups System
User Groups System <- Chat System (for assignment)
Notification System <- Chat System
Analytics System <- All Systems
```

---

## 📊 Success Metrics

### **Quality Metrics**

- [ ] **Test Coverage**: 95%+ for all modules
- [ ] **Mutation Score**: 85%+ with Stryker
- [ ] **API Response Time**: < 200ms for CRUD operations
- [ ] **Database Query Optimization**: N+1 queries eliminated
- [ ] **Error Rate**: < 0.1% in production

### **Feature Completion**

- [ ] **Products**: Full CRUD, categories, pricing, inventory
- [ ] **Groups**: Management, permissions, invitations, bulk operations
- [ ] **Tags**: Polymorphic tagging, suggestions, analytics
- [ ] **Chat**: Real-time messaging, lead capture, admin dashboard

---

## 🚀 Deployment Considerations

### **Database Migrations**

- [ ] Create migration scripts for all new models
- [ ] Add proper indexes for performance
- [ ] Plan rollback strategies
- [ ] Test migrations on staging environment

### **API Versioning**

- [ ] Version new API endpoints
- [ ] Maintain backward compatibility
- [ ] Document breaking changes
- [ ] Plan deprecation timeline for old endpoints

### **Performance Optimization**

- [ ] Database query optimization
- [ ] Caching strategies for frequently accessed data
- [ ] Connection pooling configuration
- [ ] Rate limiting for public APIs

---

**Backend Agent está diseñado para implementar servicios backend robustos y escalables que cumplan con los estándares de calidad comercial del template.**

---

## 🔧 Servicios Externos Integrados

### **Email Service (Resend 4.6.0)**

```typescript
// ✅ COMPLETAMENTE INTEGRADO Y FUNCIONAL
- Welcome emails (plantillas HTML)
- Password reset (con tokens seguros)
- Notifications (email + push)
- Bulk emails (procesamiento batch)
- HTML templates (sistema completo)
- Configuration: process.env.RESEND_API_KEY
```

### **OAuth Providers**

```typescript
// ✅ CONFIGURADO (requiere secrets)
- GitHub OAuth (estrategia Passport.js)
- Google OAuth (estrategia Passport.js)
- Passport.js strategies (implementadas)
- Configuration: GitHub/Google developer console
```

### **Push Notifications (Web-Push 3.6.7)**

```typescript
// ✅ WEB-PUSH INTEGRADO
- Service Worker ready
- Push notification system
- Notification preferences
- Browser compatibility
- Configuration: VAPID keys
```

### **WebSocket Features (Socket.IO 4.8.1)**

```typescript
// ✅ SOCKET.IO IMPLEMENTADO
- Real-time chat
- Live notifications
- User presence
- Room management
- Configuration: /notifications namespace
```

### **Feature Flags System**

```typescript
// ✅ SISTEMA FREEMIUM COMPLETO
- Free/Premium/Enterprise tiers
- Module-based activation
- Granular permissions
- License validation
- Configuration: packages/shared/src/config/freemium-flags.ts
```

---

## 🚨 Servicios NO Implementados

### **Sistemas de Pago**

- ❌ **Redsys**: Mencionado en documentación pero NO implementado (España)
- ❌ **Stripe**: NO implementado (PRD disponible en docs/04-product/prd/09-billing-payments.md)
- ❌ **PayPal**: NO implementado
- ✅ **Estructura de Billing**: Básica implementada (modelo Prisma + controlador)

### **GraphQL**

- ⚠️ **GraphQL**: Configurado pero DESHABILITADO por defecto
- ✅ **GraphQL Config**: Disponible en `modules.config.ts` con configuración completa
- ✅ **Development**: Se habilita automáticamente en modo desarrollo
- ✅ **Mobile Integration**: Mobile app configurado para usar GraphQL cuando esté habilitado
- ✅ **tRPC**: Implementado como alternativa principal (habilitado por defecto)
- 🔧 **Activar GraphQL**: `ENABLE_MOBILE=true` en variables de entorno

### **Servicios Adicionales**

- 🔮 **Redis**: Configurado pero OMITIDO intencionalmente (reservado para chat/messaging futuro)
- ❌ **Queue System**: No implementado (Bull, BullMQ) - se implementará con Redis en fase de chat
- ✅ **Rate Limiting**: Básico implementado (suficiente para MVP)
- ❌ **Logging**: Winston no implementado (usando console.log)

### **💡 Decisión Arquitectónica: Redis**

**Estado**: Redis está completamente configurado en Docker e infraestructura pero **intencionalmente omitido** del stack actual.

**Razón**: El sistema JWT/sesiones actual es **altamente optimizado** sin Redis:

- ✅ Decodificación JWT local (sin DB calls)
- ✅ Refresh tokens en MongoDB (performante)
- ✅ Zero sobrecarga al backend
- ✅ Escalable hasta miles de usuarios

**Plan Futuro**: Redis se implementará específicamente para:

- 📱 **Chat real-time** (Pub/Sub, message queues)
- 🔔 **Advanced notifications** (real-time streaming)
- 👥 **User presence** (online/offline status)
- 🌐 **Multi-server scaling** (session clustering)

---

## 🔗 Related Documentation

- **[Complete Testing Strategy](../05-testing/README.md)**: Framework de testing completo
- **[Architecture Guide](../01-architecture.md)**: Arquitectura del sistema
- **[Frontend Agent](./04-frontend-agent.md)**: Integración frontend-backend
- **[Enhanced Workflow](./ENHANCED-WORKFLOW.md)**: Workflow de desarrollo
- **[API Documentation](../../04-product/README.md)**: Especificaciones de API
