// BACKEND/src/routes/categoriaRoutes.js
import express from "express";
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoriaController,
} from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", listarCategorias);
router.get("/:slug", obtenerCategoria);
router.post("/", crearCategoriaController); // ← NUEVO

export default router;
