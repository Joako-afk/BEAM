// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./src/config/db.js";

import categoriaRoutes from "./src/routes/categoriaRouter.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js"; 
import beneficioRoutes from "./src/routes/beneficioRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriaRoutes);
app.use("/api/usuarios", usuarioRoutes); 
app.use("/api/beneficios", beneficioRoutes);

app.listen(process.env.PORT || 4000, () =>
  console.log("🔥 Servidor en puerto", process.env.PORT || 4000)
);
