export const validateLogin = (body: any): string | null => {
  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    return 'El correo electrónico es obligatorio.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return 'El formato del correo electrónico es inválido.';
  }
  if (!body.password || typeof body.password !== 'string' || body.password.trim() === '') {
    return 'La contraseña es obligatoria.';
  }
  return null;
};