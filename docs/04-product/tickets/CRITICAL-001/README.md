# Ticket CRITICAL-001: PRD Stack Alignment

## 📋 Ticket Information

- **ID**: CRITICAL-001
- **Title**: PRD Stack Alignment with Prisma + MongoDB
- **Type**: Critical Issue
- **Priority**: HIGH
- **Status**: 🆕 TODO
- **Assigned Agent**: Architecture Agent
- **Created**: 2024-12-19T12:00:00Z
- **Estimated Duration**: 2-3 hours

## 🎯 Objective

Update all Product Requirements Documents (PRDs) to align with our actual technology stack:

- **Database**: MongoDB with Prisma ORM
- **Schema Format**: Prisma schema syntax
- **Collections**: MongoDB collections (not SQL tables)

## 🚨 Problem Description

### Current Issue:

The PRDs (1-7 and 9-12) were created with **generic SQL database schemas** that don't match our actual technology stack. This creates a critical misalignment that will cause implementation problems.

### Specific Problems:

1. **SQL vs NoSQL**: PRDs use SQL `CREATE TABLE` syntax
2. **Prisma Schema**: Not using Prisma model definitions
3. **MongoDB Collections**: Not leveraging MongoDB document structure
4. **Data Relationships**: Not optimized for MongoDB patterns

### Example of Misalignment:

```sql
-- ❌ Current PRD (SQL format)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Should be:

```prisma
// ✅ Required format (Prisma + MongoDB)
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}
```

## 📁 Files to Update

### PRD Files (All require schema updates):

- `docs/prd/01-template-core.md`
- `docs/prd/03-user-management.md`
- `docs/prd/04-notification-system.md`
- `docs/prd/05-analytics-module.md`
- `docs/prd/06-integration-platform.md`
- `docs/prd/07-mobile-app.md`
- `docs/prd/09-billing-payments.md`
- `docs/prd/10-email-communication.md`
- `docs/prd/11-file-storage.md`
- `docs/prd/12-admin-dashboard.md`

### Reference Files (Read for alignment):

- `packages/api/prisma/schema.prisma` - Current data models
- `docs/ARCHITECTURE.md` - Technology stack details
- `packages/api/src/` - Current implementation patterns

## ✅ Acceptance Criteria

### Database Schema Updates:

- [ ] Replace all SQL `CREATE TABLE` with Prisma model syntax
- [ ] Use MongoDB `@db.ObjectId` for IDs
- [ ] Use `@map()` for field/collection name mapping
- [ ] Leverage MongoDB document embedding where appropriate
- [ ] Maintain referential integrity with `@relation`

### Consistency Requirements:

- [ ] All PRDs use identical Prisma syntax
- [ ] Model names match existing schema patterns
- [ ] Field types align with MongoDB/Prisma capabilities
- [ ] Indexes defined using `@@index()` syntax

### Validation:

- [ ] Schemas can be copy-pasted into `schema.prisma`
- [ ] No SQL-specific syntax remains
- [ ] MongoDB best practices followed
- [ ] Backwards compatible with existing data

## 🔗 Dependencies

### Blocks:

- `CORE-001` - Template core implementation
- `AUTH-001` - Authentication module
- `USER-001` - User management module
- All subsequent development work

### Requires:

- Understanding of current Prisma schema
- Knowledge of MongoDB document patterns
- Familiarity with Prisma syntax

## 🎯 Expected Deliverables

1. **Updated PRD Schemas**: All 10 PRDs with Prisma-aligned database sections
2. **Schema Validation**: Verified compatibility with existing codebase
3. **Documentation**: Clear migration notes for any breaking changes
4. **Next Steps**: Recommendations for subsequent agents

## 🚀 Success Metrics

- ✅ 100% of PRDs updated with Prisma syntax
- ✅ Zero SQL syntax remaining in technical specifications
- ✅ Schemas validate against Prisma compiler
- ✅ Implementation agents can proceed without schema confusion

## 📝 Notes

### Technical Considerations:

- MongoDB is document-based, not relational
- Prisma provides type-safe MongoDB client
- Some relationships may need restructuring for NoSQL
- Embedding vs referencing decisions impact performance

### Business Impact:

- Unblocks all development agents
- Ensures consistent implementation
- Prevents technical debt from misaligned schemas
- Maintains development velocity

---

**Next Agent**: Backend Agent (for CORE-001 implementation)  
**Estimated Next Task Duration**: 4-6 hours
