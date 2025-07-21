# 🎨 Frontend Agent - Next.js UI Specialist

## 🎯 Role Definition

**Primary Responsibility**: Implementar y validar Design System Alkitu con testing completo, seguido de interfaces frontend para Products, User Groups, Tags y Chat System usando Next.js 15, tRPC, Tailwind CSS y Design System nativo.

**Duration**: 
- **Phase 1**: Design System Review & Testing (5 semanas) - **PRIORITY CRÍTICA**
- **Phase 2**: Feature Implementation (Días 16-20)

---

## 📋 Responsibilities

### **🚨 CRITICAL PRIORITY: Design System Validation**

**ANTES DE CUALQUIER DESARROLLO DE FEATURES:**

1. **Design System Component Review**: Revisar y validar 56 componentes existentes
2. **Testing Infrastructure**: Implementar testing completo (Unit, A11y, Theme, Mobile)
3. **Branding System**: Validar Storage → Database migration para themes
4. **Accessibility Compliance**: Lograr WCAG 2.1 AA en todos los componentes
5. **Performance Optimization**: Bundle size y loading optimization

### **Secondary: Core UI Implementation**

1. **Products Management UI**: Admin dashboard para gestión de productos
2. **User Groups Interface**: Sistema de grupos con permisos y membresías
3. **Tags Management**: Interfaz de etiquetado y categorización
4. **Public Chat Widget**: Widget público y dashboard administrativo
5. **Integration**: Integrar con APIs backend via tRPC

### **Deliverables**

#### **🚨 CRITICAL - Design System Validation (PRIORITY 1)**
- [ ] **Design System Testing**: 90%+ coverage para 56 componentes
- [ ] **Accessibility Compliance**: WCAG 2.1 AA para todos los componentes
- [ ] **Branding System**: Storage + Database integration
- [ ] **Performance Optimization**: Bundle < 500KB, Load < 1.5s
- [ ] **Component Documentation**: Testing guides y best practices

#### **Secondary - Feature Implementation (PRIORITY 2)**
- [ ] **Products Dashboard** (`packages/web/src/app/[lang]/(private)/dashboard/products/`)
- [ ] **Groups Management** (`packages/web/src/app/[lang]/(private)/dashboard/groups/`)
- [ ] **Tags Interface** (`packages/web/src/app/[lang]/(private)/dashboard/tags/`)
- [ ] **Chat System** (`packages/web/src/components/chat/`)
- [ ] **Public Chat Widget** (`packages/web/src/components/public/ChatWidget/`)
- [ ] **Shared Components** (`packages/web/src/components/shared/`)
- [ ] **Custom Hooks** (`packages/web/src/hooks/`)
- [ ] **Type Definitions** (TypeScript interfaces)

---

## 🛠️ Frontend Stack

### **Technologies**

- **Framework**: Next.js 15.3.4 (App Router)
- **Styling**: Tailwind CSS + Radix UI + Shadcn/ui
- **State Management**: React Query 5.81.5 + Zustand 5.0.6
- **Communication**: tRPC 11.4.3 + Socket.io 4.8.1
- **Forms**: React Hook Form 7.49.3 + Zod 3.22.4 validation
- **Testing**: Vitest + Testing Library + Playwright
- **Data Tables**: TanStack Table 8.16.0 (extensivo uso)
- **Animations**: Framer Motion 11.0.14
- **Internationalization**: Sistema de traducción completo (ES/EN)
- **Analytics**: Vercel Analytics + Speed Insights
- **File Upload**: Integración con servicios de storage

### **🎨 Design System (PRIORITY CRÍTICA)**

#### **Alkitu Native Design System**
- **Components**: 56 componentes nativos (Átomos → Templates)
- **Architecture**: Perfect Atomic Design implementation
- **Mobile-First**: Dedicated mobile components
- **Branding**: Dynamic branding system con database persistence
- **Testing**: 4-tier testing (Unit, A11y, Theme, Mobile)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Bundle optimized < 500KB

