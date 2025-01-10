import { useState, useRef } from 'react';
import { Upload, Folder, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FileUploadFormProps {
  onSuccess: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  title: string;
}

export function FileUploadForm({ onSuccess }: FileUploadFormProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setUploadingFiles(files.map(file => ({
      file,
      progress: 0,
      title: file.name
    })));
  }

  async function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setUploadingFiles(files.map(file => ({
      file,
      progress: 0,
      title: file.webkitRelativePath || file.name
    })));
  }

  async function uploadFile(file: File, relativePath: string, onProgress: (progress: number) => void) {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const folderPath = `${year}/${month}`;
      const fileName = `${folderPath}/${relativePath}`;

      // Upload file with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('downloads')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            onProgress(percentage);
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('downloads')
        .getPublicUrl(fileName);

      // Insert record in database
      const { error: dbError } = await supabase.from('downloads').insert({
        title: relativePath,
        file_url: publicUrl,
        file_type: file.name.split('.').pop() || '',
        month: String(month),
        year
      });

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async function handleUpload() {
    if (uploadingFiles.length === 0) return;
    setUploading(true);

    try {
      await Promise.all(uploadingFiles.map(async ({ file, title }, index) => {
        await uploadFile(file, title, (progress) => {
          setUploadingFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress } : f
          ));
        });
      }));

      setUploadingFiles([]);
      onSuccess();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Erro ao enviar arquivos. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  function removeFile(index: number) {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <Upload className="mx-auto h-12 w-12" />
            <span className="mt-2 block text-sm text-gray-600">Upload de arquivos</span>
            <input
              type="file"
              className="sr-only"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </label>
        </div>
        <div className="flex-1">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <Folder className="mx-auto h-12 w-12" />
            <span className="mt-2 block text-sm text-gray-600">Upload de pasta</span>
            <input
              type="file"
              className="sr-only"
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderSelect}
              ref={folderInputRef}
            />
          </label>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Arquivos selecionados:</h3>
          {uploadingFiles.map((file, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm truncate">{file.title}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {uploading ? 'Enviando...' : 'Enviar Arquivos'}
          </button>
        </div>
      )}
    </div>
  );
}