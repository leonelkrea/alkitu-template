import React from 'react';
import Typography from '../../atoms/Typography';
import NotificationsPanel from '../../organisms/NotificationsPanel';
import NotificationsPanelMobile from '../../organisms/NotificationsPanelMobile';
import { useIsMobile } from '../../ui/use-mobile';

const NotificationsPanelDemo: React.FC = () => {
  const isMobile = useIsMobile();

  const mockNotifications = [
    {
      id: '1',
      title: 'Solicitud aprobada',
      message:
        'Tu solicitud de soporte técnico ha sido aprobada y asignada al equipo correspondiente.',
      type: 'success' as const,
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl: '/requests/123',
    },
    {
      id: '2',
      title: 'Mantenimiento programado',
      message:
        'El sistema estará en mantenimiento mañana de 2:00 a 4:00 AM. Durante este tiempo algunos servicios no estarán disponibles.',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      isRead: false,
    },
    {
      id: '3',
      title: 'Error en el servicio',
      message:
        'Se ha detectado un error en el servicio de email. Nuestro equipo técnico está trabajando para solucionarlo.',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isRead: false,
    },
    {
      id: '4',
      title: 'Nueva actualización disponible',
      message:
        'Hay una nueva versión del sistema disponible con mejoras importantes de seguridad y rendimiento.',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isRead: true,
    },
    {
      id: '5',
      title: 'Bienvenido al sistema',
      message:
        'Tu cuenta ha sido creada exitosamente. ¡Bienvenido a WorkFlow Pro! Explora todas las funcionalidades disponibles.',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      isRead: true,
    },
  ];

  const handleNotificationClick = (id: string) => {
    console.log('Notificación clickeada:', id);
    const notification = mockNotifications.find((n) => n.id === id);
    alert(`Abriendo notificación: ${notification?.title}`);
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Marcar como leída:', id);
    alert(`Notificación ${id} marcada como leída`);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marcar todas como leídas');
    alert('Todas las notificaciones marcadas como leídas');
  };

  const handleClose = () => {
    console.log('Cerrar panel');
    alert('Cerrando panel de notificaciones');
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Typography variant="h4">Panel de Notificaciones</Typography>
        <Typography
          variant="p"
          size="sm"
          color="muted"
          className="hidden md:block"
        >
          Sistema de notificaciones con versiones para desktop y móvil
        </Typography>
        <Typography variant="p" size="sm" color="muted" className="md:hidden">
          Versión móvil con filtros, búsqueda y navegación optimizada
        </Typography>
      </div>

      {/* Demostración del componente */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border">
          <Typography variant="p" size="sm" weight="medium">
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente:{' '}
            {isMobile ? 'NotificationsPanelMobile' : 'NotificationsPanel'}
          </Typography>
        </div>

        <div className={`${isMobile ? 'h-96' : 'flex justify-center p-6'}`}>
          {isMobile ? (
            <NotificationsPanelMobile
              notifications={mockNotifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={handleClose}
            />
          ) : (
            <NotificationsPanel
              notifications={mockNotifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <Typography variant="p" size="sm" weight="medium">
          🔔 Características del sistema de notificaciones:
        </Typography>
        <ul className="space-y-1 pl-4">
          <li className="text-sm text-muted-foreground">
            • 📱 Móvil: Pantalla completa, filtros por tabs, timestamps
            relativos
          </li>
          <li className="text-sm text-muted-foreground">
            • 🖥️ Desktop: Panel flotante, vista compacta, hover interactions
          </li>
          <li className="text-sm text-muted-foreground">
            • 🏷️ Tipos: Info, Success, Warning, Error con iconografía específica
          </li>
          <li className="text-sm text-muted-foreground">
            • ⚡ Estados: Leídas/No leídas, marcado individual y masivo
          </li>
          <li className="text-sm text-muted-foreground">
            • 🕒 Timestamps inteligentes con formato relativo
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPanelDemo;
