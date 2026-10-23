import api from '../../../shared/services/api';
import { ENDPOINTS } from '../../../shared/constants/endpoints';
import { STORAGE_KEYS } from '../../../shared/constants/storage';

export const authService = {
    async login(credentials) {
        const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
        const { token, admin } = response.data;

        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(admin));

        return response.data;
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },
};