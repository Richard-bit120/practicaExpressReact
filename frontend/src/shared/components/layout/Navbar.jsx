import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-800 text-white font-semibold'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título de la aplicación */}
          <div className="flex items-center gap-2">
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 text-xl font-bold tracking-wide">
              <svg
                className="w-7 h-7 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Biblioteca</span>
            </Link>
          </div>

          {/* Enlaces de Navegación */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to={ROUTES.BOOKS} className={navLinkClass}>
              Libros
            </NavLink>
            <NavLink to={ROUTES.AUTHORS} className={navLinkClass}>
              Autores
            </NavLink>
            <NavLink to={ROUTES.GENRES} className={navLinkClass}>
              Géneros
            </NavLink>
            <NavLink to={ROUTES.SAGAS} className={navLinkClass}>
              Sagas
            </NavLink>
            <NavLink to={ROUTES.SHELVES} className={navLinkClass}>
              Estantes
            </NavLink>
            <NavLink to={ROUTES.LOGS} className={navLinkClass}>
              Logs
            </NavLink>
          </div>

          {/* Información del usuario y Botón de Salir */}
          <div className="flex items-center gap-4">
            {admin && (
              <span className="text-xs md:text-sm text-blue-200 bg-blue-800 px-3 py-1 rounded-full">
                {admin.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}