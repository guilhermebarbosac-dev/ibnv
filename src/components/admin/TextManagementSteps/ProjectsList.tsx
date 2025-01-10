import { motion } from 'framer-motion';
import { Copy, Edit2, Trash2, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data: Record<string, string>;
}

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onCopy: (project: Project) => void;
  onNew: () => void;
}

export function ProjectsList({ projects, onEdit, onDelete, onCopy, onNew }: ProjectsListProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projetos de Texto Sites</h2>
        <button
          onClick={onNew}
          className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
        >
          <Plus size={20} />
          <span>Novo Projeto</span>
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{project.name}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Criado em: {formatDate(project.created_at)}</p>
                  <p>Última atualização: {formatDate(project.updated_at)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 text-gray-600 hover:text-secondary hover:bg-gray-100 rounded-md"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onCopy(project)}
                  className="p-2 text-gray-600 hover:text-secondary hover:bg-gray-100 rounded-md"
                  title="Duplicar"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => onDelete(project)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum projeto encontrado</p>
            <p className="text-sm">Clique em "Novo Projeto" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
