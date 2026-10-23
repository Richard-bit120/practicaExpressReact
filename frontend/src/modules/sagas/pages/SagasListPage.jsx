import { useState } from "react";
import { Link } from "react-router-dom";
import { useSagas } from "../hooks/useSagas";
import { DataTable } from "../../../shared/components/tables/DataTable";
import { Pagination } from "../../../shared/components/tables/Pagination";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { ConfirmModal } from "../../../shared/components/modals/ConfirmModal";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { InputText } from "../../../shared/components/forms/InputText";

export const SagasListPage = () => {
  const {
    data: sagas,
    meta,
    loading,
    error,
    successMessage,
    remove,
    changePage,
    changeLimit,
    updateParams,
    clearMessages,
  } = useSagas();
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, saga: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.saga) return;
    setDeleteLoading(true);
    await remove(deleteModal.saga.id);
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, saga: null });
  };

  const columns = [
    { key: "name", header: "Nombre" },
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
      render: (saga) => (
        <div className="flex space-x-2">
          <Link
            to={`/sagas/${saga.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, saga });
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
        title="Sagas"
        subtitle="Gestión de sagas literarias"
        action={
          <Link
            to="/sagas/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nueva saga
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
            placeholder="Buscar saga..."
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
        <LoadingSpinner text="Cargando sagas..." />
      ) : sagas.length === 0 ? (
        <EmptyState title="No hay sagas" message="No se encontraron sagas." />
      ) : (
        <>
          <DataTable columns={columns} data={sagas} />
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
        title="Eliminar saga"
        message={`¿Está seguro de que desea eliminar "${deleteModal.saga?.name}"? Los libros asociados quedarán sin saga.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, saga: null })}
        loading={deleteLoading}
      />
    </div>
  );
};
