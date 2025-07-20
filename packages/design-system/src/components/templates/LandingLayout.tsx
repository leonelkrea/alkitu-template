import React from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Brand from '../atoms/Brand';

export interface LandingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`} {...props}>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo del header */}
          <Brand variant="horizontal" size="md" />
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="md">
              Características
            </Button>
            <Button variant="ghost" size="md">
              Precios
            </Button>
            <Button variant="outline" size="md">
              Iniciar Sesión
            </Button>
            <Button variant="primary" size="md">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              {/* Logo del footer */}
              <Brand variant="horizontal" size="sm" />
              <Typography variant="p" size="sm" color="muted">
                La solución completa para gestionar solicitudes de servicio y optimizar tu flujo de trabajo.
              </Typography>
            </div>
            
            <div className="space-y-4">
              <Typography variant="h4" weight="medium">
                Producto
              </Typography>
              <div className="space-y-2">
                <Typography variant="p" size="sm" color="muted">Características</Typography>
                <Typography variant="p" size="sm" color="muted">Precios</Typography>
                <Typography variant="p" size="sm" color="muted">API</Typography>
                <Typography variant="p" size="sm" color="muted">Documentación</Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              <Typography variant="h4" weight="medium">
                Soporte
              </Typography>
              <div className="space-y-2">
                <Typography variant="p" size="sm" color="muted">Centro de Ayuda</Typography>
                <Typography variant="p" size="sm" color="muted">Contacto</Typography>
                <Typography variant="p" size="sm" color="muted">Estado del Sistema</Typography>
                <Typography variant="p" size="sm" color="muted">Comunidad</Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              <Typography variant="h4" weight="medium">
                Legal
              </Typography>
              <div className="space-y-2">
                <Typography variant="p" size="sm" color="muted">Privacidad</Typography>
                <Typography variant="p" size="sm" color="muted">Términos</Typography>
                <Typography variant="p" size="sm" color="muted">Cookies</Typography>
                <Typography variant="p" size="sm" color="muted">Seguridad</Typography>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex items-center justify-between">
            <Typography variant="p" size="sm" color="muted">
              © 2024 Sistema de Gestión. Todos los derechos reservados.
            </Typography>
            <div className="flex items-center space-x-4">
              <Icon name="Twitter" size="sm" color="muted" />
              <Icon name="Github" size="sm" color="muted" />
              <Icon name="Linkedin" size="sm" color="muted" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;