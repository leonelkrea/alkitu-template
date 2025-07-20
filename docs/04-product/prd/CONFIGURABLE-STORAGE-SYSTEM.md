# PRD Template - CONFIGURABLE-STORAGE-SYSTEM

## 📋 **Document Information**

- **PRD ID**: CONFIGURABLE-STORAGE-SYSTEM
- **Title**: Multi-Provider Configurable Storage System
- **Type**: Core Infrastructure
- **Priority**: HIGH
- **Status**: 🆕 **DRAFT**
- **Owner**: Product Team
- **Created**: 2024-07-17T16:30:00Z
- **Last Updated**: 2024-07-17T16:30:00Z

## 🎯 **Product Overview**

### **Purpose**

Create a flexible, configurable storage system that allows clients to choose and activate one or multiple storage providers based on their needs. The system will support Vercel Blob (primary), Cloudinary (media optimization), and Google Drive (document management) with a unified interface and seamless provider switching.

### **Target Users**

- **Primary**: Template administrators who configure storage options for their business
- **Secondary**: End users who upload and manage files through the configured storage
- **Tertiary**: Developers who need consistent storage APIs regardless of provider

### **Business Value**

- **Flexibility**: Clients can choose storage providers that fit their needs and budget
- **Scalability**: Different providers for different use cases (blob storage, media, documents)
- **Cost Optimization**: Clients can optimize costs by selecting appropriate storage tiers
- **Vendor Independence**: No lock-in to a single storage provider
- **Performance**: Choose providers based on geographic and performance requirements

## 🏗️ **Technical Architecture**

### **Stack Alignment**

- ✅ **Database**: MongoDB with Prisma ORM
- ✅ **Backend**: NestJS with tRPC + REST APIs
- ✅ **Frontend**: Next.js 15+ with React Server Components
- ✅ **Authentication**: JWT with role-based permissions
- ✅ **Storage Providers**: Vercel Blob, Cloudinary, Google Drive
- ✅ **Real-time**: WebSocket for upload progress
- ✅ **Email**: Resend integration for notifications

### **Architecture Patterns**

- ✅ **SOLID Principles**: All services follow SRP, OCP, LSP, ISP, DIP
- ✅ **Strategy Pattern**: Interchangeable storage providers
- ✅ **Adapter Pattern**: Unified interface for different providers
- ✅ **Factory Pattern**: Provider instantiation and configuration
- ✅ **Repository Pattern**: Data access abstraction

## 📊 **Database Schema (Prisma + MongoDB)**

### **Storage Configuration Models**

```prisma
// Storage Provider Configuration
model StorageProvider {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  name        String  @unique // "vercel_blob", "cloudinary", "google_drive"
  displayName String  // "Vercel Blob Storage", "Cloudinary", "Google Drive"
  type        String  // "blob", "media", "document"
  isActive    Boolean @default(false)
  isDefault   Boolean @default(false)
  
  // Configuration specific to each provider
  config      Json    // Provider-specific configuration
  
  // Usage statistics
  totalFiles  Int     @default(0)
  totalSize   BigInt  @default(0)
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relations
  files       File[]
  
  @@index([name])
  @@index([type, isActive])
  @@map("storage_providers")
}

// Unified File Model
model File {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  originalName  String   @map("original_name")
  fileName      String   @map("file_name") // Sanitized file name
  mimeType      String   @map("mime_type")
  size          BigInt
  
  // Storage information
  providerId    String   @map("provider_id") @db.ObjectId
  providerFileId String  @map("provider_file_id") // Provider-specific file ID
  url           String   // Public access URL
  
  // File metadata
  metadata      Json?    // Provider-specific metadata
  tags          String[] // Searchable tags
  
  // Access control
  isPublic      Boolean  @default(false) @map("is_public")
  permissions   Json?    // Detailed permissions
  
  // User and entity relationships
  uploadedBy    String   @map("uploaded_by") @db.ObjectId
  entityType    String?  @map("entity_type") // From Dynamic Product Service
  entityId      String?  @map("entity_id") @db.ObjectId
  
  // Timestamps
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  // Relations
  provider      StorageProvider @relation(fields: [providerId], references: [id])
  uploader      User            @relation(fields: [uploadedBy], references: [id])
  
  @@index([providerId])
  @@index([uploadedBy])
  @@index([entityType, entityId])
  @@index([mimeType])
  @@index([createdAt])
  @@map("files")
}

// Storage Configuration per Entity
model EntityStorageConfig {
  id               String @id @default(auto()) @map("_id") @db.ObjectId
  entityType       String @map("entity_type") // "user", "company", etc.
  entityId         String @map("entity_id") @db.ObjectId
  
  // Provider preferences
  defaultProviderId String? @map("default_provider_id") @db.ObjectId
  allowedProviders  String[] @map("allowed_providers") // Provider IDs
  
  // Storage limits
  maxFileSize      BigInt? @map("max_file_size")
  maxTotalSize     BigInt? @map("max_total_size")
  allowedMimeTypes String[] @map("allowed_mime_types")
  
  // Configuration
  autoOptimize     Boolean @default(true) @map("auto_optimize")
  compressionLevel String? @map("compression_level") // "low", "medium", "high"
  
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
  
  @@unique([entityType, entityId])
  @@map("entity_storage_configs")
}
```

