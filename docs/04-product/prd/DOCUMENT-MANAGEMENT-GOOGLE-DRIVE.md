# PRD Template - DOCUMENT-MANAGEMENT-GOOGLE-DRIVE

## 📋 **Document Information**

- **PRD ID**: DOCUMENT-MANAGEMENT-GOOGLE-DRIVE
- **Title**: Document Management System with Google Drive Integration
- **Type**: Enhancement Feature (Part of Configurable Storage System)
- **Priority**: MEDIUM
- **Status**: ⚠️ **SUPERSEDED BY CONFIGURABLE-STORAGE-SYSTEM**
- **Owner**: Product Team
- **Created**: 2024-01-17T12:30:00Z
- **Last Updated**: 2024-01-17T12:30:00Z

## 🎯 **Product Overview**

### **Purpose**

Create a comprehensive document management system that integrates seamlessly with Google Drive, allowing users to organize, categorize, tag, and search documents directly within the application. The system will maintain relationships between documents and users, enabling efficient document management across different categories like contracts, invoices, legal documents, meeting notes, and more.

### **Target Users**

- **Primary**: Business administrators who manage client documents and files
- **Secondary**: Team members who need access to categorized client documents
- **Tertiary**: Clients who may need to upload or access their own documents

### **Business Value**

- **Document Organization**: 90% improvement in document findability and organization
- **Time Savings**: 60% reduction in time spent searching for documents
- **Client Management**: Enhanced client relationship management through organized documentation
- **Compliance**: Better document retention and audit trail capabilities
- **Collaboration**: Improved team collaboration through structured document sharing

## 🏗️ **Technical Architecture**

### **Stack Alignment**

- ✅ **Database**: MongoDB with Prisma ORM
- ✅ **Backend**: NestJS with tRPC + REST APIs
- ✅ **Frontend**: Next.js 15+ with React Server Components
- ✅ **Authentication**: JWT with role-based permissions
- ✅ **File Storage**: Google Drive API integration
- ✅ **Search**: Elasticsearch or MongoDB text search
- ✅ **Real-time**: WebSocket for document updates
- ✅ **Email**: Resend integration for notifications

### **Architecture Patterns**

- ✅ **SOLID Principles**: All services follow SRP, OCP, LSP, ISP, DIP
- ✅ **Repository Pattern**: Data access abstraction
- ✅ **Event-Driven**: Domain events for loose coupling
- ✅ **Validation**: Zod schemas throughout
- ✅ **External API Integration**: Google Drive API service layer

### **Google Drive Integration Architecture**

```typescript
google-drive-integration/
├── 🔌 google-drive-service/        # Google Drive API integration
│   ├── interfaces/
│   │   ├── IGoogleDriveService.ts
│   │   ├── IGoogleDriveAuth.ts
│   │   └── IGoogleDriveOperations.ts
│   ├── services/
│   │   ├── GoogleDriveService.ts
│   │   ├── GoogleDriveAuthService.ts
│   │   └── GoogleDriveOperationsService.ts
│   └── dto/
│       ├── GoogleDriveFileDto.ts
│       └── GoogleDriveFolderDto.ts
├── 📁 document-management/          # Core document management
│   ├── interfaces/
│   │   ├── IDocumentRepository.ts
│   │   ├── IDocumentService.ts
│   │   ├── IDocumentCategoryService.ts
│   │   └── IDocumentSearchService.ts
│   ├── entities/
│   │   ├── Document.entity.ts
│   │   ├── DocumentCategory.entity.ts
│   │   └── DocumentTag.entity.ts
│   ├── services/
│   │   ├── DocumentService.ts
│   │   ├── DocumentCategoryService.ts
│   │   ├── DocumentTagService.ts
│   │   └── DocumentSearchService.ts
│   └── repositories/
│       ├── DocumentRepository.ts
│       ├── DocumentCategoryRepository.ts
│       └── DocumentTagRepository.ts
├── 🔍 document-search/              # Advanced search capabilities
│   ├── interfaces/
│   │   ├── ISearchEngine.ts
│   │   ├── ISearchIndexer.ts
│   │   └── ISearchQueryBuilder.ts
│   ├── services/
│   │   ├── SearchEngineService.ts
│   │   ├── SearchIndexerService.ts
│   │   └── SearchQueryBuilderService.ts
│   └── dto/
│       ├── SearchQueryDto.ts
│       └── SearchResultDto.ts
├── 👥 user-document-relations/      # User-document relationships
│   ├── interfaces/
│   │   ├── IUserDocumentService.ts
│   │   ├── IDocumentPermissionService.ts
│   │   └── IDocumentSharingService.ts
│   ├── services/
│   │   ├── UserDocumentService.ts
│   │   ├── DocumentPermissionService.ts
│   │   └── DocumentSharingService.ts
│   └── entities/
│       ├── UserDocument.entity.ts
│       └── DocumentPermission.entity.ts
└── 📊 document-analytics/           # Document usage analytics
    ├── interfaces/
    │   ├── IDocumentAnalyticsService.ts
    │   └── IDocumentUsageTracker.ts
    ├── services/
    │   ├── DocumentAnalyticsService.ts
    │   └── DocumentUsageTrackerService.ts
    └── dto/
        └── DocumentAnalyticsDto.ts
```

## 📊 **Database Schema (Prisma + MongoDB)**

### **Data Models**

```prisma
// Core document model
model Document {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Document metadata
  name             String
  description      String?
  originalFileName String   @map("original_file_name")
  mimeType         String   @map("mime_type")
  fileSize         Int      @map("file_size") // in bytes
  
  // Google Drive integration
  googleDriveFileId String?  @unique @map("google_drive_file_id")
  googleDriveFolderId String? @map("google_drive_folder_id")
  googleDriveWebViewLink String? @map("google_drive_web_view_link")
  googleDriveDownloadLink String? @map("google_drive_download_link")
  
  // Content and search
  extractedText    String?  @map("extracted_text") // For search indexing
  thumbnailUrl     String?  @map("thumbnail_url")
  
  // Categorization
  categoryId       String?  @map("category_id") @db.ObjectId
  category         DocumentCategory? @relation(fields: [categoryId], references: [id])
  
  // Tagging system
  tags             DocumentTag[] @relation("DocumentTags")
  
  // User relationships
  ownerId          String   @map("owner_id") @db.ObjectId
  owner            User     @relation("OwnedDocuments", fields: [ownerId], references: [id])
  
  // User associations
  userDocuments    UserDocument[]
  
  // Document permissions
  permissions      DocumentPermission[]
  
  // Version control
  version          Int      @default(1)
  parentDocumentId String?  @map("parent_document_id") @db.ObjectId
  parentDocument   Document? @relation("DocumentVersions", fields: [parentDocumentId], references: [id])
  childDocuments   Document[] @relation("DocumentVersions")
  
  // Status and lifecycle
  status           DocumentStatus @default(ACTIVE)
  isArchived       Boolean  @default(false) @map("is_archived")
  archivedAt       DateTime? @map("archived_at")
  
  // Analytics
  viewCount        Int      @default(0) @map("view_count")
  downloadCount    Int      @default(0) @map("download_count")
  lastAccessedAt   DateTime? @map("last_accessed_at")
  
  // Timestamps
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
  
  // Indexes for performance
  @@index([googleDriveFileId])
  @@index([ownerId])
  @@index([categoryId])
  @@index([status])
  @@index([createdAt])
  @@index([name]) // For text search
  
  @@map("documents")
}

// Document categories for organization
model DocumentCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String   @unique
  description String?
  color       String?  // For UI display
  icon        String?  // Icon identifier
  
  // Hierarchical categories
  parentId    String?  @map("parent_id") @db.ObjectId
  parent      DocumentCategory? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    DocumentCategory[] @relation("CategoryHierarchy")
  
  // Category configuration
  config      Json?    // Additional configuration
  
  // Default for user types
  defaultForUserRoles String[] @map("default_for_user_roles") // User roles that default to this category
  
  // Relations
  documents   Document[]
  
  // Metadata
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Indexes
  @@index([slug])
  @@index([parentId])
  @@index([isActive])
  
  @@map("document_categories")
}

// Document tags for flexible categorization
model DocumentTag {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  slug        String   @unique
  description String?
  color       String?  // For UI display
  
  // Tag relationships
  documents   Document[] @relation("DocumentTags")
  
  // Tag usage statistics
  usageCount  Int      @default(0) @map("usage_count")
  
  // Tag configuration
  isSystem    Boolean  @default(false) @map("is_system") // System-generated tags
  isActive    Boolean  @default(true) @map("is_active")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Indexes
  @@index([name])
  @@index([slug])
  @@index([isActive])
  
  @@map("document_tags")
}

// User-document relationships
model UserDocument {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Relations
  userId     String   @map("user_id") @db.ObjectId
  user       User     @relation(fields: [userId], references: [id])
  
  documentId String   @map("document_id") @db.ObjectId
  document   Document @relation(fields: [documentId], references: [id])
  
  // Relationship type
  relationshipType DocumentRelationshipType @map("relationship_type")
  
  // Metadata
  addedAt    DateTime @default(now()) @map("added_at")
  addedBy    String?  @map("added_by") @db.ObjectId // Who created this relationship
  
  // Access tracking
  lastAccessedAt DateTime? @map("last_accessed_at")
  accessCount    Int       @default(0) @map("access_count")
  
  // Notes about the relationship
  notes      String?
  
  // Timestamps
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  // Constraints
  @@unique([userId, documentId])
  
  // Indexes
  @@index([userId])
  @@index([documentId])
  @@index([relationshipType])
  
  @@map("user_documents")
}

// Document permissions for access control
model DocumentPermission {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Relations
  documentId String   @map("document_id") @db.ObjectId
  document   Document @relation(fields: [documentId], references: [id])
  
  userId     String   @map("user_id") @db.ObjectId
  user       User     @relation("DocumentPermissions", fields: [userId], references: [id])
  
  // Permission settings
  permission DocumentPermissionType
  
  // Permission metadata
  grantedBy  String   @map("granted_by") @db.ObjectId // Who granted this permission
  grantedAt  DateTime @default(now()) @map("granted_at")
  expiresAt  DateTime? @map("expires_at") // Optional expiration
  
  // Timestamps
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  // Constraints
  @@unique([documentId, userId])
  
  // Indexes
  @@index([documentId])
  @@index([userId])
  @@index([permission])
  
  @@map("document_permissions")
}

// Google Drive configuration per user/organization
model GoogleDriveConfig {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // User or organization this config belongs to
  userId            String?  @map("user_id") @db.ObjectId
  user              User?    @relation(fields: [userId], references: [id])
  
  // Google Drive authentication
  accessToken       String   @map("access_token") // Encrypted
  refreshToken      String   @map("refresh_token") // Encrypted
  tokenExpiresAt    DateTime @map("token_expires_at")
  
  // Google Drive folder configuration
  rootFolderId      String?  @map("root_folder_id") // Main folder for documents
  categoryFolders   Json?    @map("category_folders") // Folder mapping for categories
  
  // Sync settings
  autoSync          Boolean  @default(true) @map("auto_sync")
  syncFrequency     Int      @default(3600) @map("sync_frequency") // in seconds
  lastSyncAt        DateTime? @map("last_sync_at")
  
  // Configuration
  isActive          Boolean  @default(true) @map("is_active")
  
  // Timestamps
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // Indexes
  @@index([userId])
  @@index([isActive])
  
  @@map("google_drive_configs")
}

// Update User model to include document relationships
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  
  // Document relationships
  ownedDocuments     Document[] @relation("OwnedDocuments")
  userDocuments      UserDocument[]
  documentPermissions DocumentPermission[] @relation("DocumentPermissions")
  
  // Google Drive configuration
  googleDriveConfigs GoogleDriveConfig[]
  
  // Existing relationships...
  ownedEntities  DynamicEntity[]
  responses      FormResponse[]
  serviceRequests ServiceRequest[] @relation("CustomerRequests")
  assignedRequests ServiceRequest[] @relation("ProviderRequests")
  ownedLeads     Lead[] @relation("LeadOwner")
  assignedLeads  Lead[] @relation("LeadAssignee")
  
  // Document usage tracking
  lastDocumentAccess DateTime? @map("last_document_access")
  totalDocumentViews Int       @default(0) @map("total_document_views")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}

// Enums for document management
enum DocumentStatus {
  ACTIVE
  ARCHIVED
  DELETED
  PROCESSING
  ERROR
}

enum DocumentRelationshipType {
  OWNER
  COLLABORATOR
  VIEWER
  CLIENT_DOCUMENT
  CONTRACT_SIGNATORY
  INVOICE_RECIPIENT
  MEETING_PARTICIPANT
}

enum DocumentPermissionType {
  VIEW
  DOWNLOAD
  EDIT
  DELETE
  SHARE
  MANAGE
}
```

### **Data Relationships**

- **1:Many Relations**: 
  - User → Document (un usuario puede tener múltiples documentos)
  - DocumentCategory → Document (una categoría puede tener múltiples documentos)
  - Document → DocumentPermission (un documento puede tener múltiples permisos)
  
- **Many:Many Relations**: 
  - User ↔ Document (through UserDocument - diferentes tipos de relación)
  - Document ↔ DocumentTag (un documento puede tener múltiples tags)
  
- **Hierarchical Relations**:
  - DocumentCategory → DocumentCategory (categorías anidadas)
  - Document → Document (versiones de documentos)

### **Performance Considerations**

- **Indexes**: Compuestos por userId+documentId, categoría, tags, fechas
- **Query Patterns**: Optimizado para búsquedas por usuario, categoría, tags y texto
- **Full-Text Search**: MongoDB text search o Elasticsearch para búsqueda avanzada
- **Google Drive Sync**: Rate limiting y cacheo para operaciones de Drive API

## 🔌 **API Endpoints**

### **tRPC Procedures**

```typescript
// Document Management Router
export const documentRouter = createTRPCRouter({
  // Create document
  create: protectedProcedure
    .input(CreateDocumentSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentService.createDocument({
        ...input,
        ownerId: ctx.session.user.id,
      });
    }),

  // Upload to Google Drive and create document record
  uploadToGoogleDrive: protectedProcedure
    .input(UploadToGoogleDriveSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.googleDriveService.uploadAndCreateDocument({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Get documents with filters
  getDocuments: protectedProcedure
    .input(GetDocumentsSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.documentService.getDocuments({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Get document by ID with access control
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentService.getDocumentById(
        input.id,
        ctx.session.user.id
      );
    }),

  // Update document metadata
  update: protectedProcedure
    .input(UpdateDocumentSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentService.updateDocument(
        input.id,
        input,
        ctx.session.user.id
      );
    }),

  // Delete document (move to trash)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.documentService.deleteDocument(input.id, ctx.session.user.id);
      return { success: true };
    }),

  // Move document to different category
  moveToCategory: protectedProcedure
    .input(z.object({ 
      documentId: z.string(),
      categoryId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentService.moveToCategory(
        input.documentId,
        input.categoryId,
        ctx.session.user.id
      );
    }),

  // Add tags to document
  addTags: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      tagIds: z.array(z.string())
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentTagService.addTagsToDocument(
        input.documentId,
        input.tagIds,
        ctx.session.user.id
      );
    }),

  // Remove tags from document
  removeTags: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      tagIds: z.array(z.string())
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentTagService.removeTagsFromDocument(
        input.documentId,
        input.tagIds,
        ctx.session.user.id
      );
    }),
});

// Document Search Router
export const documentSearchRouter = createTRPCRouter({
  // Advanced document search
  search: protectedProcedure
    .input(DocumentSearchSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.documentSearchService.searchDocuments({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Search suggestions
  getSuggestions: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentSearchService.getSearchSuggestions(
        input.query,
        ctx.session.user.id
      );
    }),

  // Get recent documents
  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(10) }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentService.getRecentDocuments(
        ctx.session.user.id,
        input.limit
      );
    }),

  // Get documents by category
  getByCategory: protectedProcedure
    .input(z.object({ 
      categoryId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentService.getDocumentsByCategory({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Get documents by tag
  getByTag: protectedProcedure
    .input(z.object({ 
      tagId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentService.getDocumentsByTag({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});

// User Document Relations Router
export const userDocumentRouter = createTRPCRouter({
  // Associate document with user
  associateWithUser: protectedProcedure
    .input(AssociateDocumentSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.userDocumentService.associateDocumentWithUser({
        ...input,
        addedBy: ctx.session.user.id,
      });
    }),

  // Remove association
  removeAssociation: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.userDocumentService.removeAssociation(
        input.documentId,
        input.userId,
        ctx.session.user.id
      );
      return { success: true };
    }),

  // Get user's documents
  getUserDocuments: protectedProcedure
    .input(GetUserDocumentsSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.userDocumentService.getUserDocuments({
        ...input,
        requestingUserId: ctx.session.user.id,
      });
    }),

  // Get document users
  getDocumentUsers: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.userDocumentService.getDocumentUsers(
        input.documentId,
        ctx.session.user.id
      );
    }),

  // Track document access
  trackAccess: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.documentAnalyticsService.trackDocumentAccess(
        input.documentId,
        ctx.session.user.id
      );
      return { success: true };
    }),
});

// Document Categories Router
export const documentCategoryRouter = createTRPCRouter({
  // Get all categories
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.documentCategoryService.getAllCategories();
    }),

  // Create category
  create: protectedProcedure
    .input(CreateCategorySchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentCategoryService.createCategory(input);
    }),

  // Update category
  update: protectedProcedure
    .input(UpdateCategorySchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentCategoryService.updateCategory(input.id, input);
    }),

  // Delete category
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.documentCategoryService.deleteCategory(input.id);
      return { success: true };
    }),

  // Get category hierarchy
  getHierarchy: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.documentCategoryService.getCategoryHierarchy();
    }),
});

// Document Tags Router
export const documentTagRouter = createTRPCRouter({
  // Get all tags
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.documentTagService.getAllTags();
    }),

  // Create tag
  create: protectedProcedure
    .input(CreateTagSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentTagService.createTag(input);
    }),

  // Update tag
  update: protectedProcedure
    .input(UpdateTagSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.documentTagService.updateTag(input.id, input);
    }),

  // Delete tag
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.documentTagService.deleteTag(input.id);
      return { success: true };
    }),

  // Search tags
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentTagService.searchTags(input.query);
    }),

  // Get popular tags
  getPopular: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(20) }))
    .query(async ({ input, ctx }) => {
      return await ctx.documentTagService.getPopularTags(input.limit);
    }),
});

// Google Drive Integration Router
export const googleDriveRouter = createTRPCRouter({
  // Configure Google Drive integration
  configure: protectedProcedure
    .input(ConfigureGoogleDriveSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.googleDriveService.configureIntegration({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Sync with Google Drive
  sync: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.googleDriveService.syncDocuments(ctx.session.user.id);
    }),

  // Get Google Drive status
  getStatus: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.googleDriveService.getIntegrationStatus(ctx.session.user.id);
    }),

  // Create folder in Google Drive
  createFolder: protectedProcedure
    .input(z.object({ 
      name: z.string(),
      parentId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.googleDriveService.createFolder({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Get folder contents
  getFolderContents: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.googleDriveService.getFolderContents(
        input.folderId,
        ctx.session.user.id
      );
    }),
});

// Main router combining all document-related routers
export const documentManagementRouter = createTRPCRouter({
  documents: documentRouter,
  search: documentSearchRouter,
  userDocuments: userDocumentRouter,
  categories: documentCategoryRouter,
  tags: documentTagRouter,
  googleDrive: googleDriveRouter,
});
```

