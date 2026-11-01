import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "../../../shared/components/ui/Button";

export const GenresListPage = () => {
  const navigate = useNavigate();
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
          <Button
            variant="outline"
            onClick={() => navigate(`/genres/${genre.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, genre });
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
        title="Géneros"
        subtitle="Gestión de géneros literarios"
        action={
          <Button variant="primary" onClick={() => navigate("/genres/create")}>
            + Nuevo género
          </Button>
        }
      />

      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} onRetry={clearMessages} />}

      <form
        onSubmit={handleSearch}
        className="mb-4 flex space-x-2 items-center"
      >
        <div className="w-64">
          <InputText
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar género..."
          />
        </div>
        <Button type="submit" variant="primary" className="h-[38px] shrink-0">
          Buscar
        </Button>
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