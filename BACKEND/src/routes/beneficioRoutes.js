// src/routes/beneficioRoutes.js
import express from "express";
import {
  listarBeneficiosPorCategoriaId,
  listarBeneficiosPorSlugCategoria,
  obtenerBeneficio,
} from "../controllers/beneficioController.js";

const router = express.Router();

// según cómo lo tengas montado tú:
router.get("/categoria/id/:idCategoria", listarBeneficiosPorCategoriaId);
router.get("/categoria/:slugCategoria", listarBeneficiosPorSlugCategoria);
router.get("/:slug", obtenerBeneficio);

export default router;
