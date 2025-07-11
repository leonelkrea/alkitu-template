# 📁 File Management & Storage Module PRD (CORREGIDO)

## 📋 1. Introducción y Objetivos

### **Propósito del Módulo**

El módulo de File Management & Storage permite que cualquier SaaS maneje archivos de forma profesional: avatares de usuario, documentos, imágenes, videos, y cualquier tipo de archivo que los usuarios necesiten subir. Con **CloudFlare R2** como proveedor principal, ofrece costos ultra-bajos y performance global.

### **🔗 Conexión con SOLID Implementation**

- **Depende de**: SOLID-004 (Interface Segregation) - Storage provider interfaces
- **Depende de**: SOLID-005 (Dependency Inversion) - Storage abstraction layers
- **Integración**: **User Management** - File ownership and permissions
- **Integración**: **Admin Dashboard** - File analytics and management
- **Implementación**: Semana 15-16 (después de configuration system)

### **Objetivos Comerciales**

- **Cost Efficiency**: 90% menos costo que AWS S3
- **Global Performance**: CDN global incluido
- **Zero Egress Fees**: Sin costos de transferencia
- **Developer Friendly**: Setup en < 20 minutos
- **🔗 Enterprise Features**: Integración con user management y admin dashboard

### **Metas Técnicas**

- **Upload Speed**: < 5 segundos para archivos 10MB
- **Processing Speed**: < 3 segundos para image optimization
- **Global Latency**: < 100ms desde cualquier ubicación
- **Availability**: 99.9% uptime garantizado
- **✅ Enhanced**: Integración completa con sistema de usuarios y permisos

---

## 👥 2. Stakeholders

### **Template Users (Developers)**

- **SaaS Builders**: Necesitan file uploads desde día 1
- **E-commerce Developers**: Product images y assets
- **Content Platforms**: User-generated content
- **Document Platforms**: PDF y document management

### **End Users**

- **Profile Management**: Avatar uploads, personal files
- **Content Creators**: Images, videos, documents
- **Business Users**: Reports, presentations, assets
- **Team Collaboration**: Shared files y folders

### **Business Stakeholders**

- **Product Teams**: Feature files para product demos
- **Marketing Teams**: Asset management y brand files
- **Support Teams**: File sharing con customers
- **Legal/Compliance**: Document retention policies

---

## 📖 3. Historias de Usuario

### **Developer (Template Implementation)**

```gherkin
Como developer usando el template
Quiero configurar CloudFlare R2 en menos de 20 minutos
Para tener file uploads funcionando inmediatamente

Como developer
Quiero image processing automático
Para optimizar performance sin esfuerzo manual

Como developer
Quiero file validation built-in
Para seguridad automática sin configurar nada
```

### **End User (File Management)**

```gherkin
Como usuario
Quiero subir mi avatar fácilmente
Para personalizar mi perfil

Como usuario de negocio
Quiero subir documentos hasta 100MB
Para compartir presentaciones y reports

Como content creator
Quiero subir imágenes que se optimicen automáticamente
Para que mi contenido cargue rápido
```

### **Business Owner**

```gherkin
Como business owner
Quiero storage costs predecibles
Para controlar gastos operacionales

Como product manager
Quiero analytics de file usage
Para entender como usuarios usan files

Como compliance officer
Quiero file retention automática
Para cumplir con regulaciones
```

---

## 🎨 4. Características por Licencia

### **Template Free ($0) - Evaluation**

| Funcionalidad             | Incluido | Limitaciones         |
| ------------------------- | -------- | -------------------- |
| CloudFlare R2 Setup Guide | ✅       | Solo documentación   |
| Basic File Upload         | ✅       | Hasta 1MB por file   |
| Image Thumbnails          | ✅       | Funcionalidad básica |
| File Type Validation      | ✅       | Tipos comunes        |
| Storage Limits            | ⚠️       | Solo para testing    |

### **Template Professional ($297)**

| Funcionalidad             | Incluido | Limitaciones           |
| ------------------------- | -------- | ---------------------- |
| Complete R2 Integration   | ✅       | Production ready       |
| Advanced Image Processing | ✅       | Resize, crop, optimize |
| File Upload até 100MB     | ✅       | Per file limit         |
| Multiple Storage Zones    | ✅       | Global distribution    |
| File Analytics            | ✅       | Usage metrics          |
| Automatic Backups         | ✅       | Daily snapshots        |
| Virus Scanning            | ✅       | ClamAV integration     |
| File Compression          | ✅       | Automatic optimization |
| CDN Integration           | ✅       | Global edge caching    |

