import { addItem, changeQuantity, validateStock, deductStock, availableStock, cartLimit } from '../src/utils/storage.js';

describe('Control de stock', () => {
  const apple = { id: 1, name: 'Manzanas', price: 2500, stock: 20 };
  it('limita el carrito a 20 unidades aunque el stock sea mayor', () => {
    expect(availableStock({ ...apple, stock:100 })).toBe(100);
    expect(cartLimit({ ...apple, stock:100 })).toBe(20);
    expect(validateStock([{ ...apple, stock:100, quantity:21 }], [{ ...apple, stock:100 }])).toContain('máximo por producto: 20');
  });
  it('rechaza agregar la unidad 21 al carrito', () => {
    const full = [{ ...apple, quantity: 20 }];
    expect(addItem(full, apple)).toBe(full);
  });
  it('impide aumentar la cantidad por encima del stock', () => {
    const next = changeQuantity([{ ...apple, quantity: 20 }], 1, 1, [apple]);
    expect(next[0].quantity).toBe(20);
  });
  it('rechaza un checkout de 100 unidades cuando solo hay 20', () => {
    expect(validateStock([{ ...apple, quantity: 100 }], [apple])).toContain('Stock insuficiente');
  });
  it('descuenta stock únicamente cuando se llama al confirmar pedido', () => {
    const updated = deductStock([apple], [{ ...apple, quantity: 3 }]);
    expect(updated[0].stock).toBe(17);
    expect(apple.stock).toBe(20);
  });
  it('no permite descontar más del inventario', () => {
    expect(() => deductStock([apple], [{ ...apple, quantity: 100 }])).toThrowError(/Stock insuficiente/);
  });
});
