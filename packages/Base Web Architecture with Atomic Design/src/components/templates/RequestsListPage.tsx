import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import Avatar from '../atoms/Avatar';
import MainLayout from './MainLayout';
import Table from '../organisms/Table';
import type { TableColumn, TableAction } from '../organisms/Table';

export interface RequestsListPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  userRole?: 'admin' | 'employee' | 'client';
  onNavigate?: (route: string) => void;
  className?: string;
}

const RequestsListPage: React.FC<RequestsListPageProps> = ({
  user,
  userRole = 'client',
  onNavigate,
  className = '',
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data with additional fields for table
  const mockRequests = [
    {
      id: 'req-001',
      title: 'Mantenimiento Aire Acondicionado',
      description: 'El sistema de climatización de la oficina principal necesita revisión y mantenimiento preventivo.',
      status: 'in-progress',
      requestType: 'Mantenimiento',
      requestDate: '2024-06-15',
      priority: 'high',
      assignee: {
        name: 'Carlos Méndez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        email: 'carlos.mendez@empresa.com'
      },
      department: 'Facilities',
      estimatedHours: 4,
      progress: 65
    },
    {
      id: 'req-002',
      title: 'Instalación Equipos IT',
      description: 'Configuración e instalación de nuevos equipos de cómputo para el equipo de desarrollo.',
      status: 'pending',
      requestType: 'Instalación',
      requestDate: '2024-06-12',
      priority: 'medium',
      assignee: {
        name: 'Ana García',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face',
        email: 'ana.garcia@empresa.com'
      },
      department: 'IT',
      estimatedHours: 8,
      progress: 0
    },
    {
      id: 'req-003',
      title: 'Reparación Sistema de Red',
      description: 'Problemas de conectividad en el segundo piso, requiere diagnóstico y reparación.',
      status: 'approved',
      requestType: 'Reparación',
      requestDate: '2024-06-10',
      priority: 'high',
      assignee: {
        name: 'Miguel Torres',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        email: 'miguel.torres@empresa.com'
      },
      department: 'IT',
      estimatedHours: 6,
      progress: 100
    },
    {
      id: 'req-004',
      title: 'Limpieza Oficinas',
      description: 'Servicio de limpieza profunda de todas las áreas comunes y oficinas.',
      status: 'rejected',
      requestType: 'Limpieza',
      requestDate: '2024-06-08',
      priority: 'low',
      assignee: null,
      department: 'Facilities',
      estimatedHours: 2,
      progress: 0
    },
    {
      id: 'req-005',
      title: 'Configuración Videoconferencia',
      description: 'Instalación y configuración de sistema de videoconferencia en sala de juntas.',
      status: 'in-progress',
      requestType: 'Instalación',
      requestDate: '2024-06-14',
      priority: 'medium',
      assignee: {
        name: 'Laura Pérez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        email: 'laura.perez@empresa.com'
      },
      department: 'IT',
      estimatedHours: 3,
      progress: 40
    },
    {
      id: 'req-006',
      title: 'Actualización Software',
      description: 'Actualización del software de gestión en todos los equipos del departamento.',
      status: 'approved',
      requestType: 'Actualización',
      requestDate: '2024-06-11',
      priority: 'low',
      assignee: {
        name: 'Roberto Silva',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        email: 'roberto.silva@empresa.com'
      },
      department: 'IT',
      estimatedHours: 5,
      progress: 20
    }
  ];

  // Define columns based on user role
  const getColumns = (): TableColumn[] => {
    const baseColumns: TableColumn[] = [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: '100px',
        sortable: true,
        render: {
          type: 'text',
          variant: 'p',
          size: 'sm',
          weight: 'medium',
          color: 'muted'
        }
      },
      {
        key: 'title',
        title: 'Solicitud',
        dataIndex: 'title',
        sortable: true,
        render: {
          type: 'custom',
          render: (value, record) => (
            <div className="space-y-1">
              <Typography variant="p" size="sm" weight="medium">
                {value}
              </Typography>
              <Typography variant="p" size="xs" color="muted" className="line-clamp-2">
                {record.description}
              </Typography>
            </div>
          )
        }
      },
      {
        key: 'status',
        title: 'Estado',
        dataIndex: 'status',
        width: '120px',
        sortable: true,
        filterable: true,
        render: {
          type: 'badge',
          mapping: {
            'pending': { variant: 'warning', label: 'Pendiente' },
            'approved': { variant: 'success', label: 'Aprobado' },
            'in-progress': { variant: 'primary', label: 'En Progreso' },
            'rejected': { variant: 'error', label: 'Rechazado' },
            'completed': { variant: 'neutral', label: 'Completado' }
          }
        }
      },
      {
        key: 'priority',
        title: 'Prioridad',
        dataIndex: 'priority',
        width: '100px',
        sortable: true,
        filterable: true,
        render: {
          type: 'badge',
          mapping: {
            'low': { variant: 'neutral', label: 'Baja' },
            'medium': { variant: 'warning', label: 'Media' },
            'high': { variant: 'error', label: 'Alta' }
          }
        }
      },
      {
        key: 'requestType',
        title: 'Tipo',
        dataIndex: 'requestType',
        width: '120px',
        sortable: true,
        filterable: true,
        render: {
          type: 'text',
          variant: 'p',
          size: 'sm'
        }
      },
      {
        key: 'requestDate',
        title: 'Fecha',
        dataIndex: 'requestDate',
        width: '110px',
        sortable: true,
        render: {
          type: 'date',
          format: 'short'
        }
      }
    ];

    // Add assignee column for admin and employee views
    if (userRole === 'admin' || userRole === 'employee') {
      baseColumns.splice(-1, 0, {
        key: 'assignee',
        title: 'Asignado',
        dataIndex: 'assignee',
        width: '160px',
        render: {
          type: 'custom',
          render: (value, record) => {
            if (!value) {
              return (
                <Typography variant="p" size="sm" color="muted">
                  Sin asignar
                </Typography>
              );
            }
            return (
              <div className="flex items-center space-x-2">
                <Avatar
                  src={value.avatar}
                  fallback={value.name}
                  size="sm"
                />
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    {value.name}
                  </Typography>
                </div>
              </div>
            );
          }
        }
      });
    }

    // Add progress column for admin view
    if (userRole === 'admin') {
      baseColumns.push({
        key: 'progress',
        title: 'Progreso',
        dataIndex: 'progress',
        width: '120px',
        render: {
          type: 'progress',
          max: 100,
          showValue: true,
          size: 'sm',
          color: 'primary'
        }
      });
    }

    return baseColumns;
  };

  // Define actions based on user role
  const getRowActions = (): TableAction[] => {
    const actions: TableAction[] = [
      {
        key: 'view',
        label: 'Ver Detalles',
        icon: 'Eye',
        variant: 'ghost',
        onClick: (record) => handleRequestClick(record.id)
      }
    ];

    if (userRole === 'admin') {
      actions.push(
        {
          key: 'edit',
          label: 'Editar',
          icon: 'Edit',
          variant: 'ghost',
          onClick: (record) => handleEditRequest(record.id)
        },
        {
          key: 'assign',
          label: 'Asignar',
          icon: 'UserPlus',
          variant: 'ghost',
          onClick: (record) => handleAssignRequest(record.id),
          hidden: (record) => !!record.assignee
        },
        {
          key: 'delete',
          label: 'Eliminar',
          icon: 'Trash2',
          variant: 'destructive',
          onClick: (record) => handleDeleteRequest(record.id)
        }
      );
    }

    if (userRole === 'client') {
      actions.push({
        key: 'cancel',
        label: 'Cancelar',
        icon: 'X',
        variant: 'destructive',
        onClick: (record) => handleCancelRequest(record.id),
        disabled: (record) => record.status === 'in-progress' || record.status === 'completed'
      });
    }

    return actions;
  };

  const getPageTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Gestión de Solicitudes';
      case 'employee':
        return 'Solicitudes Asignadas';
      case 'client':
        return 'Mis Solicitudes';
      default:
        return 'Solicitudes';
    }
  };

  const getPageSubtitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Administra todas las solicitudes del sistema';
      case 'employee':
        return 'Solicitudes que tienes asignadas para trabajar';
      case 'client':
        return 'Todas tus solicitudes de servicio';
      default:
        return 'Lista de solicitudes';
    }
  };

  // Event handlers
  const handleRequestClick = (requestId: string) => {
    if (onNavigate) {
      onNavigate(`/app/requests/${requestId}`);
    }
  };

  const handleEditRequest = (requestId: string) => {
    if (onNavigate) {
      onNavigate(`/app/requests/${requestId}/edit`);
    }
  };

  const handleAssignRequest = (requestId: string) => {
    console.log('Asignar solicitud:', requestId);
    // Here you would typically open an assignment modal
  };

  const handleDeleteRequest = (requestId: string) => {
    console.log('Eliminar solicitud:', requestId);
    // Here you would typically show a confirmation dialog
  };

  const handleCancelRequest = (requestId: string) => {
    console.log('Cancelar solicitud:', requestId);
    // Here you would typically show a confirmation dialog
  };

  const handleNewRequest = () => {
    if (onNavigate) {
      onNavigate('/app/requests/new');
    }
  };

  const handleSearch = (query: string) => {
    console.log('Buscar:', query);
    // Here you would filter the data based on the search query
  };

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Filtros aplicados:', filters);
    // Here you would filter the data based on the filters
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    console.log('Ordenar por:', column, direction);
    // Here you would sort the data
  };

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    // Here you would typically fetch new data
  };

  const handleRowClick = (record: any) => {
    handleRequestClick(record.id);
  };

  // Filter options based on user role
  const getQuickFilters = () => {
    const filters = [
      {
        key: 'status',
        label: 'Estado',
        type: 'select' as const,
        options: [
          { value: 'pending', label: 'Pendiente' },
          { value: 'approved', label: 'Aprobado' },
          { value: 'in-progress', label: 'En Progreso' },
          { value: 'rejected', label: 'Rechazado' },
          { value: 'completed', label: 'Completado' }
        ]
      },
      {
        key: 'priority',
        label: 'Prioridad',
        type: 'select' as const,
        options: [
          { value: 'low', label: 'Baja' },
          { value: 'medium', label: 'Media' },
          { value: 'high', label: 'Alta' }
        ]
      },
      {
        key: 'requestType',
        label: 'Tipo',
        type: 'select' as const,
        options: [
          { value: 'Mantenimiento', label: 'Mantenimiento' },
          { value: 'Instalación', label: 'Instalación' },
          { value: 'Reparación', label: 'Reparación' },
          { value: 'Limpieza', label: 'Limpieza' },
          { value: 'Actualización', label: 'Actualización' }
        ]
      }
    ];

    // Add department filter for admin
    if (userRole === 'admin') {
      filters.push({
        key: 'department',
        label: 'Departamento',
        type: 'select' as const,
        options: [
          { value: 'IT', label: 'IT' },
          { value: 'Facilities', label: 'Facilities' },
          { value: 'HR', label: 'Recursos Humanos' },
          { value: 'Finance', label: 'Finanzas' }
        ]
      });
    }

    return filters;
  };

  return (
    <MainLayout
      user={user}
      currentRoute="requests"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" weight="bold" className="mb-2">
              {getPageTitle()}
            </Typography>
            <Typography variant="p" color="muted">
              {getPageSubtitle()}
            </Typography>
          </div>

          {userRole === 'client' && (
            <div>
              <button
                onClick={handleNewRequest}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <span className="mr-2">+</span>
                Nueva Solicitud
              </button>
            </div>
          )}
        </div>

        <Table
          data={mockRequests}
          columns={getColumns()}
          loading={false}
          selectable={userRole === 'admin'}
          rowActions={{
            items: getRowActions(),
            trigger: 'hover',
            maxVisible: 3
          }}
          pagination={{
            page: currentPage,
            pageSize: pageSize,
            total: mockRequests.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50]
          }}
          filters={{
            searchPlaceholder: 'Buscar solicitudes...',
            searchFields: ['title', 'description', 'id'],
            quickFilters: getQuickFilters()
          }}
          sorting={{
            defaultSort: { column: 'requestDate', direction: 'desc' }
          }}
          styling={{
            size: 'md',
            hoverable: true,
            striped: true
          }}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      </div>
    </MainLayout>
  );
};

export default RequestsListPage;