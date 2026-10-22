import * as Yup from 'yup';

export const authorSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .required('El nombre del autor es obligatorio.'),
  bio: Yup.string().optional(),
});