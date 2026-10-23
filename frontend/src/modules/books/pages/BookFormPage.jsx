import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookService } from "../services/book.service";
import { bookValidationSchema } from "../validations/book.validation";
import { FormField } from "../../../shared/components/forms/FormField";
import { InputText } from "../../../shared/components/forms/InputText";
import { SelectField } from "../../../shared/components/forms/SelectField";
import { LoadingSpinner } from "../../../shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "../../../shared/components/feedback/ErrorMessage";
import { SuccessMessage } from "../../../shared/components/feedback/SuccessMessage";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { MESSAGES } from "../../../shared/constants/messages";
import api from "../../../shared/services/api";

export const BookFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    year: "",
    authorId: "",
    genreId: "",
    shelfId: "",
    sagaId: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Opciones para selects
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [sagas, setSagas] = useState([]);

  // Cargar opciones y datos existentes
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      try {
        const [authorsRes, genresRes, shelvesRes, sagasRes] = await Promise.all(
          [
            api.get("/authors", { params: { limit: 200 } }),
            api.get("/genres", { params: { limit: 200 } }),
            api.get("/shelves", { params: { limit: 200 } }),
            api.get("/sagas", { params: { limit: 200 } }),
          ],
        );
        setAuthors(authorsRes.data.data);
        setGenres(genresRes.data.data);
        setShelves(shelvesRes.data.data);
        setSagas(sagasRes.data.data);

        if (isEditing) {
          const bookRes = await bookService.getById(id);
          const book = bookRes.data;
          setFormData({
            title: book.title || "",
            isbn: book.isbn || "",
            year: book.year?.toString() || "",
            authorId: book.authorId?.toString() || "",
            genreId: book.genreId?.toString() || "",
            shelfId: book.shelfId?.toString() || "",
            sagaId: book.sagaId?.toString() || "",
          });
        }
      } catch (err) {
        setServerError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const validateForm = async () => {
    try {
      const dataToValidate = {
        ...formData,
        year: formData.year ? parseInt(formData.year, 10) : null,
        authorId: formData.authorId
          ? parseInt(formData.authorId, 10)
          : undefined,
        genreId: formData.genreId ? parseInt(formData.genreId, 10) : undefined,
        shelfId: formData.shelfId ? parseInt(formData.shelfId, 10) : undefined,
        sagaId: formData.sagaId ? parseInt(formData.sagaId, 10) : null,
        isbn: formData.isbn || null,
      };
      await bookValidationSchema.validate(dataToValidate, {
        abortEarly: false,
      });
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

    setLoading(true);
    setServerError(null);

    const dto = {
      title: formData.title,
      isbn: formData.isbn || null,
      year: formData.year ? parseInt(formData.year, 10) : null,
      authorId: parseInt(formData.authorId, 10),
      genreId: parseInt(formData.genreId, 10),
      shelfId: parseInt(formData.shelfId, 10),
      sagaId: formData.sagaId ? parseInt(formData.sagaId, 10) : null,
    };

    try {
      if (isEditing) {
        await bookService.update(id, dto);
        setSuccessMsg(MESSAGES.SUCCESS.UPDATED);
      } else {
        await bookService.create(dto);
        setSuccessMsg(MESSAGES.SUCCESS.CREATED);
      }
      setTimeout(() => navigate("/books"), 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner text="Cargando formulario..." />;

  return (
    <div>
      <PageHeader
        title={isEditing ? "Editar libro" : "Nuevo libro"}
        subtitle={
          isEditing
            ? "Modifique los datos del libro"
            : "Complete los datos para agregar un nuevo libro"
        }
        action={
          <Link
            to="/books"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            ← Volver al listado
          </Link>
        }
      />

      {serverError && <ErrorMessage message={serverError} />}
      {successMsg && <SuccessMessage message={successMsg} />}

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Título"
            name="title"
            error={fieldErrors.title}
            required
          >
            <InputText
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título del libro"
              error={fieldErrors.title}
              disabled={loading}
            />
          </FormField>

          <FormField label="ISBN" name="isbn" error={fieldErrors.isbn}>
            <InputText
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN (opcional)"
              error={fieldErrors.isbn}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Año de publicación"
            name="year"
            error={fieldErrors.year}
          >
            <InputText
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              placeholder="Ej: 2020"
              error={fieldErrors.year}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Autor"
            name="authorId"
            error={fieldErrors.authorId}
            required
          >
            <SelectField
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              placeholder="Seleccione un autor"
              options={authors.map((a) => ({
                value: a.id.toString(),
                label: a.name,
              }))}
              error={fieldErrors.authorId}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Género"
            name="genreId"
            error={fieldErrors.genreId}
            required
          >
            <SelectField
              name="genreId"
              value={formData.genreId}
              onChange={handleChange}
              placeholder="Seleccione un género"
              options={genres.map((g) => ({
                value: g.id.toString(),
                label: g.name,
              }))}
              error={fieldErrors.genreId}
              disabled={loading}
            />
          </FormField>

          <FormField
            label="Estante"
            name="shelfId"
            error={fieldErrors.shelfId}
            required
          >
            <SelectField
              name="shelfId"
              value={formData.shelfId}
              onChange={handleChange}
              placeholder="Seleccione un estante"
              options={shelves.map((s) => ({
                value: s.id.toString(),
                label: `${s.code} - ${s.location || "Sin ubicación"}`,
              }))}
              error={fieldErrors.shelfId}
              disabled={loading}
            />
          </FormField>

          <FormField label="Saga" name="sagaId" error={fieldErrors.sagaId}>
            <SelectField
              name="sagaId"
              value={formData.sagaId}
              onChange={handleChange}
              placeholder="Sin saga (opcional)"
              options={sagas.map((s) => ({
                value: s.id.toString(),
                label: s.name,
              }))}
              error={fieldErrors.sagaId}
              disabled={loading}
            />
          </FormField>

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Actualizar libro"
                  : "Crear libro"}
            </button>
            <Link
              to="/books"
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
