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

/**
 * Crea una nueva categoría.
 */
export const crearCategoria = async (nombre, descripcion, color_primary, slug, icon_name) => {
  const result = await pool.query(
    `
    INSERT INTO categoria (nombre, descripcion, color_primary, slug, icon_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_categoria, nombre, descripcion, color_primary, slug, icon_name
    `,
    [nombre, descripcion, color_primary, slug, icon_name]
  );
  return result.rows[0];
};

/**
 * Actualiza una categoría por su ID.
 */
export const actualizarCategoria = async (id, nombre, descripcion, color_primary, slug, icon_name) => {
  const result = await pool.query(
    `
    UPDATE categoria
    SET nombre = $1, descripcion = $2, color_primary = $3, slug = $4, icon_name = $5
    WHERE id_categoria = $6
    RETURNING id_categoria, nombre, descripcion, color_primary, slug, icon_name
    `,
    [nombre, descripcion, color_primary, slug, icon_name, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

/**
 * Elimina una categoría por su ID.
 */
export const eliminarCategoria = async (id) => {
  const result = await pool.query(
    `DELETE FROM categoria WHERE id_categoria = $1 RETURNING id_categoria`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};
