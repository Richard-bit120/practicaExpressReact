import * as Yup from 'yup';

export const authorSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    bio: Yup.string()
        .max(500, 'La biografía no puede exceder los 500 caracteres')
        .nullable()
});