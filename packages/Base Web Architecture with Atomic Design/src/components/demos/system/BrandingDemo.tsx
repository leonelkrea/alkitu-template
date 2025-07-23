import React, { useState, useRef } from 'react';
import Typography from '../../atoms/Typography';
import Brand from '../../atoms/Brand';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import { useBranding } from '../../../contexts/BrandingContext';

const BrandingDemo: React.FC = () => {
  const { config, updateConfig, applyConfig, resetConfig, isCustomized } = useBranding();
  
  // Estado local para cambios en tiempo real (preview)
  const [previewConfig, setPreviewConfig] = useState(config);
  const [previewMode, setPreviewMode] = useState<'default' | 'custom'>('default');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar previewConfig con el config global cuando cambie
  React.useEffect(() => {
    setPreviewConfig(config);
  }, [config]);

  // Función para obtener dimensiones de contenedor
  const getContainerSize = (size: string) => {
    const sizeMap = {
      'sm': 'w-10 h-10',
      'md': 'w-16 h-16',
      'lg': 'w-20 h-20',
      'xl': 'w-24 h-24'
    };
    return sizeMap[size as keyof typeof sizeMap] || 'w-16 h-16';
  };

  // Colores predefinidos para selección rápida
  const predefinedColors = [
    { name: 'Negro', value: '#000000' },
    { name: 'Gris Oscuro', value: '#4A4A4A' },
    { name: 'Gris', value: '#767676' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Primario', value: '#F2AB27' },
    { name: 'Secundario', value: '#F2921D' },
  ];

  // Manejar carga de archivo SVG
  const handleFileUpload = (file: File) => {
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        // Extraer solo el contenido interno del SVG (sin la etiqueta <svg>)
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // Obtener el innerHTML del SVG
          const svgInner = svgElement.innerHTML;
          const newConfig = { ...previewConfig, customSvg: svgInner };
          setPreviewConfig(newConfig);
          setPreviewMode('custom');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Por favor, selecciona un archivo SVG válido.');
    }
  };

  // Manejar drop de archivo
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Resetear a valores por defecto
  const resetToDefault = () => {
    resetConfig();
    setPreviewConfig({
      customSvg: '',
      customText: { primary: 'WorkFlow', secondary: 'Pro' },
      textColors: { primary: '#4A4A4A', secondary: '#A8A8A8' },
      iconScale: 1,
      iconOffsetX: 0,
      iconOffsetY: 0
    });
    setPreviewMode('default');
    setShowSuccessMessage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Resetear solo posición
  const resetPosition = () => {
    const newConfig = { ...previewConfig, iconOffsetX: 0, iconOffsetY: 0 };
    setPreviewConfig(newConfig);
  };

  // Aplicar cambios con feedback visual
  const applyChanges = async () => {
    setIsApplying(true);
    
    // Simular proceso de aplicación
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Aplicar cambios globalmente
    applyConfig(previewConfig);
    setPreviewMode('custom');
    setIsApplying(false);
    setShowSuccessMessage(true);
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Actualizar configuración en tiempo real
  const updatePreviewConfig = (updates: Partial<typeof previewConfig>) => {
    const newConfig = { ...previewConfig, ...updates };
    setPreviewConfig(newConfig);
  };

  // Props para el componente Brand en preview
  const brandProps = previewMode === 'custom' ? {
    customSvg: previewConfig.customSvg || undefined,
    customText: previewConfig.customText,
    textColors: previewConfig.textColors,
    iconScale: previewConfig.iconScale,
    iconOffsetX: previewConfig.iconOffsetX,
    iconOffsetY: previewConfig.iconOffsetY
  } : {};

  // Verificar si hay cambios pendientes (comparar preview con config aplicado)
  const hasChanges = JSON.stringify(previewConfig) !== JSON.stringify(config);

  return (
    <div className="space-y-12">
      {/* Información del sistema de branding */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h3">Sistema de Branding Global</Typography>
          <div className="flex items-center space-x-2">
            <Icon name="Palette" size="sm" className="text-design-primary" />
            <Typography variant="p" size="sm" color="muted">
              Identidad Visual Personalizada
            </Typography>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size="sm" className="text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <Typography variant="p" weight="medium" className="text-blue-900">
                Sistema de Branding Sincronizado
              </Typography>
              <Typography variant="p" size="sm" className="text-blue-800">
                Los cambios que apliques aquí se reflejarán automáticamente en TODOS los templates 
                y componentes del sistema. Esto incluye páginas de login, dashboard, sidebar, 
                headers, footers y cualquier otro lugar donde aparezca el branding.
              </Typography>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Icon name="CheckCircle" size="sm" className="text-green-600" />
              </div>
              <div>
                <Typography variant="p" weight="medium" className="text-green-900">
                  ¡Branding aplicado globalmente!
                </Typography>
                <Typography variant="p" size="sm" className="text-green-800">
                  Los cambios ahora se muestran en todos los templates y componentes del sistema.
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Estado actual del branding */}
        <div className="bg-neutral-50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Settings" size="sm" className="text-muted-foreground" />
              <div>
                <Typography variant="p" size="sm" weight="medium">
                  Estado del Branding Global
                </Typography>
                <Typography variant="p" size="xs" color="muted">
                  {isCustomized ? 'Branding personalizado activo' : 'Usando branding por defecto'}
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isCustomized ? 'bg-design-primary' : 'bg-muted-foreground'}`}></div>
              <Typography variant="p" size="xs" color="muted">
                {isCustomized ? 'Personalizado' : 'Por defecto'}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de personalización */}
      <div className="space-y-6">
        <Typography variant="h3">Personalizar Branding</Typography>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de configuración */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h4">Configuración</Typography>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewMode === 'default' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('default')}
                  >
                    Por defecto
                  </Button>
                  <Button
                    variant={previewMode === 'custom' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('custom')}
                    disabled={!previewConfig.customSvg && !previewConfig.customText.primary}
                  >
                    Vista previa
                  </Button>
                </div>
              </div>

              {/* Upload de SVG */}
              <div className="space-y-4">
                <Typography variant="p" weight="medium">Icono del Logo (SVG)</Typography>
                
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${isDragOver ? 'border-design-primary bg-design-primary/5' : 'border-border hover:border-design-primary/50'}
                  `}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  {previewConfig.customSvg ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-design-primary/10 rounded-lg flex items-center justify-center overflow-visible">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 48 48"
                          style={{ overflow: 'visible' }}
                          dangerouslySetInnerHTML={{ __html: previewConfig.customSvg }}
                        />
                      </div>
                      <Typography variant="p" size="sm" color="success">
                        SVG cargado correctamente
                      </Typography>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Cambiar SVG
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Icon name="Upload" size="lg" className="mx-auto text-muted-foreground" />
                      <div>
                        <Typography variant="p" size="sm" weight="medium">
                          Arrastra tu SVG aquí o haz clic para seleccionar
                        </Typography>
                        <Typography variant="p" size="xs" color="muted" className="mt-1">
                          Solo archivos .svg
                        </Typography>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Seleccionar archivo
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Controles de tamaño y posición del icono */}
                {previewConfig.customSvg && (
                  <div className="space-y-4 bg-neutral-50 border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Typography variant="p" size="sm" weight="medium">
                        Ajustes del Icono
                      </Typography>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetPosition}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        Centrar
                      </Button>
                    </div>
                    
                    {/* Control de escala */}
                    <div className="space-y-3">
                      <Typography variant="p" size="sm" weight="medium">
                        Tamaño
                      </Typography>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Typography variant="p" size="xs" color="muted" className="w-12">
                            Pequeño
                          </Typography>
                          <input
                            type="range"
                            min="0.3"
                            max="1.5"
                            step="0.1"
                            value={previewConfig.iconScale}
                            onChange={(e) => updatePreviewConfig({ iconScale: parseFloat(e.target.value) })}
                            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <Typography variant="p" size="xs" color="muted" className="w-12 text-right">
                            Grande
                          </Typography>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Typography variant="p" size="xs" color="muted">
                            Escala: {Math.round(previewConfig.iconScale * 100)}%
                          </Typography>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePreviewConfig({ iconScale: 1 })}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            100%
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Control de posición horizontal */}
                    <div className="space-y-3">
                      <Typography variant="p" size="sm" weight="medium">
                        Posición Horizontal
                      </Typography>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Typography variant="p" size="xs" color="muted" className="w-12">
                            Izquierda
                          </Typography>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={previewConfig.iconOffsetX}
                            onChange={(e) => updatePreviewConfig({ iconOffsetX: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <Typography variant="p" size="xs" color="muted" className="w-12 text-right">
                            Derecha
                          </Typography>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <Typography variant="p" size="xs" color="muted">
                            Offset X: {previewConfig.iconOffsetX}px
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Control de posición vertical */}
                    <div className="space-y-3">
                      <Typography variant="p" size="sm" weight="medium">
                        Posición Vertical
                      </Typography>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Typography variant="p" size="xs" color="muted" className="w-12">
                            Arriba
                          </Typography>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={previewConfig.iconOffsetY}
                            onChange={(e) => updatePreviewConfig({ iconOffsetY: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <Typography variant="p" size="xs" color="muted" className="w-12 text-right">
                            Abajo
                          </Typography>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <Typography variant="p" size="xs" color="muted">
                            Offset Y: {previewConfig.iconOffsetY}px
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Preview del icono con guías */}
                    <div className="flex items-center justify-center p-4 bg-white border border-border rounded relative overflow-visible">
                      {/* Guías de posición */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 border-2 border-dashed border-neutral-300 rounded flex items-center justify-center">
                          {/* Líneas de guía */}
                          <div className="absolute w-px h-12 bg-neutral-200 left-1/2 transform -translate-x-px"></div>
                          <div className="absolute h-px w-12 bg-neutral-200 top-1/2 transform -translate-y-px"></div>
                        </div>
                      </div>
                      
                      {/* Icono */}
                      <div className="relative z-10">
                        <Brand variant="icon" size="md" {...brandProps} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Texto del logo */}
              <div className="space-y-4">
                <Typography variant="p" weight="medium">Texto del Logo</Typography>
                
                <FormField
                  label="Texto principal"
                  value={previewConfig.customText.primary}
                  onChange={(e) => updatePreviewConfig({ 
                    customText: { ...previewConfig.customText, primary: e.target.value }
                  })}
                  placeholder="Ej: Mi Empresa"
                />
                
                <FormField
                  label="Texto secundario (opcional)"
                  value={previewConfig.customText.secondary || ''}
                  onChange={(e) => updatePreviewConfig({ 
                    customText: { ...previewConfig.customText, secondary: e.target.value }
                  })}
                  placeholder="Ej: Pro, Studio, Solutions..."
                />
              </div>

              {/* Colores del texto */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Typography variant="p" weight="medium">Colores del Texto</Typography>
                  <Icon name="Info" size="sm" className="text-muted-foreground" />
                  <Typography variant="p" size="xs" color="muted">
                    Solo afecta al tema claro
                  </Typography>
                </div>
                
                {/* Color del texto principal */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">
                    Color del texto principal
                  </Typography>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={previewConfig.textColors.primary}
                      onChange={(e) => updatePreviewConfig({
                        textColors: { ...previewConfig.textColors, primary: e.target.value }
                      })}
                      className="w-12 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewConfig.textColors.primary}
                      onChange={(e) => updatePreviewConfig({
                        textColors: { ...previewConfig.textColors, primary: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-border rounded-md text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                  
                  {/* Colores predefinidos para texto principal */}
                  <div className="grid grid-cols-5 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={`primary-${color.name}`}
                        onClick={() => updatePreviewConfig({
                          textColors: { ...previewConfig.textColors, primary: color.value }
                        })}
                        className={`
                          w-full h-8 rounded border-2 transition-all
                          ${previewConfig.textColors.primary === color.value ? 'border-design-primary' : 'border-neutral-300 hover:border-neutral-400'}
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Color del texto secundario */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">
                    Color del texto secundario
                  </Typography>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={previewConfig.textColors.secondary}
                      onChange={(e) => updatePreviewConfig({
                        textColors: { ...previewConfig.textColors, secondary: e.target.value }
                      })}
                      className="w-12 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewConfig.textColors.secondary}
                      onChange={(e) => updatePreviewConfig({
                        textColors: { ...previewConfig.textColors, secondary: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-border rounded-md text-sm font-mono"
                      placeholder="#666666"
                    />
                  </div>
                  
                  {/* Colores predefinidos para texto secundario */}
                  <div className="grid grid-cols-5 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={`secondary-${color.name}`}
                        onClick={() => updatePreviewConfig({
                          textColors: { ...previewConfig.textColors, secondary: color.value }
                        })}
                        className={`
                          w-full h-8 rounded border-2 transition-all
                          ${previewConfig.textColors.secondary === color.value ? 'border-design-primary' : 'border-neutral-300 hover:border-neutral-400'}
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Nota sobre tema oscuro */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Sun" size="sm" className="text-yellow-600 mt-0.5" />
                    <div>
                      <Typography variant="p" size="sm" className="text-yellow-800">
                        <strong>Nota:</strong> Los colores personalizados solo se aplican al tema claro. 
                        En el tema oscuro, el texto se adaptará automáticamente para mantener la legibilidad.
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={resetToDefault}
                  className="flex-1"
                  disabled={!isCustomized && !hasChanges}
                >
                  Restaurar por defecto
                </Button>
                <Button
                  variant="primary"
                  onClick={applyChanges}
                  className="flex-1"
                  disabled={!hasChanges}
                  loading={isApplying}
                  icon={showSuccessMessage ? "Check" : undefined}
                >
                  {isApplying ? 'Aplicando...' : showSuccessMessage ? 'Aplicado' : 'Aplicar cambios'}
                </Button>
              </div>

              {/* Indicador de estado */}
              {hasChanges && !showSuccessMessage && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size="sm" className="text-yellow-600" />
                    <Typography variant="p" size="sm" className="text-yellow-800">
                      Tienes cambios sin aplicar. Los cambios se aplicarán globalmente al confirmar.
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de vista previa */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h4">Vista Previa</Typography>
                {previewMode === 'custom' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Typography variant="p" size="sm" color="success">
                      Personalizado
                    </Typography>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Variante horizontal */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">Horizontal (Header)</Typography>
                  <div className="bg-neutral-100 border border-border rounded-lg p-4 flex items-center justify-center overflow-visible">
                    <Brand variant="horizontal" size="md" {...brandProps} />
                  </div>
                </div>

                {/* Variante vertical */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">Vertical (Login)</Typography>
                  <div className="bg-neutral-100 border border-border rounded-lg p-6 flex items-center justify-center overflow-visible">
                    <Brand variant="vertical" size="lg" {...brandProps} />
                  </div>
                </div>

                {/* Solo icono */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">Solo Icono (Sidebar)</Typography>
                  <div className="bg-neutral-100 border border-border rounded-lg p-4 flex items-center justify-center overflow-visible">
                    <Brand variant="icon" size="lg" {...brandProps} />
                  </div>
                </div>

                {/* En contexto oscuro */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">Tema Oscuro (Footer)</Typography>
                  <div className="bg-neutral-800 border border-border rounded-lg p-4 flex items-center justify-center overflow-visible">
                    <Brand variant="horizontal" size="sm" color="white" {...brandProps} />
                  </div>
                </div>

                {/* Vista de colores personalizados */}
                <div className="space-y-3">
                  <Typography variant="p" size="sm" weight="medium">Colores Personalizados</Typography>
                  <div className="bg-white border border-border rounded-lg p-4 space-y-3 overflow-visible">
                    <div className="flex items-center justify-center">
                      <Brand variant="horizontal" size="md" {...brandProps} />
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded border border-neutral-300" 
                          style={{ backgroundColor: previewConfig.textColors.primary }}
                        ></div>
                        <span>Primario</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded border border-neutral-300" 
                          style={{ backgroundColor: previewConfig.textColors.secondary }}
                        ></div>
                        <span>Secundario</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de templates afectados */}
      <div className="space-y-6">
        <Typography variant="h3">Templates Que Se Actualizarán</Typography>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="RefreshCw" size="sm" className="text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <Typography variant="p" weight="medium" className="text-blue-900">
                Sincronización Automática
              </Typography>
              <Typography variant="p" size="sm" className="text-blue-800">
                Al aplicar los cambios, el branding se actualizará automáticamente en:
              </Typography>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Typography variant="p" size="sm" weight="medium" className="text-blue-900">
                Páginas de Autenticación:
              </Typography>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Página de Login</li>
                <li>• Página de Registro</li>
                <li>• Recuperación de Contraseña</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Typography variant="p" size="sm" weight="medium" className="text-blue-900">
                Componentes de Sistema:
              </Typography>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Sidebar/Navegación</li>
                <li>• Headers principales</li>
                <li>• Footers</li>
                <li>• Landing Page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Resto del contenido existente... */}
      <div className="space-y-6">
        <Typography variant="h3">Implementación</Typography>
        
        <div className="bg-neutral-900 text-neutral-100 p-6 rounded-lg overflow-x-auto">
          <div className="space-y-4">
            <div className="text-neutral-400 text-sm">// El branding ahora es global y automático</div>
            <div><span className="text-green-400">import</span> Brand <span className="text-green-400">from</span> <span className="text-yellow-400">'./src/components/atoms/Brand'</span>;</div>
            
            <div className="mt-6 text-neutral-400 text-sm">// Uso simple - usa automáticamente la configuración global</div>
            <div>&lt;<span className="text-blue-400">Brand</span> <span className="text-purple-400">variant</span>=<span className="text-yellow-400">"horizontal"</span> <span className="text-purple-400">size</span>=<span className="text-yellow-400">"lg"</span> /&gt;</div>
            
            <div className="mt-6 text-neutral-400 text-sm">// Los cambios aplicados aquí se reflejan automáticamente</div>
            <div className="text-neutral-400 text-sm">// en TODOS los templates y componentes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingDemo;