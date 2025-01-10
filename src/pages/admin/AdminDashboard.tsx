import { useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EventManager } from '../../components/admin/EventManager';
import { FileManager } from '../../components/admin/FileManager';
import { NetworkManager } from '../../components/admin/NetworkManager';
import { SlideManager } from '../../components/admin/SlideManager';
import { EstudosManager } from '../../components/admin/EstudosManager';
import { useSession } from '../../hooks/useSession';
import { InformationsData } from '../../components/admin/InformationsData';
import { DynamicForms } from '../../components/admin/DynamicForms';
import { IbnvMusicManager } from '../../components/admin/IbnvMusicManager';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Calendar, 
  Share2, 
  FileText, 
  Info, 
  FormInput,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Music,
  Users
} from 'lucide-react';
import { CalendarManager } from '../../components/admin/CalendarManager';
import { CellsManager } from '../../components/admin/CellsManager';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('slides');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useSession();

  const menuItems = [
    { id: 'slides', label: 'Slides', icon: <Image className="w-5 h-5" /> },
    { id: 'eventos', label: 'Eventos', icon: <Calendar className="w-5 h-5" /> },
    { id: 'estudos', label: 'Estudos', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'redes', label: 'Redes', icon: <Share2 className="w-5 h-5" /> },
    { id: 'arquivos', label: 'Arquivos', icon: <FileText className="w-5 h-5" /> },
    { id: 'informações site', label: 'Informações', icon: <Info className="w-5 h-5" /> },
    { id: 'formulários', label: 'Formulários', icon: <FormInput className="w-5 h-5" /> },
    { id: 'calendar', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
    { id: 'ibnv-music', label: 'IBNV Music', icon: <Music className="w-5 h-5" /> },
    { id: 'cells', label: 'Células', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <AdminHeader />
      
      <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-900 font-medium">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{menuItems.find(item => item.id === activeTab)?.label}</span>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mb-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl text-sm transition-all ${
                      activeTab === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block mb-8">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                    : 'text-gray-600 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="p-8">
            {activeTab === 'slides' && <SlideManager />}
            {activeTab === 'eventos' && <EventManager />}
            {activeTab === 'estudos' && <EstudosManager />}
            {activeTab === 'redes' && <NetworkManager />}
            {activeTab === 'arquivos' && <FileManager />}
            {activeTab === 'informações site' && <InformationsData />}
            {activeTab === 'formulários' && <DynamicForms />}
            {activeTab === 'calendar' && <CalendarManager />}
            {activeTab === 'ibnv-music' && <IbnvMusicManager />}
            {activeTab === 'cells' && <CellsManager />}
          </div>
        </div>
      </div>
    </div>
  );
}