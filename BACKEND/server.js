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

const PORT = 4000;

app.use("/api/categorias", categoriaRoutes);
app.use("/api/usuarios", usuarioRoutes); 
app.use("/api/beneficios", beneficioRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
