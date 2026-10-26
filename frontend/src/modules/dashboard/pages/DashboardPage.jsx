import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
// Importaciones de LoadingSpinner y ErrorMessage retenidas por si las necesitas en otra parte de la vista
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { ROUTES } from "../../../shared/constants/routes";
import { useDashboardStore } from "../store/dashboardStore"; // Ajusta el path según tu estructura

const dashboardCards = [
  { key: "books", label: "Libros", icon: "📚", route: ROUTES.BOOKS, color: "bg-blue-50 border-blue-200" },
  { key: "authors", label: "Autores", icon: "✍️", route: ROUTES.AUTHORS, color: "bg-green-50 border-green-200" },
  { key: "genres", label: "Géneros", icon: "🏷️", route: ROUTES.GENRES, color: "bg-purple-50 border-purple-200" },
  { key: "sagas", label: "Sagas", icon: "📖", route: ROUTES.SAGAS, color: "bg-orange-50 border-orange-200" },
  { key: "shelves", label: "Estantes", icon: "🗄️", route: ROUTES.SHELVES, color: "bg-teal-50 border-teal-200" },
  { key: "logs", label: "Logs", icon: "📋", route: ROUTES.LOGS, color: "bg-gray-50 border-gray-200" },
];

export const DashboardPage = () => {
  // Extraemos el estado y el método de carga desde Zustand
  const { counts, loading, error, fetchCounts } = useDashboardStore();

  // Disparamos la carga al montar el componente
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de la biblioteca"
      />

      {/* Manejo de error global del dashboard */}
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {dashboardCards.map((card) => (
          <Link
            key={card.key}
            to={card.route}
            className={`block p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.label}
                </p>
                {loading ? (
                  <p className="text-2xl font-bold text-gray-400 mt-1">...</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {/* Excepción visual para 'logs' y mapeo seguro de contadores */}
                    {card.key === "logs" ? "→" : counts[card.key] || 0}
                  </p>
                )}
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};