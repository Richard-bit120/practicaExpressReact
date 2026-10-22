import api from '../../../shared/services/api';

export const shelvesService = {
  getAll: async () => {
    const response = await api.get('/shelves');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/shelves/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/shelves', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/shelves/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/shelves/${id}`);
    return response.data;
  },
};