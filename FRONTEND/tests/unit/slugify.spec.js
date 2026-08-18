import { describe, it, expect } from 'vitest';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

describe('slugify', () => {
  it('debe convertir texto a minúsculas', () => {
    expect(slugify('HOLA MUNDO')).toBe('hola-mundo');
  });

  it('debe quitar tildes', () => {
    expect(slugify('Atención')).toBe('atencion');
    expect(slugify('CIÓN')).toBe('cion');
  });

  it('debe reemplazar espacios por guiones', () => {
    expect(slugify('hola mundo')).toBe('hola-mundo');
  });

  it('debe quitar caracteres especiales', () => {
    expect(slugify('hola!@#$%')).toBe('hola');
  });

  it('debe quitar guiones al inicio y final', () => {
    expect(slugify('-hola-')).toBe('hola');
  });

  it('debe manejar texto vacío', () => {
    expect(slugify('')).toBe('');
  });

  it('debe manejar múltiples espacios', () => {
    expect(slugify('hola   mundo')).toBe('hola-mundo');
  });

  it('debe procesar beneficio real', () => {
    expect(slugify('Examen Médico Preventivo del Adulto Mayor')).toBe(
      'examen-medico-preventivo-del-adulto-mayor'
    );
  });
});
