import { obtenerCategoriaPorSlug } from "../models/categoriaModel.js";
import { obtenerBeneficiosPorCategoria, obtenerBeneficioPorSlug } from "../models/beneficioModel.js";

// Lista de beneficios dentro de una categoría
export const beneficiosPorSlugCategoria = async (req, res) => {
  try {
    const { slug } = req.params;

    const categoria = await obtenerCategoriaPorSlug(slug);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const beneficios = await obtenerBeneficiosPorCategoria(categoria.id_categoria);

    res.json({ categoria, beneficios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener beneficios" });
  }
};

// Beneficio individual
export const obtenerBeneficio = async (req, res) => {
  try {
    const { slug } = req.params;

    const beneficio = await obtenerBeneficioPorSlug(slug);
    if (!beneficio) {
      return res.status(404).json({ message: "Beneficio no encontrado" });
    }

    res.json(beneficio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener beneficio" });
  }
};