### **Template Enterprise ($997)**

| Funcionalidad              | Incluido | Limitaciones           |
| -------------------------- | -------- | ---------------------- |
| Everything in Professional | ✅       | + Advanced features    |
| Multi-Provider Support     | ✅       | R2 + S3 + others       |
| Advanced File Processing   | ✅       | Video transcoding      |
| Custom File Workflows      | ✅       | Approval processes     |
| Enterprise Security        | ✅       | Encryption, compliance |
| White-label File Manager   | ✅       | Custom branding        |
| Unlimited Storage          | ✅       | No file size limits    |
| Priority Support           | ✅       | 24h response           |
| Custom Integrations        | ✅       | Specific workflows     |

---

## 🛠️ 5. Requisitos Técnicos

### **CloudFlare R2 Integration**

```typescript
// File Storage Service with CloudFlare R2
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class FileStorageService {
  private r2Client: S3Client;

  constructor() {
    this.r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  // Generate Presigned Upload URL
  async generateUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.r2Client, command, { expiresIn: 3600 });
  }

  // Process and Upload File
  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<FileRecord> {
    const fileKey = `${userId}/${Date.now()}-${file.originalname}`;

    // Image processing if needed
    let processedBuffer = file.buffer;
    if (file.mimetype.startsWith("image/")) {
      processedBuffer = await this.optimizeImage(file.buffer);
    }

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: processedBuffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.r2Client.send(command);

    return this.createFileRecord({
      key: fileKey,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      userId,
    });
  }

  // Image Optimization
  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    const sharp = require("sharp");

    return await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
  }
}
```

### **File Processing Pipeline**

```typescript
// File Processing with Bull Queue
import { Queue, Worker } from "bullmq";

export class FileProcessingQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("file-processing", {
      connection: { host: "redis", port: 6379 },
    });

    this.setupWorker();
  }

  // Add file to processing queue
  async processFile(fileId: string, processingType: string) {
    await this.queue.add("process-file", {
      fileId,
      processingType,
      timestamp: Date.now(),
    });
  }

  private setupWorker() {
    new Worker("file-processing", async (job) => {
      const { fileId, processingType } = job.data;

      switch (processingType) {
        case "image-optimization":
          return await this.processImage(fileId);
        case "virus-scan":
          return await this.scanForVirus(fileId);
        case "thumbnail-generation":
          return await this.generateThumbnails(fileId);
        case "metadata-extraction":
          return await this.extractMetadata(fileId);
      }
    });
  }
}
```

### **Backend Structure (NestJS)**

```typescript
files/
├── files.controller.ts         # File endpoints
├── files.service.ts           # Core file logic
├── storage/
│   ├── r2.service.ts          # CloudFlare R2
│   ├── s3.service.ts          # AWS S3 (backup)
│   └── storage.interface.ts   # Storage abstraction
├── processing/
│   ├── image.processor.ts     # Image optimization
│   ├── video.processor.ts     # Video processing
│   └── document.processor.ts  # Document handling
├── validation/
│   ├── file-type.validator.ts # File type validation
│   ├── size.validator.ts      # File size limits
│   └── security.validator.ts  # Security checks
├── analytics/
│   ├── usage.service.ts       # File usage tracking
│   └── metrics.service.ts     # Storage metrics
└── cleanup/
    ├── retention.service.ts   # File retention
    └── cleanup.scheduler.ts   # Automatic cleanup
```

### **Frontend Components**

```tsx
components/files/
├── FileUploader.tsx           # Drag & drop uploader
├── FileManager.tsx            # File browser
├── ImageGallery.tsx           # Image gallery view
├── FilePreview.tsx            # File preview modal
├── ProgressBar.tsx            # Upload progress
├── FilePicker.tsx             # File selection
└── FileAnalytics.tsx          # Usage analytics
```

### **🗃️ Database Schema (Prisma + MongoDB)**

