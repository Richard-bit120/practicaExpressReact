import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { BookFilters } from "../components/BookFilters";
import { DataTable } from "../../../shared/components/tables/DataTable";
import { Pagination } from "../../../shared/components/tables/Pagination";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { ConfirmModal } from "../../../shared/components/modals/ConfirmModal";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { ROUTES } from "../../../shared/constants/routes";
import { MESSAGES } from "../../../shared/constants/messages";
import api from "../../../shared/services/api";

export const BooksListPage = () => {
  const {
    data: books,
    meta,
    loading,
    error,
    successMessage,
    params,
    remove,
    changePage,
    changeLimit,
    updateParams,
    clearMessages,
  } = useBooks();

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, book: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar opciones para filtros
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [authorsRes, genresRes, shelvesRes, sagasRes] = await Promise.all(
          [
            api.get("/authors", { params: { limit: 200 } }),
            api.get("/genres", { params: { limit: 200 } }),
            api.get("/shelves", { params: { limit: 200 } }),
            api.get("/sagas", { params: { limit: 200 } }),
          ],
        );
        setAuthors(authorsRes.data.data);
        setGenres(genresRes.data.data);
        setShelves(shelvesRes.data.data);
        setSagas(sagasRes.data.data);
      } catch (err) {
        // Silencioso: los filtros simplemente no se mostrarán
      }
    };
    loadFilterOptions();
  }, []);

  const handleFilter = (filters) => {
    updateParams(filters);
  };

  const handleClearFilters = () => {
    updateParams({
      search: "",
      authorId: "",
      genreId: "",
      shelfId: "",
      sagaId: "",
      year: "",
    });
  };

  const handleDeleteClick = (book) => {
    setDeleteModal({ isOpen: true, book });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.book) return;
    setDeleteLoading(true);
    await remove(deleteModal.book.id);
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, book: null });
  };

  const columns = [
    {
      key: "title",
      header: "Título",
      render: (book) => (
        <Link
          to={`/books/${book.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {book.title}
        </Link>
      ),
    },
    {
      key: "author",
      header: "Autor",
      render: (book) => book.author?.name || "-",
    },
    {
      key: "genre",
      header: "Género",
      render: (book) => book.genre?.name || "-",
    },
    { key: "year", header: "Año", render: (book) => book.year || "-" },
    {
      key: "saga",
      header: "Saga",
      render: (book) => book.saga?.name || "Sin saga",
    },
    {
      key: "shelf",
      header: "Estante",
      render: (book) => book.shelf?.code || "-",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (book) => (
        <div className="flex space-x-2">
          <Link
            to={`/books/${book.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(book);
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Libros"
        subtitle="Gestión del catálogo de libros"
        action={
          <Link
            to={ROUTES.BOOK_CREATE}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nuevo libro
          </Link>
        }
      />

      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} onRetry={clearMessages} />}

      <BookFilters
        authors={authors}
        genres={genres}
        shelves={shelves}
        sagas={sagas}
        onFilter={handleFilter}
        onClear={handleClearFilters}
      />

      {loading ? (
        <LoadingSpinner text="Cargando libros..." />
      ) : books.length === 0 ? (
        <EmptyState
          title="No hay libros"
          message="No se encontraron libros con los filtros aplicados."
          action={
            <Link
              to={ROUTES.BOOK_CREATE}
              className="text-sm text-blue-600 hover:underline"
            >
              Agregar primer libro
            </Link>
          }
        />
      ) : (
        <>
          <DataTable columns={columns} data={books} />
          {meta && (
            <Pagination
              meta={meta}
              onPageChange={changePage}
              onLimitChange={changeLimit}
            />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar libro"
        message={`¿Está seguro de que desea eliminar "${deleteModal.book?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, book: null })}
        loading={deleteLoading}
      />
    </div>
  );
};
