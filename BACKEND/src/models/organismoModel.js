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

// ===== INSTITUCIONES CRUD =====

export const crearInstitucion = async (nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria) => {
  const result = await pool.query(
    `
    INSERT INTO institucion (nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria]
  );
  return result.rows[0];
};

export const actualizarInstitucion = async (id, nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria) => {
  const result = await pool.query(
    `
    UPDATE institucion
    SET nombre = $1, descripcion = $2, pagina_web = $3, logo_url = $4, email_contacto = $5, slug = $6, id_categoria = $7
    WHERE id_institucion = $8
    RETURNING *
    `,
    [nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const eliminarInstitucion = async (id) => {
  await pool.query(`DELETE FROM institucion_redes WHERE id_institucion = $1`, [id]);
  const result = await pool.query(
    `DELETE FROM institucion WHERE id_institucion = $1 RETURNING id_institucion`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const obtenerTodasLasInstitucionesAdmin = async () => {
  const result = await pool.query(
    `
    SELECT i.id_institucion, i.nombre, i.descripcion, i.pagina_web, i.logo_url,
           i.email_contacto, i.slug, i.id_categoria, c.nombre AS categoria_nombre
    FROM institucion i
    LEFT JOIN categoria c ON c.id_categoria = i.id_categoria
    ORDER BY i.nombre ASC
    `
  );
  return result.rows;
};

// ===== ORGANISMOS CRUD =====

export const obtenerTodosLosOrganismos = async () => {
  const result = await pool.query(
    `
    SELECT
      o.id_organismo,
      o.nombre_sucursal,
      o.tipo,
      o.direccion,
      o.telefono,
      ST_X(o.coordenadas) AS lng,
      ST_Y(o.coordenadas) AS lat,
      o.id_institucion,
      o.id_divter,
      i.nombre AS institucion_nombre
    FROM organismo o
    LEFT JOIN institucion i ON i.id_institucion = o.id_institucion
    ORDER BY o.nombre_sucursal ASC
    `
  );
  return result.rows;
};

export const crearOrganismo = async (nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter) => {
  const result = await pool.query(
    `
    INSERT INTO organismo (nombre_sucursal, tipo, direccion, telefono, coordenadas, id_institucion, id_divter)
    VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8)
    RETURNING id_organismo, nombre_sucursal, tipo, direccion, telefono,
              ST_X(coordenadas) AS lng, ST_Y(coordenadas) AS lat, id_institucion, id_divter
    `,
    [nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter]
  );
  return result.rows[0];
};

export const actualizarOrganismo = async (id, nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter) => {
  const result = await pool.query(
    `
    UPDATE organismo
    SET nombre_sucursal = $1, tipo = $2, direccion = $3, telefono = $4,
        coordenadas = ST_SetSRID(ST_MakePoint($5, $6), 4326),
        id_institucion = $7, id_divter = $8
    WHERE id_organismo = $9
    RETURNING id_organismo, nombre_sucursal, tipo, direccion, telefono,
              ST_X(coordenadas) AS lng, ST_Y(coordenadas) AS lat, id_institucion, id_divter
    `,
    [nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const eliminarOrganismo = async (id) => {
  await pool.query(`DELETE FROM beneficio_organismo WHERE id_organismo = $1`, [id]);
  await pool.query(`DELETE FROM organismo_evento WHERE id_organismo = $1`, [id]);
  const result = await pool.query(
    `DELETE FROM organismo WHERE id_organismo = $1 RETURNING id_organismo`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

// ===== INFORMACION CRUD =====

export const obtenerTodaLaInformacion = async () => {
  const result = await pool.query(
    `
    SELECT i.id_info, i.bloque, i.nombre, i.contenido,
           ib.id_beneficio, b.nombre AS beneficio_nombre
    FROM informacion i
    LEFT JOIN informacion_beneficio ib ON ib.id_info = i.id_info
    LEFT JOIN beneficio b ON b.id_beneficio = ib.id_beneficio
    ORDER BY i.bloque ASC, i.id_info ASC
    `
  );
  return result.rows;
};

export const crearInformacion = async (bloque, nombre, contenido, id_beneficio) => {
  const infoResult = await pool.query(
    `
    INSERT INTO informacion (bloque, nombre, contenido)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [bloque, nombre, contenido]
  );
  const info = infoResult.rows[0];

  if (id_beneficio) {
    await pool.query(
      `INSERT INTO informacion_beneficio (id_info, id_beneficio) VALUES ($1, $2)`,
      [info.id_info, id_beneficio]
    );
  }

  return info;
};

export const actualizarInformacion = async (id, bloque, nombre, contenido) => {
  const result = await pool.query(
    `
    UPDATE informacion
    SET bloque = $1, nombre = $2, contenido = $3
    WHERE id_info = $4
    RETURNING *
    `,
    [bloque, nombre, contenido, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const eliminarInformacion = async (id) => {
  await pool.query(`DELETE FROM informacion_beneficio WHERE id_info = $1`, [id]);
  const result = await pool.query(
    `DELETE FROM informacion WHERE id_info = $1 RETURNING id_info`,
    [id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const obtenerTerritorios = async () => {
  const result = await pool.query(
    `SELECT id_divter, nombre, tipo, id_padre FROM division_territorial ORDER BY tipo, nombre`
  );
  return result.rows;
};

