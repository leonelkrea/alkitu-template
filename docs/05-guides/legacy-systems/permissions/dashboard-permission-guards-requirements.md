# 🛡️ Sistema de Guards y Permisos del Dashboard - Requisitos y Tickets

## 🎯 **Objetivo**
Crear un sistema robusto de guards y control de permisos que delimite los accesos y funcionalidades disponibles para diferentes niveles de usuarios dentro del dashboard administrativo.

## 🎯 **Requisitos Funcionales**

### **R1: Jerarquía de Roles y Permisos**
**Priority**: High
**Description**: Definir una estructura clara de roles con permisos granulares y heredables.

**Acceptance Criteria**:
- ❌ Roles jerárquicos con herencia de permisos (Current implementation uses flat `UserRole` enum).
- ❌ Permisos granulares por recurso y acción (Current implementation is role-based, not granular `resource:action:scope`).
- ❌ Sistema de permissions composables (Not implemented).
- ❌ Roles personalizables desde interfaz admin (Roles are hardcoded enums).
- ❌ Validación que siempre exista al menos un SUPER_ADMIN (Not implemented).
- ❌ Audit trail de cambios de permisos (Not implemented).

### **R2: Guards de Rutas del Dashboard**
**Priority**: High
**Description**: Proteger rutas específicas del dashboard según roles y permisos del usuario.

**Acceptance Criteria**:
- ✅ Guard principal que valida acceso al dashboard (Implemented via `JwtAuthGuard` and `RolesGuard`).
- ✅ Guards granulares por sección/página específica (Implemented via `RolesGuard` with `@Roles` decorator, but based on `UserRole` enum, not granular permissions).
- ⚠️ Redirección automática a página autorizada más alta (Frontend responsibility, not directly implemented in backend guards).
- ⚠️ Mensaje claro cuando acceso es denegado (Frontend responsibility).
- ⚠️ Loading states durante validación de permisos (Frontend responsibility).
- ⚠️ Fallback para casos de error en validación (Frontend responsibility).

### **R3: Componentes Condicionales**
**Priority**: High
**Description**: Mostrar/ocultar elementos de UI basado en permisos del usuario actual.

**Acceptance Criteria**:
- ❌ Componente `<PermissionGate>` para envolver elementos (Not implemented, depends on granular permissions).
- ❌ Hook `usePermissions()` para checks programáticos (Not implemented, depends on granular permissions).
- ❌ Navegación dinámica según permisos disponibles (Frontend responsibility, depends on granular permissions).
- ❌ Botones/acciones deshabilitados sin permisos (Frontend responsibility, depends on granular permissions).
- ❌ Menús adaptativos al rol del usuario (Frontend responsibility, could be implemented with existing roles).
- ❌ Performance optimizada con memoización (Frontend responsibility).

### **R4: Middleware de Validación API**
**Priority**: High
**Description**: Validar permisos en backend antes de ejecutar operaciones sensibles.

**Acceptance Criteria**:
- ✅ Decorator `@RequirePermission()` para endpoints (Implemented via `@Roles()` decorator, but for roles, not granular permissions).
- ✅ Middleware automático en controladores protegidos (Implemented via `RolesGuard`).
- ❌ Validación de permisos en tRPC procedures (Not explicitly found for granular permissions).
- ❌ Rate limiting adicional por rol (Not implemented).
- ❌ Logs detallados de intentos no autorizados (Not implemented).
- ✅ Respuestas HTTP apropiadas (403, 401) (Handled by NestJS guards).

### **R5: Gestión Visual de Permisos**
**Priority**: Medium
**Description**: Interfaz administrativa para gestionar roles y permisos de usuarios.

**Acceptance Criteria**:
- ❌ Página `/dashboard/settings/permissions` (Not implemented).
- ❌ Editor visual de roles y permisos (Not implemented).
- ❌ Asignación masiva de permisos por rol (Not implemented).
- ❌ Vista previa de capacidades por rol (Not implemented).
- ❌ Búsqueda y filtrado de usuarios por permisos (Not implemented).
- ❌ Historial de cambios en permisos (Not implemented).

### **R6: Sesiones y Contexto de Permisos**
**Priority**: Medium
**Description**: Gestionar contexto de permisos del usuario actual de forma eficiente.

