import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownMenu {
  label: string;
  items: DropdownItem[];
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const dropdownMenus: Record<string, DropdownMenu> = {
    'sobre-nos': {
      label: 'Sobre Nós',
      items: [
        { label: 'Quem Somos', path: '/quem-somos' },
        { label: 'Redes (ministérios)', path: '/redes' },
        { label: 'Trilho de Crescimento Espiritual', path: '/trilho-crescimento' },
        { label: 'Agenda', path: '/agenda' },
      ]
    },
    'participe': {
      label: 'Participe',
      items: [
        { label: 'Oferte e Contribua', path: '/generosidade' },
        { label: 'Pedido de oração', path: '/oracao' },
        { label: 'CET - Nova Vida', path: '/downloads' },
        { label: 'IBNV Music', path: '/music' },
      ]
    },
    'celulas': {
      label: 'Células',
      items: [
        { label: 'Estudo de Células', path: '/estudos' },
        { label: 'Encontre uma célula', path: '/encontre-celula' },
      ]
    }
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="block lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="relative w-[450px] h-full bg-white shadow-lg flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
              <Link to="/" className="text-xl font-semibold" onClick={() => setIsOpen(false)}>
                Menu
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {Object.entries(dropdownMenus).map(([key, menu]) => (
                  <div key={key} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => toggleDropdown(key)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      <span className="font-medium">{menu.label}</span>
                      {openDropdowns.includes(key) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {openDropdowns.includes(key) && (
                      <div className="pl-4 pb-2 space-y-1">
                        {menu.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
} 