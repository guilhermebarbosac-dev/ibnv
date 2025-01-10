import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Estudo } from '../../types/Estudo';
import { LoaderSpinner } from '../ui/Loader-spinner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useToastContext } from '../context/ToastContext';
import { EstudoModal } from './EstudoModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Spinner } from '../ui/Spinner';
import { Pagination } from '../ui/Pagination';

export function EstudosManager() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudo, setSelectedEstudo] = useState<Estudo | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchEstudos();
  }, [currentPage]);

  const fetchEstudos = async () => {
    try {
      setLoading(true);
      
      // Fetch total count
      const { count } = await supabase
        .from('estudos')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Fetch paginated data
      const { data, error } = await supabase
        .from('estudos')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setEstudos(data || []);
    } catch (error) {
      console.error('Error fetching estudos:', error);
      addToast('Não foi possível carregar os estudos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (estudo: Estudo) => {
    try {
      const { error } = await supabase
        .from('estudos')
        .update({ published: !estudo.published })
        .eq('id', estudo.id);

      if (error) throw error;

      setEstudos(estudos.map(e => 
        e.id === estudo.id ? { ...e, published: !e.published } : e
      ));

      addToast(`Estudo ${estudo.published ? 'despublicado' : 'publicado'} com sucesso`, 'success');
    } catch (error) {
      console.error('Error toggling publish:', error);
      addToast('Não foi possível alterar o status do estudo', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('estudos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEstudos(estudos.filter(e => e.id !== id));
      addToast('Estudo excluído com sucesso', 'success');
    } catch (error) {
      console.error('Error deleting estudo:', error);
      addToast('Não foi possível excluir o estudo', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Estudos de Células</h2>
        <button
          onClick={() => {
            setSelectedEstudo(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Estudo</span>
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estudos.map((estudo) => (
              <tr key={estudo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{estudo.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(estudo.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    estudo.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {estudo.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedEstudo(estudo);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(estudo)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                      title={estudo.published ? 'Despublicar' : 'Publicar'}
                    >
                      {estudo.published ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setItemToDelete(estudo.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                      title="Excluir"
                      disabled={deletingId === estudo.id}
                    >
                      {deletingId === estudo.id ? (
                        <Spinner className="w-5 h-5" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <EstudoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEstudo(null);
        }}
        estudo={selectedEstudo}
        onSuccess={fetchEstudos}
      />

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete);
            setItemToDelete(null);
          }
        }}
        itemName="este estudo"
      />
    </div>
  );
} 