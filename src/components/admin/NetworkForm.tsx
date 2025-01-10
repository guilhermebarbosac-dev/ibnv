import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase-admin';
import { ImageUpload } from './ImageUpload';
import { Spinner } from '../ui/Spinner';
import { Share2, Type, FileText } from 'lucide-react';

interface NetworkFormProps {
  onSuccess: () => void;
}

export function NetworkForm({ onSuccess }: NetworkFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      const { error } = await supabase.from('networks').insert({
        title,
        description,
        image_url: imageUrl,
        user_id: user.id
      });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setImageUrl('');
      onSuccess();
    } catch (error) {
      console.error('Error creating network:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Share2 className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">
          Nova Rede
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900">Título</label>
          <div className="mt-1.5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Nome da rede"
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
              rows={3}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Descrição da rede"
              required
            />
          </div>
        </div>

        <ImageUpload
          folder="networks"
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
          {loading ? <Spinner size={20} color="white" /> : 'Criar Rede'}
        </button>
      </form>
    </div>
  );
}