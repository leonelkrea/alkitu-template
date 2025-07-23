export type ComponentKey = 
  | 'Design Tokens'
  | 'Branding'
  // Atoms
  | 'Typography'
  | 'Icon'
  | 'Badge'
  | 'Button'
  | 'Input'
  | 'Checkbox'
  | 'RadioGroup'
  | 'Avatar'
  | 'PreviewImage'
  | 'Spinner'
  | 'Tooltip'
  | 'Chip'
  // Molecules
  | 'FormField'
  | 'IconButton'
  | 'NotificationDot'
  | 'Card'
  | 'RequestCard'
  | 'ServiceCard'
  | 'UserMenu'
  | 'ToggleSwitch'
  // Organisms
  | 'Sidebar'
  | 'Header'
  | 'DashboardSummary'
  | 'RequestsList'
  | 'RequestDetail'
  | 'NewRequestWizard'
  | 'ProfileForm'
  | 'ServicesList'
  | 'ServiceEditor'
  | 'EmailTemplatesMgr'
  | 'UsersList'
  | 'CalendarView'
  | 'NotificationsPanel'
  | 'Table'
  | 'HeroSection'
  | 'AuthForm'
  // Templates
  | 'LandingPage'
  | 'LoginPage'
  | 'RegisterPage'
  | 'PasswordResetPage'
  | 'DashboardPage'
  | 'NotificationsPage'
  | 'RequestsListPage'
  | 'RequestDetailPage'
  | 'ProfilePage'
  | 'ServicesListPage'
  | 'CalendarPage'
  | 'WorkLocationsPage';

export interface ComponentData {
  name: string;
  description: string;
  category: 'Design System' | 'Atoms' | 'Molecules' | 'Organisms' | 'Templates';
  props?: Record<string, any>;
  examples?: string[];
  usageGuidelines?: string[];
  hasMobileVersion?: boolean;
  mobileAdaptations?: string[];
}

