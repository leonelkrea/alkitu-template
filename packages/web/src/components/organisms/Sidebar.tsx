import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import UserMenu from '../molecules/UserMenu';
import Brand from '../atoms/Brand';

export interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentRoute = 'dashboard',
  onNavigate,
  onLogout,
  className = '',
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      badge: null,
    },
    {
      id: 'requests',
      label: 'Solicitudes',
      icon: 'FileText',
      badge: { count: 5, variant: 'warning' as const },
    },
    {
      id: 'services',
      label: 'Servicios',
      icon: 'Settings',
      badge: null,
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: 'Calendar',
      badge: null,
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'Users',
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'Bell',
      badge: { count: 12, variant: 'error' as const },
    },
    {
      id: 'templates',
      label: 'Plantillas Email',
      icon: 'Mail',
      badge: null,
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: 'User',
      badge: null,
    },
  ];

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const customMenuItems = [
    {
      label: 'Ver perfil',
      icon: 'User',
      onClick: () => handleNavigation('profile'),
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      onClick: () => handleNavigation('settings'),
    },
    {
      label: 'Tema',
      icon: 'Palette',
      onClick: () => console.log('Cambiar tema'),
    },
    {
      label: 'Ayuda',
      icon: 'HelpCircle',
      onClick: () => console.log('Mostrar ayuda'),
    },
    {
      label: 'Cerrar sesión',
      icon: 'LogOut',
      onClick: handleLogout,
      variant: 'destructive' as const,
    },
  ];

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-16' : 'w-80'} 
        bg-card border-r border-border flex flex-col transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}
          >
            {/* Logo dinámico basado en estado collapsed */}
            {isCollapsed ? (
              <Brand variant="icon" size="md" />
            ) : (
              <Brand variant="horizontal" size="md" />
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            <Icon
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              size="sm"
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentRoute === item.id ? 'primary' : 'ghost'}
              size="md"
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full h-12 px-4 justify-start
                ${isCollapsed ? 'px-0 justify-center' : ''}
                ${currentRoute === item.id ? '' : 'text-foreground hover:bg-accent'}
              `}
            >
              <Icon
                name={item.icon as any}
                size="md"
                className={isCollapsed ? '' : 'mr-3'}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge.variant}
                      size="sm"
                      className="ml-auto"
                    >
                      {item.badge.count}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          ))}
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <UserMenu
            user={user}
            menuItems={customMenuItems}
            showStatus={true}
            size="md"
          />
        ) : (
          <div className="flex justify-center">
            <UserMenu
              user={user}
              menuItems={customMenuItems}
              showStatus={true}
              size="sm"
              className="w-12"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <Typography variant="p" size="xs" color="muted">
              v2.1.0 • Sistema de Gestión
            </Typography>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
