import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Trash2, Loader2 } from 'lucide-react';
import { Pagination } from '../ui/Pagination';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  image_url: string;
}

interface EventListProps {
  events: Event[];
  onDelete: () => void;
}

export function EventList({ events, onDelete }: EventListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  async function handleDelete(id: string) {
    setDeletingIds(prev => [...prev, id]);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onDelete();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeletingIds(prev => prev.filter(itemId => itemId !== id));
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-xl">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhum evento cadastrado
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece adicionando um novo evento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video relative bg-gray-50">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setItemToDelete(event.id)}
                    disabled={deletingIds.includes(event.id)}
                    className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingIds.includes(event.id) ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.event_date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{event.event_time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete);
            setItemToDelete(null);
          }
        }}
        itemName="este evento"
      />
    </div>
  );
}