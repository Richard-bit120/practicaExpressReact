# Plan de Pruebas y Criterios de Aceptación

1. **Autenticación**: Login con credenciales válidas otorga token JWT. Credenciales incorrectas retornan `401`.
2. **Protección de Rutas**: Peticiones sin token o con token expirado en rutas administrativas son rechazadas con `401`.
3. **Restricciones de Integridad**: Intentar eliminar un autor, género o estante que contenga libros asociados retorna conflicto `409`.
4. **Filtros Combinados**: La consulta `GET /api/books?genreId=1&authorId=2` filtra simultáneamente de forma correcta en TypeORM.
5. **Validación Frontend**: Yup bloquea formularios inválidos y muestra mensajes de error por campo.