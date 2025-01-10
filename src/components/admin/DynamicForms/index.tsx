import { useState } from 'react';
import { FormBuilder } from './FormBuilder';
import { FormsList } from './FormsList';
import { motion } from 'framer-motion';
import { Plus, List } from 'lucide-react';

export function DynamicForms() {
  const [view, setView] = useState<'list' | 'create'>('list');

  return (
    <div className="p-6">
      <div className=" max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-8">
          <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl text-center sm:text-left">
            {view === 'list' ? 'Formulários Dinâmicos' : 'Criar Novo Formulário'}
          </h1>
          <button
            onClick={() => setView(view === 'list' ? 'create' : 'list')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            {view === 'list' ? (
              <>
                <Plus size={20} />
                <span>Criar Formulário</span>
              </>
            ) : (
              <>
                <List size={20} />
                <span>Ver Formulários</span>
              </>
            )}
          </button>
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'list' ? <FormsList /> : <FormBuilder />}
        </motion.div>
      </div>
    </div>
  );
}
