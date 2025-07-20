import React from 'react';
import Typography from '../components/atoms/Typography';
import Card from '../components/molecules/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import { Button } from '../components/ui/button';

const statsData = [
  {
    title: 'Solicitudes Pendientes',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: 'FileText',
    color: 'warning'
  },
  {
    title: 'Solicitudes Completadas',
    value: '156',
    change: '+8%',
    changeType: 'positive', 
    icon: 'CheckCircle',
    color: 'success'
  },
  {
    title: 'Usuarios Activos',
    value: '89',
    change: '+3%',
    changeType: 'positive',
    icon: 'Users',
    color: 'primary'
  },
  {
    title: 'Servicios Disponibles',
    value: '12',
    change: '0%',
    changeType: 'neutral',
    icon: 'Briefcase',
    color: 'secondary'
  }
];

const recentRequests = [
  {
    id: '001',
    service: 'Limpieza de Oficina',
    location: 'Edificio A - Piso 3',
    status: 'pending',
    requestedBy: 'María González',
    date: '2025-06-28'
  },
  {
    id: '002', 
    service: 'Mantenimiento IT',
    location: 'Sala de Servidores',
    status: 'in-progress',
    requestedBy: 'Carlos Ruiz',
    date: '2025-06-27'
  },
  {
    id: '003',
    service: 'Catering Evento',
    location: 'Sala de Conferencias B',
    status: 'completed',
    requestedBy: 'Ana López',
    date: '2025-06-26'
  }
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">Dashboard</Typography>
          <Typography variant="p" color="muted">
            Resumen de actividad y estado del sistema
          </Typography>
        </div>
        <Button className="bg-design-primary text-neutral-900 hover:bg-design-primary/90">
          <Icon name="Plus" size="sm" className="mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} variant="elevated" padding="md">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Typography variant="p" size="sm" color="muted">
                  {stat.title}
                </Typography>
                <Typography variant="h2" weight="bold">
                  {stat.value}
                </Typography>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-success' : 
                    stat.changeType === 'negative' ? 'text-error' : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </span>
                  <Typography variant="p" size="sm" color="muted">
                    vs mes anterior
                  </Typography>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.color === 'primary' ? 'bg-design-primary/10' :
                stat.color === 'secondary' ? 'bg-design-secondary/10' :
                stat.color === 'success' ? 'bg-success/10' :
                stat.color === 'warning' ? 'bg-warning/10' :
                'bg-neutral-200'
              }`}>
                <Icon 
                  name={stat.icon as any} 
                  size="lg" 
                  color={stat.color as any}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <Card variant="default" padding="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3">Solicitudes Recientes</Typography>
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-design-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size="sm" color="primary" />
                  </div>
                  <div>
                    <Typography variant="p" weight="medium">
                      {request.service}
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      {request.location} • Solicitado por {request.requestedBy}
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Typography variant="p" size="sm" color="muted">
                    {request.date}
                  </Typography>
                  <Badge 
                    variant={
                      request.status === 'completed' ? 'success' :
                      request.status === 'in-progress' ? 'warning' :
                      'neutral'
                    }
                    size="sm"
                  >
                    {request.status === 'completed' ? 'Completada' :
                     request.status === 'in-progress' ? 'En Progreso' :
                     'Pendiente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;