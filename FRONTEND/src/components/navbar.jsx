// src/components/navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Bell } from "lucide-react";

export default function Navbar({ back = false }) {
  const location = useLocation();

  const pageNames = {
    "/": "INICIO",
    "/organizaciones-sociales": "ORGANIZACIONES",
    "/eventos": "EVENTOS",
    "/salud": "SALUD",
    "/apoyo-y-cuidados-comunitarios": "APOYO",
    "/recreacion-y-tiempo-libre": "RECREACIÓN",
    "/educacion-y-desarrollo-personal": "EDUCACIÓN",
    "/subsidios-y-ayudas-financieras": "SUBSIDIOS",
    "/vivienda-y-alojamiento": "VIVIENDA",
  };

  const fallbackTitle = location.pathname
    .replace("/", "")
    .replaceAll("-", " ")
    .toUpperCase();

  const currentPage =
    pageNames[location.pathname] || fallbackTitle || "CATEGORÍA";

  return (
    <header
      className="
        sticky top-0 left-0 w-full
        flex items-center justify-between
        px-6 sm:px-12 py-5
        bg-[#3e6a0f] text-white
        z-50 shadow-lg
      "
    >
      {/* ESPACIADOR IZQUIERDO */}
      <div className="w-[140px] sm:w-[180px]"></div>

      {/* TÍTULO CENTRADO */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-center select-none flex items-center gap-3">
        <Home size={30} className="inline-block sm:hidden" />
        {currentPage}
      </h1>

      {/* BOTÓN NOTIFICACIONES */}
      {!back && (
        <button
          style={{ backgroundColor: "var(--secondary, #2f540c)" }}
          className="
            relative flex items-center gap-3
            hover:brightness-110
            transition-all
            px-6 py-4 sm:px-7 sm:py-4
            rounded-2xl
            w-[140px] sm:w-[180px]
            flex justify-center
            text-lg
          "
        >
          <Bell size={30} strokeWidth={2.5} />
          <span className="hidden sm:inline font-semibold tracking-wide text-lg">
            Notificaciones
          </span>

          <span
            className="
              absolute -top-2 -right-2
              bg-red-600 text-white text-base 
              w-7 h-7 flex items-center justify-center 
              rounded-full font-bold shadow-md
              border-2 border-white
            "
          >
            1
          </span>
        </button>
      )}

      {back && <div className="w-[140px] sm:w-[180px]"></div>}
    </header>
  );
}
