import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import IconButton from '../../molecules/IconButton';

const IconButtonDemo: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleAsyncAction = async () => {
    setIsLoading(true);
    // Simular acción async
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const commonIcons = [
    'Plus', 'Edit', 'Trash2', 'Download', 'Upload', 'Search', 'Filter', 
    'Settings', 'Bell', 'Heart', 'Star', 'Share', 'Copy', 'Eye', 'EyeOff',
    'Play', 'Pause', 'Square', 'SkipForward', 'SkipBack', 'Volume2', 'VolumeX'
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Tamaños */}
      <div className="space-y-6">
        <Typography variant="h3">Diferentes tamaños:</Typography>
        
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Small (sm)</Typography>
            <IconButton
              icon="Plus"
              size="sm"
              variant="primary"
              iconOnly
              tooltip="Agregar nuevo elemento"
              onClick={handleClick}
            />
          </div>
          
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Medium (md)</Typography>
            <IconButton
              icon="Edit"
              size="md"
              variant="secondary"
              iconOnly
              tooltip="Editar elemento"
              onClick={handleClick}
            />
          </div>
          
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Large (lg)</Typography>
            <IconButton
              icon="Settings"
              size="lg"
              variant="outline"
              iconOnly
              tooltip="Configuración"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>

      {/* Variantes */}
      <div className="space-y-6">
        <Typography variant="h3">Variantes de estilo:</Typography>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="text-center space-y-3">
            <Typography variant="p" size="sm" weight="medium">Primary</Typography>
            <IconButton
              icon="Zap"
              variant="primary"
              iconOnly
              tooltip="Acción primaria"
              onClick={handleClick}
            />
          </div>
          
          <div className="text-center space-y-3">
            <Typography variant="p" size="sm" weight="medium">Secondary</Typography>
            <IconButton
              icon="Star"
              variant="secondary"
              iconOnly
              tooltip="Acción secundaria"
              onClick={handleClick}
            />
          </div>
          
          <div className="text-center space-y-3">
            <Typography variant="p" size="sm" weight="medium">Outline</Typography>
            <IconButton
              icon="Heart"
              variant="outline"
              iconOnly
              tooltip="Me gusta"
              onClick={handleClick}
            />
          </div>
          
          <div className="text-center space-y-3">
            <Typography variant="p" size="sm" weight="medium">Ghost</Typography>
            <IconButton
              icon="Share"
              variant="ghost"
              iconOnly
              tooltip="Compartir"
              onClick={handleClick}
            />
          </div>
          
          <div className="text-center space-y-3">
            <Typography variant="p" size="sm" weight="medium">Destructive</Typography>
            <IconButton
              icon="Trash2"
              variant="destructive"
              iconOnly
              tooltip="Eliminar"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>

      {/* Con texto */}
      <div className="space-y-6">
        <Typography variant="h3">Con texto (iconOnly=false):</Typography>
        
        <div className="flex flex-wrap gap-4">
          <IconButton
            icon="Download"
            variant="primary"
            onClick={handleClick}
          >
            Descargar
          </IconButton>
          
          <IconButton
            icon="Upload"
            variant="secondary"
            onClick={handleClick}
          >
            Subir archivo
          </IconButton>
          
          <IconButton
            icon="Filter"
            variant="outline"
            onClick={handleClick}
          >
            Filtrar resultados
          </IconButton>
          
          <IconButton
            icon="Bell"
            variant="ghost"
            onClick={handleClick}
          >
            Notificaciones
          </IconButton>
        </div>
      </div>

      {/* Estados */}
      <div className="space-y-6">
        <Typography variant="h3">Estados:</Typography>
        
        <div className="flex items-center space-x-6">
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Normal</Typography>
            <IconButton
              icon="Play"
              variant="primary"
              iconOnly
              tooltip="Reproducir"
              onClick={handleClick}
            />
          </div>
          
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Disabled</Typography>
            <IconButton
              icon="Pause"
              variant="primary"
              iconOnly
              disabled
              tooltip="Pausar (deshabilitado)"
            />
          </div>
          
          <div className="space-y-2">
            <Typography variant="p" size="sm" weight="medium">Loading</Typography>
            <IconButton
              icon={isLoading ? "Loader2" : "RefreshCw"}
              variant="outline"
              iconOnly
              disabled={isLoading}
              tooltip={isLoading ? "Cargando..." : "Actualizar"}
              onClick={handleAsyncAction}
              className={isLoading ? "animate-spin" : ""}
            />
          </div>
        </div>
      </div>

      {/* Galería de iconos comunes */}
      <div className="space-y-6">
        <Typography variant="h3">Iconos comúnmente usados:</Typography>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-4">
          {commonIcons.map((iconName) => (
            <div key={iconName} className="flex flex-col items-center space-y-2">
              <IconButton
                icon={iconName}
                variant="outline"
                size="md"
                iconOnly
                tooltip={iconName === 'Square' ? 'Stop' : iconName}
                onClick={handleClick}
              />
              <Typography variant="p" size="xs" className="text-center">
                {iconName === 'Square' ? 'Stop' : iconName}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Casos de uso prácticos */}
      <div className="space-y-6">
        <Typography variant="h3">Casos de uso prácticos:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Toolbar */}
          <div className="space-y-4">
            <Typography variant="h4">Toolbar de acciones:</Typography>
            <div className="flex items-center space-x-2 p-3 bg-neutral-100 rounded-lg border">
              <IconButton icon="Bold" variant="ghost" size="sm" iconOnly tooltip="Negrita" />
              <IconButton icon="Italic" variant="ghost" size="sm" iconOnly tooltip="Cursiva" />
              <IconButton icon="Underline" variant="ghost" size="sm" iconOnly tooltip="Subrayado" />
              <div className="w-px h-6 bg-border mx-1"></div>
              <IconButton icon="AlignLeft" variant="ghost" size="sm" iconOnly tooltip="Alinear izquierda" />
              <IconButton icon="AlignCenter" variant="ghost" size="sm" iconOnly tooltip="Centrar" />
              <IconButton icon="AlignRight" variant="ghost" size="sm" iconOnly tooltip="Alinear derecha" />
              <div className="w-px h-6 bg-border mx-1"></div>
              <IconButton icon="Link" variant="ghost" size="sm" iconOnly tooltip="Insertar enlace" />
              <IconButton icon="Image" variant="ghost" size="sm" iconOnly tooltip="Insertar imagen" />
            </div>
          </div>

          {/* Controles de media */}
          <div className="space-y-4">
            <Typography variant="h4">Controles de reproducción:</Typography>
            <div className="flex items-center justify-center space-x-2 p-4 bg-neutral-100 rounded-lg border">
              <IconButton icon="SkipBack" variant="ghost" size="sm" iconOnly tooltip="Anterior" />
              <IconButton icon="Play" variant="primary" size="lg" iconOnly tooltip="Reproducir" />
              <IconButton icon="SkipForward" variant="ghost" size="sm" iconOnly tooltip="Siguiente" />
              <div className="w-px h-8 bg-border mx-2"></div>
              <IconButton icon="Volume2" variant="ghost" size="sm" iconOnly tooltip="Volumen" />
              <IconButton icon="Repeat" variant="ghost" size="sm" iconOnly tooltip="Repetir" />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas interactivas */}
      <div className="space-y-6">
        <Typography variant="h3">Contador interactivo:</Typography>
        
        <div className="bg-neutral-100 p-6 rounded-lg border max-w-md">
          <div className="text-center space-y-4">
            <Typography variant="p" size="lg">
              Clicks registrados: <span className="font-bold text-design-primary">{clickCount}</span>
            </Typography>
            
            <div className="flex items-center justify-center space-x-4">
              <IconButton
                icon="Minus"
                variant="outline"
                iconOnly
                tooltip="Decrementar"
                onClick={() => setClickCount(Math.max(0, clickCount - 1))}
                disabled={clickCount === 0}
              />
              
              <IconButton
                icon="RotateCcw"
                variant="ghost"
                iconOnly
                tooltip="Resetear contador"
                onClick={() => setClickCount(0)}
                disabled={clickCount === 0}
              />
              
              <IconButton
                icon="Plus"
                variant="primary"
                iconOnly
                tooltip="Incrementar"
                onClick={() => setClickCount(clickCount + 1)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guía de buenas prácticas */}
      <div className="space-y-6">
        <Typography variant="h3">Buenas prácticas:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              ✅ Recomendado
            </Typography>
            <Typography variant="p" size="sm" className="text-green-800">
              • Usa tooltips descriptivos<br/>
              • Iconos reconocibles universalmente<br/>
              • Tamaño apropiado para el contexto<br/>
              • Estados visual claros (hover, disabled)<br/>
              • Consistencia en toda la aplicación
            </Typography>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-red-900 mb-2">
              ❌ Evitar
            </Typography>
            <Typography variant="p" size="sm" className="text-red-800">
              • Iconos ambiguos o poco claros<br/>
              • Tamaños inconsistentes<br/>
              • Botones sin tooltips informativos<br/>
              • Demasiados botones en una fila<br/>
              • Iconos decorativos como botones
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconButtonDemo;