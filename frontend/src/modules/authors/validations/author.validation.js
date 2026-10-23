import * as yup from 'yup';

export const authorValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required('El nombre es obligatorio')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(150, 'El nombre no puede exceder 150 caracteres')
        .trim(),
    biography: yup
        .string()
        .nullable()
        .max(2000, 'La biografía no puede exceder 2000 caracteres')
        .trim(),
});