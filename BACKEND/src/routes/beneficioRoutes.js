// src/routes/beneficioRoutes.js
import express from "express";
import {
  listarBeneficiosPorCategoriaId,
  listarBeneficiosPorSlugCategoria,
  obtenerBeneficio,
  listarOrganismosDeBeneficio,
} from "../controllers/beneficioController.js";

const router = express.Router();

// por ID de categoría
router.get("/categoria/id/:idCategoria", listarBeneficiosPorCategoriaId);

// por SLUG de categoría
router.get("/categoria/:slugCategoria", listarBeneficiosPorSlugCategoria);

// 👇 IMPORTANTE: esta va ANTES de "/:slug"
router.get("/:slug/organismos", listarOrganismosDeBeneficio);

// beneficio individual
router.get("/:slug", obtenerBeneficio);

export default router;
