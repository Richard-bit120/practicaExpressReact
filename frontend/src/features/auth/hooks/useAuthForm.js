import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { loginSchema } from '../validations/auth.validation';
import { ROUTES } from '../../../shared/constants/routes';

export const useAuthForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    try {
      await loginSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      const formattedErrors = {};
      validationError.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    serverError,
    loading,
    handleChange,
    handleSubmit,
  };
};