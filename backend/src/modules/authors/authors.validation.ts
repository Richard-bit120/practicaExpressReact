import * as yup from "yup";

const authorBodySchema = {
  name: yup
    .string()
    .required("El nombre del autor es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede exceder 150 caracteres")
    .trim(),
  biography: yup
    .string()
    .nullable()
    .max(2000, "La biografía no puede exceder 2000 caracteres")
    .trim(),
};

export const createAuthorSchema = yup.object({
  body: yup.object().shape(authorBodySchema),
});

export const updateAuthorSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError("ID de autor debe ser un número") // Garantiza un mensaje de error claro en caso de tipado incorrecto
      .integer()
      .positive()
      .required("ID de autor obligatorio"),
  }),
  body: yup
    .object()
    .shape({
      name: yup
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(150, "El nombre no puede exceder 150 caracteres")
        .trim(),
      biography: yup
        .string()
        .nullable()
        .max(2000, "La biografía no puede exceder 2000 caracteres")
        .trim(),
    })
    .test(
      "at-least-one-field",
      "Debe proporcionar al menos un campo para actualizar",
      (value) => !!value && Object.keys(value).length > 0, // Comprueba que el objeto body contenga al menos una clave
    ),
});

export const getAuthorByIdSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError("ID de autor debe ser un número")
      .integer()
      .positive()
      .required("ID de autor inválido"),
  }),
});

export const deleteAuthorSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError("ID de autor debe ser un número")
      .integer()
      .positive()
      .required("ID de autor inválido"),
  }),
});

export const listAuthorsSchema = yup.object({
  query: yup.object({
    search: yup.string().optional().trim(),
    page: yup
      .number()
      .typeError("Página debe ser un número")
      .integer()
      .positive()
      .optional(),
    limit: yup
      .number()
      .typeError("Límite debe ser un número")
      .integer()
      .positive()
      .max(100)
      .optional(),
  }),
});
