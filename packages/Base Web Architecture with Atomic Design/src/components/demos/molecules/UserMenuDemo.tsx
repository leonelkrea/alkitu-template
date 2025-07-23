import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import UserMenu from '../../molecules/UserMenu';

const UserMenuDemo: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('admin');
  
  const sampleUsers = {
    admin: {
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
      avatar: '',
      status: 'online' as const,
    },
    manager: {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      avatar: '',
      status: 'away' as const,
    },
    employee: {
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      avatar: '',
      status: 'busy' as const,
    },
    client: {
      name: 'David Chen',
      email: 'david.chen@cliente.com',
      avatar: '',
      status: 'offline' as const,
    }
  };

  const customMenuItems = [
    {
      label: 'Mi Dashboard',
      icon: 'LayoutDashboard',
      onClick: () => console.log('Dashboard'),
    },
    {
      label: 'Mis Solicitudes',
      icon: 'FileText',
      onClick: () => console.log('Solicitudes'),
    },
    {
      label: 'Notificaciones',
      icon: 'Bell',
      onClick: () => console.log('Notificaciones'),
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      onClick: () => console.log('Configuración'),
    },
    {
      label: 'Salir',
      icon: 'LogOut',
      onClick: () => console.log('Salir'),
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Estados del círculo de notificación */}
      <div className="space-y-6">
        <Typography variant="h3">Estados del círculo de estado:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(sampleUsers).map(([key, user]) => (
            <div key={key} className="space-y-3">
              <Typography variant="h4" className="capitalize">{key}</Typography>
              <div className="p-4 border border-border rounded-lg bg-card">
                <UserMenu
                  user={user}
                  size="md"
                  showStatus={true}
                  onProfileClick={() => console.log(`Perfil de ${user.name}`)}
                  onSettingsClick={() => console.log(`Configuración de ${user.name}`)}
                  onLogoutClick={() => console.log(`Logout de ${user.name}`)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Estado: <span className={`capitalize font-medium ${
                  user.status === 'online' ? 'text-success' :
                  user.status === 'away' ? 'text-warning' :
                  user.status === 'busy' ? 'text-error' :
                  'text-neutral-500'
                }`}>{user.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-6">
        <Typography variant="h3">Diferentes tamaños:</Typography>
        
        <div className="flex flex-wrap items-start gap-8">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="space-y-3">
              <Typography variant="h4" className="uppercase">{size}</Typography>
              <div className="p-4 border border-border rounded-lg bg-card">
                <UserMenu
                  user={sampleUsers.admin}
                  size={size}
                  showStatus={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Con menú personalizado */}
      <div className="space-y-6">
        <Typography variant="h3">Con menú personalizado:</Typography>
        
        <div className="max-w-md">
          <div className="p-4 border border-border rounded-lg bg-card">
            <UserMenu
              user={sampleUsers.manager}
              menuItems={customMenuItems}
              size="md"
              showStatus={true}
            />
          </div>
        </div>
      </div>

      {/* Sin estado de conexión */}
      <div className="space-y-6">
        <Typography variant="h3">Sin círculo de estado:</Typography>
        
        <div className="max-w-md">
          <div className="p-4 border border-border rounded-lg bg-card">
            <UserMenu
              user={sampleUsers.employee}
              size="md"
              showStatus={false}
            />
          </div>
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-6">
        <Typography variant="h3">Casos de uso recomendados:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              Header de aplicación
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • Mostrar usuario actual<br/>
              • Acceso rápido a perfil<br/>  
              • Estado de conexión<br/>
              • Menú de navegación personal
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              Sidebar o menú lateral
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • Información del usuario<br/>
              • Configuraciones rápidas<br/>
              • Estado de disponibilidad<br/>
              • Logout seguro
            </Typography>
          </div>
        </div>
      </div>

      {/* Colores de estado */}
      <div className="space-y-6">
        <Typography variant="h3">Significado de los colores de estado:</Typography>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <div className="w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm"></div>
            <div>
              <Typography variant="p" size="sm" weight="medium">Online</Typography>
              <Typography variant="p" size="xs" color="muted">Disponible</Typography>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <div className="w-3 h-3 bg-warning rounded-full border-2 border-white shadow-sm"></div>
            <div>
              <Typography variant="p" size="sm" weight="medium">Away</Typography>
              <Typography variant="p" size="xs" color="muted">Ausente</Typography>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <div className="w-3 h-3 bg-error rounded-full border-2 border-white shadow-sm"></div>
            <div>
              <Typography variant="p" size="sm" weight="medium">Busy</Typography>
              <Typography variant="p" size="xs" color="muted">Ocupado</Typography>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <div className="w-3 h-3 bg-neutral-500 rounded-full border-2 border-white shadow-sm"></div>
            <div>
              <Typography variant="p" size="sm" weight="medium">Offline</Typography>
              <Typography variant="p" size="xs" color="muted">Desconectado</Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de usuario para testing */}
      <div className="space-y-6">
        <Typography variant="h3">Test interactivo:</Typography>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(sampleUsers).map((userKey) => (
              <button
                key={userKey}
                onClick={() => setSelectedUser(userKey)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedUser === userKey
                    ? 'bg-design-primary text-white'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                {userKey}
              </button>
            ))}
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card max-w-md">
            <Typography variant="p" size="sm" color="muted" className="mb-4">
              Usuario seleccionado: <span className="font-medium">{selectedUser}</span>
            </Typography>
            <UserMenu
              user={sampleUsers[selectedUser as keyof typeof sampleUsers]}
              size="md"
              showStatus={true}
              menuItems={customMenuItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenuDemo;