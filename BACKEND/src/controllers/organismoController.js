// src/controllers/organismoController.js
import {
  obtenerInstitucionesPorSlugCategoria,
  obtenerInstitucionPorSlug,
} from "../models/organismoModel.js";

// ✅ GET /api/instituciones/categoria/:slug
export const getInstitucionesPorCategoria = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await obtenerInstitucionesPorSlugCategoria(slug);

    if (!result) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error en getInstitucionesPorCategoria:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ✅ GET /api/instituciones/:slug
export const getInstitucionPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const inst = await obtenerInstitucionPorSlug(slug);

    if (!inst) {
      return res.status(404).json({ message: "Institución no encontrada" });
    }

    res.json(inst);
  } catch (error) {
    console.error("Error en getInstitucionPorSlug:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
