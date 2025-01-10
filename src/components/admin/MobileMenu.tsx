import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  Image as ImageIcon,
  Calendar,
  Clock,
  FolderIcon,
  Share2,
  FileText,
  Info
} from 'lucide-react';

interface MenuItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

const menuItems: MenuItem[] = [
  { to: '/admin/slides', label: 'Slides', icon: <ImageIcon className="w-5 h-5" /> },
  { to: '/admin/events', label: 'Eventos', icon: <Calendar className="w-5 h-5" /> },
  { to: '/admin/schedule', label: 'Programação', icon: <Clock className="w-5 h-5" /> },
  { to: '/admin/networks', label: 'Redes', icon: <Share2 className="w-5 h-5" /> },
  { to: '/admin/files', label: 'Arquivos', icon: <FolderIcon className="w-5 h-5" /> },
  { to: '/admin/informations', label: 'Informações', icon: <Info className="w-5 h-5" /> },
  { to: '/admin/forms', label: 'Formulários', icon: <FileText className="w-5 h-5" /> },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Botão do menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* Menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu content */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto py-20 px-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = window.location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 