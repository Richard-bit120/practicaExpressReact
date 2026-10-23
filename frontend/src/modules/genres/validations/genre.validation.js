import * as yup from 'yup';

export const genreValidationSchema = yup.object().shape({
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
});