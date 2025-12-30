// src/components/navbar_secondary.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { ButtonNav } from "./buttons"; 

const toTitleCase = (str = "") =>
  str
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

export default function NavbarSecondary({ title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname.split("/").filter(Boolean);
  const fallback = segments.length
    ? toTitleCase(segments[segments.length - 1].replaceAll("-", " "))
    : "Página";

  const pageTitle = title || fallback || "Página";

  return (
    <header
      className="
        sticky top-0 left-0 w-full
        px-6 sm:px-12 py-4 sm:py-5
        text-white z-50 shadow-lg
        /* Estructura: Grid en móvil (2 columnas), Flex en PC */
        grid grid-cols-2 gap-y-2 items-center
        sm:flex sm:justify-between sm:gap-0
      "
      style={{ backgroundColor: "var(--primary, #3e6a0f)" }}
    >
      
      {/* Botón Inicio (Izquierda) */}
      <div className="order-1 justify-self-start sm:order-none">
        <ButtonNav 
          text="Inicio" 
          icon={Home} 
          onClick={() => navigate("/")}
          showText={true}
          // AJUSTE: text-sm en móvil (un pelín más grande que el original xs)
          className="hover:brightness-110 transition-all text-sm sm:text-lg"
          style={{ backgroundColor: "var(--secondary, #2f540c)" }}
        />
      </div>

      {/* Título (Centro / Abajo en móvil) */}
      <h1 className="
        order-3 col-span-2 w-full text-center
        /* REGRESADO AL ORIGINAL: text-xl en móvil */
        text-xl sm:text-3xl 
        font-extrabold tracking-wide 
        leading-tight break-words mt-1 sm:mt-0
        sm:order-none sm:w-auto sm:max-w-[50vw]
      ">
        {pageTitle}
      </h1>

      {/* Botón Volver (Derecha) */}
      <div className="order-2 justify-self-end sm:order-none">
        <ButtonNav 
          text="Volver" 
          icon={ArrowLeft} 
          onClick={() => navigate(-1)}
          showText={true}
          // AJUSTE: text-sm en móvil
          className="hover:brightness-110 transition-all text-sm sm:text-lg"
          style={{ backgroundColor: "var(--secondary, #2f540c)" }}
        />
      </div>
    </header>
  );
}