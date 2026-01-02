// FRONTEND/src/App.jsx
import { Routes, Route } from "react-router-dom";

import BasicLayout from "./layouts/basic";
import Beneficio from "./pages/beneficio";
import Inicio from "./pages/inicio";
import Categoria from "./pages/categoria";
import Login from "./pages/login";
import Organizaciones from "./pages/organizaciones";


export default function App() {
  return (
    <Routes>
      {/* Inicio */}
      <Route
        path="/"
        element={
          <BasicLayout>
            <Inicio />
          </BasicLayout>
        }
      />

      {/* Página dinámica de categoría */}
      <Route path="/categoria/:slug" element={<Categoria />} />
      <Route path="/organizacion/:slug" element={<Organizaciones />} />

      {/* Página dinámica de beneficio */}

      <Route path="/beneficio/:slug" element={<Beneficio />} />



      {/* Login */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
