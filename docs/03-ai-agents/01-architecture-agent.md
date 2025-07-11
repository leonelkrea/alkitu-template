# 🏗️ Architecture Agent - SOLID Design Specialist

## 🎯 Role Definition

**Primary Responsibility**: Diseñar la arquitectura SOLID completa, crear interfaces y definir contratos para la migración del sistema actual.

**Duration**: Días 1-5 (continuo para revisiones)

---

## 📋 Responsibilities

### **Core Tasks**

1. **Interface Design**: Crear todas las interfaces necesarias siguiendo SOLID principles
2. **Contract Definition**: Definir contratos claros entre capas
3. **Module Structure**: Diseñar estructura modular con flags para freemium model
4. **Dependency Management**: Mapear dependencias y resolver inversiones
5. **Documentation**: Crear documentación arquitectónica completa

### **Deliverables**

- [ ] **Domain Interfaces** (`packages/shared/src/interfaces/`)
- [ ] **Service Contracts** (`packages/api/src/contracts/`)
- [ ] **Repository Interfaces** (`packages/api/src/repositories/interfaces/`)
- [ ] **Module Configuration** (`packages/shared/src/config/modules.config.ts`)
- [ ] **Architecture Documentation** (`docs/architecture/solid-design.md`)

---

## 🛠️ Tools & Resources

### **Development Tools**

- **TypeScript**: Para definición de interfaces y tipos
- **Zod**: Para validación de esquemas
- **tRPC**: Para contratos API
- **Prisma**: Para interfaces de base de datos

### **Documentation Tools**

- **Markdown**: Para documentación
- **Mermaid**: Para diagramas de arquitectura
- **PlantUML**: Para diagramas de clases (opcional)

### **Reference Materials**

- SOLID Principles documentation
- Clean Architecture patterns
- Current codebase analysis
- Business requirements for freemium model

---

## 📐 Implementation Guidelines

### **1. Interface Design Pattern**

```typescript
// Domain Interface Example
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

// Service Interface Example
export interface IUserService {
  createUser(data: CreateUserRequest): Promise<UserResponse>;
  authenticateUser(credentials: AuthCredentials): Promise<AuthResult>;
  updateProfile(id: string, data: UpdateProfileRequest): Promise<UserResponse>;
}
```

### **2. Module Flag System**

```typescript
// Module Configuration
export interface ModuleConfig {
  name: string;
  enabled: boolean;
  licenseLevel: "free" | "premium" | "enterprise";
  dependencies: string[];
  features: FeatureFlag[];
}

// Feature Flag System
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  licenseRequired: "free" | "premium" | "enterprise";
}
```

### **3. Layer Separation**

```
packages/
├── shared/
│   ├── interfaces/         # Domain interfaces
│   ├── types/             # Shared types
│   └── config/            # Module configurations
├── api/
│   ├── contracts/         # Service contracts
│   ├── repositories/      # Repository implementations
│   ├── services/          # Business logic services
│   └── controllers/       # API controllers
└── web/
    ├── hooks/             # Custom hooks
    ├── services/          # Frontend services
    └── types/             # Frontend types
```

---

## 📝 Daily Tasks

### **Day 1: Foundation**

```yaml
Morning:
  - Analyze current codebase structure
  - Identify core domain entities
  - Define primary interfaces

Afternoon:
  - Create repository interfaces
  - Design service contracts
  - Document initial architecture

Deliverables:
  - Core domain interfaces
  - Repository interface definitions
  - Initial architecture document
```

### **Day 2: Module System**

```yaml
Morning:
  - Design module flag system
  - Create configuration interfaces
  - Define freemium model structure

Afternoon:
  - Implement module manager design
  - Create feature flag system
  - Design dependency management

Deliverables:
  - Module configuration system
  - Feature flag interfaces
  - Dependency mapping
```

### **Day 3: Service Architecture**

```yaml
Morning:
  - Design service layer interfaces
  - Create business logic contracts
  - Define validation schemas

Afternoon:
  - Design controller interfaces
  - Create API contract definitions
  - Plan tRPC router structure

Deliverables:
  - Service interfaces complete
  - API contracts defined
  - Validation schemas ready
```

### **Day 4: Integration Design**

```yaml
Morning:
  - Design frontend integration
  - Create hook interfaces
  - Plan component architecture

Afternoon:
  - Design testing interfaces
  - Create mock specifications
  - Plan integration patterns

Deliverables:
  - Frontend architecture design
  - Testing interface specifications
  - Integration patterns defined
```

### **Day 5: New Services Architecture**

```yaml
Morning:
  - Design Products/Services system architecture
  - Create User Groups management interfaces
  - Design Tags system with polymorphic relations

Afternoon:
  - Architect Public Chat system
  - Integrate new services with existing modules
  - Create service dependency mapping

Deliverables:
  - Products service architecture
  - User Groups service interfaces
  - Tags system design
  - Chat system architecture
```

### **Day 6: Documentation & Review**

```yaml
Morning:
  - Complete architecture documentation
  - Create implementation guidelines
  - Prepare handoff materials

Afternoon:
  - Review with other agents
  - Refine based on feedback
  - Finalize specifications

Deliverables:
  - Complete architecture documentation
  - Implementation guidelines
  - Agent handoff materials
```

---

## 🆕 New Services Architecture

### **📦 Products/Services System**

#### **Core Interfaces**

```typescript
// Repository Interfaces
export interface IProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findMany(filters: ProductFilters): Promise<PaginatedResult<Product>>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  delete(id: string): Promise<void>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findByTags(tagIds: string[]): Promise<Product[]>;
}

export interface IProductCategoryRepository {
  create(data: CreateCategoryData): Promise<ProductCategory>;
  findById(id: string): Promise<ProductCategory | null>;
  findBySlug(slug: string): Promise<ProductCategory | null>;
  findHierarchy(): Promise<ProductCategory[]>;
  update(id: string, data: UpdateCategoryData): Promise<ProductCategory>;
  delete(id: string): Promise<void>;
}

// Service Interfaces
export interface IProductService {
  createProduct(data: CreateProductRequest): Promise<ProductResponse>;
  getProduct(identifier: string): Promise<ProductResponse>;
  updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<ProductResponse>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(
    filters: ProductSearchFilters
  ): Promise<PaginatedResponse<ProductResponse>>;

  // Category Management
  createCategory(data: CreateCategoryRequest): Promise<CategoryResponse>;
  updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<CategoryResponse>;

  // Pricing Management
  addPricingTier(
    productId: string,
    pricing: PricingTierRequest
  ): Promise<PricingResponse>;
  updatePricing(
    pricingId: string,
    data: UpdatePricingRequest
  ): Promise<PricingResponse>;

  // Inventory Management
  updateStock(productId: string, quantity: number): Promise<StockResponse>;
  checkAvailability(
    productId: string,
    quantity: number
  ): Promise<AvailabilityResponse>;
}

// Domain Events
export interface ProductDomainEvents {
  ProductCreated: { productId: string; product: Product };
  ProductUpdated: { productId: string; changes: Partial<Product> };
  ProductDeleted: { productId: string };
  StockUpdated: { productId: string; previousStock: number; newStock: number };
  PricingChanged: {
    productId: string;
    previousPrice: number;
    newPrice: number;
  };
}
```

#### **Module Configuration**

```typescript
export interface ProductsModuleConfig extends ModuleConfig {
  features: {
    categories: FeatureFlag;
    variants: FeatureFlag;
    inventory: FeatureFlag;
    analytics: FeatureFlag;
    seo: FeatureFlag;
  };
  pricing: {
    currencies: string[];
    intervals: PriceInterval[];
    tiers: number;
  };
  inventory: {
    tracking: boolean;
    lowStockThreshold: number;
    outOfStockBehavior: "hide" | "show" | "preorder";
  };
}
```

---

### **👥 User Groups System**

#### **Core Interfaces**

