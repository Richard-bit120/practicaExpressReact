import { useState, useEffect } from 'react';
import { bookSchema } from '../validations/books.validation';

export default function BookFormModal({ isOpen, onClose, onSubmit, bookToEdit, authors, genres, sagas, shelves }) {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    year: '',
    authorId: '',
    genreId: '',
    shelfId: '',
    sagaId: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        isbn: bookToEdit.isbn || '',
        year: bookToEdit.year || '',
        authorId: bookToEdit.authorId || '',
        genreId: bookToEdit.genreId || '',
        shelfId: bookToEdit.shelfId || '',
        sagaId: bookToEdit.sagaId || '',
      });
    } else {
      setFormData({
        title: '',
        isbn: '',
        year: '',
        authorId: '',
        genreId: '',
        shelfId: '',
        sagaId: '',
      });
    }
    setErrors({});
    setServerError('');
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    try {
      const payload = {
        ...formData,
        year: formData.year ? Number(formData.year) : undefined,
        authorId: Number(formData.authorId),
        genreId: Number(formData.genreId),
        shelfId: Number(formData.shelfId),
        sagaId: formData.sagaId ? Number(formData.sagaId) : null,
      };

      await bookSchema.validate(payload, { abortEarly: false });
      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        setServerError(err.response?.data?.message || err.message || 'Error al guardar el libro.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {bookToEdit ? 'Editar Libro' : 'Nuevo Libro'}
        </h2>

        {serverError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año de Publicación</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
              />
              {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
            <select
              value={formData.authorId}
              onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">Seleccione un autor</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.authorId && <p className="text-xs text-red-500 mt-1">{errors.authorId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
            <select
              value={formData.genreId}
              onChange={(e) => setFormData({ ...formData, genreId: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">Seleccione un género</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            {errors.genreId && <p className="text-xs text-red-500 mt-1">{errors.genreId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estante Físico *</label>
            <select
              value={formData.shelfId}
              onChange={(e) => setFormData({ ...formData, shelfId: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">Seleccione un estante</option>
              {shelves.map((sh) => (
                <option key={sh.id} value={sh.id}>{sh.code} - {sh.location}</option>
              ))}
            </select>
            {errors.shelfId && <p className="text-xs text-red-500 mt-1">{errors.shelfId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saga (Opcional)</label>
            <select
              value={formData.sagaId}
              onChange={(e) => setFormData({ ...formData, sagaId: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">Sin saga</option>
              {sagas.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}