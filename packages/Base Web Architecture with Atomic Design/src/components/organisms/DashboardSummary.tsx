import React from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Card from '../molecules/Card';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description?: string;
}

export interface DashboardSummaryProps {
  metrics: DashboardMetric[];
  onMetricClick?: (metricId: string) => void;
  className?: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  metrics,
  onMetricClick,
  className = '',
  ...props
}) => {
  const handleMetricClick = (metricId: string) => {
    if (onMetricClick) {
      onMetricClick(metricId);
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'TrendingUp';
      case 'decrease':
        return 'TrendingDown';
      case 'neutral':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'success';
      case 'decrease':
        return 'error';
      case 'neutral':
        return 'muted';
      default:
        return 'muted';
    }
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      <div>
        <Typography variant="h2" weight="medium" className="mb-2">
          Resumen del Dashboard
        </Typography>
        <Typography variant="p" color="muted">
          Métricas principales de tu sistema de gestión
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            variant="vertical"
            title=""
            onClick={() => handleMetricClick(metric.id)}
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="p-6 space-y-4">
              {/* Icon and Title */}
              <div className="flex items-center justify-between">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${metric.color === 'primary' ? 'bg-design-primary/10' : ''}
                  ${metric.color === 'secondary' ? 'bg-design-secondary/10' : ''}
                  ${metric.color === 'success' ? 'bg-success/10' : ''}
                  ${metric.color === 'warning' ? 'bg-warning/10' : ''}
                  ${metric.color === 'error' ? 'bg-error/10' : ''}
                `}>
                  <Icon 
                    name={metric.icon as any} 
                    size="lg" 
                    color={metric.color}
                  />
                </div>
                
                {metric.change && (
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded-md text-xs
                    ${metric.change.type === 'increase' ? 'bg-success/10 text-success' : ''}
                    ${metric.change.type === 'decrease' ? 'bg-error/10 text-error' : ''}
                    ${metric.change.type === 'neutral' ? 'bg-neutral-200 text-muted-foreground' : ''}
                  `}>
                    <Icon 
                      name={getChangeIcon(metric.change.type) as any} 
                      size="xs" 
                      color={getChangeColor(metric.change.type) as any}
                    />
                    <span>{Math.abs(metric.change.value)}%</span>
                  </div>
                )}
              </div>

              {/* Value */}
              <div>
                <Typography variant="h1" weight="bold" className="mb-1">
                  {metric.value}
                </Typography>
                <Typography variant="p" size="sm" weight="medium" color="inherit">
                  {metric.title}
                </Typography>
              </div>

              {/* Description and Change */}
              <div className="space-y-2">
                {metric.description && (
                  <Typography variant="p" size="xs" color="muted">
                    {metric.description}
                  </Typography>
                )}
                
                {metric.change && (
                  <Typography variant="p" size="xs" color="muted">
                    {metric.change.type === 'increase' ? '+' : metric.change.type === 'decrease' ? '-' : ''}
                    {metric.change.value}% vs {metric.change.period}
                  </Typography>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <Typography variant="h3" weight="medium" className="mb-4">
          Acciones Rápidas
        </Typography>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Card
            variant="horizontal"
            title="Nueva Solicitud"
            subtitle="Crear solicitud de servicio"
            icon={{
              name: "Plus",
              color: "primary"
            }}
            onClick={() => handleMetricClick('new-request')}
            className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
          />
          
          <Card
            variant="horizontal"
            title="Gestionar Servicios"
            subtitle="Administrar catálogo"
            icon={{
              name: "Settings",
              color: "secondary"
            }}
            onClick={() => handleMetricClick('manage-services')}
            className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
          />
          
          <Card
            variant="horizontal"
            title="Ver Reportes"
            subtitle="Análisis detallados"
            icon={{
              name: "BarChart3",
              color: "success"
            }}
            onClick={() => handleMetricClick('view-reports')}
            className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;