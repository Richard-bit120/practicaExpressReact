// src/shared/components/layout/MainLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Traemos el estado centralizado

export const MainLayout = () => {
  // Extraemos las funciones y datos reales del AuthContext del primer código
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar Superior */}
      <nav className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Biblioteca Admin</h1>

          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/books"
                className="hover:text-blue-300 transition-colors"
              >
                Libros
              </Link>
            </li>
            <li>
              <Link
                to="/authors"
                className="hover:text-blue-300 transition-colors"
              >
                Autores
              </Link>
            </li>
            <li>
              <Link
                to="/genres"
                className="hover:text-blue-300 transition-colors"
              >
                Géneros
              </Link>
            </li>
            <li>
              <Link
                to="/sagas"
                className="hover:text-blue-300 transition-colors"
              >
                Sagas
              </Link>
            </li>
            <li>
              <Link
                to="/shelves"
                className="hover:text-blue-300 transition-colors"
              >
                Estantes
              </Link>
            </li>
            <li>
              <Link
                to="/logs"
                className="hover:text-blue-300 transition-colors"
              >
                Logs
              </Link>
            </li>

            {/* Sección de usuario dinámica */}
            <li className="text-sm bg-blue-900 px-3 py-1 rounded border border-blue-700">
              Hola,{" "}
              <span className="font-semibold">
                {user?.name || "Administrador"}
              </span>
            </li>

            <li>
              <button
                onClick={logout} // El logout centralizado se encarga de limpiar y redirigir
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenido Dinámico de los Módulos */}
      <main className="container mx-auto p-6 flex-1 bg-white shadow-sm mt-4 rounded-md">
        <Outlet />
      </main>
    </div>
  );
};
