import React from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import PreviewImage from '../atoms/PreviewImage';
import Card from '../molecules/Card';
import Brand from '../atoms/Brand';

export interface HeroSectionProps {
  onLogin?: () => void;
  onRegister?: () => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onLogin,
  onRegister,
  className = '',
  ...props
}) => {
  return (
    <div className={`py-20 px-6 ${className}`} {...props}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Typography variant="h1" className="text-5xl md:text-6xl leading-tight">
                Gestiona tus solicitudes de servicio de forma{' '}
                <span className="text-design-primary">inteligente</span>
              </Typography>
              
              <Typography variant="p" size="lg" color="muted" className="max-w-2xl">
                Nuestro sistema simplifica la gestión de solicitudes de servicio, 
                optimiza la comunicación entre equipos y mejora la eficiencia operativa 
                de tu organización.
              </Typography>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="ArrowRight"
                iconPosition="right"
                onClick={onRegister}
                className="px-8"
              >
                Comenzar Gratis
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="LogIn"
                iconPosition="left"
                onClick={onLogin}
                className="px-8"
              >
                Iniciar Sesión
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <Typography variant="h3" weight="bold" className="text-design-primary">
                  500+
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Empresas
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" weight="bold" className="text-design-primary">
                  10k+
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Solicitudes
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" weight="bold" className="text-design-primary">
                  99.9%
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Uptime
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <Card variant="vertical" title="" className="overflow-hidden">
              <PreviewImage
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                alt="Dashboard del sistema de gestión"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-success text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <Typography variant="p" size="sm" weight="medium">
                  Sistema Activo
                </Typography>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-design-primary text-primary-dark p-4 rounded-lg shadow-lg">
              <Typography variant="p" size="sm" weight="medium">
                +2,500 solicitudes este mes
              </Typography>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            variant="vertical"
            title="Gestión Simplificada"
            subtitle="Todo en un solo lugar"
            description="Centraliza todas las solicitudes de servicio en una plataforma fácil de usar."
            icon={{
              name: "LayoutDashboard",
              color: "primary"
            }}
            className="text-center"
          />
          
          <Card
            variant="vertical"
            title="Automatización Inteligente"
            subtitle="Flujos de trabajo optimizados"
            description="Automatiza procesos repetitivos y mejora la eficiencia de tu equipo."
            icon={{
              name: "Zap",
              color: "secondary"
            }}
            className="text-center"
          />
          
          <Card
            variant="vertical"
            title="Análisis en Tiempo Real"
            subtitle="Decisiones basadas en datos"
            description="Obtén insights valiosos con reportes y métricas en tiempo real."
            icon={{
              name: "BarChart3",
              color: "success"
            }}
            className="text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;