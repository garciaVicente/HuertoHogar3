import { apiRequest } from './api.js';

export async function registerUser(name, email, password) {
  const result = await apiRequest('/v1/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre: name.trim(), email: email.trim().toLowerCase(), password })
  });
  localStorage.setItem('huerto_token', result.token);
  const user = { id: result.usuario.id, name: result.usuario.nombre, email: result.usuario.email, role: result.usuario.rol };
  localStorage.setItem('huerto_session', JSON.stringify(user));
  return { ok: true, user };
}

export async function loginUser(email, password) {
  const result = await apiRequest('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password })
  });
  localStorage.setItem('huerto_token', result.token);
  const user = { id: result.usuario.id, name: result.usuario.nombre, email: result.usuario.email, role: result.usuario.rol };
  localStorage.setItem('huerto_session', JSON.stringify(user));
  return { ok: true, user };
}
