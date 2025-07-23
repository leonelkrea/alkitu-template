import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Card from '../molecules/Card';
import IconButton from '../molecules/IconButton';
import FormField from '../molecules/FormField';
import Avatar from '../atoms/Avatar';
import NotificationDot from '../molecules/NotificationDot';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

// Updated interfaces based on the new requirements
export interface RequestUser {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  company?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface RequestLocation {
  address: string;
  building?: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface RequestService {
  name: string;
  category: string;
  description?: string;
}

export interface RequestData {
  id: string;
  status: 'OPEN' | 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  service: RequestService;
  executionDateTime: string;
  location: RequestLocation;
  requestDate: string;
  openedDate?: string; // When admin opened the request
  requester: RequestUser;
  notes?: string;
  photos?: Array<{
    id: string;
    url: string;
    alt: string;
    thumbnail?: string;
  }>;
  templateFields?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  estimatedDuration?: number; // in hours
  assignedEmployee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface RequestDetailProps {
  request: RequestData;
  viewType: 'client' | 'admin';
  currentUser?: {
    id: string;
    name: string;
    role: 'client' | 'admin' | 'employee';
  };
  unreadNotifications?: number;
  onBack?: () => void;
  onCancel?: (requestId: string) => void;
  onStatusChange?: (requestId: string, newStatus: RequestData['status']) => void;
  onFieldEdit?: (requestId: string, field: string, value: any) => void;
  onDelete?: (requestId: string) => void;
  onNotificationClick?: () => void;
  onAddPhoto?: (requestId: string, file: File) => void;
  onContactClient?: (phone: string) => void;
  className?: string;
}

const RequestDetail: React.FC<RequestDetailProps> = ({
  request,
  viewType,
  currentUser,
  unreadNotifications = 0,
  onBack,
  onCancel,
  onStatusChange,
  onFieldEdit,
  onDelete,
  onNotificationClick,
  onAddPhoto,
  onContactClient,
  className = ''
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');

  // Status configurations
  const statusConfig = {
    'OPEN': { variant: 'primary' as const, label: 'Abierta', color: '#F2AB27' },
    'PENDING': { variant: 'warning' as const, label: 'Pendiente', color: '#F2921D' },
    'ONGOING': { variant: 'secondary' as const, label: 'En progreso', color: '#2F9E44' },
    'COMPLETED': { variant: 'success' as const, label: 'Completada', color: '#2F9E44' },
    'CANCELLED': { variant: 'error' as const, label: 'Cancelada', color: '#D92D20' }
  };

  // Helper function to get status config safely
  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['OPEN'];
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatLocation = (location: RequestLocation) => {
    if (!location) return '';
    
    let address = location.address || '';
    if (location.building) address += `, ${location.building}`;
    if (location.apartment) address += `, ${location.apartment}`;
    address += `, ${location.city || ''}, ${location.state || ''} ${location.zipCode || ''}`;
    return address;
  };

  const canCancelRequest = () => {
    if (request.status !== 'OPEN') return false;
    try {
      const requestTime = new Date(request.requestDate).getTime();
      const now = Date.now();
      const timeDiff = now - requestTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff < 48;
    } catch (error) {
      return false;
    }
  };

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (editingField && onFieldEdit) {
      onFieldEdit(request.id, editingField, editValue);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleStatusTransition = (newStatus: RequestData['status']) => {
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAddPhoto) {
      onAddPhoto(request.id, file);
    }
  };

  const handleContactClient = () => {
    const phone = request.requester?.phone || request.requester?.contactPhone;
    if (phone && onContactClient) {
      onContactClient(phone);
    }
  };

  // Early return if request is not properly defined
  if (!request || !request.id) {
    return (
      <div className="flex items-center justify-center p-8">
        <Typography variant="p" color="muted">
          No hay datos de solicitud disponibles
        </Typography>
      </div>
    );
  }

  const currentStatusConfig = getStatusConfig(request.status);
  const primaryPhone = request.requester?.phone || request.requester?.contactPhone;

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <IconButton
              icon="ArrowLeft"
              iconOnly
              variant="ghost"
              tooltip="Volver"
              onClick={onBack}
            />
          )}
          <div>
            <Typography variant="h2" weight="medium">
              Solicitud #{request.id}
            </Typography>
          </div>
        </div>
        
