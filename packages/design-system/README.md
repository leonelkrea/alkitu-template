# Alkitu Design System

Un sistema de diseño moderno y completo construido con React y TypeScript, diseñado específicamente para aplicaciones empresariales con soporte mobile-first.

## 🎨 Características

- **Mobile-First**: Diseño optimizado para dispositivos móviles con adaptaciones específicas para iOS/Android
- **Atomic Design**: Arquitectura basada en átomos, moléculas, organismos y plantillas
- **TypeScript**: Totalmente tipado para mejor desarrollo y mantenimiento
- **Design Tokens**: Sistema de tokens centralizado para colores, tipografía y espaciado
- **Component Explorer**: Interfaz interactiva para explorar y probar componentes
- **Accesibilidad**: Componentes construidos siguiendo estándares WCAG
- **Responsive**: Adaptación automática a diferentes tamaños de pantalla

## 📂 Estructura del Proyecto

```
packages/design-system/
├── App.tsx                     # Explorador de componentes interactivo
├── components/
│   └── ui/                     # Componentes base de shadcn/ui
├── src/
│   ├── components/
│   │   ├── atoms/              # Componentes básicos
│   │   ├── molecules/          # Combinaciones de átomos
│   │   ├── organisms/          # Estructuras complejas
│   │   ├── templates/          # Layouts y páginas completas
│   │   ├── demos/              # Demostraciones de componentes
│   │   └── system/             # Utilidades del sistema
│   ├── contexts/               # Contextos de React
│   ├── data/                   # Datos de configuración
│   ├── themes/                 # Tokens de diseño
│   └── pages/                  # Páginas de ejemplo
└── styles/
    └── globals.css             # Estilos globales
```

## 🚀 Inicio Rápido

### Explorador de Componentes

Para explorar todos los componentes disponibles, ejecuta la aplicación principal:

```bash
npm run dev
```

Esto iniciará el **Design System Explorer**, una interfaz interactiva donde podrás:

- 🔍 Buscar componentes por nombre
- 📱 Alternar entre vista desktop y móvil
- 👁️ Ver demostraciones en vivo
- 📋 Consultar especificaciones técnicas
- 📂 Copiar rutas de archivos

### Uso en Proyectos

```tsx
import { Button, Typography, Card } from '@alkitu/design-system';

function MyComponent() {
  return (
    <Card>
      <Typography variant="h2">Título</Typography>
      <Button variant="primary">Acción</Button>
    </Card>
  );
}
```

## 🎯 Componentes Disponibles

### Átomos (17 componentes)
- **Typography**: Sistema tipográfico completo
- **Button**: Botones con múltiples variantes
- **Input**: Campos de entrada con validación
- **Badge**: Etiquetas y estados
- **Icon**: Iconografía consistente
- **Avatar**: Representación de usuarios
- **Checkbox**: Casillas de verificación
- **RadioGroup**: Selección múltiple
- **Spinner**: Indicadores de carga
- **Tooltip**: Información contextual
- **Chip**: Elementos removibles
- **PreviewImage**: Imágenes con fallback
- **Brand**: Elementos de marca

### Moléculas (8 componentes)
- **FormField**: Campos de formulario completos
- **IconButton**: Botones con iconos
- **Card**: Contenedores de contenido
- **RequestCard**: Tarjetas específicas de solicitudes
- **ServiceCard**: Tarjetas de servicios
- **UserMenu**: Menús de usuario
- **ToggleSwitch**: Interruptores
- **NotificationDot**: Indicadores de notificación

### Organismos (15 componentes)
- **Header**: Encabezados de aplicación
- **Sidebar**: Navegación lateral
- **DashboardSummary**: Resúmenes de dashboard
- **RequestsList**: Listas de solicitudes
- **RequestDetail**: Detalles de solicitudes
- **NewRequestWizard**: Asistente de nuevas solicitudes
- **ProfileForm**: Formularios de perfil
- **ServicesList**: Listas de servicios
- **ServiceEditor**: Editor de servicios
- **EmailTemplatesMgr**: Gestor de plantillas de email
- **UsersList**: Listas de usuarios
- **CalendarView**: Vistas de calendario
- **NotificationsPanel**: Panel de notificaciones
- **Table**: Tablas de datos
- **HeroSection**: Secciones principales
- **AuthForm**: Formularios de autenticación

