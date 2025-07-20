import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import WorkLocationsPage from '../../templates/WorkLocationsPage';

const WorkLocationsPageDemo: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | 'client'>('client');

  const mockUser = {
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face",
    status: "online" as const
  };

  const handleLocationSelect = (locationId: string) => {
    console.log('Location selected:', locationId);
  };

  const handleCreateLocation = () => {
    console.log('Create new location');
  };

  const handleEditLocation = (locationId: string) => {
    console.log('Edit location:', locationId);
  };

  const handleDeleteLocation = (locationId: string) => {
    console.log('Delete location:', locationId);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h4">Página de ubicaciones de trabajo:</Typography>
          <div className="flex items-center space-x-2">
            <Typography variant="p" size="sm" color="muted">
              Ver como:
            </Typography>
            <Button
              variant={selectedRole === 'admin' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedRole('admin')}
            >
              Admin
            </Button>
            <Button
              variant={selectedRole === 'employee' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedRole('employee')}
            >
              Employee
            </Button>
            <Button
              variant={selectedRole === 'client' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedRole('client')}
            >
              Client
            </Button>
          </div>
        </div>

        <div className="bg-accent/20 p-4 rounded-lg">
          <Typography variant="p" size="sm" color="muted">
            <strong>Contexto:</strong> Esta página aparece cuando se crea una nueva solicitud, 
            permitiendo al usuario seleccionar la ubicación donde se realizará el servicio. 
            Las tarjetas muestran información detallada de cada ubicación con filtros y búsqueda.
          </Typography>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <WorkLocationsPage
            user={mockUser}
            userRole={selectedRole}
            onNavigate={(route) => console.log('Navigate to:', route)}
            onSelectLocation={handleLocationSelect}
            onCreateLocation={handleCreateLocation}
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="h4">Características principales:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">🏢 Tarjetas Horizontales</Typography>
            <Typography variant="p" size="sm" color="muted">
              Cada ubicación se muestra en una tarjeta horizontal con imagen, información clave y estado
            </Typography>
          </div>
          <div className="space-y-2">  
            <Typography variant="p" size="sm" weight="medium">🔍 Búsqueda y Filtros</Typography>
            <Typography variant="p" size="sm" color="muted">
              Búsqueda por nombre/dirección y filtros por tipo y estado de la ubicación
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">📊 Información Detallada</Typography>
            <Typography variant="p" size="sm" color="muted">
              Capacidad, ocupación, horarios, responsable e instalaciones disponibles
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">⚙️ Gestión por Rol</Typography>
            <Typography variant="p" size="sm" color="muted">
              Admin/Employee pueden crear, editar y eliminar ubicaciones. Client solo selecciona
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkLocationsPageDemo;