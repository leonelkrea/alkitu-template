import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Avatar from '../atoms/Avatar';
import MainLayout from './MainLayout';
import Table from '../organisms/Table';
import type { TableColumn, TableAction } from '../organisms/Table';

export interface DashboardPageProps {
  userRole: 'admin' | 'employee' | 'client';
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  dashboardData?: any;
  onNavigate?: (route: string) => void;
  className?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  userRole,
  user,
  dashboardData,
  onNavigate,
  className = '',
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data for admin metrics table
  const adminMetricsData = [
    {
      id: 'requests-total',
      metric: 'Solicitudes Totales',
      currentValue: 156,
      previousValue: 144,
      change: 8.3,
      period: 'Último mes',
      status: 'up',
      category: 'Requests',
      lastUpdated: '2024-06-15T10:30:00Z'
    },
    {
      id: 'requests-pending',
      metric: 'Solicitudes Pendientes',
      currentValue: 24,
      previousValue: 16,
      change: 50,
      period: 'Esta semana',
      status: 'up',
      category: 'Requests',
      lastUpdated: '2024-06-15T09:15:00Z'
    },
    {
      id: 'requests-completed',
      metric: 'Solicitudes Completadas',
      currentValue: 89,
      previousValue: 74,
      change: 20.3,
      period: 'Último mes',
      status: 'up',
      category: 'Requests',
      lastUpdated: '2024-06-15T08:45:00Z'
    },
    {
      id: 'users-active',
      metric: 'Usuarios Activos',
      currentValue: 42,
      previousValue: 39,
      change: 7.7,
      period: 'Esta semana',
      status: 'up',
      category: 'Users',
      lastUpdated: '2024-06-15T07:20:00Z'
    },
    {
      id: 'response-time',
      metric: 'Tiempo Promedio de Respuesta',
      currentValue: 2.4,
      previousValue: 3.1,
      change: -22.6,
      period: 'Últimos 7 días',
      status: 'down',
      category: 'Performance',
      lastUpdated: '2024-06-15T06:00:00Z'
    },
    {
      id: 'satisfaction',
      metric: 'Satisfacción del Cliente',
      currentValue: 4.2,
      previousValue: 4.0,
      change: 5.0,
      period: 'Último mes',
      status: 'up',
      category: 'Quality',
      lastUpdated: '2024-06-15T05:30:00Z'
    }
  ];

  // Mock data for employee assignments table
  const employeeAssignmentsData = [
    {
      id: 'req-001',
      title: 'Mantenimiento Aire Acondicionado',
      client: {
        name: 'Juan Pérez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        department: 'Administración'
      },
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-06-18',
      estimatedHours: 4,
      progress: 65,
      category: 'Facilities'
    },
    {
      id: 'req-002',
      title: 'Instalación Equipos IT',
      client: {
        name: 'María López',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face',
        department: 'Desarrollo'
      },
      priority: 'medium',
      status: 'approved',
      dueDate: '2024-06-20',
      estimatedHours: 8,
      progress: 25,
      category: 'IT'
    },
    {
      id: 'req-003',
      title: 'Reparación Sistema de Red',
      client: {
        name: 'Carlos Méndez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        department: 'IT'
      },
      priority: 'high',
      status: 'overdue',
      dueDate: '2024-06-14',
      estimatedHours: 6,
      progress: 80,
      category: 'IT'
    }
  ];

  // Mock data for client requests table
  const clientRequestsData = [
    {
      id: 'req-001',
      title: 'Mantenimiento Aire Acondicionado',
      description: 'Revisión y mantenimiento del sistema de climatización',
      status: 'in-progress',
      priority: 'high',
      requestDate: '2024-06-15',
      category: 'Facilities',
      assignee: {
        name: 'Carlos Méndez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      estimatedCompletion: '2024-06-18',
      progress: 65
    },
    {
      id: 'req-002',
      title: 'Instalación Equipos IT',
      description: 'Configuración de nuevos equipos de trabajo',
      status: 'pending',
      priority: 'medium',
      requestDate: '2024-06-12',
      category: 'IT',
      assignee: null,
      estimatedCompletion: '2024-06-20',
      progress: 0
    },
    {
      id: 'req-003',
      title: 'Actualización Software',
      description: 'Instalación de nuevas versiones de software',
      status: 'completed',
      priority: 'low',
      requestDate: '2024-06-08',
      category: 'IT',
      assignee: {
        name: 'Ana García',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      estimatedCompletion: '2024-06-10',
      progress: 100
    }
  ];

  // Get table configuration based on user role
  const getTableConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          data: adminMetricsData,
          columns: getAdminColumns(),
          title: 'Métricas del Sistema',
          subtitle: 'Seguimiento de KPIs y rendimiento general'
        };
      case 'employee':
        return {
          data: employeeAssignmentsData,
          columns: getEmployeeColumns(),
          title: 'Solicitudes Asignadas',
          subtitle: 'Tareas y proyectos que tienes pendientes'
        };
      case 'client':
        return {
          data: clientRequestsData,
          columns: getClientColumns(),
          title: 'Mis Solicitudes',
          subtitle: 'Estado y progreso de tus solicitudes de servicio'
        };
      default:
        return {
          data: [],
          columns: [],
          title: 'Dashboard',
          subtitle: ''
        };
    }
  };

  // Admin columns - metrics focused
  const getAdminColumns = (): TableColumn[] => [
    {
      key: 'metric',
      title: 'Métrica',
      dataIndex: 'metric',
      sortable: true,
      render: {
        type: 'text',
        variant: 'p',
        size: 'sm',
        weight: 'medium'
      }
    },
    {
      key: 'currentValue',
      title: 'Valor Actual',
      dataIndex: 'currentValue',
      sortable: true,
      align: 'center',
      render: {
        type: 'custom',
        render: (value, record) => (
          <Typography variant="p" size="lg" weight="bold" className="text-design-primary">
            {record.category === 'Performance' ? `${value}h` : 
             record.category === 'Quality' ? `${value}/5` : value}
          </Typography>
        )
      }
    },
    {
      key: 'change',
      title: 'Cambio',
      dataIndex: 'change',
      sortable: true,
      align: 'center',
      render: {
        type: 'custom',
        render: (value, record) => (
          <div className="flex items-center justify-center space-x-1">
            <span className={`text-sm font-medium ${
              (record.status === 'up' && value > 0) || (record.status === 'down' && value < 0)
                ? 'text-success' : 'text-error'
            }`}>
              {value > 0 ? '+' : ''}{value.toFixed(1)}%
            </span>
          </div>
        )
      }
    },
    {
      key: 'period',
      title: 'Período',
      dataIndex: 'period',
      render: {
        type: 'text',
        variant: 'p',
        size: 'sm',
        color: 'muted'
      }
    },
    {
      key: 'category',
      title: 'Categoría',
      dataIndex: 'category',
      filterable: true,
      render: {
        type: 'badge',
        mapping: {
          'Requests': { variant: 'primary', label: 'Solicitudes' },
          'Users': { variant: 'secondary', label: 'Usuarios' },
          'Performance': { variant: 'warning', label: 'Rendimiento' },
          'Quality': { variant: 'success', label: 'Calidad' }
        }
      }
    },
    {
      key: 'lastUpdated',
      title: 'Actualizado',
      dataIndex: 'lastUpdated',
      sortable: true,
      render: {
        type: 'date',
        format: 'relative',
        showTime: true
      }
    }
  ];

  // Employee columns - task focused
  const getEmployeeColumns = (): TableColumn[] => [
    {
      key: 'title',
      title: 'Solicitud',
      dataIndex: 'title',
      sortable: true,
      render: {
        type: 'text',
        variant: 'p',
        size: 'sm',
        weight: 'medium'
      }
    },
    {
      key: 'client',
      title: 'Cliente',
      dataIndex: 'client',
      render: {
        type: 'custom',
        render: (value) => (
          <div className="flex items-center space-x-2">
            <Avatar src={value.avatar} fallback={value.name} size="sm" />
            <div>
              <Typography variant="p" size="sm" weight="medium">
                {value.name}
              </Typography>
              <Typography variant="p" size="xs" color="muted">
                {value.department}
              </Typography>
            </div>
          </div>
        )
      }
    },
    {
      key: 'priority',
      title: 'Prioridad',
      dataIndex: 'priority',
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
      key: 'status',
      title: 'Estado',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      render: {
        type: 'badge',
        mapping: {
          'pending': { variant: 'warning', label: 'Pendiente' },
          'approved': { variant: 'primary', label: 'Aprobado' },
          'in-progress': { variant: 'secondary', label: 'En Progreso' },
          'overdue': { variant: 'error', label: 'Vencido' },
          'completed': { variant: 'success', label: 'Completado' }
        }
      }
    },
    {
      key: 'progress',
      title: 'Progreso',
      dataIndex: 'progress',
      sortable: true,
      render: {
        type: 'progress',
        max: 100,
        showValue: true,
        size: 'sm',
        color: 'primary'
      }
    },
    {
      key: 'dueDate',
      title: 'Vencimiento',
      dataIndex: 'dueDate',
      sortable: true,
      render: {
        type: 'date',
        format: 'short'
      }
    }
  ];

  // Client columns - request focused
  const getClientColumns = (): TableColumn[] => [
    {
      key: 'title',
      title: 'Solicitud',
      dataIndex: 'title',
      sortable: true,
      render: {
        type: 'custom',
        render: (value, record) => (
          <div>
            <Typography variant="p" size="sm" weight="medium">
              {value}
            </Typography>
            <Typography variant="p" size="xs" color="muted" className="line-clamp-1">
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
      sortable: true,
      filterable: true,
      render: {
        type: 'badge',
        mapping: {
          'pending': { variant: 'warning', label: 'Pendiente' },
          'approved': { variant: 'primary', label: 'Aprobado' },
          'in-progress': { variant: 'secondary', label: 'En Progreso' },
          'completed': { variant: 'success', label: 'Completado' }
        }
      }
    },
    {
      key: 'priority',
      title: 'Prioridad',
      dataIndex: 'priority',
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
      key: 'assignee',
      title: 'Asignado a',
      dataIndex: 'assignee',
      render: {
        type: 'custom',
        render: (value) => {
          if (!value) {
            return (
              <Typography variant="p" size="sm" color="muted">
                Sin asignar
              </Typography>
            );
          }
          return (
            <div className="flex items-center space-x-2">
              <Avatar src={value.avatar} fallback={value.name} size="sm" />
              <Typography variant="p" size="sm">
                {value.name}
              </Typography>
            </div>
          );
        }
      }
    },
    {
      key: 'progress',
      title: 'Progreso',
      dataIndex: 'progress',
      sortable: true,
      render: {
        type: 'progress',
        max: 100,
        showValue: true,
        size: 'sm',
        color: 'primary'
      }
    },
    {
      key: 'requestDate',
      title: 'Fecha Solicitud',
      dataIndex: 'requestDate',
      sortable: true,
      render: {
        type: 'date',
        format: 'short'
      }
    }
  ];

  // Get row actions based on user role
  const getRowActions = (): TableAction[] => {
    const baseActions: TableAction[] = [
      {
        key: 'view',
        label: 'Ver Detalles',
        icon: 'Eye',
        variant: 'ghost',
        onClick: (record) => {
          if (userRole === 'admin' && record.metric) {
            // For admin metrics, navigate to relevant section
            if (record.id.includes('requests')) {
              onNavigate?.('/app/requests');
            } else if (record.id.includes('users')) {
              onNavigate?.('/app/users');
            }
          } else {
            // For requests, navigate to request detail
            onNavigate?.(`/app/requests/${record.id}`);
          }
        }
      }
    ];

    if (userRole === 'employee') {
      baseActions.push({
        key: 'update',
        label: 'Actualizar Progreso',
        icon: 'Edit',
        variant: 'primary',
        onClick: (record) => {
          console.log('Update progress for:', record.id);
          // Here you would open a progress update modal
        }
      });
    }

    if (userRole === 'client') {
      baseActions.push({
        key: 'cancel',
        label: 'Cancelar',
        icon: 'X',
        variant: 'destructive',
        onClick: (record) => {
          console.log('Cancel request:', record.id);
          // Here you would show confirmation dialog
        },
        disabled: (record) => record.status === 'completed' || record.status === 'in-progress'
      });
    }

    return baseActions;
  };

  // Event handlers
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Filters:', filters);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    console.log('Sort:', column, direction);
  };

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleRowClick = (record: any) => {
    if (userRole === 'admin' && record.metric) {
      return; // Don't navigate on admin metrics click
    }
    onNavigate?.(`/app/requests/${record.id}`);
  };

  const tableConfig = getTableConfig();

  return (
    <MainLayout
      user={user}
      currentRoute="dashboard"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" weight="bold" className="mb-2">
              Dashboard
            </Typography>
            <Typography variant="p" color="muted">
              {userRole === 'admin' && 'Panel de administración y métricas del sistema'}
              {userRole === 'employee' && 'Tus tareas y solicitudes asignadas'}
              {userRole === 'client' && `Bienvenido de vuelta, ${user.name.split(' ')[0]}`}
            </Typography>
          </div>

          {userRole === 'client' && (
            <Button
              variant="primary"
              icon="Plus"
              iconPosition="left"
              onClick={() => onNavigate?.('/app/requests/new')}
            >
              Nueva Solicitud
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Typography variant="h3" weight="medium" className="mb-1">
              {tableConfig.title}
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              {tableConfig.subtitle}
            </Typography>
          </div>

          <Table
            data={tableConfig.data}
            columns={tableConfig.columns}
            loading={false}
            selectable={false}
            rowActions={{
              items: getRowActions(),
              trigger: 'hover',
              maxVisible: 2
            }}
            pagination={{
              page: currentPage,
              pageSize: pageSize,
              total: tableConfig.data.length,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20]
            }}
            filters={{
              searchPlaceholder: userRole === 'admin' ? 'Buscar métricas...' : 'Buscar solicitudes...',
              searchFields: userRole === 'admin' ? ['metric', 'category'] : ['title', 'description'],
              quickFilters: userRole !== 'admin' ? [
                {
                  key: 'status',
                  label: 'Estado',
                  type: 'select',
                  options: [
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'approved', label: 'Aprobado' },
                    { value: 'in-progress', label: 'En Progreso' },
                    { value: 'completed', label: 'Completado' }
                  ]
                },
                {
                  key: 'priority',
                  label: 'Prioridad',
                  type: 'select',
                  options: [
                    { value: 'low', label: 'Baja' },
                    { value: 'medium', label: 'Media' },
                    { value: 'high', label: 'Alta' }
                  ]
                }
              ] : [
                {
                  key: 'category',
                  label: 'Categoría',
                  type: 'select',
                  options: [
                    { value: 'Requests', label: 'Solicitudes' },
                    { value: 'Users', label: 'Usuarios' },
                    { value: 'Performance', label: 'Rendimiento' },
                    { value: 'Quality', label: 'Calidad' }
                  ]
                }
              ]
            }}
            sorting={{
              defaultSort: { 
                column: userRole === 'admin' ? 'lastUpdated' : 'requestDate', 
                direction: 'desc' 
              }
            }}
            styling={{
              size: 'md',
              hoverable: true,
              striped: false
            }}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;