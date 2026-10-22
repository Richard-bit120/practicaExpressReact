export const validateCreateSaga = (body: any): string | null => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    return 'El nombre de la saga es obligatorio.';
  }
  if (body.name.trim().length < 2) {
    return 'El nombre de la saga debe tener al menos 2 caracteres.';
  }
  if (body.description && typeof body.description !== 'string') {
    return 'La descripción debe ser una cadena de texto válida.';
  }
  return null;
};

export const validateUpdateSaga = (body: any): string | null => {
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      return 'El nombre de la saga no puede estar vacío.';
    }
    if (body.name.trim().length < 2) {
      return 'El nombre de la saga debe tener al menos 2 caracteres.';
    }
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    return 'La descripción debe ser una cadena de texto válida.';
  }
  return null;
};