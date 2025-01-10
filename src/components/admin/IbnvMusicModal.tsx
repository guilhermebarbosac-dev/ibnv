import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from '../../lib/supabase';
import { useToastContext } from '../context/ToastContext';
import { Spinner } from '../ui/Spinner';
import { Editor } from '../Editor';
import { ImageUpload } from '../ImageUpload';

interface IbnvMusicData {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface IbnvMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IbnvMusicData | null;
  onSuccess: () => void;
}

export function IbnvMusicModal({ isOpen, onClose, data, onSuccess }: IbnvMusicModalProps) {
  const [description, setDescription] = useState(data?.description || '');
  const [content, setContent] = useState(data?.content || '');
  const [imageUrl, setImageUrl] = useState(data?.image_url || '');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      addToast('Por favor, faça upload de uma imagem', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const updates = {
        description,
        content,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (data) {
        const { error } = await supabase
          .from('ibnv_music')
          .update(updates)
          .eq('id', data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ibnv_music')
          .insert([{ ...updates, title: 'IBNV Music' }]);

        if (error) throw error;
      }

      addToast('IBNV Music atualizado com sucesso', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving IBNV Music:', error);
      addToast('Não foi possível salvar as alterações', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg w-full max-w-4xl p-6">
          <div className="space-y-6">
            <div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                {data ? 'Editar' : 'Criar'} IBNV Music
              </Dialog.Title>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem
                </label>
                <ImageUpload
                  imageUrl={imageUrl}
                  onUpload={setImageUrl}
                  folder="ibnv-music"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo
                </label>
                <Editor
                  value={content}
                  onChange={setContent}
                  placeholder="Digite o conteúdo aqui..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                >
                  {loading ? <Spinner /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 