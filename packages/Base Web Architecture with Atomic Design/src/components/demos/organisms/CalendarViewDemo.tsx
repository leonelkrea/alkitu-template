import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import CalendarView, { CalendarEvent } from '../../organisms/CalendarView';

const CalendarViewDemo: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Eventos de ejemplo con datos más completos
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Reunión de equipo',
      description: 'Revisión semanal del progreso del proyecto',
      startTime: new Date(2024, 11, 15, 9, 0).toISOString(),
      endTime: new Date(2024, 11, 15, 10, 30).toISOString(),
      type: 'meeting',
      participants: ['Ana García', 'Carlos López', 'María Rodríguez']
    },
    {
      id: '2',
      title: 'Entrega de propuesta',
      description: 'Fecha límite para enviar la propuesta del cliente ABC',
      startTime: new Date(2024, 11, 15, 17, 0).toISOString(),
      endTime: new Date(2024, 11, 15, 17, 30).toISOString(),
      type: 'deadline',
      participants: ['David Chen']
    },
    {
      id: '3',
      title: 'Mantenimiento del servidor',
      description: 'Actualización de seguridad programada',
      startTime: new Date(2024, 11, 16, 2, 0).toISOString(),
      endTime: new Date(2024, 11, 16, 4, 0).toISOString(),
      type: 'maintenance',
      participants: ['Equipo IT']
    },
    {
      id: '4',
      title: 'Capacitación en nuevas herramientas',
      description: 'Workshop sobre el nuevo sistema de gestión',
      startTime: new Date(2024, 11, 17, 14, 0).toISOString(),
      endTime: new Date(2024, 11, 17, 16, 0).toISOString(),
      type: 'training',
      participants: ['Todo el equipo']
    },
    {
      id: '5',
      title: 'Presentación a clientes',
      description: 'Demo del producto final',
      startTime: new Date(2024, 11, 18, 11, 0).toISOString(),
      endTime: new Date(2024, 11, 18, 12, 0).toISOString(),
      type: 'meeting',
      participants: ['Equipo comercial', 'Cliente XYZ']
    },
    {
      id: '6',
      title: 'Review de código',
      description: 'Revisión de la implementación del módulo de autenticación',
      startTime: new Date(2024, 11, 18, 15, 30).toISOString(),
      endTime: new Date(2024, 11, 18, 16, 30).toISOString(),
      type: 'meeting',
      participants: ['Desarrolladores senior']
    },
    {
      id: '7',
      title: 'Backup semanal',
      description: 'Respaldo automático de base de datos',
      startTime: new Date(2024, 11, 19, 23, 0).toISOString(),
      endTime: new Date(2024, 11, 19, 23, 59).toISOString(),
      type: 'maintenance',
      participants: ['Sistema automático']
    },
    {
      id: '8',
      title: 'Entrega Sprint 3',
      description: 'Fecha límite para completar todas las tareas del sprint',
      startTime: new Date(2024, 11, 20, 18, 0).toISOString(),
      endTime: new Date(2024, 11, 20, 18, 30).toISOString(),
      type: 'deadline',
      participants: ['Equipo de desarrollo']
    },
    {
      id: '9',
      title: 'Almuerzo de equipo',
      description: 'Celebración del hito alcanzado',
      startTime: new Date(2024, 11, 21, 13, 0).toISOString(),
      endTime: new Date(2024, 11, 21, 14, 30).toISOString(),
      type: 'meeting',
      participants: ['Todo el equipo']
    },
    {
      id: '10',
      title: 'Formación en UX/UI',
      description: 'Curso avanzado de diseño de interfaces',
      startTime: new Date(2024, 11, 22, 10, 0).toISOString(),
      endTime: new Date(2024, 11, 22, 17, 0).toISOString(),
      type: 'training',
      participants: ['Equipo de diseño', 'Desarrolladores frontend']
    }
  ];

  // Generar eventos adicionales para demostrar mejor las vistas
  const generateAdditionalEvents = () => {
    const additionalEvents: CalendarEvent[] = [];
    const today = new Date();
    
    // Eventos para hoy
    for (let i = 0; i < 3; i++) {
      const hour = 9 + i * 2;
      additionalEvents.push({
        id: `today-${i}`,
        title: `Tarea ${i + 1} del día`,
        description: `Descripción de la actividad ${i + 1}`,
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0).toISOString(),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour + 1, 0).toISOString(),
        type: i === 0 ? 'meeting' : i === 1 ? 'training' : 'deadline',
        participants: ['Participante ' + (i + 1)]
      });
    }

    // Eventos para esta semana
    for (let day = -3; day <= 3; day++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + day);
      
      if (day !== 0) { // No duplicar eventos de hoy
        for (let i = 0; i < 2; i++) {
          const hour = 10 + i * 3;
          additionalEvents.push({
            id: `week-${day}-${i}`,
            title: `Evento ${day > 0 ? 'futuro' : 'pasado'} ${Math.abs(day)}.${i + 1}`,
            description: `Evento programado para ${day > 0 ? 'dentro de' : 'hace'} ${Math.abs(day)} día${Math.abs(day) !== 1 ? 's' : ''}`,
            startTime: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hour, 0).toISOString(),
            endTime: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hour + 1, 30).toISOString(),
            type: ['meeting', 'training', 'maintenance', 'deadline'][i % 4] as any,
            participants: [`Equipo ${i + 1}`]
          });
        }
      }
    }

    return additionalEvents;
  };

  const allEvents = [...sampleEvents, ...generateAdditionalEvents()];

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
      alert(`Evento seleccionado: ${event.title}\nHora: ${new Date(event.startTime).toLocaleString('es-ES')}\nDescripción: ${event.description || 'Sin descripción'}`);
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleCreateEvent = () => {
    alert('Función de crear evento - Aquí se abriría un modal o formulario para crear un nuevo evento');
  };

  const getEventTypeInfo = () => {
    return [
      { type: 'meeting', label: 'Reuniones', color: 'bg-design-primary', count: allEvents.filter(e => e.type === 'meeting').length },
      { type: 'deadline', label: 'Fechas límite', color: 'bg-error', count: allEvents.filter(e => e.type === 'deadline').length },
      { type: 'maintenance', label: 'Mantenimiento', color: 'bg-warning', count: allEvents.filter(e => e.type === 'maintenance').length },
      { type: 'training', label: 'Capacitaciones', color: 'bg-success', count: allEvents.filter(e => e.type === 'training').length }
    ];
  };

  return (
    <div className="space-y-8 p-6">
      {/* Información del componente */}
      <div className="space-y-6">
        <Typography variant="h3">Vista de Calendario Completa</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              ✨ Nuevas funcionalidades
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • <strong>Vista de Mes:</strong> Calendario tradicional con eventos por día<br/>
              • <strong>Vista de Semana:</strong> Planificación semanal con horarios detallados<br/>
              • <strong>Vista de Día:</strong> Agenda diaria completa con resumen<br/>
              • <strong>Navegación inteligente:</strong> Cambia por mes/semana/día según la vista<br/>
              • <strong>Eventos organizados:</strong> Filtrados y ordenados por hora
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              📊 Estadísticas de eventos
            </Typography>
            <div className="space-y-2">
              {getEventTypeInfo().map(({ type, label, color, count }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <Typography variant="p" size="sm" className="text-green-800">
                      {label}
                    </Typography>
                  </div>
                  <Typography variant="p" size="sm" weight="medium" className="text-green-900">
                    {count}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estado actual */}
      <div className="bg-neutral-100 rounded-lg p-4">
        <Typography variant="p" size="sm" color="muted" className="mb-2">
          📅 <strong>Fecha actual:</strong> {currentDate.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
        <Typography variant="p" size="sm" color="muted">
          🎯 <strong>Evento seleccionado:</strong> {selectedEventId ? `ID: ${selectedEventId}` : 'Ninguno'}
        </Typography>
      </div>

      {/* Componente CalendarView */}
      <CalendarView
        events={allEvents}
        currentDate={currentDate}
        onEventClick={handleEventClick}
        onDateChange={handleDateChange}
        onCreateEvent={handleCreateEvent}
      />

      {/* Instrucciones de uso */}
      <div className="space-y-6">
        <Typography variant="h3">Cómo usar el calendario:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Typography variant="h4">🗓️ Vista de Mes</Typography>
            <Typography variant="p" size="sm" color="muted">
              • Navega entre meses con las flechas<br/>
              • Haz clic en cualquier día para seleccionarlo<br/>
              • Los eventos aparecen como pequeñas etiquetas<br/>
              • Se muestran máximo 3 eventos por día<br/>
              • Panel lateral con eventos de hoy
            </Typography>
          </div>
          
          <div className="space-y-3">
            <Typography variant="h4">📅 Vista de Semana</Typography>
            <Typography variant="p" size="sm" color="muted">
              • Navega entre semanas con las flechas<br/>
              • Vista de rejilla con horarios por hora<br/>
              • Eventos organizados por hora y día<br/>
              • Información más detallada de cada evento<br/>
              • Resumen de eventos de la semana
            </Typography>
          </div>
          
          <div className="space-y-3">
            <Typography variant="h4">📋 Vista de Día</Typography>
            <Typography variant="p" size="sm" color="muted">
              • Navega entre días con las flechas<br/>
              • Agenda completa hora por hora<br/>
              • Panel lateral con resumen del día<br/>
              • Estadísticas por tipo de evento<br/>
              • Información completa de participantes
            </Typography>
          </div>
        </div>
      </div>

      {/* Ejemplos de eventos por tipo */}
      <div className="space-y-6">
        <Typography variant="h3">Tipos de eventos soportados:</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 rounded bg-design-primary"></div>
              <Typography variant="p" weight="medium">Reuniones</Typography>
            </div>
            <Typography variant="p" size="sm" color="muted">
              Meetings, juntas, presentaciones, llamadas con clientes, etc.
            </Typography>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 rounded bg-error"></div>
              <Typography variant="p" weight="medium">Fechas límite</Typography>
            </div>
            <Typography variant="p" size="sm" color="muted">
              Deadlines, entregas, vencimientos, fechas críticas.
            </Typography>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 rounded bg-warning"></div>
              <Typography variant="p" weight="medium">Mantenimiento</Typography>
            </div>
            <Typography variant="p" size="sm" color="muted">
              Tareas técnicas, updates, backups, mantenimiento de sistemas.
            </Typography>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 rounded bg-success"></div>
              <Typography variant="p" weight="medium">Capacitaciones</Typography>
            </div>
            <Typography variant="p" size="sm" color="muted">
              Trainings, workshops, cursos, sesiones de aprendizaje.
            </Typography>
          </div>
        </div>
      </div>

      {/* Eventos de ejemplo */}
      <div className="space-y-6">
        <Typography variant="h3">Lista de eventos cargados:</Typography>
        
        <div className="bg-card border border-border rounded-lg p-4 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {allEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 rounded hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'meeting' ? 'bg-design-primary' :
                    event.type === 'deadline' ? 'bg-error' :
                    event.type === 'maintenance' ? 'bg-warning' :
                    'bg-success'
                  }`}></div>
                  <div>
                    <Typography variant="p" size="sm" weight="medium">
                      {event.title}
                    </Typography>
                    <Typography variant="p" size="xs" color="muted">
                      {new Date(event.startTime).toLocaleDateString('es-ES')} • {new Date(event.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </div>
                </div>
                <Typography variant="p" size="xs" className="capitalize text-muted-foreground">
                  {event.type}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewDemo;