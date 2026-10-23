import * as yup from 'yup';

export const shelfValidationSchema = yup.object().shape({
    code: yup
        .string()
        .required('El código del estante es obligatorio')
        .min(1, 'El código no puede estar vacío')
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
});