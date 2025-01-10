import { useState } from 'react';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { useEvents } from '../../hooks/useEvents';
import { Plus, Calendar, X } from 'lucide-react';
import { useToastContext } from '../context/ToastContext';

export function EventManager() {
  const [showForm, setShowForm] = useState(false);
  const { events, fetchEvents } = useEvents();
  const { addToast } = useToastContext();

  const handleSuccess = () => {
    setShowForm(false);
    fetchEvents();
    addToast('Evento criado com sucesso!', 'success');
  };

  const handleDelete = () => {
    fetchEvents();
    addToast('Evento excluído com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                Novo Evento
              </h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <EventForm onSuccess={handleSuccess} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          <span>Adicionar Evento</span>
        </button>
      )}

      <EventList events={events} onDelete={handleDelete} />
    </div>
  );
}