```prisma
// ✅ CORRECTED: Prisma schema instead of SQL
// packages/api/prisma/schema.prisma

model File {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  userId          String   @db.ObjectId
  organizationId  String?  @db.ObjectId
  originalName    String
  storageKey      String   // CloudFlare R2 key
  fileName        String   // Clean filename
  fileSize        Int
  mimeType        String
  storageProvider StorageProvider @default(CLOUDFLARE_R2)
  processingStatus ProcessingStatus @default(PENDING)
  publicAccess    Boolean  @default(false)
  // File metadata
  metadata        Json     @default("{}")
  dimensions      Json?    // For images/videos: { width, height }
  duration        Int?     // For videos/audio in seconds
  thumbnailKey    String?  // Thumbnail storage key
  // Access control
  accessLevel     FileAccessLevel @default(PRIVATE)
  downloadCount   Int      @default(0)
  // Timestamps
  uploadedAt      DateTime @default(now())
  expiresAt       DateTime?
  deletedAt       DateTime?
  lastAccessedAt  DateTime?

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])
  versions     FileVersion[]
  shares       FileShare[]
  analytics    FileAnalytic[]
  processingJobs FileProcessingJob[]

  @@map("files")
}

model FileVersion {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  fileId              String   @db.ObjectId
  versionNumber       Int
  storageKey          String   // CloudFlare R2 key for this version
  fileSize            Int
  changesDescription  String?
  createdBy           String   @db.ObjectId
  createdAt           DateTime @default(now())

  // Relations
  file      File @relation(fields: [fileId], references: [id], onDelete: Cascade)
  createdByUser User @relation(fields: [createdBy], references: [id])

  @@unique([fileId, versionNumber])
  @@map("file_versions")
}

model FileShare {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  fileId      String   @db.ObjectId
  sharedBy    String   @db.ObjectId
  sharedWith  String?  @db.ObjectId // If null, it's a public share
  accessLevel FileAccessLevel @default(READ)
  shareToken  String?  @unique // For public shares
  expiresAt   DateTime?
  createdAt   DateTime @default(now())

  // Relations
  file       File  @relation(fields: [fileId], references: [id], onDelete: Cascade)
  sharer     User  @relation("FilesSharedBy", fields: [sharedBy], references: [id])
  recipient  User? @relation("FilesSharedWith", fields: [sharedWith], references: [id])

  @@map("file_shares")
}

model FileAnalytic {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  fileId    String   @db.ObjectId
  action    FileAction
  userId    String?  @db.ObjectId
  ipAddress String?
  userAgent String?
  // Request metadata
  referer   String?
  country   String?
  city      String?
  timestamp DateTime @default(now())

  // Relations
  file File  @relation(fields: [fileId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [userId], references: [id])

  @@map("file_analytics")
}

// File processing jobs
model FileProcessingJob {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  fileId        String   @db.ObjectId
  jobType       ProcessingJobType
  status        ProcessingStatus @default(PENDING)
  progress      Int      @default(0)
  errorMessage  String?
  result        Json?    // Processing results
  startedAt     DateTime?
  completedAt   DateTime?
  createdAt     DateTime @default(now())

  // Relations
  file File @relation(fields: [fileId], references: [id], onDelete: Cascade)

  @@map("file_processing_jobs")
}

enum StorageProvider {
  CLOUDFLARE_R2
  AWS_S3
  GOOGLE_CLOUD
  LOCAL
}

enum FileAccessLevel {
  PRIVATE
  READ
  WRITE
  ADMIN
  PUBLIC
}

enum ProcessingStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum FileAction {
  UPLOAD
  DOWNLOAD
  VIEW
  DELETE
  SHARE
  COPY
  MOVE
}

enum ProcessingJobType {
  IMAGE_OPTIMIZATION
  THUMBNAIL_GENERATION
  VIDEO_TRANSCODING
  VIRUS_SCAN
  METADATA_EXTRACTION
}
```

### **📡 API Endpoints (tRPC + NestJS)**

