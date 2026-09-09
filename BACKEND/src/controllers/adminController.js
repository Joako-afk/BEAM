// src/controllers/adminController.js
import { slugify } from "../utils/slugify.js";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  buscarCategorias,
  contarBeneficiosPorCategoria,
} from "../models/categoriaModel.js";
import {
  listarTodosLosBeneficios,
  crearBeneficio,
  actualizarBeneficio,
  eliminarBeneficio,
  buscarBeneficios,
  contarRelacionesBeneficio,
  crearBeneficioTransaccion,
  editarBeneficioTransaccion,
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
  crearTerritorio,
  actualizarTerritorio,
  eliminarTerritorio,
  contarComunasPorRegion,
  eliminarComunasPorRegion,
  contarRelacionesComuna,
  eliminarRelacionesComuna,
  buscarInstituciones,
  contarOrganismosPorInstitucion,
  buscarOrganismos,
  validarDuplicadoOrganismo,
  buscarTerritorios,
} from "../models/organismoModel.js";
import {
  obtenerTodosLosEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  contarOrganismosPorEvento,
  eliminarOrganismosPorEvento,
  buscarEventos,
} from "../models/eventoModel.js";

const PAGE_SIZE = 20;

// ========== CATEGORÍAS ==========

export const adminListarCategorias = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const result = await buscarCategorias(search || "", Number(page), PAGE_SIZE);
    res.json(result);
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
    const beneficios = await contarBeneficiosPorCategoria(id);
    if (beneficios > 0) {
      return res.status(409).json({
        error: `No se puede eliminar la categoría porque tiene ${beneficios} beneficio(s) asignado(s). Reasigne los beneficios a otra categoría antes de eliminar.`,
      });
    }
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
    const { search, page = 1 } = req.query;
    const result = await buscarBeneficios(search || "", Number(page), PAGE_SIZE);
    res.json(result);
  } catch (error) {
    console.error("Error admin listar beneficios:", error);
    res.status(500).json({ error: "Error al obtener beneficios" });
  }
};

export const adminCrearBeneficio = async (req, res) => {
  try {
    const { nombre, descripcion, requisitos, costo, edad_minima, icon_name, id_categoria, comunas, organismos, info_bloques } = req.body;
    if (!nombre || !id_categoria) {
      return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
    }

    const slug = slugify(nombre);
    const beneficio = await crearBeneficioTransaccion({
      nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria,
      comunas, organismos, info_bloques,
    });
    res.status(201).json(beneficio);
  } catch (error) {
    console.error("Error admin crear beneficio:", error);
    res.status(500).json({ error: "Error al crear beneficio" });
  }
};

export const adminActualizarBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, requisitos, costo, edad_minima, icon_name, id_categoria, comunas, organismos, info_bloques } = req.body;
    if (!nombre || !id_categoria) {
      return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
    }

    const slug = slugify(nombre);
    const beneficio = await editarBeneficioTransaccion(id, {
      nombre, descripcion, requisitos, costo, edad_minima, slug, icon_name, id_categoria,
      comunas, organismos, info_bloques,
    });
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
    const relaciones = await contarRelacionesBeneficio(id);
    const total = relaciones.comunas + relaciones.organismos + relaciones.bloques_info;
    if (total > 0) {
      return res.status(409).json({
        error: `Este beneficio tiene ${relaciones.comunas} comuna(s), ${relaciones.organismos} organismo(s) y ${relaciones.bloques_info} bloque(s) de información asociados. ¿Está seguro de eliminarlo? Se eliminarán todas las relaciones.`,
        relaciones,
      });
    }
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
    const { search, page = 1 } = req.query;
    const result = await buscarInstituciones(search || "", Number(page), PAGE_SIZE);
    res.json(result);
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
    const organismos = await contarOrganismosPorInstitucion(id);
    if (organismos > 0) {
      return res.status(409).json({
        error: `Esta institución tiene ${organismos} organismo(s) asociado(s). ¿Está seguro de eliminarla? Se eliminarán la institución y todos sus organismos.`,
      });
    }
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
    const { search, page = 1 } = req.query;
    const result = await buscarOrganismos(search || "", Number(page), PAGE_SIZE);
    res.json(result);
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

    if (id_divter) {
      const duplicado = await validarDuplicadoOrganismo(nombre_sucursal, id_divter);
      if (duplicado) {
        return res.status(409).json({ error: `Ya existe un organismo con el nombre "${nombre_sucursal}" en esta comuna. Elija un nombre diferente.` });
      }
    }

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

    if (id_divter) {
      const duplicado = await validarDuplicadoOrganismo(nombre_sucursal, id_divter, id);
      if (duplicado) {
        return res.status(409).json({ error: `Ya existe un organismo con el nombre "${nombre_sucursal}" en esta comuna. Elija un nombre diferente.` });
      }
    }

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

// ========== TERRITORIOS ==========

export const adminListarTerritorios = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const result = await buscarTerritorios(search || "", Number(page), PAGE_SIZE);
    res.json(result);
  } catch (error) {
    console.error("Error admin listar territorios:", error);
    res.status(500).json({ error: "Error al obtener territorios" });
  }
};

export const adminCrearTerritorio = async (req, res) => {
  try {
    const { nombre, tipo, id_padre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!tipo) return res.status(400).json({ error: "El tipo es obligatorio" });

    const tipoUpper = tipo.toUpperCase();
    if (tipoUpper !== "REGION" && tipoUpper !== "COMUNA") {
      return res.status(400).json({ error: "El tipo debe ser 'Region' o 'Comuna'" });
    }

    if (tipoUpper === "COMUNA" && !id_padre) {
      return res.status(400).json({ error: "Las comunas deben tener una región padre" });
    }
    if (tipoUpper === "REGION" && id_padre) {
      return res.status(400).json({ error: "Las regiones no deben tener padre" });
    }

    const territorio = await crearTerritorio(nombre, tipoUpper, id_padre);
    res.status(201).json(territorio);
  } catch (error) {
    console.error("Error admin crear territorio:", error);
    res.status(500).json({ error: "Error al crear territorio" });
  }
};

export const adminActualizarTerritorio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const territorio = await actualizarTerritorio(id, nombre);
    if (!territorio) return res.status(404).json({ error: "Territorio no encontrado" });
    res.json(territorio);
  } catch (error) {
    console.error("Error admin actualizar territorio:", error);
    res.status(500).json({ error: "Error al actualizar territorio" });
  }
};

export const adminEliminarTerritorio = async (req, res) => {
  try {
    const { id } = req.params;

    const territorio = await obtenerTerritorios().then(t => t.find(t => t.id_divter === Number(id)));
    if (!territorio) return res.status(404).json({ error: "Territorio no encontrado" });

    if (territorio.tipo === "REGION") {
      const comunas = await contarComunasPorRegion(id);
      if (comunas > 0) {
        await eliminarComunasPorRegion(id);
      }
    } else {
      const relaciones = await contarRelacionesComuna(id);
      if (relaciones.beneficios > 0 || relaciones.organismos > 0) {
        await eliminarRelacionesComuna(id);
      }
    }

    const eliminado = await eliminarTerritorio(id);
    if (!eliminado) return res.status(404).json({ error: "Territorio no encontrado" });
    res.json({ mensaje: "Territorio eliminado" });
  } catch (error) {
    console.error("Error admin eliminar territorio:", error);
    res.status(500).json({ error: "Error al eliminar territorio" });
  }
};

// ========== EVENTOS ==========

export const adminListarEventos = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const result = await buscarEventos(search || "", Number(page), PAGE_SIZE);
    res.json(result);
  } catch (error) {
    console.error("Error admin listar eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

export const adminCrearEvento = async (req, res) => {
  try {
    const { nombre, descripcion, fecha } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!fecha) return res.status(400).json({ error: "La fecha es obligatoria" });

    const evento = await crearEvento(nombre, descripcion, fecha);
    res.status(201).json(evento);
  } catch (error) {
    console.error("Error admin crear evento:", error);
    res.status(500).json({ error: "Error al crear evento" });
  }
};

export const adminActualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!fecha) return res.status(400).json({ error: "La fecha es obligatoria" });

    const evento = await actualizarEvento(id, nombre, descripcion, fecha);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    console.error("Error admin actualizar evento:", error);
    res.status(500).json({ error: "Error al actualizar evento" });
  }
};

export const adminEliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const organismos = await contarOrganismosPorEvento(id);
    if (organismos > 0) {
      await eliminarOrganismosPorEvento(id);
    }
    const eliminado = await eliminarEvento(id);
    if (!eliminado) return res.status(404).json({ error: "Evento no encontrado" });
    res.json({ mensaje: "Evento eliminado" });
  } catch (error) {
    console.error("Error admin eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
};
