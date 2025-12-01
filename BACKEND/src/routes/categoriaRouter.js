import { Router } from "express";
import {
  listarCategorias,
  obtenerCategoriaPorIdController,
  obtenerCategoriaPorSlugController,
} from "../controllers/categoriaController.js";

const router = Router();

router.get("/", listarCategorias);
router.get("/id/:idCategoria", obtenerCategoriaPorIdController);
router.get("/:slug", obtenerCategoriaPorSlugController);

export default router;