### **Validation Schemas**

```typescript
// Document validation schemas
export const CreateDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  googleDriveFileId: z.string().optional(),
});

export const UpdateDocumentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});

export const UploadToGoogleDriveSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string(),
  fileContent: z.string(), // Base64 encoded
  folderId: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const DocumentSearchSchema = z.object({
  query: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  mimeTypes: z.array(z.string()).optional(),
  sortBy: z.enum(['relevance', 'date', 'name', 'size']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export const GetDocumentsSchema = z.object({
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'size']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const AssociateDocumentSchema = z.object({
  documentId: z.string(),
  userId: z.string(),
  relationshipType: z.nativeEnum(DocumentRelationshipType),
  notes: z.string().optional(),
});

export const GetUserDocumentsSchema = z.object({
  userId: z.string(),
  relationshipTypes: z.array(z.nativeEnum(DocumentRelationshipType)).optional(),
  categoryIds: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z][a-z0-9-]*$/),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  defaultForUserRoles: z.array(z.string()).optional(),
});

export const UpdateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const UpdateTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const ConfigureGoogleDriveSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  rootFolderId: z.string().optional(),
  autoSync: z.boolean().optional(),
  syncFrequency: z.number().min(300).optional(), // Minimum 5 minutes
});

// TypeScript types
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentSchema>;
export type UploadToGoogleDriveDto = z.infer<typeof UploadToGoogleDriveSchema>;
export type DocumentSearchDto = z.infer<typeof DocumentSearchSchema>;
export type GetDocumentsDto = z.infer<typeof GetDocumentsSchema>;
export type AssociateDocumentDto = z.infer<typeof AssociateDocumentSchema>;
export type GetUserDocumentsDto = z.infer<typeof GetUserDocumentsSchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export type CreateTagDto = z.infer<typeof CreateTagSchema>;
export type UpdateTagDto = z.infer<typeof UpdateTagSchema>;
export type ConfigureGoogleDriveDto = z.infer<typeof ConfigureGoogleDriveSchema>;
```

