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
      b.url_beneficio,
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
 * { categoria: {...}, beneficios: [...] }
 */
export const obtenerBeneficiosPorSlugCategoria = async (slugCategoria) => {
  // 1) Categoría
  const catResult = await pool.query(
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

  if (catResult.rowCount === 0) return null;

  const categoria = catResult.rows[0];

  // 2) Beneficios de esa categoría
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
      b.url_beneficio,
      b.id_categoria
    FROM beneficio b
    WHERE b.id_categoria = $1
    ORDER BY b.nombre ASC
    `,
    [categoria.id_categoria]
  );

  const beneficios = benResult.rows;

  return { categoria, beneficios };
};

/**
 * Beneficio individual + bloques de INFORMACION
 * /api/beneficios/:slug
 */
export const obtenerBeneficioPorSlug = async (slug) => {
  // 1) Beneficio principal
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
      b.id_categoria,
      b.url_beneficio,
      c.color_primary
    FROM beneficio b
    JOIN categoria c ON c.id_categoria = b.id_categoria
    WHERE b.slug = $1
    LIMIT 1
    `,
    [slug]
  );

  if (result.rowCount === 0) return null;

  const beneficio = result.rows[0];

  // 2) Bloques de información
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

/**
 * Organismos (sucursales) donde se puede usar un beneficio,
 * buscado por el SLUG del beneficio.
 */
export const obtenerOrganismosPorSlugBeneficio = async (slugBeneficio) => {
  const result = await pool.query(
    `
    SELECT
      o.id_organismo,
      o.nombre_sucursal,
      o.tipo,
      o.direccion,
      o.telefono,
      ST_X(o.coordenadas) AS lng,
      ST_Y(o.coordenadas) AS lat
    FROM beneficio b
    JOIN beneficio_organismo bo
      ON bo.id_beneficio = b.id_beneficio
    JOIN organismo o
      ON o.id_organismo = bo.id_organismo
    WHERE b.slug = $1
    ORDER BY o.nombre_sucursal ASC
    `,
    [slugBeneficio]
  );

  return result.rows; // array de sucursales con lat/lng
};
