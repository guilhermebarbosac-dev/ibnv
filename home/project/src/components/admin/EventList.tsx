import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  image_url: string;
  is_cancelled: boolean;
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Erro ao carregar eventos');
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erro ao excluir evento');
    }
  }

  async function toggleEventStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_cancelled: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Erro ao atualizar status do evento');
    }
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id} 
          className={`flex items-center space-x-4 bg-white p-4 rounded-lg shadow ${
            event.is_cancelled ? 'opacity-50' : ''
          }`}
        >
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="h-20 w-20 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium">
              {event.title}
              {event.is_cancelled && (
                <span className="ml-2 text-sm text-red-600">(Cancelado)</span>
              )}
            </h3>
            <p className="text-sm text-gray-500">{event.description}</p>
            <p className="text-sm text-gray-600">
              {new Date(event.event_date).toLocaleDateString()} às {event.event_time}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => toggleEventStatus(event.id, event.is_cancelled)}
              className={`text-sm px-3 py-1 rounded ${
                event.is_cancelled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {event.is_cancelled ? 'Reativar' : 'Cancelar'}
            </button>
            <button
              onClick={() => deleteEvent(event.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}