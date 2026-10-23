import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { bookService } from '../services/book.service';
import { MESSAGES } from '../../../shared/constants/messages';

export const useBookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBook = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookService.getById(id);
            setBook(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError(MESSAGES.ERROR.NOT_FOUND);
            } else {
                setError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchBook();
    }, [id, fetchBook]);

    return { book, loading, error, refetch: fetchBook };
};