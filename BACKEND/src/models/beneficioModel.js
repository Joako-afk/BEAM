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

/**
 * Lista todos los beneficios (para admin).
 */
export const listarTodosLosBeneficios = async () => {
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
      c.nombre AS categoria_nombre
    FROM beneficio b
    JOIN categoria c ON c.id_categoria = b.id_categoria
    ORDER BY b.nombre ASC
    `
  );
  return result.rows;
};

/**
 * Crea un nuevo beneficio.
 */
export const crearBeneficio = async (nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria) => {
  const result = await pool.query(
    `
    INSERT INTO beneficio (nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `,
    [nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria]
  );
  return result.rows[0];
};

/**
 * Actualiza un beneficio por su ID.
 */
export const actualizarBeneficio = async (id, nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria) => {
  const result = await pool.query(
    `
    UPDATE beneficio
    SET nombre = $1, descripcion = $2, requisitos = $3, costo = $4, edad_minima = $5,
        slug = $6, icon_name = $7, id_categoria = $8
    WHERE id_beneficio = $9
    RETURNING *
    `,
    [nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

/**
 * Elimina un beneficio por su ID.
 */
export const eliminarBeneficio = async (id) => {
  await pool.query(`DELETE FROM informacion_beneficio WHERE id_beneficio = $1`, [id]);
  await pool.query(`DELETE FROM beneficio_organismo WHERE id_beneficio = $1`, [id]);
  await pool.query(`DELETE FROM beneficio_comuna WHERE id_beneficio = $1`, [id]);
  const result = await pool.query(
    `DELETE FROM beneficio WHERE id_beneficio = $1 RETURNING id_beneficio`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

/**
 * Obtiene un beneficio por ID (para admin).
 */
export const obtenerBeneficioPorId = async (id) => {
  const result = await pool.query(
    `SELECT * FROM beneficio WHERE id_beneficio = $1`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};
