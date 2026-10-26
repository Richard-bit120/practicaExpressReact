import { useState, useCallback, useEffect } from 'react';
import { logService } from '../services/log.service';
import { MESSAGES } from '../../../shared/constants/messages';

export const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ level: '', dateFrom: '', dateTo: '' });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.level) params.level = filters.level;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      const response = await logService.list(params);
      setLogs(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { logs, loading, error, filters, updateFilters, refetch: fetchLogs };
};