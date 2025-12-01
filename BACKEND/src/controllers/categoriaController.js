// src/controllers/categoriaController.js
import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  obtenerCategoriaPorSlug,
} from "../models/categoriaModel.js";

/**
 * GET /api/categorias
 * Lista todas las categorías.
 */
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Error al listar categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

/**
 * GET /api/categorias/id/:idCategoria
 * Obtiene una categoría por su ID numérico.
 */
export const obtenerCategoriaPorIdController = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const categoria = await obtenerCategoriaPorId(idCategoria);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría por ID:", error);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
};

/**
 * GET /api/categorias/:slug
 * Obtiene una categoría por su slug.
 * Ej: /api/categorias/salud
 */
export const obtenerCategoriaPorSlugController = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoria = await obtenerCategoriaPorSlug(slug);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría por slug:", error);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
};
