import React from 'react';
import Typography from '../atoms/Typography';
import MainLayout from './MainLayout';
import NotificationsPanel from '../organisms/NotificationsPanel';

export interface NotificationsPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  onNavigate?: (route: string) => void;
  className?: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  user,
  onNavigate,
  className = '',
  ...props
}) => {
  const mockNotifications = [
    {
      id: 'not-001',
      title: 'Nueva solicitud asignada',
      message: 'Se te ha asignado la solicitud "Mantenimiento Aire Acondicionado"',
      type: 'info' as const,
      timestamp: '2024-06-15T10:30:00Z',
      isRead: false,
      actionUrl: '/app/requests/req-001'
    },
    {
      id: 'not-002',
      title: 'Solicitud aprobada',
      message: 'Tu solicitud "Instalación Equipos IT" ha sido aprobada y está en progreso',
      type: 'success' as const,
      timestamp: '2024-06-15T09:15:00Z',
      isRead: false,
      actionUrl: '/app/requests/req-002'
    },
    {
      id: 'not-003',
      title: 'Solicitud próxima a vencer',
      message: 'La solicitud "Reparación Red" vence en 2 horas',
      type: 'warning' as const,
      timestamp: '2024-06-15T08:00:00Z',
      isRead: true,
      actionUrl: '/app/requests/req-003'
    },
    {
      id: 'not-004',
      title: 'Usuario nuevo registrado',
      message: 'Carlos Ruiz se ha registrado en el sistema',
      type: 'info' as const,
      timestamp: '2024-06-14T16:45:00Z',
      isRead: true,
      actionUrl: '/app/users/usr-004'
    },
    {
      id: 'not-005',
      title: 'Error en servicio',
      message: 'Problema detectado en el servicio de backup automático',
      type: 'error' as const,
      timestamp: '2024-06-14T14:20:00Z',
      isRead: true,
      actionUrl: '/app/services/svc-005'
    }
  ];

  const handleNotificationClick = (id: string) => {
    const notification = mockNotifications.find(n => n.id === id);
    if (notification?.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
    }
    console.log('Click en notificación:', id);
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Marcar como leída:', id);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marcar todas como leídas');
  };

  return (
    <MainLayout
      user={user}
      currentRoute="notifications"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Typography variant="h1" weight="bold" className="mb-2">
            Notificaciones
          </Typography>
          <Typography variant="p" color="muted">
            Mantente al día con las últimas actualizaciones y eventos del sistema
          </Typography>
        </div>

        <div className="flex justify-center">
          <NotificationsPanel
            notifications={mockNotifications}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            className="w-full max-w-2xl"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;