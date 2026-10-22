export const validateCreateAuthor = (body: any): string | null => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    return 'El nombre del autor es obligatorio.';
  }
  if (body.name.trim().length < 2) {
    return 'El nombre del autor debe tener al menos 2 caracteres.';
  }
  if (body.bio !== undefined && typeof body.bio !== 'string') {
    return 'La biografía debe ser una cadena de texto válida.';
  }
  return null;
};

export const validateUpdateAuthor = (body: any): string | null => {
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      return 'El nombre del autor no puede estar vacío.';
    }
    if (body.name.trim().length < 2) {
      return 'El nombre del autor debe tener al menos 2 caracteres.';
    }
  }
  if (body.bio !== undefined && typeof body.bio !== 'string') {
    return 'La biografía debe ser una cadena de texto válida.';
  }
  return null;
};