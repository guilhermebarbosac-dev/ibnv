import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useToastContext } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { Loader } from '../../ui/Loader';
import { Eye, EyeOff, Trash2, FileSpreadsheet, ExternalLink } from 'lucide-react';

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
  created_at: string;
  responses_count?: number;
}

export function FormsList() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToastContext();
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [togglingFormId, setTogglingFormId] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const { data: formsData, error: formsError } = await supabase
        .from('dynamic_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (formsError) throw formsError;

      // Fetch response counts for each form
      const formsWithCounts = await Promise.all(
        (formsData || []).map(async (form) => {
          const { count } = await supabase
            .from('form_responses')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', form.id);

          return {
            ...form,
            responses_count: count || 0
          };
        })
      );

      setForms(formsWithCounts);
    } catch (error) {
      console.error('Error fetching forms:', error);
      addToast('Erro ao carregar formulários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (form: DynamicForm) => {
    setTogglingFormId(form.id);
    try {
      const { error } = await supabase
        .from('dynamic_forms')
        .update({ active: !form.active })
        .eq('id', form.id);

      if (error) throw error;

      setForms(forms.map(f => 
        f.id === form.id ? { ...f, active: !f.active } : f
      ));
      
      addToast(
        `Formulário ${!form.active ? 'ativado' : 'desativado'} com sucesso!`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling form status:', error);
      addToast('Erro ao alterar status do formulário', 'error');
    } finally {
      setTogglingFormId(null);
    }
  };

  const deleteForm = async (form: DynamicForm) => {
    setDeletingFormId(form.id);
    try {
      const { error } = await supabase
        .from('dynamic_forms')
        .delete()
        .eq('id', form.id);

      if (error) throw error;

      setForms(forms.filter(f => f.id !== form.id));
      addToast('Formulário excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Error deleting form:', error);
      addToast('Erro ao excluir formulário', 'error');
    } finally {
      setDeletingFormId(null);
    }
  };

  const exportResponses = async (formId: string) => {
    try {
      // Fetch form information
      const { data: formData, error: formError } = await supabase
        .from('dynamic_forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (formError) throw formError;

      // Fetch all responses
      const { data: responses, error: responsesError } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: true });

      if (responsesError) throw responsesError;

      // Prepare headers - just the field labels in order
      const headers = formData.fields.map((field: FormField) => field.label);

      // Prepare rows - just the field values in order
      const rows = responses.map(response => {
        return formData.fields.map((field: FormField) => {
          const value = response.data[field.id];
          // Handle empty values
          return value || '';
        });
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_respostas.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting responses:', error);
      addToast('Erro ao exportar respostas', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum formulário criado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt={form.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{form.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {new Date(form.created_at).toLocaleDateString()}
                  </span>
                  <span>{form.responses_count} respostas</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleFormStatus(form)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors"
                      title={form.active ? 'Desativar' : 'Ativar'}
                      disabled={togglingFormId === form.id}
                    >
                      {togglingFormId === form.id ? (
                        <Loader size={20} />
                      ) : form.active ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteForm(form)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Excluir"
                      disabled={deletingFormId === form.id}
                    >
                      {deletingFormId === form.id ? (
                        <Loader size={20} />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                    {form?.responses_count && form.responses_count > 0 && (
                      <button
                        onClick={() => exportResponses(form.id)}
                        className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                        title="Exportar respostas"
                      >
                        <FileSpreadsheet size={20} />
                      </button>
                    )}
                  </div>
                  
                  <a
                    href={`/formulario/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
                  >
                    <span>Ver formulário</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
