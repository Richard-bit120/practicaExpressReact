import api from '../../../shared/services/api';

export const loginRequest = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};