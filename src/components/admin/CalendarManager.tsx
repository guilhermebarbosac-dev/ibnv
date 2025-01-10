import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Pencil, Trash2, Download } from 'lucide-react';
import { Calendar } from '../../components/ui/Calendar';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase-admin';
import { useToastContext } from '../context/ToastContext';
import { Loader } from '../ui/Loader';
import { Modal } from '../ui/Modal';
import { Pagination } from '../ui/Pagination';
import { format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { render } from 'react-dom';

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

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function CalendarManager() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showExportModal, setShowExportModal] = useState(false);
  const exportCalendarRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    type: 'event',
    color: '#2563eb',
    all_day: false
  });

  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

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
      addToast('Erro ao carregar eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cálculo para paginação
  const eventsPerPage = 4;
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        start_date: date.toISOString().split('T')[0] + 'T00:00',
        end_date: date.toISOString().split('T')[0] + 'T23:59'
      });
      setShowEventModal(true);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    const eventDate = new Date(event.start_date);
    setSelectedDate(eventDate);
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: new Date(event.end_date).toISOString().slice(0, 16),
      location: event.location,
      type: event.type,
      color: event.color,
      all_day: event.all_day
    });
    setShowEventModal(true);
  };

  const handleSubmit = async (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();
    try {
      const user = await getCurrentUser();
      
      const eventData = {
        ...formData,
        user_id: user.id
      };

      if (selectedEvent) {
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', selectedEvent.id);

        if (error) throw error;
        addToast('Evento atualizado com sucesso!', 'success');
      } else {
        const { data, error } = await supabase
          .from('calendar_events')
          .insert([eventData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setEvents(prev => [...prev, data]);
        }
        addToast('Evento criado com sucesso!', 'success');
      }

      if (shouldClose) {
        setShowEventModal(false);
        setSelectedEvent(null);
      }
      
      setFormData({
        title: '',
        description: '',
        start_date: selectedDate ? selectedDate.toISOString().split('T')[0] + 'T00:00' : new Date().toISOString().split('T')[0] + 'T00:00',
        end_date: selectedDate ? selectedDate.toISOString().split('T')[0] + 'T23:59' : new Date().toISOString().split('T')[0] + 'T23:59',
        location: '',
        type: 'event',
        color: '#2563eb',
        all_day: false
      });
      
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      addToast('Erro ao salvar evento', 'error');
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      setDeletingEventId(eventId);
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      addToast('Evento excluído com sucesso!', 'success');
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      addToast('Erro ao excluir evento', 'error');
    } finally {
      setDeletingEventId(null);
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

  const ExportCalendarPreview = ({ isFullSize = false }: { isFullSize?: boolean }) => {
    const monthDays = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });

    const firstDayOfMonth = startOfMonth(currentMonth);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const emptyDays = Array(startingDayOfWeek).fill(null);
    const allDays = [...emptyDays, ...monthDays];

    return (
      <div 
        ref={exportCalendarRef}
        className="bg-white p-8 rounded-xl"
        style={{ width: '1920px', minHeight: '1080px' }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-[#40C1AC] rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-6xl font-bold text-gray-900 uppercase tracking-wide">
                {format(currentMonth, 'MMMM', { locale: ptBR })}
              </h2>
              <p className="text-3xl text-gray-500 mt-2">
                {format(currentMonth, 'yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
          <img 
            src="/logo-black.png" 
            alt="IBNV Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Calendário */}
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
          {/* Dias da Semana */}
          <div className="grid grid-cols-7 bg-[#40C1AC]/5">
            {weekDays.map((day) => (
              <div key={day} className="py-4 text-center">
                <span className="text-2xl font-semibold text-[#40C1AC]">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Dias do Mês */}
          <div className="grid grid-cols-7">
            {allDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="min-h-[150px] p-4 border-t border-l border-gray-100 bg-gray-50/50" />;
              }

              const dayEvents = getDayEvents(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[150px] p-4 border-t border-l border-gray-100 ${
                    !isCurrentMonth ? 'bg-gray-50/50' : ''
                  } ${isToday ? 'bg-[#40C1AC]/5' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-2">
                      {isToday ? (
                        <div className="w-8 h-8 rounded-full bg-[#40C1AC] flex items-center justify-center">
                          <span className="text-xl font-medium text-white leading-none pb-4">
                            {format(day, 'd')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-medium text-gray-700 h-8 flex items-center leading-none">
                          {format(day, 'd')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-sm p-2 rounded-md"
                          style={{ 
                            backgroundColor: `${event.color}10`,
                            borderLeft: `4px solid ${event.color}`,
                            minHeight: '60px'
                          }}
                        >
                          <div className="font-medium text-gray-900 break-words text-base mb-1">
                            {event.title}
                          </div>
                          {!event.all_day && (
                            <div className="mt-1 space-y-1">
                              <div className="flex items-center text-gray-500">
                                <div className="w-4 h-4 mr-1 flex items-center justify-center flex-shrink-0 relative top-[7px]">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                                <span className="break-words text-sm">
                                  {format(new Date(event.start_date), 'HH:mm')}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center text-gray-600 py-1">
                                  <div className="w-4 h-4 mr-1 flex items-center justify-center flex-shrink-0 relative top-[7px] bottom-3">
                                    <MapPin className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="break-words text-sm">{event.location}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex items-center justify-center text-base text-gray-500">
          <div className="flex items-center space-x-2">
            <span>Praça Amaro José do Carmo, 100</span>
            <span>•</span>
            <span>Santa Isabel, Conceição das Alagoas - MG</span>
            <span>•</span>
            <span>CEP: 38120-000</span>
          </div>
        </div>
      </div>
    );
  };

  const handleExportCalendar = async () => {
    try {
      // Create a temporary container that's visible but off-screen
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.zIndex = '-9999';
      container.style.width = '1920px';
      container.style.height = '1180px';
      container.style.backgroundColor = '#ffffff';
      document.body.appendChild(container);

      // Create and append the calendar preview
      const root = document.createElement('div');
      root.style.width = '1920px';
      root.style.height = '1180px';
      container.appendChild(root);

      // Render the calendar preview
      render(<ExportCalendarPreview isFullSize={true} />, root);

      // Wait for content to be fully rendered and images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture with higher quality settings
      const canvas = await html2canvas(root, {
        scale: 1.9,
        width: 1920,
        height: 1180,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const styles = Array.from(document.styleSheets);
          styles.forEach(styleSheet => {
            try {
              const cssRules = Array.from(styleSheet.cssRules);
              const style = document.createElement('style');
              style.textContent = cssRules.map(rule => rule.cssText).join('\n');
              clonedDoc.head.appendChild(style);
            } catch (e) {
              console.warn('Could not copy styles', e);
            }
          });
        }
      });
      
      // Convert to high-quality PNG
      const link = document.createElement('a');
      link.download = `calendario-${format(currentMonth, 'MMMM-yyyy', { locale: ptBR })}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      // Clean up
      document.body.removeChild(container);
      addToast('Calendário exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Error exporting calendar:', error);
      addToast('Erro ao exportar calendário', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-sm font-medium text-gray-900">
              Agenda Anual
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCalendar}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setFormData({
                  title: '',
                  description: '',
                  start_date: new Date().toISOString().split('T')[0] + 'T00:00',
                  end_date: new Date().toISOString().split('T')[0] + 'T23:59',
                  location: '',
                  type: 'event',
                  color: '#2563eb',
                  all_day: false
                });
                setShowEventModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) => getDayEvents(date).length > 0
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                color: '#2563eb'
              }
            }}
          />
        </div>

        {/* Lista de Eventos */}
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-4">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-3 h-3 mt-1.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(new Date(event.start_date), "dd/MM/yyyy 'às' HH:mm")}
                      </span>
                    </div>
                    {event.location && (
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEventClick(event)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingEventId(event.id);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    disabled={deletingEventId === event.id}
                  >
                    {deletingEventId === event.id ? (
                      <Loader size={16} />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {Math.ceil(events.length / eventsPerPage) > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(events.length / eventsPerPage)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        size="lg"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data/Hora Início
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data/Hora Fim
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  placeholder="Local do evento"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-8 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="all_day"
                  checked={formData.all_day}
                  onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                  className="rounded text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="all_day" className="ml-2 text-sm text-gray-700">
                  Dia inteiro
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {selectedEvent && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEvent.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Excluir
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Cancelar
              </button>
              {!selectedEvent && (
                <button
                  type="submit"
                  onClick={async (e) => {
                    await handleSubmit(e, false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Criar e Continuar
                </button>
              )}
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                {selectedEvent ? 'Atualizar' : 'Criar e Sair'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Trash2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Excluir Evento
              </h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-700">
              Você tem certeza que deseja excluir este evento?
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (deletingEventId) {
                  handleDelete(deletingEventId);
                }
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 