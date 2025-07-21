import React from 'react';
import Typography from '../../atoms/Typography';
import UsersList from '../../organisms/UsersList';
import UsersListMobile from '../../organisms/UsersListMobile';
import { useIsMobile } from '../../ui/use-mobile';

const UsersListDemo: React.FC = () => {
  const isMobile = useIsMobile();

  const mockUsers = [
    {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
      department: 'Desarrollo',
      role: 'admin',
      status: 'active' as const,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face',
      lastLogin: '2024-01-20T15:30:00Z',
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@empresa.com',
      department: 'Marketing',
      role: 'manager',
      status: 'active' as const,
      lastLogin: '2024-01-19T09:15:00Z',
    },
    {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      department: 'RRHH',
      role: 'employee',
      status: 'active' as const,
      lastLogin: '2024-01-20T11:45:00Z',
    },
    {
      id: '4',
      name: 'David Martín',
      email: 'david.martin@empresa.com',
      department: 'Finanzas',
      role: 'manager',
      status: 'inactive' as const,
      lastLogin: '2024-01-15T16:20:00Z',
    },
    {
      id: '5',
      name: 'Laura Fernández',
      email: 'laura.fernandez@empresa.com',
      department: 'Desarrollo',
      role: 'employee',
      status: 'active' as const,
      lastLogin: '2024-01-20T14:00:00Z',
    },
    {
      id: '6',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@external.com',
      department: 'Consultoría',
      role: 'client',
      status: 'active' as const,
      lastLogin: '2024-01-18T10:30:00Z',
    },
  ];

  const handleUserClick = (userId: string) => {
    console.log('Usuario clickeado:', userId);
    alert(`Ver detalles del usuario ${userId}`);
  };

  const handleInviteUser = () => {
    console.log('Invitar nuevo usuario');
    alert('Abriendo formulario de invitación');
  };

  const handleEditUser = (userId: string) => {
    console.log('Editar usuario:', userId);
    alert(`Editando usuario ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Eliminar usuario:', userId);
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      alert(`Usuario ${userId} eliminado`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Typography variant="h4">Lista de Usuarios</Typography>
        <Typography
          variant="p"
          size="sm"
          color="muted"
          className="hidden md:block"
        >
          Gestión de usuarios con versiones optimizadas para cada dispositivo
        </Typography>
        <Typography variant="p" size="sm" color="muted" className="md:hidden">
          Versión móvil con navegación optimizada y filtros colapsables
        </Typography>
      </div>

      {/* Demostración del componente */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border">
          <Typography variant="p" size="sm" weight="medium">
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente:{' '}
            {isMobile ? 'UsersListMobile' : 'UsersList'}
          </Typography>
        </div>

        <div className="p-0 md:p-6">
          {isMobile ? (
            <UsersListMobile
              users={mockUsers}
              onUserClick={handleUserClick}
              onInviteUser={handleInviteUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          ) : (
            <UsersList
              users={mockUsers}
              onUserClick={handleUserClick}
              onInviteUser={handleInviteUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <Typography variant="p" size="sm" weight="medium">
          🎯 Diferencias por dispositivo:
        </Typography>
        <ul className="space-y-1 pl-4">
          <li className="text-sm text-muted-foreground">
            • 📱 Móvil: Cards verticales, filtros colapsables, avatares
            prominentes
          </li>
          <li className="text-sm text-muted-foreground">
            • 🖥️ Desktop: Grid compacto, filtros inline, información condensada
          </li>
          <li className="text-sm text-muted-foreground">
            • 🔍 Búsqueda optimizada para cada pantalla
          </li>
          <li className="text-sm text-muted-foreground">
            • ⚡ Acciones táctiles vs hover interactions
          </li>
          <li className="text-sm text-muted-foreground">
            • 🎨 Espaciado y tipografía específicos por dispositivo
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UsersListDemo;
