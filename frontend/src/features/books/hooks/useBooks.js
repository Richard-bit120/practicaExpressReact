import { useState, useEffect, useCallback } from 'react';
import { booksService } from '../services/books.service';
import { authorsService } from '../../authors/services/authors.service';
import { genresService } from '../../genres/services/genres.service';
import { sagasService } from '../../sagas/services/sagas.service';
import { shelvesService } from '../../shelves/services/shelves.service';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [filters, setFilters] = useState({ genreId: '', authorId: '', year: '', sagaId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCatalogs = async () => {
    try {
      const [aRes, gRes, sRes, shRes] = await Promise.all([
        authorsService.getAll(),
        genresService.getAll(),
        sagasService.getAll(),
        shelvesService.getAll(),
      ]);
      setAuthors(aRes.data || []);
      setGenres(gRes.data || []);
      setSagas(sRes.data || []);
      setShelves(shRes.data || []);
    } catch (err) {
      console.error('Error al cargar catálogos auxiliares:', err);
    }
  };

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await booksService.getAll(filters);
      setBooks(res.data || []);
      setError('');
    } catch {
      setError('Error al cargar el catálogo de libros.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const createBook = async (data) => {
    await booksService.create(data);
    await fetchBooks();
  };

  const updateBook = async (id, data) => {
    await booksService.update(id, data);
    await fetchBooks();
  };

  const deleteBook = async (id) => {
    await booksService.remove(id);
    await fetchBooks();
  };

  return {
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
    refreshBooks: fetchBooks,
  };
};