// src/components/footer.jsx
import { useState } from "react";
import { Phone, Settings } from "lucide-react";

export default function Footer({ onFontChange, onColorChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer
      className="
        fixed bottom-0 left-0 w-full
        flex justify-between items-center
        px-6 sm:px-12 py-4
        shadow-[0_-2px_8px_rgba(0,0,0,0.3)]
        z-50
      "
      style={{
        backgroundColor: "var(--secondary, #2f540c)",
        color: "var(--text, #ffffff)",
      }}
    >
      {/* Número de ayuda */}
      <div className="flex items-center gap-2">
        <Phone size={24} />
        <span className="text-base sm:text-lg font-semibold select-none">
          Ayuda: +56 9 1234 5678
        </span>
      </div>

      {/* Configuración */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center gap-2
            hover:opacity-90 transition-opacity
            px-6 py-3 rounded-xl text-base font-medium
          "
          style={{ backgroundColor: "var(--primary, #3e6a0f)", color: "var(--text, #ffffff)" }}
        >
          <Settings size={24} />
          <span className="hidden sm:inline">Configuración</span>
        </button>

        {/* Menú desplegable */}
        {isOpen && (
          <div
            className="
              absolute bottom-full right-4 mb-4
              bg-white text-gray-800
              rounded-2xl shadow-lg border border-gray-300
              p-5 w-64
              animate-fadeIn
            "
          >
            <h3 className="text-base font-semibold text-gray-700 mb-3 border-b pb-2">
              Accesibilidad
            </h3>

            {/* Tamaño de letra */}
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Tamaño de letra
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onFontChange("small")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Pequeña
                </button>
                <button
                  onClick={() => onFontChange("medium")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Mediana
                </button>
                <button
                  onClick={() => onFontChange("large")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Grande
                </button>
              </div>
            </div>

            {/* Tema de color */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Tema de color
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onColorChange("light")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Claro
                </button>
                <button
                  onClick={() => onColorChange("dark")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Oscuro
                </button>
                <button
                  onClick={() => onColorChange("contrast")}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800"
                >
                  Alto Contraste
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
