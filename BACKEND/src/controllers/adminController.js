// src/controllers/adminController.js
import { slugify } from "../utils/slugify.js";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../models/categoriaModel.js";
import {
  listarTodosLosBeneficios,
  crearBeneficio,
  actualizarBeneficio,
  eliminarBeneficio,
} from "../models/beneficioModel.js";
import {
  obtenerTodasLasInstitucionesAdmin,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,
  obtenerTodosLosOrganismos,
  crearOrganismo,
  actualizarOrganismo,
  eliminarOrganismo,
  obtenerTodaLaInformacion,
  crearInformacion,
  actualizarInformacion,
  eliminarInformacion,
  obtenerTerritorios,
} from "../models/organismoModel.js";

// ========== CATEGORÍAS ==========

export const adminListarCategorias = async (req, res) => {
  try {
    const categorias = await obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Error admin listar categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

export const adminCrearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, color_primary, icon_name } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const slug = slugify(nombre);
    const categoria = await crearCategoria(nombre, descripcion, color_primary, slug, icon_name);
    res.status(201).json(categoria);
  } catch (error) {
    console.error("Error admin crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

export const adminActualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color_primary, icon_name } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const slug = slugify(nombre);
    const categoria = await actualizarCategoria(id, nombre, descripcion, color_primary, slug, icon_name);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    console.error("Error admin actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

export const adminEliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await eliminarCategoria(id);
    if (!eliminada) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ mensaje: "Categoría eliminada" });
  } catch (error) {
    console.error("Error admin eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};

// ========== BENEFICIOS ==========

export const adminListarBeneficios = async (req, res) => {
  try {
    const beneficios = await listarTodosLosBeneficios();
    res.json(beneficios);
  } catch (error) {
    console.error("Error admin listar beneficios:", error);
    res.status(500).json({ error: "Error al obtener beneficios" });
  }
};

export const adminCrearBeneficio = async (req, res) => {
  try {
    const { nombre, descripcion, requisitos, costo, edad_minima, icon_name, id_categoria } = req.body;
    if (!nombre || !id_categoria) {
      return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
    }

    const slug = slugify(nombre);
    const beneficio = await crearBeneficio(
      nombre, descripcion, requisitos, costo || 0, edad_minima || 0,
      slug, icon_name, id_categoria
    );
    res.status(201).json(beneficio);
  } catch (error) {
    console.error("Error admin crear beneficio:", error);
    res.status(500).json({ error: "Error al crear beneficio" });
  }
};

export const adminActualizarBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, requisitos, costo, edad_minima, icon_name, id_categoria } = req.body;
    if (!nombre || !id_categoria) {
      return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
    }

    const slug = slugify(nombre);
    const beneficio = await actualizarBeneficio(
      id, nombre, descripcion, requisitos, costo, edad_minima,
      slug, icon_name, id_categoria
    );
    if (!beneficio) return res.status(404).json({ error: "Beneficio no encontrado" });
    res.json(beneficio);
  } catch (error) {
    console.error("Error admin actualizar beneficio:", error);
    res.status(500).json({ error: "Error al actualizar beneficio" });
  }
};

export const adminEliminarBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await eliminarBeneficio(id);
    if (!eliminado) return res.status(404).json({ error: "Beneficio no encontrado" });
    res.json({ mensaje: "Beneficio eliminado" });
  } catch (error) {
    console.error("Error admin eliminar beneficio:", error);
    res.status(500).json({ error: "Error al eliminar beneficio" });
  }
};

// ========== INSTITUCIONES ==========

export const adminListarInstituciones = async (req, res) => {
  try {
    const instituciones = await obtenerTodasLasInstitucionesAdmin();
    res.json(instituciones);
  } catch (error) {
    console.error("Error admin listar instituciones:", error);
    res.status(500).json({ error: "Error al obtener instituciones" });
  }
};

export const adminCrearInstitucion = async (req, res) => {
  try {
    const { nombre, descripcion, pagina_web, logo_url, email_contacto, id_categoria } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const slug = slugify(nombre);
    const institucion = await crearInstitucion(nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria);
    res.status(201).json(institucion);
  } catch (error) {
    console.error("Error admin crear institución:", error);
    res.status(500).json({ error: "Error al crear institución" });
  }
};