```typescript
// Repository Interfaces
export interface IUserGroupRepository {
  create(data: CreateGroupData): Promise<UserGroup>;
  findById(id: string): Promise<UserGroup | null>;
  findBySlug(slug: string): Promise<UserGroup | null>;
  findMany(filters: GroupFilters): Promise<PaginatedResult<UserGroup>>;
  update(id: string, data: UpdateGroupData): Promise<UserGroup>;
  delete(id: string): Promise<void>;
  findUserGroups(userId: string): Promise<UserGroup[]>;
}

export interface IGroupMembershipRepository {
  create(data: CreateMembershipData): Promise<GroupMembership>;
  findById(id: string): Promise<GroupMembership | null>;
  findByUserAndGroup(
    userId: string,
    groupId: string
  ): Promise<GroupMembership | null>;
  findGroupMembers(groupId: string): Promise<GroupMembership[]>;
  update(id: string, data: UpdateMembershipData): Promise<GroupMembership>;
  delete(id: string): Promise<void>;
}

// Service Interfaces
export interface IUserGroupService {
  createGroup(data: CreateGroupRequest): Promise<GroupResponse>;
  getGroup(identifier: string): Promise<GroupResponse>;
  updateGroup(id: string, data: UpdateGroupRequest): Promise<GroupResponse>;
  deleteGroup(id: string): Promise<void>;
  searchGroups(
    query: string,
    filters?: GroupSearchFilters
  ): Promise<PaginatedResponse<GroupResponse>>;

  // Membership Management
  addMember(
    groupId: string,
    userId: string,
    role?: GroupRole
  ): Promise<MembershipResponse>;
  removeMember(groupId: string, userId: string): Promise<void>;
  updateMemberRole(
    membershipId: string,
    role: GroupRole
  ): Promise<MembershipResponse>;
  approveMembership(membershipId: string): Promise<MembershipResponse>;

  // Permission Management
  grantPermission(
    groupId: string,
    permission: string,
    roles: GroupRole[]
  ): Promise<PermissionResponse>;
  revokePermission(groupId: string, permission: string): Promise<void>;
  checkPermission(
    userId: string,
    groupId: string,
    permission: string
  ): Promise<boolean>;
}

// Domain Events
export interface GroupDomainEvents {
  GroupCreated: { groupId: string; group: UserGroup };
  GroupUpdated: { groupId: string; changes: Partial<UserGroup> };
  GroupDeleted: { groupId: string };
  MemberAdded: { groupId: string; userId: string; role: GroupRole };
  MemberRemoved: { groupId: string; userId: string };
  MemberRoleChanged: {
    groupId: string;
    userId: string;
    oldRole: GroupRole;
    newRole: GroupRole;
  };
  PermissionGranted: {
    groupId: string;
    permission: string;
    roles: GroupRole[];
  };
  PermissionRevoked: { groupId: string; permission: string };
}
```

#### **Module Configuration**

```typescript
export interface GroupsModuleConfig extends ModuleConfig {
  features: {
    hierarchicalGroups: FeatureFlag;
    groupPermissions: FeatureFlag;
    memberApproval: FeatureFlag;
    groupAnalytics: FeatureFlag;
    bulkOperations: FeatureFlag;
  };
  limits: {
    maxMembersPerGroup: number;
    maxGroupsPerUser: number;
    maxNestedLevels: number;
  };
  permissions: {
    defaultRoles: GroupRole[];
    systemPermissions: string[];
    customPermissions: boolean;
  };
}
```

---

### **🏷️ Tags System**

#### **Core Interfaces**