### **Storage Provider Configurations**

```json
// Vercel Blob Configuration
{
  "type": "vercel_blob",
  "token": "encrypted_token",
  "maxFileSize": "50MB",
  "allowedTypes": ["*"],
  "publicAccess": true
}

// Cloudinary Configuration  
{
  "type": "cloudinary",
  "cloudName": "cloud_name",
  "apiKey": "encrypted_api_key",
  "apiSecret": "encrypted_api_secret",
  "autoOptimize": true,
  "transformations": {
    "thumbnail": "w_300,h_300,c_fill",
    "medium": "w_800,h_600,c_fit",
    "large": "w_1200,h_900,c_fit"
  }
}

// Google Drive Configuration
{
  "type": "google_drive",
  "clientId": "encrypted_client_id",
  "clientSecret": "encrypted_client_secret",
  "folderId": "default_folder_id",
  "shareSettings": "private"
}
```

## 🔌 **API Endpoints**

### **tRPC Procedures**

```typescript
// Storage configuration router
export const storageRouter = createTRPCRouter({
  // Provider management
  getProviders: protectedProcedure
    .query(async ({ ctx }) => {
      // Get all configured storage providers
    }),

  configureProvider: protectedProcedure
    .input(ConfigureProviderSchema)
    .mutation(async ({ input, ctx }) => {
      // Configure a storage provider
    }),

  toggleProvider: protectedProcedure
    .input(z.object({ providerId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      // Activate/deactivate a provider
    }),

  // File operations
  uploadFile: protectedProcedure
    .input(UploadFileSchema)
    .mutation(async ({ input, ctx }) => {
      // Upload file to configured provider
    }),

  getFiles: protectedProcedure
    .input(GetFilesSchema)
    .query(async ({ input, ctx }) => {
      // Get files with filtering and pagination
    }),

  moveFile: protectedProcedure
    .input(MoveFileSchema)
    .mutation(async ({ input, ctx }) => {
      // Move file between providers
    }),

  deleteFile: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Delete file from provider and database
    }),

  // Configuration
  getEntityConfig: protectedProcedure
    .input(z.object({ entityType: z.string(), entityId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Get storage configuration for entity
    }),

  updateEntityConfig: protectedProcedure
    .input(UpdateEntityConfigSchema)
    .mutation(async ({ input, ctx }) => {
      // Update entity storage configuration
    }),
});
```

### **Storage Service Architecture**

