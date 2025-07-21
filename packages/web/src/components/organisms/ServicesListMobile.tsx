import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import FormFieldMobile from '../molecules/FormFieldMobile';
import IconButtonMobile from '../molecules/IconButtonMobile';
import Card from '../molecules/Card';

export interface ServiceMobile {
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

export interface ServicesListMobileProps {
  services: ServiceMobile[];
  onServiceClick?: (serviceId: string) => void;
  onCreateService?: () => void;
  variant?: 'gallery' | 'detailed';
  showFilters?: boolean;
  showHeader?: boolean;
  className?: string;
}

const ServicesListMobile: React.FC<ServicesListMobileProps> = ({
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Obtener categorías únicas
  const categories = [
    'all',
    ...Array.from(new Set(services.map((service) => service.category))),
  ];

  // Filtrar servicios
  const filteredServices = services.filter((service) => {
    const statusMatch = filter === 'all' || service.status === filter;
    const categoryMatch =
      categoryFilter === 'all' || service.category === categoryFilter;
    const searchMatch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  // Contar servicios por estado
  const statusCounts = {
    all: services.length,
    active: services.filter((s) => s.status === 'active').length,
    inactive: services.filter((s) => s.status === 'inactive').length,
    maintenance: services.filter((s) => s.status === 'maintenance').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'Activo' };
      case 'inactive':
        return { variant: 'neutral', label: 'Inactivo' };
      case 'maintenance':
        return { variant: 'warning', label: 'Mantenimiento' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'all':
        return 'Todos';
      case 'active':
        return 'Activos';
      case 'inactive':
        return 'Inactivos';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  const formatPrice = (price: {
    amount: number;
    currency: string;
    period?: string;
  }) => {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: price.currency,
    });
    return `${formatter.format(price.amount)}${price.period ? `/${price.period}` : ''}`;
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Header */}
      {showHeader && (
        <div className="text-center space-y-3">
          <Typography variant="h2" weight="medium">
            {variant === 'gallery' ? 'Servicios' : 'Catálogo'}
          </Typography>
          <Typography variant="p" size="sm" color="muted">
            {filteredServices.length} de {services.length} servicios disponibles
          </Typography>

          {onCreateService && (
            <Button
              variant="primary"
              size="lg"
              icon="Plus"
              onClick={onCreateService}
              className="w-full touch-manipulation"
            >
              Nuevo Servicio
            </Button>
          )}
        </div>
      )}

      {/* Search */}
      <FormFieldMobile
        label=""
        placeholder="Buscar servicios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter Toggle */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Typography variant="p" size="sm" color="muted">
              Filtros activos:
            </Typography>
            {filter !== 'all' && (
              <Badge variant="primary" size="sm">
                {getStatusLabel(filter)}
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" size="sm">
                {categoryFilter}
              </Badge>
            )}
          </div>

          <IconButtonMobile
            icon={showFiltersPanel ? 'ChevronUp' : 'ChevronDown'}
            label="Filtros"
            showLabel={true}
            variant="outline"
            size="sm"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          />
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            {/* Estado Filter */}
            <div>
              <Typography
                variant="p"
                size="sm"
                weight="medium"
                className="mb-2"
              >
                Estado
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-colors text-left
                      ${
                        filter === status
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:bg-muted'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">
                      {getStatusLabel(status)}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías Filter */}
            {categories.length > 2 && (
              <div>
                <Typography
                  variant="p"
                  size="sm"
                  weight="medium"
                  className="mb-2"
                >
                  Categoría
                </Typography>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
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

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="w-full"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Services List */}
      {filteredServices.length > 0 ? (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              variant="vertical"
              title=""
              onClick={() => onServiceClick?.(service.id)}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-4 space-y-3">
                {/* Service Image */}
                <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Service Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="p"
                      size="sm"
                      weight="medium"
                      className="mb-1"
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="p"
                      size="xs"
                      color="muted"
                      className="mb-2"
                    >
                      {service.category}
                    </Typography>
                  </div>
                  <Badge
                    variant={getStatusBadge(service.status).variant as any}
                    size="sm"
                  >
                    {getStatusBadge(service.status).label}
                  </Badge>
                </div>

                {/* Service Description */}
                <Typography
                  variant="p"
                  size="sm"
                  color="muted"
                  className="line-clamp-3"
                >
                  {service.description}
                </Typography>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2">
                    <Typography variant="p" size="xs" weight="medium">
                      Características principales:
                    </Typography>
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          +{service.features.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {service.price ? (
                    <Typography
                      variant="p"
                      size="sm"
                      weight="bold"
                      className="text-primary"
                    >
                      {formatPrice(service.price)}
                    </Typography>
                  ) : (
                    <Typography variant="p" size="sm" color="muted">
                      Consultar precio
                    </Typography>
                  )}

                  {service.rating && (
                    <div className="flex items-center space-x-1">
                      <Icon
                        name="Star"
                        size="xs"
                        className="text-warning fill-current"
                      />
                      <Typography variant="p" size="xs">
                        {service.rating.value.toFixed(1)}
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        ({service.rating.total})
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size="lg" color="muted" />
          </div>
          <Typography variant="h3" weight="medium" className="mb-2">
            No se encontraron servicios
          </Typography>
          <Typography variant="p" color="muted" className="mb-4">
            No hay servicios que coincidan con tu búsqueda
          </Typography>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
            >
              Limpiar filtros
            </Button>
            {onCreateService && (
              <Button variant="primary" onClick={onCreateService}>
                Crear primer servicio
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {filteredServices.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <Typography
            variant="p"
            size="sm"
            weight="medium"
            className="mb-3 text-center"
          >
            Resumen por estado
          </Typography>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <Typography variant="p" size="xs" color="muted">
                  Activos
                </Typography>
              </div>
              <Typography variant="p" size="sm" weight="medium">
                {statusCounts.active}
              </Typography>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <Typography variant="p" size="xs" color="muted">
                  Mantenimiento
                </Typography>
              </div>
              <Typography variant="p" size="sm" weight="medium">
                {statusCounts.maintenance}
              </Typography>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                <Typography variant="p" size="xs" color="muted">
                  Inactivos
                </Typography>
              </div>
              <Typography variant="p" size="sm" weight="medium">
                {statusCounts.inactive}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesListMobile;
