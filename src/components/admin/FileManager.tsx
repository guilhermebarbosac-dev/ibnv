import { useState, useEffect } from 'react';
import { FileUploadForm } from './FileUploadForm';
import { FileList } from './FileList';
import { useFiles } from '../../hooks/useFiles';
import { useToastContext } from '../context/ToastContext';
import { Loader } from '../ui/Loader';
import { ChevronLeft, Upload, FolderOpen, Search } from 'lucide-react';

export function FileManager() {
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  const { files, loading, error, fetchFiles } = useFiles(currentPath);
  const { addToast } = useToastContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  function handleFolderClick(folderPath: string) {
    setPathHistory(prev => [...prev, currentPath]);
    setCurrentPath(folderPath + '/');
  }

  function handleBack() {
    const previousPath = pathHistory[pathHistory.length - 1];
    setPathHistory(prev => prev.slice(0, -1));
    setCurrentPath(previousPath);
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3">
          <FileUploadForm 
            onSuccess={() => {
              addToast('Arquivos enviados com sucesso!', 'success');
              fetchFiles();
            }}
          />
        </div>
      </div>

      {/* Path Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPath('')}
            className={`p-2 rounded-lg transition-colors ${
              currentPath === ''
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          {currentPath && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="text-sm font-medium text-gray-600">
            {currentPath ? `/${currentPath.split('/').filter(Boolean).join('/')}` : '/'}
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader />
              <p className="text-sm text-gray-500">Carregando arquivos...</p>
            </div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-xl">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum arquivo encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Faça upload de arquivos para começar.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <FileList 
              files={files.filter(file => 
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onFolderClick={handleFolderClick}
              onDelete={() => {
                addToast('Arquivo excluído com sucesso!', 'success');
                fetchFiles();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}