#### **Supporting Libraries**
- **Icons**: Lucide React icons (integrado)
- **Animations**: Framer Motion
- **Charts**: Recharts for analytics
- **Tables**: TanStack Table (componente nativo implementado)

### **Internationalization (i18n)**

- **Languages**: Español (ES) y English (EN)
- **Context**: TranslationContext personalizado
- **API**: `/api/translations` endpoint
- **Middleware**: `withI18nMiddleware` para routing
- **Components**: `LanguageSwitcher` y `LanguageSwitcherNavbar`
- **Storage**: Cookies para persistencia de idioma
- **Implementation**: Completamente funcional y extensible

---

## 🌍 Translation System (Completamente Implementado)

### **Architecture Overview**

El sistema de traducción está **completamente implementado** y funcional, soportando múltiples idiomas con routing automático y persistencia.

### **Core Components**

```typescript
// TranslationContext.tsx - Sistema completo de contexto
interface TranslationsContextType {
  t: (key: string, params?: Record<string, string | number>, namespace?: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isLoading: boolean;
}

// API Route para traducciones
// /api/translations endpoint dinámico
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang');
  // Carga archivos de traducción dinámicamente
}

// Middleware de i18n
// withI18nMiddleware - Routing automático por idioma
export function withI18nMiddleware(next: NextMiddleware): NextMiddleware {
  // Maneja redirecciones automáticas de idioma
  // Establece cookies de idioma
  // Valida locales soportados
}
```

### **Usage Examples**

```typescript
// En componentes
const t = useTranslations('notifications');
const title = t('title'); // Auto-namespace
const message = t('welcome', { name: 'Usuario' }, 'auth'); // Con parámetros

// En páginas
const HomePage = () => {
  const t = useTranslations();
  return <h1>{t('homepage.title')}</h1>;
};

// Language Switcher
const handleLanguageChange = (lang: 'es' | 'en') => {
  setLocale(lang); // Automáticamente actualiza URL y contexto
};
```

### **File Structure**

```
packages/web/src/
├── context/
│   └── TranslationContext.tsx          # Sistema completo de contexto
├── locales/
│   ├── en/
│   │   └── common.json                 # Traducciones EN
│   └── es/
│       └── common.json                 # Traducciones ES
├── middleware/
│   └── withI18nMiddleware.ts           # Middleware i18n
├── components/
│   ├── language-switcher.tsx           # Selector de idioma
│   └── language-switcher-navbar.tsx    # Selector para navbar
├── app/
│   ├── [lang]/                         # Rutas con idioma
│   └── api/
│       └── translations/
│           └── route.ts                # API endpoint
└── lib/
    └── getTranslations.ts              # Utilidades
```

### **Features Implemented**

- ✅ **Routing automático**: `/es/dashboard` y `/en/dashboard`
- ✅ **Persistencia**: Cookies para recordar idioma
- ✅ **API dinámica**: Carga traducciones bajo demanda
- ✅ **Interpolación**: Soporte para variables `{name}`
- ✅ **Namespaces**: Organización jerárquica de traducciones
- ✅ **Fallbacks**: Manejo de claves faltantes
- ✅ **SSR Compatible**: Funciona con Next.js App Router
- ✅ **Type Safety**: TypeScript interfaces

---

## 📐 Implementation Plan

### **🚨 PHASE 0: Design System Validation (CRITICAL - Weeks 1-5)**

**Status**: MUST COMPLETE BEFORE ANY FEATURE DEVELOPMENT

#### **Week 1: Infrastructure & Átomos Setup**
```yaml
Critical Actions:
  - Setup testing infrastructure (Vitest, @axe-core/react, Storybook)
  - Implement ApplicationBranding database schema
  - Review and test first 5 átomos (Typography, Button, Input, Icon, Badge)
  - Establish testing patterns and quality gates

Deliverables:
  - Testing infrastructure operational
  - Database schema deployed
  - 5 átomos with 90%+ test coverage
  - Performance baseline established
```

