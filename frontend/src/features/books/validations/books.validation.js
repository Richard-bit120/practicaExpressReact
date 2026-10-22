import * as Yup from 'yup';

export const bookSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título del libro es obligatorio.')
    .min(1, 'El título no puede estar vacío.'),
  isbn: Yup.string().optional(),
  year: Yup.number()
    .typeError('El año debe ser un número válido.')
    .integer('El año debe ser un número entero.')
    .min(1000, 'Año inválido.')
    .max(new Date().getFullYear() + 1, 'El año no puede ser en el futuro.')
    .optional()
    .nullable(),
  authorId: Yup.number()
    .typeError('Debe seleccionar un autor.')
    .required('El autor es obligatorio.'),
  genreId: Yup.number()
    .typeError('Debe seleccionar un género.')
    .required('El género es obligatorio.'),
  shelfId: Yup.number()
    .typeError('Debe seleccionar un estante.')
    .required('El estante físico es obligatorio.'),
  sagaId: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .optional(),
});