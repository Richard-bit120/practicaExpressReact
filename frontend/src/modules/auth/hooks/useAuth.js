import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { ROUTES } from '../../../shared/constants/routes';
import { MESSAGES } from '../../../shared/constants/messages';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            await authService.login(credentials);
            navigate(ROUTES.DASHBOARD);
            return true;
        } catch (err) {
            const message =
                err.response?.status === 401
                    ? MESSAGES.AUTH.LOGIN_ERROR
                    : err.response?.data?.message || MESSAGES.ERROR.GENERIC;
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        authService.logout();
        navigate(ROUTES.LOGIN);
    }, [navigate]);

    return { login, logout, loading, error, setError };
};