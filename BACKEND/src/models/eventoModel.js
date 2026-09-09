// src/models/eventoModel.js
import { pool } from "../config/db.js";

export const obtenerTodosLosEventos = async () => {
  const result = await pool.query(
    `SELECT id_evento, nombre, descripcion, fecha
     FROM evento
     ORDER BY fecha DESC`
  );
  return result.rows;
};

export const crearEvento = async (nombre, descripcion, fecha) => {
  const result = await pool.query(
    `INSERT INTO evento (nombre, descripcion, fecha)
     VALUES ($1, $2, $3)
     RETURNING id_evento, nombre, descripcion, fecha`,
    [nombre, descripcion, fecha]
  );
  return result.rows[0];
};

export const actualizarEvento = async (id, nombre, descripcion, fecha) => {
  const result = await pool.query(
    `UPDATE evento
     SET nombre = $1, descripcion = $2, fecha = $3
     WHERE id_evento = $4
     RETURNING id_evento, nombre, descripcion, fecha`,
    [nombre, descripcion, fecha, id]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

export const eliminarEvento = async (id) => {
  const result = await pool.query(
    "DELETE FROM evento WHERE id_evento = $1 RETURNING id_evento",
    [id]
  );
  if (result.rowCount === 0) return null;
  return true;
};

export const contarOrganismosPorEvento = async (idEvento) => {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS total FROM organismo_evento WHERE id_evento = $1",
    [idEvento]
  );
  return result.rows[0].total;
};

export const eliminarOrganismosPorEvento = async (idEvento) => {
  await pool.query(
    "DELETE FROM organismo_evento WHERE id_evento = $1",
    [idEvento]
  );
};

export const buscarEventos = async (search, page, limit) => {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;
  const where = search ? "WHERE nombre ILIKE $1 OR descripcion ILIKE $2" : "";
  const params = search ? [term, term, limit, offset] : [limit, offset];

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM evento ${where}`,
    search ? [term, term] : []
  );

  const result = await pool.query(
    `
    SELECT id_evento, nombre, descripcion, fecha
    FROM evento
    ${where}
    ORDER BY fecha DESC
    LIMIT $${search ? 3 : 1} OFFSET $${search ? 4 : 2}
    `,
    params
  );

  return {
    data: result.rows,
    total: countResult.rows[0].total,
    page,
    totalPages: Math.ceil(countResult.rows[0].total / limit),
  };
};
