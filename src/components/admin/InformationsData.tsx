import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToastContext } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Loader } from '../ui/Loader';
import { StepIndicator } from './TextManagementSteps/StepIndicator';
import { HomeSection } from './TextManagementSteps/HomeSection';
import { ProjectModal } from './TextManagementSteps/ProjectModal';
import { ArrowLeft, Copy, FileText, Pen, Plus } from 'lucide-react';
import { getEmptySteps, populateStepsWithData, type Step } from './TextManagementSteps/stepsConfig';
import { DeleteProjectModal } from './TextManagementSteps/DeleteProjectModal';
import { UnsavedChangesModal } from './TextManagementSteps/UnsavedChangesModal';

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data: Record<string, string>;
}

export function InformationsData() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectView, setIsProjectView] = useState(true);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastContext();
  const [steps, setSteps] = useState<Step[]>(getEmptySteps());

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      addToast('Erro ao carregar projetos', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleNewProject = () => {
    setSteps(getEmptySteps());
    setEditingProject(null);
    setCurrentStep(1);
    setIsProjectView(false);
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setSteps(populateStepsWithData(project.data));
    setCurrentStep(1);
    setIsProjectView(false);
  };

  async function handleProjectSave(projectName?: string) {
    try {
      setLoading(true);
      
      const formData: Record<string, string> = {};
      steps.forEach(step => {
        step.inputs.forEach(input => {
          formData[input.key] = input.value;
        });
      });

      if (editingProject) {
        const { error } = await supabase
          .from('text_projects')
          .update({
            data: formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        addToast('Projeto atualizado com sucesso!', 'success');
      } else {
        if (!projectName) {
          setShowProjectModal(true);
          setLoading(false);
          return;
        }

        const { error } = await supabase
          .from('text_projects')
          .insert([{
            name: projectName.trim(),
            data: formData
          }]);

        if (error) throw error;
        addToast('Projeto salvo com sucesso!', 'success');
      }

      setShowProjectModal(false);
      setEditingProject(null);
      setIsProjectView(true);
      await fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      addToast('Erro ao salvar o projeto', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  async function handleProjectDelete() {
    if (!projectToDelete) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('text_projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) throw error;
      
      addToast('Projeto excluído com sucesso!', 'success');
      setShowDeleteModal(false);
      setProjectToDelete(null);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      addToast('Erro ao excluir o projeto', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleProjectCopy(project: Project) {
    try {
      setLoading(true);
      const newProjectData = {
        name: `${project.name} (Cópia)`,
        data: project.data,
      };

      const { error } = await supabase
        .from('text_projects')
        .insert([newProjectData]);

      if (error) throw error;
      
      addToast('Projeto duplicado com sucesso!', 'success');
      await fetchProjects();
    } catch (error) {
      console.error('Error copying project:', error);
      addToast('Erro ao duplicar o projeto', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleStepComplete = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      if (editingProject) {
        handleProjectSave();
      } else {
        setShowProjectModal(true);
      }
    }
  };

  const handleBackClick = () => {
    setShowUnsavedModal(true);
  };

  const handleConfirmBack = () => {
    setIsProjectView(true);
    setEditingProject(null);
    setCurrentStep(1);
    setShowUnsavedModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isProjectView) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">
                Estrutura de Textos
              </h2>
            </div>
            <button
              onClick={handleNewProject}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Estrutura</span>
            </button>
          </div>

          <div className="p-4">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhuma estrutura cadastrada
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando uma nova estrutura.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Última atualização: {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleProjectEdit(project)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleProjectCopy(project)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DeleteProjectModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
          }}
          onConfirm={handleProjectDelete}
          projectName={projectToDelete?.name || ''}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-sm font-medium text-gray-900">
              {editingProject ? editingProject.name : 'Novo Projeto de Textos'}
            </h2>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="p-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepClick={setCurrentStep}
          />

          {steps.map((step, index) => (
            currentStep === index + 1 && (
              <HomeSection
                key={step.id}
                title={step.title}
                description={step.description}
                inputs={step.inputs}
                onComplete={handleStepComplete}
              />
            )
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleProjectSave}
      />

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={handleConfirmBack}
      />
    </motion.div>
  );
}
