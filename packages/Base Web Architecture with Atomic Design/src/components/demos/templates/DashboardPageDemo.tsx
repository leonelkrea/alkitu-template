import React from 'react';
import Typography from '../../atoms/Typography';
import DashboardPage from '../../templates/DashboardPage';

const DashboardPageDemo: React.FC = () => {
  const mockUser = {
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e5b7e9?w=100&h=100&fit=crop&crop=face",
    status: "online" as const,
    department: "Desarrollo",
    phone: "+34 123 456 789"
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Dashboard - Vista Cliente:</Typography>
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <DashboardPage
            userRole="client"
            user={mockUser}
            onNavigate={(route) => console.log('Navegar a:', route)}
          />
        </div>
      </div>
      <div className="space-y-6">
        <Typography variant="h4">Dashboard - Vista Admin:</Typography>
        <div className="border border-border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <DashboardPage
            userRole="admin"
            user={mockUser}
            onNavigate={(route) => console.log('Navegar a:', route)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPageDemo;