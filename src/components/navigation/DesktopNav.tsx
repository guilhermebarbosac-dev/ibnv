import { Link, useLocation } from 'react-router-dom';
import { MenuItem } from '../../types/navigation';

interface DesktopNavProps {
  menuItems: MenuItem[];
}

export function DesktopNav({ menuItems }: DesktopNavProps) {
  const location = useLocation();

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <nav className="hidden md:flex items-center justify-end flex-1">
      <div className="flex items-center gap-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleClick}
            className={`text-white hover:text-secondary transition-colors duration-200 text-sm font-medium ${
              location.pathname === item.path ? 'text-secondary' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}