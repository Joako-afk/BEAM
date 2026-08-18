// src/components/infopanel.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InfoPanel({
  text = "Aquí se encuentran los beneficios para adultos mayores separados por diferentes bloques.",
  label = "Información",
  primary = "var(--primary,#3e6a0f)",
  secondary = "var(--secondary,#2f540c)",
  textColor = "var(--text,#ffffff)",
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="relative flex flex-col items-center mb-8">
      {/* Panel desplegado */}
      {open && (
        <div
          className="
            text-center px-6 py-4 sm:py-5
            rounded-2xl shadow-md max-w-4xl w-full animate-fadeIn
          "
          style={{
            backgroundColor: primary,
            color: textColor,
          }}
        >
          <p className="text-sm sm:text-base font-medium">{text}</p>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex flex-col items-center justify-center
          font-semibold px-6 py-2
          sm:px-8 sm:py-3 rounded-b-2xl shadow-md
          transition-all -mt-2 hover:opacity-90
          ${open ? "rounded-t-none" : "rounded-2xl"}
        `}
        style={{
          backgroundColor: secondary,
          color: textColor,
          border: `1px solid ${primary}`,
        }}
      >
        {open ? (
          <ChevronUp size={22} strokeWidth={2.5} />
        ) : (
          <ChevronDown size={22} strokeWidth={2.5} />
        )}
        <span className="text-sm sm:text-base mt-[-2px]">{label}</span>
      </button>
    </div>
  );
}
