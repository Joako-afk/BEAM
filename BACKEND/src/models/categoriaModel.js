// BACKEND/src/models/categoriaModel.js

import { pool } from "../config/db.js";

export const obtenerCategorias = async () => {
  const result = await pool.query(`
    SELECT 
      id_categoria,
      nombre,
      descripcion,
      slug,
      color_primary,
      icon_name
    FROM categoria
    ORDER BY id_categoria ASC
  `);
  return result.rows;
};

export const obtenerCategoriaPorSlug = async (slug) => {
  const result = await pool.query(
    `
    SELECT 
      id_categoria,
      nombre,
      descripcion,
      slug,
      color_primary,
      icon_name
    FROM categoria
    WHERE slug = $1
    LIMIT 1
  `,
    [slug]
  );

  return result.rows[0];
};

export const crearCategoria = async ({
  nombre,
  descripcion,
  color_primary,
  slug,
  icon_name,
}) => {
  const result = await pool.query(
    `
    INSERT INTO categoria (nombre, descripcion, color_primary, slug, icon_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_categoria, nombre, descripcion, slug, color_primary, icon_name
  `,
    [nombre, descripcion, color_primary, slug, icon_name]
  );
  return result.rows[0];
};
