import api from '../../../shared/services/api';

export const sagasService = {
  getAll: async () => {
    const response = await api.get('/sagas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sagas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/sagas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/sagas/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/sagas/${id}`);
    return response.data;
  },
};