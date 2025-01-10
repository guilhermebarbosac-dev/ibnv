import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LoaderSpinner } from '../ui/Loader-spinner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useToastContext } from '../context/ToastContext';
import { CellModal } from '../admin/CellModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Spinner } from '../ui/Spinner';
import { Pagination } from '../ui/Pagination';

interface Cell {
  id: string;
  image_url: string;
  address: string;
  neighborhood: string;
  schedule: string;
  leader_name: string;
  leader_phone: string;
  created_at: string;
}

export function CellsManager() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchCells();
  }, [currentPage]);

  const fetchCells = async () => {
    try {
      setLoading(true);
      
      // Fetch total count
      const { count } = await supabase
        .from('cells')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Fetch paginated data
      const { data, error } = await supabase
        .from('cells')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setCells(data || []);
    } catch (error) {
      console.error('Error fetching cells:', error);
      addToast('Não foi possível carregar as células', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('cells')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCells(cells.filter(c => c.id !== id));
      addToast('Célula excluída com sucesso', 'success');
    } catch (error) {
      console.error('Error deleting cell:', error);
      addToast('Não foi possível excluir a célula', 'error');
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
        <h2 className="text-2xl font-bold text-gray-900">Células</h2>
        <button
          onClick={() => {
            setSelectedCell(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Célula</span>
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Líder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bairro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cells.map((cell) => (
              <tr key={cell.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cell.leader_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cell.neighborhood}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cell.schedule}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(cell.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCell(cell);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(cell.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                      title="Excluir"
                      disabled={deletingId === cell.id}
                    >
                      {deletingId === cell.id ? (
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

      <CellModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCell(null);
        }}
        cell={selectedCell}
        onSuccess={fetchCells}
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
        itemName="esta célula"
      />
    </div>
  );
} 