import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img
        src="/logo.png"
        alt="Igreja Batista Nova Vida"
        className="h-8"
      />
    </Link>
  );
}