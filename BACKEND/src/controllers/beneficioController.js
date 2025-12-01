// src/controllers/beneficioController.js
import {
  obtenerBeneficiosPorCategoriaId,
  obtenerBeneficiosPorSlugCategoria,
  obtenerBeneficioPorSlug,
  obtenerOrganismosPorSlugBeneficio,
} from "../models/beneficioModel.js";

export const listarBeneficiosPorCategoriaId = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const beneficios = await obtenerBeneficiosPorCategoriaId(idCategoria);
    res.json(beneficios);
  } catch (error) {
    console.error("Error al listar beneficios por idCategoria:", error);
    res.status(500).json({ error: "Error al obtener beneficios" });
  }
};

export const listarBeneficiosPorSlugCategoria = async (req, res) => {
  try {
    const { slugCategoria } = req.params;
    const data = await obtenerBeneficiosPorSlugCategoria(slugCategoria);

    if (!data) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(data); // { categoria, beneficios }
  } catch (error) {
    console.error("Error al listar beneficios por slugCategoria:", error);
    res.status(500).json({ error: "Error al obtener beneficios" });
  }
};

export const obtenerBeneficio = async (req, res) => {
  try {
    const { slug } = req.params;
    const beneficio = await obtenerBeneficioPorSlug(slug);

    if (!beneficio) {
      return res.status(404).json({ error: "Beneficio no encontrado" });
    }

    res.json(beneficio);
  } catch (error) {
    console.error("Error al obtener beneficio:", error);
    res.status(500).json({ error: "Error al obtener beneficio" });
  }
};

/**
 * GET /api/beneficios/:slug/organismos
 * Organismos (sucursales) para el mapa.
 */
export const listarOrganismosDeBeneficio = async (req, res) => {
  try {
    const { slug } = req.params;

    const organismos = await obtenerOrganismosPorSlugBeneficio(slug);

    if (!organismos || organismos.length === 0) {
      return res
        .status(404)
        .json({ error: "Este beneficio no tiene organismos asociados" });
    }

    res.json(organismos);
  } catch (error) {
    console.error("Error al listar organismos del beneficio:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los organismos del beneficio" });
  }
};