export const componentsData: Record<ComponentKey, ComponentData> = {
  'Design Tokens': {
    name: 'Design Tokens',
    description: 'Sistema de tokens de diseño con colores, tipografía y espaciado',
    category: 'Design System',
    usageGuidelines: [
      'Usa los tokens definidos para mantener consistencia',
      'Los colores siguen la paleta earth-toned del sistema',
      'La tipografía base es Inter con pesos específicos'
    ]
  },
  
  'Branding': {
    name: 'Branding',
    description: 'Sistema de identidad visual unificado con logo en múltiples variantes',
    category: 'Design System',
    usageGuidelines: [
      'Instancia única: cambios se reflejan en todo el sistema',
      'Usar variant apropiada según el contexto (horizontal/vertical/icon)',
      'Aplicar color correcto según el fondo (default/white/monochrome)',
      'Mantener consistencia en tamaños dentro del mismo contexto'
    ]
  },
  
  // Atoms
  'Typography': {
    name: 'Typography',
    description: 'Componente base para texto con variantes, tamaños y pesos',
    category: 'Atoms',
    props: {
      variant: 'h1 | h2 | h3 | h4 | p | caption | overline',
      size: 'xs | sm | md | lg | xl | 2xl | 3xl',
      weight: 'regular | medium | bold',
      color: 'primary | secondary | muted | inherit'
    },
    usageGuidelines: [
      'Usa h1-h4 para jerarquía de títulos',
      'Párrafos con variant="p" para contenido',
      'Los tamaños se aplican solo cuando se especifican'
    ]
  },
  
  'Icon': {
    name: 'Icon',
    description: 'Iconos con Lucide React, tamaños y colores consistentes',
    category: 'Atoms',
    props: {
      name: 'Nombre del icono de Lucide',
      size: 'xs | sm | md | lg | xl | number',
      color: 'primary | secondary | muted | success | warning | error | inherit'
    },
    usageGuidelines: [
      'Usa iconos de Lucide React exclusivamente',
      'Mantén consistencia en el tamaño según el contexto',
      'Los colores deben seguir la paleta del sistema'
    ]
  },
  
  'Badge': {
    name: 'Badge',
    description: 'Etiquetas informativas con variantes de color y tamaño',
    category: 'Atoms',
    props: {
      variant: 'primary | secondary | success | warning | error | neutral',
      size: 'sm | md | lg'
    },
    usageGuidelines: [
      'Usa para indicar estados o categorías',
      'Los colores comunican significado (success=verde, error=rojo)',
      'Tamaño pequeño para contadores'
    ]
  },
  
  'Button': {
    name: 'Button',
    description: 'Botones interactivos con variantes, iconos y estados',
    category: 'Atoms',
    props: {
      variant: 'primary | secondary | outline | ghost | destructive',
      size: 'sm | md | lg',
      icon: 'string (Lucide icon name)',
      iconPosition: 'left | right',
      loading: 'boolean',
      fullWidth: 'boolean'
    },
    usageGuidelines: [
      'Primary para acciones principales',
      'Secondary para acciones secundarias',
      'Destructive para acciones peligrosas',
      'Ghost para acciones sutiles'
    ]
  },
  
  'Input': {
    name: 'Input',
    description: 'Campos de entrada con tipos, tamaños y estados',
    category: 'Atoms',
    props: {
      type: 'text | email | password | number | tel | url | search',
      size: 'sm | md | lg',
      error: 'boolean',
      disabled: 'boolean',
      readOnly: 'boolean'
    },
    usageGuidelines: [
      'Usa tipos semánticos (email, tel, etc.)',
      'Estado error para validaciones',
      'Placeholder descriptivos pero concisos'
    ]
  },
  
  'Checkbox': {
    name: 'Checkbox',
    description: 'Selección múltiple con estados indeterminados y labels',
    category: 'Atoms',
    props: {
      checked: 'boolean',
      indeterminate: 'boolean',
      disabled: 'boolean',
      label: 'string',
      description: 'string',
      size: 'sm | md | lg'
    },
    usageGuidelines: [
      'Usa para selecciones múltiples',
      'Estado indeterminado para selecciones parciales',
      'Incluye label descriptivo'
    ]
  },
  
  'RadioGroup': {
    name: 'RadioGroup',
    description: 'Selección única con orientación horizontal/vertical',
    category: 'Atoms',
    props: {
      options: 'Array<{value, label, description?, disabled?}>',
      orientation: 'horizontal | vertical',
      size: 'sm | md | lg',
      disabled: 'boolean'
    },
    usageGuidelines: [
      'Usa para selección única entre opciones',
      'Máximo 7 opciones para buena UX',
      'Orientación horizontal para pocas opciones'
    ]
  },
  
  'Avatar': {
    name: 'Avatar',
    description: 'Imágenes de perfil con fallbacks, estados y formas',
    category: 'Atoms',
    props: {
      src: 'string',
      fallback: 'string',
      size: 'xs | sm | md | lg | xl | 2xl',
      shape: 'circle | square',
      status: 'online | offline | away | busy'
    },
    usageGuidelines: [
      'Fallback con iniciales del usuario',
      'Estados de conexión cuando sea relevante',
      'Forma circular para personas, cuadrada para entidades'
    ]
  },
  
  'PreviewImage': {
    name: 'PreviewImage',
    description: 'Imágenes con estados de carga, error y fallback',
    category: 'Atoms',
    props: {
      src: 'string',
      objectFit: 'cover | contain | fill | none | scale-down',
      rounded: 'none | sm | md | lg | full',
      fallback: 'ReactNode',
      loading: 'lazy | eager'
    },
    usageGuidelines: [
      'Usa loading="lazy" para imágenes no críticas',
      'objectFit="cover" para mantener proporción',
      'Proporciona fallback personalizado cuando sea necesario'
    ]
  },
  
  'Spinner': {
    name: 'Spinner',
    description: 'Indicadores de carga con tamaños, colores y grosores',
    category: 'Atoms',
    props: {
      size: 'xs | sm | md | lg | xl',
      color: 'primary | secondary | neutral | white | currentColor',
      thickness: 'thin | medium | thick'
    },
    usageGuidelines: [
      'Usa currentColor para heredar color del contexto',
      'Tamaño apropiado según el espacio disponible',
      'Incluye aria-label para accesibilidad'
    ]
  },
  
  'Tooltip': {
    name: 'Tooltip',
    description: 'Información contextual con posicionamiento y delays',
    category: 'Atoms',
    props: {
      content: 'string | ReactNode',
      position: 'top | bottom | left | right',
      delay: 'number (ms)',
      disabled: 'boolean'
    },
    usageGuidelines: [
      'Información breve y útil',
      'No duplicar información ya visible',
      'Posición que no bloquee contenido importante'
    ]
  },
  
  'Chip': {
    name: 'Chip',
    description: 'Etiquetas interactivas removibles con iconos',
    category: 'Atoms',
    props: {
      variant: 'default | primary | secondary | success | warning | error',
      size: 'sm | md | lg',
      removable: 'boolean',
      disabled: 'boolean',
      icon: 'string (Lucide icon name)'
    },
    usageGuidelines: [
      'Usa para filtros y tags',
      'Removable para elementos que el usuario puede eliminar',
      'Agrupa chips relacionados visualmente'
    ]
  },
  

  
  // Molecules
  'FormField': {
    name: 'FormField',
    description: 'Campo de formulario completo con label, input y mensajes de error',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Inputs más grandes para touch (44px mínimo)',
      'Spacing aumentado entre elementos',
      'Labels más prominentes en móvil',
      'Estados de error más visibles',
      'Font-size 16px para prevenir zoom en iOS'
    ],
    props: {
      label: 'string',
      description: 'string',
      required: 'boolean',
      error: 'string',
      inputProps: 'object'
    },
    usageGuidelines: [
      'Combina Typography + Input para formularios consistentes',
      'Usa required para campos obligatorios',
      'Los errores se muestran automáticamente en rojo',
      'La descripción ayuda al usuario a entender el campo'
    ]
  },
  
  'IconButton': {
    name: 'IconButton',
    description: 'Botón optimizado para mostrar solo iconos con tooltips',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Tamaño mínimo de 44px para touch',
      'Área de toque expandida',
      'Tooltips convertidos a labels visibles en móvil',
      'Estados de hover adaptados a touch',
      'Better visual feedback for touch interactions'
    ],
    props: {
      icon: 'string (Lucide icon name)',
      iconOnly: 'boolean',
      tooltip: 'string',
      variant: 'primary | secondary | outline | ghost | destructive'
    },
    usageGuidelines: [
      'Usa iconOnly=true para acciones compactas',
      'Siempre incluye tooltip para accesibilidad',
      'Perfecto para toolbars y acciones secundarias',
      'Mantén consistencia en el tamaño dentro del contexto'
    ]
  },
  
  'NotificationDot': {
    name: 'NotificationDot',
    description: 'Indicador de notificaciones que se superpone a otros elementos',
    category: 'Molecules',
    props: {
      count: 'number',
      max: 'number (default: 99)',
      dot: 'boolean',
      variant: 'primary | secondary | success | warning | error',
      showZero: 'boolean'
    },
    usageGuidelines: [
      'Usa dot=true para indicaciones simples sin número',
      'Los contadores mayores a max se muestran como "99+"',
      'Posiciona sobre avatars, iconos o botones',
      'Colores semánticos: error para urgente, warning para atención'
    ]
  },
  
  'Card': {
    name: 'Card',
    description: 'Contenedor versátil con tres variantes: cuadrada, vertical y horizontal',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout más compacto en móvil',
      'Variante horizontal se convierte en vertical',
      'Spacing reducido entre elementos',
      'Acciones touch-friendly',
      'Mejor gestión de contenido largo'
    ],
    props: {
      variant: 'square | vertical | horizontal',
      title: 'string',
      image: '{src, alt}',
      icon: '{name, color}',
      metadata: 'Array<{label, value}>'
    },
    usageGuidelines: [
      'Square (256x256) para galería de productos o proyectos',
      'Vertical para contenido detallado con imagen destacada',
      'Horizontal para listas con información compacta',
      'Combina con onClick para hacerlas interactivas'
    ]
  },
  
  'RequestCard': {
    name: 'RequestCard',
    description: 'Card especializada para mostrar solicitudes con estados y prioridades',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout vertical optimizado para móvil',
      'Información prioritaria más prominente',
      'Acciones swipe para interacciones',
      'Badges y estados más grandes',
      'Mejor jerarquía visual en pantalla pequeña'
    ],
    props: {
      status: 'pending | approved | rejected | in-progress',
      priority: 'low | medium | high',
      requestType: 'string',
      requestDate: 'string'
    },
    usageGuidelines: [
      'Estados con colores semánticos para fácil reconocimiento',
      'Incluye fecha y tipo de solicitud para contexto',
      'Prioridad ayuda en la organización de tareas',
      'Usa imagen para hacer el contenido más visual'
    ]
  },
  
  'ServiceCard': {
    name: 'ServiceCard',
    description: 'Card para servicios con características, precios y calificaciones',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout completamente vertical en móvil',
      'Precio más prominente',
      'Lista de características en formato móvil',
      'CTAs más grandes y accesibles',
      'Rating con estrellas más grandes'
    ],
    props: {
      price: '{amount, currency, period?}',
      rating: '{value, total}',
      features: 'Array<string>',
      status: 'active | inactive | maintenance'
    },
    usageGuidelines: [
      'Muestra hasta 3 características principales visibles',
      'Precio con período para claridad (ej: €29/mes)',
      'Rating con total de reviews para credibilidad',
      'Estado del servicio con indicadores visuales'
    ]
  },
  
  'UserMenu': {
    name: 'UserMenu',
    description: 'Menú desplegable completo con avatar, datos de usuario y acciones',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Menú desplegable se convierte en bottom sheet',
      'Avatar y información más grandes',
      'Opciones de menú con iconos más grandes',
      'Separación clara entre acciones',
      'Botón de cierre prominent'
    ],
    props: {
      user: '{name, email, avatar?, status?}',
      menuItems: 'Array<{label, icon, onClick, variant?}>',
      showStatus: 'boolean',
      size: 'sm | md | lg'
    },
    usageGuidelines: [
      'Combina Avatar + Button + Typography para UX completa',
      'Estado de conexión opcional para apps colaborativas',
      'Menú se cierra automáticamente al seleccionar opción',
      'Acción destructiva (ej: logout) con estilo diferenciado'
    ]
  },
  
  'ToggleSwitch': {
    name: 'ToggleSwitch',
    description: 'Interruptor mejorado con etiquetas, descripciones e iconos',
    category: 'Molecules',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Switch más grande para touch',
      'Área de toque expandida a toda la fila',
      'Labels más prominentes',
      'Estados visuales más claros',
      'Feedback haptic en móvil'
    ],
    props: {
      label: 'string',
      description: 'string',
      icon: '{checked, unchecked}',
      size: 'sm | md | lg',
      checked: 'boolean'
    },
    usageGuidelines: [
      'Mejor que checkbox para configuraciones on/off',
      'Iconos opcionales para reforzar el significado',
      'Descripción explica el efecto del toggle',
      'Animación suave mejora la percepción de feedback'
    ]
  },
  
  // Organisms
  'Sidebar': {
    name: 'Sidebar',
    description: 'Navegación lateral completa con UserMenu y gestión de rutas',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Se convierte en bottom navigation',
      'Navegación drawer para items secundarios',
      'Iconos prominentes con labels opcionales',
      'Indicador de página activa en bottom nav',
      'Acceso rápido a funciones principales'
    ],
    usageGuidelines: [
      'Usa UserMenu como instancia para el perfil del usuario',
      'Navegación colapsable para optimizar espacio',
      'Estados visuales claros para la ruta activa'
    ]
  },

  'Header': {
    name: 'Header',
    description: 'Cabecera principal con UserMenu, NotificationDot e IconButtons',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Altura reducida para maximizar contenido',
      'Hamburger menu para navegación',
      'Notificaciones en badge más visible',
      'Título de página centrado',
      'Acciones secundarias en overflow menu'
    ],
    usageGuidelines: [
      'UserMenu integrado para gestión del perfil',
      'NotificationDot para mostrar notificaciones pendientes',
      'IconButtons para acciones rápidas y configuración'
    ]
  },

  'DashboardSummary': {
    name: 'DashboardSummary',
    description: 'Resumen de métricas usando múltiples Cards con iconos y estadísticas',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Grid de 1-2 columnas en lugar de 4',
      'Cards más altas con métricas prominentes',
      'Scroll horizontal para métricas adicionales',
      'Gráficos simplificados para móvil',
      'Interacciones touch para más detalles'
    ],
    usageGuidelines: [
      'Usa Cards para mostrar métricas de manera uniforme',
      'Iconos semánticos para identificar cada métrica',
      'Indicadores de cambio con colores apropiados'
    ]
  },

  'RequestsList': {
    name: 'RequestsList',
    description: 'Lista de RequestCards con ToggleSwitch para filtros',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Lista vertical de cards full-width',
      'Filtros en bottom sheet o modal',
      'Pull-to-refresh functionality',
      'Infinite scroll en lugar de paginación',
      'Swipe actions en cards de solicitudes'
    ],
    usageGuidelines: [
      'RequestCard como instancia para cada solicitud',
      'ToggleSwitch para filtrar solicitudes completadas',
      'Filtros múltiples para estado y prioridad'
    ]
  },

  'RequestDetail': {
    name: 'RequestDetail',
    description: 'Detalle completo de solicitud en Card con IconButtons para acciones',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout full-screen en móvil',
      'Acciones principales en bottom bar',
      'Información en secciones colapsables',
      'Imágenes en carrusel optimizado',
      'Timeline vertical compacto'
    ],
    usageGuidelines: [
      'Card como contenedor principal',
      'IconButtons para acciones contextuales',
      'Timeline de cambios para seguimiento'
    ]
  },

  'NewRequestWizard': {
    name: 'NewRequestWizard',
    description: 'Wizard multi-paso usando FormFields e IconButtons para navegación',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Full-screen con steps prominentes',
      'Bottom bar para navegación entre pasos',
      'Formularios optimizados para móvil',
      'Progress indicator en top bar',
      'Validación step-by-step visual'
    ],
    usageGuidelines: [
      'FormFields para cada campo del formulario',
      'IconButtons para navegación entre pasos',
      'Indicador de progreso visual'
    ]
  },

  'ProfileForm': {
    name: 'ProfileForm',
    description: 'Formulario de perfil usando FormFields e IconButtons para acciones',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Formulario optimizado para móvil',
      'Campos agrupados en secciones',
      'Avatar editing con camera/gallery',
      'Save button sticky en bottom',
      'Validación inline más prominente'
    ],
    usageGuidelines: [
      'FormFields para todos los campos del perfil',
      'IconButtons para guardar y cambiar contraseña',
      'Estados de edición/visualización'
    ]
  },

  'ServicesList': {
    name: 'ServicesList',
    description: 'Catálogo de ServiceCards con IconButton para crear servicios',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Grid de 1-2 columnas de ServiceCards',
      'FAB para crear nuevo servicio',
      'Filtros en sliding panel',
      'Search en top bar',
      'Pull-to-refresh capability'
    ],
    usageGuidelines: [
      'ServiceCard para mostrar cada servicio',
      'IconButton para crear nuevos servicios',
      'Filtros por estado del servicio'
    ]
  },

  'ServiceEditor': {
    name: 'ServiceEditor',
    description: 'Editor de servicios con FormFields e IconButtons para guardar/eliminar',
    category: 'Organisms',
    usageGuidelines: [
      'FormFields para configuración del servicio',
      'IconButtons para guardar y eliminar',
      'Campo JSON para configuración avanzada'
    ]
  },

  'EmailTemplatesMgr': {
    name: 'EmailTemplatesMgr',
    description: 'Gestor de plantillas usando Cards, FormFields e IconButtons',
    category: 'Organisms',
    usageGuidelines: [
      'Card para cada plantilla',
      'FormFields para editar contenido',
      'IconButtons para gestionar plantillas'
    ]
  },

  'UsersList': {
    name: 'UsersList',
    description: 'Lista de usuarios en Cards con FormField de búsqueda e IconButtons',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Lista vertical con avatars prominentes',
      'Search en top bar sticky',
      'Swipe actions para acciones rápidas',
      'Scroll alphabet index',
      'Contact-style layout'
    ],
    usageGuidelines: [
      'Card para cada usuario',
      'FormField para búsqueda en tiempo real',
      'IconButtons para gestionar usuarios'
    ]
  },

  'CalendarView': {
    name: 'CalendarView',
    description: 'Vista de calendario con Cards para eventos e IconButtons de navegación',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Vista mensual compacta',
      'Scroll horizontal entre meses',
      'Lista de eventos del día seleccionado',
      'FAB para crear eventos',
      'Agenda view como default'
    ],
    usageGuidelines: [
      'Card para eventos y panel lateral',
      'IconButtons para navegar entre períodos',
      'Eventos como elementos interactivos'
    ]
  },

  'NotificationsPanel': {
    name: 'NotificationsPanel',
    description: 'Panel de notificaciones con NotificationDot y Cards para cada entrada',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Full-screen notifications page',
      'Swipe actions para marcar/eliminar',
      'Agrupación por fecha',
      'Pull-to-refresh',
      'Mark all as read en header'
    ],
    usageGuidelines: [
      'NotificationDot para indicador de no leídas',
      'Card o elemento similar para cada notificación',
      'Acciones para marcar como leída'
    ]
  },

  'Table': {
    name: 'Table',
    description: 'Tabla avanzada con FormField para búsqueda, IconButtons para acciones y Badge para estados',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Se convierte en lista de cards',
      'Columnas importantes como headers de card',
      'Scroll horizontal para tabla simple',
      'Filtros en bottom sheet',
      'Acciones en swipe o modal'
    ],
    props: {
      columns: 'Array<TableColumn>',
      data: 'Array<any>',
      selectable: 'boolean',
      actions: 'Array<TableAction>',
      pagination: 'object',
      filters: 'object'
    },
    usageGuidelines: [
      'FormField para búsqueda y filtros de datos',
      'IconButtons para acciones por fila (editar, eliminar, ver)',
      'Badge para mostrar estados y categorías en celdas',
      'Avatar para mostrar usuarios en tablas de personas',
      'Button para paginación y cambio de página',
      'Checkbox para selección múltiple de filas'
    ]
  },

  'HeroSection': {
    name: 'HeroSection',
    description: 'Sección hero para landing page con Card, Button y PreviewImage',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout vertical en móvil',
      'Imágenes optimizadas para móvil',
      'CTAs más prominentes',
      'Texto más conciso',
      'Scroll interactions optimizadas'
    ],
    usageGuidelines: [
      'Card como contenedor para la imagen promocional',
      'Button para CTAs principales (Login/Register)',
      'PreviewImage para elementos visuales destacados',
      'Typography para títulos impactantes'
    ]
  },

  'AuthForm': {
    name: 'AuthForm',
    description: 'Formulario de autenticación usando FormFields y Button',
    category: 'Organisms',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Campos de formulario optimizados touch',
      'Keyboard type específico por campo',
      'Botones de login social más grandes',
      'Validación visual prominente',
      'Auto-focus y navegación mejorada'
    ],
    usageGuidelines: [
      'FormField para email, password y confirmación',
      'Button para envío del formulario',
      'Validación en tiempo real',
      'Estados de carga y error'
    ]
  },
  
  // Templates
  'LandingPage': {
    name: 'Landing Page',
    description: 'Página de aterrizaje con HeroSection para mostrar propuesta de valor',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Layout completamente vertical',
      'Navegación mobile-first',
      'Secciones optimizadas para scroll',
      'CTAs prominentes en cada sección',
      'Imágenes y contenido optimizado'
    ],
    usageGuidelines: [
      'Usa HeroSection como organismo principal',
      'Incluye CTAs para Login y Register',
      'Layout responsivo con header y footer',
      'Secciones de características y social proof'
    ]
  },

  'LoginPage': {
    name: 'Login Page', 
    description: 'Página de autenticación con AuthForm para iniciar sesión',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Full-screen form layout',
      'Brand logo prominente',
      'Auto-focus en email',
      'Remember me más accessible',
      'Social login prominent'
    ],
    usageGuidelines: [
      'Usa AuthForm con type="login"',
      'AuthLayout para estructura centrada',
      'Enlace a registro y recuperación de contraseña',
      'Estados de carga y error'
    ]
  },

  'RegisterPage': {
    name: 'Register Page',
    description: 'Página de registro con AuthForm para crear cuenta nueva',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Multi-step registration en móvil',
      'Progress indicator visible',
      'Terms acceptance prominent',
      'Photo upload optimizada',
      'Validation step-by-step'
    ],
    usageGuidelines: [
      'Usa AuthForm con type="register"',
      'AuthLayout para estructura centrada',
      'Campos de email, password y confirmación',
      'Enlace de vuelta al login'
    ]
  },

  'PasswordResetPage': {
    name: 'Password Reset Page',
    description: 'Página de recuperación de contraseña con AuthForm',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Instrucciones más claras',
      'Campo email prominente',
      'Success state visual',
      'Back to login prominent',
      'Input validation immediate'
    ],
    usageGuidelines: [
      'Usa AuthForm con type="password-reset"',
      'Solo campo de email requerido',
      'Estado de éxito tras envío',
      'Enlace de vuelta al login'
    ]
  },

  'DashboardPage': {
    name: 'Dashboard Page',
    description: 'Vista principal adaptada por rol con Table avanzada y datos específicos',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Bottom navigation layout',
      'Cards apiladas verticalmente',
      'Pull-to-refresh data',
      'Quick actions FAB',
      'Swipe gestures para navegación'
    ],
    usageGuidelines: [
      'Table con métricas del sistema para admin',
      'Table con asignaciones de trabajo para employee',
      'Table con solicitudes personales para client',
      'Datos y columnas adaptados según userRole',
      'MainLayout como estructura base'
    ]
  },

  'NotificationsPage': {
    name: 'Notifications Page',
    description: 'Página de notificaciones con NotificationsPanel',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Full-screen notification list',
      'Swipe actions para cada notification',
      'Mark all read en header',
      'Filter por tipo de notificación',
      'Real-time updates'
    ],
    usageGuidelines: [
      'NotificationsPanel como organismo principal',
      'Acciones para marcar como leídas',
      'Navegación a contenido relacionado',
      'Estados de carga y vacío'
    ]
  },

  'RequestsListPage': {
    name: 'Requests List Page',
    description: 'Lista completa de solicitudes con Table avanzada y filtros',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Lista de RequestCards optimizada',
      'Filtros en bottom sheet',
      'FAB para nueva solicitud',
      'Pull-to-refresh y infinite scroll',
      'Search en header sticky'
    ],
    usageGuidelines: [
      'Table como organismo principal con columnas adaptadas por rol',
      'Filtros por estado, prioridad, tipo y departamento',
      'Acciones contextuales según rol de usuario',
      'Paginación, búsqueda y ordenamiento integrados',
      'Vista diferenciada para admin, employee y client'
    ]
  },

  'RequestDetailPage': {
    name: 'Request Detail Page',
    description: 'Detalle completo de solicitud con RequestDetail',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Full-screen detail view',
      'Acciones principales en bottom bar',
      'Timeline en formato móvil',
      'Attachments en grid optimizado',
      'Comments con keyboard smart'
    ],
    usageGuidelines: [
      'RequestDetail como organismo principal',
      'Acciones contextuales según rol',
      'Timeline de cambios',
      'Navegación de vuelta a la lista'
    ]
  },

  'ProfilePage': {
    name: 'Profile Page',
    description: 'Página de perfil de usuario con ProfileForm',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Avatar editing prominent',
      'Settings agrupadas en secciones',
      'Toggle switches para preferences',
      'Logout en sección separada',
      'Camera integration para photo'
    ],
    usageGuidelines: [
      'ProfileForm como organismo principal',
      'Edición de datos personales',
      'Enlace a cambio de contraseña',
      'Estados de guardado y error'
    ]
  },

  'ServicesListPage': {
    name: 'Services List Page',
    description: 'Catálogo de servicios con ServicesList',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Grid de ServiceCards optimizado',
      'Categories en horizontal scroll',
      'FAB para nuevo servicio',
      'Search y filtros prominentes',
      'Service details en modal'
    ],
    usageGuidelines: [
      'ServicesList como organismo principal',
      'Creación de nuevos servicios (admin)',
      'Filtros por categoría y estado',
      'Navegación al editor de servicios'
    ]
  },

  'CalendarPage': {
    name: 'Calendar Page',
    description: 'Vista de calendario con CalendarView para eventos y solicitudes',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Agenda view como default',
      'Month view compacto',
      'Day events en lista',
      'FAB para crear evento',
      'Swipe entre fechas'
    ],
    usageGuidelines: [
      'CalendarView como organismo principal',
      'Eventos relacionados con solicitudes',
      'Navegación mensual/semanal',
      'Creación de nuevos eventos'
    ]
  },

  'WorkLocationsPage': {
    name: 'Work Locations Page',
    description: 'Selector de ubicaciones con tarjetas horizontales y gestión completa',
    category: 'Templates',
    hasMobileVersion: true,
    mobileAdaptations: [
      'Location cards en formato vertical',
      'Map view integrada',
      'Filter por proximidad',
      'FAB para nueva ubicación',
      'GPS integration para locations'
    ],
    usageGuidelines: [
      'Tarjetas horizontales para cada ubicación',
      'Búsqueda y filtros por tipo y estado',
      'Información detallada: capacidad, horarios, instalaciones',
      'Gestión completa para admin/employee',
      'Selección simple para client en flujo de nueva solicitud'
    ]
  }
};

export const componentCategories = {
  'Design System': ['Design Tokens', 'Branding'],
  'Atoms': [
    'Typography', 'Icon', 'Badge', 'Button', 'Input', 'Checkbox', 
    'RadioGroup', 'Avatar', 'PreviewImage', 'Spinner', 'Tooltip', 'Chip'
  ],
  'Molecules': [
    'FormField', 'IconButton', 'NotificationDot', 'Card', 
    'RequestCard', 'ServiceCard', 'UserMenu', 'ToggleSwitch'
  ],
  'Organisms': [
    'Sidebar', 'Header', 'DashboardSummary', 'RequestsList', 'RequestDetail',
    'NewRequestWizard', 'ProfileForm', 'ServicesList', 'ServiceEditor',
    'EmailTemplatesMgr', 'UsersList', 'CalendarView', 'NotificationsPanel', 'Table',
    'HeroSection', 'AuthForm'
  ],
  'Templates': [
    'LandingPage', 'LoginPage', 'RegisterPage', 'PasswordResetPage',
    'DashboardPage', 'NotificationsPage', 'RequestsListPage', 'RequestDetailPage',
    'ProfilePage', 'ServicesListPage', 'CalendarPage', 'WorkLocationsPage'
  ]
};