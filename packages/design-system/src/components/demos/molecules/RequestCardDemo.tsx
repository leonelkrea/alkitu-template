import React from 'react';
import Typography from '../../atoms/Typography';
import RequestCard from '../../molecules/RequestCard';

const RequestCardDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Estados de solicitud:</Typography>
        <div className="space-y-4 max-w-md">
          <RequestCard
            id="req-001"
            title="Mantenimiento Aire Acondicionado"
            description="Revisión y mantenimiento del sistema de climatización del edificio principal."
            status="pending"
            requestType="Mantenimiento"
            requestDate="2024-06-15"
            priority="high"
            image={{
              src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop",
              alt: "Aire acondicionado"
            }}
            onClick={() => console.log('Click en solicitud pendiente')}
          />
          
          <RequestCard
            id="req-002"
            title="Instalación Equipos IT"
            description="Configuración de nuevos equipos de desarrollo."
            status="in-progress"
            requestType="Instalación"
            requestDate="2024-06-12"
            priority="medium"
            image={{
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=192&fit=crop",
              alt: "Equipos IT"
            }}
            onClick={() => console.log('Click en solicitud en progreso')}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestCardDemo;