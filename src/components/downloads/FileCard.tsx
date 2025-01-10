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
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={handleFileClick}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${isFolder ? 'bg-secondary/10' : 'bg-gray-100'}`}>
            {isFolder ? (
              <Folder className="w-8 h-8 text-secondary" />
            ) : (
              <FileText className="w-8 h-8 text-gray-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {name}
            </h3>
            {!isFolder && size && (
              <p className="text-sm text-gray-500 mt-1">
                {formatFileSize(size)}
              </p>
            )}
          </div>

          {!isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(path, name);
              }}
              className="p-2 text-gray-500 hover:text-secondary transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}