import * as yup from 'yup';

const genreBodySchema = {
  name: yup
    .string()
    .required('El nombre del género es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  description: yup
    .string()
    .nullable()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim(),
};

export const createGenreSchema = yup.object({
  body: yup.object().shape(genreBodySchema),
});

export const updateGenreSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID de género debe ser un número')
      .integer()
      .positive()
      .required('El ID de género es obligatorio'),
  }),
  body: yup
    .object()
    .shape({
      name: yup
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),
      description: yup
        .string()
        .nullable()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim(),
    })
    // Se reemplaza .min(1, ...) por .test() para validar objetos en Yup
    .test(
      'at-least-one-field',
      'Debe proporcionar al menos un campo para actualizar',
      (value) => !!value && Object.keys(value).length > 0
    ),
});

export const genreIdSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID de género debe ser un número')
      .integer()
      .positive()
      .required('ID de género inválido'),
  }),
});

export const listGenresSchema = yup.object({
  query: yup.object({
    search: yup.string().optional().trim(),
    page: yup
      .number()
      .typeError('La página debe ser un número')
      .integer()
      .positive()
      .optional(),
    limit: yup
      .number()
      .typeError('El límite debe ser un número')
      .integer()
      .positive()
      .max(100)
      .optional(),
  }),
});