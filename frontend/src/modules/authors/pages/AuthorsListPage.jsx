import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthors } from "../hooks/useAuthors";
import { DataTable } from "../../../shared/components/tables/DataTable";
import { Pagination } from "../../../shared/components/tables/Pagination";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { ConfirmModal } from "../../../shared/components/modals/ConfirmModal";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { InputText } from "../../../shared/components/forms/InputText";

export const AuthorsListPage = () => {
  const {
    data: authors,
    meta,
    loading,
    error,
    successMessage,
    remove,
    changePage,
    changeLimit,
    updateParams,
    clearMessages,
  } = useAuthors();

  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    author: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDeleteClick = (author) => {
    setDeleteModal({ isOpen: true, author });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.author) return;
    setDeleteLoading(true);
    await remove(deleteModal.author.id);
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, author: null });
  };

  const columns = [
    { key: "name", header: "Nombre" },
    {
      key: "biography",
      header: "Biografía",
      render: (a) => (
        <span className="text-gray-500 text-xs">
          {a.biography
            ? a.biography.substring(0, 80) +
              (a.biography.length > 80 ? "..." : "")
            : "Sin biografía"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (author) => (
        <div className="flex space-x-2">
          <Link
            to={`/authors/${author.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(author);
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
        title="Autores"
        subtitle="Gestión de autores de la biblioteca"
        action={
          <Link
            to="/authors/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nuevo autor
          </Link>
        }
      />

      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} onRetry={clearMessages} />}

      <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
        <div className="w-64">
          <InputText
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar autor..."
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <LoadingSpinner text="Cargando autores..." />
      ) : authors.length === 0 ? (
        <EmptyState
          title="No hay autores"
          message="No se encontraron autores."
        />
      ) : (
        <>
          <DataTable columns={columns} data={authors} />
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
        title="Eliminar autor"
        message={`¿Está seguro de que desea eliminar a "${deleteModal.author?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, author: null })}
        loading={deleteLoading}
      />
    </div>
  );
};
