import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksService } from '../services/books.service';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await booksService.getById(id);
        setBook(res.data);
      } catch {
        setError('No se pudo encontrar el libro solicitado.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="p-6">Cargando detalle del libro...</div>;
  if (error || !book) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <p className="text-red-600 text-lg font-semibold mb-4">{error || 'Libro no encontrado.'}</p>
        <button
          onClick={() => navigate('/books')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/books')}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium"
      >
        &larr; Volver al catálogo
      </button>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          {book.isbn && <p className="text-sm text-gray-500 mt-1">ISBN: {book.isbn}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Información Bibliográfica</h3>
            <p className="mt-2 text-gray-700"><span className="font-semibold">Autor:</span> {book.author?.name}</p>
            <p className="mt-1 text-gray-700"><span className="font-semibold">Género:</span> {book.genre?.name}</p>
            <p className="mt-1 text-gray-700"><span className="font-semibold">Saga:</span> {book.saga?.name || 'Sin saga'}</p>
            <p className="mt-1 text-gray-700"><span className="font-semibold">Año de publicación:</span> {book.year || 'No especificado'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Ubicación Física</h3>
            <div className="mt-2 bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-blue-900 font-semibold">Estante: {book.shelf?.code}</p>
              <p className="text-blue-700 text-sm mt-1">Sector / Ubicación: {book.shelf?.location}</p>
              {book.shelf?.description && (
                <p className="text-blue-600 text-xs mt-2 italic">{book.shelf.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}