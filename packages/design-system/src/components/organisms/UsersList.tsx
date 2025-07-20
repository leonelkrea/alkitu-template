import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import IconButton from '../molecules/IconButton';
import FormField from '../molecules/FormField';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
}

export interface UsersListProps {
  users: User[];
  onUserClick?: (userId: string) => void;
  onInviteUser?: () => void;
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  className?: string;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onUserClick,
  onInviteUser,
  onEditUser,
  onDeleteUser,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <Typography variant="h2" weight="medium">Gestión de Usuarios</Typography>
        <IconButton
          icon="UserPlus"
          variant="primary"
          onClick={onInviteUser}
        >
          Invitar Usuario
        </IconButton>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <FormField
            label=""
            inputProps={{
              placeholder: "Buscar usuarios...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }}
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-input-background"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="manager">Manager</option>
          <option value="user">Usuario</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            variant="vertical"
            title=""
            onClick={() => onUserClick?.(user.id)}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center">
                    <Typography variant="p" size="sm" weight="medium">
                      {user.name.charAt(0)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">
                      {user.name}
                    </Typography>
                    <Typography variant="p" size="xs" color="muted">
                      {user.email}
                    </Typography>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <IconButton
                    icon="Edit"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    tooltip="Editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditUser?.(user.id);
                    }}
                  />
                  <IconButton
                    icon="Trash2"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    tooltip="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser?.(user.id);
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Typography variant="p" size="xs" color="muted">
                  {user.department} • {user.role}
                </Typography>
                {user.lastLogin && (
                  <Typography variant="p" size="xs" color="muted">
                    Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                  </Typography>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersList;