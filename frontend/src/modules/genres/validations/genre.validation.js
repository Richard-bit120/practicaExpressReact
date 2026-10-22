export const genreSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del género es requerido').max(50),
    description: Yup.string().max(255).nullable()
});