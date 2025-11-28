// BACKEND/src/routes/usuarioRoutes.js
import express from "express";
import { registrarUsuario } from "../controllers/usuariocontroller.js";

const router = express.Router();

router.post("/registro", registrarUsuario);

export default router;
