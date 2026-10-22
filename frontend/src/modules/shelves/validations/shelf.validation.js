export const shelfSchema = Yup.object().shape({
    code: Yup.string().required('El código/nombre del estante es requerido').max(20),
    location: Yup.string().max(100, 'Ubicación física').nullable()
});