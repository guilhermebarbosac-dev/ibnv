import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Estudo } from '../../types/Estudo';
import { useToastContext } from '../context/ToastContext';
import { X, Type, FileText, Image, User, FileText as PdfIcon, BookOpen, Eye, EyeOff } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageUpload } from './ImageUpload';
import { Spinner } from '../ui/Spinner';
import { PdfUpload } from './PdfUpload';

interface EstudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudo?: Estudo | null;
  onSuccess: () => void;
}

export function EstudoModal({ isOpen, onClose, estudo, onSuccess }: EstudoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [newReference, setNewReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [published, setPublished] = useState(false);
  const { addToast } = useToastContext();

  useEffect(() => {
    if (estudo) {
      setTitle(estudo.title);
      setDescription(estudo.description);
      setContent(estudo.content);
      setImageUrl(estudo.image_url);
      setAuthor(estudo.author || '');
      setPdfUrl(estudo.pdf_url || '');
      setReferences(estudo.bibliography || []);
      setPublished(estudo.published);
    } else {
      resetForm();
    }
  }, [estudo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setImageUrl('');
    setAuthor('');
    setPdfUrl('');
    setReferences([]);
    setNewReference('');
    setShowImageUpload(false);
    setShowPdfUpload(false);
    setPublished(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title,
        description,
        content,
        image_url: imageUrl,
        author,
        pdf_url: pdfUrl,
        bibliography: references,
        published,
        created_at: new Date().toISOString()
      };

      if (estudo) {
        const { error } = await supabase
          .from('estudos')
          .update(data)
          .eq('id', estudo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('estudos')
          .insert([data]);
        if (error) throw error;
      }

      addToast(`Estudo ${estudo ? 'atualizado' : 'criado'} com sucesso`, 'success');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving estudo:', error);
      addToast(`Não foi possível ${estudo ? 'atualizar' : 'criar'} o estudo`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReference = () => {
    if (newReference.trim()) {
      setReferences([...references, newReference.trim()]);
      setNewReference('');
    }
  };

  const handleRemoveReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    setShowImageUpload(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {estudo ? 'Editar Estudo' : 'Novo Estudo'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <Type className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                className="rounded-md h-64 mb-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Capa
              </label>
              {showImageUpload ? (
                <div className="space-y-4">
                  <ImageUpload
                    folder="estudos"
                    onUpload={handleImageUploadSuccess}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Ou insira a URL da imagem
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mt-1.5 relative">
                    <div className="absolute left-4 top-3 text-gray-400">
                      <Image className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                      placeholder="URL da imagem"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(true)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Ou faça upload de uma imagem
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Autor
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF do Estudo
              </label>
              {showPdfUpload ? (
                <div className="space-y-4">
                  <PdfUpload
                    folder="estudos-pdf"
                    onUpload={(url) => {
                      setPdfUrl(url);
                      setShowPdfUpload(false);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowPdfUpload(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Ou insira a URL do PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mt-1.5 relative">
                    <div className="absolute left-4 top-3 text-gray-400">
                      <PdfIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                      placeholder="URL do PDF"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowPdfUpload(true)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Ou faça upload de um PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referências
              </label>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-3 text-gray-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    placeholder="Adicione uma referência"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddReference}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Adicionar
                </button>
              </div>
              <ul className="space-y-2">
                {references.map((ref, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-600">{ref}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`p-2 ${
                    published 
                      ? 'text-green-600 hover:text-green-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  } transition-colors`}
                  title={published ? 'Publicado' : 'Rascunho'}
                >
                  {published ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  {published ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-w-[100px]"
                >
                  {loading ? <Spinner size={16} /> : estudo ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 