import express from "express";
import { getInstitucionesPorCategoria } from "../controllers/organismoController.js";

const router = express.Router();

// Ruta: /api/instituciones/categoria/:slug
router.get("/categoria/:slug", getInstitucionesPorCategoria);

export default router;