// BACKEND/src/utils/slugify.js
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")               // quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")    // espacios y símbolos -> -
    .replace(/(^-|-$)/g, "");       // quita - al inicio/fin
}