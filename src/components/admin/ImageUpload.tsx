import { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/supabase-admin';
import { Spinner } from '../ui/Spinner';

interface ImageUploadProps {
  folder: string;
  onUpload: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({ folder, onUpload, className = '', disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setProgress(0);
      const file = e.target.files?.[0];
      if (!file) return;

      const publicUrl = await uploadImage(file, folder, (progress) => {
        setProgress(progress);
      });
      
      onUpload(publicUrl);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => handleUpload(e as any);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  return (
    <label 
      className={`block ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        className={`relative overflow-hidden group rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging 
            ? 'border-gray-900 bg-gray-50' 
            : 'border-gray-200 hover:border-gray-900 bg-white'
        }`}
      >
        <div className="px-6 py-8">
          <div className="space-y-3 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Spinner size={40} className="mb-3 text-gray-900" />
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[2.5rem]">
                    {progress}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Enviando imagem...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-gray-50 rounded-xl mb-2 group-hover:bg-gray-100 transition-colors">
                    {isDragging ? (
                      <ImageIcon className="w-8 h-8 text-gray-900" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {isDragging ? 'Solte a imagem aqui' : 'Clique para fazer upload'}
                    </span>
                    <p className="mt-1 text-gray-500">
                      ou arraste e solte
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG ou GIF até 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || uploading}
      />
    </label>
  );
}