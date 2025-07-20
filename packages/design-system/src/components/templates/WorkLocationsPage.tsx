import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import Card from '../molecules/Card';
import MainLayout from './MainLayout';

export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'office' | 'warehouse' | 'retail' | 'factory' | 'remote';
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  manager: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  image?: string;
  lastUpdated: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export interface WorkLocationsPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  userRole?: 'admin' | 'employee' | 'client';
  locations?: Location[];
  onNavigate?: (route: string) => void;
  onCreateLocation?: () => void;
  onEditLocation?: (locationId: string) => void;
  onDeleteLocation?: (locationId: string) => void;
  onSelectLocation?: (locationId: string) => void;
  className?: string;
}

const WorkLocationsPage: React.FC<WorkLocationsPageProps> = ({
  user,
  userRole = 'client',
  locations: propLocations,
  onNavigate,
  onCreateLocation,
  onEditLocation,
  onDeleteLocation,
  onSelectLocation,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock locations data
  const defaultLocations: Location[] = [
    {
      id: 'loc-001',
      name: 'Oficina Central Madrid',
      address: 'Calle Gran Vía, 123, 28013 Madrid, España',
      type: 'office',
      status: 'active',
      capacity: 150,
      currentOccupancy: 120,
      facilities: ['WiFi', 'Estacionamiento', 'Cafetería', 'Sala de Conferencias', 'Gimnasio'],
      manager: {
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        phone: '+34 91 123 4567',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-15T10:30:00Z',
      workingHours: {
        start: '09:00',
        end: '18:00',
        timezone: 'Europe/Madrid'
      }
    },
    {
      id: 'loc-002',
      name: 'Centro de Distribución Barcelona',
      address: 'Polígono Industrial Les Planes, 08172 Sant Cugat del Vallès, Barcelona',
      type: 'warehouse',
      status: 'active',
      capacity: 50,
      currentOccupancy: 35,
      facilities: ['Carga/Descarga', 'Refrigeración', 'Sistema de Seguridad', 'Oficinas'],
      manager: {
        name: 'Carlos Méndez',
        email: 'carlos.mendez@empresa.com',
        phone: '+34 93 876 5432',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-14T15:45:00Z',
      workingHours: {
        start: '07:00',
        end: '19:00',
        timezone: 'Europe/Madrid'
      }
    },
    {
      id: 'loc-003',
      name: 'Tienda Valencia Centro',
      address: 'Plaza del Ayuntamiento, 15, 46002 Valencia, España',
      type: 'retail',
      status: 'maintenance',
      capacity: 25,
      currentOccupancy: 0,
      facilities: ['Punto de Venta', 'Almacén', 'Sala de Atención al Cliente'],
      manager: {
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        phone: '+34 96 345 6789',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-13T08:20:00Z',
      workingHours: {
        start: '10:00',
        end: '22:00',
        timezone: 'Europe/Madrid'
      }
    },
    {
      id: 'loc-004',
      name: 'Planta de Producción Sevilla',
      address: 'Parque Industrial PISA, Calle Tecnología, 41940 Tomares, Sevilla',
      type: 'factory',
      status: 'active',
      capacity: 80,
      currentOccupancy: 72,
      facilities: ['Líneas de Producción', 'Laboratorio', 'Vestuarios', 'Comedor', 'Enfermería'],
      manager: {
        name: 'Roberto Silva',
        email: 'roberto.silva@empresa.com',
        phone: '+34 95 567 8901',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-15T12:15:00Z',
      workingHours: {
        start: '06:00',
        end: '14:00',
        timezone: 'Europe/Madrid'
      }
    },
    {
      id: 'loc-005',
      name: 'Oficina Remota Canarias',
      address: 'Trabajo remoto distribuido - Las Palmas de Gran Canaria',
      type: 'remote',
      status: 'active',
      capacity: 20,
      currentOccupancy: 15,
      facilities: ['Hub Digital', 'Coworking', 'Videoconferencias', 'Soporte Técnico'],
      manager: {
        name: 'Laura Pérez',
        email: 'laura.perez@empresa.com',
        phone: '+34 92 234 5678',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-15T09:00:00Z',
      workingHours: {
        start: '08:00',
        end: '17:00',
        timezone: 'Atlantic/Canary'
      }
    },
    {
      id: 'loc-006',
      name: 'Centro Logístico Bilbao',
      address: 'Polígono de Asua, 48930 Las Arenas, Vizcaya',
      type: 'warehouse',
      status: 'inactive',
      capacity: 40,
      currentOccupancy: 0,
      facilities: ['Muelles de Carga', 'Cámaras Frigoríficas', 'Zona de Picking'],
      manager: {
        name: 'Miguel Torres',
        email: 'miguel.torres@empresa.com',
        phone: '+34 94 123 4567',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=200&fit=crop',
      lastUpdated: '2024-06-10T14:30:00Z',
      workingHours: {
        start: '08:00',
        end: '16:00',
        timezone: 'Europe/Madrid'
      }
    }
  ];

  const locations = propLocations || defaultLocations;

  // Filter locations based on search and filters
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    const matchesStatus = filterStatus === 'all' || location.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Get type display name and icon
  const getTypeInfo = (type: Location['type']) => {
    const typeMap = {
      office: { label: 'Oficina', icon: 'Building2', color: 'primary' },
      warehouse: { label: 'Almacén', icon: 'Warehouse', color: 'secondary' },
      retail: { label: 'Tienda', icon: 'ShoppingBag', color: 'success' },
      factory: { label: 'Fábrica', icon: 'Factory', color: 'warning' },
      remote: { label: 'Remoto', icon: 'Wifi', color: 'neutral' }
    };
    return typeMap[type] || { label: type, icon: 'MapPin', color: 'neutral' };
  };

  // Get status display info
  const getStatusInfo = (status: Location['status']) => {
    const statusMap = {
      active: { label: 'Activo', variant: 'success' },
      inactive: { label: 'Inactivo', variant: 'neutral' },
      maintenance: { label: 'Mantenimiento', variant: 'warning' }
    };
    return statusMap[status] || { label: status, variant: 'neutral' };
  };

  // Calculate occupancy percentage
  const getOccupancyPercentage = (current: number, capacity: number) => {
    return capacity > 0 ? Math.round((current / capacity) * 100) : 0;
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    if (onSelectLocation) {
      onSelectLocation(location.id);
    } else {
      // Default behavior - navigate to location detail
      onNavigate?.(`/app/locations/${location.id}`);
    }
  };

  // Handle new location
  const handleNewLocation = () => {
    if (onCreateLocation) {
      onCreateLocation();
    } else {
      onNavigate?.('/app/locations/new');
    }
  };

  return (
    <MainLayout
      user={user}
      currentRoute="locations"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" weight="bold" className="mb-2">
              Ubicaciones de Trabajo
            </Typography>
            <Typography variant="p" color="muted">
              Gestiona y selecciona las ubicaciones disponibles para solicitudes de servicio
            </Typography>
          </div>

          {(userRole === 'admin' || userRole === 'employee') && (
            <Button
              variant="primary"
              icon="Plus"
              iconPosition="left"
              onClick={handleNewLocation}
            >
              Nueva Ubicación
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon 
                name="Search" 
                size="sm" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Buscar ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-sm min-w-[120px]"
            >
              <option value="all">Todos los tipos</option>
              <option value="office">Oficinas</option>
              <option value="warehouse">Almacenes</option>
              <option value="retail">Tiendas</option>
              <option value="factory">Fábricas</option>
              <option value="remote">Remoto</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-sm min-w-[120px]"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <Typography variant="p" size="sm" color="muted">
            {filteredLocations.length} ubicaciones encontradas
          </Typography>
          
          {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Locations Grid */}
        <div className="space-y-4">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => {
              const typeInfo = getTypeInfo(location.type);
              const statusInfo = getStatusInfo(location.status);
              const occupancyPercentage = getOccupancyPercentage(location.currentOccupancy, location.capacity);

              return (
                <div
                  key={location.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Location Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-16 bg-accent rounded-lg overflow-hidden">
                        {location.image ? (
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name={typeInfo.icon as any} size="lg" color="muted" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Typography variant="h4" weight="medium" className="mb-1">
                            {location.name}
                          </Typography>
                          <Typography variant="p" size="sm" color="muted" className="line-clamp-1">
                            {location.address}
                          </Typography>
                        </div>
                        
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge 
                            variant={typeInfo.color as any}
                            size="sm"
                          >
                            {typeInfo.label}
                          </Badge>
                          <Badge 
                            variant={statusInfo.variant as any}
                            size="sm"
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {/* Capacity */}
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size="sm" color="muted" />
                          <div>
                            <Typography variant="p" size="sm" weight="medium">
                              {location.currentOccupancy}/{location.capacity}
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              Ocupación ({occupancyPercentage}%)
                            </Typography>
                          </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size="sm" color="muted" />
                          <div>
                            <Typography variant="p" size="sm" weight="medium">
                              {location.workingHours.start} - {location.workingHours.end}
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              Horario
                            </Typography>
                          </div>
                        </div>

                        {/* Manager */}
                        <div className="flex items-center space-x-2">
                          <Icon name="UserCheck" size="sm" color="muted" />
                          <div>
                            <Typography variant="p" size="sm" weight="medium">
                              {location.manager.name}
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              Responsable
                            </Typography>
                          </div>
                        </div>

                        {/* Facilities Count */}
                        <div className="flex items-center space-x-2">
                          <Icon name="Settings" size="sm" color="muted" />
                          <div>
                            <Typography variant="p" size="sm" weight="medium">
                              {location.facilities.length} servicios
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              Instalaciones
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-wrap gap-1">
                        {location.facilities.slice(0, 4).map((facility, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/50 text-foreground"
                          >
                            {facility}
                          </span>
                        ))}
                        {location.facilities.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/50 text-muted-foreground">
                            +{location.facilities.length - 4} más
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {(userRole === 'admin' || userRole === 'employee') && (
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditLocation?.(location.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLocation?.(location.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Icon name="MapPin" size="lg" className="mx-auto mb-4 text-muted-foreground" />
              <Typography variant="h4" weight="medium" className="mb-2">
                No se encontraron ubicaciones
              </Typography>
              <Typography variant="p" color="muted" className="mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Prueba ajustando los filtros de búsqueda.'
                  : 'Aún no hay ubicaciones registradas en el sistema.'
                }
              </Typography>
              
              {(userRole === 'admin' || userRole === 'employee') && (
                <Button variant="primary" onClick={handleNewLocation}>
                  Crear Primera Ubicación
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WorkLocationsPage;