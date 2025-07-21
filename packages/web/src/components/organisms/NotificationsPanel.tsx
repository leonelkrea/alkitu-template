import React from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Card from '../molecules/Card';
import NotificationDot from '../molecules/NotificationDot';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  className = '',
  ...props
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <div className={`w-80 ${className}`} {...props}>
      <div className="bg-card border border-border rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Typography variant="h4" weight="medium">
                Notificaciones
              </Typography>
              {unreadCount > 0 && (
                <NotificationDot count={unreadCount} variant="error" />
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-design-primary hover:text-design-primary/80"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 hover:bg-accent/50 cursor-pointer transition-colors
                    ${!notification.isRead ? 'bg-accent/20' : ''}
                  `}
                  onClick={() => onNotificationClick?.(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${notification.type === 'success' ? 'bg-success/10' : ''}
                      ${notification.type === 'warning' ? 'bg-warning/10' : ''}
                      ${notification.type === 'error' ? 'bg-error/10' : ''}
                      ${notification.type === 'info' ? 'bg-design-primary/10' : ''}
                    `}
                    >
                      <Icon
                        name={getNotificationIcon(notification.type) as any}
                        size="sm"
                        color={getNotificationColor(notification.type) as any}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="p"
                          size="sm"
                          weight="medium"
                          className="truncate"
                        >
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-design-primary rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>

                      <Typography
                        variant="p"
                        size="xs"
                        color="muted"
                        className="mt-1"
                      >
                        {notification.message}
                      </Typography>

                      <Typography
                        variant="p"
                        size="xs"
                        color="muted"
                        className="mt-1"
                      >
                        {new Date(notification.timestamp).toLocaleDateString(
                          'es-ES',
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Icon
                name="Bell"
                size="lg"
                color="muted"
                className="mx-auto mb-3"
              />
              <Typography variant="p" color="muted">
                No tienes notificaciones
              </Typography>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <button className="w-full text-center text-sm text-design-primary hover:text-design-primary/80">
              Ver todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