```typescript
// Base storage interface (Interface Segregation Principle)
interface IStorageProvider {
  upload(file: FileUpload, config?: UploadConfig): Promise<UploadResult>;
  download(fileId: string): Promise<DownloadResult>;
  delete(fileId: string): Promise<boolean>;
  getUrl(fileId: string, options?: UrlOptions): Promise<string>;
}

// Provider-specific interfaces
interface IBlobStorageProvider extends IStorageProvider {
  generateSignedUrl(fileId: string, expiresIn: number): Promise<string>;
}

interface IMediaStorageProvider extends IStorageProvider {
  transform(fileId: string, transformation: string): Promise<string>;
  getOptimizedUrl(fileId: string, format?: string): Promise<string>;
}

interface IDocumentStorageProvider extends IStorageProvider {
  shareDocument(fileId: string, permissions: SharePermissions): Promise<string>;
  syncFolder(folderId: string): Promise<SyncResult>;
}

// Concrete implementations following SOLID principles
@Injectable()
class VercelBlobProvider implements IBlobStorageProvider {
  constructor(
    private readonly config: VercelBlobConfig,
    private readonly logger: ILogger
  ) {}

  async upload(file: FileUpload, config?: UploadConfig): Promise<UploadResult> {
    // Vercel Blob upload implementation
  }
}

@Injectable()
class CloudinaryProvider implements IMediaStorageProvider {
  constructor(
    private readonly config: CloudinaryConfig,
    private readonly logger: ILogger
  ) {}

  async upload(file: FileUpload, config?: UploadConfig): Promise<UploadResult> {
    // Cloudinary upload with optimization
  }

  async transform(fileId: string, transformation: string): Promise<string> {
    // Apply Cloudinary transformations
  }
}

@Injectable()
class GoogleDriveProvider implements IDocumentStorageProvider {
  constructor(
    private readonly config: GoogleDriveConfig,
    private readonly oauthService: IOAuthService,
    private readonly logger: ILogger
  ) {}

  async upload(file: FileUpload, config?: UploadConfig): Promise<UploadResult> {
    // Google Drive upload implementation
  }

  async shareDocument(fileId: string, permissions: SharePermissions): Promise<string> {
    // Google Drive sharing implementation
  }
}

// Storage factory (Factory Pattern)
@Injectable()
class StorageProviderFactory {
  constructor(
    private readonly configService: IConfigService,
    private readonly logger: ILogger
  ) {}

  createProvider(providerType: string): IStorageProvider {
    switch (providerType) {
      case 'vercel_blob':
        return new VercelBlobProvider(this.configService.getVercelConfig(), this.logger);
      case 'cloudinary':
        return new CloudinaryProvider(this.configService.getCloudinaryConfig(), this.logger);
      case 'google_drive':
        return new GoogleDriveProvider(this.configService.getGoogleDriveConfig(), this.oauthService, this.logger);
      default:
        throw new Error(`Unsupported storage provider: ${providerType}`);
    }
  }
}

// Main storage service (Strategy Pattern)
@Injectable()
class StorageService {
  constructor(
    private readonly providerFactory: StorageProviderFactory,
    private readonly fileRepository: IFileRepository,
    private readonly configRepository: IStorageConfigRepository
  ) {}

  async uploadFile(
    file: FileUpload,
    entityContext: EntityContext,
    providerName?: string
  ): Promise<UploadResult> {
    // 1. Determine which provider to use
    const provider = await this.selectProvider(entityContext, file.mimeType, providerName);
    
    // 2. Upload to selected provider
    const uploadResult = await provider.upload(file);
    
    // 3. Save file metadata to database
    const fileRecord = await this.fileRepository.create({
      originalName: file.originalName,
      fileName: uploadResult.fileName,
      mimeType: file.mimeType,
      size: file.size,
      providerId: provider.id,
      providerFileId: uploadResult.fileId,
      url: uploadResult.url,
      uploadedBy: entityContext.userId,
      entityType: entityContext.entityType,
      entityId: entityContext.entityId,
    });

    return {
      fileId: fileRecord.id,
      url: uploadResult.url,
      provider: provider.name,
    };
  }

  private async selectProvider(
    entityContext: EntityContext,
    mimeType: string,
    preferredProvider?: string
  ): Promise<IStorageProvider> {
    // Logic to select the best provider based on:
    // 1. User preference
    // 2. File type
    // 3. Entity configuration
    // 4. Provider availability
  }
}
```

## 📋 **Business Requirements**

### **Functional Requirements**

1. **Storage Provider Management**
   - **Description**: Administrators can configure and activate multiple storage providers
   - **Acceptance Criteria**: Can enable/disable Vercel Blob, Cloudinary, and Google Drive independently
   - **Priority**: HIGH

2. **Automatic Provider Selection**
   - **Description**: System automatically selects optimal provider based on file type and configuration
   - **Acceptance Criteria**: Images go to Cloudinary, documents to Google Drive, general files to Vercel Blob
   - **Priority**: HIGH

3. **Unified File Interface**
   - **Description**: Users interact with files through a single interface regardless of storage provider
   - **Acceptance Criteria**: Upload, download, delete works consistently across all providers
   - **Priority**: HIGH

