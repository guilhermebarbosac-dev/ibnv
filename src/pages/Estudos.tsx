import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Estudo } from '../types/Estudo';
import { EstudosSection } from '../components/home/EstudosSection';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

export function Estudos() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudos = async () => {
      try {
        const { data, error } = await supabase
          .from('estudos')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEstudos(data || []);
      } catch (error) {
        console.error('Error fetching estudos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudos();
  }, []);

  if (loading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Estudos de Células
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Aprofunde seu conhecimento com nossos estudos semanais
          </p>
        </div>

        <EstudosSection estudos={estudos} loading={loading} />
      </div>
    </div>
  );
} 