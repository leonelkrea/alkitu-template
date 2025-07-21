import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import ServicesList, { Service } from '../../organisms/ServicesList';
import ServicesListMobile from '../../organisms/ServicesListMobile';
import { useIsMobile } from '../../ui/use-mobile';

const ServicesListDemo: React.FC = () => {
  const isMobile = useIsMobile();
  const [variant, setVariant] = useState<'gallery' | 'detailed'>('gallery');
  const [showFilters, setShowFilters] = useState(true);

  // Sample services data
  const sampleServices: Service[] = [
    {
      id: '1',
      title: 'Pintura Residencial',
      description:
        'Servicio completo de pintura para interiores y exteriores de viviendas.',
      category: 'Hogar',
      image: {
        src: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=400&h=300',
        alt: 'Pintura residencial',
      },
      status: 'active',
      features: [
        'Pintura interior',
        'Pintura exterior',
        'Preparación de superficie',
      ],
      price: { amount: 150, currency: '$', period: 'día' },
      rating: { value: 4.8, total: 24 },
    },
    {
      id: '2',
      title: 'Limpieza Profunda',
      description: 'Servicio profesional de limpieza para oficinas y hogares.',
      category: 'Limpieza',
      image: {
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300',
        alt: 'Limpieza profunda',
      },
      status: 'active',
      features: ['Limpieza completa', 'Desinfección', 'Productos ecológicos'],
      price: { amount: 80, currency: '$', period: 'servicio' },
      rating: { value: 4.9, total: 45 },
    },
    {
      id: '3',
      title: 'Reparación Eléctrica',
      description:
        'Instalación y reparación de sistemas eléctricos residenciales.',
      category: 'Mantenimiento',
      image: {
        src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300',
        alt: 'Reparación eléctrica',
      },
      status: 'maintenance',
      features: ['Instalación eléctrica', 'Reparaciones', 'Certificación'],
      price: { amount: 200, currency: '$', period: 'servicio' },
      rating: { value: 4.7, total: 18 },
    },
    {
      id: '4',
      title: 'Jardinería y Paisajismo',
      description: 'Diseño y mantenimiento de jardines y espacios verdes.',
      category: 'Jardín',
      image: {
        src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300',
        alt: 'Jardinería',
      },
      status: 'active',
      features: ['Diseño paisajístico', 'Mantenimiento', 'Poda especializada'],
      price: { amount: 120, currency: '$', period: 'mes' },
      rating: { value: 4.6, total: 32 },
    },
    {
      id: '5',
      title: 'Plomería 24/7',
      description: 'Servicios de plomería de emergencia y mantenimiento.',
      category: 'Emergencias',
      image: {
        src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300',
        alt: 'Plomería',
      },
      status: 'active',
      features: ['Servicio 24/7', 'Emergencias', 'Instalaciones'],
      price: { amount: 180, currency: '$', period: 'servicio' },
      rating: { value: 4.5, total: 67 },
    },
    {
      id: '6',
      title: 'Carpintería Artesanal',
      description: 'Muebles y trabajos de carpintería personalizados.',
      category: 'Artesanía',
      image: {
        src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300',
        alt: 'Carpintería',
      },
      status: 'inactive',
      features: ['Muebles a medida', 'Restauración', 'Diseño personalizado'],
      price: { amount: 300, currency: '$', period: 'proyecto' },
      rating: { value: 4.9, total: 12 },
    },
    {
      id: '7',
      title: 'Aire Acondicionado',
      description: 'Instalación y mantenimiento de sistemas de climatización.',
      category: 'Climatización',
      image: {
        src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300',
        alt: 'Aire acondicionado',
      },
      status: 'active',
      features: ['Instalación', 'Mantenimiento preventivo', 'Reparaciones'],
      price: { amount: 250, currency: '$', period: 'servicio' },
      rating: { value: 4.4, total: 28 },
    },
    {
      id: '8',
      title: 'Seguridad Residencial',
      description: 'Instalación de cámaras y sistemas de seguridad.',
      category: 'Seguridad',
      image: {
        src: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300',
        alt: 'Seguridad',
      },
      status: 'active',
      features: ['Cámaras IP', 'Alarmas', 'Monitoreo 24/7'],
      price: { amount: 400, currency: '$', period: 'instalación' },
      rating: { value: 4.8, total: 15 },
    },
    {
      id: '9',
      title: 'Mudanzas Express',
      description:
        'Servicio profesional de mudanzas locales e internacionales.',
      category: 'Logística',
      image: {
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300',
        alt: 'Mudanzas',
      },
      status: 'maintenance',
      features: [
        'Embalaje profesional',
        'Transporte seguro',
        'Seguro incluido',
      ],
      price: { amount: 120, currency: '$', period: 'hora' },
      rating: { value: 4.3, total: 89 },
    },
    {
      id: '10',
      title: 'Diseño de Interiores',
      description:
        'Consultoría y diseño de espacios interiores personalizados.',
      category: 'Diseño',
      image: {
        src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300',
        alt: 'Diseño de interiores',
      },
      status: 'active',
      features: ['Consultoría', 'Diseño 3D', 'Gestión de proyecto'],
      price: { amount: 500, currency: '$', period: 'consulta' },
      rating: { value: 5.0, total: 8 },
    },
    {
      id: '11',
      title: 'Entrenamiento Personal',
      description: 'Sesiones personalizadas de fitness y bienestar.',
      category: 'Salud',
      image: {
        src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300',
        alt: 'Entrenamiento personal',
      },
      status: 'active',
      features: ['Planes personalizados', 'Nutrición', 'Seguimiento'],
      price: { amount: 60, currency: '$', period: 'sesión' },
      rating: { value: 4.7, total: 56 },
    },
    {
      id: '12',
      title: 'Fotografía Profesional',
      description: 'Servicios de fotografía para eventos y retratos.',
      category: 'Medios',
      image: {
        src: 'https://images.unsplash.com/photo-1554048612-b6eb0ac0b2c5?w=400&h=300',
        alt: 'Fotografía',
      },
      status: 'inactive',
      features: ['Eventos', 'Retratos', 'Sesiones comerciales'],
      price: { amount: 350, currency: '$', period: 'sesión' },
      rating: { value: 4.9, total: 23 },
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    console.log('Service clicked:', serviceId);
    alert(
      `Servicio seleccionado: ${sampleServices.find((s) => s.id === serviceId)?.title}`,
    );
  };

  const handleCreateService = () => {
    console.log('Create new service');
    alert('Crear nuevo servicio');
  };

  const getVariantDescription = (variant: 'gallery' | 'detailed') => {
    switch (variant) {
      case 'gallery':
        return 'Vista de galería simple con cards compactas en grid responsivo';
      case 'detailed':
        return 'Vista detallada con información completa y opciones de visualización';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Demo Controls */}
      <div className="space-y-6">
        <Typography variant="h3">Services List Component</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography
              variant="p"
              weight="medium"
              className="text-blue-900 mb-2"
            >
              🖼️ Vista Galería (Nueva)
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • <strong>Grid responsivo:</strong> 2-6 columnas según el tamaño
              de pantalla
              <br />• <strong>Cards simples:</strong> Solo imagen, título y
              categoría
              <br />• <strong>Filtros avanzados:</strong> Por estado y categoría
              con contadores
              <br />• <strong>Stats footer:</strong> Resumen visual de estados
            </Typography>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography
              variant="p"
              weight="medium"
              className="text-green-900 mb-2"
            >
              📋 Vista Detallada
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • <strong>Información completa:</strong> Descripción, precio,
              rating, características
              <br />• <strong>Múltiples vistas:</strong> Grid y lista
              intercambiables
              <br />• <strong>Filtros completos:</strong> Todos los metadatos
              disponibles
              <br />• <strong>Cards expandidas:</strong> Información detallada
              visible
            </Typography>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-neutral-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Variante:
          </Typography>
          <Button
            variant={variant === 'gallery' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setVariant('gallery')}
          >
            Galería
          </Button>
          <Button
            variant={variant === 'detailed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setVariant('detailed')}
          >
            Detallada
          </Button>
        </div>

        <div className="w-px h-6 bg-border"></div>

        <div className="flex items-center space-x-2">
          <Typography variant="p" size="sm" weight="medium">
            Filtros:
          </Typography>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
      </div>

      {/* Current Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted" className="mb-1">
            Configuración actual:
          </Typography>
          <Typography variant="p" weight="medium" className="capitalize">
            Vista {variant === 'gallery' ? '🖼️ Galería' : '📋 Detallada'}
          </Typography>
          <Typography variant="p" size="xs" color="muted" className="mt-1">
            {getVariantDescription(variant)}
          </Typography>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted" className="mb-1">
            Servicios de muestra:
          </Typography>
          <Typography variant="p" weight="medium">
            {sampleServices.length} servicios totales
          </Typography>
          <Typography variant="p" size="xs" color="muted" className="mt-1">
            {sampleServices.filter((s) => s.status === 'active').length} activos,{' '}
            {sampleServices.filter((s) => s.status === 'maintenance').length} en
            mantenimiento,{' '}
            {sampleServices.filter((s) => s.status === 'inactive').length} inactivos
          </Typography>
        </div>
      </div>

      {/* Component Demo */}
      <div className="bg-neutral-50 p-6 rounded-lg border border-border">
        <div className="mb-4 text-center">
          <Typography
            variant="p"
            size="sm"
            weight="medium"
            className="bg-white px-3 py-1 rounded-full border"
          >
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente:{' '}
            {isMobile ? 'ServicesListMobile' : 'ServicesList'}
          </Typography>
        </div>

        {isMobile ? (
          <ServicesListMobile
            services={sampleServices}
            variant={variant}
            showFilters={showFilters}
            onServiceClick={handleServiceClick}
            onCreateService={handleCreateService}
          />
        ) : (
          <ServicesList
            services={sampleServices}
            variant={variant}
            showFilters={showFilters}
            onServiceClick={handleServiceClick}
            onCreateService={handleCreateService}
          />
        )}
      </div>

      {/* Features Documentation */}
      <div className="space-y-6">
        <Typography variant="h3">Características Implementadas</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>🖼️</span>
              <span>Vista Galería</span>
            </Typography>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Grid Ultra Responsivo
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    2 cols (móvil) &rarr; 6 cols (4K), adaptación automática
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Cards Simples
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Imagen + título + categoría, diseño limpio
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Filtros con Contadores
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Badges que muestran número de servicios por estado
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Stats Footer
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Resumen visual con dots de colores por estado
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-design-primary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Hover Effects
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Transiciones suaves y scale en imágenes
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="space-y-4">
            <Typography variant="h4" className="flex items-center space-x-2">
              <span>📋</span>
              <span>Vista Detallada</span>
            </Typography>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Cards Completas
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Descripción, precio, rating, características
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Toggle Grid/Lista
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Cambio entre vista de grid y lista horizontal
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Filtros Avanzados
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Por estado, categoría, con dropdown de categorías
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Metadatos Visibles
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Precio, calificación, características destacadas
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                <div>
                  <Typography variant="p" size="sm" weight="medium">
                    Estados Visuales
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Badges de estado con colores diferenciados
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        <Typography variant="h3">Opciones de Configuración</Typography>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography variant="h4" className="mb-3">
                Props Principales
              </Typography>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-neutral-200 px-1 rounded">variant</code>:
                  &apos;gallery&apos; | &apos;detailed&apos;
                </div>
                <div>
                  <code className="bg-neutral-200 px-1 rounded">
                    showFilters
                  </code>
                  : boolean
                </div>
                <div>
                  <code className="bg-neutral-200 px-1 rounded">
                    showHeader
                  </code>
                  : boolean
                </div>
                <div>
                  <code className="bg-neutral-200 px-1 rounded">services</code>:
                  Service[]
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h4" className="mb-3">
                Callbacks
              </Typography>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-neutral-200 px-1 rounded">
                    onServiceClick
                  </code>
                  : (id) =&gt; void
                </div>
                <div>
                  <code className="bg-neutral-200 px-1 rounded">
                    onCreateService
                  </code>
                  : () =&gt; void
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h4" className="mb-3">
                Responsive Grid
              </Typography>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Gallery:</strong> 2&rarr;3&rarr;4&rarr;5&rarr;6 cols
                </div>
                <div>
                  <strong>Detailed:</strong> 1&rarr;2&rarr;3 cols
                </div>
                <div>
                  <strong>Breakpoints:</strong> sm, md, lg, xl, 2xl
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesListDemo;
