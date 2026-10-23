import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { ROUTES } from "../../../shared/constants/routes";
import api from "../../../shared/services/api";

const dashboardCards = [
  {
    key: "books",
    label: "Libros",
    icon: "📚",
    route: ROUTES.BOOKS,
    color: "bg-blue-50 border-blue-200",
  },
  {
    key: "authors",
    label: "Autores",
    icon: "✍️",
    route: ROUTES.AUTHORS,
    color: "bg-green-50 border-green-200",
  },
  {
    key: "genres",
    label: "Géneros",
    icon: "🏷️",
    route: ROUTES.GENRES,
    color: "bg-purple-50 border-purple-200",
  },
  {
    key: "sagas",
    label: "Sagas",
    icon: "📖",
    route: ROUTES.SAGAS,
    color: "bg-orange-50 border-orange-200",
  },
  {
    key: "shelves",
    label: "Estantes",
    icon: "🗄️",
    route: ROUTES.SHELVES,
    color: "bg-teal-50 border-teal-200",
  },
  {
    key: "logs",
    label: "Logs",
    icon: "📋",
    route: ROUTES.LOGS,
    color: "bg-gray-50 border-gray-200",
  },
];

export const DashboardPage = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCounts = async () => {
      setLoading(true);
      try {
        const [booksRes, authorsRes, genresRes, sagasRes, shelvesRes] =
          await Promise.all([
            api.get("/books", { params: { limit: 1 } }),
            api.get("/authors", { params: { limit: 1 } }),
            api.get("/genres", { params: { limit: 1 } }),
            api.get("/sagas", { params: { limit: 1 } }),
            api.get("/shelves", { params: { limit: 1 } }),
          ]);
        setCounts({
          books: booksRes.data.meta?.total || 0,
          authors: authorsRes.data.meta?.total || 0,
          genres: genresRes.data.meta?.total || 0,
          sagas: sagasRes.data.meta?.total || 0,
          shelves: shelvesRes.data.meta?.total || 0,
        });
      } catch (err) {
        setError("Error al cargar las estadísticas del dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadCounts();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de la biblioteca"
      />

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
