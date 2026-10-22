export const validateCreateShelf = (body: any): string | null => {
  if (!body.code || typeof body.code !== 'string' || body.code.trim() === '') {
    return 'El código del estante es obligatorio.';
  }
  if (!body.location || typeof body.location !== 'string' || body.location.trim() === '') {
    return 'La ubicación o sector del estante es obligatoria.';
  }
  if (body.description && typeof body.description !== 'string') {
    return 'La descripción debe ser una cadena de texto válida.';
  }
  return null;
};

export const validateUpdateShelf = (body: any): string | null => {
  if (body.code !== undefined) {
    if (typeof body.code !== 'string' || body.code.trim() === '') {
      return 'El código del estante no puede estar vacío.';
    }
  }
  if (body.location !== undefined) {
    if (typeof body.location !== 'string' || body.location.trim() === '') {
      return 'La ubicación del estante no puede estar vacía.';
    }
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    return 'La descripción debe ser una cadena de texto válida.';
  }
  return null;
};