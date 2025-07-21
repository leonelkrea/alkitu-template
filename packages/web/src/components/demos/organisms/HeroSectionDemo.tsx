import React from 'react';
import Typography from '../../atoms/Typography';
import HeroSection from '../../organisms/HeroSection';
import HeroSectionMobile from '../../organisms/HeroSectionMobile';
import { useIsMobile } from '../../ui/use-mobile';

const HeroSectionDemo: React.FC = () => {
  const isMobile = useIsMobile();

  const handleLogin = () => {
    console.log('Iniciar sesión');
    alert('Navegando a página de login');
  };

  const handleRegister = () => {
    console.log('Registrarse');
    alert('Navegando a página de registro');
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Typography variant="h4">Sección Hero</Typography>
        <Typography
          variant="p"
          size="sm"
          color="muted"
          className="hidden md:block"
        >
          Hero section con versiones optimizadas para cada dispositivo
        </Typography>
        <Typography variant="p" size="sm" color="muted" className="md:hidden">
          Versión móvil con layout vertical y navegación optimizada
        </Typography>
      </div>

      {/* Demostración del componente */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border">
          <Typography variant="p" size="sm" weight="medium">
            {isMobile ? '📱 Versión Móvil' : '🖥️ Versión Desktop'} - Componente:{' '}
            {isMobile ? 'HeroSectionMobile' : 'HeroSection'}
          </Typography>
        </div>

        <div className="bg-background">
          {isMobile ? (
            <HeroSectionMobile
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          ) : (
            <HeroSection onLogin={handleLogin} onRegister={handleRegister} />
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <Typography variant="p" size="sm" weight="medium">
          🎯 Optimizaciones por dispositivo:
        </Typography>
        <ul className="space-y-1 pl-4">
          <li className="text-sm text-muted-foreground">
            • 📱 Móvil: Layout vertical, CTA prominentes, features compactos
          </li>
          <li className="text-sm text-muted-foreground">
            • 🖥️ Desktop: Layout dos columnas, elementos flotantes, grid amplio
          </li>
          <li className="text-sm text-muted-foreground">
            • 🎨 Imágenes y contenido adaptados al contexto de uso
          </li>
          <li className="text-sm text-muted-foreground">
            • 📊 Social proof optimizado para cada pantalla
          </li>
          <li className="text-sm text-muted-foreground">
            • 🔄 Detección automática con useIsMobile()
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeroSectionDemo;
