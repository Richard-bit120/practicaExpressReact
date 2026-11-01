import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Añadimos useNavigate
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
import { Button } from "../../../shared/components/ui/Button"; // 1. Importamos el Button
import { ROUTES } from "../../../shared/constants/routes";
import { MESSAGES } from "../../../shared/constants/messages";
import api from "../../../shared/services/api";

export const BooksListPage = () => {
  const navigate = useNavigate(); // Para usar botones en lugar de Links en las acciones
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
        // Silencioso
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
    { key: "author", header: "Autor", render: (book) => book.author?.name || "-" },
    { key: "genre", header: "Género", render: (book) => book.genre?.name || "-" },
    { key: "year", header: "Año", render: (book) => book.year || "-" },
    { key: "saga", header: "Saga", render: (book) => book.saga?.name || "Sin saga" },
    { key: "shelf", header: "Estante", render: (book) => book.shelf?.code || "-" },
    {
      key: "actions",
      header: "Acciones",
      render: (book) => (
        <div className="flex space-x-2">
          {/* 2. Convertimos las acciones de la tabla a componentes Button uniformes */}
          <Button 
            variant="outline" 
            onClick={() => navigate(`/books/${book.id}/edit`)}
          >
            Editar
          </Button>
          
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(book);
            }}
          >
            Eliminar
          </Button>
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
          <Button 
            variant="primary" 
            onClick={() => navigate(ROUTES.BOOK_CREATE)}
          >
            + Nuevo libro
          </Button>
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
            <Button variant="outline" onClick={() => navigate(ROUTES.BOOK_CREATE)}>
              Agregar primer libro
            </Button>
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