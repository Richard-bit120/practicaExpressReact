import * as yup from 'yup';

const shelfBodySchema = {
  code: yup
    .string()
    .required('El código del estante es obligatorio')
    .min(1, 'El código debe tener al menos 1 carácter')
    .max(50, 'El código no puede exceder 50 caracteres')
    .trim(),
  location: yup
    .string()
    .nullable()
    .max(150, 'La ubicación no puede exceder 150 caracteres')
    .trim(),
  description: yup
    .string()
    .nullable()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim(),
};

export const createShelfSchema = yup.object({
  body: yup.object().shape(shelfBodySchema),
});

export const updateShelfSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? NaN : Number(originalValue)))
      .typeError('El ID del estante debe ser un número')
      .integer('El ID debe ser un número entero')
      .positive('El ID debe ser positivo')
      .required('El ID del estante es obligatorio'),
  }),
  body: yup
    .object()
    .shape({
      code: yup.string().min(1, 'El código debe tener al menos 1 carácter').max(50).trim(),
      location: yup.string().nullable().max(150).trim(),
      description: yup.string().nullable().max(500).trim(),
    })
    .test(
      'at-least-one-field',
      'Debe proporcionar al menos un campo para actualizar',
      (value) => !!value && Object.keys(value).length > 0
    ),
});

export const shelfIdSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? NaN : Number(originalValue)))
      .typeError('El ID del estante debe ser un número')
      .integer('El ID debe ser un número entero')
      .positive('El ID debe ser positivo')
      .required('ID de estante inválido'),
  }),
});

export const listShelvesSchema = yup.object({
  query: yup.object({
    search: yup.string().optional().trim(),
    page: yup
      .number()
      .transform((value, originalValue) => (originalValue ? Number(originalValue) : undefined))
      .typeError('La página debe ser un número')
      .integer()
      .positive()
      .optional(),
    limit: yup
      .number()
      .transform((value, originalValue) => (originalValue ? Number(originalValue) : undefined))
      .typeError('El límite debe ser un número')
      .integer()
      .positive()
      .max(100)
      .optional(),
  }),
});