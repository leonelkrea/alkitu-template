import React from 'react';
import SidebarMobile from '../organisms/SidebarMobile';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';

export interface MainLayoutMobileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  pageActions?: React.ReactNode;
}

const MainLayoutMobile: React.FC<MainLayoutMobileProps> = ({
  user,
  currentRoute,
  onNavigate,
  children,
  className = '',
  pageTitle,
  pageActions,
  ...props
}) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`} {...props}>
      {/* Mobile Header */}
      <header className="bg-white border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {pageTitle ? (
              <Typography variant="h4" weight="medium">
                {pageTitle}
              </Typography>
            ) : (
              <Typography variant="h4" weight="medium">
                {getCurrentPageTitle(currentRoute)}
              </Typography>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {pageActions}
            
            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent">
              <Icon name="Bell" size="sm" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <SidebarMobile
        user={user}
        currentRoute={currentRoute}
        onNavigate={onNavigate}
      />
    </div>
  );
};

// Helper function to get page title based on route
const getCurrentPageTitle = (route?: string): string => {
  switch (route) {
    case 'dashboard':
      return 'Inicio';
    case 'requests':
      return 'Solicitudes';
    case 'calendar':
      return 'Calendario';
    case 'notifications':
      return 'Notificaciones';
    case 'profile':
      return 'Perfil';
    case 'services':
      return 'Servicios';
    case 'locations':
      return 'Ubicaciones';
    case 'settings':
      return 'Configuración';
    default:
      return 'App';
  }
};

export default MainLayoutMobile;