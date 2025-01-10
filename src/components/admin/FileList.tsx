import { useState, useEffect } from 'react';
import { FileText, Folder, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FileItem } from '../../hooks/useFiles';
import { Pagination } from '../ui/Pagination';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface FileListProps {
  files: FileItem[];
  onFolderClick: (path: string) => void;
  onDelete: (id: string) => void;
}

export function FileList({ files, onFolderClick, onDelete }: FileListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<{ path: string; isFolder: boolean } | null>(null);

  const totalPages = Math.ceil(files.length / itemsPerPage);

  // Ajusta a página atual se ela exceder o número total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [files.length, totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  async function listFolderContents(folderPath: string): Promise<string[]> {
    const allPaths: string[] = [];
    
    try {
      const { data, error } = await supabase.storage
        .from('downloads')
        .list(folderPath);

      if (error) throw error;

      for (const item of data) {
        const fullPath = `${folderPath}${item.name}`;
        if (!item.metadata) {
          const subPaths = await listFolderContents(`${fullPath}/`);
          allPaths.push(...subPaths);
        }
        allPaths.push(fullPath);
      }
    } catch (error) {
      console.error('Error listing folder contents:', error);
      throw error;
    }

    return allPaths;
  }

  async function handleDelete(path: string, isFolder: boolean) {
    setDeletingIds(prev => [...prev, path]);
    try {
      if (isFolder) {
        const paths = await listFolderContents(`${path}/`);
        for (const filePath of paths.reverse()) {
          await supabase.storage
            .from('downloads')
            .remove([filePath]);
        }
        await supabase.storage
          .from('downloads')
          .remove([path]);
      } else {
        const { error } = await supabase.storage
          .from('downloads')
          .remove([path]);
        if (error) throw error;
      }
      onDelete(path);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingIds(prev => prev.filter(itemId => itemId !== path));
    }
  }

  function formatFileSize(bytes?: number): string {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum arquivo encontrado nesta pasta.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentFiles.map((file) => (
        <div
          key={file.path}
          className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors"
        >
          {file.isFolder ? (
            <>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Folder className="w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={() => onFolderClick(file.path)}
                className="flex-1 text-left text-gray-600 hover:text-gray-900 ml-3 truncate"
              >
                {file.name}
              </button>
            </>
          ) : (
            <>
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 ml-3 min-w-0">
                <div className="text-gray-600 truncate">{file.name}</div>
                <div className="text-sm text-gray-400">
                  {formatFileSize(file.size)}
                </div>
              </div>
            </>
          )}
          <button
            onClick={() => setItemToDelete({ path: file.path, isFolder: file.isFolder })}
            disabled={deletingIds.includes(file.path)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {deletingIds.includes(file.path) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete.path, itemToDelete.isFolder);
            setItemToDelete(null);
          }
        }}
        itemName={itemToDelete?.isFolder ? "esta pasta" : "este arquivo"}
      />
    </div>
  );
}