import { useEffect, useState } from "react";
import InfoPanel from "../components/infopanel";
import SearchBar from "../components/busqueda";
import { generatePalette } from "../utils/generatePalette";
import { cardCategoria} from "../components/card";


export default function Inicio() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    // Restaurar colores base al volver al inicio
    document.documentElement.style.setProperty("--primary", "#3e6a0f");
    document.documentElement.style.setProperty("--secondary", "#2f540c");
    document.documentElement.style.setProperty("--tertiary", "#16a34a");
    document.documentElement.style.setProperty("--light", "#f4f8e4");
    document.documentElement.style.setProperty("--text", "#ffffff");

    fetch(`${API_URL}/api/categorias`)
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
    <div className="w-full flex flex-col items-center pt-28">
      {/* Panel superior */}
      <div className="-mt-3 w-full flex justify-center">
        <InfoPanel
          text="Aquí puedes encontrar las categorías disponibles de beneficios."
          colors={{
            primary: "#3e6a0f",
            secondary: "#96c43f",
            tertiary: "#c5f100",
            text: "#000"
          }}
        />

      </div>

      {/* Barra de búsqueda */}
      <SearchBar
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Tarjetas de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-20 px-4 mt-8">
        {filtradas.map((cat) => (
          <div key={cat.id_categoria}>{cardCategoria(cat)}</div>
        ))}
      </div>
    </div>
  );
}