## 📋 **Business Requirements**

### **Functional Requirements**

1. **Google Drive Integration**
   - **Description**: Seamless integration with Google Drive for file storage and management
   - **Acceptance Criteria**: 
     - Connect user Google Drive accounts via OAuth
     - Upload files directly to Google Drive from the application
     - Sync document metadata with Google Drive files
     - Create organized folder structures in Google Drive
   - **Priority**: HIGH

2. **Document Organization**
   - **Description**: Comprehensive categorization and tagging system
   - **Acceptance Criteria**: 
     - Create hierarchical document categories
     - Apply multiple tags to documents
     - Move documents between categories
     - Bulk operations for organization
   - **Priority**: HIGH

3. **User-Document Relationships**
   - **Description**: Associate documents with specific users and relationship types
   - **Acceptance Criteria**: 
     - Link documents to users with relationship types (client, contract signatory, etc.)
     - View all documents associated with a specific user
     - Track document access and usage per user
     - Manage permissions per user-document relationship
   - **Priority**: HIGH

4. **Advanced Search and Discovery**
   - **Description**: Powerful search capabilities across documents and metadata
   - **Acceptance Criteria**: 
     - Full-text search within document content
     - Filter by categories, tags, date ranges, file types
     - Search suggestions and autocomplete
     - Save and share search queries
   - **Priority**: HIGH

