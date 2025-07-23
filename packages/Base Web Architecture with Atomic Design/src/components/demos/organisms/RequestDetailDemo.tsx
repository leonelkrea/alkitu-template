import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import RequestDetail, { RequestData } from '../../organisms/RequestDetail';

const RequestDetailDemo: React.FC = () => {
  const [viewType, setViewType] = useState<'client' | 'admin'>('client');
  const [currentStatus, setCurrentStatus] = useState<RequestData['status']>('OPEN');
  const [selectedRequest, setSelectedRequest] = useState<'simple' | 'complex'>('simple');

  // Sample request data - Simple
  const simpleRequestData: RequestData = {
    id: 'REQ-1234',
    status: currentStatus,
    service: {
      name: 'Pintura de Interior',
      category: 'Hogar',
      description: 'Servicio de pintura interior para habitaciones principales. Incluye preparación de superficie, aplicación de pintura y acabados. Se utilizarán pinturas de alta calidad con baja emisión de VOC.'
    },
    executionDateTime: '2025-06-20T14:00:00',
    location: {
      address: '123 Main St',
      building: 'Torre B',
      apartment: 'Apt 502',
      city: 'Denver',
      state: 'CO',
      zipCode: '80203'
    },
    requestDate: '2025-06-15T09:30:00',
    openedDate: viewType === 'admin' ? '2025-06-16T08:45:00' : undefined,
    requester: {
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@ejemplo.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',
      company: 'Acme Corporation',
      contactPerson: 'María González',
      contactPhone: '+1 (555) 987-6543'
    },
    notes: 'Por favor utilizar pintura con bajo contenido de VOC para las paredes del dormitorio principal. Tengo alergias a los olores químicos fuertes.',
    photos: [
      {
        id: 'photo1',
        url: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800&h=600',
        alt: 'Estado actual de la pared',
        thumbnail: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=150&h=150'
      },
      {
        id: 'photo2',
        url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600',
        alt: 'Vista general de la habitación',
        thumbnail: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=150&h=150'
      },
      {
        id: 'photo3',
        url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600',
        alt: 'Detalle de la superficie',
        thumbnail: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=150&h=150'
      }
    ],
    priority: 'medium',
    estimatedDuration: 6,
    assignedEmployee: viewType === 'admin' ? {
      id: 'emp-123',
      name: 'Miguel Rodríguez',
      email: 'miguel.rodriguez@empresa.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miguel'
    } : undefined
  };

  // Sample request data - Complex
  const complexRequestData: RequestData = {
    id: 'REQ-5678',
    status: currentStatus,
    service: {
      name: 'Renovación Completa de Cocina',
      category: 'Remodelación',
      description: 'Proyecto integral de renovación de cocina que incluye: instalación de gabinetes nuevos, encimeras de cuarzo, electrodomésticos de acero inoxidable, nueva iluminación LED, y piso de baldosas cerámicas. Requiere coordinación con trabajo eléctrico y plomería.'
    },
    executionDateTime: '2025-07-01T08:00:00',
    location: {
      address: '456 Oak Avenue',
      building: 'Complejo Residencial A',
      apartment: 'Unidad 12B',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301'
    },
    requestDate: '2025-06-10T16:20:00',
    openedDate: viewType === 'admin' ? '2025-06-11T10:15:00' : undefined,
    requester: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@correo.com',
      phone: '+1 (512) 555-0123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      company: 'Johnson Family Trust',
      contactPerson: 'Robert Johnson',
      contactPhone: '+1 (512) 555-0124'
    },
    notes: 'Renovación completa de cocina incluyendo nuevos gabinetes, encimeras, electrodomésticos y pisos. Es necesario coordinar con trabajo eléctrico y plomería. Acceso únicamente por el elevador de servicio entre 8 AM - 6 PM.',
    photos: [
      {
        id: 'photo1',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600',
        alt: 'Estado actual de la cocina',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150'
      },
      {
        id: 'photo2',
        url: 'https://images.unsplash.com/photo-1556909084-6d1c1e2e4ba4?w=800&h=600',
        alt: 'Plano de distribución de cocina',
        thumbnail: 'https://images.unsplash.com/photo-1556909084-6d1c1e2e4ba4?w=150&h=150'
      },
      {
        id: 'photo3',
        url: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600',
        alt: 'Especificaciones de electrodomésticos',
        thumbnail: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=150&h=150'
      },
      {
        id: 'photo4',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600',
        alt: 'Muestras de materiales',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150'
      }
    ],
    templateFields: {
      'Estilo Preferido': 'Moderno Minimalista',
      'Rango de Presupuesto': '$25,000 - $35,000',
      'Flexibilidad de Horario': 'Algo flexible',
      'Requerimientos Especiales': 'Materiales pet-friendly',
      'Preferencia de Contacto': 'Email + Teléfono',
      'Tiempo de Entrega': '2-3 semanas',
      'Garantía Requerida': 'Sí, mínimo 2 años'
    },
    priority: 'high',
    estimatedDuration: 120,
    assignedEmployee: viewType === 'admin' ? {
      id: 'emp-456',
      name: 'Carlos Méndez',
      email: 'carlos.mendez@empresa.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos'
    } : undefined
  };

  const getCurrentRequest = () => {
    return selectedRequest === 'simple' ? simpleRequestData : complexRequestData;
  };

  const currentUser = {
    id: viewType === 'client' ? 'client-123' : 'admin-456',
    name: viewType === 'client' ? getCurrentRequest().requester.name : 'Admin User',
    role: viewType as 'client' | 'admin'
  };

  const handleStatusChange = (requestId: string, newStatus: RequestData['status']) => {
    setCurrentStatus(newStatus);
    console.log(`Status changed for ${requestId}: ${newStatus}`);
  };

  const handleFieldEdit = (requestId: string, field: string, value: any) => {
    console.log(`Field edited for ${requestId}: ${field} = ${value}`);
  };

  const handleCancel = (requestId: string) => {
    console.log(`Request ${requestId} cancellation requested`);
    alert(`Solicitud de cancelación enviada para ${requestId}`);
  };

  const handleDelete = (requestId: string) => {
    console.log(`Request ${requestId} deletion requested`);
    if (confirm(`¿Estás seguro de que quieres eliminar la solicitud ${requestId}?`)) {
      alert(`Solicitud ${requestId} eliminada`);
    }
  };

  const handleNotificationClick = () => {
    console.log('Notifications panel opened');
    alert('Panel de notificaciones abierto');
  };

  const handleAddPhoto = (requestId: string, file: File) => {
    console.log(`Photo added to ${requestId}:`, file.name);
    alert(`Foto "${file.name}" agregada a la solicitud ${requestId}`);
  };

  const handleContactClient = (phone: string) => {
    console.log(`Contacting client at: ${phone}`);
    alert(`Iniciando llamada a ${phone}`);
  };

  const getStatusInfo = (status: RequestData['status']) => {
    const statusInfo = {
      'OPEN': { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Abierta' },
      'PENDING': { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendiente' },
      'ONGOING': { color: 'text-green-600', bg: 'bg-green-50', label: 'En progreso' },
      'COMPLETED': { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completada' },
      'CANCELLED': { color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelada' }
    };
    return statusInfo[status];
  };

  return (
    <div className="space-y-8 p-6">
      {/* Demo Controls */}
      <div className="space-y-6">
        <Typography variant="h3">Request Detail Component - Nueva Jerarquía</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              🏗️ Nueva estructura jerárquica
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • <strong>1. Solicitante:</strong> Nombre, empresa y botón de contacto<br/>
              • <strong>2. Servicio:</strong> Nombre, descripción y fotos adjuntas<br/>
              • <strong>3. Ubicación:</strong> Dirección y ficha completa del cliente<br/>
              • <strong>4. Sidebar:</strong> Estado, fechas y acciones administrativas
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              ⚡ Mejoras implementadas
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • <strong>Botón contacto:</strong> Llamada directa al cliente<br/>
              • <strong>Mejor organización:</strong> Información más limpia y estructurada<br/>
              • <strong>Sidebar consolidado:</strong> Estado y acciones en panel derecho<br/>
              • <strong>Galería de fotos:</strong> Vista mejorada con grid responsivo
            </Typography>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-neutral-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Vista:
          </Typography>
          <Button
            variant={viewType === 'client' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewType('client')}
          >
            Cliente
          </Button>
          <Button
            variant={viewType === 'admin' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewType('admin')}
          >
            Administrador
          </Button>
        </div>

        <div className="w-px h-6 bg-border"></div>

        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Complejidad:
          </Typography>
          <Button
            variant={selectedRequest === 'simple' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedRequest('simple')}
          >
            Simple
          </Button>
          <Button
            variant={selectedRequest === 'complex' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedRequest('complex')}
          >
            Compleja
          </Button>
        </div>

        <div className="w-px h-6 bg-border"></div>

        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Estado:
          </Typography>
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as RequestData['status'])}
            className="px-3 py-1 border border-border rounded-md bg-input-background text-sm"
          >
            <option value="OPEN">OPEN</option>
            <option value="PENDING">PENDING</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <div className={`px-2 py-1 rounded text-xs ${getStatusInfo(currentStatus).color} ${getStatusInfo(currentStatus).bg}`}>
            {getStatusInfo(currentStatus).label}
          </div>
        </div>
      </div>

      {/* Current Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted" className="mb-1">
            Vista actual:
          </Typography>
          <Typography variant="p" weight="medium" className="capitalize">
            {viewType === 'client' ? '👤 Cliente' : '🔧 Administrador'}
          </Typography>
          <Typography variant="p" size="xs" color="muted" className="mt-1">
            {viewType === 'client' 
              ? 'Vista simplificada con botón de contacto'
              : 'Panel completo con controles administrativos'
            }
          </Typography>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted" className="mb-1">
            Solicitud:
          </Typography>
          <Typography variant="p" weight="medium">
            {getCurrentRequest().id} - {selectedRequest === 'simple' ? '🎨 Simple' : '🏗️ Compleja'}
          </Typography>
          <Typography variant="p" size="xs" color="muted" className="mt-1">
            {getCurrentRequest().service.name}
          </Typography>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted" className="mb-1">
            Estado actual:
          </Typography>
          <Typography variant="p" weight="medium">
            {getStatusInfo(currentStatus).label}
          </Typography>
          <Typography variant="p" size="xs" color="muted" className="mt-1">
            {currentStatus === 'OPEN' && 'Cliente puede cancelar (<48h)'}
            {currentStatus === 'PENDING' && 'Esperando procesamiento'}
            {currentStatus === 'ONGOING' && 'Trabajo en progreso'}
            {currentStatus === 'COMPLETED' && 'Trabajo finalizado'}
            {currentStatus === 'CANCELLED' && 'Solicitud cancelada'}
          </Typography>
        </div>
      </div>

      {/* Component Demo */}
      <div className="bg-neutral-50 p-6 rounded-lg border border-border">
        <RequestDetail
          request={getCurrentRequest()}
          viewType={viewType}
          currentUser={currentUser}
          unreadNotifications={viewType === 'client' ? 3 : 0}
          onBack={() => console.log('Navigate back')}
          onCancel={handleCancel}
          onStatusChange={handleStatusChange}
          onFieldEdit={handleFieldEdit}
          onDelete={handleDelete}
          onNotificationClick={handleNotificationClick}
          onAddPhoto={handleAddPhoto}
          onContactClient={handleContactClient}
        />
      </div>

      {/* Nueva estructura documentation */}
      <div className="space-y-6">
        <Typography variant="h3">Nueva Jerarquía Implementada</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jerarquía de información */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>📋</span>
              <span>Jerarquía de Información</span>
            </Typography>
            
            <div className="space-y-4 text-sm">
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-design-primary mb-2">
                  1. SOLICITANTE (Header Principal)
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Avatar grande del usuario</li>
                  <li>• Nombre completo prominente</li>
                  <li>• Empresa (si aplica)</li>
                  <li>• Email de contacto</li>
                  <li>• Botón de contacto telefónico</li>
                </ul>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-design-secondary mb-2">
                  2. SERVICIO (Contenido Principal)
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Nombre del servicio + categoría</li>
                  <li>• Descripción detallada del trabajo</li>
                  <li>• Galería de fotos en grid responsivo</li>
                  <li>• Campos adicionales del template</li>
                  <li>• Opción de agregar más fotos (cliente)</li>
                </ul>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-warning mb-2">
                  3. UBICACIÓN Y FICHA
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Dirección completa con icono</li>
                  <li>• Ficha detallada del cliente</li>
                  <li>• Información de contacto estructurada</li>
                  <li>• Datos de empresa y contactos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Sidebar Derecho</span>
            </Typography>
            
            <div className="space-y-4 text-sm">
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-success mb-2">
                  ESTADO Y FECHAS
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Estado actual con badge</li>
                  <li>• Fecha de envío</li>
                  <li>• Fecha de ejecución solicitada</li>
                  <li>• Fecha de apertura (admin)</li>
                  <li>• Prioridad de la solicitud</li>
                </ul>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-error mb-2">
                  ACCIONES ADMINISTRATIVAS
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Dropdown para cambio de estado</li>
                  <li>• Botones de acción rápida</li>
                  <li>• Eliminar solicitud</li>
                  <li>• Solo visible para administradores</li>
                </ul>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <Typography variant="p" size="sm" weight="medium" className="text-neutral-600 mb-2">
                  EMPLEADO ASIGNADO
                </Typography>
                <ul className="space-y-1 ml-4 text-xs text-muted-foreground">
                  <li>• Avatar y datos del empleado</li>
                  <li>• Estado de notificación</li>
                  <li>• Solo para administradores</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flujo de interacciones */}
      <div className="space-y-6">
        <Typography variant="h3">Flujo de Interacciones</Typography>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h4" className="mb-4 flex items-center space-x-2">
                <span>👤</span>
                <span>Vista Cliente</span>
              </Typography>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Visualización</Typography>
                    <Typography variant="p" size="xs" color="muted">Información completa pero solo lectura</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Agregar fotos</Typography>
                    <Typography variant="p" size="xs" color="muted">Botón "+" para subir imágenes adicionales</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Cancelación</Typography>
                    <Typography variant="p" size="xs" color="muted">Solo si status=OPEN y &lt;48h desde envío</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Notificaciones</Typography>
                    <Typography variant="p" size="xs" color="muted">Bell flotante con contador de updates</Typography>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h4" className="mb-4 flex items-center space-x-2">
                <span>🔧</span>
                <span>Vista Administrador</span>
              </Typography>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Contacto directo</Typography>
                    <Typography variant="p" size="xs" color="muted">Botón para llamar directamente al cliente</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Edición inline</Typography>
                    <Typography variant="p" size="xs" color="muted">Iconos de editar en descripción, ubicación, fechas</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Gestión de estado</Typography>
                    <Typography variant="p" size="xs" color="muted">Dropdown y botones para cambiar estado</Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Eliminación</Typography>
                    <Typography variant="p" size="xs" color="muted">Botón destructivo para borrar solicitud</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailDemo;