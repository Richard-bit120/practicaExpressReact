import { useNavigate } from 'react-router-dom';

export default function BookTable({ books, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No se encontraron libros registrados con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Género</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saga</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estante (Ubicación)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{book.author?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{book.genre?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{book.saga?.name || 'Sin saga'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {book.shelf ? `${book.shelf.code} (${book.shelf.location})` : 'N/D'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => navigate(`/books/${book.id}`)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Detalle
                </button>
                <button
                  onClick={() => onEdit(book)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(book.id)}
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
  );
}