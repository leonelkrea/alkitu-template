import React from 'react';
import {
  Typography,
  Button,
  Icon,
  Badge,
  Input,
  Avatar,
} from '../atomic-design/atoms';

// Import atoms demos
import TypographyDemo from '../demos/atoms/TypographyDemo';
import IconDemo from '../demos/atoms/IconDemo';
import BadgeDemo from '../demos/atoms/BadgeDemo';
import ButtonDemo from '../demos/atoms/ButtonDemo';
import InputDemo from '../demos/atoms/InputDemo';
import CheckboxDemo from '../demos/atoms/CheckboxDemo';
import RadioGroupDemo from '../demos/atoms/RadioGroupDemo';
import AvatarDemo from '../demos/atoms/AvatarDemo';
import PreviewImageDemo from '../demos/atoms/PreviewImageDemo';
import SpinnerDemo from '../demos/atoms/SpinnerDemo';
import TooltipDemo from '../demos/atoms/TooltipDemo';
import ChipDemo from '../demos/atoms/ChipDemo';
import { componentsData } from '../../data/componentsData';

// Import molecules demos
import FormFieldDemo from '../demos/molecules/FormFieldDemo';
import IconButtonDemo from '../demos/molecules/IconButtonDemo';
import NotificationDotDemo from '../demos/molecules/NotificationDotDemo';
import CardDemo from '../demos/molecules/CardDemo';
import RequestCardDemo from '../demos/molecules/RequestCardDemo';
import ServiceCardDemo from '../demos/molecules/ServiceCardDemo';
import UserMenuDemo from '../demos/molecules/UserMenuDemo';
import ToggleSwitchDemo from '../demos/molecules/ToggleSwitchDemo';

// Import organisms demos
import SidebarDemo from '../demos/organisms/SidebarDemo';
import HeaderDemo from '../demos/organisms/HeaderDemo';
import DashboardSummaryDemo from '../demos/organisms/DashboardSummaryDemo';
import RequestsListDemo from '../demos/organisms/RequestsListDemo';
import RequestDetailDemo from '../demos/organisms/RequestDetailDemo';
import TableDemo from '../demos/organisms/TableDemo';
import NewRequestWizardDemo from '../demos/organisms/NewRequestWizardDemo';
import ProfileFormDemo from '../demos/organisms/ProfileFormDemo';
import ServicesListDemo from '../demos/organisms/ServicesListDemo';
import ServiceEditorDemo from '../demos/organisms/ServiceEditorDemo';
import EmailTemplatesMgrDemo from '../demos/organisms/EmailTemplatesMgrDemo';
import UsersListDemo from '../demos/organisms/UsersListDemo';
import CalendarViewDemo from '../demos/organisms/CalendarViewDemo';
import NotificationsPanelDemo from '../demos/organisms/NotificationsPanelDemo';
import HeroSectionDemo from '../demos/organisms/HeroSectionDemo';
import AuthFormDemo from '../demos/organisms/AuthFormDemo';

// Import templates demos
import LandingPageDemo from '../demos/templates/LandingPageDemo';
import LoginPageDemo from '../demos/templates/LoginPageDemo';
import RegisterPageDemo from '../demos/templates/RegisterPageDemo';
import PasswordResetPageDemo from '../demos/templates/PasswordResetPageDemo';
import DashboardPageDemo from '../demos/templates/DashboardPageDemo';
import WorkLocationsPageDemo from '../demos/templates/WorkLocationsPageDemo';

// System demos
import DesignTokensDemo from '../demos/system/DesignTokensDemo';
import BrandingDemo from '../demos/system/BrandingDemo';
import DefaultDemo from '../demos/DefaultDemo';

// Templates for complex ones (keep existing template pages)
import RegisterPage from '../../templates/RegisterPage';
import PasswordResetPage from '../../templates/PasswordResetPage';
import NotificationsPage from '../../templates/NotificationsPage';
import RequestsListPage from '../../templates/RequestsListPage';
import RequestDetailPage from '../../templates/RequestDetailPage';
import ProfilePage from '../../templates/ProfilePage';
import ServicesListPage from '../../templates/ServicesListPage';
import CalendarPage from '../../templates/CalendarPage';
import WorkLocationsPage from '../../templates/WorkLocationsPage';

// Import mobile adaptations using existing components
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';
import Card from '../molecules/Card';
import RequestCard from '../molecules/RequestCard';
import ServiceCard from '../molecules/ServiceCard';
import UserMenu from '../molecules/UserMenu';
import ToggleSwitch from '../molecules/ToggleSwitch';
import SidebarMobile from '../organisms/SidebarMobile';
import Header from '../organisms/Header';
import DashboardSummary, {
  DashboardMetric,
} from '../organisms/DashboardSummary';
import RequestsList, { Request } from '../organisms/RequestsList';
import Table from '../organisms/Table';

