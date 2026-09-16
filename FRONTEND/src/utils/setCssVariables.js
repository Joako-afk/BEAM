export function setCssVariables(palette) {
  const s = document.documentElement.style;
  s.setProperty("--primary", palette.primary);
  s.setProperty("--secondary", palette.secondary);
  s.setProperty("--tertiary", palette.tertiary);
  s.setProperty("--light", palette.light);
  s.setProperty("--text", palette.text);
}

export function resetCssVariables() {
  const s = document.documentElement.style;
  s.setProperty("--primary", "#3e6a0f");
  s.setProperty("--secondary", "#2f540c");
  s.setProperty("--tertiary", "#16a34a");
  s.setProperty("--light", "#f4f8e4");
  s.setProperty("--text", "#ffffff");
}
