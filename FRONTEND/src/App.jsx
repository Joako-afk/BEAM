// FRONTEND/src/App.jsx
import { Routes, Route, Router } from "react-router-dom";
import Presentacion from "./pages/presentacion";
import BasicLayout from "./layouts/basic";
import Beneficio from "./pages/beneficio";
import Inicio from "./pages/inicio";
import Categoria from "./pages/categoria";
import Login from "./pages/login";
import Institucion from "./pages/institucion";



export default function App() {
  return (
    <Routes>
      {/* Inicio */}
      <Route path="/" element={<BasicLayout> <Inicio /> </BasicLayout> }/>

      {/* Página dinámica de categoría */}
      <Route path="/categoria/:slug" element={<Categoria />} />
      <Route path="/institucion/:slug" element={<Institucion />} />
      <Route path="/presentacion" element={<Presentacion />} />


      {/* Página dinámica de beneficio */}

      <Route path="/beneficio/:slug" element={<Beneficio />} />



      {/* Login */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