#### **Week 2: Átomos Completion**
```yaml
Critical Actions:
  - Complete all 13 átomos with full testing suite
  - Implement Storage-first branding enhancement
  - Validate mobile responsiveness
  - Establish performance monitoring

Deliverables:
  - 13/13 átomos with WCAG 2.1 AA compliance
  - Branding system enhanced (Storage + URL logos)
  - Mobile responsiveness validated
  - Performance metrics within targets
```

#### **Week 3: Moléculas & Database Integration**
```yaml
Critical Actions:
  - Complete all 8 moléculas with full testing
  - Implement Database integration for branding
  - Validate theme switching scenarios
  - Performance optimization round 1

Deliverables:
  - 8/8 moléculas with full test coverage
  - Database branding system operational
  - Theme switching fully functional
  - Bundle size within targets
```

#### **Week 4-5: Organismos & Final Validation**
```yaml
Critical Actions:
  - Complete all 16 organismos with testing
  - Final performance optimization
  - Comprehensive accessibility audit
  - Documentation updates

Deliverables:
  - 16/16 organismos validated
  - Performance targets achieved
  - WCAG 2.1 AA compliance verified
  - Complete documentation updated
```

**🎯 Success Criteria Before Feature Development:**
- [ ] ✅ 90%+ test coverage across all 56 components
- [ ] ✅ WCAG 2.1 AA compliance verified
- [ ] ✅ Branding system Storage + Database functional
- [ ] ✅ Performance targets met (< 500KB, < 1.5s)
- [ ] ✅ Mobile responsiveness validated

### **Phase 1: Products Management UI (Days 16-17) - POST Design System**

#### **Day 16: Products Dashboard Foundation**

```yaml
Morning:
  - Create products dashboard layout
  - Implement ProductList component with pagination
  - Create ProductCard and ProductTable components
  - Add search and filtering UI

Afternoon:
  - Implement CreateProductForm with validation
  - Create ProductCategories management
  - Add ProductPricing interface
  - Implement image upload for products

Deliverables:
  - Products listing with search/filter
  - Product creation and editing forms
  - Category management interface
  - Image upload functionality
```

#### **Day 17: Products Advanced Features**

```yaml
Morning:
  - Implement ProductVariants management
  - Create inventory tracking interface
  - Add bulk operations for products
  - Implement product import/export

Afternoon:
  - Create product analytics dashboard
  - Add SEO management for products
  - Implement product preview
  - Create product status workflow

Deliverables:
  - Advanced product management features
  - Analytics and reporting
  - SEO optimization interface
  - Bulk operations functionality
```

---

### **Phase 2: User Groups Interface (Day 18)**

#### **Day 18: Groups Management System**

```yaml
Morning:
  - Create groups dashboard layout
  - Implement GroupList with filtering
  - Create GroupCard and GroupDetails components
  - Add group creation and editing forms

Afternoon:
  - Implement GroupMembers management interface
  - Create role assignment and permissions UI
  - Add group invitation system
  - Implement group settings and configuration

Deliverables:
  - Complete groups management interface
  - Member management with roles
  - Permission assignment system
  - Group invitation and approval workflows
```

---

### **Phase 3: Tags System Interface (Day 19)**

#### **Day 19: Tags Management & Chat Widget**

```yaml
Morning:
  - Create tags management dashboard
  - Implement TagPicker component for all entities
  - Add tag creation and categorization
  - Create tag analytics and usage stats

Afternoon:
  - Implement public chat widget
  - Create ChatWindow and MessageBubble components
  - Add chat configuration interface
  - Implement real-time messaging with WebSocket

Deliverables:
  - Complete tags management system
  - Public chat widget
  - Chat admin dashboard
  - Real-time messaging interface
```

---

### **Phase 4: Integration & Polish (Day 20)**

#### **Day 20: Final Integration**

