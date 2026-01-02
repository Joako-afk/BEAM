import { obtenerInstitucionesPorSlugCategoria } from "../models/organismoModel.js";

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