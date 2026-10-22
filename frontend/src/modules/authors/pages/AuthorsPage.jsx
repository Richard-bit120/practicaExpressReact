import React, { useState } from "react";
import { useAuthors } from "../hooks/useAuthors";
import { DataTable } from "../../../shared/components/DataTable";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { AuthorForm } from "../components/AuthorForm";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

export const AuthorsPage = () => {
  const { authors, loading, error, createAuthor, updateAuthor, deleteAuthor } =
    useAuthors();
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [deletingAuthor, setDeletingAuthor] = useState(null);
  const [actionError, setActionError] = useState(null);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nombre" },
    { key: "bio", label: "Biografía" },
  ];

  const handleSave = async (data) => {
    setActionError(null);
    const result = editingAuthor
      ? await updateAuthor(editingAuthor.id, data)
      : await createAuthor(data);

    if (result.success) {
      setShowForm(false);
      setEditingAuthor(null);
    } else {
      setActionError(result.error);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionError(null);
    const result = await deleteAuthor(deletingAuthor.id);
    if (result.success) {
      setDeletingAuthor(null);
    } else {
      setActionError(result.error);
      setDeletingAuthor(null);
    }
  };

  if (loading && authors.length === 0) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Autores</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingAuthor(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nuevo Autor
          </button>
        )}
      </div>

      {(error || actionError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || actionError}
        </div>
      )}

      {showForm && (
        <AuthorForm
          initialData={editingAuthor}
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAuthor(null);
            setActionError(null);
          }}
        />
      )}

      <DataTable
        columns={columns}
        data={authors}
        onEdit={(author) => {
          setEditingAuthor(author);
          setShowForm(true);
          setActionError(null);
        }}
        onDelete={(author) => {
          setDeletingAuthor(author);
          setActionError(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deletingAuthor}
        title="Eliminar Autor"
        message={`¿Estás seguro de eliminar a ${deletingAuthor?.name}? Si tiene libros asociados, la operación será rechazada.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingAuthor(null)}
      />
    </div>
  );
};