5. **Document Access Control**
   - **Description**: Granular permissions for document access and sharing
   - **Acceptance Criteria**: 
     - Different permission levels (view, download, edit, delete, share)
     - Share documents with specific users or teams
     - Time-limited access permissions
     - Audit trail of document access
   - **Priority**: MEDIUM

6. **User Detail View Integration**
   - **Description**: Show all documents related to a user in their detail view
   - **Acceptance Criteria**: 
     - Display documents categorized by type (contracts, invoices, legal docs, etc.)
     - Show document access history for the user
     - Quick actions to add new documents for the user
     - Filter and search within user's documents
   - **Priority**: HIGH

7. **Document Analytics**
   - **Description**: Track document usage and provide insights
   - **Acceptance Criteria**: 
     - Document view and download statistics
     - User engagement analytics
     - Popular documents and categories
     - Storage usage tracking
   - **Priority**: MEDIUM

### **Non-Functional Requirements**

- **Performance**: Document search <500ms, file upload progress tracking
- **Scalability**: Support 100,000+ documents per organization
- **Security**: Encrypted storage, secure OAuth integration with Google Drive
- **Availability**: 99.9% uptime for document access
- **Usability**: Intuitive drag-and-drop interface, responsive design

### **Business Rules**

1. **Document Ownership**: Documents have clear ownership and access control
2. **Google Drive Sync**: Changes in Google Drive reflect in the application
3. **User Associations**: Users can only access documents they have permissions for
4. **Category Hierarchy**: Categories can be nested but not cyclical
5. **Tag Management**: Tags are shared across the organization for consistency

## ✅ **Acceptance Criteria**

### **Feature Completion Criteria**

- [ ] **Database Schema**: Document management models created and migrated
- [ ] **Google Drive Integration**: OAuth setup and file operations working
- [ ] **Backend Services**: SOLID-compliant document services implemented
- [ ] **API Endpoints**: tRPC procedures for all document operations
- [ ] **Search System**: Advanced search with filters and full-text capabilities
- [ ] **User Interface**: Document management UI with categorization and tagging
- [ ] **User Detail Integration**: Documents view in user detail pages
- [ ] **Permission System**: Granular access control implemented
- [ ] **Analytics**: Document usage tracking and reporting
- [ ] **Testing**: Unit, integration, and E2E tests passing
- [ ] **Documentation**: Technical and user documentation updated

### **Quality Gates**

- [ ] **Test Coverage**: ≥95% for new document services
- [ ] **Performance**: Search responses <500ms, file operations <2s
- [ ] **SOLID Compliance**: All principles followed in service architecture
- [ ] **Security**: OAuth integration secure, access control validated
- [ ] **Accessibility**: WCAG 2.1 AA compliance for document interfaces
- [ ] **Mobile**: Responsive design for document browsing and basic operations

### **Business Validation**