```yaml
Morning:
  - Integrate all systems with existing dashboard
  - Add navigation and routing
  - Implement global search across all entities
  - Add notifications for real-time events

Afternoon:
  - Performance optimization and lazy loading
  - Mobile responsiveness testing
  - Accessibility improvements
  - Final testing and bug fixes

Deliverables:
  - Fully integrated system
  - Mobile responsive design
  - Performance optimizations
  - Complete testing coverage
```

---

## 🚨 **DESIGN SYSTEM CRITICAL IMPLEMENTATION**

### **Component Testing Architecture (MANDATORY)**

```typescript
// Required structure for ALL components
components/atoms/ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx        // Unit & integration tests
├── ComponentName.a11y.test.tsx   // Accessibility tests  
├── ComponentName.theme.test.tsx  // Theme/branding tests
├── ComponentName.mobile.test.tsx // Mobile-specific tests
└── ComponentName.stories.tsx     // Storybook stories
```

### **Database Schema Implementation (CRITICAL)**

```prisma
// ApplicationBranding model - MUST IMPLEMENT
model ApplicationBranding {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  organizationId  String?  @db.ObjectId
  
  // Logo Configuration (URL-based)
  logoType        LogoType @default(TEXT)
  logoText        String?
  logoSvg         String?
  logoImageUrl    String?  // URL approach, no direct storage
  logoScale       Float    @default(1.0)
  
  // Color Theme
  primaryColor    String   @default("#007ee6")
  secondaryColor  String   @default("#6B7280")
  
  // Meta
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("application_branding")
}

enum LogoType {
  TEXT
  SVG
  IMAGE_URL
}
```

### **Quality Gates (MANDATORY per Component)**

```typescript
interface ComponentQualityGate {
  unitTestCoverage: number;     // REQUIRED: 90%+
  accessibilityScore: string;   // REQUIRED: WCAG 2.1 AA
  themeIntegration: boolean;    // REQUIRED: All scenarios pass
  mobileValidation: boolean;    // REQUIRED: Touch interactions work
  performanceImpact: string;    // REQUIRED: < 5KB bundle increase
}
```

## 🧩 Component Architecture (POST Design System Validation)

### **Products Components**

```typescript
// Products component structure
packages/web/src/app/[lang]/(private)/dashboard/products/
├── page.tsx                          # Main products page
├── create/
│   └── page.tsx                      # Create product page
├── [productId]/
│   ├── page.tsx                      # Product details page
│   └── edit/
│       └── page.tsx                  # Edit product page
└── components/
    ├── ProductList.tsx               # Product listing with pagination
    ├── ProductCard.tsx               # Product card component
    ├── ProductTable.tsx              # Table view for products
    ├── ProductForm.tsx               # Create/edit product form
    ├── ProductCategories.tsx         # Category management
    ├── ProductPricing.tsx            # Pricing management
    ├── ProductVariants.tsx           # Variants management
    ├── ProductInventory.tsx          # Inventory tracking
    ├── ProductImageUpload.tsx        # Image upload component
    ├── ProductSEO.tsx                # SEO settings
    ├── ProductAnalytics.tsx          # Product analytics
    └── ProductBulkActions.tsx        # Bulk operations
```

### **Component Implementation Examples**

#### **ProductList Component**

```typescript
'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProductListProps {
  initialFilters?: ProductFilters;
  view?: 'grid' | 'table';
}

export function ProductList({ initialFilters, view = 'grid' }: ProductListProps) {
  const [filters, setFilters] = useState(initialFilters || {});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 1 }) =>
      trpc.products.search.query({
        ...filters,
        page: pageParam,
        limit: 12
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  const products = data?.pages.flatMap(page => page.items) || [];

  return (
    <div className="space-y-6">
      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <ProductTable products={products} />
      )}

      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
```

