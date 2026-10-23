import * as yup from 'yup';

const ISBN_REGEX = /^(?:\d{10}|\d{13}|978[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,6}[-\s]?\d)$/;
const CURRENT_YEAR = new Date().getFullYear();

export const bookValidationSchema = yup.object().shape({
    title: yup
        .string()
        .required('El título es obligatorio')
        .min(1, 'El título no puede estar vacío')
        .max(255, 'El título no puede exceder 255 caracteres')
        .trim(),
    isbn: yup
        .string()
        .nullable()
        .test('isbn-format', 'El formato del ISBN es inválido', function (value) {
            if (!value || value.trim() === '') return true;
            return ISBN_REGEX.test(value);
        }),
    year: yup
        .number()
        .nullable()
        .typeError('El año debe ser un número')
        .integer('El año debe ser un número entero')
        .min(1000, 'El año debe ser válido')
        .max(CURRENT_YEAR + 1, 'El año no puede ser futuro'),
    authorId: yup
        .number()
        .typeError('Seleccione un autor')
        .required('El autor es obligatorio')
        .positive('Seleccione un autor'),
    genreId: yup
        .number()
        .typeError('Seleccione un género')
        .required('El género es obligatorio')
        .positive('Seleccione un género'),
    shelfId: yup
        .number()
        .typeError('Seleccione un estante')
        .required('El estante es obligatorio')
        .positive('Seleccione un estante'),
    sagaId: yup
        .number()
        .nullable()
        .typeError('Seleccione una saga válida'),
});