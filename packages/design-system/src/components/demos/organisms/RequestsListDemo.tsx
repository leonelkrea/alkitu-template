import React from 'react';
import Typography from '../../atoms/Typography';
import RequestsList from '../../organisms/RequestsList';
import RequestsListMobile from '../../organisms/RequestsListMobile';
import { useIsMobile } from '../../../../components/ui/use-mobile';

const RequestsListDemo: React.FC = () => {
  const isMobile = useIsMobile();
  
  const mockRequests = [
    {
      id: 'req-001',
      title: 'Reparación de Aire Acondicionado',
      description: 'El aire acondicionado de la oficina principal no está funcionando correctamente.',
      status: 'pending' as const,
      requestType: 'Mantenimiento',
      requestDate: '2024-06-15',
      priority: 'high' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop',
        alt: 'Aire acondicionado'
      }
    },
    {
      id: 'req-002',
      title: 'Nuevo Equipo de Desarrollo',
      description: 'Solicitud de nuevos equipos de desarrollo para el equipo de frontend.',
      status: 'approved' as const,
      requestType: 'Equipamiento',
      requestDate: '2024-06-10',
      priority: 'medium' as const,
      image: {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=192&fit=crop',
        alt: 'Equipos'
      }
    },
    {
      id: 'req-003',
      title: 'Actualización de Software',
      description: 'Actualizar el software de gestión de proyectos a la última versión.',
      status: 'in-progress' as const,
      requestType: 'Software',
      requestDate: '2024-06-12',
      priority: 'low' as const
    }
  ];

  const handleRequestClick = (id: string) => {
    console.log('Solicitud clickeada:', id);
    alert(`Abriendo solicitud: ${id}`);
  };

  const handleNewRequest = () => {
    console.log('Nueva solicitud');
    alert('Abriendo formulario de nueva solicitud');
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filtros aplicados:', filters);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Typography variant="h4">Lista de Solicitudes</Typography>
        <Typography variant="p" size="sm" color="muted" className="hidden md:block">
          Componente con versiones separadas para desktop y móvil
        </Typography>
        <Typography variant="p" size="sm" color="muted" className="md:hidden">
          Versión móvil optimizada con navegación intuitiva
        </Typography>
      </div>

      {/* Demostración del componente */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border">
          <Typography variant="p" size="sm" weight="medium">
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente: {isMobile ? 'RequestsListMobile' : 'RequestsList'}
          </Typography>
        </div>
        
        <div className="p-0 md:p-6">
          {isMobile ? (
            <RequestsListMobile
              requests={mockRequests}
              onRequestClick={handleRequestClick}
              onNewRequest={handleNewRequest}
              onFilterChange={handleFilterChange}
            />
          ) : (
            <RequestsList
              requests={mockRequests}
              onRequestClick={handleRequestClick}
              onNewRequest={handleNewRequest}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <Typography variant="p" size="sm" weight="medium">
          🎯 Características específicas por dispositivo:
        </Typography>
        <ul className="space-y-1 pl-4">
          <li className="text-sm text-muted-foreground">• 📱 Móvil: Layout en cards, filtros colapsables, botones táctiles</li>
          <li className="text-sm text-muted-foreground">• 🖥️ Desktop: Grid responsive, filtros inline, interfaz compacta</li>
          <li className="text-sm text-muted-foreground">• 🔄 Detección automática de dispositivo con useIsMobile()</li>
          <li className="text-sm text-muted-foreground">• 🎨 Optimización específica de UX para cada plataforma</li>
          <li className="text-sm text-muted-foreground">• ⚡ Mejor rendimiento con componentes especializados</li>
        </ul>
      </div>
    </div>
  );
};

export default RequestsListDemo;