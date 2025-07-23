import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import ServiceCard from '../molecules/ServiceCard';
import IconButton from '../molecules/IconButton';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  image: { src: string; alt: string };
  status: 'active' | 'inactive' | 'maintenance';
  features?: string[];
  price?: { amount: number; currency: string; period?: string };
  rating?: { value: number; total: number };
}

export interface ServicesListProps {
  services: Service[];
  onServiceClick?: (serviceId: string) => void;
  onCreateService?: () => void;
  variant?: 'gallery' | 'detailed';
  showFilters?: boolean;
  showHeader?: boolean;
  className?: string;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onServiceClick,
  onCreateService,
  variant = 'gallery',
  showFilters = true,
  showHeader = true,
  className = '',
  ...props
}) => {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(variant === 'gallery' ? 'grid' : 'list');

  // Obtener categorías únicas
  const categories = ['all', ...Array.from(new Set(services.map(service => service.category)))];

  // Filtrar servicios
  const filteredServices = services.filter(service => {
    const statusMatch = filter === 'all' || service.status === filter;
    const categoryMatch = categoryFilter === 'all' || service.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Contar servicios por estado
  const statusCounts = {
    all: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    maintenance: services.filter(s => s.status === 'maintenance').length
  };

  const getGridColumns = () => {
    if (variant === 'gallery') {
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
    }
    return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Typography variant="h2" weight="medium">
              {variant === 'gallery' ? 'Galería de Servicios' : 'Catálogo de Servicios'}
            </Typography>
            <Typography variant="p" size="sm" color="muted" className="mt-1">
              {filteredServices.length} de {services.length} servicios
            </Typography>
          </div>
          
          <div className="flex items-center space-x-2">
            {variant !== 'gallery' && (
              <>
                <IconButton
                  icon="Grid3X3"
                  iconOnly
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  tooltip="Vista en grid"
                  onClick={() => setViewMode('grid')}
                />
                <IconButton
                  icon="List"
                  iconOnly
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  tooltip="Vista en lista"
                  onClick={() => setViewMode('list')}
                />
              </>
            )}
            
            {onCreateService && (
              <Button
                variant="primary"
                icon="Plus"
                onClick={onCreateService}
                size="sm"
              >
                Nuevo Servicio
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Estado Filter */}
          <div className="flex items-center space-x-2">
            <Typography variant="p" size="sm" weight="medium" color="muted">
              Estado:
            </Typography>
            <div className="flex items-center space-x-1">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  variant={filter === status ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="h-8"
                >
                  <span className="capitalize">
                    {status === 'all' ? 'Todos' : 
                     status === 'active' ? 'Activos' : 
                     status === 'inactive' ? 'Inactivos' : 'Mantenimiento'}
                  </span>
                  <Badge variant="neutral" size="sm" className="ml-2">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Categorías Filter */}
          {categories.length > 2 && (
            <div className="flex items-center space-x-2">
              <Typography variant="p" size="sm" weight="medium" color="muted">
                Categoría:
              </Typography>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-border rounded-md bg-input-background focus:outline-none focus:ring-2 focus:ring-design-primary/20 focus:border-design-primary"
              >
                <option value="all">Todas las categorías</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Services Grid/List */}
      {filteredServices.length > 0 ? (
        <div className={`grid gap-4 ${getGridColumns()}`}>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              variant={variant === 'gallery' ? 'simple' : 'full'}
              onClick={onServiceClick}
              className={viewMode === 'list' && variant !== 'gallery' ? 'flex-row' : ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 rounded-full flex items-center justify-center">
            <Icon name="Search" size="lg" color="muted" />
          </div>
          <Typography variant="h3" weight="medium" className="mb-2">
            No se encontraron servicios
          </Typography>
          <Typography variant="p" color="muted" className="mb-4">
            No hay servicios que coincidan con los filtros seleccionados
          </Typography>
          <div className="flex items-center justify-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setFilter('all');
                setCategoryFilter('all');
              }}
            >
              Limpiar filtros
            </Button>
            {onCreateService && (
              <Button variant="primary" size="sm" onClick={onCreateService}>
                Crear primer servicio
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer para vista galería */}
      {variant === 'gallery' && filteredServices.length > 0 && (
        <div className="flex items-center justify-center pt-4 border-t border-border">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>{statusCounts.active} Activos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>{statusCounts.maintenance} Mantenimiento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
              <span>{statusCounts.inactive} Inactivos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;