#### **ProductForm Component**

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagPicker } from '@/components/shared/TagPicker';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { toast } from '@/components/ui/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'SERVICE', 'SUBSCRIPTION']),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).default('DRAFT'),
  trackInventory: z.boolean().default(false),
  stockQuantity: z.number().optional(),
  tagIds: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = trpc.products.categories.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId || '',
      basePrice: product.basePrice,
      type: product.type,
      status: product.status,
      trackInventory: product.trackInventory,
      stockQuantity: product.stockQuantity || 0,
      tagIds: product.tags?.map(tag => tag.id) || [],
      images: product.images?.map(img => img.url) || [],
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
    } : {
      name: '',
      description: '',
      basePrice: 0,
      type: 'PHYSICAL',
      status: 'DRAFT',
      trackInventory: false,
      tagIds: [],
      images: [],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                    <SelectItem value="DIGITAL">Digital</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagPicker
                  entityType="product"
                  selectedTags={field.value}
                  onTagsChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  images={field.value}
                  onImagesChange={field.onChange}
                  maxImages={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (product ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

### **User Groups Components**

```typescript
// Groups component structure
packages/web/src/app/[lang]/(private)/dashboard/groups/
├── page.tsx                          # Main groups page
├── create/
│   └── page.tsx                      # Create group page
├── [groupId]/
│   ├── page.tsx                      # Group details page
│   ├── members/
│   │   └── page.tsx                  # Group members page
│   └── settings/
│       └── page.tsx                  # Group settings page
└── components/
    ├── GroupList.tsx                 # Groups listing
    ├── GroupCard.tsx                 # Group card component
    ├── GroupForm.tsx                 # Create/edit group form
    ├── GroupMembers.tsx              # Members management
    ├── GroupPermissions.tsx          # Permissions management
    ├── GroupInvitations.tsx          # Invitation system
    ├── MemberRoleSelect.tsx          # Role assignment
    └── GroupAnalytics.tsx            # Group analytics
```

---

### **Tags System Components**

```typescript
// Tags component structure
packages/web/src/components/shared/
├── TagPicker.tsx                     # Universal tag picker
├── TagInput.tsx                      # Tag input with autocomplete
├── TagBadge.tsx                      # Tag display badge
├── TagCategory.tsx                   # Tag category management
└── TagAnalytics.tsx                  # Tag usage analytics

// Shared hook for tags
packages/web/src/hooks/
└── useTags.ts                        # Custom hook for tag operations
```

#### **TagPicker Implementation**

```typescript
'use client';

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface TagPickerProps {
  entityType: string;
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  maxTags?: number;
  allowCreate?: boolean;
}

export function TagPicker({
  entityType,
  selectedTags,
  onTagsChange,
  maxTags = 10,
  allowCreate = true
}: TagPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: allTags } = trpc.tags.search.useQuery(
    { query: debouncedSearch, limit: 20 },
    { enabled: debouncedSearch.length > 0 }
  );

  const { data: selectedTagsData } = trpc.tags.getByIds.useQuery(
    { ids: selectedTags },
    { enabled: selectedTags.length > 0 }
  );

  const createTagMutation = trpc.tags.create.useMutation({
    onSuccess: (newTag) => {
      onTagsChange([...selectedTags, newTag.id]);
      setSearchQuery('');
      setIsCreating(false);
    }
  });

  const addTag = useCallback((tagId: string) => {
    if (!selectedTags.includes(tagId) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagId]);
    }
  }, [selectedTags, onTagsChange, maxTags]);

  const removeTag = useCallback((tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  }, [selectedTags, onTagsChange]);

  const createNewTag = useCallback(async () => {
    if (searchQuery.trim() && allowCreate) {
      setIsCreating(true);
      await createTagMutation.mutateAsync({
        name: searchQuery.trim(),
        isPublic: true
      });
    }
  }, [searchQuery, allowCreate, createTagMutation]);

  const filteredTags = allTags?.filter(tag =>
    !selectedTags.includes(tag.id)
  ) || [];

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTagsData && selectedTagsData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagsData.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-sm">
              {tag.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-2">
        <Input
          placeholder="Search or create tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={selectedTags.length >= maxTags}
        />

        {/* Search Results */}
        {searchQuery && (
          <div className="border rounded-md max-h-40 overflow-y-auto">
            {filteredTags.length > 0 ? (
              <div className="p-2 space-y-1">
                {filteredTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addTag(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            ) : (
              allowCreate && searchQuery.trim() && (
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={createNewTag}
                    disabled={isCreating}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create "{searchQuery}"
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {selectedTags.length >= maxTags && (
        <p className="text-sm text-muted-foreground">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
}
```

---

### **Chat Widget Components**

```typescript
// Chat widget structure
packages/web/src/components/chat/
├── ChatWidget.tsx                    # Main widget container
├── ChatButton.tsx                    # Floating chat button
├── ChatWindow.tsx                    # Chat window interface
├── ChatHeader.tsx                    # Window header
├── MessageList.tsx                   # Messages display
├── MessageBubble.tsx                 # Individual message
├── MessageInput.tsx                  # Message input form
├── ContactForm.tsx                   # Initial contact form
├── ChatTypingIndicator.tsx           # Typing indicator
└── ChatSettings.tsx                  # Widget configuration

// Chat hooks
packages/web/src/hooks/
├── useChat.ts                        # Main chat functionality
├── useChatSocket.ts                  # WebSocket management
└── useChatWidget.ts                  # Widget state management
```

---

## 🧪 Testing Strategy (CRITICAL IMPLEMENTATION)

### **🚨 MANDATORY 4-Tier Testing per Component**

#### **1. Unit Tests (REQUIRED)**
```typescript
// Props validation, rendering, interactions
describe('ComponentName Unit Tests', () => {
  it('renders correctly with default props', () => {});
  it('handles all prop variations', () => {});
  it('responds to user interactions', () => {});
  it('maintains state correctly', () => {});
});
```

#### **2. Accessibility Tests (WCAG 2.1 AA REQUIRED)**
```typescript
// ARIA attributes, keyboard navigation, screen readers
import { axe, toHaveNoViolations } from 'jest-axe';

describe('ComponentName Accessibility', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('supports keyboard navigation', () => {});
  it('has proper ARIA attributes', () => {});
  it('works with screen readers', () => {});
});
```

#### **3. Theme Integration Tests (REQUIRED)**
```typescript
// Branding context integration, color application
describe('ComponentName Theme Integration', () => {
  it('applies branding colors correctly', () => {});
  it('handles theme switching', () => {});
  it('integrates with BrandingContext', () => {});
  it('fallback to defaults when no theme', () => {});
});
```

#### **4. Mobile Tests (REQUIRED)**
```typescript
// Touch interactions, responsive behavior
describe('ComponentName Mobile', () => {
  it('works on touch devices', () => {});
  it('adapts to mobile viewports', () => {});
  it('has proper touch targets', () => {});
  it('handles mobile-specific interactions', () => {});
});
```

### **Component Testing (POST Design System Validation)**

```typescript
// ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../ProductForm';
import { TRPCProvider } from '@/providers/TRPCProvider';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <TRPCProvider>
      {component}
    </TRPCProvider>
  );
};

describe('ProductForm', () => {
  it('should render form fields correctly', () => {
    renderWithProviders(<ProductForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/base price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderWithProviders(<ProductForm />);

    const submitButton = screen.getByText(/create/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const onSuccess = jest.fn();
    renderWithProviders(<ProductForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Product' }
    });
    fireEvent.change(screen.getByLabelText(/base price/i), {
      target: { value: '99.99' }
    });

    const submitButton = screen.getByText(/create/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## 🚀 Performance Optimizations

### **Code Splitting & Lazy Loading**

```typescript
// Lazy load heavy components
const ProductAnalytics = dynamic(() => import('./ProductAnalytics'), {
  loading: () => <div>Loading analytics...</div>,
  ssr: false
});

const ChatWidget = dynamic(() => import('./ChatWidget'), {
  loading: () => null,
  ssr: false
});

// Route-based code splitting is automatic with Next.js App Router
```

### **Optimistic Updates**

```typescript
// useOptimisticProducts hook
export function useOptimisticProducts() {
  const utils = trpc.useContext();

  const updateProduct = trpc.products.update.useMutation({
    onMutate: async (newData) => {
      await utils.products.search.cancel();

      const previousData = utils.products.search.getData();

      utils.products.search.setData(undefined, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === newData.id ? { ...item, ...newData } : item
          ),
        };
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      if (context?.previousData) {
        utils.products.search.setData(undefined, context.previousData);
      }
    },
    onSettled: () => {
      utils.products.search.invalidate();
    },
  });

  return { updateProduct };
}
```

---

## 📱 Mobile Responsiveness

### **Responsive Design Patterns**

```typescript
// Mobile-first responsive components
const ProductGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {/* Product cards */}
  </div>
);

// Mobile-optimized chat widget
const ChatWidget = () => (
  <div className="fixed bottom-4 right-4 z-50">
    <div className="hidden sm:block">
      <DesktopChatWindow />
    </div>
    <div className="block sm:hidden">
      <MobileChatWindow />
    </div>
  </div>
);
```

---

## 🎯 Success Metrics

### **🚨 CRITICAL - Design System Metrics (MUST ACHIEVE)**

#### **Component Quality (MANDATORY)**
- [ ] **Test Coverage**: 90%+ for all 56 components
- [ ] **Accessibility Compliance**: WCAG 2.1 AA for ALL components
- [ ] **Theme Integration**: 100% branding scenarios working
- [ ] **Mobile Validation**: Touch interactions on ALL components
- [ ] **Performance Impact**: < 5KB bundle increase per component

#### **System Performance (MANDATORY)**
- [ ] **Bundle Size**: < 500KB total (CRITICAL)
- [ ] **First Contentful Paint**: < 1.5s
- [ ] **Accessibility Score**: 95%+ overall
- [ ] **Mobile Responsiveness**: 100% components mobile-ready

#### **Branding System (MANDATORY)**
- [ ] **Storage Integration**: LocalStorage + URL logos working
- [ ] **Database Integration**: ApplicationBranding model operational
- [ ] **Theme Switching**: Real-time updates across all components
- [ ] **Multi-tenant Support**: Organization-based branding

### **Secondary - Feature Implementation Metrics**

#### **Performance Metrics**
- [ ] **Largest Contentful Paint**: < 2.5s
- [ ] **Cumulative Layout Shift**: < 0.1
- [ ] **First Input Delay**: < 100ms

#### **User Experience Metrics**
- [ ] **Form Validation**: Real-time feedback
- [ ] **Loading States**: All async operations covered
- [ ] **Error Handling**: Graceful error boundaries

---

---

## 🚨 **CRITICAL IMPLEMENTATION ORDER**

### **MANDATORY SEQUENCE:**

1. **WEEK 1-5: DESIGN SYSTEM VALIDATION** ⭐ **CRITICAL PRIORITY**
   - Component testing implementation
   - Accessibility compliance (WCAG 2.1 AA)
   - Branding system Storage → Database
   - Performance optimization
   - Mobile responsiveness validation

2. **WEEK 6+: FEATURE DEVELOPMENT** (Only after Design System validation)
   - Products Management UI
   - User Groups Interface
   - Tags Management
   - Chat System
   - API Integration

### **🚫 PROHIBITIONS:**
- **NO feature development** until Design System validation complete
- **NO skipping** accessibility testing
- **NO breaking changes** without comprehensive testing
- **NO performance regressions** allowed

### **✅ SUCCESS DEFINITION:**
Design System validation is **COMPLETE** only when:
- [ ] All 56 components have 90%+ test coverage
- [ ] WCAG 2.1 AA compliance verified
- [ ] Branding system Storage + Database operational
- [ ] Performance targets achieved
- [ ] Mobile responsiveness validated

**Frontend Agent está diseñado para validar y optimizar el Design System Alkitu antes de crear nuevas interfaces, garantizando una base sólida, accesible y performante para todo el desarrollo frontend.**
