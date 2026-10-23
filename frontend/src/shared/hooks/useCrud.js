import { useState, useCallback, useEffect } from 'react';
import { MESSAGES } from '../constants/messages';
import { PAGINATION } from '../constants/pagination';

export const useCrud = (service, options = {}) => {
    const { autoFetch = true, initialParams = {} } = options;

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [params, setParams] = useState({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...initialParams,
    });

    const fetchData = useCallback(async (fetchParams = params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await service.list(fetchParams);
            setData(response.data.data);
            setMeta(response.data.meta || null);
        } catch (err) {
            const message =
                err.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [service, params]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

    const create = useCallback(async (dto) => {
        setLoading(true);
        setError(null);
        try {
            await service.create(dto);
            setSuccessMessage(MESSAGES.SUCCESS.CREATED);
            await fetchData();
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [service, fetchData]);

    const update = useCallback(async (id, dto) => {
        setLoading(true);
        setError(null);
        try {
            await service.update(id, dto);
            setSuccessMessage(MESSAGES.SUCCESS.UPDATED);
            await fetchData();
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [service, fetchData]);

    const remove = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await service.remove(id);
            setSuccessMessage(MESSAGES.SUCCESS.DELETED);
            await fetchData();
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [service, fetchData]);

    const changePage = useCallback((newPage) => {
        setParams((prev) => ({ ...prev, page: newPage }));
    }, []);

    const changeLimit = useCallback((newLimit) => {
        setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    }, []);

    const updateParams = useCallback((newParams) => {
        setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
    }, []);

    const clearMessages = useCallback(() => {
        setError(null);
        setSuccessMessage(null);
    }, []);

    return {
        data,
        meta,
        loading,
        error,
        successMessage,
        params,
        fetchData,
        create,
        update,
        remove,
        changePage,
        changeLimit,
        updateParams,
        clearMessages,
    };
};