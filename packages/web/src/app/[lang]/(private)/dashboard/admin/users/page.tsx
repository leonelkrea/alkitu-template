'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  UserX, 
  Eye, 
  Shield, 
  Mail, 
  Ban, 
  UserCheck,
  Clock,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-07-22T10:30:00Z',
    avatar: null,
    company: 'Tech Solutions',
    personalData: {
      phone: '+34 123 456 789',
      address: 'Calle Mayor 123, Madrid',
      company: 'Tech Solutions',
      jobTitle: 'Senior Developer'
    },
    registeredAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-07-21T15:45:00Z',
    avatar: null,
    company: 'Digital Marketing',
    personalData: {
      phone: '+34 987 654 321',
      address: 'Avenida Principal 456, Barcelona',
      company: 'Digital Marketing',
      jobTitle: 'Marketing Manager'
    },
    registeredAt: '2024-03-10T11:20:00Z'
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos.lopez@startup.io',
    role: 'moderator',
    status: 'suspended',
    lastLogin: '2024-07-20T08:15:00Z',
    avatar: null,
    company: 'Innovate Co',
    personalData: {
      phone: '+34 555 123 456',
      address: 'Plaza Central 789, Valencia',
      company: 'Innovate Co',
      jobTitle: 'CTO'
    },
    registeredAt: '2024-02-28T14:30:00Z'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana.martinez@corp.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-07-10T12:00:00Z',
    avatar: null,
    company: 'Corporate Ltd',
    personalData: {
      phone: '+34 777 888 999',
      address: 'Calle Comercial 321, Sevilla',
      company: 'Corporate Ltd',
      jobTitle: 'Project Manager'
    },
    registeredAt: '2024-04-05T16:45:00Z'
  },
  {
    id: '5',
    name: 'David Rodríguez',
    email: 'david.rodriguez@dev.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-07-22T09:20:00Z',
    avatar: null,
    company: 'Dev Studio',
    personalData: {
      phone: '+34 111 222 333',
      address: 'Torre Empresarial 654, Bilbao',
      company: 'Dev Studio',
      jobTitle: 'Lead Developer'
    },
    registeredAt: '2024-01-20T10:10:00Z'
  }
];

type UserStatus = 'active' | 'inactive' | 'suspended';
type UserRole = 'admin' | 'moderator' | 'user';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  avatar: string | null;
  company: string;
  personalData: {
    phone: string;
    address: string;
    company: string;
    jobTitle: string;
  };
  registeredAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [directMessage, setDirectMessage] = useState('');

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                         user.name.toLowerCase().includes(searchLower) ||
                         user.email.toLowerCase().includes(searchLower) ||
                         user.company.toLowerCase().includes(searchLower) ||
                         user.personalData.phone.toLowerCase().includes(searchLower) ||
                         user.personalData.address.toLowerCase().includes(searchLower) ||
                         user.personalData.jobTitle.toLowerCase().includes(searchLower) ||
                         user.id.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImpersonate = (user: User) => {
    setSelectedUser(user);
    setImpersonateDialogOpen(true);
  };

  const handleSendMessage = (user: User) => {
    setSelectedUser(user);
    setMessageDialogOpen(true);
  };

  const confirmImpersonate = () => {
    if (selectedUser) {
      // Aquí iría la lógica de impersonificación
      console.log('Impersonating user:', selectedUser.email);
      // Simular navegación como el usuario
      alert(`Ahora estás impersonificando a ${selectedUser.name}`);
      setImpersonateDialogOpen(false);
    }
  };

  const sendDirectMessage = () => {
    if (selectedUser && directMessage.trim()) {
      // Aquí iría la lógica para enviar mensaje directo
      console.log('Sending message to:', selectedUser.email, directMessage);
      alert(`Mensaje enviado a ${selectedUser.name}`);
      setMessageDialogOpen(false);
      setDirectMessage('');
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' as UserStatus }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios, permisos e impersonificación
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Búsqueda avanzada: nombre, email, empresa, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  title="Busca por cualquier campo: nombre, email, empresa, cargo, teléfono, dirección"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="moderator">Moderadores</SelectItem>
                <SelectItem value="user">Usuarios</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Inactivos</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Suspendidos</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Administradores</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Gestiona usuarios individuales con opciones avanzadas de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <Badge variant={getRoleColor(user.role)} className="text-xs">
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusColor(user.status)} className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.personalData.jobTitle} - {user.company}</p>
                    <p className="text-xs text-muted-foreground">{user.personalData.phone}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.personalData.address}</p>
                    <p className="text-xs text-muted-foreground">
                      Último acceso: {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImpersonate(user)}
                    className="hidden sm:flex"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Impersonar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(user)}
                    className="hidden sm:flex"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Mensaje
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Impersonar Usuario
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Mensaje
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => toggleUserStatus(user.id)}
                        className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.status === 'active' ? (
                          <>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspender Usuario
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activar Usuario
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <UserX className="w-4 h-4 mr-2" />
                        Eliminar Usuario
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impersonate Dialog */}
      <Dialog open={impersonateDialogOpen} onOpenChange={setImpersonateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Impersonar Usuario</DialogTitle>
            <DialogDescription>
              Estás a punto de impersonar a {selectedUser?.name}. 
              Tendrás acceso completo a su cuenta y sus acciones se registrarán como tuyas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <Avatar>
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.company}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpersonateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmImpersonate} className="bg-red-600 hover:bg-red-700">
              Confirmar Impersonificación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensaje Directo</DialogTitle>
            <DialogDescription>
              Envía un mensaje directo a {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg mb-4">
              <Avatar>
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            <Textarea
              placeholder="Escribe tu mensaje aquí..."
              value={directMessage}
              onChange={(e) => setDirectMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={sendDirectMessage} disabled={!directMessage.trim()}>
              Enviar Mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}