import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import FormFieldMobile from '../molecules/FormFieldMobile';
import IconButtonMobile from '../molecules/IconButtonMobile';
import Card from '../molecules/Card';

export interface RequestMobile {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  requestType: string;
  requestDate: string;
  priority: 'low' | 'medium' | 'high';
  image?: {
    src: string;
    alt: string;
  };
}

export interface RequestsListMobileProps {
  requests: RequestMobile[];
  showCompleted?: boolean;
  onRequestClick?: (requestId: string) => void;
  onNewRequest?: () => void;
  onFilterChange?: (filters: {
    showCompleted: boolean;
    status?: string;
    priority?: string;
  }) => void;
  className?: string;
}

const RequestsListMobile: React.FC<RequestsListMobileProps> = ({
  requests,
  showCompleted = false,
  onRequestClick,
  onNewRequest,
  onFilterChange,
  className = '',
  ...props
}) => {
  const [viewCompleted, setViewCompleted] = useState(showCompleted);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleCompletedToggle = (checked: boolean) => {
    setViewCompleted(checked);
    if (onFilterChange) {
      onFilterChange({
        showCompleted: checked,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
      });
    }
  };

  const handleRequestClick = (requestId: string) => {
    if (onRequestClick) {
      onRequestClick(requestId);
    }
  };

  const handleNewRequest = () => {
    if (onNewRequest) {
      onNewRequest();
    }
  };

  // Filter requests based on current settings
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (
      !viewCompleted &&
      (request.status === 'approved' || request.status === 'rejected')
    ) {
      return false;
    }
    if (selectedStatus !== 'all' && request.status !== selectedStatus) {
      return false;
    }
    if (selectedPriority !== 'all' && request.priority !== selectedPriority) {
      return false;
    }
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { variant: 'warning', label: 'Pendiente' };
      case 'approved':
        return { variant: 'success', label: 'Aprobada' };
      case 'rejected':
        return { variant: 'error', label: 'Rechazada' };
      case 'in-progress':
        return { variant: 'primary', label: 'En Progreso' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return requests.length;
    return requests.filter((r) => r.status === status).length;
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Header */}
      <div className="text-center space-y-3">
        <Typography variant="h2" weight="medium">
          Solicitudes
        </Typography>
        <Typography variant="p" color="muted" size="sm">
          Gestiona tus solicitudes de servicio
        </Typography>

        <Button
          variant="primary"
          size="lg"
          icon="Plus"
          onClick={handleNewRequest}
          className="w-full touch-manipulation"
        >
          Nueva Solicitud
        </Button>
      </div>

      {/* Search */}
      <FormFieldMobile
        label=""
        placeholder="Buscar solicitudes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Toggle Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="view-completed"
            checked={viewCompleted}
            onChange={(e) => handleCompletedToggle(e.target.checked)}
            className="h-5 w-5 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="view-completed" className="text-sm">
            Ver completadas
          </label>
        </div>

        <IconButtonMobile
          icon={showFilters ? 'ChevronUp' : 'ChevronDown'}
          label="Filtros"
          showLabel={true}
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            {/* Status Filter */}
            <div>
              <Typography
                variant="p"
                size="sm"
                weight="medium"
                className="mb-2"
              >
                Estado
              </Typography>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
              >
                <option value="all">Todos ({getStatusCount('all')})</option>
                <option value="pending">
                  Pendientes ({getStatusCount('pending')})
                </option>
                <option value="in-progress">
                  En Progreso ({getStatusCount('in-progress')})
                </option>
                <option value="approved">
                  Aprobadas ({getStatusCount('approved')})
                </option>
                <option value="rejected">
                  Rechazadas ({getStatusCount('rejected')})
                </option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <Typography
                variant="p"
                size="sm"
                weight="medium"
                className="mb-2"
              >
                Prioridad
              </Typography>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStatus('all');
              setSelectedPriority('all');
              setViewCompleted(true);
              setSearchQuery('');
            }}
            className="w-full"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center">
        <Typography variant="p" size="sm" color="muted">
          {filteredRequests.length} de {requests.length} solicitudes
        </Typography>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              variant="vertical"
              title=""
              onClick={() => handleRequestClick(request.id)}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-4 space-y-3">
                {/* Header with Status and Priority */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="p"
                      size="sm"
                      weight="medium"
                      className="mb-1"
                    >
                      {request.title}
                    </Typography>
                    <Typography
                      variant="p"
                      size="sm"
                      color="muted"
                      className="line-clamp-2"
                    >
                      {request.description}
                    </Typography>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <Badge
                      variant={getStatusBadge(request.status).variant as any}
                      size="sm"
                    >
                      {getStatusBadge(request.status).label}
                    </Badge>
                  </div>
                </div>

                {/* Image */}
                {request.image && (
                  <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                    <img
                      src={request.image.src}
                      alt={request.image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Footer with Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size="xs" color="muted" />
                      <Typography variant="p" size="xs" color="muted">
                        {new Date(request.requestDate).toLocaleDateString(
                          'es-ES',
                        )}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size="xs" color="muted" />
                      <Typography variant="p" size="xs" color="muted">
                        {request.requestType}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Icon
                      name={
                        request.priority === 'high'
                          ? 'AlertTriangle'
                          : request.priority === 'medium'
                            ? 'AlertCircle'
                            : 'Circle'
                      }
                      size="xs"
                      className={getPriorityColor(request.priority)}
                    />
                    <Typography
                      variant="p"
                      size="xs"
                      className={getPriorityColor(request.priority)}
                    >
                      {getPriorityLabel(request.priority)}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileX" size="lg" color="muted" />
          </div>
          <Typography variant="h3" weight="medium" className="mb-2">
            No hay solicitudes
          </Typography>
          <Typography variant="p" color="muted" className="mb-4">
            No se encontraron solicitudes que coincidan con los filtros
          </Typography>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStatus('all');
              setSelectedPriority('all');
              setViewCompleted(true);
              setSearchQuery('');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestsListMobile;
