import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('El usuario es obligatorio')
        .min(3, 'El usuario debe tener al menos 3 caracteres')
        .max(50, 'El usuario no puede exceder 50 caracteres')
        .trim(),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres'),
});