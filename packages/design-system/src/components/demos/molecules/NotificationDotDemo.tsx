import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import NotificationDot from '../../molecules/NotificationDot';
import Icon from '../../atoms/Icon';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Button';

const NotificationDotDemo: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(12);

  return (
    <div className="space-y-8">
      {/* Dots simples por colores */}
      <div className="space-y-6">
        <Typography variant="h4">Dots simples por colores:</Typography>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="primary" />
            <Typography variant="p" size="xs" color="muted">Primary</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="success" />
            <Typography variant="p" size="xs" color="muted">Success</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="warning" />
            <Typography variant="p" size="xs" color="muted">Warning</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="error" />
            <Typography variant="p" size="xs" color="muted">Error</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="neutral" />
            <Typography variant="p" size="xs" color="muted">Neutral</Typography>
          </div>
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-6">
        <Typography variant="h4">Tamaños diferentes:</Typography>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="primary" size="sm" />
            <Typography variant="p" size="xs" color="muted">Small</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="primary" size="md" />
            <Typography variant="p" size="xs" color="muted">Medium</Typography>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <NotificationDot color="primary" size="lg" />
            <Typography variant="p" size="xs" color="muted">Large</Typography>
          </div>
        </div>
      </div>

      {/* Con números */}
      <div className="space-y-6">
        <Typography variant="h4">Con contadores numéricos:</Typography>
        <div className="flex items-center space-x-8">
          <div className="relative">
            <Icon name="Bell" size="lg" />
            <NotificationDot 
              count={notificationCount}
              variant="error" 
              className="absolute -top-1 -right-1" 
            />
          </div>
          <div className="relative">
            <Icon name="Mail" size="lg" />
            <NotificationDot 
              count={messageCount}
              variant="primary" 
              className="absolute -top-1 -right-1" 
            />
          </div>
          <div className="relative">
            <Icon name="ShoppingCart" size="lg" />
            <NotificationDot 
              count={150}
              max={99}
              variant="warning" 
              className="absolute -top-1 -right-1" 
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setNotificationCount(prev => Math.max(0, prev - 1))}
          >
            - Notificación
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setNotificationCount(prev => prev + 1)}
          >
            + Notificación
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setMessageCount(prev => Math.max(0, prev - 1))}
          >
            - Mensaje
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setMessageCount(prev => prev + 1)}
          >
            + Mensaje
          </Button>
        </div>
      </div>

      {/* En contexto con diferentes elementos */}
      <div className="space-y-6">
        <Typography variant="h4">En contexto con diferentes elementos:</Typography>
        <div className="flex items-center space-x-8">
          {/* Avatar con estado online */}
          <div className="relative">
            <Avatar
              src="https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face"
              alt="Usuario online"
              size="lg"
            />
            <NotificationDot 
              dot
              variant="success" 
              size="md"
              className="absolute bottom-0 right-0" 
            />
          </div>

          {/* Avatar con notificaciones */}
          <div className="relative">
            <Avatar
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Usuario con notificaciones"
              size="lg"
            />
            <NotificationDot 
              count={5}
              variant="error" 
              size="sm"
              className="absolute -top-1 -right-1" 
            />
          </div>

          {/* Botón con notificación */}
          <div className="relative">
            <Button variant="outline" size="md" icon="Settings">
              Configuración
            </Button>
            <NotificationDot 
              dot
              variant="warning" 
              size="sm"
              className="absolute -top-1 -right-1" 
            />
          </div>
        </div>
      </div>

      {/* Estados especiales */}
      <div className="space-y-6">
        <Typography variant="h4">Estados especiales:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          {/* Sin notificaciones */}
          <div className="bg-neutral-100 p-4 rounded-lg text-center">
            <div className="relative inline-block mb-3">
              <Icon name="Bell" size="lg" />
              <NotificationDot 
                count={0}
                showZero={false}
                variant="error" 
                className="absolute -top-1 -right-1" 
              />
            </div>
            <Typography variant="p" size="sm" weight="medium">Sin notificaciones</Typography>
            <Typography variant="p" size="xs" color="muted">No se muestra el badge</Typography>
          </div>

          {/* Con cero pero visible */}
          <div className="bg-neutral-100 p-4 rounded-lg text-center">
            <div className="relative inline-block mb-3">
              <Icon name="Mail" size="lg" />
              <NotificationDot 
                count={0}
                showZero={true}
                variant="neutral" 
                className="absolute -top-1 -right-1" 
              />
            </div>
            <Typography variant="p" size="sm" weight="medium">Cero visible</Typography>
            <Typography variant="p" size="xs" color="muted">showZero={true}</Typography>
          </div>

          {/* Solo dot */}
          <div className="bg-neutral-100 p-4 rounded-lg text-center">
            <div className="relative inline-block mb-3">
              <Icon name="User" size="lg" />
              <NotificationDot 
                dot={true}
                variant="success" 
                className="absolute -top-1 -right-1" 
              />
            </div>
            <Typography variant="p" size="sm" weight="medium">Solo indicador</Typography>
            <Typography variant="p" size="xs" color="muted">dot={true}</Typography>
          </div>
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-6">
        <Typography variant="h4">Casos de uso comunes:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              Indicadores de estado
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • Usuario online/offline<br/>
              • Estado de conexión<br/>
              • Disponibilidad de servicio<br/>
              • Modo de funcionamiento
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              Contadores de actividad
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • Notificaciones pendientes<br/>
              • Mensajes no leídos<br/>
              • Items en carrito<br/>
              • Tareas por completar
            </Typography>
          </div>
        </div>
      </div>

      {/* Estado actual */}
      <div className="space-y-6">
        <Typography variant="h4">Estado actual:</Typography>
        <div className="bg-neutral-100 p-4 rounded-lg max-w-md">
          <Typography variant="p" size="sm" className="font-mono">
            Notificaciones: {notificationCount}<br/>
            Mensajes: {messageCount}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NotificationDotDemo;