import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const logService = {
  async list(params = {}) {
    return api.get(ENDPOINTS.LOGS.LIST, { params });
  },
};