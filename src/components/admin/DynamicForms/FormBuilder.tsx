import { useState } from 'react';
import { Trash2, Image as ImageIcon, Type, List, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useToastContext } from '../../context/ToastContext';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'image';
  label: string;
  options?: string[];
  required: boolean;
}

interface FormConfig {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  fields: FormField[];
  createdAt?: string;
  active: boolean;
}

const defaultFormConfig: FormConfig = {
  title: '',
  description: '',
  imageUrl: '',
  fields: [],
  active: true
};

export function FormBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>(defaultFormConfig);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastContext();

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: '',
      required: false,
      ...(type === 'select' ? { options: [''] } : {})
    };

    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleFieldChange = (id: string, changes: Partial<FormField>) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...changes } : field
      )
    }));
  };

  const handleRemoveField = (id: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formId = crypto.randomUUID();
      
      const formData = {
        id: formId,
        title: formConfig.title,
        description: formConfig.description,
        image_url: formConfig.imageUrl,
        fields: formConfig.fields,
        active: formConfig.active,
        created_at: new Date().toISOString()
      };

      console.log('Criando formulário:', formData);
      
      const { data, error } = await supabase
        .from('dynamic_forms')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar formulário:', error);
        throw error;
      }

      console.log('Formulário criado:', data);

      addToast('Formulário criado com sucesso!', 'success');
      setFormConfig(defaultFormConfig);
      
      return data?.id;
    } catch (error) {
      console.error('Error creating form:', error);
      addToast('Erro ao criar formulário', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Form Header */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título do Formulário"
            className="w-full px-4 py-2 text-xl font-semibold border-b-2 border-gray-200 focus:border-primary focus:outline-none"
            value={formConfig.title}
            onChange={e => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Descrição do formulário"
            className="w-full px-4 py-2 text-gray-600 border-b-2 border-gray-200 focus:border-primary focus:outline-none resize-none"
            value={formConfig.description}
            onChange={e => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
          />
          <input
            type="url"
            placeholder="URL da imagem (opcional)"
            className="w-full px-4 py-2 text-gray-600 border-b-2 border-gray-200 focus:border-primary focus:outline-none"
            value={formConfig.imageUrl}
            onChange={e => setFormConfig(prev => ({ ...prev, imageUrl: e.target.value }))}
          />
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {formConfig.fields.map((field) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 rounded-lg relative group"
            >
              <button
                onClick={() => handleRemoveField(field.id)}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome do campo"
                  className="w-full px-3 py-2 border rounded-md"
                  value={field.label}
                  onChange={e => handleFieldChange(field.id, { label: e.target.value })}
                />

                {field.type === 'select' && (
                  <div className="space-y-2">
                    {field.options?.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        placeholder={`Opção ${optionIndex + 1}`}
                        className="w-full px-3 py-2 border rounded-md"
                        value={option}
                        onChange={e => {
                          const newOptions = [...(field.options || [])];
                          newOptions[optionIndex] = e.target.value;
                          handleFieldChange(field.id, { options: newOptions });
                        }}
                      />
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(field.options || []), ''];
                        handleFieldChange(field.id, { options: newOptions });
                      }}
                      className="text-primary hover:text-primary-dark text-sm"
                    >
                      + Adicionar opção
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`required-${field.id}`}
                    checked={field.required}
                    onChange={e => handleFieldChange(field.id, { required: e.target.checked })}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor={`required-${field.id}`} className="text-sm text-gray-600">
                    Campo obrigatório
                  </label>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Field Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddField('text')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Type size={18} />
            <span>Texto</span>
          </button>
          <button
            onClick={() => handleAddField('textarea')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Type size={18} />
            <span>Área de Texto</span>
          </button>
          <button
            onClick={() => handleAddField('select')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <List size={18} />
            <span>Seleção</span>
          </button>
          <button
            onClick={() => handleAddField('date')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Calendar size={18} />
            <span>Data</span>
          </button>
          <button
            onClick={() => handleAddField('image')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <ImageIcon size={18} />
            <span>Imagem</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !formConfig.title}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Formulário'}
          </button>
        </div>
      </div>
    </div>
  );
}
