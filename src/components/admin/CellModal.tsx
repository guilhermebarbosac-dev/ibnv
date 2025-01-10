import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToastContext } from '../context/ToastContext';
import { X, MapPin, User, Phone, Clock, FileText } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { Spinner } from '../ui/Spinner';

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

interface CellModalProps {
  isOpen: boolean;
  onClose: () => void;
  cell: Cell | null;
  onSuccess: () => void;
}

export function CellModal({ isOpen, onClose, cell, onSuccess }: CellModalProps) {
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [schedule, setSchedule] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastContext();

  useEffect(() => {
    if (cell) {
      setAddress(cell.address);
      setNeighborhood(cell.neighborhood);
      setSchedule(cell.schedule);
      setLeaderName(cell.leader_name);
      setLeaderPhone(cell.leader_phone);
      setImageUrl(cell.image_url);
    } else {
      resetForm();
    }
  }, [cell]);

  const resetForm = () => {
    setAddress('');
    setNeighborhood('');
    setSchedule('');
    setLeaderName('');
    setLeaderPhone('');
    setImageUrl('');
    setShowImageUpload(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const cellData = {
        address,
        neighborhood,
        schedule,
        leader_name: leaderName,
        leader_phone: leaderPhone,
        image_url: imageUrl,
      };

      if (cell) {
        const { error } = await supabase
          .from('cells')
          .update(cellData)
          .eq('id', cell.id);

        if (error) throw error;
        addToast('Célula atualizada com sucesso', 'success');
      } else {
        const { error } = await supabase
          .from('cells')
          .insert([cellData]);

        if (error) throw error;
        addToast('Célula criada com sucesso', 'success');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving cell:', error);
      addToast('Não foi possível salvar a célula', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {cell ? 'Editar Célula' : 'Nova Célula'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem da Célula
              </label>
              {showImageUpload ? (
                <div className="space-y-4">
                  <ImageUpload
                    folder="cells"
                    onUpload={(url) => {
                      setImageUrl(url);
                      setShowImageUpload(false);
                    }}
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
                      <FileText className="w-5 h-5" />
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
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                Horário
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  placeholder="Ex: Terças às 19:30"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="leaderName" className="block text-sm font-medium text-gray-700">
                Nome do Líder
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="leaderName"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-700">
                Telefone do Líder
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute left-4 top-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  id="leaderPhone"
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  placeholder="Ex: 11999999999"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                  </div>
                ) : (
                  cell ? 'Salvar' : 'Criar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 