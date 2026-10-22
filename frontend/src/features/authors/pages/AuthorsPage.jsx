import { useState, useEffect } from 'react';
import { authorsService } from '../services/authors.service';
import { authorSchema } from '../validations/authors.validation';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [formError, setFormError] = useState('');

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const res = await authorsService.getAll();
      setAuthors(res.data || []);
    } catch {
      setError('Error al cargar la lista de autores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', bio: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (author) => {
    setEditingId(author.id);
    setFormData({ name: author.name, bio: author.bio || '' });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      await authorSchema.validate(formData, { abortEarly: false });
      if (editingId) {
        await authorsService.update(editingId, formData);
      } else {
        await authorsService.create(formData);
      }
      setShowModal(false);
      loadAuthors();
    } catch (err) {
      setFormError(err.message || 'Error al guardar el autor.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este autor?')) {
      try {
        await authorsService.remove(id);
        loadAuthors();
      } catch (err) {
        const msg = err.response?.data?.message || 'No se puede eliminar el autor porque tiene libros asociados.';
        alert(msg);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Autores</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Nuevo Autor
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <p>Cargando autores...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biografía</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libros Asociados</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{author.name}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{author.bio || 'Sin biografía'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{author.books?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenEdit(author)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                    <button onClick={() => handleDelete(author.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Alta / Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Autor' : 'Nuevo Autor'}</h2>
            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}