import React from 'react';
import Typography from '../../atoms/Typography';
import Header from '../../organisms/Header';

const HeaderDemo: React.FC = () => {
  const mockUser = {
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face",
    status: "online" as const,
    department: "Desarrollo",
    phone: "+34 123 456 789"
  };

  return (
    <div className="space-y-8">
      <Typography variant="h4">Header de aplicación:</Typography>
      <div className="border border-border rounded-lg overflow-hidden">
        <Header
          user={mockUser}
          title="Dashboard" 
          subtitle="Bienvenido de vuelta"
          notificationsCount={5}
          onNotificationClick={() => console.log('Notificaciones')}
          onUserMenuClick={() => console.log('Menu usuario')}
          onSearchSubmit={(query) => console.log('Buscar:', query)}
          onMenuToggle={() => console.log('Toggle mobile menu')}
          onNavigate={(route) => console.log('Navigate to:', route)}
          currentRoute="dashboard"
          onLogout={() => console.log('Logout')}
        />
      </div>
      
      <div className="p-4 bg-accent rounded-lg">
        <Typography variant="h4" weight="medium" className="mb-2">
          Características del Header:
        </Typography>
        <div className="space-y-1">
          <Typography variant="p" size="sm">
            • **Desktop**: Título, buscador, acciones rápidas, notificaciones, menú usuario
          </Typography>
          <Typography variant="p" size="sm">
            • **Mobile**: Solo menú hamburger + logo + notificaciones
          </Typography>
          <Typography variant="p" size="sm">
            • **Menú móvil**: Drawer lateral con buscador + navegación completa
          </Typography>
          <Typography variant="p" size="sm">
            • **Responsive**: Adaptación automática según tamaño de pantalla
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default HeaderDemo;