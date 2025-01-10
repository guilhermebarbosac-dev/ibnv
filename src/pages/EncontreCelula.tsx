import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LoaderSpinner } from '../components/ui/Loader-spinner';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { Users } from 'lucide-react';

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
  cell: Cell;
  isOpen: boolean;
  onClose: () => void;
}

function CellModal({ cell, isOpen, onClose }: CellModalProps) {
  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    const phoneNumber = cell.leader_phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-md sm:my-8 sm:align-middle sm:p-6">
          <div className="relative">
            <img
              src={cell.image_url}
              alt={`Célula em ${cell.neighborhood}`}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Célula em {cell.neighborhood}
              </h3>
              <p className="text-gray-600">{cell.address}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Horário</h4>
              <p className="text-gray-600">{cell.schedule}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">Líder</h4>
              <p className="text-gray-600">{cell.leader_name}</p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Entrar em contato via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EncontreCelula() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const { data, error } = await supabase
        .from('cells')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCells(data || []);
    } catch (error) {
      console.error('Error fetching cells:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!cells || cells.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-7xl w-full">
          <EmptyState
            icon={Users}
            title="Nenhuma célula disponível"
            message="No momento não há células cadastradas."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <motion.div
        className="mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-12 w-full"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-4">
            Encontre uma Célula
          </h1>
          <p className="text-xl text-gray-600">
            Conecte-se com uma de nossas células e faça parte desta família
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
          variants={itemVariants}
        >
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              className="bg-white rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-all duration-300 shadow-md w-full"
              onClick={() => setSelectedCell(cell)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={cell.image_url}
                alt={`Célula em ${cell.neighborhood}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Célula em {cell.neighborhood}
                </h3>
                <p className="text-gray-600 mb-4">{cell.address}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 w-full">
                  <span>{cell.schedule}</span>
                  <span>Líder: {cell.leader_name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {selectedCell && (
        <CellModal
          cell={selectedCell}
          isOpen={!!selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
} 