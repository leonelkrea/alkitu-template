# 🛠️ Sistema de Configuración Dinámico - Requisitos y Tickets

## 🎯 **Objetivo**
Crear un sistema de configuración flexible que permita ajustar comportamientos de la aplicación sin necesidad de redeploy, con gestión visual desde el admin panel.

## 🎫 **Tickets de Desarrollo - Orden de Complejidad**

### **TICKET #1: Variables CSS Configurables (Themes)**
**Type**: Feature | **Priority**: High | **Estimation**: 2 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐ Easy

**Description**: Implementar sistema básico de CSS variables que permita cambiar colores y tipografías dinámicamente.

**Technical Tasks**:
- [ ] Crear archivo `globals.css` con CSS custom properties
- [ ] Definir variables para colores primarios, secundarios y tipografías
- [ ] Crear componente `ThemeProvider` en React
- [ ] Implementar switch básico entre theme claro/oscuro
- [ ] Guardar preferencia de theme en localStorage
- [ ] Aplicar theme automáticamente al cargar la app

**Files to create/modify**:
```
packages/web/src/styles/themes.css
packages/web/src/components/providers/ThemeProvider.tsx
packages/web/src/hooks/useTheme.ts
packages/web/src/components/shared/ThemeToggle.tsx
```

**Validation Criteria**:
- Usuario puede cambiar entre theme claro/oscuro
- Cambios se aplican inmediatamente
- Preferencia persiste en recargas

---

### **TICKET #2: Modelo de Configuración en Base de Datos**
**Type**: Feature | **Priority**: High | **Estimation**: 1 day | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐ Easy-Medium

**Description**: Crear modelo de datos para almacenar configuraciones dinámicas del sistema.

**Technical Tasks**:
- [ ] Crear modelo `SystemConfig` en Prisma schema
- [ ] Añadir campos: key, value, type, module, description
- [ ] Crear migration para la nueva tabla
- [ ] Implementar service básico `ConfigService`
- [ ] Crear endpoints tRPC para GET/SET config
- [ ] Añadir seeds con configuraciones por defecto

**Schema Structure**:
```typescript
// This model is NOT implemented in the current schema.prisma.
model SystemConfig {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  key         String     @unique
  value       Json
  type        ConfigType // STRING, NUMBER, BOOLEAN, JSON, COLOR
  module      String     // "theme", "email", "notifications", etc.
  description String?
  isPublic    Boolean    @default(false) // Si es accesible desde frontend
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum ConfigType {
  STRING
  NUMBER
  BOOLEAN
  JSON
  COLOR
  FILE
}
```

**Validation Criteria**:
- Modelo se crea correctamente en BD
- Service básico funciona para GET/SET
- Seeds cargan configuraciones iniciales

---

### **TICKET #3: Hook de Configuración en Frontend**
**Type**: Feature | **Priority**: High | **Estimation**: 1 day | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐ Easy-Medium

**Description**: Crear hook React para acceder a configuraciones dinámicas desde cualquier componente.

**Technical Tasks**:
- [ ] Crear hook `useConfig(key)` y `useConfigs(module)`
- [ ] Implementar cache local con React Query
- [ ] Crear provider `ConfigProvider` para cargar configs iniciales
- [ ] Añadir tipos TypeScript para configuraciones
- [ ] Implementar invalidación de cache automática
- [ ] Crear util para valores por defecto

**Files to create**:
```
packages/web/src/hooks/useConfig.ts
packages/web/src/providers/ConfigProvider.tsx
packages/web/src/types/config.ts
packages/web/src/utils/config.ts
```

**Usage Example**:
```typescript
const { data: appName } = useConfig('app.name');
const { data: themeConfigs } = useConfigs('theme');
```

**Validation Criteria**:
- Hook funciona desde cualquier componente
- Cache mejora performance
- Tipos TypeScript son seguros

---

### **TICKET #4: Panel de Configuración Básico**
**Type**: Feature | **Priority**: High | **Estimation**: 3 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐⭐ Medium

**Description**: Crear interfaz administrativa básica para editar configuraciones del sistema.

**Technical Tasks**:
- [ ] Crear página `/dashboard/settings/system`
- [ ] Implementar formulario dinámico según tipo de config
- [ ] Añadir componentes por tipo: ColorPicker, Switch, Input, etc.
- [ ] Implementar validación por tipo de configuración
- [ ] Añadir búsqueda y filtros por módulo
- [ ] Implementar guardado optimista con rollback

**Components to create**:
```
packages/web/src/app/[lang]/(private)/dashboard/settings/system/page.tsx
packages/web/src/components/admin/ConfigEditor.tsx
packages/web/src/components/admin/ConfigForm.tsx
packages/web/src/components/admin/ConfigInput.tsx
packages/web/src/components/admin/ColorPicker.tsx
```

**Validation Criteria**:
- Admin puede editar cualquier configuración
- Validación funciona según tipo
- Cambios se reflejan inmediatamente

---

### **TICKET #5: Customización Visual Avanzada (Branding)**
**Type**: Feature | **Priority**: Medium | **Estimation**: 4 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐⭐⭐ Medium-High

**Description**: Implementar sistema completo de branding con subida de logos y customización visual avanzada.

**Technical Tasks**:
- [ ] Crear módulo de file upload para logos
- [ ] Implementar preview en tiempo real de cambios
- [ ] Añadir configuraciones para spacing, border-radius, etc.
- [ ] Crear generador automático de CSS variables
- [ ] Implementar sistema de themes predefinidos
- [ ] Añadir export/import de configuraciones de branding

