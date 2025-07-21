import React from 'react';
import Typography from '../../atoms/Typography';
import ServiceCard from '../../molecules/ServiceCard';

const ServiceCardDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Variante simple */}
      <div className="space-y-6">
        <Typography variant="h4">Variante simple (solo imagen y título):</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <ServiceCard
            variant="simple"
            id="simple-001"
            title="Mantenimiento HVAC"
            category="Climatización"
            status="active"
            image={{
              src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=240&fit=crop",
              alt: "Sistema HVAC"
            }}
            onClick={() => console.log('Click en servicio simple HVAC')}
          />
          
          <ServiceCard
            variant="simple"
            id="simple-002"
            title="Soporte Técnico IT"
            category="Tecnología"
            status="active"
            image={{
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop",
              alt: "Soporte IT"
            }}
            onClick={() => console.log('Click en servicio simple IT')}
          />
          
          <ServiceCard
            variant="simple"
            id="simple-003"
            title="Servicio de Limpieza"
            category="Mantenimiento"
            status="maintenance"
            image={{
              src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=240&fit=crop",
              alt: "Servicio de limpieza"
            }}
            onClick={() => console.log('Click en servicio simple limpieza')}
          />
        </div>
      </div>

      {/* Variante completa */}
      <div className="space-y-6">
        <Typography variant="h4">Variante completa (con toda la información):</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <ServiceCard
            variant="full"
            id="full-001"
            title="Mantenimiento HVAC Profesional"
            description="Servicio completo de mantenimiento para sistemas de climatización con garantía extendida"
            category="Climatización"
            status="active"
            image={{
              src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=192&fit=crop",
              alt: "HVAC"
            }}
            price={{ amount: 150, currency: "€", period: "servicio" }}
            rating={{ value: 4.8, total: 124 }}
            features={[
              "Diagnóstico completo",
              "Limpieza de filtros",
              "Revisión de compresores",
              "Informe detallado",
              "Garantía de 6 meses"
            ]}
            onClick={() => console.log('Click en servicio completo HVAC')}
          />

          <ServiceCard
            variant="full"
            id="full-002"
            title="Soporte IT Empresarial"
            description="Asistencia técnica especializada para infraestructura informática empresarial"
            category="Tecnología"
            status="active"
            image={{
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=192&fit=crop",
              alt: "IT Support"
            }}
            price={{ amount: 80, currency: "€", period: "hora" }}
            rating={{ value: 4.9, total: 89 }}
            features={[
              "Instalación de software",
              "Configuración de red",
              "Seguridad informática",
              "Backup de datos"
            ]}
            onClick={() => console.log('Click en servicio completo IT')}
          />
        </div>
      </div>

      {/* Galería de servicios simples */}
      <div className="space-y-6">
        <Typography variant="h4">Galería de servicios (variante simple):</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            {
              id: 'gallery-1',
              title: 'Electricidad',
              category: 'Instalaciones',
              image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=200&fit=crop',
              status: 'active' as const
            },
            {
              id: 'gallery-2',
              title: 'Fontanería',
              category: 'Instalaciones',
              image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop',
              status: 'active' as const
            },
            {
              id: 'gallery-3',
              title: 'Carpintería',
              category: 'Construcción',
              image: 'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=300&h=200&fit=crop',
              status: 'active' as const
            },
            {
              id: 'gallery-4',
              title: 'Pintura',
              category: 'Acabados',
              image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop',
              status: 'maintenance' as const
            },
            {
              id: 'gallery-5',
              title: 'Seguridad',
              category: 'Protección',
              image: 'https://images.unsplash.com/photo-1558002411-bbd2c852cd5b?w=300&h=200&fit=crop',
              status: 'active' as const
            },
            {
              id: 'gallery-6',
              title: 'Jardinería',
              category: 'Exterior',
              image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
              status: 'inactive' as const
            }
          ].map((service) => (
            <ServiceCard
              key={service.id}
              variant="simple"
              id={service.id}
              title={service.title}
              category={service.category}
              status={service.status}
              image={{
                src: service.image,
                alt: service.title
              }}
              onClick={() => console.log(`Click en ${service.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-6">
        <Typography variant="h4">Casos de uso recomendados:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              Variante Simple
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • Galerías de servicios<br/>
              • Catálogos simplificados<br/>
              • Navegación rápida<br/>
              • Vistas de grid compactas<br/>
              • Presentación visual limpia
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              Variante Completa
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • Páginas de servicios detalladas<br/>
              • Comparación de opciones<br/>
              • Información de precios<br/>
              • Características técnicas<br/>
              • Decisiones de compra
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardDemo;