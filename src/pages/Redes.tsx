import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EmptyState } from '../components/EmptyState';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

interface Network {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export function Redes() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworks();
  }, []);

  async function fetchNetworks() {
    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .order('title');

      if (error) throw error;
      setNetworks(data || []);
    } catch (error) {
      console.error('Error fetching networks:', error);
    } finally {
      setLoading(false);
    }
  }

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

  if(loading) {
    return (
      <LoaderSpinner />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <motion.div 
        className="mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {networks.length === 0 ? (
          <div className="py-16 px-4 h-screen flex items-center justify-center">
            <div className="container mx-auto">
              <EmptyState
                icon={Users}
                title="Nenhuma rede cadastrada"
                message="No momento, não há redes disponíveis para exibição."
              />
            </div>
          </div>
        ) : (
          <>
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-4">Nossas Redes</h1>
              <p className="text-gray-600 text-lg md:text-2xl max-w-2xl mx-auto">
                Conheça nossas redes e encontre seu lugar de comunhão e crescimento
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
              variants={itemVariants}
            >
              {networks.map((network) => (
                <motion.div
                  key={network.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {network.image_url ? (
                      <img
                        src={network.image_url}
                        alt={network.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-secondary/10 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-secondary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">{network.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{network.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}