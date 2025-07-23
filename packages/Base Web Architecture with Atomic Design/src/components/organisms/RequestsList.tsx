import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import RequestCard from '../molecules/RequestCard';
import ToggleSwitch from '../molecules/ToggleSwitch';
import IconButton from '../molecules/IconButton';

export interface Request {
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

export interface RequestsListProps {
  requests: Request[];
  showCompleted?: boolean;
  onRequestClick?: (requestId: string) => void;
  onNewRequest?: () => void;
  onFilterChange?: (filters: { showCompleted: boolean; status?: string; priority?: string }) => void;
  className?: string;
}

const RequestsList: React.FC<RequestsListProps> = ({
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
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');

  const handleCompletedToggle = (checked: boolean) => {
    setViewCompleted(checked);
    if (onFilterChange) {
      onFilterChange({
        showCompleted: checked,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined
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
  const filteredRequests = requests.filter(request => {
    if (!viewCompleted && (request.status === 'approved' || request.status === 'rejected')) {
      return false;
    }
    if (selectedStatus !== 'all' && request.status !== selectedStatus) {
      return false;
    }
    if (selectedPriority !== 'all' && request.priority !== selectedPriority) {
      return false;
    }
    return true;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusCount = (status: string) => {
    if (status === 'all') return requests.length;
    return requests.filter(r => r.status === status).length;
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2" weight="medium" className="mb-2">
            Lista de Solicitudes
          </Typography>
          <Typography variant="p" color="muted">
            Gestiona todas las solicitudes de servicio
          </Typography>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          iconPosition="left"
          onClick={handleNewRequest}
        >
          Nueva Solicitud
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          {/* Toggle for completed */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <ToggleSwitch
              id="view-completed"
              label="Ver completadas"
              description="Incluir solicitudes aprobadas y rechazadas"
              checked={viewCompleted}
              onChange={handleCompletedToggle}
              size="md"
              className="touch-manipulation"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-4">
            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Typography variant="p" size="sm" weight="medium" className="whitespace-nowrap">
                Estado:
              </Typography>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 md:py-1 border border-border rounded-md bg-input-background text-foreground text-sm min-h-11 md:min-h-auto touch-manipulation"
              >
                <option value="all">Todos ({getStatusCount('all')})</option>
                <option value="pending">Pendientes ({getStatusCount('pending')})</option>
                <option value="in-progress">En Progreso ({getStatusCount('in-progress')})</option>
                <option value="approved">Aprobadas ({getStatusCount('approved')})</option>
                <option value="rejected">Rechazadas ({getStatusCount('rejected')})</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Typography variant="p" size="sm" weight="medium" className="whitespace-nowrap">
                Prioridad:
              </Typography>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 md:py-1 border border-border rounded-md bg-input-background text-foreground text-sm min-h-11 md:min-h-auto touch-manipulation"
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Typography variant="p" size="sm" weight="medium" className="whitespace-nowrap">
                Ordenar:
              </Typography>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'status')}
                className="px-3 py-2 md:py-1 border border-border rounded-md bg-input-background text-foreground text-sm min-h-11 md:min-h-auto touch-manipulation"
              >
                <option value="date">Por fecha</option>
                <option value="priority">Por prioridad</option>
                <option value="status">Por estado</option>
              </select>
            </div>

            {/* View Options - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1 border-l border-border pl-4">
              <IconButton
                icon="LayoutGrid"
                iconOnly
                variant="ghost"
                size="sm"
                tooltip="Vista de rejilla"
              />
              <IconButton
                icon="List"
                iconOnly
                variant="outline"
                size="sm"
                tooltip="Vista de lista"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <Typography variant="p" size="sm" color="muted">
          Mostrando {sortedRequests.length} de {requests.length} solicitudes
        </Typography>
        
        {sortedRequests.length > 0 && (
          <div className="flex items-center space-x-2">
            <IconButton
              icon="Download"
              iconOnly
              variant="outline"
              size="sm"
              tooltip="Exportar lista"
            />
            <IconButton
              icon="RefreshCw"
              iconOnly
              variant="ghost"
              size="sm"
              tooltip="Actualizar"
            />
          </div>
        )}
      </div>

      {/* Requests Grid */}
      {sortedRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {sortedRequests.map((request) => (
            <RequestCard
              key={request.id}
              {...request}
              onClick={() => handleRequestClick(request.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FileX" size="lg" color="muted" />
            </div>
            <Typography variant="h3" weight="medium" className="mb-2">
              No hay solicitudes
            </Typography>
            <Typography variant="p" color="muted" className="mb-6">
              No se encontraron solicitudes que coincidan con los filtros seleccionados.
            </Typography>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStatus('all');
                setSelectedPriority('all');
                setViewCompleted(true);
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;