import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

interface IbnvMusicData {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export function IbnvMusic() {
  const [data, setData] = useState<IbnvMusicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('ibnv_music')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error('Error fetching IBNV Music data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Conteúdo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full mx-auto py-16 px-4 sm:py-24 sm:px-24">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-extrabold text-gray-900 sm:tracking-tight">
            IBNV Music
          </h1>
        </div>

        <div className="w-full mx-auto">
          <img
            src={data.image_url}
            alt="IBNV Music"
            className="w-full h-[400px] object-cover rounded-lg mb-12"
          />
          
          <div className="prose prose-lg w-full mx-auto text-center">
            <p className="text-4xl text-gray-600 mb-8">{data.description}</p>
            <div 
              dangerouslySetInnerHTML={{ __html: data.content }}
              className="[&>*]:text-center [&>h1]:text-5xl [&>h2]:text-4xl [&>h3]:text-3xl [&>p]:text-2xl [&>ul]:list-none [&>ul]:p-0 [&>ol]:list-none [&>ol]:p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 