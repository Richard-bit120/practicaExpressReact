import { useState, useEffect } from 'react';
import { shelvesService } from '../services/shelves.service';
import { shelfSchema } from '../validations/shelves.validation';

export default function ShelvesPage() {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para modal y formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shelfToEdit, setShelfToEdit] = useState(null);
  const [formData, setFormData] = useState({ code: '', location: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const loadShelves = async () => {
    try {
      setLoading(true);
      const res = await shelvesService.getAll();
      setShelves(res.data || []);
      setError('');
    } catch {
      setError('Error al cargar la lista de estantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelves();
  }, []);

  const handleOpenCreate = () => {
    setShelfToEdit(null);
    setFormData({ code: '', location: '', description: '' });
    setFormErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shelf) => {
    setShelfToEdit(shelf);
    setFormData({
      code: shelf.code || '',
      location: shelf.location || '',
      description: shelf.description || '',
    });
    setFormErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setServerError('');

    try {
      await shelfSchema.validate(formData, { abortEarly: false });

      if (shelfToEdit) {
        await shelvesService.update(shelfToEdit.id, formData);
      } else {
        await shelvesService.create(formData);
      }

      setIsModalOpen(false);
      await loadShelves();
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else {
        setServerError(err.response?.data?.message || 'Error al procesar la solicitud.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este estante?')) {
      try {
        await shelvesService.remove(id);
        await loadShelves();
      } catch (err) {
        alert(err.response?.data?.message || 'No se pudo eliminar el estante (puede tener libros asociados).');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Estantes Físicos</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Nuevo Estante
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-600 font-medium">Cargando estantes...</div>
      ) : shelves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay estantes registrados aún.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shelves.map((shelf) => (
                <tr key={shelf.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{shelf.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shelf.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{shelf.description || 'Sin descripción'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenEdit(shelf)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(shelf.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {shelfToEdit ? 'Editar Estante' : 'Nuevo Estante'}
            </h2>

            {serverError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{serverError}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                  placeholder="Ej. EST-A1"
                />
                {formErrors.code && <p className="text-xs text-red-500 mt-1">{formErrors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                  placeholder="Ej. Pasillo 2, Sector Norte"
                />
                {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                  placeholder="Notas adicionales..."
                  rows="2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
}