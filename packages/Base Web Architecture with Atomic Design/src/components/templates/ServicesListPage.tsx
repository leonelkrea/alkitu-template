import React from 'react';
import Typography from '../atoms/Typography';
import MainLayout from './MainLayout';
import ServicesList from '../organisms/ServicesList';

export interface ServicesListPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  onNavigate?: (route: string) => void;
  className?: string;
}

const ServicesListPage: React.FC<ServicesListPageProps> = ({
  user,
  onNavigate,
  className = '',
  ...props
}) => {
  const mockServices = [
    {
      id: 'svc-001',
      title: 'Mantenimiento HVAC',
      description: 'Servicio completo de mantenimiento para sistemas de climatización.',
      category: 'Mantenimiento',
      status: 'active' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop',
        alt: 'HVAC'
      },
      price: { amount: 150, currency: '€', period: 'servicio' },
      rating: { value: 4.8, total: 124 },
      features: ['Diagnóstico completo', 'Limpieza de filtros', 'Revisión de compresores']
    },
    {
      id: 'svc-002',
      title: 'Soporte IT',
      description: 'Asistencia técnica y soporte para equipos informáticos.',
      category: 'Tecnología',
      status: 'active' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=192&fit=crop',
        alt: 'IT Support'
      },
      price: { amount: 80, currency: '€', period: 'hora' },
      rating: { value: 4.9, total: 89 },
      features: ['Instalación de software', 'Configuración de red', 'Resolución de problemas']
    },
    {
      id: 'svc-003',
      title: 'Limpieza Oficinas',
      description: 'Servicio profesional de limpieza para espacios de trabajo.',
      category: 'Limpieza',
      status: 'active' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=192&fit=crop',
        alt: 'Cleaning'
      },
      price: { amount: 45, currency: '€', period: 'día' },
      rating: { value: 4.7, total: 156 },
      features: ['Limpieza de escritorios', 'Aspirado', 'Vaciado de papeleras']
    },
    {
      id: 'svc-004',
      title: 'Mantenimiento Eléctrico',
      description: 'Instalación y reparación de sistemas eléctricos.',
      category: 'Electricidad',
      status: 'maintenance' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=192&fit=crop',
        alt: 'Electrical'
      },
      price: { amount: 120, currency: '€', period: 'servicio' },
      rating: { value: 4.6, total: 73 },
      features: ['Instalación de enchufes', 'Reparación de cableado', 'Revisión de cuadros']
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    if (onNavigate) {
      onNavigate(`/app/services/${serviceId}`);
    }
  };

  const handleCreateService = () => {
    if (onNavigate) {
      onNavigate('/app/services/new');
    }
  };

  return (
    <MainLayout
      user={user}
      currentRoute="services"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        <div>
          <Typography variant="h1" weight="bold" className="mb-2">
            Catálogo de Servicios
          </Typography>
          <Typography variant="p" color="muted">
            Gestiona y configura los servicios disponibles en el sistema
          </Typography>
        </div>

        <ServicesList
          services={mockServices}
          onServiceClick={handleServiceClick}
          onCreateService={handleCreateService}
        />
      </div>
    </MainLayout>
  );
};

export default ServicesListPage;