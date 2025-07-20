import React from 'react';
import Typography from '../../atoms/Typography';
import Sidebar from '../../organisms/Sidebar';

const SidebarDemo: React.FC = () => {
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
      <Typography variant="h4">Sidebar principal:</Typography>
      <div className="border border-border rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <Sidebar
          user={mockUser}
          currentRoute="dashboard"
          onNavigate={(route) => console.log('Navegar a:', route)}
        />
      </div>
    </div>
  );
};

export default SidebarDemo;