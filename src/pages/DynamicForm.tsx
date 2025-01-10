import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Loader } from '../components/ui/Loader';

interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[];
  required: boolean;
}

interface DynamicForm {
  id: string;
  title: string;
  description: string;
  image_url: string;
  fields: FormField[];
  active: boolean;
}

export function DynamicForm() {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dynamic_forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Formulário não encontrado');
      if (!data.active) throw new Error('Este formulário não está mais ativo');

      setForm(data);
      
      // Initialize form data with empty values
      const initialData: Record<string, string> = {};
      data.fields.forEach((field: { id: string | number; }) => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error fetching form:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      console.log('Verificando formulário:', formId);

      // Verificar se o formulário existe e está ativo
      const { data: formExists, error: formError } = await supabase
        .from('dynamic_forms')
        .select('id, active')
        .eq('id', formId)
        .single();

      if (formError) {
        console.error('Erro ao verificar formulário:', formError);
        throw new Error('Formulário não encontrado.');
      }

      if (!formExists) {
        console.error('Formulário não encontrado:', formId);
        throw new Error('Formulário não encontrado.');
      }

      if (!formExists.active) {
        console.error('Formulário inativo:', formId);
        throw new Error('Este formulário não está mais ativo.');
      }

      console.log('Formulário encontrado:', formExists);

      // Validação dos campos obrigatórios
      const missingFields = form?.fields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);

      if (missingFields && missingFields.length > 0) {
        console.error('Campos obrigatórios faltando:', missingFields);
        throw new Error(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}`);
      }

      console.log('Enviando resposta:', { form_id: formId, data: formData });

      const { error: submitError } = await supabase
        .from('form_responses')
        .insert([{
          form_id: formId,
          data: formData
        }]);

      if (submitError) {
        console.error('Erro ao enviar resposta:', submitError);
        throw submitError;
      }

      console.log('Resposta enviada com sucesso!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Erro ao enviar formulário');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Resposta Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado por preencher o formulário.
          </p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Fechar
          </button>
        </motion.div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {form.image_url && (
            <img
              src={form.image_url}
              alt={form.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
            <p className="text-gray-600 mb-8">{form.description}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                      required={field.required}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                      rows={4}
                      required={field.required}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                      required={field.required}
                    >
                      <option value="">Selecione uma opção</option>
                      {field.options?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                      required={field.required}
                    />
                  )}

                  {field.type === 'image' && (
                    <input
                      type="url"
                      placeholder="URL da imagem"
                      value={formData[field.id] || ''}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
