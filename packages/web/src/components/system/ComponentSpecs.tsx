import React from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import { ComponentData } from '../data/componentsData';

export interface ComponentSpecsProps {
  component: ComponentData;
}

const ComponentSpecs: React.FC<ComponentSpecsProps> = ({ component }) => {
  if (!component) {
    return (
      <div className="flex items-center justify-center h-64">
        <Typography variant="p" color="muted">
          Selecciona un componente para ver sus especificaciones
        </Typography>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Design System':
        return 'primary';
      case 'Atoms':
        return 'success';
      case 'Molecules':
        return 'warning';
      case 'Organisms':
        return 'secondary';
      case 'Templates':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Design System':
        return 'Palette';
      case 'Atoms':
        return 'Circle';
      case 'Molecules':
        return 'Hexagon';
      case 'Organisms':
        return 'Layers';
      case 'Templates':
        return 'LayoutGrid';
      default:
        return 'Folder';
    }
  };

  const renderPropTable = () => {
    if (!component.props || Object.keys(component.props).length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="Info" size="lg" color="muted" className="mx-auto mb-3" />
          <Typography variant="p" color="muted">
            Este componente no tiene props configurables
          </Typography>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <Typography variant="p" weight="medium" size="sm">
                  Prop
                </Typography>
              </th>
              <th className="text-left py-3 px-4">
                <Typography variant="p" weight="medium" size="sm">
                  Tipo
                </Typography>
              </th>
              <th className="text-left py-3 px-4">
                <Typography variant="p" weight="medium" size="sm">
                  Descripción
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(component.props).map(([propName, propType]) => (
              <tr key={propName} className="border-b border-border/50">
                <td className="py-3 px-4">
                  <code className="bg-accent/20 px-2 py-1 rounded text-sm font-mono">
                    {propName}
                  </code>
                </td>
                <td className="py-3 px-4">
                  <Typography
                    variant="p"
                    size="sm"
                    color="muted"
                    className="font-mono"
                  >
                    {String(propType)}
                  </Typography>
                </td>
                <td className="py-3 px-4">
                  <Typography variant="p" size="sm">
                    {getPropDescription(propName)}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getPropDescription = (propName: string) => {
    const descriptions: Record<string, string> = {
      variant: 'Define el estilo visual del componente',
      size: 'Controla el tamaño del componente',
      color: 'Establece el color del componente',
      disabled: 'Deshabilita la interacción del componente',
      loading: 'Muestra estado de carga',
      icon: 'Icono a mostrar (nombre de Lucide React)',
      iconPosition: 'Posición del icono relativa al texto',
      fullWidth: 'Hace que el componente ocupe todo el ancho',
      children: 'Contenido hijo del componente',
      className: 'Clases CSS adicionales',
      onClick: 'Función ejecutada al hacer clic',
      onChange: 'Función ejecutada al cambiar el valor',
      value: 'Valor actual del componente',
      placeholder: 'Texto de marcador de posición',
      label: 'Etiqueta descriptiva del componente',
      description: 'Descripción adicional del componente',
      required: 'Indica si el campo es obligatorio',
      error: 'Mensaje de error a mostrar',
      checked: 'Estado de selección del componente',
      src: 'URL de la imagen a mostrar',
      alt: 'Texto alternativo para la imagen',
      fallback: 'Contenido a mostrar si falla la carga',
      position: 'Posición del elemento relativa a su contenedor',
      content: 'Contenido a mostrar en el componente',
      trigger: 'Elemento que activa el componente',
    };

    return descriptions[propName] || 'Propiedad del componente';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Icon
            name={getCategoryIcon(component.category) as any}
            size="lg"
            color={getCategoryColor(component.category) as any}
          />
          <div>
            <Typography variant="h1" weight="bold">
              {component.name}
            </Typography>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={getCategoryColor(component.category) as any}
                size="sm"
              >
                {component.category}
              </Badge>
            </div>
          </div>
        </div>

        <Typography variant="p" size="lg" color="muted">
          {component.description}
        </Typography>
      </div>

      {/* Props */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size="md" color="primary" />
          <Typography variant="h3" weight="medium">
            Propiedades
          </Typography>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {renderPropTable()}
        </div>
      </div>

      {/* Usage Guidelines */}
      {component.usageGuidelines && component.usageGuidelines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="BookOpen" size="md" color="secondary" />
            <Typography variant="h3" weight="medium">
              Guías de Uso
            </Typography>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
            <div className="space-y-3">
              {component.usageGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <Typography variant="p" size="sm">
                    {guideline}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Examples */}
      {component.examples && component.examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Code" size="md" color="success" />
            <Typography variant="h3" weight="medium">
              Ejemplos de Código
            </Typography>
          </div>

          <div className="space-y-4">
            {component.examples.map((example, index) => (
              <div
                key={index}
                className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto"
              >
                <pre className="text-sm">
                  <code>{example}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Tokens (for Design System category) */}
      {component.category === 'Design System' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Palette" size="md" color="primary" />
            <Typography variant="h3" weight="medium">
              Design Tokens
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <Typography variant="h4" weight="medium" className="mb-4">
                Colores
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primary</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-design-primary rounded border"></div>
                    <code className="text-xs">#F2AB27</code>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Secondary</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-design-secondary rounded border"></div>
                    <code className="text-xs">#F2921D</code>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Success</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-success rounded border"></div>
                    <code className="text-xs">#2F9E44</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Typography variant="h4" weight="medium" className="mb-4">
                Espaciado
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">xs</span>
                  <code className="text-xs">4px</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">sm</span>
                  <code className="text-xs">8px</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">md</span>
                  <code className="text-xs">16px</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">lg</span>
                  <code className="text-xs">24px</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">xl</span>
                  <code className="text-xs">32px</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Information (for Organisms and Templates) */}
      {(component.category === 'Organisms' ||
        component.category === 'Templates') && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Layers" size="md" color="secondary" />
            <Typography variant="h3" weight="medium">
              Arquitectura de Componentes
            </Typography>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
            <Typography variant="p" size="sm" className="mb-4">
              Este{' '}
              {component.category === 'Organisms' ? 'organismo' : 'template'}{' '}
              está construido usando el principio de Atomic Design:
            </Typography>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="ArrowRight" size="sm" color="muted" />
                <Typography variant="p" size="sm">
                  {component.category === 'Organisms'
                    ? 'Combina múltiples moléculas para crear funcionalidad compleja'
                    : 'Combina organismos para crear páginas completas'}
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ArrowRight" size="sm" color="muted" />
                <Typography variant="p" size="sm">
                  Mantiene consistencia visual y funcional del design system
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ArrowRight" size="sm" color="muted" />
                <Typography variant="p" size="sm">
                  Reutilizable y mantenible siguiendo principios de composición
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentSpecs;
