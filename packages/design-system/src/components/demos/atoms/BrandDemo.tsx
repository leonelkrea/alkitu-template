import React from 'react';
import Typography from '../../atoms/Typography';
import Brand from '../../atoms/Brand';
import Icon from '../../atoms/Icon';

const BrandDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Variantes principales */}
      <div className="space-y-6">
        <Typography variant="h4">Variantes del logo:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Horizontal */}
          <div className="space-y-4">
            <Typography variant="h4" size="sm">Horizontal</Typography>
            <div className="bg-neutral-100 border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center min-h-[120px]">
              <Brand variant="horizontal" size="lg" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Ideal para headers, footers y espacios amplios
            </Typography>
          </div>

          {/* Vertical */}
          <div className="space-y-4">
            <Typography variant="h4" size="sm">Vertical</Typography>
            <div className="bg-neutral-100 border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center min-h-[120px]">
              <Brand variant="vertical" size="md" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Perfecto para sidebars y espacios compactos
            </Typography>
          </div>

          {/* Solo icono */}
          <div className="space-y-4">
            <Typography variant="h4" size="sm">Solo icono</Typography>
            <div className="bg-neutral-100 border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center min-h-[120px]">
              <Brand variant="icon" size="xl" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Para favicons, avatars y referencias mínimas
            </Typography>
          </div>
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-6">
        <Typography variant="h4">Tamaños disponibles:</Typography>
        
        {/* Horizontal en diferentes tamaños */}
        <div className="space-y-4">
          <Typography variant="p" weight="medium">Horizontal:</Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['sm', 'md', 'lg', 'xl'].map((size) => (
              <div key={size} className="space-y-2">
                <div className="bg-neutral-100 border border-border rounded-lg p-4 flex items-center justify-center">
                  <Brand variant="horizontal" size={size as any} />
                </div>
                <Typography variant="p" size="sm" color="muted" className="text-center">
                  {size.toUpperCase()}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Icono en diferentes tamaños */}
        <div className="space-y-4">
          <Typography variant="p" weight="medium">Solo icono:</Typography>
          <div className="grid grid-cols-4 gap-4">
            {['sm', 'md', 'lg', 'xl'].map((size) => (
              <div key={size} className="space-y-2">
                <div className="bg-neutral-100 border border-border rounded-lg p-4 flex items-center justify-center">
                  <Brand variant="icon" size={size as any} />
                </div>
                <Typography variant="p" size="sm" color="muted" className="text-center">
                  {size.toUpperCase()}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variantes de color */}
      <div className="space-y-6">
        <Typography variant="h4">Variantes de color:</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Default */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Default</Typography>
            <div className="bg-neutral-100 border border-border rounded-lg p-6 flex items-center justify-center">
              <Brand variant="horizontal" size="md" color="default" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Para fondos claros y uso general
            </Typography>
          </div>

          {/* White */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">White</Typography>
            <div className="bg-neutral-800 border border-border rounded-lg p-6 flex items-center justify-center">
              <Brand variant="horizontal" size="md" color="white" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Para fondos oscuros y contextos invertidos
            </Typography>
          </div>

          {/* Monochrome */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Monochrome</Typography>
            <div className="bg-neutral-100 border border-border rounded-lg p-6 flex items-center justify-center">
              <Brand variant="horizontal" size="md" color="monochrome" />
            </div>
            <Typography variant="p" size="sm" color="muted">
              Para impresión y contextos monocromáticos
            </Typography>
          </div>
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-6">
        <Typography variant="h4">Casos de uso en el sistema:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header ejemplo */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Header principal</Typography>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Brand variant="horizontal" size="md" />
                <div className="flex items-center space-x-2">
                  <Icon name="Bell" size="sm" />
                  <Icon name="User" size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar ejemplo */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Sidebar compacto</Typography>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Brand variant="icon" size="md" />
                <div>
                  <Typography variant="p" size="sm" weight="medium">WorkFlow Pro</Typography>
                  <Typography variant="p" size="xs" color="muted">Design System</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Login ejemplo */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Página de login</Typography>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Brand variant="vertical" size="lg" className="mx-auto mb-4" />
              <Typography variant="p" size="sm" color="muted">
                Inicia sesión en tu cuenta
              </Typography>
            </div>
          </div>

          {/* Footer ejemplo */}
          <div className="space-y-3">
            <Typography variant="p" weight="medium">Footer</Typography>
            <div className="bg-neutral-800 text-white border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Brand variant="horizontal" size="sm" color="white" />
                <Typography variant="p" size="xs" className="text-neutral-300">
                  © 2024 WorkFlow Pro
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size="sm" className="text-yellow-600 mt-0.5" />
          <div className="space-y-2">
            <Typography variant="p" weight="medium" className="text-yellow-900">
              Instancia Única del Sistema
            </Typography>
            <Typography variant="p" size="sm" className="text-yellow-800">
              El componente Brand funciona como una instancia única. Cualquier cambio realizado al componente 
              se reflejará automáticamente en todas las pantallas del sistema que lo utilicen. Esto garantiza 
              consistencia visual y facilita el mantenimiento del branding corporativo.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDemo;