import * as yup from 'yup';

export const sagaValidationSchema = yup.object().shape({
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
});