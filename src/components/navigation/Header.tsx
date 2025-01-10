import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MenuItem } from '../../types/navigation';

interface HeaderProps {
  menuItems: MenuItem[];
}

export function Header({ menuItems }: HeaderProps) {
  return (
    <>
      {/* Spacer div to prevent content jump when header becomes fixed */}
      <div className="h-[63px] md:block hidden" />
      
      <header className="bg-primary text-white fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <DesktopNav menuItems={menuItems} />
          </div>
        </div>
      </header>
    </>
  );
}