### Plantillas (11+ componentes)
- **LandingPage**: Página de inicio
- **LoginPage**: Página de login
- **RegisterPage**: Página de registro
- **DashboardPage**: Página de dashboard
- **RequestsListPage**: Página de solicitudes
- Y más...

## 🎨 Design Tokens

### Colores

```typescript
// Paleta principal
primaryDark:   "#403925"   // tierra oscura
primary:       "#F2AB27"   // amarillo medio
secondary:     "#F2921D"   // naranja vibrante
accentLight:   "#F2C288"   // melocotón claro
accentPale:    "#F2E0AD"   // amarillo muy suave

// Neutros
neutral: {
  100: "#FFFFFF",  // blanco
  200: "#F9F9F9",  // gris muy claro
  // ... hasta 900
}

// Notificaciones
notification: {
  success: "#2F9E44",
  warning: "#F2AB27",
  error:   "#D92D20"
}
```

### Tipografía

El sistema incluye escalas tipográficas optimizadas para web y móvil, con soporte para múltiples pesos y tamaños.

## 📱 Soporte Móvil

**65% de los componentes** incluyen versiones optimizadas para móviles:

- Componentes con sufijo `Mobile` para adaptaciones específicas
- Layouts responsivos automáticos
- Interacciones táctiles optimizadas
- Navegación adaptada a pantallas pequeñas

### Identificación de Componentes Móviles

Los componentes con soporte móvil están marcados con el icono 📱 en el explorador y incluyen la badge "Mobile Ready".

## 🛠️ Desarrollo

### Estructura de Archivos

Cada componente sigue esta estructura:

```
ComponentName/
├── ComponentName.tsx           # Implementación principal
├── ComponentNameMobile.tsx     # Versión móvil (si aplica)
└── ComponentNameDemo.tsx       # Demostración
```

### Convenciones

- **Naming**: PascalCase para componentes, camelCase para props
- **Props**: Interfaces TypeScript estrictas
- **Styling**: Tailwind CSS con clases consistentes
- **Mobile**: Componentes separados para versiones móviles
- **Testing**: Demos interactivos incluidos

### Añadir Nuevos Componentes

1. Crear el componente en la carpeta apropiada (`atoms/`, `molecules/`, etc.)
2. Añadir la demostración correspondiente en `demos/`
3. Registrar en `componentsData.ts`
4. Exportar desde el archivo `index.ts` correspondiente

## 📋 Especificaciones Técnicas

- **React**: ^18.x
- **TypeScript**: ^5.x
- **Tailwind CSS**: ^3.x
- **Radix UI**: Para componentes accesibles
- **Lucide React**: Para iconografía

## 🎯 Casos de Uso

Este design system está optimizado para:

- **Aplicaciones empresariales**: CRM, ERP, dashboards
- **Portales de usuario**: Autoservicio, gestión de solicitudes
- **Aplicaciones móviles**: PWAs y aplicaciones nativas
- **Sistemas de gestión**: Administración y configuración

## 📈 Roadmap

- [ ] Componentes de gráficos y visualización
- [ ] Tema oscuro completo
- [ ] Animaciones y transiciones
- [ ] Más variantes de componentes
- [ ] Documentación Storybook
- [ ] Tests automatizados

## 🤝 Contribución

Para contribuir al design system:

1. Usar el explorador para entender los patrones existentes
2. Seguir las convenciones de naming y estructura
3. Incluir versión móvil cuando sea apropiado
4. Añadir demostraciones interactivas
5. Mantener consistencia con los design tokens

---

**v1.0.0** • Mobile-First Design System • Construido con ❤️ por el equipo Alkitu