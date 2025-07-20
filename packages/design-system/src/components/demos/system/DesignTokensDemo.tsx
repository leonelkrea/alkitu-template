import React from 'react';
import Typography from '../../atoms/Typography';
import Icon from '../../atoms/Icon';

const DesignTokensDemo: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Información del sistema de tokens */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h3">Design Tokens</Typography>
          <div className="flex items-center space-x-2">
            <Icon name="Palette" size="sm" className="text-design-primary" />
            <Typography variant="p" size="sm" color="muted">
              Fundamentos del sistema
            </Typography>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size="sm" className="text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <Typography variant="p" weight="medium" className="text-blue-900">
                Sistema de Tokens Centralizado
              </Typography>
              <Typography variant="p" size="sm" className="text-blue-800">
                Los design tokens son los valores fundamentales del sistema: colores, tipografía, espaciado, 
                sombras y radios. Estos tokens garantizan consistencia visual y facilitan el mantenimiento 
                global del diseño.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Colores principales */}
      <div className="space-y-6">
        <Typography variant="h3">Paleta Principal</Typography>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: 'Primary Dark', value: '#403925', description: 'Tierra oscura', token: '--primary-dark' },
            { name: 'Primary', value: '#F2AB27', description: 'Amarillo medio', token: '--primary' },
            { name: 'Secondary', value: '#F2921D', description: 'Naranja vibrante', token: '--secondary' },
            { name: 'Accent Light', value: '#F2C288', description: 'Melocotón claro', token: '--accent-light' },
            { name: 'Accent Pale', value: '#F2E0AD', description: 'Amarillo suave', token: '--accent-pale' },
          ].map((color, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-24 rounded-lg border border-border mb-3"
                style={{ backgroundColor: color.value }}
              ></div>
              <Typography variant="p" weight="medium" size="sm">
                {color.name}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground">
                {color.value}
              </Typography>
              <Typography variant="p" size="xs" color="muted">
                {color.description}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground bg-neutral-100 px-2 py-1 rounded mt-1">
                {color.token}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Colores neutros */}
      <div className="space-y-6">
        <Typography variant="h3">Escala de Neutros</Typography>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Neutral 100', value: '#FFFFFF', token: '--neutral-100' },
            { name: 'Neutral 200', value: '#F9F9F9', token: '--neutral-200' },
            { name: 'Neutral 300', value: '#F2F2F2', token: '--neutral-300' },
            { name: 'Neutral 400', value: '#EBEBEB', token: '--neutral-400' },
            { name: 'Neutral 500', value: '#E0E0E0', token: '--neutral-500' },
            { name: 'Neutral 600', value: '#C8C8C8', token: '--neutral-600' },
            { name: 'Neutral 700', value: '#A8A8A8', token: '--neutral-700' },
            { name: 'Neutral 800', value: '#767676', token: '--neutral-800' },
            { name: 'Neutral 900', value: '#4A4A4A', token: '--neutral-900' },
          ].map((color, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-16 rounded border border-border mb-2"
                style={{ backgroundColor: color.value }}
              ></div>
              <Typography variant="p" size="xs" weight="medium">
                {color.name}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground">
                {color.value}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground bg-neutral-100 px-1 rounded">
                {color.token}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Colores semánticos */}
      <div className="space-y-6">
        <Typography variant="h3">Colores Semánticos</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Success', value: '#2F9E44', description: 'Estados de éxito y confirmación', token: '--notification-success' },
            { name: 'Warning', value: '#F2AB27', description: 'Advertencias y atención', token: '--notification-warning' },
            { name: 'Error', value: '#D92D20', description: 'Errores y estados destructivos', token: '--notification-error' },
          ].map((color, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-20 rounded-lg border border-border mb-3"
                style={{ backgroundColor: color.value }}
              ></div>
              <Typography variant="p" weight="medium" size="sm">
                {color.name}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground">
                {color.value}
              </Typography>
              <Typography variant="p" size="xs" color="muted" className="mb-2">
                {color.description}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground bg-neutral-100 px-2 py-1 rounded">
                {color.token}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-6">
        <Typography variant="h3">Tipografía</Typography>
        <div className="space-y-4">
          {[
            { element: 'h1', size: '24px', weight: 'Medium', token: '--text-2xl' },
            { element: 'h2', size: '20px', weight: 'Medium', token: '--text-xl' },
            { element: 'h3', size: '18px', weight: 'Medium', token: '--text-lg' },
            { element: 'h4', size: '16px', weight: 'Medium', token: '--text-base' },
            { element: 'p', size: '16px', weight: 'Regular', token: '--text-base' },
            { element: 'small', size: '14px', weight: 'Regular', token: '--text-sm' },
            { element: 'caption', size: '12px', weight: 'Regular', token: '--text-xs' },
          ].map((typo, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <Typography variant={typo.element as any}>
                  {typo.element.charAt(0).toUpperCase() + typo.element.slice(1)} Example
                </Typography>
              </div>
              <div className="text-right space-y-1">
                <Typography variant="p" size="sm" color="muted">
                  {typo.size} • {typo.weight}
                </Typography>
                <Typography variant="p" size="xs" className="font-mono text-muted-foreground">
                  {typo.token}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-neutral-100 border border-border rounded-lg p-4">
          <Typography variant="p" size="sm" color="muted">
            <strong>Familia tipográfica:</strong> Inter (--font-family) • 
            <strong>Pesos disponibles:</strong> 400 (Regular), 500 (Medium), 700 (Bold)
          </Typography>
        </div>
      </div>

      {/* Espaciado */}
      <div className="space-y-6">
        <Typography variant="h3">Sistema de Espaciado</Typography>
        <div className="space-y-4">
          {[
            { name: 'XS', value: '4px', token: '--space-xs', usage: 'Espaciado mínimo entre elementos' },
            { name: 'SM', value: '8px', token: '--space-sm', usage: 'Espacios compactos' },
            { name: 'MD', value: '16px', token: '--space-md', usage: 'Espaciado estándar' },
            { name: 'LG', value: '24px', token: '--space-lg', usage: 'Separación entre secciones' },
            { name: 'XL', value: '32px', token: '--space-xl', usage: 'Espaciado amplio' },
            { name: '2XL', value: '48px', token: '--space-2xl', usage: 'Separación mayor entre bloques' },
          ].map((space, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div 
                  className="bg-design-primary rounded flex-shrink-0"
                  style={{ 
                    width: space.value, 
                    height: space.value,
                    minWidth: space.value,
                    minHeight: space.value
                  }}
                ></div>
                <div>
                  <Typography variant="p" weight="medium">
                    {space.name}
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    {space.usage}
                  </Typography>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Typography variant="p" size="sm" color="muted">
                  {space.value}
                </Typography>
                <Typography variant="p" size="xs" className="font-mono text-muted-foreground">
                  {space.token}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radios de borde */}
      <div className="space-y-6">
        <Typography variant="h3">Radios de Borde</Typography>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'None', value: '0px', token: '--radius-none' },
            { name: 'Small', value: '2px', token: '--radius-sm' },
            { name: 'Medium', value: '4px', token: '--radius-md' },
            { name: 'Large', value: '8px', token: '--radius-lg' },
            { name: 'Full', value: '9999px', token: '--radius-full' },
          ].map((radius, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-16 bg-design-primary border border-border mb-2"
                style={{ borderRadius: radius.value }}
              ></div>
              <Typography variant="p" size="sm" weight="medium">
                {radius.name}
              </Typography>
              <Typography variant="p" size="xs" color="muted">
                {radius.value}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground bg-neutral-100 px-1 rounded">
                {radius.token}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Sombras */}
      <div className="space-y-6">
        <Typography variant="h3">Sistema de Sombras</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Small', value: '0 1px 2px rgba(0,0,0,0.05)', token: '--shadow-sm', usage: 'Elementos sutiles' },
            { name: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)', token: '--shadow-md', usage: 'Cards y componentes' },
            { name: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)', token: '--shadow-lg', usage: 'Modales y overlays' },
          ].map((shadow, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-20 bg-card border border-border rounded-lg mb-3 mx-auto"
                style={{ boxShadow: shadow.value }}
              ></div>
              <Typography variant="p" weight="medium" size="sm">
                {shadow.name}
              </Typography>
              <Typography variant="p" size="xs" color="muted" className="mb-2">
                {shadow.usage}
              </Typography>
              <Typography variant="p" size="xs" className="font-mono text-muted-foreground bg-neutral-100 px-2 py-1 rounded">
                {shadow.token}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Implementación */}
      <div className="space-y-6">
        <Typography variant="h3">Implementación</Typography>
        
        <div className="bg-neutral-900 text-neutral-100 p-6 rounded-lg overflow-x-auto">
          <div className="space-y-4">
            <div className="text-neutral-400 text-sm">// Acceso a tokens en CSS</div>
            <div><span className="text-blue-400">.mi-componente</span> {`{`}</div>
            <div className="ml-4"><span className="text-purple-400">background-color</span>: <span className="text-yellow-400">var(--primary)</span>;</div>
            <div className="ml-4"><span className="text-purple-400">padding</span>: <span className="text-yellow-400">var(--space-md)</span>;</div>
            <div className="ml-4"><span className="text-purple-400">border-radius</span>: <span className="text-yellow-400">var(--radius-lg)</span>;</div>
            <div className="ml-4"><span className="text-purple-400">box-shadow</span>: <span className="text-yellow-400">var(--shadow-md)</span>;</div>
            <div>{`}`}</div>
            
            <div className="mt-6 text-neutral-400 text-sm">// Acceso desde JavaScript/TypeScript</div>
            <div><span className="text-green-400">import</span> {`{ designColors }`} <span className="text-green-400">from</span> <span className="text-yellow-400">'./src/themes/tokens'</span>;</div>
            <div><span className="text-green-400">const</span> <span className="text-white">primaryColor</span> = <span className="text-blue-400">designColors</span>.<span className="text-white">primary</span>;</div>
          </div>
        </div>
      </div>

      {/* Archivo de tokens */}
      <div className="space-y-6">
        <Typography variant="h3">Ubicación del Archivo</Typography>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="FileCode" size="sm" className="text-muted-foreground" />
              <div>
                <Typography variant="p" weight="medium">Archivo de tokens:</Typography>
                <Typography variant="p" size="sm" className="font-mono text-muted-foreground">
                  ./src/themes/tokens.ts
                </Typography>
              </div>
            </div>
            <Typography variant="p" size="sm" color="muted">
              Centraliza todos los valores del design system
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTokensDemo;