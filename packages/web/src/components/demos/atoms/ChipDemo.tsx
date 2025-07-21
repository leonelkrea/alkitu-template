import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Chip from '../../atoms/Chip';
import Button from '../../atoms/Button';

const ChipDemo: React.FC = () => {
  const [chips, setChips] = useState([
    { id: 1, label: 'React', variant: 'primary' as const },
    { id: 2, label: 'TypeScript', variant: 'secondary' as const },
    { id: 3, label: 'Tailwind', variant: 'success' as const },
    { id: 4, label: 'Node.js', variant: 'warning' as const },
  ]);

  const [selectedChips, setSelectedChips] = useState<number[]>([]);

  const removeChip = (id: number) => {
    setChips(chips.filter(chip => chip.id !== id));
  };

  const toggleChip = (id: number) => {
    setSelectedChips(prev => 
      prev.includes(id) 
        ? prev.filter(chipId => chipId !== id)
        : [...prev, id]
    );
  };

  const addRandomChip = () => {
    const technologies = ['Vue', 'Angular', 'Svelte', 'Next.js', 'Vite', 'Jest', 'Cypress'];
    const variants = ['primary', 'secondary', 'success', 'warning', 'error', 'neutral'] as const;
    
    const randomTech = technologies[Math.floor(Math.random() * technologies.length)];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    
    const newChip = {
      id: Math.max(...chips.map(c => c.id)) + 1,
      label: randomTech,
      variant: randomVariant
    };
    
    setChips([...chips, newChip]);
  };

  return (
    <div className="space-y-8 p-6">
      <Typography variant="h3">Chip Component</Typography>
      
      {/* Variantes */}
      <div className="space-y-4">
        <Typography variant="h4">Variantes</Typography>
        <div className="flex flex-wrap items-center gap-3">
          <Chip label="Default" variant="default" />
          <Chip label="Primary" variant="primary" />
          <Chip label="Secondary" variant="secondary" />
          <Chip label="Success" variant="success" />
          <Chip label="Warning" variant="warning" />
          <Chip label="Error" variant="error" />
          <Chip label="Neutral" variant="neutral" />
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-4">
        <Typography variant="h4">Tamaños</Typography>
        <div className="flex flex-wrap items-center gap-3">
          <Chip label="Extra Small" variant="primary" size="xs" />
          <Chip label="Small" variant="primary" size="sm" />
          <Chip label="Medium" variant="primary" size="md" />
          <Chip label="Large" variant="primary" size="lg" />
        </div>
      </div>

      {/* Con íconos */}
      <div className="space-y-4">
        <Typography variant="h4">Con Íconos</Typography>
        <div className="flex flex-wrap items-center gap-3">
          <Chip label="Home" variant="primary" icon="Home" />
          <Chip label="Settings" variant="secondary" icon="Settings" />
          <Chip label="Check" variant="success" icon="Check" />
          <Chip label="Alert" variant="warning" icon="AlertTriangle" />
          <Chip label="Error" variant="error" icon="X" />
        </div>
      </div>

      {/* Removibles */}
      <div className="space-y-4">
        <Typography variant="h4">Chips Removibles</Typography>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {chips.map(chip => (
            <Chip
              key={chip.id}
              label={chip.label}
              variant={chip.variant}
              removable
              onRemove={() => removeChip(chip.id)}
            />
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          icon="Plus"
          onClick={addRandomChip}
        >
          Añadir Chip
        </Button>
      </div>

      {/* Clickables */}
      <div className="space-y-4">
        <Typography variant="h4">Chips Clickeables</Typography>
        <Typography variant="p" size="sm" color="muted" className="mb-4">
          Haz clic en los chips para seleccionarlos
        </Typography>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, label: 'Frontend', variant: 'primary' },
            { id: 2, label: 'Backend', variant: 'secondary' },
            { id: 3, label: 'DevOps', variant: 'warning' },
            { id: 4, label: 'Design', variant: 'success' },
            { id: 5, label: 'Mobile', variant: 'neutral' }
          ].map(option => (
            <Chip
              key={option.id}
              label={option.label}
              variant={selectedChips.includes(option.id) ? option.variant as any : 'neutral'}
              clickable
              onClick={() => toggleChip(option.id)}
            />
          ))}
        </div>
        {selectedChips.length > 0 && (
          <Typography variant="p" size="sm" className="mt-2">
            Seleccionados: {selectedChips.join(', ')}
          </Typography>
        )}
      </div>

      {/* Estados */}
      <div className="space-y-4">
        <Typography variant="h4">Estados</Typography>
        <div className="flex flex-wrap items-center gap-3">
          <Chip label="Normal" variant="primary" />
          <Chip label="Disabled" variant="primary" disabled />
          <Chip label="Clickable" variant="success" clickable onClick={() => alert('Clicked!')} />
          <Chip label="Disabled Clickable" variant="success" clickable disabled />
        </div>
      </div>

      {/* Casos de uso */}
      <div className="space-y-4">
        <Typography variant="h4">Casos de Uso</Typography>
        
        <div className="space-y-6">
          {/* Tags de categorías */}
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Categorías de servicios:</Typography>
            <div className="flex flex-wrap gap-2">
              <Chip label="Limpieza" variant="primary" />
              <Chip label="Mantenimiento" variant="secondary" />
              <Chip label="Jardín" variant="success" />
              <Chip label="Emergencias" variant="error" />
            </div>
          </div>

          {/* Estado de solicitudes */}
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Estados de solicitudes:</Typography>
            <div className="flex flex-wrap gap-2">
              <Chip label="Pendiente" variant="warning" size="sm" />
              <Chip label="En Progreso" variant="primary" size="sm" />
              <Chip label="Completado" variant="success" size="sm" />
              <Chip label="Cancelado" variant="neutral" size="sm" />
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Filtros activos:</Typography>
            <div className="flex flex-wrap gap-2">
              <Chip label="Hogar" variant="neutral" removable onRemove={() => {}} />
              <Chip label="Urgente" variant="error" removable onRemove={() => {}} />
              <Chip label="Este mes" variant="primary" removable onRemove={() => {}} />
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="space-y-4">
        <Typography variant="h4">Características</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">✨ Funcionalidades:</Typography>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 7 variantes de color</li>
              <li>• 4 tamaños disponibles</li>
              <li>• Soporte para íconos</li>
              <li>• Chips removibles</li>
              <li>• Chips clickeables</li>
              <li>• Estados disabled</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">🎯 Casos de uso:</Typography>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Tags y etiquetas</li>
              <li>• Filtros activos</li>
              <li>• Estados de elementos</li>
              <li>• Categorización</li>
              <li>• Selección múltiple</li>
              <li>• Indicadores visuales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Props Interface */}
      <div className="space-y-4">
        <Typography variant="h4">Interface</Typography>
        <div className="bg-neutral-100 border border-border rounded-lg p-4">
          <pre className="text-sm text-foreground overflow-x-auto">
{`interface ChipProps {
  label?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  icon?: string;
  clickable?: boolean;
  className?: string;
  children?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ChipDemo;