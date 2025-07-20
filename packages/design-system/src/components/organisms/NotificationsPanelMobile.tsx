import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import IconButtonMobile from '../molecules/IconButtonMobile';
import Card from '../molecules/Card';

export interface NotificationMobile {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationsPanelMobileProps {
  notifications: NotificationMobile[];
  onNotificationClick?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClose?: () => void;
  className?: string;
}

const NotificationsPanelMobile: React.FC<NotificationsPanelMobileProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  className = '',
  ...props
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-primary';
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-primary/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`h-full bg-background ${className}`} {...props}>
      {/* Header */}
      <div className="bg-card border-b border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Typography variant="h3" weight="medium">
              Notificaciones
            </Typography>
            {unreadCount > 0 && (
              <div className="bg-error text-error-foreground px-2 py-1 rounded-full min-w-[1.5rem] h-6 flex items-center justify-center">
                <Typography variant="p" size="xs" weight="bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Typography>
              </div>
            )}
          </div>
          
          {onClose && (
            <IconButtonMobile
              icon="X"
              size="sm"
              variant="ghost"
              onClick={onClose}
              label="Cerrar"
            />
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`
              flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors
              ${filter === 'all' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`
              flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors
              ${filter === 'unread' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            No leídas ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="w-full"
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                variant="vertical"
                title=""
                onClick={() => onNotificationClick?.(notification.id)}
                className={`
                  cursor-pointer transition-all hover:shadow-md
                  ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}
                `}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${getNotificationBgColor(notification.type)}
                    `}>
                      <Icon 
                        name={getNotificationIcon(notification.type) as any}
                        size="md"
                        className={getNotificationColor(notification.type)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <Typography 
                          variant="p" 
                          size="sm" 
                          weight="medium"
                          className="line-clamp-2"
                        >
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2 mt-1" />
                        )}
                      </div>
                      
                      <Typography 
                        variant="p" 
                        size="sm" 
                        color="muted"
                        className="line-clamp-3 mb-2"
                      >
                        {notification.message}
                      </Typography>
                      
                      <div className="flex items-center justify-between">
                        <Typography 
                          variant="p" 
                          size="xs" 
                          color="muted"
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                        
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead?.(notification.id);
                            }}
                            className="text-xs text-primary hover:text-primary/80 font-medium"
                          >
                            Marcar leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 p-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="Bell" size="lg" color="muted" />
            </div>
            <Typography variant="h4" weight="medium" className="mb-2">
              {filter === 'unread' ? 'Sin notificaciones nuevas' : 'Sin notificaciones'}
            </Typography>
            <Typography variant="p" size="sm" color="muted" className="text-center">
              {filter === 'unread' 
                ? 'Todas tus notificaciones están al día' 
                : 'No tienes notificaciones en este momento'
              }
            </Typography>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="bg-card border-t border-border p-4">
          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={() => {
              // Implement show all notifications
              console.log('Ver todas las notificaciones');
            }}
          >
            Ver historial completo
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanelMobile;