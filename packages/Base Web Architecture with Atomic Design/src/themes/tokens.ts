export const colors = {
  // Paleta principal
  primaryDark:   "#403925",   // tierra oscura
  primary:       "#F2AB27",   // amarillo medio
  secondary:     "#F2921D",   // naranja vibrante
  accentLight:   "#F2C288",   // melocotón claro
  accentPale:    "#F2E0AD",   // amarillo muy suave

  // Neutros muy claros
  neutral: {
    100: "#FFFFFF",  
    200: "#F9F9F9",
    300: "#F2F2F2",
    400: "#EBEBEB",
    500: "#E0E0E0",
    600: "#C8C8C8",
    700: "#A8A8A8",
    800: "#767676",
    900: "#4A4A4A",
  },

  // Colores "semáforo" para notificaciones
  notification: {
    success: "#2F9E44",  
    warning: "#F2AB27",  
    error:   "#D92D20",
  }
};

export const typography = {
  fontFamily: "'Inter', sans-serif",
  fontSizes: { 
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    md: "1rem",       // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem" // 30px
  },
  fontWeights: { 
    regular: 400, 
    medium: 500, 
    bold: 700 
  },
  lineHeights: { 
    normal: 1.5, 
    dense: 1.2 
  },
};

export const spacing = { 
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  "2xl": 48 // 48px
};

export const radii = { 
  none: 0, 
  sm: 2, 
  md: 4, 
  lg: 8, 
  full: 9999 
};

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.1)",
  lg: "0 10px 15px rgba(0,0,0,0.1)",
};

// Branding tokens
export const branding = {
  // Logo principal del sistema
  logo: {
    primaryColor: "#F2AB27",    // Amarillo principal del logo
    secondaryColor: "#F2921D",  // Naranja del texto "Pro"
    accentColor: "#403925",     // Color del icono del rayo
    
    // Variantes de color para diferentes contextos
    colors: {
      default: {
        primary: "#F2AB27",
        secondary: "#F2921D", 
        accent: "#403925",
        text: "#403925"
      },
      white: {
        primary: "#FFFFFF",
        secondary: "#F5F5F5",
        accent: "#E0E0E0", 
        text: "#FFFFFF"
      },
      monochrome: {
        primary: "#4A4A4A",
        secondary: "#767676",
        accent: "#A8A8A8",
        text: "#4A4A4A"
      }
    },
    
    // Dimensiones por tamaños
    sizes: {
      sm: {
        horizontal: { width: "120px", height: "40px" },
        vertical: { width: "80px", height: "80px" },
        icon: { width: "32px", height: "32px" }
      },
      md: {
        horizontal: { width: "160px", height: "54px" },
        vertical: { width: "120px", height: "120px" },
        icon: { width: "48px", height: "48px" }
      },
      lg: {
        horizontal: { width: "200px", height: "68px" },
        vertical: { width: "160px", height: "160px" },
        icon: { width: "64px", height: "64px" }
      },
      xl: {
        horizontal: { width: "240px", height: "80px" },
        vertical: { width: "200px", height: "200px" },
        icon: { width: "80px", height: "80px" }
      }
    }
  },
  
  // Información de la marca
  brand: {
    name: "WorkFlow Pro",
    tagline: "Design System",
    description: "Sistema de gestión empresarial integral"
  }
};

// Export individual token groups for easy access
export { colors as designColors };
export { typography as designTypography };
export { spacing as designSpacing };
export { radii as designRadii };
export { shadows as designShadows };
export { branding as designBranding };

// Export everything as a design system object
export const designSystem = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  branding,
};