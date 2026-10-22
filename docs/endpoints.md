# Documentación de Endpoints REST API

## Autenticación
- `POST /api/auth/login` - Inicia sesión y retorna JWT y datos del admin.

## Libros (`/api/books`)
- `GET /api/books` - Obtiene listado de libros. Soporta filtros: `?genreId=1&authorId=2&sagaId=3&year=2020`
- `GET /api/books/:id` - Obtiene detalle completo de un libro y su estante físico.
- `POST /api/books` - Crea un libro nuevo (Requiere JWT).
- `PUT /api/books/:id` - Actualiza un libro (Requiere JWT).
- `DELETE /api/books/:id` - Elimina un libro (Requiere JWT).

## Autores, Géneros, Sagas y Estantes
- `GET /api/authors`, `POST /api/authors`, `PUT /api/authors/:id`, `DELETE /api/authors/:id`
- `GET /api/genres`, `POST /api/genres`, `PUT /api/genres/:id`, `DELETE /api/genres/:id`
- `GET /api/sagas`, `POST /api/sagas`, `PUT /api/sagas/:id`, `DELETE /api/sagas/:id`
- `GET /api/shelves`, `POST /api/shelves`, `PUT /api/shelves/:id`, `DELETE /api/shelves/:id`

## Logs de Sistema (`/api/logs`)
- `GET /api/logs` - Consulta registros de auditoría y eventos (Filtros por nivel `?level=INFO|WARN|ERROR`).