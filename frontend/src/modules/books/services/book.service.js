import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const bookService = {
    async list(params = {}) {
        return api.get(ENDPOINTS.BOOKS.LIST, { params });
    },

    async getById(id) {
        return api.get(`${ENDPOINTS.BOOKS.DETAIL}/${id}`);
    },

    async create(dto) {
        return api.post(ENDPOINTS.BOOKS.CREATE, dto);
    },

    async update(id, dto) {
        return api.put(`${ENDPOINTS.BOOKS.UPDATE}/${id}`, dto);
    },

    async remove(id) {
        return api.delete(`${ENDPOINTS.BOOKS.DELETE}/${id}`);
    },
};