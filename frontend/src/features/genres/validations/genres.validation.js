import * as Yup from 'yup';

export const genreSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre del género es obligatorio.')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.'),
});