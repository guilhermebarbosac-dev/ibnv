import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownMenu {
  label: string;
  items: DropdownItem[];
}

export function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleClick = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-12" ref={navRef}>
      {Object.entries(dropdownMenus).map(([key, menu]) => (
        <div key={key} className="relative">
          <button 
            onClick={(e) => handleClick(key, e)}
            className="flex items-center space-x-2 text-lg py-6 text-white"
          >
            <span>{menu.label}</span>
            <motion.div
              initial={false}
              animate={{ rotate: openDropdown === key ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openDropdown === key && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                {menu.items.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
} 