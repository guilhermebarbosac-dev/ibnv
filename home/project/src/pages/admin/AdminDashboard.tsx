import { useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FileUploadForm } from '../../components/admin/FileUploadForm';
import { FileList } from '../../components/admin/FileList';
import { EventForm } from '../../components/admin/EventForm';
import { EventList } from '../../components/admin/EventList';
import { SlideManager } from '../../components/admin/SlideManager';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('slides');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === 'slides'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('slides')}
            >
              Slides
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === 'events'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('events')}
            >
              Eventos
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === 'files'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('files')}
            >
              Arquivos
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'slides' && (
            <>
              <h2 className="text-lg font-medium mb-6">Gerenciar Slides</h2>
              <SlideManager />
            </>
          )}

          {activeTab === 'events' && (
            <>
              <h2 className="text-lg font-medium mb-6">Gerenciar Eventos</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-md font-medium mb-4">Adicionar Evento</h3>
                  <EventForm onSuccess={() => alert('Evento criado com sucesso!')} />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-4">Eventos</h3>
                  <EventList />
                </div>
              </div>
            </>
          )}

          {activeTab === 'files' && (
            <>
              <h2 className="text-lg font-medium mb-6">Gerenciar Arquivos</h2>
              <div className="grid gap-8">
                <div>
                  <h3 className="text-md font-medium mb-4">Upload de Arquivos</h3>
                  <FileUploadForm onSuccess={() => alert('Arquivos enviados com sucesso!')} />
                </div>
                <div>
                  <h3 className="text-md font-medium mb-4">Arquivos Disponíveis</h3>
                  <FileList />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}