// src/models/organismoModel.js
import { pool } from "../config/db.js";

export const obtenerTodasLasInstituciones = async () => {
  const result = await pool.query(`
    SELECT 
      id_institucion,
      nombre,
      descripcion,
      pagina_web,
      logo_url,
      email_contacto,
      id_categoria
    FROM institucion
    ORDER BY nombre ASC
  `);

  return result.rows;
};

// CLAVE: instituciones por slug de categoría (igual patrón que beneficios)
export const obtenerInstitucionesPorSlugCategoria = async (slugCategoria) => {
  const catRes = await pool.query(
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
    [slugCategoria]
  );

  if (catRes.rowCount === 0) return null;

  const categoria = catRes.rows[0];

  const instRes = await pool.query(
    `
    SELECT 
      id_institucion,
      nombre,
      slug,
      descripcion,
      pagina_web,
      logo_url,
      email_contacto,
      id_categoria
    FROM institucion
    WHERE id_categoria = $1
    ORDER BY nombre ASC
    `,
    [categoria.id_categoria]
  );

  return {
    categoria,
    instituciones: instRes.rows,
  };
};

export const obtenerInstitucionPorId = async (id) => {
  const result = await pool.query(
    `SELECT * FROM institucion WHERE id_institucion = $1`,
    [id]
  );
  return result.rows[0];
};

export const obtenerInstitucionPorSlug = async (slug) => {
  const result = await pool.query(
    `
    SELECT 
      id_institucion,
      nombre,
      slug,
      descripcion,
      pagina_web,
      logo_url,
      email_contacto,
      id_categoria
    FROM institucion
    WHERE slug = $1
    LIMIT 1
    `,
    [slug]
  );

  return result.rows[0] || null;
};

