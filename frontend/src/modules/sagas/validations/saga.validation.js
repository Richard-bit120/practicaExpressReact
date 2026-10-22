export const sagaSchema = Yup.object().shape({
    title: Yup.string().required('El título de la saga es requerido').max(100),
    synopsis: Yup.string().max(1000).nullable()
});