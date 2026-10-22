import { useState, useEffect, useCallback } from 'react';
import { authorService } from '../services/author.service';

export const useAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAuthors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authorService.getAll();
            setAuthors(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar autores');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    const createAuthor = async (data) => {
        try {
            await authorService.create(data);
            await fetchAuthors();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Error al crear' };
        }
    };

    const updateAuthor = async (id, data) => {
        try {
            await authorService.update(id, data);
            await fetchAuthors();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Error al actualizar' };
        }
    };

    const deleteAuthor = async (id) => {
        try {
            await authorService.delete(id);
            await fetchAuthors();
            return { success: true };
        } catch (err) {
            // Aquí atrapamos la regla de negocio: "No borrar si tienen libros"
            return { success: false, error: err.response?.data?.message || 'Error al eliminar' };
        }
    };

    return { authors, loading, error, createAuthor, updateAuthor, deleteAuthor, fetchAuthors };
};