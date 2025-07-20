import React from 'react';
import Typography from '../../atoms/Typography';
import DashboardSummary from '../../organisms/DashboardSummary';

const DashboardSummaryDemo: React.FC = () => {
  const mockMetrics = [
    {
      id: 'requests',
      title: 'Solicitudes Activas',
      value: 24,
      change: { value: 12, type: 'increase' as const, period: 'último mes' },
      icon: 'FileText',
      color: 'primary' as const,
      description: 'Solicitudes pendientes de procesamiento'
    },
    {
      id: 'services',
      title: 'Servicios Disponibles',
      value: 8,
      change: { value: 2, type: 'increase' as const, period: 'última semana' },
      icon: 'Settings',
      color: 'secondary' as const,
      description: 'Servicios activos en el catálogo'
    },
    {
      id: 'users',
      title: 'Usuarios Activos',
      value: 156,
      change: { value: 8, type: 'increase' as const, period: 'último mes' },
      icon: 'Users',
      color: 'success' as const,
      description: 'Usuarios con sesión activa'
    }
  ];

  return (
    <div className="space-y-8">
      <Typography variant="h4">Resumen del dashboard:</Typography>
      <DashboardSummary
        metrics={mockMetrics}
        onMetricClick={(id) => console.log('Métrica clickeada:', id)}
      />
    </div>
  );
};

export default DashboardSummaryDemo;