export const adminActualizarInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, pagina_web, logo_url, email_contacto, id_categoria } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const slug = slugify(nombre);
    const institucion = await actualizarInstitucion(id, nombre, descripcion, pagina_web, logo_url, email_contacto, slug, id_categoria);
    if (!institucion) return res.status(404).json({ error: "Institución no encontrada" });
    res.json(institucion);
  } catch (error) {
    console.error("Error admin actualizar institución:", error);
    res.status(500).json({ error: "Error al actualizar institución" });
  }
};

export const adminEliminarInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await eliminarInstitucion(id);
    if (!eliminada) return res.status(404).json({ error: "Institución no encontrada" });
    res.json({ mensaje: "Institución eliminada" });
  } catch (error) {
    console.error("Error admin eliminar institución:", error);
    res.status(500).json({ error: "Error al eliminar institución" });
  }
};

// ========== ORGANISMOS ==========

export const adminListarOrganismos = async (req, res) => {
  try {
    const organismos = await obtenerTodosLosOrganismos();
    res.json(organismos);
  } catch (error) {
    console.error("Error admin listar organismos:", error);
    res.status(500).json({ error: "Error al obtener organismos" });
  }
};

export const adminCrearOrganismo = async (req, res) => {
  try {
    const { nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter } = req.body;
    if (!nombre_sucursal) return res.status(400).json({ error: "El nombre de la sucursal es obligatorio" });
    if (lng == null || lat == null) return res.status(400).json({ error: "Las coordenadas son obligatorias" });

    const organismo = await crearOrganismo(nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter);
    res.status(201).json(organismo);
  } catch (error) {
    console.error("Error admin crear organismo:", error);
    res.status(500).json({ error: "Error al crear organismo" });
  }
};

export const adminActualizarOrganismo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter } = req.body;
    if (!nombre_sucursal) return res.status(400).json({ error: "El nombre de la sucursal es obligatorio" });

    const organismo = await actualizarOrganismo(id, nombre_sucursal, tipo, direccion, telefono, lng, lat, id_institucion, id_divter);
    if (!organismo) return res.status(404).json({ error: "Organismo no encontrado" });
    res.json(organismo);
  } catch (error) {
    console.error("Error admin actualizar organismo:", error);
    res.status(500).json({ error: "Error al actualizar organismo" });
  }
};

export const adminEliminarOrganismo = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await eliminarOrganismo(id);
    if (!eliminado) return res.status(404).json({ error: "Organismo no encontrado" });
    res.json({ mensaje: "Organismo eliminado" });
  } catch (error) {
    console.error("Error admin eliminar organismo:", error);
    res.status(500).json({ error: "Error al eliminar organismo" });
  }
};

// ========== INFORMACIÓN ==========

export const adminListarInformacion = async (req, res) => {
  try {
    const informacion = await obtenerTodaLaInformacion();
    res.json(informacion);
  } catch (error) {
    console.error("Error admin listar información:", error);
    res.status(500).json({ error: "Error al obtener información" });
  }
};

export const adminCrearInformacion = async (req, res) => {
  try {
    const { bloque, nombre, contenido, id_beneficio } = req.body;
    if (!nombre || !contenido) {
      return res.status(400).json({ error: "Nombre y contenido son obligatorios" });
    }

    const info = await crearInformacion(bloque, nombre, contenido, id_beneficio);
    res.status(201).json(info);
  } catch (error) {
    console.error("Error admin crear información:", error);
    res.status(500).json({ error: "Error al crear información" });
  }
};

export const adminActualizarInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloque, nombre, contenido } = req.body;
    if (!nombre || !contenido) {
      return res.status(400).json({ error: "Nombre y contenido son obligatorios" });
    }

    const info = await actualizarInformacion(id, bloque, nombre, contenido);
    if (!info) return res.status(404).json({ error: "Información no encontrada" });
    res.json(info);
  } catch (error) {
    console.error("Error admin actualizar información:", error);
    res.status(500).json({ error: "Error al actualizar información" });
  }
};

export const adminEliminarInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await eliminarInformacion(id);
    if (!eliminada) return res.status(404).json({ error: "Información no encontrada" });
    res.json({ mensaje: "Información eliminada" });
  } catch (error) {
    console.error("Error admin eliminar información:", error);
    res.status(500).json({ error: "Error al eliminar información" });
  }
};

// ========== UTILIDADES ==========

export const adminListarTerritorios = async (req, res) => {
  try {
    const territorios = await obtenerTerritorios();
    res.json(territorios);
  } catch (error) {
    console.error("Error admin listar territorios:", error);
    res.status(500).json({ error: "Error al obtener territorios" });
  }
};
