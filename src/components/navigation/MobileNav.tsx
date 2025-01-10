import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types/navigation';

interface MobileNavProps {
  menuItems: MenuItem[];
}

export function MobileNav({ menuItems }: MobileNavProps) {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Início', onClick: handleClick },
    { path: '/agenda', icon: Calendar, label: 'Agenda', onClick: handleClick },
    { path: '/downloads', icon: FileText, label: 'Arquivos', onClick: handleClick },
  ];

  const moreItems = menuItems.filter(item => 
    !mainNavItems.some(mainItem => mainItem.path === item.path)
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary z-50">
        <div className="flex justify-center py-2">
          <Link to="/" onClick={handleClick}>
            <img
              src="/logo.png"
              alt="Igreja Batista Nova Vida"
              className="h-8"
            />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary z-50">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex justify-between w-full">
            {mainNavItems.map(({ path, icon: Icon, label, onClick }) => (
              <Link
                key={path}
                to={path}
                onClick={onClick}
                className={`flex flex-col items-center ${
                  location.pathname === path ? 'text-secondary' : 'text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex flex-col items-center text-white hover:text-secondary"
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-xs mt-1">Mais</span>
            </button>
          </div>
        </div>
      </nav>

      {/* More Menu */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="md:hidden fixed bottom-0 rounded-2xl left-0 right-0 bg-primary z-40"
          >
            <div className="flex flex-col mb-16 p-4 gap-4">
              {moreItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-white hover:text-secondary py-2 px-4 rounded-lg"
                  onClick={() => {
                    setShowMore(false);
                    handleClick();
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}