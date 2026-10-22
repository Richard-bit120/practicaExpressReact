import api from '../../../shared/services/api';
import { AUTH_ENDPOINTS } from '../auth.constants';

export const authService = {
  login: async (credentials) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },
};