import api from '../../../shared/services/api';

export const authorsService = {
  getAll: async () => {
    const response = await api.get('/authors');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/authors', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  },
};