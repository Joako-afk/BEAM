import { useEffect, useState } from "react";
import SearchBar from "../components/busqueda";
import { generatePalette } from "../utils/generatePalette";
import { cardCategoria } from "../components/card";

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
      
      <SearchBar value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      <div className="
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        justify-items-center
        gap-6 mb-20 px-4 mt-8 w-full max-w-6xl
      ">
        {filtradas.map((cat) => (
          /* Se asegura que la tarjeta ocupe el ancho disponible de su columna */
          <div key={cat.id_categoria} className="h-full w-full max-w-[320px] sm:max-w-none">
            {cardCategoria(cat)}
          </div>
        ))}
      </div>
    </div>
  );
}
