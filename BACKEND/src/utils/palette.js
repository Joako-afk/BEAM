// BACKEND/src/utils/palette.js

// Convierte hex en RGB
function toRGB(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return { r, g, b };
}

function lighten(hex, factor = 0.7) {
  const { r, g, b } = toRGB(hex);
  return `rgb(${Math.round(r + (255 - r) * factor)},
              ${Math.round(g + (255 - g) * factor)},
              ${Math.round(b + (255 - b) * factor)})`;
}

function darken(hex, factor = 0.5) {
  const { r, g, b } = toRGB(hex);
  return `rgb(${Math.round(r * factor)},
              ${Math.round(g * factor)},
              ${Math.round(b * factor)})`;
}

function bestTextColor(hex) {
  const { r, g, b } = toRGB(hex);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness > 150 ? "#000000" : "#ffffff";
}

export function generatePalette(primary) {
  const safePrimary = primary || "#2563eb";

  return {
    primary: safePrimary,
    secondary: darken(safePrimary, 0.7),
    tertiary: lighten(safePrimary, 0.65),
    light: lighten(safePrimary, 0.85),
    dark: darken(safePrimary, 0.6),
    text: bestTextColor(safePrimary),
    daltonic: {
      protanopia: "#0072B2",
      deuteranopia: "#0072B2",
      tritanopia: "#E69F00",
      high_contrast: "#000000",
      pastel_safe: lighten(safePrimary, 0.9),
    },
  };
}
