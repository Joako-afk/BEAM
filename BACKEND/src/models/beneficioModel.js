// src/models/beneficioModel.js
import { pool } from "../config/db.js";

/**
 * Lista beneficios por ID de categoría.
 */
export const obtenerBeneficiosPorCategoriaId = async (idCategoria) => {
  const result = await pool.query(
    `
    SELECT
      b.id_beneficio,
      b.nombre,
      b.descripcion,
      b.requisitos,
      b.costo,
      b.edad_minima,
      b.slug,
      b.icon_name,
      b.id_categoria
    FROM beneficio b
    WHERE b.id_categoria = $1
    ORDER BY b.nombre ASC
    `,
    [idCategoria]
  );
  return result.rows;
};

/**
 * Lista beneficios por SLUG de categoría y devuelve:
 * {
 *   categoria: {...},
 *   beneficios: [...]
 * }
 *
 * Esta es la forma que tu frontend está esperando.
 */
export const obtenerBeneficiosPorSlugCategoria = async (slugCategoria) => {
  // 1) Obtener la categoría por su slug
  const catResult = await pool.query(
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
    [slugCategoria]
  );

  if (catResult.rowCount === 0) {
    return null; // categoría no encontrada
  }

  const categoria = catResult.rows[0];

  // 2) Obtener los beneficios asociados a esa categoría
  const benResult = await pool.query(
    `
    SELECT
      b.id_beneficio,
      b.nombre,
      b.descripcion,
      b.requisitos,
      b.costo,
      b.edad_minima,
      b.slug,
      b.icon_name,
      b.id_categoria
    FROM beneficio b
    WHERE b.id_categoria = $1
    ORDER BY b.nombre ASC
    `,
    [categoria.id_categoria]
  );

  const beneficios = benResult.rows;

  // 3) Devolver en el formato que el FRONT espera
  return {
    categoria,
    beneficios,
  };
};

/**
 * Beneficio individual + bloques de INFORMACION
 * /api/beneficios/:slug
 */
export const obtenerBeneficioPorSlug = async (slug) => {
  // 1) Obtener el beneficio principal
  const result = await pool.query(
    `
    SELECT
      b.id_beneficio,
      b.nombre,
      b.descripcion,
      b.requisitos,
      b.costo,
      b.edad_minima,
      b.slug,
      b.icon_name,
      b.id_categoria
    FROM beneficio b
    WHERE b.slug = $1
    LIMIT 1
    `,
    [slug]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const beneficio = result.rows[0];

  // 2) Obtener los bloques de información asociados
  const infoResult = await pool.query(
    `
    SELECT
      i.id_info,
      i.bloque,
      i.nombre,
      i.contenido
    FROM informacion i
    JOIN informacion_beneficio ib
      ON ib.id_info = i.id_info
    WHERE ib.id_beneficio = $1
    ORDER BY i.bloque ASC, i.id_info ASC
    `,
    [beneficio.id_beneficio]
  );

  beneficio.info_bloques = infoResult.rows;
  return beneficio;
};
