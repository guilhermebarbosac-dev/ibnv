import { FileText, Folder, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileCardProps {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
  onFolderClick: (path: string) => void;
  onFileClick: (path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
}

export function FileCard({
  name,
  path,
  isFolder,
  size,
  onFolderClick,
  onFileClick,
  onDownload
}: FileCardProps) {
  function formatFileSize(bytes?: number): string {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  const handleFileClick = () => {
    if (isFolder) {
      onFolderClick(path);
    } else {
      onFileClick(path, name);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200"
    >
      <div 
        className="p-1.5 sm:p-4 cursor-pointer flex items-center justify-between gap-1.5"
        onClick={handleFileClick}
      >
        <div className="flex items-center gap-1.5 sm:gap-4 flex-1 min-w-0">
          <div className={`p-1 sm:p-3 rounded-lg ${isFolder ? 'bg-secondary/10' : 'bg-gray-100'}`}>
            {isFolder ? (
              <Folder className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-secondary" />
            ) : (
              <FileText className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-base font-semibold text-gray-900 truncate">{name}</h3>
            {!isFolder && size && (
              <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{formatFileSize(size)}</p>
            )}
          </div>
        </div>
        {!isFolder && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(path, name);
            }}
            className="p-1 sm:p-2 text-gray-500 hover:text-secondary bg-gray-100 rounded-full flex-shrink-0"
            title="Download"
          >
            <Download className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}