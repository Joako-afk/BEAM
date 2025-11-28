import express from "express";
import { beneficiosPorSlugCategoria, obtenerBeneficio } from "../controllers/beneficioController.js";

const router = express.Router();

// Beneficios de categoría
router.get("/categoria/:slug", beneficiosPorSlugCategoria);

// Beneficio individual
router.get("/:slug", obtenerBeneficio);

export default router;
