import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const authorService = {
    async list(params = {}) {
        return api.get(ENDPOINTS.AUTHORS.LIST, { params });
    },
    async getById(id) {
        return api.get(`${ENDPOINTS.AUTHORS.DETAIL}/${id}`);
    },
    async create(dto) {
        return api.post(ENDPOINTS.AUTHORS.CREATE, dto);
    },
    async update(id, dto) {
        return api.put(`${ENDPOINTS.AUTHORS.UPDATE}/${id}`, dto);
    },
    async remove(id) {
        return api.delete(`${ENDPOINTS.AUTHORS.DELETE}/${id}`);
    },
};