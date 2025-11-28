// BACKEND/src/models/beneficioModel.js
import { pool } from "../config/db.js";

// Beneficios por categoría
export const obtenerBeneficiosPorCategoria = async (id_categoria) => {
  const result = await pool.query(
    `
    SELECT 
      id_beneficio,
      nombre,
      descripcion,
      requisitos,
      costo,
      edad_minima,
      slug,
      icon_name,
      categoria
    FROM beneficio
    WHERE categoria = $1
    ORDER BY id_beneficio ASC
  `,
    [id_categoria]
  );

  return result.rows;
};

// Beneficio individual por slug
export const obtenerBeneficioPorSlug = async (slug) => {
  const result = await pool.query(
    `
    SELECT 
      id_beneficio,
      nombre,
      descripcion,
      requisitos,
      costo,
      edad_minima,
      slug,
      icon_name,
      categoria
    FROM beneficio
    WHERE slug = $1
    LIMIT 1
  `,
    [slug]
  );

  return result.rows[0];
};
