import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { sagaService } from "../services/saga.service";
import { sagaValidationSchema } from "../validations/saga.validation";
import { FormField } from "../../../shared/components/forms/FormField";
import { InputText } from "../../../shared/components/forms/InputText";
import { TextArea } from "../../../shared/components/forms/TextArea";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { MESSAGES } from "../../../shared/constants/messages";

export const SagaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [formData, setFormData] = useState({ name: "", description: "" });
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
        const res = await sagaService.getById(id);
        setFormData({
          name: res.data.name || "",
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
      await sagaValidationSchema.validate(formData, { abortEarly: false });
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
      name: formData.name,
      description: formData.description || null,
    };
    try {
      if (isEditing) {
        await sagaService.update(id, dto);
        setSuccessMsg(MESSAGES.SUCCESS.UPDATED);
      } else {
        await sagaService.create(dto);
        setSuccessMsg(MESSAGES.SUCCESS.CREATED);
      }
      setTimeout(() => navigate("/sagas"), 1000);
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
        title={isEditing ? "Editar saga" : "Nueva saga"}
        action={
          <Link
            to="/sagas"
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
            label="Nombre"
            name="name"
            error={fieldErrors.name}
            required
          >
            <InputText
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre de la saga"
              error={fieldErrors.name}
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
              to="/sagas"
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
