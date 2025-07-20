import React from 'react';
import Typography from '../../atoms/Typography';
import PreviewImage from '../../atoms/PreviewImage';
import Icon from '../../atoms/Icon';

const PreviewImageDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Tamaños estándar:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Pequeño (150x100)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=100&fit=crop"
              alt="Aire acondicionado"
              width={150}
              height={100}
              className="border"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Mediano (250x180)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=250&h=180&fit=crop"
              alt="Computadoras"
              width={250}
              height={180}
              className="border"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Grande (300x200)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1560472355-109703aa3edc?w=300&h=200&fit=crop"
              alt="Oficina moderna"
              width={300}
              height={200}
              className="border"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con overlay y acciones:</Typography>
        <div className="max-w-sm">
          <PreviewImage
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=320&h=240&fit=crop"
            alt="Computadoras"
            width={320}
            height={240}
            showOverlay
            onView={() => console.log('Ver imagen')}
            onDownload={() => console.log('Descargar imagen')}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Diferentes formas (object-fit):</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Cover (recorta para llenar)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop"
              alt="Imagen cover"
              width={200}
              height={150}
              objectFit="cover"
              className="border"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Contain (mantiene proporción)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop"
              alt="Imagen contain"
              width={200}
              height={150}
              objectFit="contain"
              className="border"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Fill (estira para llenar)</Typography>
            <PreviewImage
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop"
              alt="Imagen fill"
              width={200}
              height={150}
              objectFit="fill"
              className="border"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Bordes redondeados:</Typography>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { rounded: 'none', label: 'Sin redondeo' },
            { rounded: 'sm', label: 'Pequeño' },
            { rounded: 'md', label: 'Mediano' },
            { rounded: 'lg', label: 'Grande' },
            { rounded: 'full', label: 'Circular' }
          ].map((item) => (
            <div key={item.rounded}>
              <Typography variant="p" size="xs" className="mb-2">{item.label}</Typography>
              <PreviewImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
                alt={`Imagen ${item.label}`}
                width={120}
                height={120}
                rounded={item.rounded as any}
                className="border"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estados de error:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Error con fallback por defecto</Typography>
            <PreviewImage
              src="imagen-rota.jpg"
              alt="Imagen no disponible"
              width={250}
              height={180}
              className="border"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Error con fallback personalizado</Typography>
            <PreviewImage
              src="imagen-rota-2.jpg"
              alt="Imagen no disponible"
              width={250}
              height={180}
              className="border"
              fallback={
                <div className="flex flex-col items-center justify-center h-full bg-neutral-100 text-neutral-500">
                  <Icon name="ImageOff" size="lg" />
                  <Typography variant="p" size="sm" className="mt-2">
                    Imagen no disponible
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Intenta subir una nueva imagen
                  </Typography>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Responsive (ancho relativo):</Typography>
        <div className="space-y-4">
          <Typography variant="p" size="sm" weight="medium">Imagen que se adapta al contenedor (max-width: 400px)</Typography>
          <div className="max-w-md border-2 border-dashed border-neutral-300 p-4">
            <PreviewImage
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=250&fit=crop"
              alt="Imagen responsive"
              width="100%"
              height={250}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImageDemo;