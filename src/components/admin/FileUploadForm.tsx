import { useState, useRef } from 'react';
import { Upload, Folder } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeFilePath } from '../../utils/fileUtils';
import { UploadModal } from '../ui/UploadModal';

interface FileUploadFormProps {
  onSuccess: () => void;
  folder?: string;
  acceptedFileTypes?: string;
  maxFiles?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  path: string;
  isFolder: boolean;
  files?: File[];
  currentFile?: string;
  currentFileNumber?: number;
}

export function FileUploadForm({ 
  onSuccess, 
  folder = '', 
  acceptedFileTypes = '', 
  maxFiles = 0 
}: FileUploadFormProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Se maxFiles é definido, limitar o número de arquivos
    const selectedFiles = maxFiles > 0 ? files.slice(0, maxFiles) : files;

    setUploadingFiles(selectedFiles.map(file => ({
      file,
      progress: 0,
      path: folder ? `${folder}/${sanitizeFilePath(file.name)}` : sanitizeFilePath(file.name),
      isFolder: false
    })));
    setShowUploadModal(true);
  }

  async function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const filesByFolder = new Map<string, File[]>();
    
    files.forEach(file => {
      const path = file.webkitRelativePath;
      const [folderName] = path.split('/');
      
      if (!filesByFolder.has(folderName)) {
        filesByFolder.set(folderName, []);
      }
      filesByFolder.get(folderName)?.push(file);
    });

    const uploadingFilesList = Array.from(filesByFolder.entries()).map(([folderName, folderFiles]) => ({
      file: folderFiles[0],
      progress: 0,
      path: folder ? `${folder}/${sanitizeFilePath(folderName)}` : sanitizeFilePath(folderName),
      isFolder: true,
      files: folderFiles
    }));

    setUploadingFiles(uploadingFilesList);
    setShowUploadModal(true);
  }

  async function uploadFile(file: File, path: string, onProgress: (progress: number) => void) {
    try {
      onProgress(0);

      const progressSteps = [0,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 10));
        onProgress(step);
      }

      const { error: uploadError, data } = await supabase.storage
        .from('downloads')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;
      if (!data) throw new Error('Upload failed: No data returned');

      await new Promise(resolve => setTimeout(resolve, 10));
      onProgress(100);

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async function handleUpload() {
    if (uploadingFiles.length === 0) return;
    setUploading(true);

    try {
      await Promise.all(uploadingFiles.map(async (uploadingFile) => {
        if (uploadingFile.isFolder && uploadingFile.files) {
          for (let i = 0; i < uploadingFile.files.length; i++) {
            const file = uploadingFile.files[i];
            const relativePath = file.webkitRelativePath;
            const sanitizedPath = folder 
              ? `${folder}/${sanitizeFilePath(relativePath)}`
              : sanitizeFilePath(relativePath);
            
            setUploadingFiles(prev => prev.map(f => 
              f.path === uploadingFile.path ? { 
                ...f, 
                currentFile: file.name,
                currentFileNumber: i + 1,
                progress: 0
              } : f
            ));

            await uploadFile(file, sanitizedPath, (progress) => {
              setUploadingFiles(prev => prev.map(f => 
                f.path === uploadingFile.path ? { 
                  ...f, 
                  progress: progress,
                  currentFile: file.name,
                  currentFileNumber: i + 1
                } : f
              ));
            });

            if (i < uploadingFile.files.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        } else {
          await uploadFile(uploadingFile.file, uploadingFile.path, (progress) => {
            setUploadingFiles(prev => prev.map(f => 
              f.path === uploadingFile.path ? { ...f, progress } : f
            ));
          });
        }
      }));

      onSuccess();
      setShowUploadModal(false);
      setUploadingFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Erro ao enviar arquivos. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="relative cursor-pointer bg-white rounded-xl font-medium text-gray-600 hover:text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900">
          <div className="flex flex-col items-center justify-center h-[160px] w-full p-4 border-2 border-gray-200 border-dashed rounded-xl hover:border-gray-900 transition-colors">
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <span className="text-sm whitespace-nowrap">Upload de arquivos</span>
          </div>
          <input
            type="file"
            className="sr-only"
            multiple={maxFiles !== 1}
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </label>
        {!maxFiles && (
          <label className="relative cursor-pointer bg-white rounded-xl font-medium text-gray-600 hover:text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900">
            <div className="flex flex-col items-center justify-center h-[160px] w-full border-2 border-gray-200 border-dashed rounded-xl hover:border-gray-900 transition-colors">
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-sm whitespace-nowrap">Upload de pasta</span>
            </div>
            <input
              type="file"
              className="sr-only"
              {...{ webkitdirectory: "", directory: "" }}
              multiple
              onChange={handleFolderSelect}
              ref={folderInputRef}
            />
          </label>
        )}
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          if (!uploading) {
            setShowUploadModal(false);
            setUploadingFiles([]);
          }
        }}
        files={uploadingFiles.map(file => ({
          name: file.path,
          progress: file.progress,
          isFolder: file.isFolder,
          fileCount: file.files?.length,
          currentFile: file.currentFile,
          currentFileNumber: file.currentFileNumber
        }))}
        uploading={uploading}
        onUpload={handleUpload}
      />
    </div>
  );
}