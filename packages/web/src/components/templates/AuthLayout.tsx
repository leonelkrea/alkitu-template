import React from 'react';
import Typography from '../atoms/Typography';
import Brand from '../atoms/Brand';

export interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`min-h-screen bg-background flex ${className}`} {...props}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-design-primary flex-col justify-center items-center p-12 relative">
        {/* Gradiente sutil para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-design-primary via-design-primary to-design-secondary"></div>

        <div className="max-w-md text-center relative z-10">
          {/* Logo principal para desktop - Versión vertical, color white, tamaño grande */}
          <div className="mb-12">
            <Brand variant="vertical" size="xl" color="white" />
          </div>

          <Typography
            variant="p"
            size="lg"
            className="text-white/90 mb-12 leading-relaxed"
          >
            La solución completa para gestionar solicitudes de servicio y
            optimizar tu flujo de trabajo
          </Typography>

          {/* Características con iconos */}
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <Typography variant="p" className="text-white">
                Gestión simplificada de solicitudes
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <Typography variant="p" className="text-white">
                Automatización de flujos de trabajo
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <Typography variant="p" className="text-white">
                Análisis y reportes en tiempo real
              </Typography>
            </div>
          </div>
        </div>

        {/* Decoración de fondo sutil */}
        <div className="absolute bottom-8 right-8 opacity-10">
          <Brand variant="icon" size="xl" color="white" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Versión horizontal para pantallas pequeñas */}
          <div className="flex items-center justify-center mb-12 lg:hidden">
            <Brand variant="vertical" size="lg" />
          </div>

          {/* Contenido principal */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Typography variant="p" size="sm" color="muted">
            © 2024 Sistema de Gestión. Todos los derechos reservados.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
