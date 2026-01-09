import { useEffect, useState } from "react";
import SearchBar from "../components/busqueda";
import { generatePalette } from "../utils/generatePalette";
import { cardCategoria } from "../components/card";
import InstructionsPanel from "../components/instructionsPanel";

export default function Inicio() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Restaurar colores base al volver al inicio
    document.documentElement.style.setProperty("--primary", "#3e6a0f");
    document.documentElement.style.setProperty("--secondary", "#2f540c");
    document.documentElement.style.setProperty("--tertiary", "#16a34a");
    document.documentElement.style.setProperty("--light", "#f4f8e4");
    document.documentElement.style.setProperty("--text", "#ffffff");

    fetch("http://localhost:4000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        const enhanced = data.map((cat) => ({
          ...cat,
          colors: generatePalette(cat.color_primary || "#2563eb"),
        }));
        setCategorias(enhanced);
      });
  }, []);

  const filtradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center pt-4">

      {/* BLOQUE SUPERIOR: Instrucciones + Buscador */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Instrucciones */}
        <div className="lg:col-span-1">
          <InstructionsPanel
            title="¿Cómo usar la plataforma?"
            steps={[
              "Utiliza la barra de búsqueda para encontrar una categoría.",
              "Presiona una categoría para ver los beneficios disponibles.",
              "Selecciona un beneficio para conocer requisitos y detalles.",
            ]}
          />
        </div>

        {/* Buscador (se mantiene igual) */}
        <div className="lg:col-span-2 flex justify-center">
          <SearchBar
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </div>

      {/* GRID DE CATEGORÍAS */}
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          justify-items-center
          gap-6 mb-20 px-4 mt-8 w-full max-w-6xl
        "
      >
        {filtradas.map((cat) => (
          <div
            key={cat.id_categoria}
            className="h-full w-full max-w-[320px] sm:max-w-none"
          >
            {cardCategoria(cat)}
          </div>
        ))}
      </div>

    </div>
  );

}