**Acceptance Criteria**:
- ⚠️ Cache de permisos en sesión del usuario (JWT token contains user role, but no granular permissions).
- ⚠️ Invalidación automática tras cambios de rol (Role changes require new token, but no explicit invalidation for granular permissions).
- ⚠️ Refresh de permisos sin logout/login (Not explicitly handled for granular permissions).
- ⚠️ Contexto compartido en toda la aplicación (Frontend responsibility).
- ⚠️ Persistencia durante navegación SPA (Frontend responsibility).
- ⚠️ Limpieza automática al hacer logout (Handled by JWT token expiration).

## 🎯 **Requisitos No Funcionales**

### **RNF1: Performance**
- Validación de permisos < 50ms (Role-based validation is fast).
- Cache de permisos para evitar queries repetitivas (Role is in JWT, no separate permission queries).
- Lazy loading de definiciones de permisos (Not applicable for current role-based system).
- Optimización de queries con índices apropiados (Prisma queries are optimized).

### **RNF2: Seguridad**
- Validación doble: frontend + backend (Backend validation is present, frontend validation depends on implementation).
- Encriptación de tokens de permisos sensibles (JWT token is encrypted).
- Rate limiting por usuario y rol (Not implemented).
- Audit logs completos de accesos (Not implemented).

### **RNF3: Usabilidad**
- Mensajes claros de acceso denegado.
- Redirección inteligente a áreas autorizadas.
- Indicadores visuales de permisos limitados.
- Ayuda contextual sobre permisos requeridos.

### **RNF4: Escalabilidad**
- Soporte para 1000+ usuarios con roles diferentes (Current RBAC scales well).
- Sistema de permisos extensible para nuevos módulos (Extensibility for granular permissions is limited).
- Cache distribuido para aplicaciones multi-instancia (Not implemented).
- Cleanup automático de permisos obsoletos (Not applicable for current RBAC).

## 📊 **Estructura de Roles y Permisos**

### **Jerarquía de Roles**
```typescript
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',     // Acceso total al sistema
  ADMIN = 'ADMIN',                 // Gestión completa excepto super-admin functions
  MANAGER = 'MANAGER',             // Gestión de equipo y reportes
  EMPLOYEE = 'EMPLOYEE',           // Acceso limitado a funciones operativas
  CLIENT = 'CLIENT',               // Acceso muy limitado, principalmente lectura
  VIEWER = 'VIEWER'                // Solo lectura en áreas específicas
}
```

### **Permisos por Recurso**
```typescript
// This granular permission structure is NOT implemented in the current backend.
// The system relies on UserRole enum for access control.
interface Permission {
  resource: string;    // 'users', 'notifications', 'billing', etc.
  action: string;      // 'create', 'read', 'update', 'delete', 'manage'
  scope?: string;      // 'own', 'team', 'all'
}

// Ejemplos:
const permissions = [
  { resource: 'users', action: 'read', scope: 'all' },
  { resource: 'users', action: 'update', scope: 'own' },
  { resource: 'billing', action: 'manage', scope: 'all' },
  { resource: 'notifications', action: 'create', scope: 'team' },
  { resource: 'settings', action: 'read', scope: 'all' },
  { resource: 'analytics', action: 'read', scope: 'own' }
];
```

### **Matrix de Permisos por Rol**
| Recurso | SUPER_ADMIN | ADMIN | MANAGER | EMPLOYEE | CLIENT | VIEWER |
|---------|-------------|-------|---------|----------|--------|--------|
| **Usuarios** | ✅ Manage All | ✅ CRUD All | ✅ Read All | ❌ Read Own | ❌ Read Own | ❌ None |
| **Notificaciones** | ✅ Manage All | ✅ CRUD All | ✅ CRUD Team | ✅ Read Own | ❌ Read Own | ❌ Read Own |
| **Billing** | ✅ Manage All | ✅ CRUD All | ✅ Read All | ❌ None | ❌ Read Own | ❌ Read Own |
| **Configuración** | ✅ Manage All | ✅ CRUD Limited | ❌ Read All | ❌ None | ❌ None | ❌ None |
| **Analytics** | ✅ Read All | ✅ Read All | ✅ Read Team | ✅ Read Own | ❌ Read Own | ❌ Read Own |
| **Chatbot** | ✅ Manage All | ✅ CRUD All | ✅ CRUD All | ✅ Reply Only | ❌ None | ❌ Read Only |

## 🎫 **Development Tickets**

### **TICKET #1: Modelos de Base de Datos para Permisos**
**Type**: Feature | **Priority**: High | **Estimation**: 2 days | **Status**: ❌ Not Implemented

**Description**: Crear modelos robustos para gestionar roles, permisos y asignaciones de usuarios.

**Technical Tasks**:
- [ ] Extender modelo `User` con relaciones de roles
- [ ] Crear modelo `Role` con permisos embebidos
- [ ] Crear modelo `Permission` para definiciones granulares
- [ ] Crear modelo `UserRole` para asignaciones temporales
- [ ] Crear modelo `PermissionAudit` para tracking
- [ ] Añadir migrations y seeds iniciales

**Schema Structure**:
```typescript
// These models are NOT implemented in the current schema.prisma.
// The system uses a simpler UserRole enum for access control.
model User {
  id                String              @id @default(auto()) @map("_id") @db.ObjectId
  // ... campos existentes
  role              UserRole            @default(CLIENT)
  additionalRoles   UserRoleAssignment[]
  customPermissions Permission[]        @relation("UserCustomPermissions")
  permissionAudits  PermissionAudit[]
}

model Role {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String       @unique
  slug        String       @unique  // 'super-admin', 'admin', etc.
  description String?
  isSystem    Boolean      @default(false)  // No editable
  permissions Permission[]
  inheritFrom String?      @db.ObjectId     // Role padre
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Permission {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  resource    String   // 'users', 'notifications', etc.
  action      String   // 'create', 'read', 'update', 'delete', 'manage'
  scope       String?  // 'own', 'team', 'all'
  conditions  Json?    // Condiciones adicionales
  roles       Role[]   @relation("RolePermissions")
  users       User[]   @relation("UserCustomPermissions")
  createdAt   DateTime @default(now())
  
  @@unique([resource, action, scope])
}

model UserRoleAssignment {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String    @db.ObjectId
  role      Role      @relation(fields: [roleId], references: [id], onDelete: Cascade)
  roleId    String    @db.ObjectId
  expiresAt DateTime?
  assignedBy String   @db.ObjectId
  createdAt DateTime  @default(now())
  
  @@unique([userId, roleId])
}

model PermissionAudit {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  user       User     @relation(fields: [userId], references: [id])
  userId     String   @db.ObjectId
  action     String   // 'role_assigned', 'permission_granted', etc.
  oldValue   Json?
  newValue   Json?
  performedBy String  @db.ObjectId
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
}
```

**Validation Criteria**:
- Modelos soportan herencia de roles
- Permisos granulares funcionan correctamente
- Audit trail registra todos los cambios
- Queries están optimizadas con índices

---

### **TICKET #2: Servicio de Gestión de Permisos Backend**
**Type**: Feature | **Priority**: High | **Estimation**: 3 days | **Status**: ❌ Not Implemented

**Description**: Implementar lógica de negocio para validación y gestión de permisos en el backend.

**Technical Tasks**:
- [ ] Crear `PermissionService` con lógica de validación
- [ ] Implementar `RoleService` para gestión de roles
- [ ] Crear decorators para proteger endpoints
- [ ] Implementar middleware de autorización
- [ ] Añadir cache de permisos en memoria
- [ ] Crear utilities para checks complejos

**Services to create**:
```typescript
// These services are NOT implemented in the current backend.
// Access control is handled by RolesGuard based on UserRole enum.
@Injectable()
export class PermissionService {
  async hasPermission(userId: string, resource: string, action: string, scope?: string): Promise<boolean>
  async getUserPermissions(userId: string): Promise<Permission[]>
  async getUserRoles(userId: string): Promise<Role[]>
  async grantPermission(userId: string, permission: Permission): Promise<void>
  async revokePermission(userId: string, permission: Permission): Promise<void>
  async assignRole(userId: string, roleId: string, expiresAt?: Date): Promise<void>
  async removeRole(userId: string, roleId: string): Promise<void>
  
  // Cache management
  async invalidateUserPermissions(userId: string): Promise<void>
  async refreshUserPermissions(userId: string): Promise<void>
}

@Injectable()
export class RoleService {
  async createRole(data: CreateRoleDto): Promise<Role>
  async updateRole(id: string, data: UpdateRoleDto): Promise<Role>
  async deleteRole(id: string): Promise<void>
  async getRoleHierarchy(): Promise<Role[]>
  async getRolePermissions(roleId: string): Promise<Permission[]>
}
```

**Decorators to create**:
```typescript
// @RequirePermission() and @RequireAnyPermission() are NOT implemented.
// The system uses @Roles() decorator for role-based access control.
@RequirePermission('users', 'read')
@Get('users')
async getUsers() { ... }

@RequireRole('ADMIN')
@Post('admin/settings')
async updateSettings() { ... }

@RequireAnyPermission([
  { resource: 'billing', action: 'read' },
  { resource: 'analytics', action: 'read' }
])
@Get('dashboard')
async getDashboard() { ... }
```

