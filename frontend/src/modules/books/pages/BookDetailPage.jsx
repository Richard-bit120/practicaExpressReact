import { Link } from "react-router-dom";
import { useBookDetail } from "../hooks/useBookDetail";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { PageHeader } from "../../../shared/components/layout/PageHeader";

export const BookDetailPage = () => {
  const { book, loading, error } = useBookDetail();

  if (loading) return <LoadingSpinner text="Cargando detalle del libro..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return null;

  return (
    <div>
      <PageHeader
        title={book.title}
        subtitle="Detalle del libro"
        action={
          <div className="flex space-x-3">
            <Link
              to={`/books/${book.id}/edit`}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Editar
            </Link>
            <Link
              to="/books"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              ← Volver al listado
            </Link>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Título
            </h3>
            <p className="text-sm text-gray-900">{book.title}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              ISBN
            </h3>
            <p className="text-sm text-gray-900">{book.isbn || "Sin ISBN"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Año de publicación
            </h3>
            <p className="text-sm text-gray-900">{book.year || "Sin año"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Autor
            </h3>
            <p className="text-sm text-gray-900">{book.author?.name || "-"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Género
            </h3>
            <p className="text-sm text-gray-900">{book.genre?.name || "-"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Saga
            </h3>
            <p className="text-sm text-gray-900">
              {book.saga?.name || "Sin saga"}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Estante
            </h3>
            <p className="text-sm text-gray-900">{book.shelf?.code || "-"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Ubicación física
            </h3>
            <p className="text-sm text-gray-900">
              {book.shelf?.location || "Sin ubicación definida"}
            </p>
          </div>
        </div>

        {book.genre?.description && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Descripción del género
            </h3>
            <p className="text-sm text-gray-600">{book.genre.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