- [ ] **Document Workflows**: All primary document management workflows working
- [ ] **Google Drive Sync**: Bi-directional sync working correctly
- [ ] **Search Accuracy**: Search results are relevant and complete
- [ ] **User Experience**: Intuitive document organization and discovery
- [ ] **Performance**: System handles expected document volumes efficiently

## 🔗 **Dependencies**

### **Internal Dependencies**

- **Authentication System**: Required for user management and permissions
- **User Management**: Required for user-document relationships
- **File Upload System**: Required for document upload capabilities
- **Search Infrastructure**: Required for document search functionality

### **External Dependencies**

- **Google Drive API**: Core integration for file storage and management
- **Google OAuth 2.0**: Required for secure Google Drive authentication
- **Text Extraction Libraries**: For document content indexing
- **Image Processing**: For thumbnail generation

### **Blocker Dependencies**

- **Google Drive API Setup**: Must be configured before integration work begins
- **OAuth Implementation**: Must be completed before Google Drive integration
- **File Storage Configuration**: Must be completed before document upload

## 📈 **Success Metrics**

### **Technical Metrics**

- **API Performance**: Document operations <500ms, search <300ms
- **Error Rate**: <1% error rate for document operations
- **Sync Success Rate**: >99% successful Google Drive sync operations
- **Search Accuracy**: >95% relevant results in top 10 search results

### **Business Metrics**

- **User Adoption**: 80% of users organize documents using the system
- **Document Organization**: 90% of documents categorized and tagged
- **Search Usage**: 70% of document access happens through search
- **Time Savings**: 60% reduction in time spent finding documents

### **Monitoring & Alerting**

- **Key Metrics to Track**: Document operations, search performance, Google Drive sync status, storage usage
- **Alert Thresholds**: >5% error rate, >1s response time, sync failures
- **Dashboards**: Document management analytics and system health

## 📝 **Implementation Notes**

### **Technical Considerations**

- **Google Drive API Quotas**: Implement rate limiting and retry logic
- **File Size Limits**: Handle large files with chunked uploads
- **Text Extraction**: Async processing for document content indexing
- **Caching Strategy**: Redis for frequently accessed document metadata
- **Security**: Encrypt Google Drive tokens, validate file types

### **Migration Strategy**

- **Data Migration**: No existing document data to migrate (new feature)
- **Feature Flags**: Gradual rollout starting with admin users
- **Rollback Plan**: Disable Google Drive integration, maintain local metadata

### **Security Considerations**

- **Authentication**: Secure OAuth 2.0 flow for Google Drive integration
- **Authorization**: Granular permissions for document access
- **Data Protection**: Encrypt sensitive document metadata
- **Input Validation**: Comprehensive validation for all document operations

## 🚀 **Delivery Plan**

### **Phase 1: Foundation (3 weeks)**

- [ ] Database schema design and implementation
- [ ] Core document service architecture (SOLID-compliant)
- [ ] Basic CRUD operations for documents, categories, and tags
- [ ] Google Drive API integration setup

### **Phase 2: Google Drive Integration (4 weeks)**

- [ ] OAuth 2.0 authentication flow
- [ ] File upload and download operations
- [ ] Folder management and organization
- [ ] Sync mechanisms between application and Google Drive

### **Phase 3: Search and Discovery (3 weeks)**

- [ ] Full-text search implementation
- [ ] Advanced filtering and sorting
- [ ] Search suggestions and autocomplete
- [ ] Performance optimization

### **Phase 4: User Relationships and Permissions (3 weeks)**

- [ ] User-document association system
- [ ] Permission management and access control
- [ ] User detail view integration
- [ ] Document sharing capabilities

### **Phase 5: Analytics and Polish (2 weeks)**

- [ ] Document usage analytics
- [ ] Performance monitoring and optimization
- [ ] User interface refinements
- [ ] Comprehensive testing and documentation

---

## 📋 **Approval Checklist**

- [ ] **Technical Review**: Architecture Agent approval for SOLID compliance
- [ ] **Security Review**: Google Drive integration security validated
- [ ] **Business Review**: Product Owner approval for business requirements
- [ ] **Performance Review**: Performance requirements realistic and achievable
- [ ] **Integration Review**: Google Drive API requirements confirmed
- [ ] **Resource Review**: Development capacity confirmed

---

**Next Steps**: Technical review and Google Drive API setup  
**Assigned Agents**: Architecture Agent, Backend Agent, Frontend Agent, Integration Agent  
**Estimated Timeline**: 15 weeks total development time