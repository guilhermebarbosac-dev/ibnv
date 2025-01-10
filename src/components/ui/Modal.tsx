import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'export';
}

export function Modal({ isOpen, onClose, children, zIndex, size = 'md' }: ModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    'export': 'max-w-[1400px] max-h-[800px]'
  };

  return (
    <div className="fixed inset-0 z-50" style={{ zIndex: zIndex || 10 }}>
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        <div className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            style={{ zIndex: 10 }}
          >
            <X className="h-5 w-5 mt-4" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
} 