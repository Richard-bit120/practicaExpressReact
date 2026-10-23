import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginValidationSchema } from "../validations/login.validation";
import { FormField } from "../../../shared/components/forms/FormField";
import { InputText } from "../../../shared/components/forms/InputText";

export const LoginPage = () => {
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) setError(null);
  };

  const validateForm = async () => {
    try {
      await loginValidationSchema.validate(formData, { abortEarly: false });
      setFieldErrors({});
      return true;
    } catch (validationErr) {
      const errors = {};
      validationErr.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setFieldErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo / Título */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">📚</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Biblioteca
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Inicie sesión para continuar
            </p>
          </div>

          {/* Error global */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField
              label="Usuario"
              name="username"
              error={fieldErrors.username}
              required
            >
              <InputText
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingrese su usuario"
                error={fieldErrors.username}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Contraseña"
              name="password"
              error={fieldErrors.password}
              required
            >
              <InputText
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                error={fieldErrors.password}
                disabled={loading}
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  );
};
