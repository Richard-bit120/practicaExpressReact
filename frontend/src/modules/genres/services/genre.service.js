import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const genreService = {
    async list(params = {}) { return api.get(ENDPOINTS.GENRES.LIST, { params }); },
    async getById(id) { return api.get(`${ENDPOINTS.GENRES.DETAIL}/${id}`); },
    async create(dto) { return api.post(ENDPOINTS.GENRES.CREATE, dto); },
    async update(id, dto) { return api.put(`${ENDPOINTS.GENRES.UPDATE}/${id}`, dto); },
    async remove(id) { return api.delete(`${ENDPOINTS.GENRES.DELETE}/${id}`); },
};