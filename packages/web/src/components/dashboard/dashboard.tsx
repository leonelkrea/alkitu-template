'use client';
import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import {
  Home,
  Users,
  Settings,
  BarChart,
  TrendingUp,
  FileText,
  Bell,
  Calendar,
  Activity,
  MessageCircle,
  CreditCard,
  Building2,
} from 'lucide-react';
import { AppSidebar } from '../app-sidebar';
import Header from '../layout/header';
import TailwindGrid from '../grid/TailwindGrid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { useTranslations } from '@/context/TranslationContext';

// Navigation structure with improved UX/UI organization
const getTransformedData = (t: any) => ({
  navMain: [
    // RESUMEN SECTION
    {
      title: t?.('nav.dashboard') || 'Dashboard',
      url: '/dashboard',
      icon: Home,
      items: [],
      section: 'overview',
    },

    // GESTIÓN SECTION
    {
      title: t?.('nav.users') || 'Usuarios',
      url: '/dashboard/users',
      icon: Users,
      section: 'management',
      items: [
        {
          title: t?.('nav.userList') || 'Lista de Usuarios',
          url: '/dashboard/users',
        },
        {
          title: t?.('nav.createUser') || 'Crear Usuario',
          url: '/dashboard/users/create',
        },
      ],
    },
    {
      title: t?.('nav.companies') || 'Empresas',
      url: '/dashboard/companies',
      icon: Building2,
      section: 'management',
      items: [
        {
          title: t?.('nav.companiesList') || 'Todas las Empresas',
          url: '/dashboard/companies',
        },
        {
          title: t?.('nav.createCompany') || 'Nueva Empresa',
          url: '/dashboard/companies/create',
        },
      ],
    },

    // COMUNICACIÓN SECTION
    {
      title: t?.('nav.chat') || 'Chat',
      url: '/dashboard/chat',
      icon: MessageCircle,
      section: 'communication',
      items: [
        {
          title: t?.('nav.conversations') || 'Conversaciones',
          url: '/dashboard/chat',
        },
        {
          title: t?.('nav.chatAnalytics') || 'Analíticas Chat',
          url: '/dashboard/chat/analytics',
        },
      ],
    },
    {
      title: t?.('nav.notifications') || 'Notificaciones',
      url: '/dashboard/notifications',
      icon: Bell,
      section: 'communication',
      items: [
        {
          title: t?.('nav.allNotifications') || 'Todas las Notificaciones',
          url: '/dashboard/notifications',
        },
        {
          title: t?.('nav.notificationAnalytics') || 'Analíticas',
          url: '/dashboard/notifications/analytics',
        },
        {
          title: t?.('nav.notificationPreferences') || 'Preferencias',
          url: '/dashboard/notifications/preferences',
        },
      ],
    },

    // ANALÍTICAS SECTION
    {
      title: t?.('nav.analytics') || 'Analíticas',
      url: '/dashboard/analytics',
      icon: BarChart,
      section: 'analytics',
      items: [
        {
          title: t?.('nav.reports') || 'Reportes',
          url: '/dashboard/analytics/reports',
        },
        {
          title: t?.('nav.insights') || 'Insights',
          url: '/dashboard/analytics/insights',
        },
      ],
    },

    // CONFIGURACIÓN SECTION
    {
      title: t?.('nav.settings') || 'Configuración',
      url: '/dashboard/settings',
      icon: Settings,
      section: 'settings',
      items: [
        {
          title: t?.('nav.themes') || 'Temas y Apariencia',
          url: '/dashboard/settings/themes',
        },
        {
          title: t?.('nav.chatbot') || 'Chatbot',
          url: '/dashboard/settings/chatbot',
        },
        {
          title: t?.('nav.billing') || 'Facturación',
          url: '/dashboard/billing',
        },
        {
          title: t?.('nav.themes3') || 'Temas 3.0',
          url: 'http://localhost:3000/es/dashboard/settings/themes-3.0',
        },
        {
          title: t?.('nav.profile') || 'Mi Perfil',
          url: '/dashboard/settings/profile',
        },
      ],
    },
  ],
  projects: [
    {
      name: t?.('projects.alkitu') || 'Alkitu Platform',
      url: '/dashboard/projects/alkitu',
      icon: Activity,
    },
  ],
  user: {
    id: '',
    name: '',
    email: '',
    avatar: '/avatars/default.jpg',
  },
  teams: [
    {
      name: t?.('teams.development') || 'Development Team',
      logo: Activity,
      plan: 'Enterprise',
      routes: [
        {
          id: 'team-dashboard',
          icon: 'home',
          path: '/dashboard/team',
          translations: {
            en: 'Team Dashboard',
            es: 'Panel del Equipo',
          },
        },
        {
          id: 'team-projects',
          icon: 'folder',
          path: '/dashboard/team/projects',
          translations: {
            en: 'Team Projects',
            es: 'Proyectos del Equipo',
          },
        },
      ],
    },
  ],
});

interface DashboardProps {
  children?: React.ReactNode;
  showWelcome?: boolean;
}

function Dashboard({ children, showWelcome = false }: DashboardProps) {
  const t = useTranslations('dashboard');
  const transformedData = getTransformedData(t);

  return (
    <SidebarProvider>
      <AppSidebar {...transformedData} />

      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        <div className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <div className="w-full col-start-1 col-end-full ">
            <Header
              type="admin"
              homeLabel={t?.('dashboard') || 'Dashboard'}
              dropdownSliceEnd={-1}
              separator
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TailwindGrid fullSize={true} padding="lg" className="py-6">
            {showWelcome && <DashboardWelcome />}
            <div className="col-span-4 md:col-span-8 lg:col-span-12">
              {children || <DashboardOverview />}
            </div>
          </TailwindGrid>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Dashboard Welcome Section
function DashboardWelcome() {
  const t = useTranslations('dashboard');

  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-12 mb-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {t?.('welcome.title') || 'Welcome to Alkitu Dashboard'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t?.('welcome.description') ||
              'Manage your projects, users, and analytics from one place.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {t?.('welcome.status') || 'System Online'}
            </Badge>
            <Badge variant="default">
              {t?.('welcome.version') || 'v1.0.0'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Overview Section
function DashboardOverview() {
  const t = useTranslations('dashboard');

  return (
    <>
      {/* Quick Stats */}
      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.totalUsers') || 'Total Users'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.activeProjects') || 'Active Projects'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +8% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.revenue') || 'Revenue'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20% {t?.('stats.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t?.('stats.notifications') || 'Notifications'}
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              {t?.('stats.unread') || 'unread messages'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="col-span-4 md:col-span-4 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {t?.('recentActivity.title') || 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {t?.('recentActivity.description') ||
                'Latest updates from your projects'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: 'Luis Urdaneta',
                  action: 'completed project setup',
                  time: '2 hours ago',
                },
                {
                  user: 'Sarah Chen',
                  action: 'added new user permissions',
                  time: '4 hours ago',
                },
                {
                  user: 'Mike Johnson',
                  action: 'updated analytics dashboard',
                  time: '6 hours ago',
                },
                {
                  user: 'Anna Rodriguez',
                  action: 'created new project',
                  time: '8 hours ago',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="col-span-4 md:col-span-4 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>{t?.('progress.title') || 'Project Progress'}</CardTitle>
            <CardDescription>
              {t?.('progress.description') ||
                'Overview of current project status'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alkitu Platform</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mobile App</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Integration</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              {t?.('progress.viewAll') || 'View All Projects'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
