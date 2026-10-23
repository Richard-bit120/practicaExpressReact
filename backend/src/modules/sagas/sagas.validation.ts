import * as yup from 'yup';

const sagaBodySchema = {
  name: yup
    .string()
    .required('El nombre de la saga es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .trim(),
  description: yup
    .string()
    .nullable()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .trim(),
};

export const createSagaSchema = yup.object({
  body: yup.object().shape(sagaBodySchema),
});

export const updateSagaSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID de la saga debe ser un número')
      .integer()
      .positive()
      .required('El ID de la saga es obligatorio'),
  }),
  body: yup
    .object()
    .shape({
      name: yup
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(150, 'El nombre no puede exceder 150 caracteres')
        .trim(),
      description: yup
        .string()
        .nullable()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .trim(),
    })
    // Se reemplaza .min(1) por .test() para validar objetos en Yup
    .test(
      'at-least-one-field',
      'Debe proporcionar al menos un campo para actualizar',
      (value) => !!value && Object.keys(value).length > 0
    ),
});

export const sagaIdSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID de la saga debe ser un número')
      .integer()
      .positive()
      .required('ID de saga inválido'),
  }),
});

export const listSagasSchema = yup.object({
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