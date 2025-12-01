// src/routes/beneficioRoutes.js
import express from "express";
import {
  listarBeneficiosPorCategoriaId,
  listarBeneficiosPorSlugCategoria,
  obtenerBeneficio,
  listarOrganismosDeBeneficio,
} from "../controllers/beneficioController.js";

const router = express.Router();

router.get("/categoria/id/:idCategoria", listarBeneficiosPorCategoriaId);
router.get("/categoria/:slugCategoria", listarBeneficiosPorSlugCategoria);

router.get("/:slug/organismos", listarOrganismosDeBeneficio);

router.get("/:slug", obtenerBeneficio);

export default router;
