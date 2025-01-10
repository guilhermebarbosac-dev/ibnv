import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface PathBreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function PathBreadcrumb({ currentPath, onNavigate }: PathBreadcrumbProps) {
  const pathParts = currentPath.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6 overflow-x-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => onNavigate('')}
        className="flex items-center space-x-1 p-2 hover:text-secondary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </motion.button>

      {pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join('/');
        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate(path)}
              className="p-2 hover:text-secondary transition-colors"
            >
              {part}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}