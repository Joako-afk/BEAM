// src/utils/generatePalette.js

// Convierte hex en RGB
const toRGB = (hex) => {
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
  const rgb1 = toRGB(hex1);
  const rgb2 = toRGB(hex2);
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const bestTextColor = (hex) => {
  const whiteContrast = contrastRatio(hex, "#ffffff");
  const blackContrast = contrastRatio(hex, "#000000");
  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
};

// Ajusta un color oscureciendo hasta tener contraste mínimo con white
const darkenToContrast = (hex, targetRatio = 4.5) => {
  const { r, g, b } = toRGB(hex);
  let adj = hex;
  for (let f = 0.95; f >= 0.1; f -= 0.05) {
    const dr = Math.round(r * f);
    const dg = Math.round(g * f);
    const db = Math.round(b * f);
    adj = `#${dr.toString(16).padStart(2,'0')}${dg.toString(16).padStart(2,'0')}${db.toString(16).padStart(2,'0')}`;
    if (contrastRatio(adj, "#ffffff") >= targetRatio) return adj;
  }
  return adj;
};

const ensureContrastWithWhite = (hex, targetRatio = 4.5) => {
  if (contrastRatio(hex, "#ffffff") >= targetRatio) return hex;
  return darkenToContrast(hex, targetRatio);
};

export function generatePalette(primary) {
  const safePrimary = primary || "#2563eb";
  const adjustedPrimary = ensureContrastWithWhite(safePrimary, 4.5);

  // secondary: oscurecido lo mínimo para pasar 4.5:1 con blanco
  const adjustedSecondary = ensureContrastWithWhite(safePrimary, 4.5);
  // tertiary: más oscuro que primary
  const { r: pr, g: pg, b: pb } = toRGB(adjustedPrimary);
  const tertiary = `#${Math.round(pr * 0.6).toString(16).padStart(2,'0')}${Math.round(pg * 0.6).toString(16).padStart(2,'0')}${Math.round(pb * 0.6).toString(16).padStart(2,'0')}`;

  return {
    primary: adjustedPrimary,
    secondary: adjustedSecondary,
    tertiary,
    light: `#${Math.round(pr + (255 - pr) * 0.8).toString(16).padStart(2,'0')}${Math.round(pg + (255 - pg) * 0.8).toString(16).padStart(2,'0')}${Math.round(pb + (255 - pb) * 0.8).toString(16).padStart(2,'0')}`,
    dark: `#${Math.round(pr * 0.6).toString(16).padStart(2,'0')}${Math.round(pg * 0.6).toString(16).padStart(2,'0')}${Math.round(pb * 0.6).toString(16).padStart(2,'0')}`,
    text: bestTextColor(adjustedPrimary),

    daltonic: {
      protanopia: ensureContrastWithWhite("#0072B2", 4.5),
      deuteranopia: ensureContrastWithWhite("#0072B2", 4.5),
      tritanopia: ensureContrastWithWhite("#E69F00", 4.5),
      high_contrast: "#000000",
      pastel_safe: ensureContrastWithWhite(
        `#${Math.round(pr + (255 - pr) * 0.85).toString(16).padStart(2,'0')}${Math.round(pg + (255 - pg) * 0.85).toString(16).padStart(2,'0')}${Math.round(pb + (255 - pb) * 0.85).toString(16).padStart(2,'0')}`,
        4.5
      ),
    },
  };
}
