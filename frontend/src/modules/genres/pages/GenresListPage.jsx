import { useState } from "react";
import { Link } from "react-router-dom";
import { useGenres } from "../hooks/useGenres";
import { DataTable } from "../../../shared/components/tables/DataTable";
import { Pagination } from "../../../shared/components/tables/Pagination";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { ConfirmModal } from "../../../shared/components/modals/ConfirmModal";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { InputText } from "../../../shared/components/forms/InputText";

export const GenresListPage = () => {
  const {
    data: genres,
    meta,
    loading,
    error,
    successMessage,
    remove,
    changePage,
    changeLimit,
    updateParams,
    clearMessages,
  } = useGenres();
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    genre: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.genre) return;
    setDeleteLoading(true);
    await remove(deleteModal.genre.id);
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, genre: null });
  };

  const columns = [
    { key: "name", header: "Nombre" },
    {
      key: "description",
      header: "Descripción",
      render: (g) => (
        <span className="text-gray-500 text-xs">
          {g.description || "Sin descripción"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (genre) => (
        <div className="flex space-x-2">
          <Link
            to={`/genres/${genre.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, genre });
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
        title="Géneros"
        subtitle="Gestión de géneros literarios"
        action={
          <Link
            to="/genres/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nuevo género
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
            placeholder="Buscar género..."
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
        <LoadingSpinner text="Cargando géneros..." />
      ) : genres.length === 0 ? (
        <EmptyState
          title="No hay géneros"
          message="No se encontraron géneros."
        />
      ) : (
        <>
          <DataTable columns={columns} data={genres} />
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
        title="Eliminar género"
        message={`¿Está seguro de que desea eliminar "${deleteModal.genre?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, genre: null })}
        loading={deleteLoading}
      />
    </div>
  );
};
