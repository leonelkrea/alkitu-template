'use client';
import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { Home, User, Settings, HelpCircle, FileText } from 'lucide-react';
import { AppSidebar } from '../app-sidebar';
import Header from '../layout/header';

// Navigation structure for regular users
const transformedData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      items: [],
    },
    {
      title: 'Mi Perfil',
      url: '/profile',
      icon: User,
      items: [],
    },
    {
      title: 'Configuración',
      url: '/settings',
      icon: Settings,
      items: [
        { title: 'Cuenta', url: '/settings/account' },
        { title: 'Privacidad', url: '/settings/privacy' },
      ],
    },
    {
      title: 'Documentación',
      url: '/docs',
      icon: FileText,
      items: [],
    },
    {
      title: 'Ayuda',
      url: '/help',
      icon: HelpCircle,
      items: [],
    },
  ],
  projects: [],
  user: {
    id: 'user-1',
    name: 'Usuario',
    email: 'user@example.com',
    avatar: '/avatars/default.jpg',
  },
  teams: [],
};

interface UserDashboardProps {
  children?: React.ReactNode;
}

function UserDashboard({ children }: UserDashboardProps) {
  return (
    <SidebarProvider>
      <AppSidebar {...transformedData} />

      <SidebarInset>
        <div className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <div className="w-full col-start-1 col-end-full ">
            <Header
              type="user"
              homeLabel="Dashboard"
              dropdownSliceEnd={-1}
              separator
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserDashboard;