```typescript
// ✅ CORRECTED: tRPC router instead of REST endpoints
// packages/api/src/trpc/routers/files.router.ts

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fileSchemas } from "../schemas/file.schemas";

export const filesRouter = createTRPCRouter({
  // File Upload
  generateUploadUrl: protectedProcedure
    .input(fileSchemas.generateUploadUrlInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.generateUploadUrl(input);
    }),

  confirmUpload: protectedProcedure
    .input(fileSchemas.confirmUploadInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.confirmUpload(input);
    }),

  // File Management
  getFiles: protectedProcedure
    .input(fileSchemas.getFilesInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getFiles(ctx.user.id, input);
    }),

  getFile: protectedProcedure
    .input(fileSchemas.getFileInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getFile(input.id);
    }),

  deleteFile: protectedProcedure
    .input(fileSchemas.deleteFileInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.deleteFile(input.id);
    }),

  updateFile: protectedProcedure
    .input(fileSchemas.updateFileInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.updateFile(input);
    }),

  // File Sharing
  shareFile: protectedProcedure
    .input(fileSchemas.shareFileInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.shareFile(input);
    }),

  getSharedFiles: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.fileService.getSharedFiles(ctx.user.id);
  }),

  revokeShare: protectedProcedure
    .input(fileSchemas.revokeShareInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.revokeShare(input.shareId);
    }),

  // File Processing
  processFile: protectedProcedure
    .input(fileSchemas.processFileInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.fileService.processFile(input);
    }),

  getProcessingStatus: protectedProcedure
    .input(fileSchemas.getProcessingStatusInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getProcessingStatus(input.fileId);
    }),

  // Public file access
  getPublicFile: publicProcedure
    .input(fileSchemas.getPublicFileInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getPublicFile(input.token);
    }),

  downloadFile: publicProcedure
    .input(fileSchemas.downloadFileInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getDownloadUrl(input.fileId, input.token);
    }),

  // Analytics
  getFileAnalytics: protectedProcedure
    .input(fileSchemas.getFileAnalyticsInput)
    .query(async ({ input, ctx }) => {
      return await ctx.fileService.getFileAnalytics(input);
    }),

  // Admin endpoints
  getStorageUsage: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.fileService.getStorageUsage(ctx.user.id);
  }),

  cleanupExpiredFiles: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.fileService.cleanupExpiredFiles();
  }),
});
```

### **🔧 Backend Service (NestJS + SOLID)**

```typescript
// ✅ CORRECTED: SOLID-compliant service with CloudFlare R2 integration
// packages/api/src/files/files.service.ts

@Injectable()
export class FilesService implements IFilesService {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly cloudflareR2Service: ICloudflareR2Service,
    private readonly imageProcessingService: IImageProcessingService,
    private readonly virusScanService: IVirusScanService,
    private readonly fileAnalyticsService: IFileAnalyticsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async generateUploadUrl(
    input: GenerateUploadUrlInput
  ): Promise<GenerateUploadUrlResult> {
    // Validate file type and size
    if (!this.isValidFileType(input.mimeType)) {
      throw new Error("File type not allowed");
    }

    if (input.fileSize > this.getMaxFileSize(input.mimeType)) {
      throw new Error("File size exceeds limit");
    }

    // Generate unique storage key
    const storageKey = this.generateStorageKey(input.fileName, input.userId);

    // Create presigned URL for CloudFlare R2
    const uploadUrl = await this.cloudflareR2Service.generateUploadUrl({
      key: storageKey,
      contentType: input.mimeType,
      contentLength: input.fileSize,
      expiresIn: 3600, // 1 hour
    });

    // Create file record in database
    const file = await this.fileRepository.create({
      userId: input.userId,
      organizationId: input.organizationId,
      originalName: input.fileName,
      storageKey,
      fileName: this.sanitizeFileName(input.fileName),
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      processingStatus: ProcessingStatus.PENDING,
    });

    return {
      uploadUrl,
      fileId: file.id,
      storageKey,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  async confirmUpload(input: ConfirmUploadInput): Promise<ConfirmUploadResult> {
    // Verify file was uploaded successfully
    const exists = await this.cloudflareR2Service.objectExists(
      input.storageKey
    );
    if (!exists) {
      throw new Error("File upload not found");
    }

    // Update file status
    const file = await this.fileRepository.update(input.fileId, {
      processingStatus: ProcessingStatus.PROCESSING,
    });

    // Queue processing tasks
    await this.queueProcessingTasks(file);

    // Emit event
    this.eventEmitter.emit("file.uploaded", {
      fileId: file.id,
      userId: file.userId,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
    });

    return {
      file: this.sanitizeFile(file),
      processingQueued: true,
    };
  }

  async getFiles(
    userId: string,
    input: GetFilesInput
  ): Promise<GetFilesResult> {
    const files = await this.fileRepository.findByUserId(userId, {
      skip: input.skip,
      take: input.take,
      where: {
        ...(input.mimeType && { mimeType: { contains: input.mimeType } }),
        ...(input.search && {
          OR: [
            { originalName: { contains: input.search, mode: "insensitive" } },
            { fileName: { contains: input.search, mode: "insensitive" } },
          ],
        }),
        deletedAt: null,
      },
      orderBy: { uploadedAt: "desc" },
    });

    return {
      files: files.map((file) => this.sanitizeFile(file)),
      total: await this.fileRepository.countByUserId(userId),
      hasMore: files.length === input.take,
    };
  }

  async shareFile(input: ShareFileInput): Promise<ShareFileResult> {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    // Check permissions
    if (file.userId !== input.sharedBy) {
      throw new Error("Insufficient permissions");
    }

    // Create share record
    const share = await this.fileShareRepository.create({
      fileId: input.fileId,
      sharedBy: input.sharedBy,
      sharedWith: input.sharedWith,
      accessLevel: input.accessLevel,
      shareToken: input.isPublic ? this.generateShareToken() : undefined,
      expiresAt: input.expiresAt,
    });

    // Generate share URL
    const shareUrl = input.isPublic
      ? `${process.env.APP_URL}/files/shared/${share.shareToken}`
      : null;

    return {
      share: this.sanitizeShare(share),
      shareUrl,
    };
  }

  private async queueProcessingTasks(file: File): Promise<void> {
    const tasks = [];

    // Image optimization
    if (file.mimeType.startsWith("image/")) {
      tasks.push(this.imageProcessingService.queueOptimization(file.id));
      tasks.push(this.imageProcessingService.queueThumbnailGeneration(file.id));
    }

    // Virus scanning
    tasks.push(this.virusScanService.queueScan(file.id));

    // Metadata extraction
    tasks.push(this.queueMetadataExtraction(file.id));

    await Promise.all(tasks);
  }

  private generateStorageKey(fileName: string, userId: string): string {
    const date = new Date().toISOString().slice(0, 10);
    const uuid = randomUUID();
    const extension = fileName.split(".").pop();
    return `${userId}/${date}/${uuid}.${extension}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  }

  private isValidFileType(mimeType: string): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/json",
      "video/mp4",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return allowedTypes.includes(mimeType);
  }

  private getMaxFileSize(mimeType: string): number {
    // Different limits for different file types
    if (mimeType.startsWith("image/")) return 10 * 1024 * 1024; // 10MB
    if (mimeType.startsWith("video/")) return 100 * 1024 * 1024; // 100MB
    if (mimeType.startsWith("audio/")) return 50 * 1024 * 1024; // 50MB
    return 25 * 1024 * 1024; // 25MB default
  }

  private sanitizeFile(file: File): SafeFile {
    return {
      id: file.id,
      originalName: file.originalName,
      fileName: file.fileName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      uploadedAt: file.uploadedAt,
      processingStatus: file.processingStatus,
      publicAccess: file.publicAccess,
      downloadCount: file.downloadCount,
    };
  }

  // Other methods following SOLID principles...
}
```

---

## 📏 6. Criterios de Aceptación

### **CloudFlare R2 Setup**

- [ ] R2 bucket creation automática
- [ ] Domain configuration para CDN
- [ ] Environment variables setup
- [ ] Test upload funcional en < 20 minutos

### **File Upload**

- [ ] Drag & drop interface funcional
- [ ] Multiple file upload simultáneo
- [ ] Progress bars en tiempo real
- [ ] Error handling robusto
- [ ] File type validation automática

### **Image Processing**

- [ ] Automatic image optimization
- [ ] Thumbnail generation automática
- [ ] Multiple size variants (thumb, medium, large)
- [ ] Format conversion (WEBP support)
- [ ] Lossless y lossy compression options

### **Security**

- [ ] File type validation estricta
- [ ] Virus scanning automático
- [ ] File size limits configurables
- [ ] Access control por user/role
- [ ] Secure file URLs (time-limited)

### **Performance**

- [ ] CDN distribution global
- [ ] Lazy loading para galleries
- [ ] Compression automática
- [ ] Caching strategy optimizada
- [ ] Background processing para files grandes

---

## 🌍 7. Servicios Externos & Setup

### **CloudFlare R2 Configuration**

```bash
# Environment Variables Required
CLOUDFLARE_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-domain.com

