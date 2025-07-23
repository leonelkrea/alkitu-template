import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';

export interface SidebarMobileProps {
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

const SidebarMobile: React.FC<SidebarMobileProps> = ({
  user,
  currentRoute = 'dashboard',
  onNavigate,
  className = '',
  ...props
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const mainNavItems = [
    {
      key: 'dashboard',
      label: 'Inicio',
      icon: 'Home',
      route: '/dashboard'
    },
    {
      key: 'requests',
      label: 'Solicitudes',
      icon: 'FileText',
      route: '/requests',
      badge: 3
    },
    {
      key: 'calendar',
      label: 'Calendario',
      icon: 'Calendar',
      route: '/calendar'
    },
    {
      key: 'profile',
      label: 'Perfil',
      icon: 'User',
      route: '/profile'
    }
  ];

  const drawerItems = [
    {
      key: 'notifications',
      label: 'Notificaciones',
      icon: 'Bell',
      route: '/notifications',
      badge: 5
    },
    {
      key: 'services',
      label: 'Servicios',
      icon: 'Grid3x3',
      route: '/services'
    },
    {
      key: 'locations',
      label: 'Ubicaciones',
      icon: 'MapPin',
      route: '/locations'
    },
    {
      key: 'settings',
      label: 'Configuración',
      icon: 'Settings',
      route: '/settings'
    }
  ];

  const handleNavigation = (route: string) => {
    setShowDrawer(false);
    onNavigate?.(route);
  };

  return (
    <>
      {/* Bottom Navigation usando componentes del design system */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-card border-t border-border
        safe-area-pb
        ${className}
      `} {...props}>
        <div className="flex justify-around items-center py-1">
          {mainNavItems.map((item) => {
            const isActive = currentRoute === item.key;
            return (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.route)}
                className={`
                  flex flex-col items-center py-2 px-3 min-w-0 flex-1 h-auto
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                <div className="relative mb-1">
                  <Icon 
                    name={item.icon as any} 
                    size="sm" 
                    className={isActive ? 'text-primary' : 'text-muted-foreground'} 
                  />
                  
                  {item.badge && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="error" size="sm">
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <Typography 
                  variant="p" 
                  size="xs" 
                  className={`
                    truncate max-w-full
                    ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {item.label}
                </Typography>
              </Button>
            );
          })}
          
          {/* Menu button for drawer */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDrawer(true)}
            className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 h-auto text-muted-foreground"
          >
            <Icon name="Menu" size="sm" className="mb-1" />
            <Typography variant="p" size="xs" className="text-muted-foreground truncate">
              Más
            </Typography>
          </Button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {showDrawer && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Navigation Drawer usando componentes del design system */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-80 bg-card z-[70]
        transform transition-transform duration-300 ease-in-out
        ${showDrawer ? 'translate-x-0' : 'translate-x-full'}
        shadow-lg border-l border-border
      `}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user.avatar}
              fallback={user.name}
              size="md"
              status={user.status}
            />
            <div>
              <Typography variant="p" weight="medium" size="sm">
                {user.name}
              </Typography>
              <Typography variant="p" size="xs" color="muted">
                {user.email}
              </Typography>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDrawer(false)}
            className="w-8 h-8 p-0"
          >
            <Icon name="X" size="sm" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {drawerItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                onClick={() => handleNavigation(item.route)}
                className="w-full justify-start h-auto px-4 py-3"
              >
                <Icon name={item.icon as any} size="sm" className="mr-3" />
                <Typography variant="p" size="sm" className="flex-1 text-left">
                  {item.label}
                </Typography>
                {item.badge && (
                  <Badge variant="error" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="mt-8 px-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/logout')}
              className="w-full justify-start h-auto px-4 py-3 text-destructive"
            >
              <Icon name="LogOut" size="sm" className="mr-3" />
              <Typography variant="p" size="sm">
                Cerrar Sesión
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMobile;