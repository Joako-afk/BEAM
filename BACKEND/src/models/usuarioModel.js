// BACKEND/src/models/usuarioModel.js
import { pool } from "../config/db.js";

export const crearUsuario = async (nombre, email, password) => {
  // TODO: Hashear la contraseña antes de guardarla (ej. usando bcrypt)
  const result = await pool.query(
    "INSERT INTO usuario (nombre, email, password) VALUES ($1, $2, $3) RETURNING *",
    [nombre, email, password]
  );
  return result.rows[0];
};
