import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Estudo as EstudoType } from '../types/Estudo';
import { LoaderSpinner } from '../components/ui/Loader-spinner';
import { formatDate } from '../utils/formatDate';
import { Download, Share2 } from 'lucide-react';

export function Estudo() {
  const { id } = useParams();
  const [estudo, setEstudo] = useState<EstudoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudo = async () => {
      try {
        const { data, error } = await supabase
          .from('estudos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEstudo(data);
      } catch (error) {
        console.error('Error fetching estudo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudo();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: estudo?.title,
        text: estudo?.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownloadPdf = async () => {
    if (!estudo?.pdf_url) return;
    
    try {
      const response = await fetch(estudo.pdf_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${estudo.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!estudo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Estudo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <img
          src={estudo.image_url}
          alt={estudo.title}
          className="w-full h-[400px] object-cover rounded-lg mb-12"
        />
        
        <div className="space-y-8">
          <div className="relative mb-16 md:mb-0">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">{estudo.title}</h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>{formatDate(estudo.created_at)}</span>
                {estudo.author && (
                  <>
                    <span>•</span>
                    <span>Por: {estudo.author}</span>
                  </>
                )}
              </div>
            </div>

            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center space-x-4">
              {estudo.pdf_url && (
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar PDF</span>
                </button>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mx-auto text-center">
            <p className="text-xl text-gray-600 mb-8 text-center">{estudo.description}</p>
            <div 
              dangerouslySetInnerHTML={{ __html: estudo.content }}
              className="ql-editor text-center"
            />
          </div>

          {estudo.bibliography && estudo.bibliography.length > 0 && (
            <div className="pt-8 border-t text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Referências</h2>
              <ul className="list-none p-0 space-y-2 text-gray-600">
                {estudo.bibliography.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:hidden flex flex-col space-y-4 items-center mt-8">
            {estudo.pdf_url && (
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors w-full justify-center"
              >
                <Download className="w-5 h-5" />
                <span>Baixar PDF</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full justify-center"
            >
              <Share2 className="w-5 h-5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 