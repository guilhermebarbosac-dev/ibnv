import { useState } from 'react';
import { NetworkForm } from './NetworkForm';
import { NetworkList } from './NetworkList';
import { useNetworks } from '../../hooks/useNetworks';
import { Plus } from 'lucide-react';
import { useToastContext } from '../context/ToastContext';

export function NetworkManager() {
  const { addToast } = useToastContext();
  const [showForm, setShowForm] = useState(false);
  const { networks, fetchNetworks } = useNetworks();

  const handleSuccess = () => {
    setShowForm(false);
    fetchNetworks();
    addToast('Rede adicionada com sucesso', 'success');
  };

  const handleDelete = () => {
    fetchNetworks();
    addToast('Rede deletada com sucesso', 'success');
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <NetworkForm
          onSuccess={handleSuccess}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          <span>Adicionar Rede</span>
        </button>
      )}

      <NetworkList networks={networks} onDelete={handleDelete} />
    </div>
  );
}