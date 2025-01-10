import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LoaderSpinner } from '../ui/Loader-spinner';
import { Pencil } from 'lucide-react';
import { useToastContext } from '../context/ToastContext';
import { IbnvMusicModal } from '../admin/IbnvMusicModal';

interface IbnvMusicData {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export function IbnvMusicManager() {
  const [data, setData] = useState<IbnvMusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ibnv_music')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setData(data);
    } catch (error) {
      console.error('Error fetching IBNV Music data:', error);
      addToast('Não foi possível carregar os dados do IBNV Music', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">IBNV Music</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Pencil className="w-5 h-5" />
          <span>{data ? 'Editar' : 'Criar'} IBNV Music</span>
        </button>
      </div>

      {data ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
          <div className="space-y-6">
            <img
              src={data.image_url}
              alt="IBNV Music"
              className="w-full h-[300px] object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Descrição</h3>
              <p className="mt-1 text-gray-600">{data.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Conteúdo</h3>
              <div 
                className="mt-1 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <p className="text-gray-600">Nenhum conteúdo cadastrado</p>
        </div>
      )}

      <IbnvMusicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        onSuccess={fetchData}
      />
    </div>
  );
} 