4. **Provider Migration**
   - **Description**: Ability to move files between providers without losing functionality
   - **Acceptance Criteria**: Files can be migrated with preserved metadata and permissions
   - **Priority**: MEDIUM

### **Non-Functional Requirements**

- **Performance**: File uploads < 30 seconds for files up to 100MB
- **Scalability**: Support for 10,000+ files per storage provider
- **Security**: All provider credentials encrypted and securely stored
- **Availability**: 99.9% uptime across all configured providers
- **Usability**: Provider switching transparent to end users

## ✅ **Acceptance Criteria**

### **Feature Completion Criteria**

- [ ] **Provider Configuration**: All three providers (Vercel, Cloudinary, Google Drive) configurable
- [ ] **Unified API**: Single API interface for all storage operations
- [ ] **Automatic Selection**: Smart provider selection based on file type and configuration
- [ ] **File Management**: Upload, download, delete, move operations working across providers
- [ ] **Admin Interface**: UI for configuring and managing storage providers
- [ ] **Entity Integration**: Integration with Dynamic Product Service Module entities
- [ ] **Performance**: Upload/download operations meet performance requirements

### **Quality Gates**

- [ ] **Test Coverage**: ≥95% for storage services
- [ ] **Security**: All credentials encrypted and access controlled
- [ ] **SOLID Compliance**: All services follow SOLID principles
- [ ] **Error Handling**: Graceful handling of provider failures
- [ ] **Documentation**: Complete API and configuration documentation

## 🔗 **Dependencies**

### **Internal Dependencies**

- **Dynamic Product Service Module**: Entity relationships for file associations
- **User Management System**: User authentication and permissions
- **Configuration System**: Dynamic configuration management

### **External Dependencies**

- **Vercel Blob API**: Blob storage operations
- **Cloudinary API**: Media optimization and transformation
- **Google Drive API**: Document storage and management

## 📈 **Success Metrics**

### **Technical Metrics**

- **Upload Success Rate**: >99% across all providers
- **Average Upload Time**: <10 seconds for files <10MB
- **Provider Availability**: 99.9% uptime
- **API Response Time**: <500ms for file operations

### **Business Metrics**

- **Storage Cost Optimization**: 30% cost reduction through optimal provider selection
- **User Satisfaction**: 90%+ satisfaction with file management features
- **Provider Adoption**: 80%+ of clients using multiple providers

## 📝 **Implementation Notes**

### **Technical Considerations**

- **Provider Priorities**: Implement in order - Vercel Blob → Cloudinary → Google Drive
- **Configuration Security**: All provider credentials must be encrypted
- **Fallback Strategy**: Automatic fallback to default provider if preferred provider fails
- **Migration Strategy**: Background jobs for moving files between providers

### **Security Considerations**

- **Credential Management**: Secure storage and rotation of API keys
- **Access Control**: Role-based access to storage configuration
- **File Permissions**: Granular permissions per file and provider
- **Audit Trail**: Complete logging of all storage operations

## 🚀 **Delivery Plan**

### **Phase 1: Vercel Blob Integration** (2 weeks)

- [ ] Vercel Blob provider implementation
- [ ] Basic file upload/download functionality
- [ ] Admin configuration interface
- [ ] Integration with existing file upload flows

### **Phase 2: Cloudinary Integration** (2 weeks)

- [ ] Cloudinary provider implementation
- [ ] Image optimization and transformation
- [ ] Automatic provider selection for media files
- [ ] Media gallery and preview functionality

### **Phase 3: Google Drive Integration** (2 weeks)

- [ ] Google Drive provider implementation
- [ ] OAuth authentication flow
- [ ] Document management features
- [ ] Integration with Document Management module

### **Phase 4: Advanced Features** (1 week)

- [ ] File migration between providers
- [ ] Advanced configuration options
- [ ] Performance optimization
- [ ] Comprehensive testing and documentation

---

## 📋 **Approval Checklist**

- [ ] **Technical Review**: Architecture and SOLID compliance validated
- [ ] **Security Review**: Credential management and access control approved
- [ ] **Business Review**: Storage strategy and cost implications reviewed
- [ ] **Performance Review**: Upload/download performance requirements confirmed

---

**Next Steps**: Integration with existing modules and provider implementation in priority order  
**Assigned Agents**: Backend Agent (primary), Frontend Agent (UI)  
**Estimated Timeline**: 7 weeks total (overlapping with other modules)