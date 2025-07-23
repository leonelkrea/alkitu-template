import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import UserMenu from '../molecules/UserMenu';
import NotificationDot from '../molecules/NotificationDot';
import IconButton from '../molecules/IconButton';
import { Sheet, SheetContent, SheetTrigger } from '../../../components/ui/sheet';
import Input from '../atoms/Input';

export interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  notificationsCount?: number;
  onSearch?: (query: string) => void;
  onNotificationsToggle?: () => void;
  onNotificationClick?: () => void;
  onUserMenuClick?: () => void;
  onSearchSubmit?: (query: string) => void;
  onMenuToggle?: () => void;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  user,
  title = 'Dashboard',
  subtitle = 'Bienvenido de vuelta',
  showSearch = true,
  notificationsCount = 0,
  onSearch,
  onNotificationsToggle,
  onNotificationClick,
  onUserMenuClick,
  onSearchSubmit,
  onMenuToggle,
  onLogout,
  onNavigate,
  currentRoute = 'dashboard',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      } else if (onSearch) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else if (onNotificationsToggle) {
      onNotificationsToggle();
    }
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const handleUserMenuClick = () => {
    if (onUserMenuClick) {
      onUserMenuClick();
    }
  };

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  // Navigation items (same as Sidebar)
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: null },
    { id: 'requests', label: 'Solicitudes', icon: 'FileText', badge: '12' },
    { id: 'calendar', label: 'Calendario', icon: 'Calendar', badge: null },
    { id: 'services', label: 'Servicios', icon: 'Briefcase', badge: null },
    { id: 'notifications', label: 'Notificaciones', icon: 'Bell', badge: '5' },
    { id: 'profile', label: 'Mi Perfil', icon: 'User', badge: null },
    { id: 'locations', label: 'Ubicaciones', icon: 'MapPin', badge: null },
  ];

  const customMenuItems = [
    {
      label: 'Ver perfil',
      icon: 'User',
      onClick: () => console.log('Ver perfil'),
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      onClick: () => console.log('Configuración'),
    },
    {
      label: 'Notificaciones',
      icon: 'Bell',
      onClick: handleNotificationsClick,
    },
    {
      label: 'Ayuda y soporte',
      icon: 'HelpCircle',
      onClick: () => console.log('Ayuda'),
    },
    {
      label: 'Cerrar sesión',
      icon: 'LogOut',
      onClick: onLogout || (() => console.log('Logout')),
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header 
        className={`
          hidden md:flex bg-card border-b border-border px-6 py-4 items-center justify-between
          ${className}
        `}
      >
        {/* Desktop Left Section */}
        <div className="flex items-center space-x-4">
          <div>
            <Typography variant="h2" weight="medium" className="mb-1">
              {title}
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              {subtitle}
            </Typography>
          </div>
        </div>

        {/* Desktop Center Section - Search */}
        {showSearch && (
          <div className="flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon 
                    name="Search" 
                    size="sm" 
                    color={isSearchFocused ? 'primary' : 'muted'} 
                  />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Buscar solicitudes, servicios, usuarios..."
                  className="
                    w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary
                    placeholder-muted-foreground transition-colors duration-200
                  "
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Icon name="X" size="sm" color="muted" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Desktop Right Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <IconButton
              icon="Plus"
              iconOnly
              variant="outline"
              tooltip="Nueva solicitud"
              onClick={() => console.log('Nueva solicitud')}
            />
            
            <IconButton
              icon="Settings"
              iconOnly
              variant="ghost"
              tooltip="Configuración rápida"
              onClick={() => console.log('Configuración')}
            />
          </div>

          <NotificationDot 
            count={notificationsCount}
            variant="error"
            max={99}
          >
            <IconButton
              icon="Bell"
              iconOnly
              variant="ghost"
              tooltip="Notificaciones"
              onClick={handleNotificationsClick}
            />
          </NotificationDot>

          <IconButton
            icon="Sun"
            iconOnly
            variant="ghost"
            tooltip="Cambiar tema"
            onClick={() => console.log('Toggle theme')}
          />

          <div className="pl-4 border-l border-border">
            <div onClick={handleUserMenuClick}>
              <UserMenu
                user={user}
                menuItems={customMenuItems}
                showStatus={true}
                size="md"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <IconButton
              icon="Menu"
              iconOnly
              variant="ghost"
              className="min-w-11 min-h-11"
              onClick={handleMenuToggle}
            />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-design-primary rounded-lg flex items-center justify-center">
                    <Typography variant="h4" weight="bold" className="text-white">
                      L
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h4" weight="medium">
                      LOGO
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Sistema de Gestión
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Search in Menu */}
              <div className="p-4 border-b border-border">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Search" size="sm" color="muted" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="
                        w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary
                        placeholder-muted-foreground transition-colors duration-200
                        text-base
                      "
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </form>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-4">
                <nav className="space-y-1 px-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors
                        ${currentRoute === item.id 
                          ? 'bg-design-primary text-white' 
                          : 'hover:bg-accent text-foreground'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon 
                          name={item.icon as any} 
                          size="sm" 
                          color={currentRoute === item.id ? 'white' : 'default'}
                        />
                        <Typography 
                          variant="p" 
                          size="sm" 
                          weight="medium"
                          className={currentRoute === item.id ? 'text-white' : ''}
                        >
                          {item.label}
                        </Typography>
                      </div>
                      {item.badge && (
                        <div className="bg-error text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Menu Footer */}  
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-3 mb-4">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-design-primary rounded-full flex items-center justify-center">
                      <Typography variant="p" size="sm" weight="bold" className="text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </Typography>
                    </div>
                  )}
                  <div className="flex-1">
                    <Typography variant="p" size="sm" weight="medium">
                      {user.name}
                    </Typography>
                    <Typography variant="p" size="xs" color="muted">
                      {user.email}
                    </Typography>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-10"
                    onClick={() => console.log('Configuración')}
                  >
                    <Icon name="Settings" size="sm" className="mr-3" />
                    Configuración
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-10 text-destructive hover:text-destructive"
                    onClick={onLogout}
                  >
                    <Icon name="LogOut" size="sm" className="mr-3" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Typography variant="h3" weight="bold" className="text-design-primary">
          LOGO
        </Typography>

        {/* Notifications */}
        <NotificationDot 
          count={notificationsCount}
          variant="error"
          max={99}
        >
          <IconButton
            icon="Bell"
            iconOnly
            variant="ghost"
            className="min-w-11 min-h-11"
            onClick={handleNotificationsClick}
          />
        </NotificationDot>
      </header>
    </>
  );
};

export default Header;