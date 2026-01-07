// src/components/navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navbar({ back = false }) {
  const location = useLocation();

  const pageNames = {
    "/": "Categorías de beneficios",
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
        px-6 lg:px-12 py-5
        bg-[#3e6a0f] text-white
        z-50 shadow-lg
        grid grid-cols-2 gap-y-4 items-center
        lg:flex lg:justify-between lg:gap-0
      "
    >
      {/* ESPACIADOR IZQUIERDO */}
      <div className="hidden lg:block lg:w-[180px]"></div>

      {/* TÍTULO CENTRADO */}
      <h1 className="order-3 col-span-2 lg:order-none lg:w-auto text-2xl lg:text-3xl font-extrabold tracking-wide text-center select-none flex justify-center items-center gap-3">
        {currentPage}
      </h1>

      {/* BOTÓN NOTIFICACIONES */}
      {!back && (
        <button
          style={{ backgroundColor: "var(--secondary, #2f540c)" }}
          className="
            order-2 col-start-2 justify-self-end lg:order-none lg:justify-self-auto
            relative flex items-center gap-3
            hover:brightness-110
            transition-all
            px-6 py-4 lg:px-7 lg:py-4
            rounded-2xl
            w-auto lg:w-auto
            flex justify-center
            text-lg
          "
        >
          <Bell size={30} strokeWidth={2.5} className="shrink-0" />
          <span className="hidden lg:inline font-semibold tracking-wide text-lg">
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

      {back && <div className="hidden lg:block lg:w-[180px]"></div>}
    </header>
  );
}
