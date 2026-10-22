import api from '../../../shared/services/api';
import { BOOKS_ENDPOINTS } from '../books.constants';

export const booksService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.genreId) params.append('genreId', filters.genreId);
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.year) params.append('year', filters.year);
    if (filters.sagaId) params.append('sagaId', filters.sagaId);

    const response = await api.get(`${BOOKS_ENDPOINTS.BASE}?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BOOKS_ENDPOINTS.BASE}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(BOOKS_ENDPOINTS.BASE, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`${BOOKS_ENDPOINTS.BASE}/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`${BOOKS_ENDPOINTS.BASE}/${id}`);
    return response.data;
  },
};