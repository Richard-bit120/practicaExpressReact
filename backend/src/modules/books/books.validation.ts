import * as yup from 'yup';

const ISBN_REGEX = /^(?:\d{10}|\d{13}|978[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,6}[-\s]?\d)$/;

export const createBookSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .required('El título es obligatorio')
      .min(1, 'El título no puede estar vacío')
      .max(255, 'El título no puede exceder 255 caracteres')
      .trim(),
    isbn: yup
      .string()
      .nullable()
      .matches(ISBN_REGEX, 'El formato del ISBN es inválido')
      .max(17, 'El ISBN no puede exceder 17 caracteres'),
    year: yup
      .number()
      .typeError('El año debe ser un número')
      .integer('El año debe ser un número entero')
      .nullable()
      .min(1000, 'El año debe ser válido')
      .max(new Date().getFullYear() + 1, 'El año no puede ser futuro'),
    authorId: yup
      .number()
      .typeError('El ID del autor debe ser un número')
      .integer()
      .positive('ID de autor inválido')
      .required('El autor es obligatorio'),
    genreId: yup
      .number()
      .typeError('El ID del género debe ser un número')
      .integer()
      .positive('ID de género inválido')
      .required('El género es obligatorio'),
    shelfId: yup
      .number()
      .typeError('El ID del estante debe ser un número')
      .integer()
      .positive('ID de estante inválido')
      .required('El estante es obligatorio'),
    sagaId: yup
      .number()
      .typeError('El ID de la saga debe ser un número')
      .integer()
      .positive('ID de saga inválido')
      .nullable(),
  }),
});

export const updateBookSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID del libro debe ser un número')
      .integer()
      .positive()
      .required('El ID del libro es obligatorio'),
  }),
  body: yup
    .object({
      title: yup.string().min(1, 'El título no puede estar vacío').max(255).trim(),
      isbn: yup
        .string()
        .nullable()
        .matches(ISBN_REGEX, 'El formato del ISBN es inválido')
        .max(17),
      year: yup
        .number()
        .typeError('El año debe ser un número')
        .integer()
        .nullable()
        .min(1000, 'El año debe ser válido')
        .max(new Date().getFullYear() + 1),
      authorId: yup.number().typeError('ID de autor inválido').integer().positive(),
      genreId: yup.number().typeError('ID de género inválido').integer().positive(),
      shelfId: yup.number().typeError('ID de estante inválido').integer().positive(),
      sagaId: yup.number().typeError('ID de saga inválido').integer().positive().nullable(),
    })
    // Se reemplaza .min(1) por .test() para validar la presencia de al menos un campo en el body
    .test(
      'at-least-one-field',
      'Debe proporcionar al menos un campo para actualizar',
      (value) => !!value && Object.keys(value).length > 0
    ),
});

export const bookIdSchema = yup.object({
  params: yup.object({
    id: yup
      .number()
      .typeError('El ID del libro debe ser un número')
      .integer()
      .positive()
      .required('ID de libro inválido'),
  }),
});

export const listBooksSchema = yup.object({
  query: yup.object({
    search: yup.string().optional().trim(),
    authorId: yup.number().typeError('ID de autor inválido').integer().positive().optional(),
    genreId: yup.number().typeError('ID de género inválido').integer().positive().optional(),
    shelfId: yup.number().typeError('ID de estante inválido').integer().positive().optional(),
    sagaId: yup.number().typeError('ID de saga inválido').integer().positive().optional(),
    year: yup.number().typeError('Año inválido').integer().min(1000).optional(),
    page: yup.number().typeError('La página debe ser un número').integer().positive().optional(),
    limit: yup.number().typeError('El límite debe ser un número').integer().positive().max(100).optional(),
  }),
});