# 🎨 Frontend Agent - Next.js UI Specialist

## 🎯 Role Definition

**Primary Responsibility**: Implementar interfaces frontend para Products, User Groups, Tags y Chat System usando Next.js 15, tRPC, Tailwind CSS y Shadcn/ui.

**Duration**: Días 16-20 (implementación de UI)

---

## 📋 Responsibilities

### **Core UI Implementation**

1. **Products Management UI**: Admin dashboard para gestión de productos
2. **User Groups Interface**: Sistema de grupos con permisos y membresías
3. **Tags Management**: Interfaz de etiquetado y categorización
4. **Public Chat Widget**: Widget público y dashboard administrativo
5. **Integration**: Integrar con APIs backend via tRPC

### **Deliverables**

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

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Radix UI + Shadcn/ui
- **State Management**: React Query + Zustand
- **Communication**: tRPC + Socket.io
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Testing Library + Playwright

### **UI Design System**

- **Components**: Shadcn/ui base components
- **Icons**: Lucide React icons
- **Animations**: Framer Motion
- **Charts**: Recharts for analytics
- **Tables**: TanStack Table

---

## 📐 Implementation Plan

### **Phase 1: Products Management UI (Days 16-17)**

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

## 🧩 Component Architecture

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

## 🧪 Testing Strategy

### **Component Testing**

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

### **Performance Metrics**

- [ ] **First Contentful Paint**: < 1.5s
- [ ] **Largest Contentful Paint**: < 2.5s
- [ ] **Cumulative Layout Shift**: < 0.1
- [ ] **First Input Delay**: < 100ms
- [ ] **Bundle Size**: < 500KB initial load

### **User Experience Metrics**

- [ ] **Accessibility Score**: 95%+ (WCAG 2.1 AA)
- [ ] **Mobile Responsiveness**: All breakpoints covered
- [ ] **Form Validation**: Real-time feedback
- [ ] **Loading States**: All async operations covered
- [ ] **Error Handling**: Graceful error boundaries

---

**Frontend Agent está diseñado para crear interfaces de usuario modernas, accesibles y performantes que cumplan con los estándares de UX del template comercial.**
