// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Probar la conexión
pool
  .connect()
  .then((client) => {
    console.log("✅ Conectado a PostgreSQL");
    client.release();
  })
  .catch((err) => console.error("❌ Error de conexión:", err));
