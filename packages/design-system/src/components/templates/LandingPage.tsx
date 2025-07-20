import React from 'react';
import LandingLayout from './LandingLayout';
import HeroSection from '../organisms/HeroSection';

export interface LandingPageProps {
  onLogin?: () => void;
  onRegister?: () => void;
  className?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
  className = '',
  ...props
}) => {
  return (
    <LandingLayout className={className} {...props}>
      <HeroSection
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </LandingLayout>
  );
};

export default LandingPage;