export interface ComponentDemoProps {
  componentName: string;
  viewMode?: 'desktop' | 'mobile';
}

const ComponentDemo: React.FC<ComponentDemoProps> = ({
  componentName,
  viewMode = 'desktop',
}) => {
  // Mock user data for templates
  const mockUser = {
    name: 'Ana García',
    email: 'ana.garcia@empresa.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face',
    status: 'online' as const,
    department: 'Desarrollo',
    phone: '+34 123 456 789',
  };

  // Mock requests data
  const mockRequests = [
    {
      id: 'req-001',
      title: 'Solicitud de Equipos',
      description: 'Necesito una laptop nueva para el proyecto',
      status: 'pending' as const,
      priority: 'high' as const,
      requestType: 'IT Equipment',
      requestDate: '2024-01-15',
    },
    {
      id: 'req-002',
      title: 'Permiso de Vacaciones',
      description: 'Solicito vacaciones del 15 al 25 de febrero',
      status: 'approved' as const,
      priority: 'medium' as const,
      requestType: 'HR',
      requestDate: '2024-01-10',
    },
  ];

  // Mobile container using design system components
  const getMobileContainer = (children: React.ReactNode) => {
    if (viewMode !== 'mobile') return children;

    return (
      <div className="flex items-center justify-center min-h-full bg-neutral-200 p-4">
        <div className="w-[375px] bg-card rounded-[2rem] shadow-2xl overflow-hidden border-8 border-neutral-800">
          {/* Phone notch */}
          <div className="h-6 bg-neutral-800 flex items-center justify-center">
            <div className="w-16 h-1 bg-neutral-600 rounded-full"></div>
          </div>

          {/* Phone content */}
          <div className="h-[667px] overflow-auto">{children}</div>

          {/* Phone home indicator */}
          <div className="h-6 bg-neutral-800 flex items-center justify-center">
            <div className="w-32 h-1 bg-neutral-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile adaptations using existing components
  const renderMobileAdaptation = (componentName: string) => {
    switch (componentName) {
      case 'FormField':
        return (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <Typography variant="h3" weight="medium">
                FormField Mobile Adaptation
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Misma instancia de FormField con adaptaciones touch-friendly
              </Typography>

              <div className="space-y-4">
                <FormField
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  className="h-12 text-base"
                />

                <FormField
                  label="Contraseña"
                  required
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                />

                <FormField
                  label="Teléfono con error"
                  error="Formato de teléfono inválido"
                  type="phone"
                  placeholder="+34 123 456 789"
                  value="123abc"
                  className="h-12 text-base"
                />
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <Typography variant="h4" weight="medium" className="mb-2">
                  Adaptaciones Móviles:
                </Typography>
                <div className="space-y-1">
                  <Typography variant="p" size="sm">
                    • Altura mínima de 44px para touch
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Spacing aumentado entre elementos
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Estados de error más prominentes
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Texto base 16px para evitar zoom
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        );

      case 'IconButton':
        return (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <Typography variant="h3" weight="medium">
                IconButton Mobile Adaptation
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Misma instancia de IconButton con tamaños touch-optimized
              </Typography>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Typography variant="h4" weight="medium">
                    Tamaños Mobile (44px mínimo):
                  </Typography>
                  <div className="flex items-center space-x-4">
                    <IconButton
                      icon="Plus"
                      tooltip="Agregar"
                      variant="primary"
                      className="min-w-11 min-h-11"
                    />
                    <IconButton
                      icon="Edit"
                      tooltip="Editar"
                      variant="secondary"
                      className="min-w-12 min-h-12"
                    />
                    <IconButton
                      icon="Trash2"
                      tooltip="Eliminar"
                      variant="destructive"
                      className="min-w-14 min-h-14"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Typography variant="h4" weight="medium">
                    Con texto visible en móvil:
                  </Typography>
                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      icon="Edit"
                      iconPosition="left"
                      className="w-full h-12 justify-start"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      icon="Trash2"
                      iconPosition="left"
                      className="w-full h-12 justify-start"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Typography variant="h4" weight="medium">
                    Bottom Navigation Pattern:
                  </Typography>
                  <div className="bg-card border-t border-border p-2 rounded-lg">
                    <div className="flex justify-around">
                      {[
                        { icon: 'Home', label: 'Inicio', active: true },
                        { icon: 'FileText', label: 'Solicitudes', badge: true },
                        { icon: 'Calendar', label: 'Calendario' },
                        { icon: 'User', label: 'Perfil' },
                      ].map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className={`flex flex-col items-center py-2 px-3 h-auto ${
                            item.active
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <div className="relative mb-1">
                            <Icon name={item.icon as any} size="sm" />
                            {item.badge && (
                              <div className="absolute -top-1 -right-1">
                                <Badge variant="error" size="sm">
                                  3
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Typography variant="p" size="xs">
                            {item.label}
                          </Typography>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <Typography variant="h4" weight="medium" className="mb-2">
                  Adaptaciones Móviles:
                </Typography>
                <div className="space-y-1">
                  <Typography variant="p" size="sm">
                    • Área mínima de touch 44x44px
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Labels visibles en lugar de tooltips
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Estados de touch feedback
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Spacing aumentado para navegación
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Card':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              Card Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Misma instancia de Card con layout adaptativo para móvil
            </Typography>

            <div className="space-y-4">
              {/* Card adapts to vertical layout on mobile */}
              <Card
                variant="vertical"
                title="Oficina Central"
                image={{
                  src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
                  alt: 'Office',
                }}
                metadata={[
                  { label: 'Ubicación', value: 'Madrid, España' },
                  { label: 'Estado', value: 'Activo' },
                ]}
                className="w-full"
              />

              {/* Compact card for lists */}
              <Card
                variant="horizontal"
                title="Centro de Distribución"
                icon={{ name: 'Building2', color: 'primary' }}
                metadata={[{ label: 'Ubicación', value: 'Barcelona' }]}
                className="w-full"
              />
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Layout horizontal se convierte en vertical
                </Typography>
                <Typography variant="p" size="sm">
                  • Imágenes full-width
                </Typography>
                <Typography variant="p" size="sm">
                  • Touch-friendly buttons
                </Typography>
                <Typography variant="p" size="sm">
                  • Mejor jerarquía visual
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'RequestCard':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              RequestCard Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Misma instancia de RequestCard con layout vertical optimizado
            </Typography>

            <div className="space-y-4">
              {/* Mobile-optimized RequestCard - Fixed prop names */}
              <RequestCard
                id="req-001"
                title="Solicitud de Equipos"
                description="Necesito una laptop nueva para el proyecto de desarrollo web"
                status="pending"
                priority="high"
                requestType="IT Equipment"
                requestDate="2024-01-15"
                className="w-full"
              />

              <RequestCard
                id="req-002"
                title="Permiso de Vacaciones"
                description="Solicito vacaciones del 15 al 25 de febrero"
                status="approved"
                priority="medium"
                requestType="HR"
                requestDate="2024-01-10"
                className="w-full"
              />

              <RequestCard
                id="req-003"
                title="Cambio de Oficina"
                description="Solicitud para cambiar a la oficina de Barcelona"
                status="in-progress"
                priority="low"
                requestType="Facilities"
                requestDate="2024-01-08"
                className="w-full"
              />
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Layout vertical con información prioritaria arriba
                </Typography>
                <Typography variant="p" size="sm">
                  • Badges y estados más prominentes
                </Typography>
                <Typography variant="p" size="sm">
                  • Swipe actions para interacciones rápidas
                </Typography>
                <Typography variant="p" size="sm">
                  • Avatar y metadata más grandes
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'ServiceCard':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              ServiceCard Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Misma instancia de ServiceCard con precio prominente y layout
              vertical
            </Typography>

            <div className="space-y-4">
              {/* Mobile-optimized ServiceCard */}
              <ServiceCard
                id="plan-basico"
                title="Plan Básico"
                description="Perfecto para equipos pequeños que están empezando"
                image={{
                  src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop',
                  alt: 'Plan Básico',
                }}
                price={{ amount: 29, currency: '€', period: 'mes' }}
                features={[
                  'Hasta 5 usuarios',
                  '10GB de almacenamiento',
                  'Soporte por email',
                  'Acceso a funciones básicas',
                ]}
                rating={{ value: 4.5, total: 128 }}
                status="active"
                className="w-full"
              />

              <ServiceCard
                id="plan-professional"
                title="Plan Professional"
                description="Ideal para equipos en crecimiento con necesidades avanzadas"
                image={{
                  src: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=200&fit=crop',
                  alt: 'Plan Professional',
                }}
                price={{ amount: 79, currency: '€', period: 'mes' }}
                features={[
                  'Hasta 25 usuarios',
                  '100GB de almacenamiento',
                  'Soporte prioritario',
                  'Integraciones avanzadas',
                  'Analytics y reportes',
                ]}
                rating={{ value: 4.8, total: 89 }}
                status="active"
                className="w-full"
              />
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Precio más prominente en la parte superior
                </Typography>
                <Typography variant="p" size="sm">
                  • Lista de características en formato vertical
                </Typography>
                <Typography variant="p" size="sm">
                  • CTAs más grandes y accesibles
                </Typography>
                <Typography variant="p" size="sm">
                  • Rating con estrellas más grandes
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'UserMenu':
        return (
          <div className="p-4 pb-20 space-y-4">
            <Typography variant="h3" weight="medium">
              UserMenu Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Misma instancia de UserMenu adaptada como bottom sheet en móvil
            </Typography>

            <div className="space-y-4">
              {/* Mobile UserMenu trigger */}
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={mockUser.avatar}
                    fallback={mockUser.name}
                    size="lg"
                    status={mockUser.status}
                  />
                  <div>
                    <Typography variant="p" weight="medium">
                      {mockUser.name}
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      {mockUser.email}
                    </Typography>
                  </div>
                </div>
                <Icon name="ChevronRight" size="sm" />
              </div>

              {/* Mobile menu options */}
              <div className="space-y-2">
                <Typography variant="h4" weight="medium" className="mb-3">
                  Opciones adaptadas para móvil:
                </Typography>

                {[
                  {
                    icon: 'User',
                    label: 'Mi Perfil',
                    description: 'Editar información personal',
                  },
                  {
                    icon: 'Settings',
                    label: 'Configuración',
                    description: 'Preferencias y ajustes',
                  },
                  {
                    icon: 'Bell',
                    label: 'Notificaciones',
                    description: 'Gestionar alertas',
                    badge: '3',
                  },
                  {
                    icon: 'HelpCircle',
                    label: 'Ayuda y Soporte',
                    description: 'Centro de ayuda',
                  },
                  {
                    icon: 'LogOut',
                    label: 'Cerrar Sesión',
                    description: 'Salir de la aplicación',
                    variant: 'destructive',
                  },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full h-auto p-4 justify-start ${
                      item.variant === 'destructive'
                        ? 'text-destructive hover:text-destructive'
                        : ''
                    }`}
                  >
                    <Icon name={item.icon as any} size="sm" className="mr-3" />
                    <div className="flex-1 text-left">
                      <Typography
                        variant="p"
                        size="sm"
                        weight="medium"
                        className="block"
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="p"
                        size="xs"
                        color="muted"
                        className="block"
                      >
                        {item.description}
                      </Typography>
                    </div>
                    {item.badge && (
                      <Badge variant="error" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <Icon name="ChevronRight" size="sm" className="ml-2" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Se convierte en bottom sheet o página completa
                </Typography>
                <Typography variant="p" size="sm">
                  • Avatar y información más grandes
                </Typography>
                <Typography variant="p" size="sm">
                  • Opciones con descripciones detalladas
                </Typography>
                <Typography variant="p" size="sm">
                  • Touch-friendly con áreas de toque grandes
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'ToggleSwitch':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              ToggleSwitch Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Misma instancia de ToggleSwitch con área de toque expandida para
              móvil
            </Typography>

            <div className="space-y-6">
              {/* Mobile-optimized ToggleSwitch examples */}
              <div className="space-y-4">
                <Typography variant="h4" weight="medium">
                  Configuraciones de la app:
                </Typography>

                <div className="space-y-4">
                  <ToggleSwitch
                    label="Notificaciones Push"
                    description="Recibir alertas en tiempo real"
                    checked={true}
                    className="p-4 bg-card border border-border rounded-lg touch-manipulation"
                  />

                  <ToggleSwitch
                    label="Modo Oscuro"
                    description="Activar tema oscuro para la aplicación"
                    checked={false}
                    className="p-4 bg-card border border-border rounded-lg touch-manipulation"
                  />

                  <ToggleSwitch
                    label="Sincronización Automática"
                    description="Sincronizar datos cuando esté conectado a WiFi"
                    checked={true}
                    className="p-4 bg-card border border-border rounded-lg touch-manipulation"
                  />

                  <ToggleSwitch
                    label="Ubicación"
                    description="Permitir acceso a la ubicación para funciones específicas"
                    checked={false}
                    className="p-4 bg-card border border-border rounded-lg touch-manipulation"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Typography variant="h4" weight="medium">
                  Con iconos para mejor comprensión:
                </Typography>

                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-card border border-border rounded-lg touch-manipulation">
                    <Icon
                      name="Volume2"
                      size="sm"
                      className="mr-3 text-primary"
                    />
                    <div className="flex-1">
                      <Typography variant="p" size="sm" weight="medium">
                        Sonidos de la App
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Reproducir sonidos para notificaciones
                      </Typography>
                    </div>
                    <ToggleSwitch checked={true} className="ml-3" />
                  </div>

                  <div className="flex items-center p-4 bg-card border border-border rounded-lg touch-manipulation">
                    <Icon name="Wifi" size="sm" className="mr-3 text-primary" />
                    <div className="flex-1">
                      <Typography variant="p" size="sm" weight="medium">
                        Solo WiFi
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Usar solo conexión WiFi para descargas
                      </Typography>
                    </div>
                    <ToggleSwitch checked={false} className="ml-3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Switch más grande para touch (44px mínimo)
                </Typography>
                <Typography variant="p" size="sm">
                  • Área de toque expandida a toda la fila
                </Typography>
                <Typography variant="p" size="sm">
                  • Labels y descripciones más prominentes
                </Typography>
                <Typography variant="p" size="sm">
                  • Feedback visual y haptic mejorados
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'Sidebar':
        return (
          <div className="h-full">
            <SidebarMobile
              user={mockUser}
              currentRoute="dashboard"
              onNavigate={(route) => console.log('Navigate to:', route)}
            />
            {/* Main content area to show the bottom nav context */}
            <div className="p-4 pb-20">
              <Typography variant="h3" weight="medium" className="mb-4">
                Sidebar Mobile Adaptation
              </Typography>
              <Typography variant="p" size="sm" color="muted" className="mb-6">
                Sidebar se convierte en Bottom Navigation usando las mismas
                instancias
              </Typography>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <Typography variant="h4" weight="medium" className="mb-2">
                    Contenido Principal
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    La navegación ahora está en la parte inferior de la pantalla
                  </Typography>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <Typography variant="h4" weight="medium" className="mb-2">
                    Adaptaciones Móviles:
                  </Typography>
                  <div className="space-y-1">
                    <Typography variant="p" size="sm">
                      • Se convierte en bottom navigation
                    </Typography>
                    <Typography variant="p" size="sm">
                      • Navigation drawer para items secundarios
                    </Typography>
                    <Typography variant="p" size="sm">
                      • Iconos prominentes con labels
                    </Typography>
                    <Typography variant="p" size="sm">
                      • Acceso rápido a funciones principales
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ORGANISMS MOBILE ADAPTATIONS
      case 'Header':
        return (
          <div className="space-y-4">
            <Typography variant="h3" weight="medium" className="p-4">
              Header Mobile Adaptation
            </Typography>

            {/* Mobile Header Instance */}
            <div className="relative">
              <Header
                user={mockUser}
                title="Dashboard"
                notificationsCount={3}
                onMenuToggle={() => console.log('Menu toggle')}
                onUserMenuClick={() => console.log('Profile')}
                onNotificationClick={() => console.log('Notifications')}
                className="h-14" // Altura reducida para móvil
              />
            </div>

            <div className="p-4 space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <Typography variant="h4" weight="medium" className="mb-2">
                  Adaptaciones Móviles:
                </Typography>
                <div className="space-y-1">
                  <Typography variant="p" size="sm">
                    • Altura reducida (56px) para maximizar contenido
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Hamburger menu para navegación lateral
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Título centrado y más prominente
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Notificaciones con badge más visible
                  </Typography>
                  <Typography variant="p" size="sm">
                    • Avatar más pequeño, acciones en overflow
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        );

      case 'DashboardSummary':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              DashboardSummary Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Organismo DashboardSummary con grid adaptativo para móvil
            </Typography>

            {/* Mobile Dashboard Instance */}
            <div className="space-y-4">
              <DashboardSummary
                metrics={[
                  {
                    id: 'total-requests',
                    title: 'Total de Solicitudes',
                    value: 24,
                    change: {
                      value: 12,
                      type: 'increase',
                      period: 'último mes',
                    },
                    icon: 'FileText',
                    color: 'primary',
                    description: 'Todas las solicitudes registradas',
                  },
                  {
                    id: 'pending-requests',
                    title: 'Solicitudes Pendientes',
                    value: 8,
                    change: {
                      value: 5,
                      type: 'decrease',
                      period: 'semana pasada',
                    },
                    icon: 'Clock',
                    color: 'warning',
                    description: 'Esperando aprobación',
                  },
                  {
                    id: 'approved-requests',
                    title: 'Solicitudes Aprobadas',
                    value: 16,
                    change: {
                      value: 8,
                      type: 'increase',
                      period: 'último mes',
                    },
                    icon: 'CheckCircle',
                    color: 'success',
                    description: 'Aprobadas y en proceso',
                  },
                  {
                    id: 'completed-requests',
                    title: 'Solicitudes Completadas',
                    value: 12,
                    change: {
                      value: 15,
                      type: 'increase',
                      period: 'último mes',
                    },
                    icon: 'Check',
                    color: 'secondary',
                    description: 'Finalizadas exitosamente',
                  },
                ]}
                onMetricClick={(metricId) =>
                  console.log('Metric clicked:', metricId)
                }
                className="grid grid-cols-1 sm:grid-cols-2 gap-4" // Mobile-first grid
              />
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Grid de 1-2 columnas en lugar de 4
                </Typography>
                <Typography variant="p" size="sm">
                  • Cards más altas con métricas prominentes
                </Typography>
                <Typography variant="p" size="sm">
                  • Scroll horizontal para métricas adicionales
                </Typography>
                <Typography variant="p" size="sm">
                  • Gráficos simplificados para pantalla pequeña
                </Typography>
                <Typography variant="p" size="sm">
                  • Touch interactions para ver detalles
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'RequestsList':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              RequestsList Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Organismo RequestsList optimizado para navegación móvil
            </Typography>

            {/* Mobile RequestsList Instance */}
            <div className="space-y-4">
              <RequestsList
                requests={mockRequests}
                showCompleted={false}
                onRequestClick={(id) => console.log('Request clicked:', id)}
                onNewRequest={() => console.log('New request')}
                onFilterChange={(filters) =>
                  console.log('Filters changed:', filters)
                }
                className="space-y-3" // Más spacing entre cards
              />
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Lista vertical de cards full-width
                </Typography>
                <Typography variant="p" size="sm">
                  • Filtros en bottom sheet o modal
                </Typography>
                <Typography variant="p" size="sm">
                  • Pull-to-refresh functionality
                </Typography>
                <Typography variant="p" size="sm">
                  • Infinite scroll en lugar de paginación
                </Typography>
                <Typography variant="p" size="sm">
                  • Swipe actions en RequestCards
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'RequestDetail':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              RequestDetail Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Vista detallada optimizada para pantalla completa en móvil
            </Typography>

            <div className="space-y-4">
              {/* Mobile-optimized request detail layout */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Header section */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="warning" size="sm">
                      Pendiente
                    </Badge>
                    <Badge variant="error" size="sm">
                      Alta Prioridad
                    </Badge>
                  </div>
                  <Typography variant="h3" weight="medium" className="mb-2">
                    Solicitud de Equipos
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    ID: req-001 • 15 Ene 2024
                  </Typography>
                </div>

                {/* Content sections */}
                <div className="p-4 space-y-4">
                  <div>
                    <Typography variant="h4" weight="medium" className="mb-2">
                      Descripción
                    </Typography>
                    <Typography variant="p" size="sm">
                      Necesito una laptop nueva para el proyecto de desarrollo
                      web que estamos iniciando.
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="h4" weight="medium" className="mb-2">
                      Detalles
                    </Typography>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Typography variant="p" size="sm" color="muted">
                          Tipo:
                        </Typography>
                        <Typography variant="p" size="sm">
                          IT Equipment
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="p" size="sm" color="muted">
                          Solicitante:
                        </Typography>
                        <Typography variant="p" size="sm">
                          Ana García
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions bar fixed at bottom */}
                <div className="p-4 border-t border-border bg-neutral-50">
                  <div className="flex space-x-2">
                    <Button variant="primary" className="flex-1">
                      Aprobar
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Rechazar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Layout full-screen en móvil
                </Typography>
                <Typography variant="p" size="sm">
                  • Acciones principales en bottom bar fijo
                </Typography>
                <Typography variant="p" size="sm">
                  • Información en secciones colapsables
                </Typography>
                <Typography variant="p" size="sm">
                  • Timeline vertical compacto
                </Typography>
                <Typography variant="p" size="sm">
                  • Gestos swipe para navegación
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'NewRequestWizard':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              NewRequestWizard Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Wizard multi-paso optimizado para móvil con navegación prominent
            </Typography>

            <div className="space-y-4">
              {/* Progress indicator */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h4" weight="medium">
                    Paso 2 de 4
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    50%
                  </Typography>
                </div>
                <div className="w-full bg-neutral-300 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>

              {/* Current step content */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                <Typography variant="h3" weight="medium">
                  Detalles de la Solicitud
                </Typography>

                <FormField
                  label="Título de la solicitud"
                  required
                  placeholder="Ej: Solicitud de laptop"
                  className="h-12"
                />

                <FormField
                  label="Descripción detallada"
                  type="textarea"
                  placeholder="Describe tu solicitud..."
                  className="h-24 resize-none"
                />

                <FormField
                  label="Categoría"
                  type="select"
                  placeholder="Seleccionar categoría"
                  className="h-12"
                  options={[
                    { value: 'it', label: 'IT Equipment' },
                    { value: 'hr', label: 'Recursos Humanos' },
                    { value: 'facilities', label: 'Instalaciones' },
                  ]}
                />
              </div>

              {/* Navigation buttons - Fixed at bottom */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1 h-12">
                    Anterior
                  </Button>
                  <Button variant="primary" className="flex-1 h-12">
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Full-screen con steps prominentes
                </Typography>
                <Typography variant="p" size="sm">
                  • Bottom bar para navegación entre pasos
                </Typography>
                <Typography variant="p" size="sm">
                  • Progress indicator en top visible
                </Typography>
                <Typography variant="p" size="sm">
                  • Formularios optimizados para touch
                </Typography>
                <Typography variant="p" size="sm">
                  • Validación step-by-step visual
                </Typography>
              </div>
            </div>
          </div>
        );

      case 'Table':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              Table Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Tabla que se convierte en lista de cards en móvil
            </Typography>

            <div className="space-y-4">
              {/* Mobile table as card list */}
              <div className="space-y-3">
                {mockRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Typography
                          variant="h4"
                          weight="medium"
                          className="mb-1"
                        >
                          {request.title}
                        </Typography>
                        <Typography variant="p" size="sm" color="muted">
                          ID: {request.id}
                        </Typography>
                      </div>
                      <Badge
                        variant={
                          request.status === 'pending' ? 'warning' : 'success'
                        }
                        size="sm"
                      >
                        {request.status === 'pending'
                          ? 'Pendiente'
                          : 'Aprobado'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Typography variant="p" size="sm" color="muted">
                          Tipo:
                        </Typography>
                        <Typography variant="p" size="sm">
                          {request.requestType}
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="p" size="sm" color="muted">
                          Fecha:
                        </Typography>
                        <Typography variant="p" size="sm">
                          {request.requestDate}
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="p" size="sm" color="muted">
                          Prioridad:
                        </Typography>
                        <Badge
                          variant={
                            request.priority === 'high' ? 'error' : 'warning'
                          }
                          size="sm"
                        >
                          {request.priority === 'high' ? 'Alta' : 'Media'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 pt-3 border-t border-border">
                      <Button variant="ghost" size="sm" className="flex-1">
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search and filters */}
              <div className="bg-card border border-border rounded-lg p-4">
                <FormField
                  label="Buscar"
                  placeholder="Buscar solicitudes..."
                  className="h-12"
                />

                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Filtros
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Ordenar
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Se convierte en lista de cards
                </Typography>
                <Typography variant="p" size="sm">
                  • Columnas importantes como headers de card
                </Typography>
                <Typography variant="p" size="sm">
                  • Acciones en bottom de cada card
                </Typography>
                <Typography variant="p" size="sm">
                  • Filtros en bottom sheet expandible
                </Typography>
                <Typography variant="p" size="sm">
                  • Swipe actions para acciones rápidas
                </Typography>
              </div>
            </div>
          </div>
        );

      // Continue with more organisms...
      case 'AuthForm':
        return (
          <div className="p-4 space-y-4">
            <Typography variant="h3" weight="medium">
              AuthForm Mobile Adaptation
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Formulario de autenticación optimizado para móvil
            </Typography>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <Typography variant="h3" weight="medium" className="mb-2">
                    Iniciar Sesión
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Ingresa tus credenciales para continuar
                  </Typography>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Email"
                    required
                    type="email"
                    placeholder="tu@email.com"
                    className="h-12"
                  />

                  <FormField
                    label="Contraseña"
                    required
                    type="password"
                    placeholder="••••••••"
                    className="h-12"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <Typography variant="p" size="sm">
                        Recordarme
                      </Typography>
                    </label>
                    <Button variant="ghost" size="sm">
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="primary" className="w-full h-12">
                    Iniciar Sesión
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">
                        O continúa con
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12">
                      <Icon name="Mail" size="sm" className="mr-2" />
                      Google
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Icon name="Github" size="sm" className="mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <Typography variant="h4" weight="medium" className="mb-2">
                Adaptaciones Móviles:
              </Typography>
              <div className="space-y-1">
                <Typography variant="p" size="sm">
                  • Campos optimizados para touch (44px+)
                </Typography>
                <Typography variant="p" size="sm">
                  • Keyboard types específicos por campo
                </Typography>
                <Typography variant="p" size="sm">
                  • Botones de login social más prominentes
                </Typography>
                <Typography variant="p" size="sm">
                  • Auto-focus y navegación con teclado
                </Typography>
                <Typography variant="p" size="sm">
                  • Validación visual inmediata
                </Typography>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <Typography variant="h3" weight="medium" className="mb-4">
              Adaptación Móvil de {componentName}
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              Este componente incluye adaptaciones específicas para móvil usando
              las mismas instancias del design system.
            </Typography>
          </div>
        );
    }
  };

  const renderComponent = () => {
    // Si estamos en modo móvil y el componente tiene adaptaciones, mostrar la versión móvil
    if (viewMode === 'mobile') {
      const componentData = (componentsData as any)[componentName];
      if (componentData?.hasMobileVersion) {
        return getMobileContainer(renderMobileAdaptation(componentName));
      }
    }

    // Renderizado normal de componentes
    switch (componentName) {
      // ATOMS
      case 'Typography':
        return <TypographyDemo />;
      case 'Icon':
        return <IconDemo />;
      case 'Badge':
        return <BadgeDemo />;
      case 'Button':
        return <ButtonDemo />;
      case 'Input':
        return <InputDemo />;
      case 'Checkbox':
        return <CheckboxDemo />;
      case 'RadioGroup':
        return <RadioGroupDemo />;
      case 'Avatar':
        return <AvatarDemo />;
      case 'PreviewImage':
        return <PreviewImageDemo />;
      case 'Spinner':
        return <SpinnerDemo />;
      case 'Tooltip':
        return <TooltipDemo />;
      case 'Chip':
        return <ChipDemo />;

      // MOLECULES
      case 'FormField':
        return <FormFieldDemo />;
      case 'IconButton':
        return <IconButtonDemo />;
      case 'NotificationDot':
        return <NotificationDotDemo />;
      case 'Card':
        return <CardDemo />;
      case 'RequestCard':
        return <RequestCardDemo />;
      case 'ServiceCard':
        return <ServiceCardDemo />;
      case 'UserMenu':
        return <UserMenuDemo />;
      case 'ToggleSwitch':
        return <ToggleSwitchDemo />;

      // ORGANISMS
      case 'Sidebar':
        return <SidebarDemo />;
      case 'Header':
        return <HeaderDemo />;
      case 'DashboardSummary':
        return <DashboardSummaryDemo />;
      case 'RequestsList':
        return <RequestsListDemo />;
      case 'RequestDetail':
        return <RequestDetailDemo />;
      case 'Table':
        return <TableDemo />;
      case 'NewRequestWizard':
        return <NewRequestWizardDemo />;
      case 'ProfileForm':
        return <ProfileFormDemo />;
      case 'ServicesList':
        return <ServicesListDemo />;
      case 'ServiceEditor':
        return <ServiceEditorDemo />;
      case 'EmailTemplatesMgr':
        return <EmailTemplatesMgrDemo />;
      case 'UsersList':
        return <UsersListDemo />;
      case 'CalendarView':
        return <CalendarViewDemo />;
      case 'NotificationsPanel':
        return <NotificationsPanelDemo />;
      case 'HeroSection':
        return <HeroSectionDemo />;
      case 'AuthForm':
        return <AuthFormDemo />;

      // TEMPLATES
      case 'LandingPage':
        return <LandingPageDemo />;
      case 'LoginPage':
        return <LoginPageDemo />;
      case 'DashboardPage':
        return <DashboardPageDemo />;
      case 'RegisterPage':
        return <RegisterPageDemo />;
      case 'PasswordResetPage':
        return <PasswordResetPageDemo />;
      case 'WorkLocationsPage':
        return <WorkLocationsPageDemo />;

      case 'NotificationsPage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <NotificationsPage
                  user={mockUser}
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      case 'RequestsListPage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <RequestsListPage
                  user={mockUser}
                  userRole="client"
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      case 'RequestDetailPage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <RequestDetailPage
                  user={mockUser}
                  userRole="client"
                  requestId="req-001"
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      case 'ProfilePage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <ProfilePage
                  user={mockUser}
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      case 'ServicesListPage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <ServicesListPage
                  user={mockUser}
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      case 'CalendarPage':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div
                className="border border-border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <CalendarPage
                  user={mockUser}
                  onNavigate={(route) => console.log('Navegar a:', route)}
                />
              </div>
            </div>
          </div>
        );

      // DESIGN SYSTEM
      case 'Design Tokens':
        return <DesignTokensDemo />;
      case 'Branding':
        return <BrandingDemo />;

      default:
        return <DefaultDemo />;
    }
  };

  return <div className="p-8">{renderComponent()}</div>;
};

export default ComponentDemo;
