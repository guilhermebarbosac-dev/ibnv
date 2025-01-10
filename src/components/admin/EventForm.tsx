import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase-admin';
import { ImageUpload } from './ImageUpload';

import { useEvents } from '../../hooks/useEvents';
import { Spinner } from '../ui/Spinner';
import { Calendar, Clock, FileText, Type } from 'lucide-react';

interface EventFormProps {
  onSuccess?: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchEvents } = useEvents();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      const { error } = await supabase.from('events').insert({
        title,
        description,
        event_date: date,
        event_time: time,
        image_url: imageUrl,
        user_id: user.id
      });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setImageUrl('');
      
      await fetchEvents();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900">Título</label>
        <div className="mt-1.5 relative">
          <div className="absolute left-4 top-3 text-gray-400">
            <Type className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Descrição</label>
        <div className="mt-1.5 relative">
          <div className="absolute left-4 top-3 text-gray-400">
            <FileText className="w-5 h-5" />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Data</label>
          <div className="mt-1.5 relative">
            <div className="absolute left-4 top-3 text-gray-400">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Horário</label>
          <div className="mt-1.5 relative">
            <div className="absolute left-4 top-3 text-gray-400">
              <Clock className="w-5 h-5" />
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      <ImageUpload
        folder="events"
        onUpload={setImageUrl}
      />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 h-32 w-full object-cover rounded-xl"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all duration-200"
      >
        {loading ? <Spinner size={20} color="white" /> : 'Criar Evento'}
      </button>
    </form>
  );
}