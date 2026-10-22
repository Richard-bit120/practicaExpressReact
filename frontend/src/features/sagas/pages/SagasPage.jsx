import { useState, useEffect } from 'react';
import { sagasService } from '../services/sagas.service';
import { sagaSchema } from '../validations/sagas.validation';

export default function SagasPage() {
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para modal y formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sagaToEdit, setSagaToEdit] = useState(null);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [serverError, setServerError] = useState('');

  const loadSagas = async () => {
    try {
      setLoading(true);
      const res = await sagasService.getAll();
      setSagas(res.data || []);
      setError('');
    } catch {
      setError('Error al cargar la lista de sagas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSagas();
  }, []);

  const handleOpenCreate = () => {
    setSagaToEdit(null);
    setName('');
    setFormError('');
    setServerError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (saga) => {
    setSagaToEdit(saga);
    setName(saga.name);
    setFormError('');
    setServerError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setServerError('');

    try {
      await sagaSchema.validate({ name }, { abortEarly: false });

      if (sagaToEdit) {
        await sagasService.update(sagaToEdit.id, { name });
      } else {
        await sagasService.create({ name });
      }

      setIsModalOpen(false);
      await loadSagas();
    } catch (err) {
      if (err.inner) {
        setFormError(err.inner[0].message);
      } else {
        setServerError(err.response?.data?.message || 'Error al procesar la solicitud.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta saga?')) {
      try {
        await sagasService.remove(id);
        await loadSagas();
      } catch (err) {
        alert(err.response?.data?.message || 'No se pudo eliminar la saga.');
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Sagas Literarias</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Nueva Saga
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-600 font-medium">Cargando sagas...</div>
      ) : sagas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay sagas registradas aún.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sagas.map((saga) => (
                <tr key={saga.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{saga.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{saga.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenEdit(saga)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(saga.id)}
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
              {sagaToEdit ? 'Editar Saga' : 'Nueva Saga'}
            </h2>

            {serverError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{serverError}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la saga *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300"
                  placeholder="Ej. El Señor de los Anillos, Harry Potter..."
                />
                {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
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