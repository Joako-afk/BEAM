// src/routes/adminRoutes.js
import { Router } from "express";
import {
  adminListarCategorias,
  adminCrearCategoria,
  adminActualizarCategoria,
  adminEliminarCategoria,
  adminListarBeneficios,
  adminCrearBeneficio,
  adminActualizarBeneficio,
  adminEliminarBeneficio,
  adminListarInstituciones,
  adminCrearInstitucion,
  adminActualizarInstitucion,
  adminEliminarInstitucion,
  adminListarOrganismos,
  adminCrearOrganismo,
  adminActualizarOrganismo,
  adminEliminarOrganismo,
  adminListarInformacion,
  adminCrearInformacion,
  adminActualizarInformacion,
  adminEliminarInformacion,
  adminListarTerritorios,
  adminCrearTerritorio,
  adminActualizarTerritorio,
  adminEliminarTerritorio,
  adminListarEventos,
  adminCrearEvento,
  adminActualizarEvento,
  adminEliminarEvento,
} from "../controllers/adminController.js";

const router = Router();

// Categorías
router.get("/categorias", adminListarCategorias);
router.post("/categorias", adminCrearCategoria);
router.put("/categorias/:id", adminActualizarCategoria);
router.delete("/categorias/:id", adminEliminarCategoria);

// Beneficios
router.get("/beneficios", adminListarBeneficios);
router.post("/beneficios", adminCrearBeneficio);
router.put("/beneficios/:id", adminActualizarBeneficio);
router.delete("/beneficios/:id", adminEliminarBeneficio);

// Instituciones
router.get("/instituciones", adminListarInstituciones);
router.post("/instituciones", adminCrearInstitucion);
router.put("/instituciones/:id", adminActualizarInstitucion);
router.delete("/instituciones/:id", adminEliminarInstitucion);

// Organismos
router.get("/organismos", adminListarOrganismos);
router.post("/organismos", adminCrearOrganismo);
router.put("/organismos/:id", adminActualizarOrganismo);
router.delete("/organismos/:id", adminEliminarOrganismo);

// Información
router.get("/informacion", adminListarInformacion);
router.post("/informacion", adminCrearInformacion);
router.put("/informacion/:id", adminActualizarInformacion);
router.delete("/informacion/:id", adminEliminarInformacion);

// Territorios
router.get("/territorios", adminListarTerritorios);
router.post("/territorios", adminCrearTerritorio);
router.put("/territorios/:id", adminActualizarTerritorio);
router.delete("/territorios/:id", adminEliminarTerritorio);

// Eventos
router.get("/eventos", adminListarEventos);
router.post("/eventos", adminCrearEvento);
router.put("/eventos/:id", adminActualizarEvento);
router.delete("/eventos/:id", adminEliminarEvento);

export default router;