```typescript
// Repository Interfaces
export interface ITagRepository {
  create(data: CreateTagData): Promise<Tag>;
  findById(id: string): Promise<Tag | null>;
  findBySlug(slug: string): Promise<Tag | null>;
  findMany(filters: TagFilters): Promise<PaginatedResult<Tag>>;
  update(id: string, data: UpdateTagData): Promise<Tag>;
  delete(id: string): Promise<void>;
  search(query: string, category?: string): Promise<Tag[]>;
  findPopular(limit: number): Promise<Tag[]>;
}

export interface ITagUsageRepository {
  tagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  untagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  getEntityTags(entityType: string, entityId: string): Promise<Tag[]>;
  getTaggedEntities(
    tagId: string,
    entityType?: string
  ): Promise<TaggedEntity[]>;
  incrementUsage(tagId: string): Promise<void>;
  getUsageStats(tagId: string): Promise<TagUsageStats>;
}

// Service Interfaces
export interface ITagService {
  createTag(data: CreateTagRequest): Promise<TagResponse>;
  getTag(identifier: string): Promise<TagResponse>;
  updateTag(id: string, data: UpdateTagRequest): Promise<TagResponse>;
  deleteTag(id: string): Promise<void>;
  searchTags(query: string, category?: string): Promise<TagResponse[]>;
  suggestTags(text: string, limit?: number): Promise<TagResponse[]>;

  // Category Management
  createCategory(data: CreateTagCategoryRequest): Promise<TagCategoryResponse>;
  updateCategory(
    id: string,
    data: UpdateTagCategoryRequest
  ): Promise<TagCategoryResponse>;

  // Tagging Operations
  tagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  untagEntity(
    entityType: string,
    entityId: string,
    tagIds: string[]
  ): Promise<void>;
  getEntityTags(entityType: string, entityId: string): Promise<TagResponse[]>;

  // Analytics
  getTagUsageStats(tagId: string): Promise<TagUsageStatsResponse>;
  getPopularTags(limit?: number): Promise<TagResponse[]>;
}

// Domain Events
export interface TagDomainEvents {
  TagCreated: { tagId: string; tag: Tag };
  TagUpdated: { tagId: string; changes: Partial<Tag> };
  TagDeleted: { tagId: string };
  EntityTagged: { entityType: string; entityId: string; tagIds: string[] };
  EntityUntagged: { entityType: string; entityId: string; tagIds: string[] };
  TagUsageIncremented: { tagId: string; newCount: number };
}
```

#### **Module Configuration**

```typescript
export interface TagsModuleConfig extends ModuleConfig {
  features: {
    categories: FeatureFlag;
    suggestions: FeatureFlag;
    analytics: FeatureFlag;
    autoTagging: FeatureFlag;
    hierarchical: FeatureFlag;
  };
  settings: {
    maxTagsPerEntity: number;
    suggestionsEnabled: boolean;
    autoTaggingThreshold: number;
    popularTagsCount: number;
  };
  entities: {
    supportedTypes: string[];
    polymorphicRelations: boolean;
  };
}
```

---

### **💬 Chat System**

#### **Core Interfaces**

```typescript
// Repository Interfaces
export interface IConversationRepository {
  create(data: CreateConversationData): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findMany(
    filters: ConversationFilters
  ): Promise<PaginatedResult<Conversation>>;
  update(id: string, data: UpdateConversationData): Promise<Conversation>;
  delete(id: string): Promise<void>;
  findByContactInfo(contactId: string): Promise<Conversation[]>;
  findAssigned(userId: string): Promise<Conversation[]>;
}

export interface IChatMessageRepository {
  create(data: CreateMessageData): Promise<ChatMessage>;
  findById(id: string): Promise<ChatMessage | null>;
  findByConversation(conversationId: string): Promise<ChatMessage[]>;
  update(id: string, data: UpdateMessageData): Promise<ChatMessage>;
  delete(id: string): Promise<void>;
  markAsRead(conversationId: string, userId?: string): Promise<void>;
}

// Service Interfaces
export interface IChatService {
  startConversation(
    contactInfo: ContactInfoRequest
  ): Promise<ConversationResponse>;
  getConversation(id: string): Promise<ConversationResponse>;
  assignConversation(
    conversationId: string,
    userId: string
  ): Promise<ConversationResponse>;
  updateConversationStatus(
    conversationId: string,
    status: ConversationStatus
  ): Promise<ConversationResponse>;

  // Message Management
  sendMessage(
    conversationId: string,
    content: string,
    isFromVisitor: boolean,
    senderId?: string
  ): Promise<MessageResponse>;
  getMessages(conversationId: string): Promise<MessageResponse[]>;
  markMessagesAsRead(conversationId: string, userId?: string): Promise<void>;

  // Admin Operations
  getConversations(
    filters?: ConversationFilters
  ): Promise<PaginatedResponse<ConversationResponse>>;
  searchConversations(query: string): Promise<ConversationResponse[]>;
  addInternalNote(
    conversationId: string,
    note: string,
    userId: string
  ): Promise<void>;

  // Configuration
  updateChatConfig(config: ChatConfigRequest): Promise<ChatConfigResponse>;
  getChatConfig(): Promise<ChatConfigResponse>;
}

// Domain Events
export interface ChatDomainEvents {
  ConversationStarted: { conversationId: string; contactInfo: ContactInfo };
  ConversationAssigned: { conversationId: string; userId: string };
  ConversationStatusChanged: {
    conversationId: string;
    oldStatus: ConversationStatus;
    newStatus: ConversationStatus;
  };
  MessageSent: {
    conversationId: string;
    messageId: string;
    isFromVisitor: boolean;
  };
  MessageRead: { conversationId: string; messageId: string; readBy?: string };
  InternalNoteAdded: { conversationId: string; note: string; addedBy: string };
}
```