# R2 Setup (automated in template)
wrangler r2 bucket create your-bucket-name
wrangler r2 bucket cors put your-bucket-name --config cors.json
```

### **CORS Configuration**

```json
{
  "cors": [
    {
      "allowedOrigins": ["https://yourapp.com"],
      "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
      "allowedHeaders": ["*"],
      "exposedHeaders": ["ETag"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

### **Additional Services**

- **CloudFlare Images**: Para advanced image processing
- **CloudFlare Stream**: Para video hosting (optional)
- **ClamAV**: Para virus scanning
- **ImageMagick/Sharp**: Para image processing

---

## 📊 8. Analytics & Metrics

### **Storage Metrics**

- **Total Storage Used**: GB utilizados por tenant
- **File Count**: Número total de archivos
- **Storage Growth**: Rate de crecimiento mensual
- **Cost per GB**: Costo real vs projected

### **Usage Metrics**

- **Upload Volume**: Files uploaded per día/mes
- **Download Volume**: Files accessed y frequency
- **Popular File Types**: Distribución por tipo
- **User Engagement**: Usuarios activos con files

### **Performance Metrics**

- **Upload Speed**: Average time to upload
- **Processing Time**: Time for image/video processing
- **CDN Hit Rate**: % requests served from edge
- **Error Rate**: Failed uploads/downloads

### **Business Metrics**

- **Feature Adoption**: % users uploading files
- **Storage Revenue Impact**: Revenue per GB stored
- **Upgrade Triggers**: Storage limits causing upgrades
- **Support Load**: File-related support tickets

---

## 🚀 9. Implementation Priority

### **Phase 1: Core Upload (Days 1-4)**

- CloudFlare R2 integration básica
- Simple file upload/download
- Basic image thumbnails
- File type validation

### **Phase 2: Processing (Days 5-7)**

- Image optimization pipeline
- Background job processing
- Multiple file size variants
- Basic file manager UI

### **Phase 3: Advanced Features (Days 8-10)**

- File sharing functionality
- Advanced image processing
- File analytics dashboard
- Security enhancements

---

## 📚 10. Developer Documentation

### **Setup Guides Required**

- [ ] **CloudFlare R2 Account Setup**: Complete walkthrough
- [ ] **Domain Configuration**: CDN setup automation
- [ ] **File Processing**: Image optimization guide
- [ ] **Security Configuration**: Validation y scanning

### **Integration Examples**

```typescript
// Quick Start Example
import { FileStorageService } from "@alkitu/files";

const fileService = new FileStorageService({
  provider: "r2",
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKey: process.env.R2_ACCESS_KEY_ID,
  secretKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET_NAME,
});

// Upload file
const uploadUrl = await fileService.generateUploadUrl(
  "user-123/avatar.jpg",
  "image/jpeg"
);

// Process uploaded file
const fileRecord = await fileService.processUpload({
  key: "user-123/avatar.jpg",
  userId: "user-123",
  optimize: true,
  generateThumbnails: true,
});
```

### **Frontend Integration**

```tsx
// File Upload Component
import { useFileUpload } from "@alkitu/files-react";

export const FileUploader = () => {
  const { upload, progress, error } = useFileUpload({
    maxSize: "10MB",
    acceptedTypes: ["image/*", "application/pdf"],
    onSuccess: (file) => console.log("Uploaded:", file),
    autoOptimize: true,
  });

  return (
    <div onDrop={upload} onDragOver={(e) => e.preventDefault()}>
      {progress && <ProgressBar value={progress} />}
      {error && <ErrorMessage message={error} />}
      Drop files here or click to upload
    </div>
  );
};
```

---

## 💰 11. Pricing Impact

### **Value Proposition for Template**

- **$10K+ saved**: En desarrollo de file management system
- **90% cost reduction**: CloudFlare R2 vs AWS S3
- **Global CDN included**: Sin costos adicionales
- **Production ready**: Desde día 1

### **Cost Comparison**

| Provider          | Storage (GB/month) | Egress (GB) | Total Monthly |
| ----------------- | ------------------ | ----------- | ------------- |
| **CloudFlare R2** | $0.015             | $0.00       | $15 (1TB)     |
| AWS S3            | $0.023             | $0.09       | $113 (1TB)    |
| Google Cloud      | $0.026             | $0.12       | $146 (1TB)    |

### **Template ROI**

- **Break-even**: 1-2 customers with file uploads
- **Development time saved**: 2-4 weeks
- **Ongoing maintenance**: Updates included
- **Scaling**: Ready for millions of files

---

## 🔒 12. Security & Compliance

### **Security Features**

- **File Type Validation**: Whitelist approach
- **Virus Scanning**: ClamAV integration
- **Access Controls**: User/role-based permissions
- **Secure URLs**: Time-limited signed URLs
- **Encryption**: At rest y in transit

### **Compliance**

- **GDPR**: Right to data deletion
- **CCPA**: Data export capabilities
- **SOC 2**: CloudFlare compliance inherited
- **File Retention**: Configurable policies

---

_El módulo de File Management & Storage con CloudFlare R2 es esencial para cualquier SaaS moderno. Proporciona una solución cost-effective, performante y escalable para manejar archivos de usuarios de forma profesional._
