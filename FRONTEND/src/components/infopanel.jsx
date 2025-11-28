// src/components/infopanel.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InfoPanel({ text, colors }) {
  const [open, setOpen] = useState(false);

  const {
    primary,      // color fuerte
    secondary,    // color medio (panel)
    tertiary,     // color suave (botón)
    text: textColor
  } = colors || {};

  return (
    <div className="relative flex flex-col items-center mb-8">

      {/* Panel desplegado */}
      {open && (
        <div
          className="
            text-center px-6 py-4 sm:py-5
            rounded-b-2xl shadow-md max-w-4xl w-full animate-fadeIn
          "
          style={{
            backgroundColor: secondary,   // ← color medio
            color: textColor              // ← automático según primary
          }}
        >
          <p className="text-sm sm:text-base font-medium">
            {text}
          </p>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex flex-col items-center justify-center
          font-semibold px-6 py-2
          sm:px-8 sm:py-3 rounded-b-2xl shadow-md
          transition-all -mt-2
          hover:opacity-85
          ${open ? "rounded-t-none" : "rounded-2xl"}
        `}
        style={{
          backgroundColor: tertiary,         // ← color suave
          border: `2px solid ${primary}`,    // ← borde fuerte mejora contraste
          color: "#000"
        }}
      >
        {open ? (
          <ChevronUp size={22} strokeWidth={2.5} />
        ) : (
          <ChevronDown size={22} strokeWidth={2.5} />
        )}

        <span className="text-sm sm:text-base mt-[-2px]">
          Información
        </span>
      </button>

    </div>
  );
}
