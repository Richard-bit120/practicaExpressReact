import * as Yup from 'yup';

export const sagaSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre de la saga es obligatorio.')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.'),
});