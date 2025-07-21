import React from 'react';
import MainLayout from './MainLayout';
import RequestDetail from '../organisms/RequestDetail';

export interface RequestDetailPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  userRole?: 'admin' | 'employee' | 'client';
  requestId: string;
  onNavigate?: (route: string) => void;
  className?: string;
}

const RequestDetailPage: React.FC<RequestDetailPageProps> = ({
  user,
  userRole = 'client',
  requestId,
  onNavigate,
  className = '',
  ...props
}) => {
  // Mock request data
  const mockRequest = {
    id: requestId,
    status: 'ONGOING' as const,
    service: {
      name: 'Mantenimiento Aire Acondicionado',
      category: 'Mantenimiento',
      description: 'El sistema de climatización de la oficina principal necesita revisión y mantenimiento preventivo. Se ha detectado ruido anormal y una disminución en la eficiencia de enfriamiento.',
    },
    executionDateTime: '2024-06-20T17:00:00Z',
    location: {
      address: 'Calle Principal 123',
      building: 'Edificio Central',
      apartment: 'Oficina 4B',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28001',
    },
    requestDate: '2024-06-15T10:00:00Z',
    openedDate: '2024-06-15T11:30:00Z',
    requester: {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      phone: '+34 600 123 456',
      company: 'Empresa Ejemplo S.L.',
      contactPerson: 'Ana García',
      contactPhone: '+34 600 789 012',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    notes: 'El equipo requiere revisión urgente debido a los ruidos anormales reportados. Se recomienda revisar el compresor y los filtros.',
    priority: 'high' as const,
    estimatedDuration: 4,
    assignedEmployee: {
      id: 'emp-001',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face',
    },
    photos: [
      {
        id: 'att-001',
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop',
        alt: 'Sistema de aire acondicionado',
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=100&fit=crop',
      },
      {
        id: 'att-002',
        url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=192&fit=crop',
        alt: 'Diagnóstico inicial',
        thumbnail: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=100&fit=crop',
      },
    ],
    templateFields: {
      'Tipo de equipo': 'Split de pared',
      'Marca': 'Daikin',
      'Modelo': 'FTXS50K',
      'Fecha de instalación': '2022-03-15',
      'Última revisión': '2023-06-10',
    },
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    console.log('Cambiar estado:', requestId, 'a', newStatus);
  };

  const handleCancel = (requestId: string) => {
    console.log('Cancelar solicitud:', requestId);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/app/requests');
    }
  };

  return (
    <MainLayout
      user={user}
      currentRoute="requests"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <RequestDetail
        request={mockRequest}
        viewType={userRole === 'admin' ? 'admin' : 'client'}
        currentUser={
          userRole
            ? {
                id: 'current-user-id',
                name: user.name,
                role: userRole,
              }
            : undefined
        }
        onBack={handleBack}
        onCancel={handleCancel}
        onStatusChange={handleStatusChange}
        onFieldEdit={(requestId, field, value) => {
          console.log('Editar campo:', field, 'en solicitud:', requestId, 'con valor:', value);
        }}
        onDelete={(requestId) => {
          console.log('Eliminar solicitud:', requestId);
        }}
        onAddPhoto={(requestId, file) => {
          console.log('Agregar foto a solicitud:', requestId, 'archivo:', file.name);
        }}
        onContactClient={(phone) => {
          console.log('Contactar cliente al:', phone);
        }}
      />
    </MainLayout>
  );
};

export default RequestDetailPage;
