import { useState } from "react";
import { Link } from "react-router-dom";
import { useShelves } from "../hooks/useShelves";
import { DataTable } from "../../../shared/components/tables/DataTable";
import { Pagination } from "../../../shared/components/tables/Pagination";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { ConfirmModal } from "../../../shared/components/modals/ConfirmModal";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { InputText } from "../../../shared/components/forms/InputText";

export const ShelvesListPage = () => {
  const {
    data: shelves,
    meta,
    loading,
    error,
    successMessage,
    remove,
    changePage,
    changeLimit,
    updateParams,
    clearMessages,
  } = useShelves();
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    shelf: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.shelf) return;
    setDeleteLoading(true);
    await remove(deleteModal.shelf.id);
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, shelf: null });
  };

  const columns = [
    { key: "code", header: "Código" },
    {
      key: "location",
      header: "Ubicación",
      render: (s) => s.location || "Sin ubicación",
    },
    {
      key: "description",
      header: "Descripción",
      render: (s) => (
        <span className="text-gray-500 text-xs">
          {s.description || "Sin descripción"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (shelf) => (
        <div className="flex space-x-2">
          <Link
            to={`/shelves/${shelf.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, shelf });
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
        title="Estantes"
        subtitle="Gestión de estantes físicos"
        action={
          <Link
            to="/shelves/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nuevo estante
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
            placeholder="Buscar estante..."
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
        <LoadingSpinner text="Cargando estantes..." />
      ) : shelves.length === 0 ? (
        <EmptyState
          title="No hay estantes"
          message="No se encontraron estantes."
        />
      ) : (
        <>
          <DataTable columns={columns} data={shelves} />
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
        title="Eliminar estante"
        message={`¿Está seguro de que desea eliminar el estante "${deleteModal.shelf?.code}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, shelf: null })}
        loading={deleteLoading}
      />
    </div>
  );
};
