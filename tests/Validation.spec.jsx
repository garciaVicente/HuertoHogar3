import { validName, validEmail, validateProduct, validateRegistration, validateCheckout } from '../src/utils/validation.js';

describe('Validaciones de datos de HuertoHogar', () => {
  it('rechaza nombres que contienen solo números', () => {
    expect(validName('123')).toBeFalse();
    expect(validName('Juan123')).toBeFalse();
    expect(validName('María José')).toBeTrue();
  });
  it('rechaza nombres demasiado cortos', () => {
    expect(validateRegistration({ name:'Al', email:'ana@mail.cl', password:'Clave123', confirm:'Clave123' }).name).toContain('3 caracteres');
  });
  it('rechaza correos con dominio incompleto o punto después de arroba', () => {
    expect(validEmail('aaaaa@.gmail.com')).toBeFalse();
    expect(validEmail('correo@gmail')).toBeFalse();
    expect(validEmail('ana..perez@gmail.com')).toBeFalse();
    expect(validEmail('ana.perez@gmail.com')).toBeTrue();
  });
  it('rechaza nombre de producto numérico', () => {
    expect(validateProduct({ name:'123', price:1000, stock:20, discount:0, category:'frutas' }).name).toBeTruthy();
  });
  it('acepta stock 20 y rechaza stock negativo o decimal', () => {
    expect(validateProduct({ name:'Manzanas', price:2500, stock:20, discount:0, category:'frutas' })).toEqual({});
    expect(validateProduct({ name:'Manzanas', price:2500, stock:-1, discount:0, category:'frutas' }).stock).toBeTruthy();
    expect(validateProduct({ name:'Manzanas', price:2500, stock:2.5, discount:0, category:'frutas' }).stock).toBeTruthy();
  });
  it('valida nombre y apellidos del checkout', () => {
    const errors = validateCheckout({ name:'123', lastName:'456', email:'a@b.cl', street:'Calle 1', region:'RM', city:'Santiago', delivery:'domicilio' });
    expect(errors.name).toBeTruthy();
    expect(errors.lastName).toBeTruthy();
  });
});
