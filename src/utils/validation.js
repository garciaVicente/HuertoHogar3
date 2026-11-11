export const MAX_CART_QUANTITY = 20;

export const validName = value =>
  /^[\p{L}]+(?: +[\p{L}]+)*$/u.test(String(value || '').trim());

// Formato equivalente al uso de Patterns.EMAIL_ADDRESS.matcher(...).matches() en Android.
export const validEmail = value =>
  /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(String(value || '').trim());

export function validateContact({ name = '', email = '', message = '' }) {
  const errors = {};
  if (name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
  else if (name.trim().length > 80) errors.name = 'El nombre no puede superar 80 caracteres.';
  else if (!validName(name)) errors.name = 'El nombre solo puede contener letras y espacios.';
  if (email.trim().length > 120 || !validEmail(email)) errors.email = 'Ingresa un correo electrónico válido.';
  if (message.trim().length < 10) errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  return errors;
}

export function validateRegistration({ name = '', email = '', password = '', confirm = '' }) {
  const errors = {};
  if (name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
  else if (name.trim().length > 80) errors.name = 'El nombre no puede superar 80 caracteres.';
  else if (!validName(name)) errors.name = 'El nombre solo puede contener letras y espacios.';
  if (email.trim().length > 120 || !validEmail(email)) errors.email = 'Ingresa un correo electrónico válido.';
  if (password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (confirm !== password) errors.confirm = 'Las contraseñas no coinciden.';
  return errors;
}

export function validateCheckout(data = {}) {
  const errors = {};
  if (!validName(data.name) || data.name.trim().length > 80) errors.name = 'Ingresa un nombre válido, solo con letras (máximo 80 caracteres).';
  if (!validName(data.lastName) || data.lastName.trim().length > 80) errors.lastName = 'Ingresa apellidos válidos, solo con letras (máximo 80 caracteres).';
  if (String(data.email || '').trim().length > 120 || !validEmail(data.email)) errors.email = 'Ingresa un correo electrónico válido.';
  if (!data.street?.trim()) errors.street = 'Ingresa tu dirección.';
  if (!data.region?.trim()) errors.region = 'Selecciona una región.';
  if (!data.city?.trim()) errors.city = 'Ingresa tu comuna.';
  if (!['domicilio', 'retiro'].includes(data.delivery)) errors.delivery = 'Selecciona entrega.';
  return errors;
}

export function validateProduct(data = {}) {
  const errors = {};
  if (String(data.name || '').trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';
  else if (String(data.name).trim().length > 100) errors.name = 'El nombre no puede superar 100 caracteres.';
  else if (!validName(data.name)) errors.name = 'El nombre solo puede contener letras y espacios. Ejemplo: Manzanas Orgánicas.';
  if (!Number.isInteger(Number(data.price)) || Number(data.price) <= 0) errors.price = 'El precio debe ser un número entero mayor que cero.';
  if (String(data.stock ?? '').trim() === '' || !Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) errors.stock = 'El stock debe ser un número entero igual o mayor que cero.';
  if (!Number.isInteger(Number(data.discount)) || Number(data.discount) < 0 || Number(data.discount) > 90) errors.discount = 'El descuento debe estar entre 0 y 90.';
  if (!String(data.category || '').trim()) errors.category = 'Selecciona una categoría.';
  return errors;
}

export function validateCartQuantity(quantity, stock) {
  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) return 'La cantidad mínima es 1.';
  if (Number(quantity) > MAX_CART_QUANTITY) return `El carrito permite máximo ${MAX_CART_QUANTITY} unidades por producto.`;
  if (Number(quantity) > Number(stock)) return `Stock insuficiente. Solo hay ${stock} unidades disponibles.`;
  return '';
}
