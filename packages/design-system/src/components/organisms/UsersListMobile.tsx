import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import FormFieldMobile from '../molecules/FormFieldMobile';
import IconButtonMobile from '../molecules/IconButtonMobile';
import Card from '../molecules/Card';

export interface UserMobile {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
}

export interface UsersListMobileProps {
  users: UserMobile[];
  onUserClick?: (userId: string) => void;
  onInviteUser?: () => void;
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  className?: string;
}

const UsersListMobile: React.FC<UsersListMobileProps> = ({
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'Activo' };
      case 'inactive':
        return { variant: 'error', label: 'Inactivo' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Manager';
      case 'employee':
        return 'Empleado';
      case 'client':
        return 'Cliente';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-error';
      case 'manager':
        return 'text-warning';
      case 'employee':
        return 'text-primary';
      case 'client':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getUsersCount = (filter: string, type: 'role' | 'status') => {
    if (filter === 'all') return users.length;
    return users.filter(u => u[type] === filter).length;
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Header */}
      <div className="text-center space-y-3">
        <Typography variant="h2" weight="medium">
          Usuarios
        </Typography>
        <Typography variant="p" color="muted" size="sm">
          Gestiona los usuarios del sistema
        </Typography>
        
        <Button
          variant="primary"
          size="lg"
          icon="UserPlus"
          onClick={onInviteUser}
          className="w-full touch-manipulation"
        >
          Invitar Usuario
        </Button>
      </div>

      {/* Search */}
      <FormFieldMobile
        label=""
        placeholder="Buscar usuarios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Toggle Filters */}
      <div className="flex items-center justify-between">
        <Typography variant="p" size="sm" color="muted">
          {filteredUsers.length} de {users.length} usuarios
        </Typography>
        
        <IconButtonMobile
          icon={showFilters ? "ChevronUp" : "ChevronDown"}
          label="Filtros"
          showLabel={true}
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            {/* Role Filter */}
            <div>
              <Typography variant="p" size="sm" weight="medium" className="mb-2">
                Rol
              </Typography>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
              >
                <option value="all">Todos ({getUsersCount('all', 'role')})</option>
                <option value="admin">Administrador ({getUsersCount('admin', 'role')})</option>
                <option value="manager">Manager ({getUsersCount('manager', 'role')})</option>
                <option value="employee">Empleado ({getUsersCount('employee', 'role')})</option>
                <option value="client">Cliente ({getUsersCount('client', 'role')})</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <Typography variant="p" size="sm" weight="medium" className="mb-2">
                Estado
              </Typography>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
              >
                <option value="all">Todos ({getUsersCount('all', 'status')})</option>
                <option value="active">Activos ({getUsersCount('active', 'status')})</option>
                <option value="inactive">Inactivos ({getUsersCount('inactive', 'status')})</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRoleFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="w-full"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              variant="vertical"
              title=""
              onClick={() => onUserClick?.(user.id)}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-4 space-y-3">
                {/* Header with Avatar and Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Avatar
                      src={user.avatar}
                      fallback={user.name}
                      size="md"
                      status={user.status}
                    />
                    <div className="flex-1 min-w-0">
                      <Typography variant="p" size="base" weight="medium" className="mb-1">
                        {user.name}
                      </Typography>
                      <Typography variant="p" size="sm" color="muted" className="truncate">
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <IconButtonMobile
                      icon="Edit"
                      size="sm"
                      variant="ghost"
                      label="Editar"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onEditUser?.(user.id);
                      }}
                    />
                    <IconButtonMobile
                      icon="Trash2"
                      size="sm"
                      variant="ghost"
                      label="Eliminar"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDeleteUser?.(user.id);
                      }}
                    />
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="p" size="sm" color="muted">
                      Departamento:
                    </Typography>
                    <Typography variant="p" size="sm">
                      {user.department}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Typography variant="p" size="sm" color="muted">
                      Rol:
                    </Typography>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={user.role === 'admin' ? 'Crown' : 
                             user.role === 'manager' ? 'Users' : 
                             user.role === 'employee' ? 'User' : 'UserCheck'} 
                        size="xs" 
                        className={getRoleColor(user.role)}
                      />
                      <Typography 
                        variant="p" 
                        size="sm" 
                        className={getRoleColor(user.role)}
                      >
                        {getRoleLabel(user.role)}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Typography variant="p" size="sm" color="muted">
                      Estado:
                    </Typography>
                    <Badge
                      variant={getStatusBadge(user.status).variant as any}
                      size="sm"
                    >
                      {getStatusBadge(user.status).label}
                    </Badge>
                  </div>
                </div>

                {/* Last Login */}
                {user.lastLogin && (
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size="xs" color="muted" />
                      <Typography variant="p" size="xs" color="muted">
                        Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size="lg" color="muted" />
          </div>
          <Typography variant="h3" weight="medium" className="mb-2">
            No hay usuarios
          </Typography>
          <Typography variant="p" color="muted" className="mb-4">
            No se encontraron usuarios que coincidan con los filtros
          </Typography>
          <Button
            variant="outline"
            onClick={() => {
              setRoleFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersListMobile;