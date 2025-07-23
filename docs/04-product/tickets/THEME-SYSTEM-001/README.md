# THEME-SYSTEM-001: Implementar Sistema de Temas Dinámico

## 📋 **Resumen**
Transformar el sistema de temas estático actual a un sistema dinámico basado en API que permita cambios de tema en tiempo real, similar a tweakcn.

## 🎯 **Objetivos**
- [ ] Crear proveedor de temas dinámico basado en API
- [ ] Migrar componentes de clases hardcodeadas a CSS variables dinámicas
- [ ] Integrar generación de CSS desde la API de temas
- [ ] Habilitar cambio de temas en tiempo real en Storybook

## 📊 **Estado Actual**

### **❌ Problemas Identificados**
1. **Componentes hardcodeados**: `bg-design-primary` en lugar de `bg-primary`
2. **CSS variables estáticas**: No se actualiza dinámicamente desde API
3. **Sin integración API**: Componentes no consumen temas de la base de datos
4. **Storybook desconectado**: No puede mostrar diferentes temas de empresa

### **✅ Recursos Disponibles**
- API completa de temas en `/packages/api/src/themes/`
- Modelos Prisma: `Theme`, `ThemeRule`, `ThemePreset`
- tweakcn package con editor visual
- Infraestructura de design tokens

## 🏗️ **Arquitectura Propuesta**

### **Fase 1: Infraestructura Core**
```
API Themes ↔ Dynamic Theme Provider ↔ Components ↔ Storybook
```

### **Componentes Clave**
1. **DynamicThemeProvider** - Fetching de temas por empresa
2. **useCompanyTheme Hook** - Consumo de tokens en componentes
3. **CSS Generation Pipeline** - API → CSS variables
4. **Theme-Aware Components** - Migración a variables dinámicas

## 🔧 **Implementación**

### **1. Dynamic Theme Provider**
```typescript
// /packages/web/src/components/providers/DynamicThemeProvider.tsx
interface DynamicThemeProviderProps {
  companyId?: string;
  themeId?: string;
  children: React.ReactNode;
}

const DynamicThemeProvider = ({ companyId, themeId, children }) => {
  const [theme, setTheme] = useState(null);
  const [cssVariables, setCssVariables] = useState({});

  // Fetch theme from API
  useEffect(() => {
    fetchCompanyTheme(companyId, themeId);
  }, [companyId, themeId]);

  // Generate CSS variables from theme data
  const generateCSSVariables = (themeData) => {
    // Convert theme tokens to CSS custom properties
    // --primary: oklch(0.5634 0.1517 146.7438);
  };

  // Inject CSS variables into document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = generateCSS(cssVariables);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [cssVariables]);
};
```

### **2. Theme Hook System**
```typescript
// /packages/web/src/hooks/useCompanyTheme.ts
export const useCompanyTheme = () => {
  const context = useContext(ThemeContext);
  
  return {
    activeTheme: context.theme,
    getToken: (tokenName: string) => context.tokens[tokenName],
    applyThemeRule: (selector: string, rule: ThemeRule) => {},
    updateTheme: (themeData: Partial<Theme>) => {}
  };
};
```

### **3. Component Migration Strategy**
```typescript
// ANTES (Static)
const Button = () => (
  <button className="bg-design-primary text-primary-dark hover:bg-design-primary/90">
    {children}
  </button>
);

// DESPUÉS (Dynamic)
const Button = () => {
  const { getToken } = useCompanyTheme();
  
  return (
    <button className="bg-primary text-primary-foreground hover:bg-primary/90">
      {children}
    </button>
  );
  // CSS variables generadas automáticamente:
  // --primary: oklch(valor_desde_api);
};
```

### **4. Storybook Integration**
```typescript
// .storybook/preview.tsx
const withDynamicTheme = (Story, context) => {
  const themeId = context.globals.companyTheme;
  
  return (
    <DynamicThemeProvider themeId={themeId}>
      <Story />
    </DynamicThemeProvider>
  );
};

// Permite cambiar temas en Storybook toolbar
export const globalTypes = {
  companyTheme: {
    description: 'Company Theme',
    defaultValue: 'default',
    toolbar: {
      title: 'Theme',
      items: [
        { value: 'default', title: 'Default Theme' },
        { value: 'company-a', title: 'Company A Theme' },
        { value: 'company-b', title: 'Company B Theme' },
      ],
    },
  },
};
```

## 📝 **Tickets Derivados**

### **THEME-SYSTEM-002**: Dynamic Theme Provider Implementation
- Crear `DynamicThemeProvider` component
- Implementar fetch de temas desde API
- Manejar estados de loading/error
- Cache de temas para performance

### **THEME-SYSTEM-003**: CSS Generation Pipeline
- Endpoint `/api/themes/:id/css` para generar CSS
- Conversión de tokens a CSS custom properties
- Soporte para OKLCH color format
- Theme rules con especificidad

### **THEME-SYSTEM-004**: Component Library Migration
- Migrar Button component a sistema dinámico
- Actualizar Avatar, Icon, Badge, Input components
- Crear utilidades para theme consumption
- Mantener backward compatibility

### **THEME-SYSTEM-005**: Storybook Theme Integration
- Configurar theme switching en Storybook
- Crear theme preview controls
- Integrar con company theme selector
- Live theme editing preview

### **THEME-SYSTEM-006**: tweakcn Integration
- Embebido de theme editor en settings
- Real-time theme updates
- AI theme generation integration
- Component-specific theming interface

## 🧪 **Criterios de Aceptación**

### **Fase 1** ✅
- [ ] DynamicThemeProvider funcional
- [ ] useCompanyTheme hook operativo
- [ ] CSS generation pipeline working
- [ ] Un componente (Button) migrado exitosamente

### **Fase 2** ✅  
- [ ] 5+ componentes atoms migrados
- [ ] Storybook con theme switching
- [ ] Theme API endpoints funcionales
- [ ] Performance optimizado (cache, lazy loading)

### **Fase 3** ✅
- [ ] tweakcn editor integrado
- [ ] Real-time theme updates
- [ ] Company-specific theme management
- [ ] Advanced theme rules support

## 📊 **Métricas de Éxito**
- **Performance**: < 100ms theme switch time
- **Coverage**: 100% components usando theme system
- **DX**: Theme editing interface intuitiva
- **Flexibility**: Soporte para theme rules específicas

## 🔗 **Recursos**

### **API Endpoints**
- `GET /api/themes/:companyId` - Obtener tema activo de empresa
- `GET /api/themes/:id/css` - Generar CSS de tema
- `POST /api/themes` - Crear nuevo tema
- `PUT /api/themes/:id` - Actualizar tema

### **Documentación**
- [tweakcn Theme System](../../../tweakcn/README.md)
- [Design Tokens Schema](../../api/src/themes/design-tokens.ts)
- [Theme API Documentation](../../api/src/themes/README.md)

---

**Estimación**: 15-20 días de desarrollo
**Prioridad**: Alta - Bloquea customización de cliente
**Complejidad**: Alta - Requiere coordinación frontend/backend