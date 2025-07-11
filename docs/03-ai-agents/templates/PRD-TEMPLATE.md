# PRD Template - [XX-feature-name]

## 📋 **Document Information**

- **PRD ID**: [XX-feature-name]
- **Title**: [Feature Name]
- **Type**: [Core Feature | Integration | Module | Enhancement]
- **Priority**: [HIGH | MEDIUM | LOW]
- **Status**: 🆕 **DRAFT** | ✅ **APPROVED** | 🚧 **IN PROGRESS** | 📦 **DELIVERED**
- **Owner**: [Product Owner]
- **Created**: [YYYY-MM-DDTHH:mm:ssZ]
- **Last Updated**: [YYYY-MM-DDTHH:mm:ssZ]

## 🎯 **Product Overview**

### **Purpose**

Clear description of what this feature does and why it's needed.

### **Target Users**

- Primary users and their roles
- Secondary users and use cases

### **Business Value**

- Key business metrics this feature will impact
- Expected ROI or success criteria

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

## 📊 **Database Schema (Prisma + MongoDB)**

### **Data Models**

```prisma
// Primary model for this feature
model [FeatureName] {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  // Add your fields here following MongoDB + Prisma patterns
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations (use ObjectId for references)
  userId String @map("user_id") @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])

  // Indexes for performance
  @@index([userId])
  @@index([createdAt])

  // Map to MongoDB collection
  @@map("[collection_name]")
}

// Additional models if needed
model [RelatedModel] {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  // ... fields

  @@map("[related_collection]")
}
```

### **Data Relationships**

- **1:1 Relations**: [Description]
- **1:Many Relations**: [Description]
- **Many:Many Relations**: [Description]
- **Embedded Documents**: [When to use embedding vs referencing]

### **Performance Considerations**

- **Indexes**: [List required indexes and rationale]
- **Query Patterns**: [Expected read/write patterns]
- **Document Size**: [Considerations for MongoDB document limits]

## 🔌 **API Endpoints**

### **tRPC Procedures**

```typescript
// Feature-specific tRPC router
export const [featureName]Router = createTRPCRouter({
  // Create operation
  create: protectedProcedure
    .input([CreateFeatureSchema])
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),

  // Read operations
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Implementation
    }),

  // Update operation
  update: protectedProcedure
    .input([UpdateFeatureSchema])
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),

  // Delete operation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),
});
```

### **REST API Endpoints** (if needed)

```typescript
// REST endpoints for external integrations
@Controller('[feature-name]')
@ApiTags('[Feature Name]')
export class [FeatureName]Controller {
  @Post()
  @ApiOperation({ summary: 'Create [feature]' })
  async create(@Body() dto: Create[FeatureName]Dto) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get [feature] by ID' })
  async findOne(@Param('id') id: string) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update [feature]' })
  async update(@Param('id') id: string, @Body() dto: Update[FeatureName]Dto) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete [feature]' })
  async remove(@Param('id') id: string) {}
}
```

### **Validation Schemas**

```typescript
// Zod schemas for validation
export const Create[FeatureName]Schema = z.object({
  // Define validation rules
});

export const Update[FeatureName]Schema = z.object({
  // Define update validation rules
});

export type Create[FeatureName]Dto = z.infer<typeof Create[FeatureName]Schema>;
export type Update[FeatureName]Dto = z.infer<typeof Update[FeatureName]Schema>;
```

## 📋 **Business Requirements**

### **Functional Requirements**

1. **[Requirement 1]**
   - **Description**: What the system must do
   - **Acceptance Criteria**: How to validate it's working
   - **Priority**: [HIGH | MEDIUM | LOW]

2. **[Requirement 2]**
   - **Description**: Additional functionality
   - **Acceptance Criteria**: Validation criteria
   - **Priority**: [HIGH | MEDIUM | LOW]

### **Non-Functional Requirements**

- **Performance**: [Response time requirements]
- **Scalability**: [Concurrent user requirements]
- **Security**: [Authentication/authorization requirements]
- **Availability**: [Uptime requirements]
- **Usability**: [UX requirements]

### **Business Rules**

1. **[Business Rule 1]**: Description of constraint or rule
2. **[Business Rule 2]**: Additional business logic

## ✅ **Acceptance Criteria**

### **Feature Completion Criteria**

- [ ] **Database Schema**: Prisma models created and migrated
- [ ] **Backend Services**: SOLID-compliant services implemented
- [ ] **API Endpoints**: tRPC procedures and/or REST endpoints working
- [ ] **Frontend Components**: UI components created and tested
- [ ] **Integration**: Feature integrated with existing system
- [ ] **Testing**: Unit, integration, and E2E tests passing
- [ ] **Documentation**: Technical documentation updated

### **Quality Gates**

- [ ] **Test Coverage**: ≥95% for new services
- [ ] **Performance**: API responses <200ms
- [ ] **SOLID Compliance**: All principles followed
- [ ] **Security**: Authentication/authorization implemented
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Mobile**: Responsive design working

### **Business Validation**

- [ ] **User Flows**: All primary user journeys working
- [ ] **Error Handling**: Graceful error states implemented
- [ ] **Edge Cases**: Boundary conditions handled
- [ ] **Integration**: Works with existing features

## 🔗 **Dependencies**

### **Internal Dependencies**

- **[Service/Module Name]**: Description of dependency
- **[Another Service]**: Why this dependency exists

### **External Dependencies**

- **[Third-party Service]**: Integration requirements
- **[External API]**: Dependencies on external systems

### **Blocker Dependencies**

- **[Critical Dependency]**: Must be completed before this feature
- **[Infrastructure]**: Required infrastructure changes

## 📈 **Success Metrics**

### **Technical Metrics**

- **API Performance**: [Target response times]
- **Error Rate**: [Acceptable error percentage]
- **Test Coverage**: [Coverage requirements]
- **Code Quality**: [Quality metrics]

### **Business Metrics**

- **User Adoption**: [How to measure usage]
- **User Satisfaction**: [Satisfaction metrics]
- **Business Impact**: [Key business indicators]

### **Monitoring & Alerting**

- **Key Metrics to Track**: [List important metrics]
- **Alert Thresholds**: [When to alert]
- **Dashboards**: [Required monitoring dashboards]

## 📝 **Implementation Notes**

### **Technical Considerations**

- **[Consideration 1]**: Technical detail or constraint
- **[Consideration 2]**: Implementation detail

### **Migration Strategy**

- **Data Migration**: [If needed, how to migrate existing data]
- **Feature Flags**: [Strategy for gradual rollout]
- **Rollback Plan**: [How to rollback if needed]

### **Security Considerations**

- **Authentication**: [Auth requirements]
- **Authorization**: [Permission requirements]
- **Data Protection**: [How sensitive data is protected]

## 🚀 **Delivery Plan**

### **Phase 1: Foundation** ([Duration])

- [ ] Database schema design and implementation
- [ ] Core service architecture (SOLID-compliant)
- [ ] Basic API endpoints

### **Phase 2: Core Features** ([Duration])

- [ ] Business logic implementation
- [ ] Frontend components
- [ ] Integration with existing system

### **Phase 3: Polish & Testing** ([Duration])

- [ ] Comprehensive testing
- [ ] Error handling and edge cases
- [ ] Performance optimization
- [ ] Documentation completion

---

## 📋 **Approval Checklist**

- [ ] **Technical Review**: Architecture Agent approval
- [ ] **Business Review**: Product Owner approval
- [ ] **Security Review**: Security considerations validated
- [ ] **Performance Review**: Performance requirements realistic
- [ ] **Resource Review**: Development capacity confirmed

---

**Next Steps**: [What happens after this PRD is approved]  
**Assigned Agents**: [Which agents will implement this]  
**Estimated Timeline**: [Total development time]
