const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('huerto_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, { ...options, headers });
  } catch {
    throw new Error('No se pudo conectar con el backend. Inicia Spring Boot y MySQL.');
  }
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(data?.mensaje || data?.message || `Error HTTP ${response.status}`);
  return data;
}
