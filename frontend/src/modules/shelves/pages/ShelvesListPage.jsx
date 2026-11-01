import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "../../../shared/components/ui/Button";

export const ShelvesListPage = () => {
  const navigate = useNavigate();
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
          <Button
            variant="outline"
            onClick={() => navigate(`/shelves/${shelf.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, shelf });
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
        title="Estantes"
        subtitle="Gestión de estantes físicos"
        action={
          <Button variant="primary" onClick={() => navigate("/shelves/create")}>
            + Nuevo estante
          </Button>
        }
      />
      
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} onRetry={clearMessages} />}
      
      <form onSubmit={handleSearch} className="mb-4 flex space-x-2 items-center">
        <div className="w-64">
          <InputText
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar estante..."
          />
        </div>
        <Button type="submit" variant="primary">
          Buscar
        </Button>
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