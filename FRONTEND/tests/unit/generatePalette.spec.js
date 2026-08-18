import { describe, it, expect } from 'vitest';
import { generatePalette } from '../../src/utils/generatePalette.js';

const hexToRgb = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return { r, g, b };
};

const luminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const contrastRatio = (hex1, hex2) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const isHexColor = (str) => /^#[0-9a-f]{6}$/i.test(str);

describe('generatePalette', () => {
  it('debe retornar colores primarios', () => {
    const palette = generatePalette('#2563eb');
    expect(palette.primary).toBeDefined();
    expect(palette.secondary).toBeDefined();
    expect(palette.tertiary).toBeDefined();
  });

  it('todos los colores deben ser hex válido', () => {
    const palette = generatePalette('#2563eb');
    expect(isHexColor(palette.primary)).toBe(true);
    expect(isHexColor(palette.secondary)).toBe(true);
    expect(isHexColor(palette.tertiary)).toBe(true);
    expect(isHexColor(palette.light)).toBe(true);
    expect(isHexColor(palette.dark)).toBe(true);
  });

  it('primary y secondary deben cumplir contraste WCAG AA con blanco', () => {
    const palette = generatePalette('#669101');
    expect(contrastRatio(palette.primary, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.secondary, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('debe tener color de texto válido', () => {
    const palette = generatePalette('#2563eb');
    expect(['#000000', '#ffffff']).toContain(palette.text);
  });

  it('debe usar color por defecto si no se provee', () => {
    const palette = generatePalette(null);
    expect(palette.primary).toBeDefined();
  });

  it('debe tener paleta daltonic', () => {
    const palette = generatePalette('#2563eb');
    expect(palette.daltonic).toBeDefined();
    expect(palette.daltonic.protanopia).toBeDefined();
    expect(palette.daltonic.deuteranopia).toBeDefined();
    expect(palette.daltonic.tritanopia).toBeDefined();
  });

  it('debe retornar blanco para colores oscuros', () => {
    const palette = generatePalette('#000000');
    expect(palette.text).toBe('#ffffff');
  });

  it('text color debe ser consistente con el primary ajustado', () => {
    const palette = generatePalette('#eeeeee');
    expect(['#000000', '#ffffff']).toContain(palette.text);
    const ratio = contrastRatio(palette.primary, palette.text === '#ffffff' ? '#ffffff' : '#000000');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('colores de las 4 categorías deben cumplir contraste', () => {
    const categorias = ['#011991', '#669101', '#860707', '#860784'];
    for (const color of categorias) {
      const palette = generatePalette(color);
      const primaryRatio = contrastRatio(palette.primary, '#ffffff');
      const secondaryRatio = contrastRatio(palette.secondary, '#ffffff');
      expect(primaryRatio).toBeGreaterThanOrEqual(4.5);
      expect(secondaryRatio).toBeGreaterThanOrEqual(4.5);
    }
  });
});
