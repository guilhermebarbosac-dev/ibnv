import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FileCard } from '../components/downloads/FileCard';
import { PathBreadcrumb } from '../components/downloads/PathBreadcrumb';
import { EmptyState } from '../components/EmptyState';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

interface FileItem {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
}

export function Downloads() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // Get search parameter from URL
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('searchTerm');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  async function fetchFiles() {
    try {
      const { data, error } = await supabase.storage
        .from('downloads')
        .list(currentPath, { sortBy: { column: 'name', order: 'asc' } });

      if (error) throw error;

      const organizedFiles = data.map(item => ({
        name: item.name,
        path: `${currentPath}${item.name}`,
        isFolder: !item.metadata,
        size: item.metadata?.size
      }));

      setFiles(organizedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Não foi possível carregar os arquivos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileClick(path: string, fileName: string) {
    try {
      const { data } = await supabase.storage
        .from('downloads')
        .getPublicUrl(path);

      window.open(data.publicUrl, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
      handleDownload(path, fileName);
    }
  }

  async function handleDownload(path: string, fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from('downloads')
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erro ao baixar arquivo. Tente novamente.');
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
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

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-16">
      <motion.div 
        className="w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <LoaderSpinner />
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : files.length === 0 ? (
          <div className="py-16 px-4 sm:px-16 h-screen flex items-center justify-center">
            <div className="mx-auto">
              <EmptyState
                icon={FileText}
                title="Nenhum arquivo encontrado"
                message="Não há arquivos nesta pasta no momento."
              />
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid gap-4 md:gap-6"
            variants={containerVariants}
          >
            <motion.div 
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-4">Arquivos</h1>
              <p className="text-gray-600 text-lg md:text-2xl">
                Acesse e baixe materiais, documentos e recursos
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <PathBreadcrumb 
                currentPath={currentPath} 
                onNavigate={setCurrentPath}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md text-sm md:text-base"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </motion.div>

            {currentFiles.map((file) => (
              <motion.div key={file.path} variants={itemVariants}>
                <FileCard
                  {...file}
                  onFolderClick={(path) => setCurrentPath(`${path}/`)}
                  onFileClick={handleFileClick}
                  onDownload={handleDownload}
                />
              </motion.div>
            ))}

            {filteredFiles.length > itemsPerPage && (
              <motion.div variants={itemVariants} className="flex justify-center mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="mr-2 p-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="mx-2 p-2 text-sm md:text-base">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-2 p-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}