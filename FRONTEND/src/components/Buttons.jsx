// src/components/buttons.jsx
import React from "react";

export function ButtonCard({ text, icon: Icon, onClick, href, color, disabled, loading }) {
  const baseClass = `
    w-full py-3 px-2 rounded-xl
    font-bold text-base sm:text-lg text-center text-white
    shadow-md transition-transform active:scale-95 
    flex flex-col items-center justify-center gap-1
    min-h-[80px] cursor-pointer
    hover:opacity-90
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Si es enlace externo (ej: Cómo llegar)
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        style={{ backgroundColor: color || "#2563eb" }}
      >
        {Icon && <Icon size={28} strokeWidth={2} />}
        <span>{text}</span>
      </a>
    );
  }

  // Si es botón de acción (ej: Descargar / Postular)
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClass}
      style={{ backgroundColor: color || "#2563eb" }}
    >
      {loading ? (
        <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        Icon && <Icon size={28} strokeWidth={2} />
      )}
      <span>{loading ? "..." : text}</span>
    </button>
  );
}


export function ButtonNav({ text, icon: Icon, onClick, badge, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 sm:gap-3
        transition-colors hover:brightness-110
        px-4 py-2 sm:px-6 sm:py-3
        rounded-xl
        text-sm sm:text-lg font-semibold tracking-wide
        select-none text-white
        ${className}
      `}
    >
      {Icon && <Icon size={24} strokeWidth={2.5} />}
      
      {/* Texto visible */}
      <span className="hidden sm:inline">{text}</span>

      {/* Globo de notificación */}
      {badge > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            bg-red-600 text-white text-xs 
            w-6 h-6 flex items-center justify-center 
            rounded-full font-bold shadow-md
            border-2 border-white
          "
        >
          {badge}
        </span>
      )}
    </button>
  );
}