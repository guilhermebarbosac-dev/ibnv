import { useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { Spinner } from '../ui/Spinner';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase-admin';
import { Image as ImageIcon, Link as LinkIcon, Download, ExternalLink, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../ui/Pagination';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useToastContext } from '../context/ToastContext';

interface Slide {
  id: string;
  title: string;
  image_url: string;
  link?: string;
  order: number;
  user_id: string;
}

export function SlideManager() {
  const { addToast } = useToastContext();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const totalPages = Math.ceil(slides.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSlides = slides.slice(indexOfFirstItem, indexOfLastItem);

  async function fetchSlides() {
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('order');

      if (error) throw error;
      setSlides(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching slides:', error);
      addToast('Erro ao buscar slides', 'error');
    }
  }

  async function handleImageUpload(imageUrl: string) {
    if (!imageUrl) return;
    await addSlide(imageUrl, false);
  }

  async function handleLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!linkUrl) return;
    await addSlide(linkUrl, true);
    setLinkUrl('');
  }

  async function addSlide(url: string, isLink: boolean) {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const { error } = await supabase.from('slides').insert({
        image_url: url,
        link: isLink ? url : null,
        order: slides.length,
        title: 'Slide ' + (slides.length + 1),
        user_id: user.id
      });

      if (error) throw error;
      fetchSlides();
      addToast('Slide adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Error creating slide:', error);
      addToast('Erro ao criar slide', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function moveSlide(slideId: string, direction: 'left' | 'right') {
    const currentIndex = slides.findIndex(s => s.id === slideId);
    if (
      (direction === 'left' && currentIndex === 0) ||
      (direction === 'right' && currentIndex === slides.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    const newSlides = Array.from(slides);
    const [movedSlide] = newSlides.splice(currentIndex, 1);
    newSlides.splice(newIndex, 0, movedSlide);

    // Atualiza o estado imediatamente para feedback visual
    setSlides(newSlides);

    try {
      const updates = newSlides.map((slide, index) => ({
        id: slide.id,
        order: index,
        title: slide.title,
        image_url: slide.image_url,
        link: slide.link,
        user_id: slide.user_id
      }));

      const { error } = await supabase
        .from('slides')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      addToast('Slides reordenados com sucesso', 'success');
    } catch (error) {
      console.error('Error reordering slides:', error);
      addToast('Erro ao reordenar slides', 'error');
      fetchSlides();
    }
  }

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast('Imagem baixada com sucesso', 'success');
    } catch (error) {
      console.error('Error downloading image:', error);
      addToast('Erro ao baixar imagem', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds(prev => [...prev, id]);
    try {
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSlides();
      addToast('Slide deletado com sucesso', 'success');
    } catch (error) {
      console.error('Error deleting slide:', error);
      addToast('Erro ao deletar slide', 'error');
    } finally {
      setDeletingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Upload de imagem
            </h3>
          </div>
          <div className="p-4">
            <ImageUpload
              folder="slides"
              onUpload={handleImageUpload}
              disabled={loading}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <LinkIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Adicionar link
            </h3>
          </div>
          <form onSubmit={handleLinkSubmit} className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Cole o link aqui"
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !linkUrl}
              className="mt-4 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
            >
              {loading ? <Spinner size={20} color="white" /> : 'Adicionar Link'}
            </button>
          </form>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-xl">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum slide cadastrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando um novo slide.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSlides.map((slide, index) => (
              <div
                key={slide.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-video relative bg-gray-50">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => moveSlide(slide.id, 'left')}
                        disabled={index === 0}
                        className="p-2 bg-white rounded-lg text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:hover:text-gray-400"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => moveSlide(slide.id, 'right')}
                        disabled={index === slides.length - 1}
                        className="p-2 bg-white rounded-lg text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:hover:text-gray-400"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      {slide.image_url && (
                        <button
                          onClick={() => downloadImage(slide.image_url, `slide_${slide.id}.jpg`)}
                          className="p-2 bg-white rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      {slide.link && (
                        <a
                          href={slide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={() => setItemToDelete(slide.id)}
                        disabled={deletingIds.includes(slide.id)}
                        className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        {deletingIds.includes(slide.id) ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
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
        </>
      )}

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete);
            setItemToDelete(null);
          }
        }}
        itemName="este slide"
      />
    </div>
  );
}