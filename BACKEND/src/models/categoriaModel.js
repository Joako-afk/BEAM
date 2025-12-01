// src/models/categoriaModel.js
import { pool } from "../config/db.js";

/**
 * Obtiene todas las categorías.
 */
export const obtenerCategorias = async () => {
  const result = await pool.query(
    `
    SELECT
      id_categoria,
      nombre,
      descripcion,
      color_primary,
      slug,
      icon_name
    FROM categoria
    ORDER BY id_categoria ASC
    `
  );
  return result.rows;
};

/**
 * Obtiene una categoría por su ID numérico.
 */
export const obtenerCategoriaPorId = async (idCategoria) => {
  const result = await pool.query(
    `
    SELECT
      id_categoria,
      nombre,
      descripcion,
      color_primary,
      slug,
      icon_name
    FROM categoria
    WHERE id_categoria = $1
    LIMIT 1
    `,
    [idCategoria]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

/**
 * Obtiene una categoría por su SLUG.
 * Ej: 'salud', 'organizaciones-sociales', etc.
 */
export const obtenerCategoriaPorSlug = async (slug) => {
  const result = await pool.query(
    `
    SELECT
      id_categoria,
      nombre,
      descripcion,
      color_primary,
      slug,
      icon_name
    FROM categoria
    WHERE slug = $1
    LIMIT 1
    `,
    [slug]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};
