// BACKEND/src/controllers/categoriaController.js

import {
  obtenerCategorias,
  obtenerCategoriaPorSlug,
  crearCategoria,
} from "../models/categoriaModel.js";

import { generatePalette } from "../utils/palette.js";
import { slugify } from "../utils/slugify.js";

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await obtenerCategorias();

    const enriched = categorias.map((cat) => ({
      ...cat,
      palette: generatePalette(cat.color_primary),
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

export const obtenerCategoria = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoria = await obtenerCategoriaPorSlug(slug);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const palette = generatePalette(categoria.color_primary);

    res.json({
      ...categoria,
      palette,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const crearCategoriaController = async (req, res) => {
  try {
    const { nombre, descripcion, color_primary, icon_name } = req.body;

    if (!nombre || !color_primary || !icon_name) {
      return res.status(400).json({
        message: "Nombre, color_primary e icon_name son obligatorios",
      });
    }

    const slug = slugify(nombre);

    const nueva = await crearCategoria({
      nombre,
      descripcion: descripcion || "",
      color_primary,
      slug,
      icon_name,
    });

    const palette = generatePalette(nueva.color_primary);

    res.status(201).json({
      ...nueva,
      palette,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};
