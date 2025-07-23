import React from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import PreviewImage from '../atoms/PreviewImage';
import Card from '../molecules/Card';
import Icon from '../atoms/Icon';

export interface HeroSectionMobileProps {
  onLogin?: () => void;
  onRegister?: () => void;
  className?: string;
}

const HeroSectionMobile: React.FC<HeroSectionMobileProps> = ({
  onLogin,
  onRegister,
  className = '',
  ...props
}) => {
  return (
    <div className={`py-8 px-4 ${className}`} {...props}>
      <div className="max-w-sm mx-auto space-y-8">
        {/* Hero Content */}
        <div className="text-center space-y-6">
          <Typography variant="h1" className="text-3xl leading-tight">
            Gestiona tus solicitudes de{' '}
            <span className="text-design-primary">forma inteligente</span>
          </Typography>
          
          <Typography variant="p" size="base" color="muted">
            Sistema simple y eficiente para gestionar solicitudes de servicio
            y optimizar la comunicación de tu equipo.
          </Typography>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <Card variant="vertical" title="" className="overflow-hidden">
            <PreviewImage
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
              alt="Dashboard del sistema"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </Card>

          {/* Floating Status */}
          <div className="absolute -top-2 -right-2 bg-success text-white p-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <Typography variant="p" size="xs" weight="medium">
                Activo
              </Typography>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            icon="ArrowRight"
            iconPosition="right"
            onClick={onRegister}
            className="w-full touch-manipulation"
          >
            Comenzar Gratis
          </Button>
          <Button
            variant="outline"
            size="md"
            icon="LogIn"
            iconPosition="left"
            onClick={onLogin}
            className="w-full touch-manipulation"
          >
            Iniciar Sesión
          </Button>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
          <div className="text-center">
            <Typography variant="h3" weight="bold" className="text-design-primary text-xl">
              500+
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Empresas
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" weight="bold" className="text-design-primary text-xl">
              10k+
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Solicitudes
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" weight="bold" className="text-design-primary text-xl">
              99.9%
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Uptime
            </Typography>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-4">
          <Typography variant="h3" weight="medium" className="text-center mb-6">
            Características Principales
          </Typography>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-10 h-10 bg-design-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="LayoutDashboard" size="md" color="primary" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="p" size="sm" weight="medium" className="mb-1">
                  Gestión Simplificada
                </Typography>
                <Typography variant="p" size="xs" color="muted">
                  Todo centralizado en una plataforma fácil de usar
                </Typography>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-10 h-10 bg-design-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size="md" color="secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="p" size="sm" weight="medium" className="mb-1">
                  Automatización Inteligente
                </Typography>
                <Typography variant="p" size="xs" color="muted">
                  Flujos optimizados para mejorar la eficiencia
                </Typography>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="BarChart3" size="md" color="success" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="p" size="sm" weight="medium" className="mb-1">
                  Análisis en Tiempo Real
                </Typography>
                <Typography variant="p" size="xs" color="muted">
                  Insights y métricas para decisiones informadas
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-6 border-t border-border">
          <Typography variant="p" size="sm" color="muted">
            ¿Listo para empezar?
          </Typography>
          <Button
            variant="primary"
            size="md"
            onClick={onRegister}
            className="w-full touch-manipulation"
          >
            Crear cuenta gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionMobile;