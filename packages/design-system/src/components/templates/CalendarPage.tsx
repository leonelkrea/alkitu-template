import React from 'react';
import Typography from '../atoms/Typography';
import MainLayout from './MainLayout';
import CalendarView from '../organisms/CalendarView';

export interface CalendarPageProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  onNavigate?: (route: string) => void;
  className?: string;
}

const CalendarPage: React.FC<CalendarPageProps> = ({
  user,
  onNavigate,
  className = '',
  ...props
}) => {
  const mockEvents = [
    {
      id: 'evt-001',
      title: 'Mantenimiento HVAC - Oficina 201',
      description: 'Revisión programada del sistema de climatización',
      startTime: '2024-06-15T10:00:00Z',
      endTime: '2024-06-15T12:00:00Z',
      type: 'maintenance' as const,
      participants: ['María López', 'Juan Pérez']
    },
    {
      id: 'evt-002',
      title: 'Instalación Equipos IT',
      description: 'Configuración de nuevos equipos en desarrollo',
      startTime: '2024-06-16T14:00:00Z',
      endTime: '2024-06-16T17:00:00Z',
      type: 'meeting' as const,
      participants: ['Carlos Ruiz', 'Ana García']
    },
    {
      id: 'evt-003',
      title: 'Entrega Proyecto Web',
      description: 'Fecha límite para la entrega del proyecto',
      startTime: '2024-06-20T17:00:00Z',
      endTime: '2024-06-20T17:00:00Z',
      type: 'deadline' as const
    },
    {
      id: 'evt-004',
      title: 'Capacitación Sistema',
      description: 'Entrenamiento en nuevas funcionalidades',
      startTime: '2024-06-18T09:00:00Z',
      endTime: '2024-06-18T11:00:00Z',
      type: 'training' as const,
      participants: ['Todo el equipo']
    },
    {
      id: 'evt-005',
      title: 'Reunión Semanal',
      description: 'Revisión de avances y planificación',
      startTime: '2024-06-17T15:00:00Z',
      endTime: '2024-06-17T16:00:00Z',
      type: 'meeting' as const,
      participants: ['Equipo de gestión']
    }
  ];

  const handleEventClick = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (event && onNavigate) {
      // Si el evento está relacionado con una solicitud, navegar al detalle
      if (event.title.includes('Mantenimiento') || event.title.includes('Instalación')) {
        onNavigate('/app/requests');
      } else {
        console.log('Click en evento:', eventId);
      }
    }
  };

  const handleDateChange = (date: Date) => {
    console.log('Cambiar fecha del calendario:', date);
  };

  const handleCreateEvent = () => {
    console.log('Crear nuevo evento');
    if (onNavigate) {
      onNavigate('/app/requests/new');
    }
  };

  return (
    <MainLayout
      user={user}
      currentRoute="calendar"
      onNavigate={onNavigate}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        <div>
          <Typography variant="h1" weight="bold" className="mb-2">
            Calendario
          </Typography>
          <Typography variant="p" color="muted">
            Visualiza solicitudes programadas y eventos del sistema
          </Typography>
        </div>

        <CalendarView
          events={mockEvents}
          currentDate={new Date()}
          onEventClick={handleEventClick}
          onDateChange={handleDateChange}
          onCreateEvent={handleCreateEvent}
        />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;