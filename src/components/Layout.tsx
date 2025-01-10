import { Link, Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-black z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <img
                src="/logo-white.png"
                alt="IBNV Logo"
                className="h-16 w-auto"
              />
            </Link>

            <div className="flex items-center">
              <Navigation />
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}