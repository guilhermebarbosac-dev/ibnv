import { Dialog } from '@headlessui/react';
import { Loader2, AlertTriangle, Folder, FileText } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Array<{
    name: string;
    progress: number;
    isFolder?: boolean;
    fileCount?: number;
    currentFile?: string;
    currentFileNumber?: number;
  }>;
  uploading: boolean;
  onUpload: () => void;
}

export function UploadModal({ isOpen, onClose, files, uploading, onUpload }: UploadModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (!uploading) onClose();
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4 flex items-center justify-between text-gray-800">
            {uploading ? (
              <>
                Upload em Andamento
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              </>
            ) : (
              <>
                Confirmar Upload
                <AlertTriangle className="w-5 h-5 text-gray-600" />
              </>
            )}
          </Dialog.Title>

          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  {file.isFolder ? (
                    <Folder className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="truncate text-sm text-gray-700">
                        {file.isFolder ? (
                          <>
                            {file.name} 
                            <span className="text-gray-500">
                              ({file.fileCount} {file.fileCount === 1 ? 'arquivo' : 'arquivos'})
                            </span>
                          </>
                        ) : (
                          file.name
                        )}
                      </span>
                    </div>
                    {uploading && (
                      <>
                        {file.isFolder && file.currentFile && (
                          <div className="text-xs text-gray-500 mt-1">
                            Enviando: {file.currentFile} ({file.currentFileNumber}/{file.fileCount})
                          </div>
                        )}
                        <div className="h-2 bg-gray-300 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-gray-600 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {!uploading && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={onUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Iniciar Upload
                </button>
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}