**Branding Configurations**:
- Logo principal y favicon
- Paleta de colores completa (primario, secundario, accent, etc.)
- Tipografías (familia, tamaños, pesos)
- Espaciados y border-radius
- Configuración de layout (sidebar, header)

**Validation Criteria**:
- Upload de logos funciona correctamente
- Preview en tiempo real es preciso
- Themes predefinidos se aplican correctamente
- Export/import de configuraciones funciona

---

### **TICKET #6: Sistema de Feature Flags**
**Type**: Feature | **Priority**: Medium | **Estimation**: 3 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐⭐⭐ Medium-High

**Description**: Implementar sistema de feature flags para habilitar/deshabilitar funcionalidades dinámicamente.

**Technical Tasks**:
- [ ] Extender modelo `SystemConfig` para feature flags
- [ ] Crear hook `useFeature(flagName)`
- [ ] Implementar componente `<FeatureFlag>`
- [ ] Añadir middleware para validar features en rutas
- [ ] Crear panel admin para gestionar features
- [ ] Implementar sistema de dependencias entre features

**Usage Example**:
```typescript
// This feature flag system is NOT implemented.
const { enabled: notificationsEnabled } = useFeature('notifications');

<FeatureFlag feature="billing">
  <BillingModule />
</FeatureFlag>
```

**Validation Criteria**:
- Features se pueden habilitar/deshabilitar sin redeploy
- Componentes respetan feature flags
- Rutas protegidas funcionan correctamente
- Dependencias entre features se respetan

---

### **TICKET #7: Variables de Entorno por Módulo**
**Type**: Feature | **Priority**: Medium | **Estimation**: 3 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐⭐⭐ Medium-High

**Description**: Crear sistema que permita gestionar variables de entorno organizadas por módulos desde la interfaz.

**Technical Tasks**:
- [ ] Crear modelo `EnvironmentVariable` separado de `SystemConfig`
- [ ] Implementar encriptación para variables sensibles
- [ ] Crear interfaz para gestión de env vars por módulo
- [ ] Añadir validación y tipos por variable
- [ ] Implementar sistema de override (dev/staging/prod)
- [ ] Crear CLI para sync con archivos .env

**Schema Structure**:
```typescript
// This model is NOT implemented in the current schema.prisma.
model EnvironmentVariable {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  key         String
  value       String   // Encriptado si es sensible
  module      String
  environment String   // "development", "staging", "production"
  isSensitive Boolean  @default(false)
  description String?
  
  @@unique([key, environment])
}
```

**Validation Criteria**:
- Variables se organizan por módulo correctamente
- Encriptación funciona para datos sensibles
- Override por ambiente funciona
- CLI sync mantiene archivos .env actualizados

---

### **TICKET #8: Arquitectura Modular Plug-and-Play**
**Type**: Architecture | **Priority**: High | **Estimation**: 7 days | **Status**: ❌ Not Implemented
**Complexity**: ⭐⭐⭐⭐⭐ Very High

**Description**: Refactorizar la aplicación hacia una arquitectura completamente modular donde cada funcionalidad sea un módulo independiente.

**Technical Tasks**:
- [ ] Crear interface base `Module` con métodos estándar
- [ ] Refactorizar funcionalidades existentes como módulos
- [ ] Implementar sistema de registro de módulos
- [ ] Crear sistema de dependencias entre módulos
- [ ] Implementar lazy loading de módulos
- [ ] Crear CLI para generar nuevos módulos
- [ ] Añadir hot-reload para desarrollo de módulos

**Module Structure**:
```typescript
// This modular architecture is NOT implemented.
interface Module {
  name: string;
  version: string;
  dependencies: string[];
  routes: Route[];
  components: ComponentRegistry;
  services: ServiceRegistry;
  migrations: Migration[];
  
  install(): Promise<void>;
  uninstall(): Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
}
```

**Initial Modules**:
- UserManagementModule
- NotificationModule
- BillingModule
- AuthModule
- FileUploadModule

**Validation Criteria**:
- Módulos se pueden habilitar/deshabilitar dinámicamente
- Sistema de dependencias funciona correctamente
- Lazy loading mejora performance inicial
- CLI genera módulos válidos automáticamente
- Hot-reload funciona en desarrollo

## 📊 **Summary of Estimations**

| Ticket | Complexity | Estimation | Priority |
|--------|-------------|------------|-----------|
| #1 | ⭐ | 2 days | High |
| #2 | ⭐⭐ | 1 day | High |
| #3 | ⭐⭐ | 1 day | High |
| #4 | ⭐⭐⭐ | 3 days | High |
| #5 | ⭐⭐⭐⭐ | 4 days | Medium |
| #6 | ⭐⭐⭐⭐ | 3 days | Medium |
| #7 | ⭐⭐⭐⭐ | 3 days | Medium |
| #8 | ⭐⭐⭐⭐⭐ | 7 days | High |

**Total**: 24 days

## 🚀 **Implementation Plan**

### **Phase 1: Foundation (1 week)**
- TICKET #1: CSS Variables
- TICKET #2: Database Model
- TICKET #3: Frontend Hook

### **Phase 2: Basic Interface (1 week)**
- TICKET #4: Configuration Panel

### **Phase 3: Advanced Features (2 weeks)**
- TICKET #5: Advanced Branding
- TICKET #6: Feature Flags
- TICKET #7: Environment Variables

### **Phase 4: Modular Architecture (1.5 weeks)**
- TICKET #8: Plug-and-Play System

## 📝 **Dependencies**

```
#1 (CSS Variables) ← #5 (Branding)
#2 (Database Model) ← #3 (Hook) ← #4 (Panel) ← #6 (Feature Flags)
#2 (Database Model) ← #7 (Env Variables)
All ← #8 (Modular Architecture)
```