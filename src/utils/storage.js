import { initialProducts } from '../data/products.js';
import { MAX_CART_QUANTITY } from './validation.js';

export function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
export function loadProducts() {
  const saved = readJson('huerto_products_v2', null);
  return Array.isArray(saved) ? saved : initialProducts;
}
export function loadCart() {
  const saved = readJson('huerto_cart', []);
  if (!Array.isArray(saved)) return [];
  return saved.filter(p => p && Number.isFinite(Number(p.id)) && Number(p.quantity) > 0)
    .map(p => ({ ...p, id: Number(p.id), quantity: Math.min(MAX_CART_QUANTITY, Math.floor(Number(p.quantity))) }));
}
export function salePrice(product) {
  const discount = Math.min(90, Math.max(0, Number(product.discount) || 0));
  return Math.round(Number(product.price) * (1 - discount / 100));
}
export function availableStock(product) {
  return Math.max(0, Math.floor(Number(product?.stock) || 0));
}
export function cartLimit(product) {
  return Math.min(MAX_CART_QUANTITY, availableStock(product));
}
export function addItem(cart, product) {
  const max = cartLimit(product);
  const saleProduct = { ...product, price: salePrice(product) };
  const found = cart.find(item => item.id === product.id);
  if (max === 0 || (found && found.quantity >= max)) return cart;
  return found
    ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1, stock: max } : item)
    : [...cart, { ...saleProduct, quantity: 1, stock: max }];
}
export function changeQuantity(cart, id, amount, products = cart) {
  const product = products.find(p => p.id === id);
  const max = cartLimit(product);
  return cart.map(item => item.id === id
    ? { ...item, quantity: Math.min(max, MAX_CART_QUANTITY, Math.max(0, item.quantity + amount)), stock: max }
    : item).filter(item => item.quantity > 0);
}
export function validateStock(cart, products) {
  for (const item of cart) {
    const product = products.find(p => p.id === item.id);
    const available = availableStock(product);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY || item.quantity > available) {
      return `Stock insuficiente o cantidad inválida de ${item.name}. Máximo por producto: ${MAX_CART_QUANTITY}. Disponible: ${available}. En el carrito: ${item.quantity}.`;
    }
  }
  return '';
}
export function deductStock(products, cart) {
  const error = validateStock(cart, products);
  if (error) throw new Error(error);
  return products.map(product => {
    const item = cart.find(p => p.id === product.id);
    return item ? { ...product, stock: availableStock(product) - item.quantity } : product;
  });
}
export function cartTotal(cart) { return cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
export function cartCount(cart) { return cart.reduce((sum, item) => sum + item.quantity, 0); }
