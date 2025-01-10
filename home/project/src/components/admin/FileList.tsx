import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FileItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  created_at: string;
}

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;

    try {
      // Delete from storage
      const filePath = new URL(fileUrl).pathname.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('downloads')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Erro ao excluir arquivo');
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex-1">
            <h3 className="font-medium">{file.title}</h3>
            {file.description && (
              <p className="text-sm text-gray-500">{file.description}</p>
            )}
            <p className="text-xs text-gray-400">
              {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Visualizar
            </a>
            <button
              onClick={() => handleDelete(file.id, file.file_url)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}