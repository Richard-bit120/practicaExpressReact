import api from '../../../shared/services/api';

export const genresService = {
  getAll: async () => {
    const response = await api.get('/genres');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/genres', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/genres/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
  },
};