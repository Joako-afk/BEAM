// src/scripts/migrateSlugs.js
// Migra los slugs existentes al nuevo formato (conserva paréntesis).
// Ejecutar: node src/scripts/migrateSlugs.js

import pkg from "pg";
import dotenv from "dotenv";
import { slugify } from "../utils/slugify.js";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const tables = [
  { name: "beneficio", idCol: "id_beneficio", slugCol: "slug", nameCol: "nombre" },
  { name: "categoria", idCol: "id_categoria", slugCol: "slug", nameCol: "nombre" },
  { name: "institucion", idCol: "id_institucion", slugCol: "slug", nameCol: "nombre" },
];

async function migrate() {
  const client = await pool.connect();
  let totalUpdated = 0;

  try {
    for (const table of tables) {
      console.log(`\nMigrando ${table.name}...`);
      const result = await client.query(`SELECT ${table.idCol}, ${table.slugCol}, ${table.nameCol} FROM ${table.name}`);

      for (const row of result.rows) {
        const oldSlug = row[table.slugCol];
        const newSlug = slugify(row[table.nameCol]);

        if (oldSlug !== newSlug) {
          await client.query(
            `UPDATE ${table.name} SET ${table.slugCol} = $1 WHERE ${table.idCol} = $2`,
            [newSlug, row[table.idCol]]
          );
          console.log(`  [${row[table.idCol]}] "${oldSlug}" → "${newSlug}"`);
          totalUpdated++;
        }
      }
    }

    console.log(`\nMigración completada. ${totalUpdated} slug(s) actualizado(s).`);
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
