import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookFilters from '../components/BookFilters';
import BookTable from '../components/BookTable';
import BookFormModal from '../components/BookFormModal';

export default function BooksPage() {
  const {
    books,
    authors,
    genres,
    sagas,
    shelves,
    filters,
    setFilters,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
  } = useBooks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const handleOpenCreate = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (bookToEdit) {
      await updateBook(bookToEdit.id, formData);
    } else {
      await createBook(formData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este libro?')) {
      try {
        await deleteBook(id);
      } catch {
        alert('No se pudo eliminar el libro.');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo y Gestión de Libros</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Nuevo Libro
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <BookFilters
        filters={filters}
        setFilters={setFilters}
        genres={genres}
        authors={authors}
        sagas={sagas}
      />

      {loading ? (
        <div className="text-center py-10 text-gray-600 font-medium">Cargando libros...</div>
      ) : (
        <BookTable
          books={books}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        bookToEdit={bookToEdit}
        authors={authors}
        genres={genres}
        sagas={sagas}
        shelves={shelves}
      />
    </div>
  );
}