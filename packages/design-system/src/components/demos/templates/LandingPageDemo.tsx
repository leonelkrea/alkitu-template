import React from 'react';
import Typography from '../../atoms/Typography';
import LandingPage from '../../templates/LandingPage';

const LandingPageDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Landing Page completa:</Typography>
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <LandingPage
            onLogin={() => console.log('Ir a login')}
            onRegister={() => console.log('Ir a registro')}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPageDemo;