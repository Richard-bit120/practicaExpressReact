import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';

export const sagaService = {
    async list(params = {}) { return api.get(ENDPOINTS.SAGAS.LIST, { params }); },
    async getById(id) { return api.get(`${ENDPOINTS.SAGAS.DETAIL}/${id}`); },
    async create(dto) { return api.post(ENDPOINTS.SAGAS.CREATE, dto); },
    async update(id, dto) { return api.put(`${ENDPOINTS.SAGAS.UPDATE}/${id}`, dto); },
    async remove(id) { return api.delete(`${ENDPOINTS.SAGAS.DELETE}/${id}`); },
};