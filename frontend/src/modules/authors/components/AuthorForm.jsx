import React, { useState, useEffect } from "react";
import { FormInput } from "../../../shared/components/FormInput";
import { authorSchema } from "../validations/author.validation";

export const AuthorForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name || "", bio: initialData.bio || "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authorSchema.validate(formData, { abortEarly: false });
      await onSubmit(formData);
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Editar Autor" : "Nuevo Autor"}
      </h3>

      <FormInput
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <FormInput
        label="Biografía"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};
