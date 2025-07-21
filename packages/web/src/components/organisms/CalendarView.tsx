import React, { useState, useMemo } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Card from '../molecules/Card';
import IconButton from '../molecules/IconButton';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'maintenance' | 'training';
  participants?: string[];
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate?: Date;
  onEventClick?: (eventId: string) => void;
  onDateChange?: (date: Date) => void;
  onCreateEvent?: () => void;
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  currentDate = new Date(),
  onEventClick,
  onDateChange,
  onCreateEvent,
  className = '',
  ...props
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-design-primary';
      case 'deadline':
        return 'bg-error';
      case 'maintenance':
        return 'bg-warning';
      case 'training':
        return 'bg-success';
      default:
        return 'bg-neutral-500';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    if (format === 'long') {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Funciones para obtener datos según la vista
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(weekDay);
    }
    return weekDays;
  };

  const getHoursArray = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getEventsForDate = (date: Date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === date.toDateString();
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  };

  const getEventsForHour = (date: Date, hour: number) => {
    return getEventsForDate(date).filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart.getHours() === hour;
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case 'month':
        newDate.setMonth(
          currentDate.getMonth() + (direction === 'next' ? 1 : -1),
        );
        break;
      case 'week':
        newDate.setDate(
          currentDate.getDate() + (direction === 'next' ? 7 : -7),
        );
        break;
      case 'day':
        newDate.setDate(
          currentDate.getDate() + (direction === 'next' ? 1 : -1),
        );
        break;
    }

    onDateChange?.(newDate);
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesFull = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  // Memoized data for current view
  const viewData = useMemo(() => {
    switch (viewMode) {
      case 'month':
        return getDaysInMonth(currentDate);
      case 'week':
        return getWeekDays(currentDate);
      case 'day':
        return [currentDate];
      default:
        return [];
    }
  }, [viewMode, currentDate]);

  const getViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week':
        const weekDays = getWeekDays(currentDate);
        const startWeek = weekDays[0];
        const endWeek = weekDays[6];
        if (startWeek.getMonth() === endWeek.getMonth()) {
          return `${startWeek.getDate()} - ${endWeek.getDate()} ${monthNames[startWeek.getMonth()]} ${startWeek.getFullYear()}`;
        } else {
          return `${startWeek.getDate()} ${monthNames[startWeek.getMonth()]} - ${endWeek.getDate()} ${monthNames[endWeek.getMonth()]} ${startWeek.getFullYear()}`;
        }
      case 'day':
        return formatDate(currentDate, 'long');
      default:
        return '';
    }
  };

  const renderMonthView = () => (
    <div className="p-6">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center">
            <Typography variant="p" size="sm" weight="medium" color="muted">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {viewData.map((date, index) => (
          <div
            key={index}
            className={`
              min-h-[100px] p-2 border border-border rounded-lg
              ${date ? 'bg-card hover:bg-accent/50 cursor-pointer' : 'bg-neutral-100'}
              transition-colors
            `}
            onClick={() => date && onDateChange?.(date)}
          >
            {date && (
              <>
                <Typography
                  variant="p"
                  size="sm"
                  weight="medium"
                  className={`
                    mb-2 text-center
                    ${
                      date.toDateString() === new Date().toDateString()
                        ? 'text-design-primary'
                        : ''
                    }
                  `}
                >
                  {date.getDate()}
                </Typography>

                <div className="space-y-1">
                  {getEventsForDate(date)
                    .slice(0, 3)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`
                        text-xs p-1 rounded text-white cursor-pointer
                        ${getEventColor(event.type)}
                      `}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event.id);
                        }}
                      >
                        <div className="truncate">{event.title}</div>
                        <div className="text-xs opacity-80">
                          {formatTime(event.startTime)}
                        </div>
                      </div>
                    ))}

                  {getEventsForDate(date).length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{getEventsForDate(date).length - 3} más
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="p-6">
      {/* Week Day Headers */}
      <div className="grid grid-cols-8 gap-1 mb-4">
        <div className="p-2"></div> {/* Empty corner cell */}
        {viewData.map((date, index) => (
          <div key={index} className="p-2 text-center border-b border-border">
            <Typography variant="p" size="sm" weight="medium" color="muted">
              {dayNames[date?.getDay() ?? 0]}
            </Typography>
            <Typography
              variant="p"
              size="lg"
              weight="medium"
              className={`
                ${
                  date?.toDateString() === new Date().toDateString()
                    ? 'text-design-primary'
                    : ''
                }
              `}
            >
              {date?.getDate()}
            </Typography>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 gap-1 max-h-[600px] overflow-y-auto">
        {getHoursArray().map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour Label */}
            <div className="p-2 text-right border-r border-border">
              <Typography variant="p" size="sm" color="muted">
                {hour.toString().padStart(2, '0')}:00
              </Typography>
            </div>

            {/* Hour slots for each day */}
            {viewData.map((date, dayIndex) => (
              <div
                key={`${hour}-${dayIndex}`}
                className="min-h-[40px] p-1 border-b border-border hover:bg-accent/30 cursor-pointer relative"
                onClick={() => onDateChange?.(date as Date)}
              >
                {getEventsForHour(date as Date, hour).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      text-xs p-1 rounded text-white cursor-pointer mb-1
                      ${getEventColor(event.type)}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event.id);
                    }}
                  >
                    <div className="truncate font-medium">{event.title}</div>
                    <div className="text-xs opacity-80">
                      {formatTime(event.startTime)} -{' '}
                      {formatTime(event.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => {
    const selectedDate = currentDate;
    const dayEvents = getEventsForDate(selectedDate);

    return (
      <div className="p-6">
        {/* Day Header */}
        <div className="mb-6 text-center border-b border-border pb-4">
          <Typography variant="h3" weight="medium">
            {dayNamesFull[selectedDate.getDay()]}
          </Typography>
          <Typography variant="p" size="lg" color="muted">
            {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} de{' '}
            {selectedDate.getFullYear()}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Time Grid */}
          <div className="md:col-span-3">
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {getHoursArray().map((hour) => (
                <div key={hour} className="flex border-b border-border">
                  {/* Hour Label */}
                  <div className="w-20 py-3 px-2 text-right border-r border-border">
                    <Typography variant="p" size="sm" color="muted">
                      {hour.toString().padStart(2, '0')}:00
                    </Typography>
                  </div>

                  {/* Hour Content */}
                  <div className="flex-1 min-h-[60px] p-2 hover:bg-accent/30 cursor-pointer relative">
                    {getEventsForHour(selectedDate, hour).map((event) => (
                      <div
                        key={event.id}
                        className={`
                          p-2 rounded text-white cursor-pointer mb-2
                          ${getEventColor(event.type)}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event.id);
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm opacity-90">
                          {formatTime(event.startTime)} -{' '}
                          {formatTime(event.endTime)}
                        </div>
                        {event.description && (
                          <div className="text-sm opacity-80 mt-1">
                            {event.description}
                          </div>
                        )}
                        {event.participants &&
                          event.participants.length > 0 && (
                            <div className="text-sm opacity-80 mt-1">
                              👥 {event.participants.length} participante
                              {event.participants.length !== 1 ? 's' : ''}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day Summary */}
          <div className="md:col-span-1">
            <Card variant="vertical" title="">
              <div className="p-4">
                <Typography variant="h4" weight="medium" className="mb-4">
                  Resumen del día
                </Typography>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="p" size="sm" color="muted">
                      Total de eventos:
                    </Typography>
                    <Typography variant="p" size="sm" weight="medium">
                      {dayEvents.length}
                    </Typography>
                  </div>

                  {dayEvents.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <Typography variant="p" size="sm" color="muted">
                          Por tipo:
                        </Typography>
                        {Object.entries(
                          dayEvents.reduce(
                            (acc, event) => {
                              acc[event.type] = (acc[event.type] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          ),
                        ).map(([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${getEventColor(type)}`}
                            />
                            <Typography variant="p" size="sm">
                              {type}: {count}
                            </Typography>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Typography
                          variant="p"
                          size="sm"
                          color="muted"
                          className="mb-2"
                        >
                          Próximo evento:
                        </Typography>
                        {dayEvents[0] && (
                          <div className="space-y-1">
                            <Typography variant="p" size="sm" weight="medium">
                              {dayEvents[0].title}
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              {formatTime(dayEvents[0].startTime)}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {dayEvents.length === 0 && (
                    <div className="text-center py-4">
                      <Icon
                        name="Calendar"
                        size="lg"
                        color="muted"
                        className="mx-auto mb-2"
                      />
                      <Typography variant="p" size="sm" color="muted">
                        No hay eventos programados
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Typography variant="h2" weight="medium">
            Calendario
          </Typography>
          <div className="flex items-center space-x-2">
            <IconButton
              icon="ChevronLeft"
              iconOnly
              variant="outline"
              size="sm"
              onClick={() => navigate('prev')}
            />
            <Typography
              variant="h4"
              weight="medium"
              className="min-w-[200px] text-center"
            >
              {getViewTitle()}
            </Typography>
            <IconButton
              icon="ChevronRight"
              iconOnly
              variant="outline"
              size="sm"
              onClick={() => navigate('next')}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-border rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`
                  px-3 py-1 text-sm rounded transition-colors
                  ${
                    viewMode === mode
                      ? 'bg-design-primary text-primary-dark'
                      : 'hover:bg-accent'
                  }
                `}
              >
                {mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Día'}
              </button>
            ))}
          </div>

          <IconButton icon="Plus" variant="primary" onClick={onCreateEvent}>
            Nuevo Evento
          </IconButton>
        </div>
      </div>

      {/* Calendar Content */}
      <Card variant="vertical" title="">
        {renderCurrentView()}
      </Card>

      {/* Events Summary for Month/Week views */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <Card variant="vertical" title="">
          <div className="p-6">
            <Typography variant="h4" weight="medium" className="mb-4">
              {viewMode === 'month'
                ? 'Eventos de hoy'
                : 'Eventos de la semana seleccionada'}
            </Typography>

            {(() => {
              const relevantEvents =
                viewMode === 'month'
                  ? getEventsForDate(new Date())
                  : viewData.flatMap((date) => getEventsForDate(date as Date));

              return relevantEvents.length > 0 ? (
                <div className="space-y-3">
                  {relevantEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => onEventClick?.(event.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}
                        />
                        <div className="flex-1">
                          <Typography variant="p" size="sm" weight="medium">
                            {event.title}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted">
                            {formatTime(event.startTime)} -{' '}
                            {formatTime(event.endTime)}
                            {viewMode === 'week' && (
                              <span className="ml-2">
                                • {formatDate(new Date(event.startTime))}
                              </span>
                            )}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}

                  {relevantEvents.length > 5 && (
                    <Typography
                      variant="p"
                      size="sm"
                      color="muted"
                      className="text-center"
                    >
                      +{relevantEvents.length - 5} eventos más
                    </Typography>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon
                    name="Calendar"
                    size="lg"
                    color="muted"
                    className="mx-auto mb-2"
                  />
                  <Typography variant="p" color="muted">
                    {viewMode === 'month'
                      ? 'No hay eventos programados para hoy'
                      : 'No hay eventos programados para esta semana'}
                  </Typography>
                </div>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
