import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const shelfService = {
    async list(params = {}) { return api.get(ENDPOINTS.SHELVES.LIST, { params }); },
    async getById(id) { return api.get(`${ENDPOINTS.SHELVES.DETAIL}/${id}`); },
    async create(dto) { return api.post(ENDPOINTS.SHELVES.CREATE, dto); },
    async update(id, dto) { return api.put(`${ENDPOINTS.SHELVES.UPDATE}/${id}`, dto); },
    async remove(id) { return api.delete(`${ENDPOINTS.SHELVES.DELETE}/${id}`); },
};