**Validation Criteria**:
- Validación de permisos es rápida y precisa
- Cache mejora performance significativamente
- Decorators simplifican protección de endpoints
- Audit logs registran todos los accesos

---

### **TICKET #3: Guards de Frontend y Hooks de Permisos**
**Type**: Feature | **Priority**: High | **Estimation**: 3 days | **Status**: ❌ Not Implemented

**Description**: Implementar sistema de guards para proteger rutas y hooks para validación de permisos en componentes.

**Technical Tasks**:
- [ ] Crear `DashboardGuard` principal
- [ ] Implementar guards específicos por sección
- [ ] Crear hook `usePermissions()`
- [ ] Implementar hook `useRole()`
- [ ] Crear componente `<PermissionGate>`
- [ ] Añadir context provider para permisos
- [ ] Implementar cache local de permisos

**Guards to create**:
```typescript
// These frontend guards and hooks are NOT implemented for granular permissions.
// Frontend access control would rely on the backend's role-based system.
export const DashboardGuard: FC<PropsWithChildren> = ({ children }) => {
  const { hasAnyDashboardAccess, loading } = usePermissions();
  
  if (loading) return <LoadingSpinner />;
  if (!hasAnyDashboardAccess) return <AccessDenied />;
  
  return <>{children}</>;
};

export const AdminGuard: FC<PropsWithChildren> = ({ children }) => {
  const { hasRole } = useRole();
  
  if (!hasRole(['ADMIN', 'SUPER_ADMIN'])) {
    return <AccessDenied requiredRole="Admin" />;
  }
  
  return <>{children}</>;
};

// Component-level Guards
export const PermissionGate: FC<{
  resource: string;
  action: string;
  scope?: string;
  fallback?: ReactNode;
  children: ReactNode;
}> = ({ resource, action, scope, fallback, children }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(resource, action, scope)) {
    return fallback || null;
  }
  
  return <>{children}</>;
};
```

**Hooks to create**:
```typescript
// These hooks are NOT implemented for granular permissions.
// A basic useRole hook could be implemented based on the existing UserRole enum.
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const hasPermission = useCallback((resource: string, action: string, scope?: string) => {
    return permissions.some(p => 
      p.resource === resource && 
      p.action === action && 
      (!scope || p.scope === scope)
    );
  }, [permissions]);
  
  const hasAnyPermission = useCallback((perms: Permission[]) => {
    return perms.some(p => hasPermission(p.resource, p.action, p.scope));
  }, [hasPermission]);
  
  return { permissions, hasPermission, hasAnyPermission, loading };
};

export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = useCallback((roles: string | string[]) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user?.role || '');
  }, [user?.role]);
  
  const isAdmin = hasRole(['ADMIN', 'SUPER_ADMIN']);
  const isSuperAdmin = hasRole('SUPER_ADMIN');
  
  return { hasRole, isAdmin, isSuperAdmin, currentRole: user?.role };
};
```

**Validation Criteria**:
- Guards protegen rutas apropiadamente
- Hooks son performantes y no causan re-renders excesivos
- PermissionGate funciona en todos los casos de uso
- Cache local reduce llamadas al backend

---

### **TICKET #4: Navegación Dinámica basada en Permisos**
**Type**: Feature | **Priority**: High | **Estimation**: 2 days | **Status**: ❌ Not Implemented

**Description**: Adaptar la navegación del dashboard para mostrar solo elementos accesibles por el usuario actual.

**Technical Tasks**:
- [ ] Modificar `AppSidebar` para filtrar por permisos
- [ ] Actualizar `TopNavigation` con elementos dinámicos
- [ ] Crear configuración declarativa de menús
- [ ] Implementar badges de acceso limitado
- [ ] Añadir tooltips explicativos para elementos restringidos
- [ ] Optimizar rendering de navegación

**Navigation Configuration**:
```typescript
// This dynamic navigation based on granular permissions is NOT implemented.
// Navigation would rely on the existing UserRole enum.
interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  children?: NavigationItem[];
  isAlwaysVisible?: boolean;
}

const navigationConfig: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    isAlwaysVisible: true
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: 'Users',
    requiredPermissions: [{ resource: 'users', action: 'read' }]
  },
  {
    label: 'Messages',
    href: '/dashboard/messages',
    icon: 'MessageCircle',
    requiredPermissions: [{ resource: 'chatbot', action: 'read' }]
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: 'Settings',
    requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      {
        label: 'System Config',
        href: '/dashboard/settings/system',
        requiredRoles: ['SUPER_ADMIN']
      },
      {
        label: 'Permissions',
        href: '/dashboard/settings/permissions',
        requiredPermissions: [{ resource: 'permissions', action: 'manage' }]
      }
    ]
  }
];
```

**Components to update**:
```
packages/web/src/components/app-sidebar.tsx
packages/web/src/components/layout/top-app-navigation-menu.tsx
packages/web/src/components/nav-main.tsx
packages/web/src/lib/navigation-config.ts
```

**Validation Criteria**:
- Navegación muestra solo elementos autorizados
- Performance no se degrada con usuarios con muchos permisos
- UI clara para elementos con acceso limitado
- Configuración es fácil de mantener y extender

---

### **TICKET #5: Página de Gestión de Permisos**
**Type**: Feature | **Priority**: Medium | **Estimation**: 4 days | **Status**: ❌ Not Implemented

**Description**: Crear interfaz administrativa completa para gestionar roles, permisos y asignaciones de usuarios.

**Technical Tasks**:
- [ ] Crear página `/dashboard/settings/permissions`
- [ ] Implementar editor visual de roles
- [ ] Crear matriz de permisos interactiva
- [ ] Añadir búsqueda y filtrado de usuarios
- [ ] Implementar asignación masiva de roles
- [ ] Crear vista de audit trail
- [ ] Añadir export/import de configuraciones

**Pages to create**:
```
// These pages are NOT implemented.
packages/web/src/app/[lang]/(private)/dashboard/settings/permissions/
├── page.tsx                    // Vista principal
├── roles/
│   ├── page.tsx               // Lista de roles
│   ├── [roleId]/
│   │   └── page.tsx           // Editor de rol específico
│   └── new/
│       └── page.tsx           // Crear nuevo rol
├── users/
│   ├── page.tsx               // Gestión de usuarios
│   └── [userId]/
│       └── page.tsx           // Permisos de usuario específico
└── audit/
    └── page.tsx               // Audit trail
```

**Components to create**:
```
// These components are NOT implemented.
packages/web/src/components/admin/permissions/
├── RoleEditor.tsx              // Editor de rol individual
├── PermissionMatrix.tsx        // Matriz visual de permisos
├── UserRoleAssignment.tsx      // Asignación de roles a usuarios
├── PermissionSelector.tsx      // Selector de permisos específicos
├── RoleInheritance.tsx        // Visualización de herencia
├── AuditLogViewer.tsx         // Visor de audit logs
├── BulkRoleAssignment.tsx     // Asignación masiva
└── PermissionPreview.tsx      // Preview de capacidades por rol
```

**Features incluidas**:
- Editor visual drag-and-drop para permisos
- Matriz interactiva de roles vs recursos
- Búsqueda avanzada de usuarios por permisos
- Asignación temporal de roles con expiración
- Vista previa de capacidades antes de guardar
- Audit trail completo con filtros
- Export/import de configuraciones JSON
- Validaciones para evitar lockouts accidentales

**Validation Criteria**:
- Interfaz es intuitiva para administradores
- Validaciones previenen configuraciones inválidas
- Performance es buena con 100+ usuarios
- Audit trail es completo y consultable

---

### **TICKET #6: Middleware de Validación tRPC**
**Type**: Feature | **Priority**: Medium | **Estimation**: 2 days | **Status**: ❌ Not Implemented

**Description**: Integrar validación de permisos en todos los endpoints tRPC del sistema.

**Technical Tasks**:
- [ ] Crear middleware `withPermission` para tRPC
- [ ] Añadir validación a routers existentes
- [ ] Crear helper para permisos complejos
- [ ] Implementar rate limiting por rol
- [ ] Añadir logging de accesos denegados
- [ ] Crear tests de integración

**tRPC Integration**:
```typescript
// This tRPC middleware for granular permissions is NOT implemented.
// tRPC procedures would rely on the existing UserRole enum for access control.
export const withPermission = (resource: string, action: string, scope?: string) =>
  middleware(async ({ ctx, next }) => {
    const hasPermission = await ctx.permissionService.hasPermission(
      ctx.session.user.id,
      resource,
      action,
      scope
    );
    
    if (!hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing permission: ${resource}:${action}${scope ? `:${scope}` : ''}`
      });
    }
    
    return next();
  });

// Usage en routers
export const userRouter = router({
  list: procedure
    .use(withPermission('users', 'read'))
    .query(async ({ ctx }) => {
      return ctx.db.user.findMany();
    }),
    
  update: procedure
    .use(withPermission('users', 'update'))
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: input.data
      });
    }),
});
```

**Validation Criteria**:
- Todos los endpoints críticos están protegidos
- Middleware es performante y no introduce latencia
- Error messages son claros y útiles
- Logging permite debugging de problemas de permisos

---

### **TICKET #7: Tests de Integración y E2E**
**Type**: Testing | **Priority**: Low | **Estimation**: 3 days | **Status**: ❌ Not Implemented

**Description**: Crear suite completa de tests para validar el sistema de permisos.

**Technical Tasks**:
- [ ] Crear tests unitarios para PermissionService
- [ ] Implementar tests de integración para guards
- [ ] Añadir tests E2E para flujos de permisos
- [ ] Crear tests de performance para queries
- [ ] Implementar tests de seguridad
- [ ] Añadir tests de regresión

**Test Categories**:
```typescript
// These tests are NOT implemented for granular permissions.
// Existing tests cover role-based access control.
// Unit Tests
describe('PermissionService', () => {
  it('should validate basic permissions correctly');
  it('should handle role inheritance properly');
  it('should cache permissions efficiently');
  it('should invalidate cache on role changes');
});

// Integration Tests
describe('Permission Guards', () => {
  it('should protect routes based on permissions');
  it('should redirect unauthorized users appropriately');
  it('should handle loading states correctly');
});

// E2E Tests
describe('Permission Workflows', () => {
  it('should allow admin to manage user permissions');
  it('should prevent unauthorized access to admin areas');
  it('should update navigation based on user permissions');
});

// Security Tests
describe('Security Validation', () => {
  it('should prevent privilege escalation attempts');
  it('should validate permissions on all protected endpoints');
  it('should handle expired permission tokens');
});
```

**Validation Criteria**:
- Tests cubren todos los casos críticos de permisos
- Tests de seguridad previenen vulnerabilidades comunes
- Tests E2E validan flujos completos de usuarios
- Suite de tests es rápida y confiable

## 📊 **Summary of Estimations**

| Priority | Tickets | Total Estimation |
|-----------|---------|------------------|
| High      | 4       | 10 days          |
| Medium    | 2       | 6 days           |
| Low       | 1       | 3 days           |
| **Total** | **7**   | **19 days**      |

## 🚀 **Implementation Plan**

### **Phase 1: Foundation (1 week)**
- TICKET #1: Database Models
- TICKET #2: Backend Services

### **Phase 2: Frontend Guards (1 week)**
- TICKET #3: Frontend Guards and Hooks
- TICKET #4: Dynamic Navigation

### **Phase 3: Management Interface (1 week)**
- TICKET #5: Permission Management Page
- TICKET #6: tRPC Middleware

### **Phase 4: Testing and Validation (optional)**
- TICKET #7: Integration and E2E Tests

## 📝 **Dependencies**

```
#1 (Database Models) ← #2 (Backend Services) ← #3 (Frontend Guards)
#3 (Frontend Guards) ← #4 (Dynamic Navigation)
#2 (Backend Services) ← #5 (Management Interface)
#2 (Backend Services) ← #6 (tRPC Middleware)
All ← #7 (Tests)
```

## 🔐 **Security Considerations**

### **Frontend Security**
- Guards son solo para UX, validación real en backend
- Tokens de sesión incluyen permisos básicos
- Cache local tiene expiración automática
- Sanitización de datos sensibles en logs

### **Backend Security**
- Validación doble en endpoints críticos
- Rate limiting específico por rol
- Audit logs completos y immutables
- Encriptación de permisos sensibles

### **Database Security**
- Índices optimizados para queries de permisos
- Constraints para prevenir estados inválidos
- Backup regular de configuraciones de permisos
- Cleanup automático de asignaciones expiradas

## 🔌 **Integration Points**

### **Sistema Existente**
- Extender modelo `User` actual con nuevos campos
- Integrar con `AuthService` para validación de sesión
- Usar `NotificationService` para alertas de cambios de permisos
- Aprovechar sistema de configuración para settings

### **Nuevos Sistemas**
- Base para sistema de configuración dinámico
- Foundation para módulos plug-and-play
- Integración con chatbot para permisos de respuesta
- Preparación para multi-tenant en el futuro