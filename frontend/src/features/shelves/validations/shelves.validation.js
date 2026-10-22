import * as Yup from 'yup';

export const shelfSchema = Yup.object().shape({
  code: Yup.string()
    .required('El código del estante es obligatorio.')
    .trim(),
  location: Yup.string()
    .required('La ubicación del estante es obligatoria.')
    .trim(),
  description: Yup.string().optional().nullable(),
});