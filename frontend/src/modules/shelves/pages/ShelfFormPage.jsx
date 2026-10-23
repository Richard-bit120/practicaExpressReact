import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { shelfService } from "../services/shelf.service";
import { shelfValidationSchema } from "../validations/shelf.validation";
import { FormField } from "../../../shared/components/forms/FormField";
import { InputText } from "../../../shared/components/forms/InputText";
import { TextArea } from "../../../shared/components/forms/TextArea";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { MESSAGES } from "../../../shared/constants/messages";

export const ShelfFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    code: "",
    location: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isEditing) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await shelfService.getById(id);
        setFormData({
          code: res.data.code || "",
          location: res.data.location || "",
          description: res.data.description || "",
        });
      } catch (err) {
        setServerError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const validateForm = async () => {
    try {
      await shelfValidationSchema.validate(formData, { abortEarly: false });
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
    if (!(await validateForm())) return;
    setLoading(true);
    setServerError(null);
    const dto = {
      code: formData.code,
      location: formData.location || null,
      description: formData.description || null,
    };
    try {
      if (isEditing) {
        await shelfService.update(id, dto);
        setSuccessMsg(MESSAGES.SUCCESS.UPDATED);
      } else {
        await shelfService.create(dto);
        setSuccessMsg(MESSAGES.SUCCESS.CREATED);
      }
      setTimeout(() => navigate("/shelves"), 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner text="Cargando..." />;

  return (
    <div>
      <PageHeader
        title={isEditing ? "Editar estante" : "Nuevo estante"}
        action={
          <Link
            to="/shelves"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            ← Volver
          </Link>
        }
      />
      {serverError && <ErrorMessage message={serverError} />}
      {successMsg && <SuccessMessage message={successMsg} />}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Código"
            name="code"
            error={fieldErrors.code}
            required
          >
            <InputText
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ej: A-01"
              error={fieldErrors.code}
              disabled={loading}
            />
          </FormField>
          <FormField
            label="Ubicación"
            name="location"
            error={fieldErrors.location}
          >
            <InputText
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Planta baja, sector norte"
              error={fieldErrors.location}
              disabled={loading}
            />
          </FormField>
          <FormField
            label="Descripción"
            name="description"
            error={fieldErrors.description}
          >
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción (opcional)"
              error={fieldErrors.description}
              disabled={loading}
            />
          </FormField>
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
            <Link
              to="/shelves"
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