        {viewType === 'admin' && (
          <div className="flex items-center space-x-2">
            <IconButton
              icon="Trash2"
              iconOnly
              variant="destructive"
              tooltip="Eliminar solicitud"
              onClick={() => onDelete?.(request.id)}
            />
            <IconButton
              icon="MoreVertical"
              iconOnly
              variant="ghost"
              tooltip="Más opciones"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. SOLICITANTE - Header Principal */}
          <Card variant="vertical" title="">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={request.requester?.avatar}
                    fallback={request.requester?.name || 'Usuario'}
                    size="lg"
                  />
                  <div>
                    <Typography variant="h3" weight="medium">
                      {request.requester?.name || 'Sin nombre'}
                    </Typography>
                    {request.requester?.company && (
                      <Typography variant="p" size="sm" color="muted" className="mb-2">
                        {request.requester.company}
                      </Typography>
                    )}
                    <Typography variant="p" size="sm" color="muted">
                      {request.requester?.email || 'Sin email'}
                    </Typography>
                  </div>
                </div>
                
                {/* Botón de Contacto */}
                {primaryPhone && (
                  <Button
                    variant="outline"
                    icon="Phone"
                    onClick={handleContactClient}
                    className="flex-shrink-0"
                  >
                    Contactar
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* 2. SERVICIO - Nombre, descripción y fotos */}
          <Card variant="vertical" title="">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Wrench" size="md" color="primary" />
                  <div>
                    <Typography variant="h3" weight="medium">
                      {request.service?.name || 'Sin especificar'}
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      {request.service?.category || 'Sin categoría'}
                    </Typography>
                  </div>
                </div>
                
                {viewType === 'admin' && (
                  <IconButton
                    icon="Edit"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('service', `${request.service?.name || ''} (${request.service?.category || ''})`)}
                  />
                )}
              </div>

              {/* Descripción del servicio */}
              {(request.service?.description || request.notes) && (
                <div className="mb-6">
                  <Typography variant="h4" weight="medium" className="mb-3">
                    Descripción del servicio
                  </Typography>
                  <div className="bg-neutral-100 p-4 rounded-lg">
                    {editingField === 'description' && viewType === 'admin' ? (
                      <div className="space-y-3">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full p-3 border border-border rounded-md bg-input-background text-sm resize-none"
                          rows={4}
                          placeholder="Descripción del servicio..."
                        />
                        <div className="flex items-center space-x-2">
                          <IconButton icon="Check" iconOnly size="sm" variant="primary" onClick={handleSaveEdit} />
                          <IconButton icon="X" iconOnly size="sm" variant="ghost" onClick={handleCancelEdit} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <Typography variant="p" size="sm">
                          {request.service?.description || request.notes || 'Sin descripción disponible'}
                        </Typography>
                        {viewType === 'admin' && (
                          <IconButton
                            icon="Edit"
                            iconOnly
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('description', request.service?.description || request.notes || '')}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fotos adjuntas */}
              {request.photos && request.photos.length > 0 && (
                <div>
                  <Typography variant="h4" weight="medium" className="mb-3">
                    Fotos adjuntas
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {request.photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <ImageWithFallback
                          src={photo.thumbnail || photo.url}
                          alt={photo.alt}
                          className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                    ))}
                    
                    {/* Agregar más fotos - solo para cliente */}
                    {viewType === 'client' && (
                      <label className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Icon name="Plus" size="sm" color="muted" className="mx-auto mb-1" />
                          <Typography variant="p" size="xs" color="muted">
                            Agregar
                          </Typography>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Campos adicionales del template */}
              {request.templateFields && Object.keys(request.templateFields).length > 0 && (
                <div className="mt-6">
                  <Typography variant="h4" weight="medium" className="mb-3">
                    Información adicional
                  </Typography>
                  <div className="bg-neutral-100 p-4 rounded-lg space-y-2">
                    {Object.entries(request.templateFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <Typography variant="p" size="sm" weight="medium">
                          {key}:
                        </Typography>
                        <Typography variant="p" size="sm">
                          {String(value)}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 3. UBICACIÓN Y FICHA DEL CLIENTE */}
          <Card variant="vertical" title="">
            <div className="p-6">
              <Typography variant="h3" weight="medium" className="mb-4">
                Ubicación del servicio
              </Typography>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon name="MapPin" size="md" color="primary" className="mt-1" />
                  <div className="flex-1">
                    {editingField === 'location' && viewType === 'admin' ? (
                      <div className="space-y-2">
                        <FormField
                          label=""
                          inputProps={{
                            value: editValue,
                            onChange: (e) => setEditValue(e.target.value),
                            placeholder: "Dirección completa"
                          }}
                        />
                        <div className="flex items-center space-x-2">
                          <IconButton icon="Check" iconOnly size="sm" variant="primary" onClick={handleSaveEdit} />
                          <IconButton icon="X" iconOnly size="sm" variant="ghost" onClick={handleCancelEdit} />
                        </div>
                      </div>
                    ) : (
                      <Typography variant="p">
                        {formatLocation(request.location)}
                      </Typography>
                    )}
                  </div>
                </div>
                
                {viewType === 'admin' && editingField !== 'location' && (
                  <IconButton
                    icon="Edit"
                    iconOnly
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('location', formatLocation(request.location))}
                  />
                )}
              </div>

              {/* Ficha del cliente */}
              <div className="border-t border-border pt-4">
                <Typography variant="h4" weight="medium" className="mb-3">
                  Datos del cliente
                </Typography>
                <div className="bg-neutral-100 p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size="sm" color="muted" />
                    <Typography variant="p" size="sm">
                      <strong>Nombre:</strong> {request.requester?.name || 'Sin nombre'}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name="Mail" size="sm" color="muted" />
                    <Typography variant="p" size="sm">
                      <strong>Email:</strong> {request.requester?.email || 'Sin email'}
                    </Typography>
                  </div>
                  
                  {primaryPhone && (
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size="sm" color="muted" />
                      <Typography variant="p" size="sm">
                        <strong>Teléfono:</strong> {primaryPhone}
                      </Typography>
                    </div>
                  )}
                  
                  {request.requester?.company && (
                    <div className="flex items-center space-x-3">
                      <Icon name="Building" size="sm" color="muted" />
                      <Typography variant="p" size="sm">
                        <strong>Empresa:</strong> {request.requester.company}
                      </Typography>
                    </div>
                  )}
                  
                  {request.requester?.contactPerson && (
                    <div className="flex items-center space-x-3">
                      <Icon name="Users" size="sm" color="muted" />
                      <Typography variant="p" size="sm">
                        <strong>Persona de contacto:</strong> {request.requester.contactPerson}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Botón de cancelación para cliente */}
          {viewType === 'client' && (
            <Card variant="vertical" title="">
              <div className="p-6">
                <Button
                  variant="destructive"
                  disabled={!canCancelRequest()}
                  onClick={() => onCancel?.(request.id)}
                  className="w-full"
                >
                  Solicitar cancelación
                </Button>
                {!canCancelRequest() && (
                  <Typography variant="p" size="xs" color="muted" className="mt-2 text-center">
                    {request.status !== 'OPEN' 
                      ? 'No se puede cancelar una solicitud que no está abierta'
                      : 'Solo se puede cancelar dentro de las primeras 48 horas'
                    }
                  </Typography>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Derecha - Estado y Acciones */}
        <div className="space-y-6">
          {/* Estado y Fechas */}
          <Card variant="vertical" title="">
            <div className="p-6 space-y-4">
              <Typography variant="h4" weight="medium" className="mb-4">
                Estado de la solicitud
              </Typography>

              {/* Estado actual */}
              <div className="flex items-center justify-between">
                <Typography variant="p" size="sm" weight="medium">Estado:</Typography>
                <Badge variant={currentStatusConfig.variant}>
                  {currentStatusConfig.label}
                </Badge>
              </div>

              {/* Fecha de envío */}
              <div className="flex items-center justify-between">
                <Typography variant="p" size="sm" weight="medium">Enviada:</Typography>
                <Typography variant="p" size="sm" color="muted">
                  {formatDateShort(request.requestDate)}
                </Typography>
              </div>

              {/* Fecha de ejecución */}
              <div className="flex items-center justify-between">
                <Typography variant="p" size="sm" weight="medium">Ejecución:</Typography>
                {editingField === 'executionDateTime' && viewType === 'admin' ? (
                  <div className="space-y-2">
                    <input
                      type="datetime-local"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="px-2 py-1 border border-border rounded text-xs bg-input-background"
                    />
                    <div className="flex items-center space-x-1">
                      <IconButton icon="Check" iconOnly size="sm" variant="primary" onClick={handleSaveEdit} />
                      <IconButton icon="X" iconOnly size="sm" variant="ghost" onClick={handleCancelEdit} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Typography variant="p" size="sm" color="muted">
                      {formatDateShort(request.executionDateTime)}
                    </Typography>
                    {viewType === 'admin' && (
                      <IconButton
                        icon="Edit"
                        iconOnly
                        size="xs"
                        variant="ghost"
                        onClick={() => handleEdit('executionDateTime', request.executionDateTime)}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Fecha de apertura por admin */}
              {request.openedDate && viewType === 'admin' && (
                <div className="flex items-center justify-between">
                  <Typography variant="p" size="sm" weight="medium">Abierta por ti:</Typography>
                  <Typography variant="p" size="sm" color="muted">
                    {formatDateShort(request.openedDate)}
                  </Typography>
                </div>
              )}

              {/* Prioridad */}
              {request.priority && (
                <div className="flex items-center justify-between">
                  <Typography variant="p" size="sm" weight="medium">Prioridad:</Typography>
                  <Badge 
                    variant={
                      request.priority === 'high' ? 'error' :
                      request.priority === 'medium' ? 'warning' : 'neutral'
                    }
                    size="sm"
                  >
                    {request.priority === 'high' ? 'Alta' :
                     request.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Acciones de Administrador */}
          {viewType === 'admin' && (
            <Card variant="vertical" title="">
              <div className="p-6 space-y-4">
                <Typography variant="h4" weight="medium" className="mb-4">
                  Acciones de administrador
                </Typography>

                {/* Cambio de estado */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">
                    Cambiar estado:
                  </Typography>
                  
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusTransition(e.target.value as RequestData['status'])}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-sm"
                  >
                    <option value="OPEN">ABIERTA</option>
                    <option value="PENDING">PENDIENTE</option>
                    <option value="ONGOING">EN PROGRESO</option>
                    <option value="COMPLETED">COMPLETADA</option>
                    <option value="CANCELLED">CANCELADA</option>
                  </select>
                </div>

                {/* Botones de acción rápida */}
                <div className="space-y-2 pt-3 border-t border-border">
                  {request.status === 'PENDING' && (
                    <Button
                      variant="primary"
                      onClick={() => handleStatusTransition('ONGOING')}
                      className="w-full"
                      size="sm"
                      icon="Play"
                    >
                      Iniciar trabajo
                    </Button>
                  )}

                  {request.status === 'ONGOING' && (
                    <Button
                      variant="success"
                      onClick={() => handleStatusTransition('COMPLETED')}
                      className="w-full"
                      size="sm"
                      icon="Check"
                    >
                      Marcar completado
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => onDelete?.(request.id)}
                    className="w-full"
                    size="sm"
                    icon="Trash2"
                  >
                    Eliminar solicitud
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Empleado asignado */}
          {viewType === 'admin' && request.assignedEmployee && (
            <Card variant="vertical" title="">
              <div className="p-6">
                <Typography variant="h4" weight="medium" className="mb-4">
                  Empleado asignado
                </Typography>
                
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={request.assignedEmployee.avatar}
                    fallback={request.assignedEmployee.name}
                    size="sm"
                  />
                  <div>
                    <Typography variant="p" size="sm" weight="medium">
                      {request.assignedEmployee.name}
                    </Typography>
                    <Typography variant="p" size="xs" color="muted">
                      {request.assignedEmployee.email}
                    </Typography>
                  </div>
                </div>

                {request.status === 'ONGOING' && (
                  <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Bell" size="sm" className="text-success" />
                      <Typography variant="p" size="sm" className="text-success">
                        Notificado automáticamente
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Información adicional */}
          <Card variant="vertical" title="">
            <div className="p-6 space-y-4">
              <Typography variant="h4" weight="medium" className="mb-4">
                Información adicional
              </Typography>

              <div className="space-y-3 text-sm">
                <div>
                  <Typography variant="p" size="sm" color="muted" className="mb-1">
                    ID de solicitud:
                  </Typography>
                  <Typography variant="p" size="sm" weight="medium" className="font-mono">
                    {request.id}
                  </Typography>
                </div>

                {request.estimatedDuration && (
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">
                      Duración estimada:
                    </Typography>
                    <Typography variant="p" size="sm">
                      {request.estimatedDuration} hora{request.estimatedDuration !== 1 ? 's' : ''}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Notificaciones Bell - Solo para clientes */}
      {viewType === 'client' && (
        <div className="fixed bottom-6 right-6">
          <div className="relative">
            <IconButton
              icon="Bell"
              variant="primary"
              size="lg"
              onClick={onNotificationClick}
              tooltip="Notificaciones"
            />
            {unreadNotifications > 0 && (
              <NotificationDot
                count={unreadNotifications}
                variant="error"
                size="lg"
                className="absolute -top-2 -right-2"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;