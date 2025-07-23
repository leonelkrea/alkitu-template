import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para la configuración del branding
export interface BrandingConfig {
  customSvg?: string;
  customText: {
    primary: string;
    secondary: string;
  };
  textColors: {
    primary: string;
    secondary: string;
  };
  iconScale: number;
  iconOffsetX: number;
  iconOffsetY: number;
}

// Configuración por defecto
const defaultConfig: BrandingConfig = {
  customSvg: '',
  customText: {
    primary: 'WorkFlow',
    secondary: 'Pro'
  },
  textColors: {
    primary: '#4A4A4A', // --neutral-900
    secondary: '#A8A8A8' // --neutral-700
  },
  iconScale: 1,
  iconOffsetX: 0,
  iconOffsetY: 0
};

// Contexto
interface BrandingContextType {
  config: BrandingConfig;
  updateConfig: (newConfig: Partial<BrandingConfig>) => void;
  resetConfig: () => void;
  applyConfig: (config: BrandingConfig) => void;
  isCustomized: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Hook para usar el contexto
export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

// Clave para localStorage
const STORAGE_KEY = 'workflow-branding-config';

// Función para cargar configuración desde localStorage
const loadConfigFromStorage = (): BrandingConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultConfig,
        ...parsed,
        // Asegurar que textColors exista para compatibilidad con versiones anteriores
        textColors: parsed.textColors || defaultConfig.textColors
      };
    }
  } catch (error) {
    console.warn('Error loading branding config from localStorage:', error);
  }
  
  return defaultConfig;
};

// Función para guardar configuración en localStorage
const saveConfigToStorage = (config: BrandingConfig) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('Error saving branding config to localStorage:', error);
  }
};

// Función para verificar si la configuración está personalizada
const isConfigCustomized = (config: BrandingConfig): boolean => {
  return (
    !!config.customSvg ||
    config.customText.primary !== defaultConfig.customText.primary ||
    config.customText.secondary !== defaultConfig.customText.secondary ||
    config.textColors.primary !== defaultConfig.textColors.primary ||
    config.textColors.secondary !== defaultConfig.textColors.secondary ||
    config.iconScale !== defaultConfig.iconScale ||
    config.iconOffsetX !== defaultConfig.iconOffsetX ||
    config.iconOffsetY !== defaultConfig.iconOffsetY
  );
};

// Provider del contexto
interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<BrandingConfig>(defaultConfig);

  // Cargar configuración al inicializar
  useEffect(() => {
    const loadedConfig = loadConfigFromStorage();
    setConfig(loadedConfig);
  }, []);

  // Función para actualizar configuración (cambios en tiempo real)
  const updateConfig = (newConfig: Partial<BrandingConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      return updated;
    });
  };

  // Función para aplicar configuración (persistir cambios)
  const applyConfig = (newConfig: BrandingConfig) => {
    setConfig(newConfig);
    saveConfigToStorage(newConfig);
  };

  // Función para resetear configuración
  const resetConfig = () => {
    setConfig(defaultConfig);
    saveConfigToStorage(defaultConfig);
  };

  // Verificar si está personalizado
  const isCustomized = isConfigCustomized(config);

  const value: BrandingContextType = {
    config,
    updateConfig,
    resetConfig,
    applyConfig,
    isCustomized
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export default BrandingContext;