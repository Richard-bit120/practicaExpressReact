import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const navItems = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "📊" },
  { path: ROUTES.BOOKS, label: "Libros", icon: "📚" },
  { path: ROUTES.AUTHORS, label: "Autores", icon: "✍️" },
  { path: ROUTES.GENRES, label: "Géneros", icon: "🏷️" },
  { path: ROUTES.SAGAS, label: "Sagas", icon: "📖" },
  { path: ROUTES.SHELVES, label: "Estantes", icon: "🗄️" },
  { path: ROUTES.LOGS, label: "Logs", icon: "📋" },
];

export const Sidebar = () => (
  <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
    <div className="p-6 border-b border-gray-700">
      <h2 className="text-xl font-bold">📚 Biblioteca</h2>
      <p className="text-xs text-gray-400 mt-1">Sistema de Gestión</p>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
