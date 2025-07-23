import React, { useState } from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

export interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  currentRoute = 'dashboard',
  onNavigate,
  className = '',
  ...props
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsCount] = useState(5);

  const handleLogout = () => {
    console.log('Logout');
    if (onNavigate) {
      onNavigate('/login');
    }
  };

  const handleNotificationsToggle = () => {
    console.log('Toggle notifications');
    if (onNavigate) {
      onNavigate('/app/notifications');
    }
  };

  return (
    <div className={`min-h-screen bg-background flex ${className}`} {...props}>
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          user={user}
          title={getPageTitle(currentRoute)}
          subtitle={getPageSubtitle(currentRoute)}
          notificationsCount={notificationsCount}
          onNotificationsToggle={handleNotificationsToggle}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper functions
const getPageTitle = (route: string) => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    notifications: 'Notificaciones',
    requests: 'Solicitudes',
    services: 'Servicios',
    calendar: 'Calendario',
    users: 'Usuarios',
    profile: 'Mi Perfil',
    locations: 'Ubicaciones',
    templates: 'Plantillas Email'
  };
  return titles[route] || 'WorkFlow Pro';
};

const getPageSubtitle = (route: string) => {
  const subtitles: Record<string, string> = {
    dashboard: 'Resumen general del sistema',
    notifications: 'Mantente al día con las actualizaciones',
    requests: 'Gestiona las solicitudes de servicio',
    services: 'Configura el catálogo de servicios',
    calendar: 'Visualiza eventos y programación',
    users: 'Administra usuarios del sistema',
    profile: 'Configura tu información personal',
    locations: 'Gestiona ubicaciones de trabajo',
    templates: 'Personaliza plantillas de correo'
  };
  return subtitles[route] || 'Sistema de gestión de solicitudes';
};

export default MainLayout;