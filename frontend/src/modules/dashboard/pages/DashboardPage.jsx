import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { ROUTES } from "../../../shared/constants/routes";
import { useDashboardStore } from "../store/dashboardStore";

// Actualizamos los colores para que afecten el fondo del icono y el borde al hacer hover
const dashboardCards = [
  { key: "books", label: "Libros", icon: "📚", route: ROUTES.BOOKS, iconBg: "bg-blue-50", hoverBorder: "hover:border-blue-400 hover:shadow-blue-100" },
  { key: "authors", label: "Autores", icon: "✍️", route: ROUTES.AUTHORS, iconBg: "bg-green-50", hoverBorder: "hover:border-green-400 hover:shadow-green-100" },
  { key: "genres", label: "Géneros", icon: "🏷️", route: ROUTES.GENRES, iconBg: "bg-purple-50", hoverBorder: "hover:border-purple-400 hover:shadow-purple-100" },
  { key: "sagas", label: "Sagas", icon: "📖", route: ROUTES.SAGAS, iconBg: "bg-orange-50", hoverBorder: "hover:border-orange-400 hover:shadow-orange-100" },
  { key: "shelves", label: "Estantes", icon: "🗄️", route: ROUTES.SHELVES, iconBg: "bg-teal-50", hoverBorder: "hover:border-teal-400 hover:shadow-teal-100" },
  { key: "logs", label: "Logs", icon: "📋", route: ROUTES.LOGS, iconBg: "bg-gray-100", hoverBorder: "hover:border-gray-400 hover:shadow-gray-100" },
];

export const DashboardPage = () => {
  const { counts, loading, error, fetchCounts } = useDashboardStore();

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de la biblioteca"
      />

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {dashboardCards.map((card) => (
          <Link
            key={card.key}
            to={card.route}
            // Tarjeta blanca limpia con efecto de flotación (-translate-y-1) y clase 'group' para animar hijos
            className={`group block bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 no-underline ${card.hoverBorder}`}
          >
            <div className="flex items-start justify-between">
              {/* Contenedor del icono con fondo redondeado que crece levemente al hacer hover */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              
              {/* Flecha indicadora que aparece solo al hacer hover */}
              <div className="bg-gray-50 text-gray-400 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            {/* Textos movidos a la parte inferior de la tarjeta */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 m-0">
                {card.label}
              </p>
              
              {loading ? (
                <p className="text-4xl font-bold text-gray-300 mt-1 m-0">...</p>
              ) : (
                <p className="text-4xl font-bold text-gray-900 mt-1 m-0 tracking-tight">
                  {card.key === "logs" ? "→" : counts[card.key] || 0}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};