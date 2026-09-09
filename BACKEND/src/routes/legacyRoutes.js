// src/routes/legacyRoutes.js
// Redirecciones 301 para slugs viejos → nuevos.
// GET /api/legacy/:entity/:oldSlug → 301 a /api/:entity/:newSlug

import { Router } from "express";
import { pool } from "../config/db.js";
import { slugify } from "../utils/slugify.js";

const router = Router();

const entityMap = {
  beneficios: { table: "beneficio", idCol: "id_beneficio", slugCol: "slug", nameCol: "nombre", publicPrefix: "/beneficio" },
  categorias: { table: "categoria", idCol: "id_categoria", slugCol: "slug", nameCol: "nombre", publicPrefix: "/categoria" },
  instituciones: { table: "institucion", idCol: "id_institucion", slugCol: "slug", nameCol: "nombre", publicPrefix: "/institucion" },
};

router.get("/:entity/:oldSlug", async (req, res) => {
  const { entity, oldSlug } = req.params;
  const config = entityMap[entity];

  if (!config) {
    return res.status(404).json({ error: "Entidad no válida" });
  }

  try {
    const result = await pool.query(
      `SELECT ${config.idCol}, ${config.nameCol} FROM ${config.table} WHERE ${config.slugCol} = $1 LIMIT 1`,
      [oldSlug]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const row = result.rows[0];
    const newSlug = slugify(row[config.nameCol]);

    const newUrl = `${config.publicPrefix}/${newSlug}`;
    res.redirect(301, newUrl);
  } catch (error) {
    console.error("Error en legacy redirect:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export { router as legacyRedirect };
