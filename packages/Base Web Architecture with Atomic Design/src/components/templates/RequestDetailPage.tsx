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
    title: 'Mantenimiento Aire Acondicionado',
    description: 'El sistema de climatización de la oficina principal necesita revisión y mantenimiento preventivo. Se ha detectado ruido anormal y una disminución en la eficiencia de enfriamiento.',
    status: 'in-progress' as const,
    requestType: 'Mantenimiento',
    requestDate: '2024-06-15T10:00:00Z',
    priority: 'high' as const,
    requester: {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      department: 'Administración',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    assignee: {
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face'
    },
    estimatedCompletion: '2024-06-20T17:00:00Z',
    notes: 'El equipo requiere revisión urgente debido a los ruidos anormales reportados. Se recomienda revisar el compresor y los filtros.',
    image: {
      src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop',
      alt: 'Sistema de aire acondicionado'
    },
    attachments: [
      {
        id: 'att-001',
        name: 'diagnostico-inicial.pdf',
        type: 'PDF',
        size: '2.4 MB',
        url: '#'
      },
      {
        id: 'att-002',
        name: 'foto-equipo.jpg',
        type: 'Imagen',
        size: '1.2 MB',
        url: '#'
      }
    ],
    timeline: [
      {
        id: 'tl-001',
        action: 'Solicitud creada',
        user: 'Juan Pérez',
        timestamp: '2024-06-15T10:00:00Z',
        comment: 'Solicitud inicial creada por el usuario'
      },
      {
        id: 'tl-002',
        action: 'Solicitud aprobada',
        user: 'Ana García (Admin)',
        timestamp: '2024-06-15T11:30:00Z',
        comment: 'Solicitud aprobada y asignada a técnico'
      },
      {
        id: 'tl-003',
        action: 'Trabajo iniciado',
        user: 'María López',
        timestamp: '2024-06-15T14:00:00Z',
        comment: 'Técnico ha iniciado el diagnóstico del equipo'
      },
      {
        id: 'tl-004',
        action: 'Actualización de estado',
        user: 'María López',
        timestamp: '2024-06-16T09:15:00Z',
        comment: 'Se identificó problema en el compresor. Pedido repuesto.'
      }
    ]
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    console.log('Cambiar estado:', requestId, 'a', newStatus);
  };

  const handleAssign = (requestId: string) => {
    console.log('Asignar solicitud:', requestId);
  };

  const handleAddNote = (requestId: string, note: string) => {
    console.log('Agregar nota a:', requestId, 'Nota:', note);
  };

  const handleCancel = (requestId: string) => {
    console.log('Cancelar solicitud:', requestId);
  };

  const handleEdit = (requestId: string) => {
    console.log('Editar solicitud:', requestId);
    if (onNavigate) {
      onNavigate(`/app/requests/${requestId}/edit`);
    }
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
        onStatusChange={handleStatusChange}
        onAssign={handleAssign}
        onAddNote={handleAddNote}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onBack={handleBack}
      />
    </MainLayout>
  );
};

export default RequestDetailPage;