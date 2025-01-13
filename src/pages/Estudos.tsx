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
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-24 lg:px-8">
        <EstudosSection estudos={estudos} loading={loading} />
      </div>
    </div>
  );
} 