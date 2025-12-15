// src/components/navbar_secondary.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

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
        fixed top-0 left-0 w-full
        flex items-center justify-between
        px-6 sm:px-12 py-5
        text-white
        z-50 shadow-lg
        bg-[var(--primary)]
      "
    >
      {/* BOTÓN INICIO */}
      <Link
        to="/"
        className="
          flex items-center gap-3
          bg-[var(--secondary)] hover:opacity-80
          transition-opacity
          px-6 py-4 sm:px-7 sm:py-4
          rounded-2xl
          text-lg
        "
      >
        <Home size={24} strokeWidth={2.5} />
        <span className="font-semibold tracking-wide">Inicio</span>
      </Link>

      {/* TÍTULO CENTRADO */}
      <h1 className="text-xl sm:text-3xl font-extrabold tracking-wide text-center select-none max-w-[60vw] leading-tight break-words">
        {pageTitle}
      </h1>

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate(-1)}
        className="
          flex items-center gap-3
          bg-[var(--secondary)] hover:opacity-80
          transition-opacity
          px-6 py-4 sm:px-7 sm:py-4
          rounded-2xl
          text-lg
        "
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
        <span className="font-semibold tracking-wide">Volver</span>
      </button>
    </header>
  );
}
