import express from "express";
import {
  getInstitucionesPorCategoria,
  getInstitucionPorSlug,
} from "../controllers/organismoController.js";

const router = express.Router();

// 1) Primero la ruta específica
router.get("/categoria/:slug", getInstitucionesPorCategoria);

// 2) Después la ruta genérica (detalle)
router.get("/:slug", getInstitucionPorSlug);

export default router;
