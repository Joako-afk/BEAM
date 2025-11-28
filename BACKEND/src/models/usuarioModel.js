// BACKEND/src/models/usuarioModel.js
import { pool } from "../config/db.js";

export const crearUsuario = async (nombre, email, password) => {
  const result = await pool.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *",
    [nombre, email, password]
  );
  return result.rows[0];
};
