export const validateCreateBook = (body: any): string | null => {
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    return 'El título del libro es obligatorio.';
  }
  if (body.isbn !== undefined && body.isbn !== null && typeof body.isbn !== 'string') {
    return 'El formato del ISBN es inválido.';
  }
  if (body.year !== undefined && body.year !== null) {
    const yearNum = Number(body.year);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > new Date().getFullYear() + 1) {
      return 'El año de publicación es inválido.';
    }
  }
  if (!body.authorId || isNaN(Number(body.authorId))) {
    return 'El identificador del autor es obligatorio y debe ser válido.';
  }
  if (!body.genreId || isNaN(Number(body.genreId))) {
    return 'El identificador del género es obligatorio y debe ser válido.';
  }
  if (!body.shelfId || isNaN(Number(body.shelfId))) {
    return 'El identificador del estante físico es obligatorio y debe ser válido.';
  }
  return null;
};

export const validateUpdateBook = (body: any): string | null => {
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
    return 'El título del libro no puede estar vacío.';
  }
  if (body.year !== undefined && body.year !== null) {
    const yearNum = Number(body.year);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > new Date().getFullYear() + 1) {
      return 'El año de publicación es inválido.';
    }
  }
  if (body.authorId !== undefined && isNaN(Number(body.authorId))) {
    return 'El identificador del autor debe ser válido.';
  }
  if (body.genreId !== undefined && isNaN(Number(body.genreId))) {
    return 'El identificador del género debe ser válido.';
  }
  if (body.shelfId !== undefined && isNaN(Number(body.shelfId))) {
    return 'El identificador del estante físico debe ser válido.';
  }
  return null;
};