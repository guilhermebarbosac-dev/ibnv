import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/ui/Modal';
import { MapPin, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: string;
  color: string;
  all_day: boolean;
}

export function Agenda() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('Semana');
  const [showMoreEvents, setShowMoreEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      const currentDate = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      return eventStart <= endOfDay && eventEnd >= currentDate;
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  const renderDay = () => {
    const today = new Date();
    const dayEvents = getDayEvents(today);
    const weekDayIndex = today.getDay();

    return (
      <>
        <div className="grid grid-cols-1 gap-px bg-gray-200">
          <div className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-600">
            {weekDays[weekDayIndex]}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px bg-gray-200">
          <motion.div
            key={today.toString()}
            className="min-h-[120px] bg-white p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between">
              <span className="text-sm text-gray-900">
                {format(today, 'd')}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {dayEvents.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100"
                  style={{ borderLeft: `2px solid ${event.color}` }}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  {!event.all_day && (
                    <div className="text-gray-600">
                      {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                      })}
                    </div>
                  )}
                </button>
              ))}
              {dayEvents.length > 3 && (
                <button
                  onClick={() => setShowMoreEvents(dayEvents)}
                  className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 text-secondary"
                >
                  Ver mais...
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </>
    );
  };

  const renderWeek = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day) => {
          const dayEvents = getDayEvents(day);
          return (
            <motion.div
              key={day.toString()}
              className="min-h-[120px] bg-white p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between">
                <span className="text-sm text-gray-900">
                  {format(day, 'd')}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100"
                    style={{ borderLeft: `2px solid ${event.color}` }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {!event.all_day && (
                      <div className="text-gray-600">
                        {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })}
                      </div>
                    )}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => setShowMoreEvents(dayEvents)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 text-secondary"
                  >
                    Ver mais...
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((day) => {
          const dayEvents = getDayEvents(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <motion.div
              key={day.toString()}
              className={`min-h-[120px] bg-white p-2 ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between">
                <span className={`text-sm ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100"
                    style={{ borderLeft: `2px solid ${event.color}` }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {!event.all_day && (
                      <div className="text-gray-600">
                        {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })}
                      </div>
                    )}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => setShowMoreEvents(dayEvents)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 text-secondary"
                  >
                    Ver mais...
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'Dia':
        return renderDay();
      case 'Semana':
        return renderWeek();
      case 'Mês':
        return renderMonth();
      default:
        return renderWeek();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center space-y-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-7xl font-bold text-gray-900">
          Agenda
        </h1>
        <p className="text-2xl text-gray-600">
          Veja os próximos eventos da Igreja Batista Nova Vida
        </p>
      </motion.div>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 sm:p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {view === 'Mês' ? (
                  <>
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                )}
              </div>
              <div className="hidden sm:flex space-x-2">
                <button 
                  onClick={() => handleViewChange('Dia')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                    view === 'Dia' 
                      ? 'text-white bg-secondary hover:bg-secondary/80' 
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  Dia
                </button>
                <button 
                  onClick={() => handleViewChange('Semana')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                    view === 'Semana' 
                      ? 'text-white bg-secondary hover:bg-secondary/80' 
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  Semana
                </button>
                <button 
                  onClick={() => handleViewChange('Mês')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                    view === 'Mês' 
                      ? 'text-white bg-secondary hover:bg-secondary/80' 
                      : 'text-gray-700 bg-white border border-gray-300'
                  }`}
                >
                  Mês
                </button>
              </div>
              <div className="sm:hidden">
                <select
                  value={view}
                  onChange={(e) => handleViewChange(e.target.value)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <option value="Dia">Dia</option>
                  <option value="Semana">Semana</option>
                  <option value="Mês">Mês</option>
                </select>
              </div>
            </div>

            <div className="border rounded-lg">
              {view !== 'Dia' && (
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {weekDays.map((day) => (
                    <div key={day} className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
              )}

              {renderView()}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        zIndex={90} // Ensure this modal is on top
      >
        {selectedEvent && (
          <div className="p-4">
            <div
              className="w-full h-2 rounded-t-lg mb-6"
              style={{ backgroundColor: selectedEvent.color }}
            />
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedEvent.title}
            </h3>

            {selectedEvent.description && (
              <p className="text-gray-600 mb-6">
                {selectedEvent.description}
              </p>
            )}

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{selectedEvent.location || 'Local não especificado'}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <div>
                  <p>
                    {selectedEvent.all_day ? (
                      'Dia inteiro'
                    ) : (
                      <>
                        {new Date(selectedEvent.start_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })} - {new Date(selectedEvent.end_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })}
                      </>
                    )}
                  </p>
                  <p className="text-sm">
                    {new Date(selectedEvent.start_date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showMoreEvents.length > 0}
        onClose={() => setShowMoreEvents([])}
        zIndex={20} // Ensure this modal is below the event modal
      >
        <div className="p-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mais Eventos</h3>
          <div className="space-y-4">
            {showMoreEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ borderLeft: `4px solid ${event.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <h4 className="text-lg font-medium text-gray-900">
                      {event.title}
                    </h4>
                    {event.location && (
                      <div className="flex items-center text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {event.all_day
                          ? 'Dia inteiro'
                          : `${new Date(event.start_date).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'UTC'
                            })} - ${new Date(event.end_date).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'UTC'
                            })}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </motion.div>
  );
} 