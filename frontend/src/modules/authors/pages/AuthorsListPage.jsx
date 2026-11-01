import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
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
import { Button } from "../../../shared/components/ui/Button"; // Importamos Button

export const AuthorsListPage = () => {
  const navigate = useNavigate();
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
          {/* Reemplazamos Link y button por nuestro componente Button */}
          <Button
            variant="outline"
            onClick={() => navigate(`/authors/${author.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(author);
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
        title="Autores"
        subtitle="Gestión de autores de la biblioteca"
        action={
          <Button variant="primary" onClick={() => navigate("/authors/create")}>
            + Nuevo autor
          </Button>
        }
      />

      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} onRetry={clearMessages} />}

      <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2">
        <div className="w-64">
          <InputText
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre del autor..."
          />
        </div>

        <Button type="submit" variant="primary" className="h-[38px] shrink-0">
          Buscar
        </Button>
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