#### **Module Configuration**

```typescript
export interface ChatModuleConfig extends ModuleConfig {
  features: {
    fileUploads: FeatureFlag;
    autoAssignment: FeatureFlag;
    translations: FeatureFlag;
    analytics: FeatureFlag;
    botIntegration: FeatureFlag;
  };
  widget: {
    position: "bottom-right" | "bottom-left";
    colors: {
      primary: string;
      text: string;
      background: string;
    };
    autoOpen: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxMessagesPerConversation: number;
    maxConcurrentConversations: number;
    messageCharacterLimit: number;
    rateLimitPerMinute: number;
  };
}
```

---

## 📊 Quality Standards

### **Interface Quality**

- [ ] **Single Responsibility**: Each interface has one clear purpose
- [ ] **Open/Closed**: Interfaces are extensible without modification
- [ ] **Liskov Substitution**: Implementations are interchangeable
- [ ] **Interface Segregation**: No forced dependencies on unused methods
- [ ] **Dependency Inversion**: Depends on abstractions, not concretions

### **Documentation Quality**

- [ ] **Completeness**: All interfaces documented with examples
- [ ] **Clarity**: Clear naming and purpose statements
- [ ] **Consistency**: Uniform patterns across all interfaces
- [ ] **Maintainability**: Easy to understand and modify

### **Module System Quality**

- [ ] **Flexibility**: Easy to enable/disable features
- [ ] **Scalability**: Supports future module additions
- [ ] **Testability**: Easy to mock and test
- [ ] **Performance**: Minimal overhead from flag checking

---

## 🔄 Communication Protocol

### **Daily Updates**

- **Morning**: Post previous day's accomplishments and today's plan
- **Afternoon**: Share progress and any blockers
- **Evening**: Update documentation and prepare handoff materials

### **Integration Points**

- **Testing Agent**: Share interface specifications for test writing
- **Backend Agent**: Provide implementation guidelines and contracts
- **Frontend Agent**: Share frontend architecture and integration patterns
- **DevOps Agent**: Provide deployment and configuration requirements

### **Escalation Process**

1. **Technical Decisions**: Document options and recommend best approach
2. **Business Logic**: Escalate to project owner for clarification
3. **Timeline Issues**: Coordinate with other agents for priority adjustment

---

## 🎯 Success Metrics

### **Daily Metrics**

- [ ] Number of interfaces created
- [ ] Documentation pages completed
- [ ] Architecture diagrams finalized
- [ ] Integration points defined

### **Weekly Milestones**

- **Week 1**: Complete interface design and module system
- **Ongoing**: Support other agents with architectural guidance
- **Final**: Architecture documentation and handoff complete

---

## 📚 Resources & References

### **SOLID Principles**

- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
- [Open/Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
- [Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

### **Architecture Patterns**

- Clean Architecture by Robert C. Martin
- Domain-Driven Design principles
- Hexagonal Architecture patterns
- Microservices architecture guidelines

### **Implementation References**

- Current codebase analysis
- Business requirements document
- Technical specifications
- Performance requirements

---

_Architecture Agent está diseñado para crear una base sólida y escalable que permita la implementación exitosa de la migración SOLID en el timeline establecido._
