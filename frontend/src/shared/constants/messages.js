export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Registro creado exitosamente',
        UPDATED: 'Registro actualizado exitosamente',
        DELETED: 'Registro eliminado exitosamente',
    },
    ERROR: {
        GENERIC: 'Ocurrió un error inesperado. Intente nuevamente.',
        NETWORK: 'Error de conexión con el servidor.',
        NOT_FOUND: 'Recurso no encontrado.',
        VALIDATION: 'Por favor, corrija los errores del formulario.',
        DELETE_CONSTRAINT: 'No se puede eliminar porque tiene registros asociados.',
    },
    AUTH: {
        LOGIN_SUCCESS: 'Inicio de sesión exitoso',
        LOGIN_ERROR: 'Usuario o contraseña incorrectos',
        SESSION_EXPIRED: 'Su sesión ha expirado. Inicie sesión nuevamente.',
    },
    CONFIRM: {
        DELETE: '¿Está seguro de que desea eliminar este registro?',
    },
};